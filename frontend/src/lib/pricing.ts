/**
 * LIFE Services — Frontend Pricing Engine (mirrors backend pricingEngine.ts)
 *
 * Used for instant client-side price calculation in the wizard Step 6 reveal.
 * The backend /api/pricing/estimate is the canonical source; this is a
 * convenience mirror for zero-latency display and snapshot saving.
 */

import type {
  Tier,
  ContractType,
  PaymentCadence,
  AddonType,
  AddonFrequency,
  BlockType,
  HomeType,
  AddonSelection,
} from '@/types'

// ─────────────────────────────────────────────
// INPUT / OUTPUT TYPES
// ─────────────────────────────────────────────

export interface PricingInput {
  mowableAreaM2?: number | null
  blockType?: BlockType | null
  homeType?: HomeType | null
  grassLocations?: string[]
  hasPool?: boolean
  tier: Tier
  contractType: ContractType
  paymentCadence: PaymentCadence
  addons?: AddonInput[]
}

export interface AddonInput {
  addonType: AddonType
  frequency: AddonFrequency
  blockSizeMins?: number
}

export interface AddonPriceItem {
  addonType: AddonType
  frequency: AddonFrequency
  blockSizeMins?: number
  isOneOff: boolean
  visitPrice: number
  visitsPerYear: number
  weeklyEquivalent: number
  oneOffAmount: number
  label: string
  frequencyLabel: string
}

export interface PriceEstimate {
  areaBand: string
  tierBaseWeekly: number
  propertyModifiersWeekly: number
  propertyModifiersBreakdown: string[]
  grossWeekly: number

  lockInDiscountPct: number
  cadenceDiscountPct: number
  totalDiscountPct: number
  lockInDiscountAmount: number
  cadenceDiscountAmount: number
  totalDiscountAmount: number

  mowingDiscountedWeekly: number
  mowingVisitsPerYear: number
  mowingVisitPrice: number

  addonsBreakdown: AddonPriceItem[]
  addonsRecurringWeekly: number
  addonsOneOffTotal: number

  totalWeekly: number
  totalMonthly: number
  totalAnnual: number
  totalAnnualWithOneOffs: number

  paymentPerCadence: number
  cadenceLabel: string

  tierLabel: string
  tierCadenceDescription: string
}

// ─────────────────────────────────────────────
// AREA BANDS
// ─────────────────────────────────────────────

interface AreaBand {
  label: string
  maxM2: number
  prices: Record<Tier, number>
}

const AREA_BANDS: AreaBand[] = [
  { label: 'XS (≤150 m²)',   maxM2: 150,      prices: { BRONZE: 14, SILVER: 22, GOLD: 34, PLATINUM: 52 } },
  { label: 'S (151–250 m²)', maxM2: 250,      prices: { BRONZE: 17, SILVER: 27, GOLD: 42, PLATINUM: 64 } },
  { label: 'M (251–400 m²)', maxM2: 400,      prices: { BRONZE: 21, SILVER: 34, GOLD: 52, PLATINUM: 79 } },
  { label: 'L (401–600 m²)', maxM2: 600,      prices: { BRONZE: 28, SILVER: 45, GOLD: 69, PLATINUM: 105 } },
  { label: 'XL (601–800 m²)',maxM2: 800,      prices: { BRONZE: 36, SILVER: 58, GOLD: 89, PLATINUM: 135 } },
  { label: 'XXL (>800 m²)',  maxM2: Infinity, prices: { BRONZE: 46, SILVER: 73, GOLD: 112, PLATINUM: 170 } },
]

const DEFAULT_BAND_INDEX = 2 // Medium

export const TIER_INFO: Record<
  Tier,
  { label: string; visitsPerYear: number; cadenceDesc: string; color: string; bgColor: string }
> = {
  BRONZE: {
    label: 'Bronze',
    visitsPerYear: 52 / 6,
    cadenceDesc: 'Every 6 weeks, year-round',
    color: '#92400E',
    bgColor: '#FEF3C7',
  },
  SILVER: {
    label: 'Silver',
    visitsPerYear: 52 / 4,
    cadenceDesc: 'Every 4 weeks, year-round',
    color: '#4B5563',
    bgColor: '#F3F4F6',
  },
  GOLD: {
    label: 'Gold',
    visitsPerYear: 26 / 4.33 + 26 / 3,
    cadenceDesc: 'Monthly (Apr–Sep) · Every 3 weeks (Oct–Mar)',
    color: '#B45309',
    bgColor: '#FFFBEB',
  },
  PLATINUM: {
    label: 'Platinum',
    visitsPerYear: 26 / 3 + 26 / 2,
    cadenceDesc: 'Every 3 weeks (Apr–Sep) · Every 2 weeks (Oct–Mar)',
    color: '#6D28D9',
    bgColor: '#F5F3FF',
  },
}

