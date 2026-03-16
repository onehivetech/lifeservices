import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'

export const paymentsRouter = Router()

// GET /api/payments — user's payment history
paymentsRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      include: { contract: { select: { serviceType: true, tier: true } } },
      orderBy: { dueDate: 'desc' },
      take: 50,
    })
    res.json(payments)
  } catch (err) {
    next(err)
  }
})

// GET /api/payments/upcoming
paymentsRouter.get('/upcoming', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: req.user!.id,
        status: 'PENDING',
        dueDate: { gte: new Date() },
      },
      include: { contract: { select: { serviceType: true, tier: true } } },
      orderBy: { dueDate: 'asc' },
      take: 10,
    })
    res.json(payments)
  } catch (err) {
    next(err)
  }
})
