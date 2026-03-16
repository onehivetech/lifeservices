/**
 * Pricing Engine Unit Tests
 *
 * Run with: npx jest (after adding jest to devDependencies)
 * Or: npx tsx --test src/__tests__/pricingEngine.test.ts
 */

import {
  calculatePriceEstimate,
  calculateUpgradePrice,
  calculateCancellationPayout,
  calculateStandaloneAddonPrice,
  PRICING_CONSTANTS,
  type PricingInput,
} from '../services/pricingEngine'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function baseInput(overrides: Partial<PricingInput> = {}): PricingInput {
  return {
    mowableAreaM2: 350,      // Medium band (251–400 m²)
    blockType: 'INLINE',
    homeType: 'LOW_SET',
    grassLocations: ['FRONT_YARD', 'REAR_YARD'],
    hasPool: false,
    tier: 'SILVER',
    contractType: 'FLEXI',
    paymentCadence: 'MONTHLY',
    addons: [],
    ...overrides,
  }
}

function approx(a: number, b: number, tolerance = 0.05): boolean {
  return Math.abs(a - b) <= tolerance
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`)
  console.log(`  ✅ ${message}`)
}

// ─────────────────────────────────────────────
// TEST SUITES
// ─────────────────────────────────────────────

function testAreaBandPricing(): void {
  console.log('\n📏 Area Band Pricing')

  // XS band (≤150 m²) — Bronze
  const xs = calculatePriceEstimate(baseInput({ mowableAreaM2: 100, tier: 'BRONZE' }))
  assert(xs.tierBaseWeekly === 14, `XS Bronze base = $14/wk (got ${xs.tierBaseWeekly})`)

  // M band (251–400 m²) — Silver (default)
  const m = calculatePriceEstimate(baseInput())
  assert(m.tierBaseWeekly === 34, `M Silver base = $34/wk (got ${m.tierBaseWeekly})`)

  // XL band (601–800 m²) — Gold
  const xl = calculatePriceEstimate(baseInput({ mowableAreaM2: 700, tier: 'GOLD' }))
  assert(xl.tierBaseWeekly === 89, `XL Gold base = $89/wk (got ${xl.tierBaseWeekly})`)

  // XXL band (>800 m²) — Platinum
  const xxl = calculatePriceEstimate(baseInput({ mowableAreaM2: 1200, tier: 'PLATINUM' }))
  assert(xxl.tierBaseWeekly === 170, `XXL Platinum base = $170/wk (got ${xxl.tierBaseWeekly})`)

  // No area → defaults to medium
  const noArea = calculatePriceEstimate(baseInput({ mowableAreaM2: null, tier: 'SILVER' }))
  assert(noArea.tierBaseWeekly === 34, `No area defaults to M band Silver = $34/wk`)

  // Boundary: exactly 400 m² → M band
  const atBoundary = calculatePriceEstimate(baseInput({ mowableAreaM2: 400, tier: 'BRONZE' }))
  assert(atBoundary.areaBand.startsWith('M'), `400 m² maps to M band`)

  // Just over 400 m² → L band
  const overBoundary = calculatePriceEstimate(baseInput({ mowableAreaM2: 401, tier: 'BRONZE' }))
  assert(overBoundary.areaBand.startsWith('L'), `401 m² maps to L band`)
}

function testPropertyModifiers(): void {
  console.log('\n🏡 Property Modifiers')

  const base = calculatePriceEstimate(baseInput())
  assert(base.propertyModifiersWeekly === 0, 'Inline, low-set, no pool, standard zones = $0 modifier')

  const corner = calculatePriceEstimate(baseInput({ blockType: 'CORNER' }))
  assert(corner.propertyModifiersWeekly === 3, `Corner block modifier = $3/wk (got ${corner.propertyModifiersWeekly})`)

  const highSet = calculatePriceEstimate(baseInput({ homeType: 'HIGH_SET' }))
  assert(highSet.propertyModifiersWeekly === 2.50, `High set modifier = $2.50/wk`)

  const pool = calculatePriceEstimate(baseInput({ hasPool: true }))
  assert(pool.propertyModifiersWeekly === 4, `Pool modifier = $4/wk`)

  // Extra grass zones: SIDES is extra (not in FRONT_YARD, REAR_YARD standard)
  const extraZone = calculatePriceEstimate(baseInput({
    grassLocations: ['FRONT_YARD', 'REAR_YARD', 'SIDES'],
  }))
  assert(extraZone.propertyModifiersWeekly === 1.50, `1 extra zone = $1.50/wk`)

  // All modifiers stacked
  const allMods = calculatePriceEstimate(baseInput({
    blockType: 'CORNER',
    homeType: 'HIGH_SET',
    hasPool: true,
    grassLocations: ['FRONT_YARD', 'REAR_YARD', 'SIDES', 'FULL_PERIMETER'],
  }))
  // $3 + $2.50 + $4 + $3 (2 extra zones × $1.50)
  assert(allMods.propertyModifiersWeekly === 12.50, `All mods stacked = $12.50/wk (got ${allMods.propertyModifiersWeekly})`)
}

function testDiscounts(): void {
  console.log('\n💰 Discounts')

  // No discount on Flexi
  const flexi = calculatePriceEstimate(baseInput({ contractType: 'FLEXI', paymentCadence: 'MONTHLY' }))
  assert(flexi.lockInDiscountPct === 0, 'Flexi: no lock-in discount')
  assert(flexi.cadenceDiscountPct === 0, 'Flexi: no cadence discount')
  assert(flexi.mowingDiscountedWeekly === flexi.grossWeekly, 'Flexi: discounted = gross')

  // 10% lock-in on Fixed-12
  const fixed = calculatePriceEstimate(baseInput({ contractType: 'FIXED_12', paymentCadence: 'MONTHLY' }))
  assert(fixed.lockInDiscountPct === 10, 'Fixed-12: 10% lock-in')
  assert(fixed.cadenceDiscountPct === 0, 'Fixed-12 monthly: no cadence discount')
  const expectedFixed = Math.round(34 * 0.9 * 100) / 100 // $30.60
  assert(fixed.mowingDiscountedWeekly === expectedFixed, `Fixed-12 monthly discounted = $${expectedFixed} (got ${fixed.mowingDiscountedWeekly})`)

  // 10% + 10% (multiplicative) on Fixed-12 + Annual
  const annual = calculatePriceEstimate(baseInput({ contractType: 'FIXED_12', paymentCadence: 'ANNUALLY' }))
  assert(annual.lockInDiscountPct === 10, 'Fixed-12 annual: 10% lock-in')
  assert(annual.cadenceDiscountPct === 10, 'Fixed-12 annual: 10% cadence discount')
  const expectedAnnual = Math.round(34 * 0.9 * 0.9 * 100) / 100 // $27.54
  assert(annual.mowingDiscountedWeekly === expectedAnnual, `Fixed-12 annual discounted = $${expectedAnnual} (got ${annual.mowingDiscountedWeekly})`)

  // Annual cadence NOT available on Flexi (business rule — route level, but engine still calculates)
  const flexiAnnual = calculatePriceEstimate(baseInput({ contractType: 'FLEXI', paymentCadence: 'ANNUALLY' }))
  assert(flexiAnnual.cadenceDiscountPct === 0, 'Flexi annual: no cadence discount applied by engine')
}

function testPaymentCadences(): void {
  console.log('\n📅 Payment Cadences')

  // M Silver Flexi: $34/wk
  const weekly = calculatePriceEstimate(baseInput({ paymentCadence: 'WEEKLY' }))
  assert(weekly.paymentPerCadence === 34, `Weekly = $34.00 (got ${weekly.paymentPerCadence})`)

  const fortnightly = calculatePriceEstimate(baseInput({ paymentCadence: 'FORTNIGHTLY' }))
  assert(fortnightly.paymentPerCadence === 68, `Fortnightly = $68.00`)

  const monthly = calculatePriceEstimate(baseInput({ paymentCadence: 'MONTHLY' }))
  const expectedMonthly = Math.round((34 * 52 / 12) * 100) / 100
  assert(monthly.paymentPerCadence === expectedMonthly, `Monthly = $${expectedMonthly} (got ${monthly.paymentPerCadence})`)

  // Fixed-12 + annual: 34 × 0.9 × 0.9 = 27.54/wk × 52 = 1432.08/yr
  const annual = calculatePriceEstimate(baseInput({ contractType: 'FIXED_12', paymentCadence: 'ANNUALLY' }))
  const expectedAnnual = Math.round(34 * 0.81 * 52 * 100) / 100
  assert(annual.paymentPerCadence === expectedAnnual, `Annual = $${expectedAnnual} (got ${annual.paymentPerCadence})`)
}

function testAddOnPricing(): void {
  console.log('\n🔧 Add-On Pricing')

  // Pest control one-off
  const pestOneOff = calculatePriceEstimate(baseInput({
    addons: [{ addonType: 'PEST_CONTROL', frequency: 'ONE_OFF' }],
  }))
  const pestItem = pestOneOff.addonsBreakdown[0]
  assert(pestItem.isOneOff === true, 'Pest one-off is flagged as one-off')
  assert(pestItem.visitPrice === 280, `Pest visit price = $280`)
  assert(pestItem.weeklyEquivalent === 0, 'Pest one-off: $0 weekly equiv')
  assert(pestOneOff.addonsOneOffTotal === 280, `Pest one-off total = $280`)

  // Pest control monthly (12 payments)
  const pestMonthly = calculatePriceEstimate(baseInput({
    addons: [{ addonType: 'PEST_CONTROL', frequency: 'MONTHLY' }],
  }))
  const pestMItem = pestMonthly.addonsBreakdown[0]
  const expectedPestWeekly = Math.round((280 * 12 / 52) * 100) / 100
  assert(pestMItem.weeklyEquivalent === expectedPestWeekly, `Pest monthly weekly equiv = $${expectedPestWeekly}`)

  // Gutter cleaning — low set 6-monthly
  const gutterLow = calculatePriceEstimate(baseInput({
    homeType: 'LOW_SET',
    addons: [{ addonType: 'GUTTER_CLEANING', frequency: 'EVERY_6_MONTHS' }],
  }))
  const gutterItem = gutterLow.addonsBreakdown[0]
  assert(gutterItem.visitPrice === 140, `Low set gutter = $140/visit`)
  const expectedGutterWeekly = Math.round((140 * 2 / 52) * 100) / 100
  assert(gutterItem.weeklyEquivalent === expectedGutterWeekly, `Gutter 6-monthly weekly = $${expectedGutterWeekly}`)

  // Gutter cleaning — high set annually
  const gutterHigh = calculatePriceEstimate(baseInput({
    homeType: 'HIGH_SET',
    addons: [{ addonType: 'GUTTER_CLEANING', frequency: 'ANNUALLY' }],
  }))
  const gutterHighItem = gutterHigh.addonsBreakdown[0]
  assert(gutterHighItem.visitPrice === 210, `High set gutter = $210/visit`)

  // Pressure washing — M band quarterly
  const pressure = calculatePriceEstimate(baseInput({
    addons: [{ addonType: 'PRESSURE_WASHING', frequency: 'EVERY_3_MONTHS' }],
  }))
  const pressureItem = pressure.addonsBreakdown[0]
  assert(pressureItem.visitPrice === 190, `M band pressure wash = $190/visit`)
  const expectedPressureWeekly = Math.round((190 * 4 / 52) * 100) / 100
  assert(pressureItem.weeklyEquivalent === expectedPressureWeekly, `Pressure quarterly weekly = $${expectedPressureWeekly}`)

  // Gardening — 30 min block, every visit (Silver = 13 visits/yr)
  const gardening = calculatePriceEstimate(baseInput({
    tier: 'SILVER',
    addons: [{ addonType: 'GARDENING', frequency: 'EVERY_VISIT', blockSizeMins: 30 }],
  }))
  const gardenItem = gardening.addonsBreakdown[0]
  assert(gardenItem.visitPrice === 66, `30 min gardening block = $66`) // 30 × $2.20
  const silverVisitsPerYear = 52 / 4 // 13
  const expectedGardenWeekly = Math.round((66 * silverVisitsPerYear / 52) * 100) / 100
  assert(gardenItem.weeklyEquivalent === expectedGardenWeekly, `Gardening every-visit Silver = $${expectedGardenWeekly}/wk`)

  // Handyman — monthly
  const handyman = calculatePriceEstimate(baseInput({
    addons: [{ addonType: 'HANDYMAN', frequency: 'MONTHLY' }],
  }))
  const handyItem = handyman.addonsBreakdown[0]
  assert(handyItem.visitPrice === 110, `Handyman = $110/hr`)
  const expectedHandyWeekly = Math.round((110 * 12 / 52) * 100) / 100
  assert(handyItem.weeklyEquivalent === expectedHandyWeekly, `Handyman monthly weekly equiv = $${expectedHandyWeekly}`)
}

function testTotals(): void {
  console.log('\n🧮 Totals Calculation')

  // Silver Flexi monthly + gutter 6-monthly + pest one-off
  const complex = calculatePriceEstimate(baseInput({
    contractType: 'FLEXI',
    paymentCadence: 'MONTHLY',
    addons: [
      { addonType: 'GUTTER_CLEANING', frequency: 'EVERY_6_MONTHS' },
      { addonType: 'PEST_CONTROL', frequency: 'ONE_OFF' },
    ],
  }))

  const gutterWeekly = Math.round((140 * 2 / 52) * 100) / 100
  const expectedTotalWeekly = Math.round((34 + gutterWeekly) * 100) / 100
  assert(
    approx(complex.totalWeekly, expectedTotalWeekly),
    `Total weekly (mowing + gutter recurring) ≈ $${expectedTotalWeekly} (got ${complex.totalWeekly})`
  )
  assert(complex.addonsOneOffTotal === 280, `One-off pest = $280 in one-off bucket`)

  // Annual total includes one-offs
  const expectedAnnual = Math.round(expectedTotalWeekly * 52 * 100) / 100
  assert(
    approx(complex.totalAnnual, expectedAnnual),
    `Total annual (excl one-offs) ≈ $${expectedAnnual}`
  )
  assert(
    approx(complex.totalAnnualWithOneOffs, expectedAnnual + 280),
    `Total annual (incl pest one-off) ≈ $${expectedAnnual + 280}`
  )

  // Multiple add-ons recurring weekly sums correctly
  const multiAddon = calculatePriceEstimate(baseInput({
    addons: [
      { addonType: 'PEST_CONTROL', frequency: 'MONTHLY' },
      { addonType: 'PRESSURE_WASHING', frequency: 'EVERY_6_MONTHS' },
      { addonType: 'HANDYMAN', frequency: 'EVERY_3_MONTHS' },
    ],
  }))
  const pestW = Math.round((280 * 12 / 52) * 100) / 100
  const pressW = Math.round((190 * 2 / 52) * 100) / 100
  const handyW = Math.round((110 * 4 / 52) * 100) / 100
  const expectedAddonsW = Math.round((pestW + pressW + handyW) * 100) / 100
  assert(
    approx(multiAddon.addonsRecurringWeekly, expectedAddonsW, 0.10),
    `Multi-addon recurring weekly ≈ $${expectedAddonsW} (got ${multiAddon.addonsRecurringWeekly})`
  )
}

function testUpgradePricing(): void {
  console.log('\n⬆️  Upgrade Pricing')

  const currentInput = baseInput({ tier: 'BRONZE', contractType: 'FIXED_12', paymentCadence: 'MONTHLY' })
  const upgrade = calculateUpgradePrice(currentInput, 'SILVER')

  assert(upgrade.currentTier === 'BRONZE', 'Current tier = Bronze')
  assert(upgrade.newTier === 'SILVER', 'New tier = Silver')
  assert(upgrade.newDiscountedWeekly > upgrade.currentDiscountedWeekly, 'New price > old price')

  const expectedBronzeDiscounted = Math.round(21 * 0.9 * 100) / 100
  const expectedSilverDiscounted = Math.round(34 * 0.9 * 100) / 100
  assert(upgrade.currentDiscountedWeekly === expectedBronzeDiscounted, `Bronze discounted = $${expectedBronzeDiscounted}`)
  assert(upgrade.newDiscountedWeekly === expectedSilverDiscounted, `Silver discounted = $${expectedSilverDiscounted}`)
  assert(
    approx(upgrade.weeklyDifference, expectedSilverDiscounted - expectedBronzeDiscounted),
    `Upgrade weekly diff = $${(expectedSilverDiscounted - expectedBronzeDiscounted).toFixed(2)}`
  )
}

function testCancellationPayout(): void {
  console.log('\n❌ Cancellation Payout')

  const estimate = calculatePriceEstimate(baseInput({ contractType: 'FIXED_12', paymentCadence: 'MONTHLY' }))
  const startDate = new Date('2026-01-01')
  // Cancel 6 months in
  const cancelDate = new Date('2026-07-01')
  const payout = calculateCancellationPayout(estimate, startDate, cancelDate)

  // ~26 weeks remaining
  assert(payout.weeksRemaining > 25 && payout.weeksRemaining < 27, `Weeks remaining ≈ 26 (got ${payout.weeksRemaining})`)
  assert(payout.weeklyAmount === estimate.mowingDiscountedWeekly, 'Payout uses discounted weekly rate')
  assert(payout.payoutTotal > 0, 'Payout total > 0')
  assert(approx(payout.payoutTotal, payout.weeksRemaining * estimate.mowingDiscountedWeekly, 0.50), 'Payout = weeks × weekly rate')

  // Full cancellation at start = full year payout
  const immediatePayout = calculateCancellationPayout(estimate, startDate, startDate)
  assert(approx(immediatePayout.weeksRemaining, 52, 1), 'Immediate cancel = ~52 weeks remaining')
}

function testStandaloneAddon(): void {
  console.log('\n🔌 Standalone Add-On Pricing')

  const standalone = calculateStandaloneAddonPrice(
    { addonType: 'GUTTER_CLEANING', frequency: 'ANNUALLY' },
    350,
    'LOW_SET'
  )
  assert(standalone.visitPrice === 140, `Standalone gutter (low set) = $140/visit`)
  assert(standalone.visitsPerYear === 1, 'Annually = 1 visit/year')
  const expectedWeekly = Math.round((140 / 52) * 100) / 100
  assert(standalone.weeklyEquivalent === expectedWeekly, `Standalone gutter annual weekly = $${expectedWeekly}`)
}

function testPricingConstants(): void {
  console.log('\n📊 Pricing Constants Export')

  assert(PRICING_CONSTANTS.LOCK_IN_DISCOUNT_PCT === 10, 'Lock-in discount = 10%')
  assert(PRICING_CONSTANTS.ANNUAL_CADENCE_DISCOUNT_PCT === 10, 'Annual cadence discount = 10%')
  assert(PRICING_CONSTANTS.GARDENING_RATE_PER_MIN === 2.20, 'Gardening rate = $2.20/min')
  assert(PRICING_CONSTANTS.AREA_BANDS.length === 6, '6 area bands defined')
  assert(Object.keys(PRICING_CONSTANTS.TIER_INFO).length === 4, '4 tiers defined')
  assert(PRICING_CONSTANTS.GARDENING_BLOCK_SIZES[15] === 33, '15-min block = $33')
  assert(PRICING_CONSTANTS.GARDENING_BLOCK_SIZES[60] === 132, '60-min block = $132')
}

// ─────────────────────────────────────────────
// RUN ALL TESTS
// ─────────────────────────────────────────────

let passed = 0
let failed = 0

function runSuite(name: string, fn: () => void): void {
  try {
    fn()
    passed++
  } catch (err) {
    failed++
    console.error(`  ❌ Suite "${name}" failed:`, (err as Error).message)
  }
}

console.log('🌿 LIFE Services — Pricing Engine Tests\n')

runSuite('Area Band Pricing', testAreaBandPricing)
runSuite('Property Modifiers', testPropertyModifiers)
runSuite('Discounts', testDiscounts)
runSuite('Payment Cadences', testPaymentCadences)
runSuite('Add-On Pricing', testAddOnPricing)
runSuite('Totals Calculation', testTotals)
runSuite('Upgrade Pricing', testUpgradePricing)
runSuite('Cancellation Payout', testCancellationPayout)
runSuite('Standalone Add-On', testStandaloneAddon)
runSuite('Pricing Constants', testPricingConstants)

console.log(`\n${'─'.repeat(40)}`)
console.log(`Results: ${passed} suites passed, ${failed} failed`)

if (failed > 0) {
  process.exit(1)
}
