import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { AppError } from '../middleware/errorHandler'

export const propertiesRouter = Router()

const propertySchema = z.object({
  address: z.string().min(5),
  suburb: z.string().min(2),
  mowableAreaM2: z.number().positive().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  blockType: z.enum(['CORNER', 'INLINE']).optional(),
  homeType: z.enum(['LOW_SET', 'HIGH_SET']).optional(),
  grassLocations: z.array(z.string()).default([]),
  hasPool: z.boolean().default(false),
  accessNotes: z.string().optional(),
  generalNotes: z.string().optional(),
})

// POST /api/properties
propertiesRouter.post('/', requireAuth, validate(propertySchema), async (req: AuthRequest, res, next) => {
  try {
    const property = await prisma.property.create({
      data: { ...req.body, userId: req.user!.id },
    })
    res.status(201).json(property)
  } catch (err) {
    next(err)
  }
})

// GET /api/properties/:id
propertiesRouter.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const property = await prisma.property.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    })
    if (!property) throw new AppError('Property not found', 404)
    res.json(property)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/properties/:id
propertiesRouter.patch('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.property.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    })
    if (!existing) throw new AppError('Property not found', 404)

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(property)
  } catch (err) {
    next(err)
  }
})
