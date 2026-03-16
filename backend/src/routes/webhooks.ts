import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { prisma } from '../utils/prisma'

export const webhooksRouter = Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

// POST /api/webhooks/stripe
webhooksRouter.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !endpointSecret) {
    return res.status(400).json({ message: 'Missing stripe signature or webhook secret' })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return res.status(400).json({ message: 'Webhook signature invalid' })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(pi)
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(pi)
        break
      }
      case 'customer.subscription.deleted': {
        // Handle Stripe subscription cancellation
        break
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`)
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    res.status(500).json({ message: 'Webhook handler failed' })
  }
})

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const paymentId = pi.metadata?.paymentId
  if (!paymentId) return

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      stripePaymentIntentId: pi.id,
    },
  })
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const paymentId = pi.metadata?.paymentId
  if (!paymentId) return

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'FAILED' },
  })
}
