import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { AppError } from '../middleware/errorHandler'
import { addWeeks, addMonths, addDays } from 'date-fns'

export const contractsRouter = Router()

const createContractSchema = z.object({
  propertyId: z.string().optional(),
  serviceType: z.enum(['MOWING', 'PEST_CONTROL', 'PRESSURE_WASHING', 'GUTTER_CLEANING', 'GARDENING', 'HANDYMAN']),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).optional(),
  contractType: z.enum(['FIXED_12', 'FLEXI']),
  paymentCadence: z.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'ANNUALLY']),
  basePrice: z.number().positive(),
  discountedPrice: z.number().positive(),
  startDate: z.string().transform((v) => new Date(v)),
  addons: z.array(
    z.object({
      addonType: z.enum(['PEST_CONTROL', 'PRESSURE_WASHING', 'GUTTER_CLEANING', 'GARDENING', 'HANDYMAN']),
      frequency: z.string(),
      unitPrice: z.number().nonnegative(),
      totalPrice: z.number().nonnegative(),
    })
  ).optional().default([]),
})

// POST /api/contracts
contractsRouter.post('/', requireAuth, validate(createContractSchema), async (req: AuthRequest, res, next) => {
  try {
    const { addons, startDate, contractType, ...contractData } = req.body

    // Calculate end date for fixed 12-month contracts
    const endDate = contractType === 'FIXED_12'
      ? addMonths(new Date(startDate), 12)
      : undefined

    const contract = await prisma.contract.create({
      data: {
        ...contractData,
        contractType,
        startDate: new Date(startDate),
        endDate,
        userId: req.user!.id,
        status: 'PENDING',
        addons: {
          create: addons.map((a: any) => ({ ...a, status: 'PENDING' })),
        },
      },
      include: { addons: true },
    })

    res.status(201).json(contract)
  } catch (err) {
    next(err)
  }
})

// GET /api/contracts/:id
contractsRouter.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const contract = await prisma.contract.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        addons: true,
        visits: { orderBy: { scheduledDate: 'asc' } },
        payments: { orderBy: { dueDate: 'asc' } },
      },
    })
    if (!contract) throw new AppError('Contract not found', 404)
    res.json(contract)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/contracts/:id/cancel
contractsRouter.patch('/:id/cancel', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const contract = await prisma.contract.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    })
    if (!contract) throw new AppError('Contract not found', 404)
    if (contract.status !== 'ACTIVE') throw new AppError('Only active contracts can be cancelled', 400)

    // Business rule: FIXED_12 must pay out remainder; FLEXI = 30 days notice
    const cancelledAt = new Date()
    let effectiveEndDate: Date

    if (contract.contractType === 'FIXED_12') {
      effectiveEndDate = cancelledAt // immediate, but payout calculated
    } else {
      effectiveEndDate = addDays(cancelledAt, 30) // 30 days notice
    }

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        status: 'CANCELLED',
        endDate: effectiveEndDate,
        cancelledAt: cancelledAt,
        cancellationReason: req.body.reason || null,
      },
    })

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/contracts/:id/upgrade
contractsRouter.patch('/:id/upgrade', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { newTier, newBasePrice, newDiscountedPrice } = req.body
    const contract = await prisma.contract.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    })
    if (!contract) throw new AppError('Contract not found', 404)
    if (contract.status !== 'ACTIVE') throw new AppError('Only active contracts can be upgraded', 400)
    if (contract.serviceType !== 'MOWING') throw new AppError('Only mowing contracts can be upgraded', 400)

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        tier: newTier,
        basePrice: newBasePrice,
        discountedPrice: newDiscountedPrice,
        upgradedAt: new Date(),
        previousTier: contract.tier,
      },
    })

    res.json(updated)
  } catch (err) {
    next(err)
  }
})
