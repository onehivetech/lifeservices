import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { propertiesRouter } from './routes/properties'
import { contractsRouter } from './routes/contracts'
import { paymentsRouter } from './routes/payments'
import { pricingRouter } from './routes/pricing'
import { webhooksRouter } from './routes/webhooks'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 4000

// Trust proxy for accurate IP behind load balancer
app.set('trust proxy', 1)

// Security
app.use(helmet())

// Stripe webhook must receive raw body before JSON parsing
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'LIFE Services API' })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/properties', propertiesRouter)
app.use('/api/contracts', contractsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/pricing', pricingRouter)
app.use('/api/webhooks', webhooksRouter)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🌿 LIFE Services API running on http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
