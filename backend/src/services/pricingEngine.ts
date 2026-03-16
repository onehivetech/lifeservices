/**
 * LIFE Services — Pricing Engine
 *
 * All prices are expressed as AUD weekly equivalents for fair cross-tier comparison.
 * Actual payment amounts are derived by converting to the chosen cadence.
 *
 * Pricing model:
 *   1. Area band → tier base weekly price
 *   2. Property modifiers (corner, high-set, pool, grass zones)
 *   3. Discounts (12-month lock-in 10%, annual cadence additional 10%)
 *   4. Add-on weekly equivalents (recurring) + one-off totals
 *   5. Convert to chosen payment cadence amount
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type BlockType = 'CORNER' | 'INLINE'
export type HomeType = 'LOW_SET' | 'HIGH_SET'
export type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
export type ContractType = 'FIXED_12' | 'FLEXI'
export type PaymentCadence = 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY' | 'ANNUALLY'
export type AddonType = 'PEST_CONTROL' | 'PRESSURE_WASHING' | 'GUTTER_CLEANING' | 'GARDENING' | 'HANDYMAN'
export type AddonFrequency =
  | 'ONE_OFF'
  | 'EVERY_VISIT'
  | 'EVERY_SECOND_VISIT'
  | 'EVERY_3_MONTHS'
  | 'EVERY_6_MONTHS'
  | 'ANNUALLY'
  | 'MONTHLY'
  | 'QUARTERLY'

export interface AddonInput {
  addonType: AddonType
  frequency: AddonFrequency
  blockSizeMins?: number // gardening only: 15 | 30 | 45 | 60
}

export interface PricingInput {
  // Property profile
  mowableAreaM2?: number | null
  blockType?: BlockType | null
  homeType?: HomeType | null
  grassLocations?: string[]
  hasPool?: boolean

  // Subscription choices
  tier: Tier
  contractType: ContractType
  paymentCadence: PaymentCadence

  // Add-ons (only enabled ones should be passed)
  addons?: AddonInput[]
}

export interface AddonPriceItem {
  addonType: AddonType
  frequency: AddonFrequency
  blockSizeMins?: number
  isOneOff: boolean
  visitPrice: number          // price per service visit
  visitsPerYear: number       // 0 for one-off
  weeklyEquivalent: number    // 0 for one-off
  oneOffAmount: number        // 0 for recurring
  label: string
  frequencyLabel: string
}

export interface PriceEstimate {
  // Mowing base (weekly equivalents, before discounts)
  areaBand: string
  tierBaseWeekly: number
  propertyModifiersWeekly: number
  propertyModifiersBreakdown: string[]
  grossWeekly: number                  // base + modifiers

  // Discounts
  lockInDiscountPct: number            // 0 or 10
  cadenceDiscountPct: number           // 0 or 10
  totalDiscountPct: number
  lockInDiscountAmount: number
  cadenceDiscountAmount: number
  totalDiscountAmount: number

  // Discounted mowing weekly
  mowingDiscountedWeekly: number

  // Visit info
  mowingVisitsPerYear: number
  mowingVisitPrice: number             // cost per single mow visit

  // Add-ons
  addonsBreakdown: AddonPriceItem[]
  addonsRecurringWeekly: number        // sum of recurring add-on weekly equivs
  addonsOneOffTotal: number            // sum of one-off charges

  // Grand totals (mowing + recurring add-ons)
  totalWeekly: number
  totalMonthly: number                 // × 52/12
  totalAnnual: number                  // × 52
  totalAnnualWithOneOffs: number       // totalAnnual + one-off charges

  // Scheduled payment
  paymentPerCadence: number
  cadenceLabel: string

  // Tier summary
  tierLabel: string
  tierCadenceDescription: string
}

// ─────────────────────────────────────────────
// AREA BANDS
// ─────────────────────────────────────────────

interface AreaBand {
  label: string
  maxM2: number
  // Base weekly price per tier (before modifiers/discounts)
  prices: Record<Tier, number>
}

/**
 * Area bands based on mowable area.
 * Prices represent a fair, market-competitive weekly equivalent
 * for a Brisbane suburban property at each service tier.
 *
 * Bronze:   every 6 weeks  (~8.7 visits/yr)
 * Silver:   every 4 weeks  (~13 visits/yr)
 * Gold:     monthly (Apr-Sep) / 3-weekly (Oct-Mar) (~14.7 visits/yr)
 * Platinum: 3-weekly (Apr-Sep) / fortnightly (Oct-Mar) (~21.7 visits/yr)
 */
