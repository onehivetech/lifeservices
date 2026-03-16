import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'
import { validate } from '../middleware/validate'
import { AppError } from '../middleware/errorHandler'
import { requireAuth, AuthRequest } from '../middleware/auth'

export const authRouter = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  preferredContact: z.enum(['CALL', 'TEXT', 'EMAIL']).optional(),
  hearAboutUs: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function signToken(userId: string, email: string) {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '30d' }
  )
}

// POST /api/auth/register
authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, phone, password, preferredContact, hearAboutUs } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new AppError('An account with this email already exists', 409)

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash, preferredContact, hearAboutUs },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })

    const token = signToken(user.id, user.email)

    res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) throw new AppError('Invalid email or password', 401)

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new AppError('Invalid email or password', 401)

    const token = signToken(user.id, user.email)

    const safeUser = { id: user.id, name: user.name, email: user.email, phone: user.phone }
    res.json({ user: safeUser, token })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, phone: true, preferredContact: true, hearAboutUs: true, createdAt: true },
    })
    if (!user) throw new AppError('User not found', 404)
    res.json(user)
  } catch (err) {
    next(err)
  }
})
