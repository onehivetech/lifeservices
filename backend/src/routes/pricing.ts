import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { optionalAuth, AuthRequest } from '../middleware/auth'
import { prisma } from '../utils/prisma'
import {
  calculatePriceEstimate,
  calculateUpgradePrice,
  calculateStandaloneAddonPrice,
  PRICING_CONSTANTS,
  type PricingInput,
  type AddonInput,
} from '../services/pricingEngine'

export const pricingRouter = Router()

// ─────────────────────────────────────────────
// VALIDATION SCHEMAS
// ─────────────────────────────────────────────

const addonSchema = z.object({
  addonType: z.enum(['PEST_CONTROL', 'PRESSURE_WASHING', 'GUTTER_CLEANING', 'GARDENING', 'HANDYMAN']),
  frequency: z.enum([
    'ONE_OFF', 'EVERY_VISIT', 'EVERY_SECOND_VISIT',
    'EVERY_3_MONTHS', 'EVERY_6_MONTHS', 'ANNUALLY', 'MONTHLY', 'QUARTERLY',
  ]),
  blockSizeMins: z.number().refine((v) => [15, 30, 45, 60].includes(v)).optional(),
})

const estimateSchema = z.object({
  mowableAreaM2: z.number().positive().nullable().optional(),
  blockType: z.enum(['CORNER', 'INLINE']).nullable().optional(),
  homeType: z.enum(['LOW_SET', 'HIGH_SET']).nullable().optional(),
  grassLocations: z.array(z.string()).optional().default([]),
  hasPool: z.boolean().optional().default(false),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
  contractType: z.enum(['FIXED_12', 'FLEXI']),
  paymentCadence: z.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'ANNUALLY']),
  addons: z.array(addonSchema).optional().default([]),
  // Optional: save snapshot to DB (requires auth)
  saveSnapshot: z.boolean().optional().default(false),
  sessionId: z.string().optional(),
})

const upgradeSchema = z.object({
  // Current contract state
  mowableAreaM2: z.number().positive().nullable().optional(),
  blockType: z.enum(['CORNER', 'INLINE']).nullable().optional(),
  homeType: z.enum(['LOW_SET', 'HIGH_SET']).nullable().optional(),
  grassLocations: z.array(z.string()).optional().default([]),
  hasPool: z.boolean().optional().default(false),
  currentTier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
  contractType: z.enum(['FIXED_12', 'FLEXI']),
  paymentCadence: z.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'ANNUALLY']),
  // Target upgrade tier
  newTier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
})

const standaloneAddonSchema = z.object({
  addonType: z.enum(['PEST_CONTROL', 'PRESSURE_WASHING', 'GUTTER_CLEANING', 'GARDENING', 'HANDYMAN']),
  frequency: z.enum([
    'ONE_OFF', 'EVERY_VISIT', 'EVERY_SECOND_VISIT',
    'EVERY_3_MONTHS', 'EVERY_6_MONTHS', 'ANNUALLY', 'MONTHLY', 'QUARTERLY',
  ]),
  blockSizeMins: z.number().refine((v) => [15, 30, 45, 60].includes(v)).optional(),
  mowableAreaM2: z.number().positive().nullable().optional(),
  homeType: z.enum(['LOW_SET', 'HIGH_SET']).nullable().optional(),
})

// ─────────────────────────────────────────────
// GET /api/pricing/constants
// Returns all pricing tables for frontend use
// ─────────────────────────────────────────────

pricingRouter.get('/constants', (_req, res) => {
  res.json(PRICING_CONSTANTS)
})

// ─────────────────────────────────────────────
// POST /api/pricing/estimate
// Full property estimate (mowing + add-ons)
// ─────────────────────────────────────────────