const AREA_BANDS: AreaBand[] = [
  {
    label: 'XS (≤150 m²)',
    maxM2: 150,
    prices: { BRONZE: 14, SILVER: 22, GOLD: 34, PLATINUM: 52 },
  },
  {
    label: 'S (151–250 m²)',
    maxM2: 250,
    prices: { BRONZE: 17, SILVER: 27, GOLD: 42, PLATINUM: 64 },
  },
  {
    label: 'M (251–400 m²)',
    maxM2: 400,
    prices: { BRONZE: 21, SILVER: 34, GOLD: 52, PLATINUM: 79 },
  },
  {
    label: 'L (401–600 m²)',
    maxM2: 600,
    prices: { BRONZE: 28, SILVER: 45, GOLD: 69, PLATINUM: 105 },
  },
  {
    label: 'XL (601–800 m²)',
    maxM2: 800,
    prices: { BRONZE: 36, SILVER: 58, GOLD: 89, PLATINUM: 135 },
  },
  {
    label: 'XXL (>800 m²)',
    maxM2: Infinity,
    prices: { BRONZE: 46, SILVER: 73, GOLD: 112, PLATINUM: 170 },
  },
]

// Default band (medium) when no area data available
const DEFAULT_BAND = AREA_BANDS[2]

// ─────────────────────────────────────────────
// TIER CONSTANTS
// ─────────────────────────────────────────────

export const TIER_INFO: Record<
  Tier,
  { label: string; visitsPerYear: number; cadenceDesc: string; color: string }
> = {
  BRONZE: {
    label: 'Bronze',
    visitsPerYear: 52 / 6,     // every 6 weeks ≈ 8.67
    cadenceDesc: 'Every 6 weeks, year-round',
    color: '#92400E',
  },
  SILVER: {
    label: 'Silver',
    visitsPerYear: 52 / 4,     // every 4 weeks = 13
    cadenceDesc: 'Every 4 weeks, year-round',
    color: '#4B5563',
  },
  GOLD: {
    label: 'Gold',
    // Monthly (4.33wk) Apr-Sep + every 3wk Oct-Mar ≈ 6 + 8.67 = 14.67
    visitsPerYear: 26 / 4.33 + 26 / 3,
    cadenceDesc: 'Monthly (Apr–Sep) · Every 3 weeks (Oct–Mar)',
    color: '#B45309',
  },
  PLATINUM: {
    label: 'Platinum',
    // Every 3wk Apr-Sep + fortnightly Oct-Mar ≈ 8.67 + 13 = 21.67
    visitsPerYear: 26 / 3 + 26 / 2,
    cadenceDesc: 'Every 3 weeks (Apr–Sep) · Every 2 weeks (Oct–Mar)',
    color: '#6D28D9',
  },
}

// ─────────────────────────────────────────────
// DISCOUNT RULES
// ─────────────────────────────────────────────

const LOCK_IN_DISCOUNT_PCT = 10   // 12-month lock-in
const ANNUAL_CADENCE_DISCOUNT_PCT = 10  // annual payment (12-month only)

// ─────────────────────────────────────────────
// ADD-ON VISIT PRICES
// ─────────────────────────────────────────────

/** Pest control — flat rate, doesn't vary by area (whole-home spray) */
const PEST_VISIT_PRICE = 280

/**
 * Pressure washing visit prices by area band index.
 * More surface area = longer job.
 */
const PRESSURE_VISIT_PRICES: Record<number, number> = {
  0: 120,  // XS
  1: 150,  // S
  2: 190,  // M
  3: 240,  // L
  4: 300,  // XL
  5: 360,  // XXL
}

/**
 * Gutter cleaning visit prices.
 * High set homes cost more (ladder height, roof pitch complexity).
 */
const GUTTER_VISIT_PRICES = {
  LOW_SET: 140,
  HIGH_SET: 210,
}

/** Gardening blocks: $2.20/min (as per spec) */
const GARDENING_RATE_PER_MIN = 2.20

const GARDENING_BLOCK_SIZES: Record<number, number> = {
  15: 15 * GARDENING_RATE_PER_MIN,  // $33
  30: 30 * GARDENING_RATE_PER_MIN,  // $66
  45: 45 * GARDENING_RATE_PER_MIN,  // $99
  60: 60 * GARDENING_RATE_PER_MIN,  // $132
}

