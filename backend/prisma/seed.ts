import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding LIFE Services database...')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@lifeservices.com.au' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'demo@lifeservices.com.au',
      phone: '0400 123 456',
      passwordHash,
      preferredContact: 'EMAIL',
      hearAboutUs: 'Google',
    },
  })
  console.log(`✅ Demo user: ${user.email}`)

  // Create demo property
  const property = await prisma.property.upsert({
    where: { id: 'demo-property-01' },
    update: {},
    create: {
      id: 'demo-property-01',
      userId: user.id,
      address: '12 Anzac Ave, Nudgee QLD 4014',
      suburb: 'Nudgee',
      postcode: '4014',
      mowableAreaM2: 420,
      blockType: 'INLINE',
      homeType: 'LOW_SET',
      grassLocations: ['FRONT_YARD', 'REAR_YARD', 'SIDES'],
      hasPool: false,
      accessNotes: 'Side gate code: 1234',
    },
  })
  console.log(`✅ Demo property: ${property.address}`)

  // Create demo Silver subscription contract
  const contract = await prisma.contract.upsert({
    where: { id: 'demo-contract-01' },
    update: {},
    create: {
      id: 'demo-contract-01',
      userId: user.id,
      propertyId: property.id,
      serviceType: 'MOWING',
      tier: 'SILVER',
      contractType: 'FIXED_12',
      paymentCadence: 'MONTHLY',
      basePrice: 38.50,        // Weekly equivalent
      discountedPrice: 34.65,  // 10% lock-in discount applied
      lockInDiscount: 10,
      cadenceDiscount: 0,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2027-02-01'),
      status: 'ACTIVE',
      confirmedAt: new Date('2026-01-28'),
    },
  })
  console.log(`✅ Demo contract: ${contract.serviceType} (${contract.tier})`)

  // Create a demo gutter cleaning add-on
  await prisma.addOn.upsert({
    where: { id: 'demo-addon-01' },
    update: {},
    create: {
      id: 'demo-addon-01',
      contractId: contract.id,
      addonType: 'GUTTER_CLEANING',
      frequency: 'EVERY_6_MONTHS',
      unitPrice: 120,
      totalPrice: 240,
      status: 'ACTIVE',
    },
  })
  console.log(`✅ Demo add-on: Gutter Cleaning (6-monthly)`)

  // Create upcoming service visits
  const visitDates = [
    new Date('2026-03-20'),
    new Date('2026-04-17'),
    new Date('2026-05-15'),
  ]

  for (const [i, date] of visitDates.entries()) {
    await prisma.serviceVisit.upsert({
      where: { id: `demo-visit-0${i + 1}` },
      update: {},
      create: {
        id: `demo-visit-0${i + 1}`,
        contractId: contract.id,
        scheduledDate: date,
        status: i === 0 ? 'SCHEDULED' : 'SCHEDULED',
      },
    })
  }
  console.log(`✅ Demo service visits created`)

  // Create payment records
  const paymentAmounts = [150.25, 150.25]
  for (const [i, amount] of paymentAmounts.entries()) {
    await prisma.payment.upsert({
      where: { id: `demo-payment-0${i + 1}` },
      update: {},
      create: {
        id: `demo-payment-0${i + 1}`,
        contractId: contract.id,
        userId: user.id,
        amount,
        cadence: 'MONTHLY',
        dueDate: new Date(`2026-0${i + 2}-01`),
        paidAt: i === 0 ? new Date(`2026-0${i + 2}-01`) : null,
        status: i === 0 ? 'PAID' : 'PENDING',
      },
    })
  }
  console.log(`✅ Demo payments created`)

  console.log('\n🌿 Seed complete! Demo credentials:')
  console.log('   Email: demo@lifeservices.com.au')
  console.log('   Password: demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