pricingRouter.post(
  '/estimate',
  optionalAuth,
  validate(estimateSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { saveSnapshot, sessionId, ...pricingInput } = req.body

      // Validate business rule: ANNUALLY only valid on FIXED_12
      if (
        pricingInput.paymentCadence === 'ANNUALLY' &&
        pricingInput.contractType !== 'FIXED_12'
      ) {
        return res.status(422).json({
          status: 'error',
          message: 'Annual payment cadence is only available with a 12-month fixed contract.',
        })
      }

      const estimate = calculatePriceEstimate(pricingInput as PricingInput)

      // Optionally persist pricing snapshot for audit / confirmation flow
      if (saveSnapshot) {
        await prisma.pricingSnapshot.create({
          data: {
            userId: req.user?.id ?? null,
            sessionId: sessionId ?? null,
            mowableAreaM2: pricingInput.mowableAreaM2 ?? null,
            blockType: pricingInput.blockType ?? null,
            homeType: pricingInput.homeType ?? null,
            grassLocations: pricingInput.grassLocations ?? [],
            hasPool: pricingInput.hasPool ?? false,
            tier: pricingInput.tier,
            contractType: pricingInput.contractType,
            paymentCadence: pricingInput.paymentCadence,
            baseWeeklyPrice: estimate.grossWeekly,
            discountedWeekly: estimate.mowingDiscountedWeekly,
            lockInDiscount: estimate.lockInDiscountPct,
            cadenceDiscount: estimate.cadenceDiscountPct,
            addonsTotalWeekly: estimate.addonsRecurringWeekly,
            snapshotData: JSON.parse(JSON.stringify(estimate)),
          },
        })
      }

      res.json(estimate)
    } catch (err) {
      next(err)
    }
  }
)

// ─────────────────────────────────────────────
// POST /api/pricing/upgrade
// Preview pricing for a tier upgrade
// ─────────────────────────────────────────────

pricingRouter.post('/upgrade', validate(upgradeSchema), (req, res, next) => {
  try {
    const { currentTier, newTier, ...propertyData } = req.body

    if (currentTier === newTier) {
      return res.status(422).json({
        status: 'error',
        message: 'New tier must be different from current tier.',
      })
    }

    const tierOrder: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']
    type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
    if (tierOrder.indexOf(newTier as Tier) < tierOrder.indexOf(currentTier as Tier)) {
      return res.status(422).json({
        status: 'error',
        message: 'Downgrades are not supported. Please contact support.',
      })
    }

    const result = calculateUpgradePrice(
      { ...propertyData, tier: currentTier } as PricingInput,
      newTier as Tier
    )

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────
// POST /api/pricing/addon
// Price a single standalone add-on
// ─────────────────────────────────────────────

pricingRouter.post('/addon', validate(standaloneAddonSchema), (req, res, next) => {
  try {
    const { mowableAreaM2, homeType, ...addonData } = req.body
    const result = calculateStandaloneAddonPrice(
      addonData as AddonInput,
      mowableAreaM2,
      homeType
    )
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────
// POST /api/pricing/compare
// Compare all 4 tiers side-by-side for a given property
// ─────────────────────────────────────────────

const compareSchema = z.object({
  mowableAreaM2: z.number().positive().nullable().optional(),
  blockType: z.enum(['CORNER', 'INLINE']).nullable().optional(),
  homeType: z.enum(['LOW_SET', 'HIGH_SET']).nullable().optional(),
  grassLocations: z.array(z.string()).optional().default([]),
  hasPool: z.boolean().optional().default(false),
  contractType: z.enum(['FIXED_12', 'FLEXI']),
  paymentCadence: z.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'ANNUALLY']),
})

pricingRouter.post('/compare', validate(compareSchema), (req, res, next) => {
  try {
    const tiers: Array<'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'> = [
      'BRONZE', 'SILVER', 'GOLD', 'PLATINUM',
    ]

    const comparison = tiers.map((tier) => {
      const estimate = calculatePriceEstimate({ ...req.body, tier, addons: [] })
      return {
        tier,
        tierLabel: estimate.tierLabel,
        tierCadenceDescription: estimate.tierCadenceDescription,
        areaBand: estimate.areaBand,
        grossWeekly: estimate.grossWeekly,
        mowingDiscountedWeekly: estimate.mowingDiscountedWeekly,
        paymentPerCadence: estimate.paymentPerCadence,
        cadenceLabel: estimate.cadenceLabel,
        lockInDiscountPct: estimate.lockInDiscountPct,
        totalDiscountPct: estimate.totalDiscountPct,
      }
    })

    res.json({
      contractType: req.body.contractType,
      paymentCadence: req.body.paymentCadence,
      tiers: comparison,
    })
  } catch (err) {
    next(err)
  }
})