/** Handyman hourly rate */
const HANDYMAN_HOURLY = 110

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function getAreaBand(mowableAreaM2: number | null | undefined): { band: AreaBand; index: number } {
  if (!mowableAreaM2 || mowableAreaM2 <= 0) {
    return { band: DEFAULT_BAND, index: 2 }
  }
  const index = AREA_BANDS.findIndex((b) => mowableAreaM2 <= b.maxM2)
  const resolvedIndex = index === -1 ? AREA_BANDS.length - 1 : index
  return { band: AREA_BANDS[resolvedIndex], index: resolvedIndex }
}

/**
 * Frequency → visits per year mapping for non-mowing add-ons.
 * EVERY_VISIT and EVERY_SECOND_VISIT depend on the mowing tier.
 */
function addonVisitsPerYear(
  frequency: AddonFrequency,
  tier: Tier,
): number {
  const mowingVisits = TIER_INFO[tier].visitsPerYear
  switch (frequency) {
    case 'ONE_OFF':           return 0
    case 'EVERY_VISIT':       return mowingVisits
    case 'EVERY_SECOND_VISIT':return mowingVisits / 2
    case 'MONTHLY':           return 12
    case 'QUARTERLY':
    case 'EVERY_3_MONTHS':    return 4
    case 'EVERY_6_MONTHS':    return 2
    case 'ANNUALLY':          return 1
    default:                  return 0
  }
}

function frequencyLabel(frequency: AddonFrequency): string {
  switch (frequency) {
    case 'ONE_OFF':           return 'One-off'
    case 'EVERY_VISIT':       return 'Every mowing visit'
    case 'EVERY_SECOND_VISIT':return 'Every 2nd mowing visit'
    case 'MONTHLY':           return 'Monthly'
    case 'QUARTERLY':
    case 'EVERY_3_MONTHS':    return 'Every 3 months'
    case 'EVERY_6_MONTHS':    return 'Every 6 months'
    case 'ANNUALLY':          return 'Annually'
    default:                  return frequency
  }
}

/**
 * Convert a weekly equivalent price to the chosen payment cadence amount.
 * Note: weekly equiv × 52 gives the annual total.
 */
function weeklyToPaymentAmount(weeklyEquiv: number, cadence: PaymentCadence): number {
  switch (cadence) {
    case 'WEEKLY':      return weeklyEquiv
    case 'FORTNIGHTLY': return weeklyEquiv * 2
    case 'MONTHLY':     return round2((weeklyEquiv * 52) / 12)
    case 'ANNUALLY':    return weeklyEquiv * 52
  }
}

function cadenceLabel(cadence: PaymentCadence): string {
  switch (cadence) {
    case 'WEEKLY':      return 'per week'
    case 'FORTNIGHTLY': return 'per fortnight'
    case 'MONTHLY':     return 'per month'
    case 'ANNUALLY':    return 'per year (paid upfront)'
  }
}

// ─────────────────────────────────────────────
// PROPERTY MODIFIERS
// ─────────────────────────────────────────────

interface ModifierResult {
  totalWeekly: number
  breakdown: string[]
}

function calculatePropertyModifiers(
  blockType: BlockType | null | undefined,
  homeType: HomeType | null | undefined,
  grassLocations: string[],
  hasPool: boolean,
): ModifierResult {
  let total = 0
  const breakdown: string[] = []

  if (blockType === 'CORNER') {
    total += 3
    breakdown.push('Corner block +$3.00/wk')
  }

  if (homeType === 'HIGH_SET') {
    total += 2.50
    breakdown.push('High set home +$2.50/wk')
  }

  if (hasPool) {
    total += 4
    breakdown.push('Pool surrounds +$4.00/wk')
  }

  // Base assumes front + rear. Additional zones cost extra.
  const STANDARD_ZONES = ['FRONT_YARD', 'REAR_YARD']
  const extraZones = grassLocations.filter((z) => !STANDARD_ZONES.includes(z))
  if (extraZones.length > 0) {
    const extraCost = extraZones.length * 1.50
    total += extraCost
    breakdown.push(`${extraZones.length} extra grass zone(s) +$${extraCost.toFixed(2)}/wk`)
  }

  return { totalWeekly: round2(total), breakdown }
}

// ─────────────────────────────────────────────
// ADD-ON PRICING
// ─────────────────────────────────────────────