const LOCK_IN_DISCOUNT_PCT = 10
const ANNUAL_CADENCE_DISCOUNT_PCT = 10
const GARDENING_RATE_PER_MIN = 2.20
export const GARDENING_BLOCK_SIZES: Record<number, number> = {
  15: 15 * GARDENING_RATE_PER_MIN,
  30: 30 * GARDENING_RATE_PER_MIN,
  45: 45 * GARDENING_RATE_PER_MIN,
  60: 60 * GARDENING_RATE_PER_MIN,
}
const PEST_VISIT_PRICE = 280
const PRESSURE_VISIT_PRICES: Record<number, number> = {
  0: 120, 1: 150, 2: 190, 3: 240, 4: 300, 5: 360,
}
const GUTTER_VISIT_PRICES = { LOW_SET: 140, HIGH_SET: 210 }
const HANDYMAN_HOURLY = 110

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function r2(n: number): number {
  return Math.round(n * 100) / 100
}

function getAreaBand(m2?: number | null): { band: AreaBand; index: number } {
  if (!m2 || m2 <= 0) return { band: AREA_BANDS[DEFAULT_BAND_INDEX], index: DEFAULT_BAND_INDEX }
  const index = AREA_BANDS.findIndex((b) => m2 <= b.maxM2)
  const i = index === -1 ? AREA_BANDS.length - 1 : index
  return { band: AREA_BANDS[i], index: i }
}

function addonVisitsPerYear(frequency: AddonFrequency, tier: Tier): number {
  const mv = TIER_INFO[tier].visitsPerYear
  switch (frequency) {
    case 'ONE_OFF':            return 0
    case 'EVERY_VISIT':        return mv
    case 'EVERY_SECOND_VISIT': return mv / 2
    case 'MONTHLY':            return 12
    case 'QUARTERLY':
    case 'EVERY_3_MONTHS':     return 4
    case 'EVERY_6_MONTHS':     return 2
    case 'ANNUALLY':           return 1
    default:                   return 0
  }
}

export function frequencyLabel(frequency: AddonFrequency): string {
  switch (frequency) {
    case 'ONE_OFF':            return 'One-off'
    case 'EVERY_VISIT':        return 'Every mowing visit'
    case 'EVERY_SECOND_VISIT': return 'Every 2nd mowing visit'
    case 'MONTHLY':            return 'Monthly'
    case 'QUARTERLY':
    case 'EVERY_3_MONTHS':     return 'Every 3 months'
    case 'EVERY_6_MONTHS':     return 'Every 6 months'
    case 'ANNUALLY':           return 'Annually'
    default:                   return frequency
  }
}

export function cadenceLabelStr(cadence: PaymentCadence): string {
  switch (cadence) {
    case 'WEEKLY':      return 'per week'
    case 'FORTNIGHTLY': return 'per fortnight'
    case 'MONTHLY':     return 'per month'
    case 'ANNUALLY':    return 'per year (paid upfront)'
  }
}

function weeklyToCadence(weekly: number, cadence: PaymentCadence): number {
  switch (cadence) {
    case 'WEEKLY':      return weekly
    case 'FORTNIGHTLY': return weekly * 2
    case 'MONTHLY':     return r2((weekly * 52) / 12)
    case 'ANNUALLY':    return weekly * 52
  }
}

// ─────────────────────────────────────────────
// PROPERTY MODIFIERS
// ─────────────────────────────────────────────

function calcModifiers(
  blockType?: BlockType | null,
  homeType?: HomeType | null,
  grassLocations: string[] = [],
  hasPool = false,
): { totalWeekly: number; breakdown: string[] } {
  let total = 0
  const breakdown: string[] = []

  if (blockType === 'CORNER') {
    total += 3; breakdown.push('Corner block +$3.00/wk')
  }
  if (homeType === 'HIGH_SET') {
    total += 2.50; breakdown.push('High set home +$2.50/wk')
  }
  if (hasPool) {
    total += 4; breakdown.push('Pool surrounds +$4.00/wk')
  }

  const STANDARD = ['FRONT_YARD', 'REAR_YARD']
  const extra = grassLocations.filter((z) => !STANDARD.includes(z))
  if (extra.length > 0) {
    const cost = extra.length * 1.50
    total += cost
    breakdown.push(`${extra.length} extra grass zone(s) +$${cost.toFixed(2)}/wk`)
  }

  return { totalWeekly: r2(total), breakdown }
}

// ─────────────────────────────────────────────
// ADD-ON PRICING
// ─────────────────────────────────────────────

