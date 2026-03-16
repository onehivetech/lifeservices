// Enums (mirror Prisma schema)
export type BlockType = 'CORNER' | 'INLINE'
export type HomeType = 'LOW_SET' | 'HIGH_SET'
export type ServiceType = 'MOWING' | 'PEST_CONTROL' | 'PRESSURE_WASHING' | 'GUTTER_CLEANING' | 'GARDENING' | 'HANDYMAN'
export type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
export type ContractType = 'FIXED_12' | 'FLEXI'
export type PaymentCadence = 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY' | 'ANNUALLY'
export type ContractStatus = 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'
export type VisitStatus = 'SCHEDULED' | 'COMPLETED' | 'SKIPPED'
export type AddonType = 'PEST_CONTROL' | 'PRESSURE_WASHING' | 'GUTTER_CLEANING' | 'GARDENING' | 'HANDYMAN'
export type ContactPreference = 'CALL' | 'TEXT' | 'EMAIL'
export type AddonFrequency =
  | 'ONE_OFF'
  | 'EVERY_VISIT'
  | 'EVERY_SECOND_VISIT'
  | 'EVERY_3_MONTHS'
  | 'EVERY_6_MONTHS'
  | 'ANNUALLY'
  | 'MONTHLY'
  | 'QUARTERLY'

// Property wizard form state
export interface WizardFormData {
  // Step 1
  address: string
  suburb: string
  mowableAreaM2: number | null
  lat: number | null
  lng: number | null

  // Step 2
  blockType: BlockType | null
  homeType: HomeType | null
  grassLocations: string[]
  hasPool: boolean

  // Step 3
  accessIssues: string[]
  accessNotes: string
  preferredContact: ContactPreference
  hearAboutUs: string
  notes: string

  // Step 4
  tier: Tier | null
  addons: AddonSelection[]

  // Step 5
  contractType: ContractType | null
  paymentCadence: PaymentCadence | null

  // Step 6 (computed)
  estimatedWeeklyPrice: number | null
  estimatedTotalMonthly: number | null
}

export interface AddonSelection {
  addonType: AddonType
  enabled: boolean
  frequency: AddonFrequency
  blockSize?: number // for gardening blocks in minutes
}

// API response types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  preferredContact?: ContactPreference
  hearAboutUs?: string
  createdAt: string
}

export interface Property {
  id: string
  userId: string
  address: string
  suburb: string
  mowableAreaM2?: number
  blockType?: BlockType
  homeType?: HomeType
  grassLocations: string[]
  hasPool: boolean
  accessNotes?: string
  generalNotes?: string
}

export interface Contract {
  id: string
  userId: string
  serviceType: ServiceType
  tier?: Tier
  contractType: ContractType
  paymentCadence: PaymentCadence
  basePrice: number
  discountedPrice: number
  startDate: string
  endDate?: string
  status: ContractStatus
  confirmedAt?: string
  addons: AddOn[]
  payments: Payment[]
  visits: ServiceVisit[]
}

export interface AddOn {
  id: string
  contractId: string
  addonType: AddonType
  frequency: AddonFrequency
  unitPrice: number
  totalPrice: number
  status: ContractStatus
}

export interface Payment {
  id: string
  contractId: string
  userId: string
  amount: number
  cadence: PaymentCadence
  dueDate: string
  paidAt?: string
  status: PaymentStatus
}

export interface ServiceVisit {
  id: string
  contractId: string
  scheduledDate: string
  completedDate?: string
  status: VisitStatus
  notes?: string
}

// Pricing types
export interface PriceEstimate {
  tierBaseWeekly: number
  tierBaseMonthly: number
  lockInDiscount: number
  annualPaymentDiscount: number
  addonsWeekly: number
  addonsBreakdown: AddonPriceItem[]
  oneOffTotal: number
  totalWeekly: number
  totalMonthly: number
  totalAnnual: number
}

export interface AddonPriceItem {
  addonType: AddonType
  frequency: AddonFrequency
  weeklyEquivalent: number
  description: string
}