function calculateAddonPrice(
  addon: AddonInput,
  tier: Tier,
  bandIndex: number,
  homeType: HomeType | null | undefined,
): AddonPriceItem {
  const isOneOff = addon.frequency === 'ONE_OFF'
  const visits = addonVisitsPerYear(addon.frequency, tier)
  let visitPrice = 0
  let label = ''

  switch (addon.addonType) {
    case 'PEST_CONTROL': {
      visitPrice = PEST_VISIT_PRICE
      label = 'Pest Control'
      break
    }

    case 'PRESSURE_WASHING': {
      visitPrice = PRESSURE_VISIT_PRICES[bandIndex] ?? PRESSURE_VISIT_PRICES[2]
      label = 'Pressure Washing'
      break
    }

    case 'GUTTER_CLEANING': {
      visitPrice = homeType === 'HIGH_SET'
        ? GUTTER_VISIT_PRICES.HIGH_SET
        : GUTTER_VISIT_PRICES.LOW_SET
      label = 'Gutter Cleaning'
      break
    }

    case 'GARDENING': {
      const mins = addon.blockSizeMins && addon.blockSizeMins in GARDENING_BLOCK_SIZES
        ? addon.blockSizeMins
        : 30
      visitPrice = GARDENING_BLOCK_SIZES[mins]
      label = `Gardening (${mins} min block)`
      break
    }

    case 'HANDYMAN': {
      visitPrice = HANDYMAN_HOURLY
      label = 'Handyman (1 hr)'
      break
    }
  }

  const weeklyEquivalent = isOneOff ? 0 : round2((visitPrice * visits) / 52)
  const oneOffAmount = isOneOff ? visitPrice : 0

  return {
    addonType: addon.addonType,
    frequency: addon.frequency,
    blockSizeMins: addon.blockSizeMins,
    isOneOff,
    visitPrice,
    visitsPerYear: round2(visits),
    weeklyEquivalent,
    oneOffAmount,
    label,
    frequencyLabel: frequencyLabel(addon.frequency),
  }
}

// ─────────────────────────────────────────────
// MAIN EXPORT: calculatePriceEstimate
// ─────────────────────────────────────────────

export function calculatePriceEstimate(input: PricingInput): PriceEstimate {
  const {
    mowableAreaM2,
    blockType,
    homeType,
    grassLocations = [],
    hasPool = false,
    tier,
    contractType,
    paymentCadence,
    addons = [],
  } = input

  // ── 1. Area band lookup ──
  const { band, index: bandIndex } = getAreaBand(mowableAreaM2)
  const tierBaseWeekly = band.prices[tier]

  // ── 2. Property modifiers ──
  const modifiers = calculatePropertyModifiers(blockType, homeType, grassLocations, hasPool)
  const grossWeekly = round2(tierBaseWeekly + modifiers.totalWeekly)

  // ── 3. Discounts ──
  const lockInDiscountPct = contractType === 'FIXED_12' ? LOCK_IN_DISCOUNT_PCT : 0
  const cadenceDiscountPct = contractType === 'FIXED_12' && paymentCadence === 'ANNUALLY'
    ? ANNUAL_CADENCE_DISCOUNT_PCT
    : 0
  const totalDiscountPct = lockInDiscountPct + cadenceDiscountPct

  // Discounts stack multiplicatively for accuracy
  // e.g. 10% then 10% = 1 - (0.9 × 0.9) = 19% total reduction
  const discountMultiplier =
    (1 - lockInDiscountPct / 100) * (1 - cadenceDiscountPct / 100)

  const mowingDiscountedWeekly = round2(grossWeekly * discountMultiplier)
  const lockInDiscountAmount = round2(grossWeekly * (lockInDiscountPct / 100))
  const afterLockIn = round2(grossWeekly * (1 - lockInDiscountPct / 100))
  const cadenceDiscountAmount = round2(afterLockIn * (cadenceDiscountPct / 100))
  const totalDiscountAmount = round2(grossWeekly - mowingDiscountedWeekly)

  // ── 4. Add-ons ──
  const addonsBreakdown = addons.map((a) =>
    calculateAddonPrice(a, tier, bandIndex, homeType)
  )
  const addonsRecurringWeekly = round2(
    addonsBreakdown.reduce((sum, a) => sum + a.weeklyEquivalent, 0)
  )
  const addonsOneOffTotal = round2(
    addonsBreakdown.reduce((sum, a) => sum + a.oneOffAmount, 0)
  )

  // ── 5. Grand totals ──
  const totalWeekly = round2(mowingDiscountedWeekly + addonsRecurringWeekly)
  const totalMonthly = round2((totalWeekly * 52) / 12)
  const totalAnnual = round2(totalWeekly * 52)
  const totalAnnualWithOneOffs = round2(totalAnnual + addonsOneOffTotal)

  // ── 6. Scheduled payment amount ──
  const paymentPerCadence = round2(weeklyToPaymentAmount(totalWeekly, paymentCadence))

  // ── 7. Visit info (for display) ──
  const tierInfo = TIER_INFO[tier]
  const mowingVisitsPerYear = round2(tierInfo.visitsPerYear)
  const mowingVisitPrice = round2((grossWeekly * discountMultiplier * 52) / mowingVisitsPerYear)

  return {
    areaBand: band.label,
    tierBaseWeekly,
    propertyModifiersWeekly: modifiers.totalWeekly,
    propertyModifiersBreakdown: modifiers.breakdown,
    grossWeekly,

    lockInDiscountPct,
    cadenceDiscountPct,
    totalDiscountPct,
    lockInDiscountAmount,
    cadenceDiscountAmount,
    totalDiscountAmount,

    mowingDiscountedWeekly,
    mowingVisitsPerYear,
    mowingVisitPrice,

    addonsBreakdown,
    addonsRecurringWeekly,
    addonsOneOffTotal,

    totalWeekly,
    totalMonthly,
    totalAnnual,
    totalAnnualWithOneOffs,

    paymentPerCadence,
    cadenceLabel: cadenceLabel(paymentCadence),

    tierLabel: tierInfo.label,
    tierCadenceDescription: tierInfo.cadenceDesc,
  }
}