function calcAddon(
  addon: AddonInput,
  tier: Tier,
  bandIndex: number,
  homeType?: HomeType | null,
): AddonPriceItem {
  const isOneOff = addon.frequency === 'ONE_OFF'
  const visits = addonVisitsPerYear(addon.frequency, tier)
  let visitPrice = 0
  let label = ''

  switch (addon.addonType) {
    case 'PEST_CONTROL':
      visitPrice = PEST_VISIT_PRICE
      label = 'Pest Control'
      break
    case 'PRESSURE_WASHING':
      visitPrice = PRESSURE_VISIT_PRICES[bandIndex] ?? PRESSURE_VISIT_PRICES[2]
      label = 'Pressure Washing'
      break
    case 'GUTTER_CLEANING':
      visitPrice = homeType === 'HIGH_SET' ? GUTTER_VISIT_PRICES.HIGH_SET : GUTTER_VISIT_PRICES.LOW_SET
      label = 'Gutter Cleaning'
      break
    case 'GARDENING': {
      const mins = addon.blockSizeMins && addon.blockSizeMins in GARDENING_BLOCK_SIZES
        ? addon.blockSizeMins : 30
      visitPrice = GARDENING_BLOCK_SIZES[mins]
      label = `Gardening (${mins} min block)`
      break
    }
    case 'HANDYMAN':
      visitPrice = HANDYMAN_HOURLY
      label = 'Handyman (1 hr)'
      break
  }

  return {
    addonType: addon.addonType,
    frequency: addon.frequency,
    blockSizeMins: addon.blockSizeMins,
    isOneOff,
    visitPrice,
    visitsPerYear: r2(visits),
    weeklyEquivalent: isOneOff ? 0 : r2((visitPrice * visits) / 52),
    oneOffAmount: isOneOff ? visitPrice : 0,
    label,
    frequencyLabel: frequencyLabel(addon.frequency),
  }
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

export function calculatePriceEstimate(input: PricingInput): PriceEstimate {
  const {
    mowableAreaM2, blockType, homeType,
    grassLocations = [], hasPool = false,
    tier, contractType, paymentCadence,
    addons = [],
  } = input

  const { band, index: bandIndex } = getAreaBand(mowableAreaM2)
  const tierBaseWeekly = band.prices[tier]

  const mods = calcModifiers(blockType, homeType, grassLocations, hasPool)
  const grossWeekly = r2(tierBaseWeekly + mods.totalWeekly)

  const lockInDiscountPct = contractType === 'FIXED_12' ? LOCK_IN_DISCOUNT_PCT : 0
  const cadenceDiscountPct =
    contractType === 'FIXED_12' && paymentCadence === 'ANNUALLY'
      ? ANNUAL_CADENCE_DISCOUNT_PCT : 0

  const discountMultiplier = (1 - lockInDiscountPct / 100) * (1 - cadenceDiscountPct / 100)
  const mowingDiscountedWeekly = r2(grossWeekly * discountMultiplier)
  const lockInDiscountAmount = r2(grossWeekly * (lockInDiscountPct / 100))
  const afterLockIn = r2(grossWeekly * (1 - lockInDiscountPct / 100))
  const cadenceDiscountAmount = r2(afterLockIn * (cadenceDiscountPct / 100))
  const totalDiscountAmount = r2(grossWeekly - mowingDiscountedWeekly)

  const addonsBreakdown = addons.map((a) => calcAddon(a, tier, bandIndex, homeType))
  const addonsRecurringWeekly = r2(addonsBreakdown.reduce((s, a) => s + a.weeklyEquivalent, 0))
  const addonsOneOffTotal = r2(addonsBreakdown.reduce((s, a) => s + a.oneOffAmount, 0))

  const totalWeekly = r2(mowingDiscountedWeekly + addonsRecurringWeekly)
  const totalMonthly = r2((totalWeekly * 52) / 12)
  const totalAnnual = r2(totalWeekly * 52)
  const totalAnnualWithOneOffs = r2(totalAnnual + addonsOneOffTotal)

  const tierInfo = TIER_INFO[tier]
  const mowingVisitsPerYear = r2(tierInfo.visitsPerYear)
  const mowingVisitPrice = r2((mowingDiscountedWeekly * 52) / mowingVisitsPerYear)

  return {
    areaBand: band.label,
    tierBaseWeekly,
    propertyModifiersWeekly: mods.totalWeekly,
    propertyModifiersBreakdown: mods.breakdown,
    grossWeekly,
    lockInDiscountPct,
    cadenceDiscountPct,
    totalDiscountPct: lockInDiscountPct + cadenceDiscountPct,
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
    paymentPerCadence: r2(weeklyToCadence(totalWeekly, paymentCadence)),
    cadenceLabel: cadenceLabelStr(paymentCadence),
    tierLabel: tierInfo.label,
    tierCadenceDescription: tierInfo.cadenceDesc,
  }
}

/**
 * Convert an AddonSelection[] from the wizard store into AddonInput[]
 * (filters to only enabled add-ons).
 */
export function wizardAddonsToInputs(addons: AddonSelection[]): AddonInput[] {
  return addons
    .filter((a) => a.enabled)
    .map((a) => ({
      addonType: a.addonType,
      frequency: a.frequency,
      blockSizeMins: a.blockSize,
    }))
}

// ─────────────────────────────────────────────
// DISPLAY HELPERS
// ─────────────────────────────────────────────

/** Format a dollar amount to 2 decimal places with $ prefix */
export function fmt(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/** Round and format for display — no trailing zero cents for round numbers */
export function fmtClean(amount: number): string {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`
}

export { LOCK_IN_DISCOUNT_PCT, ANNUAL_CADENCE_DISCOUNT_PCT }
