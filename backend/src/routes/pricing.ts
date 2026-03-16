import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'

export const pricingRouter = Router()

// This route will be fully implemented in Stage 2
// Placeholder that validates the shape and returns an empty estimate

const estimateSchema = z.object({
  mowableAreaM2: z.number().positive().optional(),
  blockType: z.enum(['CORNER', 'INLINE']).optional(),
  homeType: z.enum(['LOW_SET', 'HIGH_SET']).optional(),
  grassLocations: z.array(z.string()).optional(),
  hasPool: z.boolean().optional(),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
  contractType: z.enum(['FIXED_12', 'FLEXI']),
  paymentCadence: z.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'ANNUALLY']),
  addons: z.array(
    z.object({
      addonType: z.string(),
      frequency: z.string(),
      blockSize: z.number().optional(),
    })
  ).optional().default([]),
})

// POST /api/pricing/estimate
pricingRouter.post('/estimate', validate(estimateSchema), async (req, res, next) => {
  try {
    // Stub — full pricing engine implemented in Stage 2
    res.json({
      message: 'Pricing engine coming in Stage 2',
      input: req.body,
    })
  } catch (err) {
    next(err)
  }
})