// ─────────────────────────────────────────────
// UPGRADE PRICING
// Used when a customer upgrades from one tier to another mid-contract
// ─────────────────────────────────────────────

export interface UpgradePricingResult {
  currentTier: Tier
  newTier: Tier
  currentDiscountedWeekly: number
  newDiscountedWeekly: number
  weeklyDifference: number
  newPaymentPerCadence: number
}

export function calculateUpgradePrice(
  currentInput: PricingInput,
  newTier: Tier,
): UpgradePricingResult {
  const current = calculatePriceEstimate(currentInput)
  const newEstimate = calculatePriceEstimate({ ...currentInput, tier: newTier })

  return {
    currentTier: currentInput.tier,
    newTier,
    currentDiscountedWeekly: current.mowingDiscountedWeekly,
    newDiscountedWeekly: newEstimate.mowingDiscountedWeekly,
    weeklyDifference: round2(
      newEstimate.mowingDiscountedWeekly - current.mowingDiscountedWeekly
    ),
    newPaymentPerCadence: newEstimate.paymentPerCadence,
  }
}

// ─────────────────────────────────────────────
// CANCELLATION PAYOUT CALCULATION (FIXED_12 only)
// ─────────────────────────────────────────────

export interface CancellationPayoutResult {
  weeksRemaining: number
  weeklyAmount: number
  payoutTotal: number
  effectiveCancellationDate: Date
}

export function calculateCancellationPayout(
  estimate: PriceEstimate,
  startDate: Date,
  cancellationDate: Date,
): CancellationPayoutResult {
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

  const msRemaining = endDate.getTime() - cancellationDate.getTime()
  const weeksRemaining = Math.max(0, msRemaining / (7 * 24 * 60 * 60 * 1000))

  const payoutTotal = round2(weeksRemaining * estimate.mowingDiscountedWeekly)

  return {
    weeksRemaining: round2(weeksRemaining),
    weeklyAmount: estimate.mowingDiscountedWeekly,
    payoutTotal,
    effectiveCancellationDate: cancellationDate,
  }
}

// ─────────────────────────────────────────────
// STANDALONE ADD-ON PRICING (no mowing subscription)
// ─────────────────────────────────────────────

/**
 * Calculate add-on pricing for standalone plans (no mowing subscription).
 * Uses Silver tier visit frequency as the default "every visit" frequency.
 */
export function calculateStandaloneAddonPrice(
  addon: AddonInput,
  mowableAreaM2: number | null | undefined,
  homeType: HomeType | null | undefined,
): AddonPriceItem {
  const { index: bandIndex } = getAreaBand(mowableAreaM2)
  // Default to SILVER for EVERY_VISIT frequency on standalone
  return calculateAddonPrice(addon, 'SILVER', bandIndex, homeType)
}

// ─────────────────────────────────────────────
// CONSTANTS EXPORT (for frontend use)
// ─────────────────────────────────────────────

export const PRICING_CONSTANTS = {
  LOCK_IN_DISCOUNT_PCT,
  ANNUAL_CADENCE_DISCOUNT_PCT,
  GARDENING_RATE_PER_MIN,
  GARDENING_BLOCK_SIZES,
  HANDYMAN_HOURLY,
  PEST_VISIT_PRICE,
  AREA_BANDS: AREA_BANDS.map((b) => ({
    label: b.label,
    maxM2: b.maxM2,
    prices: b.prices,
  })),
  TIER_INFO,
}
