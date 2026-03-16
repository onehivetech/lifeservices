import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { AppError } from '../middleware/errorHandler'

export const usersRouter = Router()

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  preferredContact: z.enum(['CALL', 'TEXT', 'EMAIL']).optional(),
})

// GET /api/users/me/contracts
usersRouter.get('/me/contracts', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { userId: req.user!.id },
      include: {
        addons: true,
        visits: { orderBy: { scheduledDate: 'desc' }, take: 5 },
        payments: { orderBy: { dueDate: 'desc' }, take: 10 },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(contracts)
  } catch (err) {
    next(err)
  }
})

// GET /api/users/me/properties
usersRouter.get('/me/properties', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: { userId: req.user!.id },
    })
    res.json(properties)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/users/me
usersRouter.patch('/me', requireAuth, validate(updateSchema), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
      select: { id: true, name: true, email: true, phone: true, preferredContact: true },
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})
