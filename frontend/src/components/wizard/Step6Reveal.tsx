'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  calculatePriceEstimate,
  wizardAddonsToInputs,
  fmt,
  fmtClean,
  TIER_INFO,
  type PriceEstimate,
} from '@/lib/pricing'
import { useWizardStore } from '@/store/wizardStore'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  CheckCircle2,
  Info,
  Sparkles,
  Tag,
  Calendar,
  Zap,
  RotateCcw,
} from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Step6Props {
  onBack: () => void
}

export function Step6Reveal({ onBack }: Step6Props) {
  const { formData, resetWizard } = useWizardStore()
  const { data: session } = useSession()
  const router = useRouter()

  const [estimate, setEstimate] = useState<PriceEstimate | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // Calculate on mount
  useEffect(() => {
    if (!formData.tier || !formData.contractType || !formData.paymentCadence) return

    const result = calculatePriceEstimate({
      mowableAreaM2: formData.mowableAreaM2,
      blockType: formData.blockType,
      homeType: formData.homeType,
      grassLocations: formData.grassLocations,
      hasPool: formData.hasPool,
      tier: formData.tier,
      contractType: formData.contractType,
      paymentCadence: formData.paymentCadence,
      addons: wizardAddonsToInputs(formData.addons),
    })

    setEstimate(result)

    // Stagger the reveal animation
    const timer = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [formData])

  async function handleStartSubscription() {
    if (!estimate) return
    setSubmitting(true)

    try {
      // If logged in, persist property + pricing snapshot + contract (PENDING)
      if (session?.user) {
        // 1. Save property
        const { data: property } = await api.post('/api/properties', {
          address: formData.address,
          suburb: formData.suburb,
          mowableAreaM2: formData.mowableAreaM2,
          lat: formData.lat,
          lng: formData.lng,
          blockType: formData.blockType,
          homeType: formData.homeType,
          grassLocations: formData.grassLocations,
          hasPool: formData.hasPool,
          accessIssues: formData.accessIssues,
          accessNotes: formData.accessNotes,
          generalNotes: formData.notes,
        })

        // 2. Save pricing snapshot
        await api.post('/api/pricing/estimate', {
          mowableAreaM2: formData.mowableAreaM2,
          blockType: formData.blockType,
          homeType: formData.homeType,
          grassLocations: formData.grassLocations,
          hasPool: formData.hasPool,
          tier: formData.tier,
          contractType: formData.contractType,
          paymentCadence: formData.paymentCadence,
          addons: wizardAddonsToInputs(formData.addons),
          saveSnapshot: true,
        })

        // 3. Create PENDING contract
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + 7) // start next week

        await api.post('/api/contracts', {
          propertyId: property.id,
          serviceType: 'MOWING',
          tier: formData.tier,
          contractType: formData.contractType,
          paymentCadence: formData.paymentCadence,
          basePrice: estimate.grossWeekly,
          discountedPrice: estimate.mowingDiscountedWeekly,
          startDate: startDate.toISOString(),
          addons: wizardAddonsToInputs(formData.addons).map((a) => {
            const item = estimate.addonsBreakdown.find((b) => b.addonType === a.addonType)
            return {
              addonType: a.addonType,
              frequency: a.frequency,
              unitPrice: item?.visitPrice ?? 0,
              totalPrice: item?.isOneOff ? item.oneOffAmount : item?.weeklyEquivalent ?? 0,
            }
          }),
        })

        toast.success("You're all set! We'll confirm your pricing within 24 hours.")
        resetWizard()
        router.push('/dashboard')
      } else {
        // Not logged in — redirect to signup/login with wizard data in URL
        toast.success("Almost there! Create your account to lock in this quote.")
        router.push(`/login?returnTo=/packages&quote=1`)
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!estimate) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p>Calculating your quote…</p>
      </div>
    )
  }

  const tierInfo = TIER_INFO[formData.tier!]
  const hasDiscount = estimate.totalDiscountPct > 0
  const hasAddons = estimate.addonsBreakdown.length > 0
  const hasOneOffs = estimate.addonsOneOffTotal > 0

  return (
    <div>
      {/* ── Hero number ── */}
      <div
        className={cn(
          'text-center mb-8 transition-all duration-700',
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          Your personalised estimate is ready
        </div>

        <div className="flex items-end justify-center gap-2 mb-1">
          <span className="text-6xl sm:text-7xl font-black text-brand-navy leading-none">
            {fmtClean(estimate.paymentPerCadence)}
          </span>
          <span className="text-lg text-gray-500 font-medium pb-2">
            {estimate.cadenceLabel}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          ≈ {fmt(estimate.totalWeekly)}/week · {fmt(estimate.totalMonthly)}/month
        </p>

        {/* Tier badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm text-sm font-semibold text-brand-navy">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: tierInfo.color }}
          />
          {estimate.tierLabel} Plan · {tierInfo.cadenceDesc}
        </div>
      </div>

      {/* ── Price breakdown ── */}
      <div
        className={cn(
          'bg-brand-bg rounded-xl p-5 mb-6 transition-all duration-700 delay-100',
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <h3 className="font-bold text-brand-navy text-sm mb-4">Price breakdown</h3>

        {/* Base mowing */}
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">{estimate.tierLabel} plan (base)</span>
          <span className="font-semibold text-brand-navy">{fmt(estimate.tierBaseWeekly)}/wk</span>
        </div>

        {/* Property modifiers */}
        {estimate.propertyModifiersBreakdown.map((mod) => (
          <div key={mod} className="flex items-center justify-between text-xs mb-1.5 pl-3">
            <span className="text-gray-500">{mod}</span>
            <span className="text-gray-500">included</span>
          </div>
        ))}

        {estimate.propertyModifiersWeekly > 0 && (
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Property modifiers</span>
            <span className="font-semibold text-gray-700">+{fmt(estimate.propertyModifiersWeekly)}/wk</span>
          </div>
        )}

        {/* Gross before discounts */}
        {hasDiscount && (
          <>
            <div className="flex items-center justify-between text-sm mb-2 border-t border-gray-200 pt-2">
              <span className="text-gray-600">Subtotal before discounts</span>
              <span className="text-gray-500 line-through">{fmt(estimate.grossWeekly)}/wk</span>
            </div>

            {estimate.lockInDiscountPct > 0 && (
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-1.5 text-brand-green font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  12-month lock-in discount ({estimate.lockInDiscountPct}%)
                </span>
                <span className="text-brand-green font-semibold">-{fmt(estimate.lockInDiscountAmount)}/wk</span>
              </div>
            )}

            {estimate.cadenceDiscountPct > 0 && (
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-1.5 text-brand-green font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  Annual payment discount ({estimate.cadenceDiscountPct}%)
                </span>
                <span className="text-brand-green font-semibold">-{fmt(estimate.cadenceDiscountAmount)}/wk</span>
              </div>
            )}
          </>
        )}

        {/* Discounted mowing total */}
        <div className={cn(
          'flex items-center justify-between text-sm font-bold',
          hasAddons ? 'mb-4 border-b border-gray-200 pb-3' : 'mt-1',
        )}>
          <span className="text-brand-navy">Mowing plan total</span>
          <span className="text-brand-navy">{fmt(estimate.mowingDiscountedWeekly)}/wk</span>
        </div>

        {/* Add-ons */}
        {hasAddons && (
          <>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Add-ons</p>
            {estimate.addonsBreakdown.map((addon) => (
              <div key={addon.addonType} className="flex items-center justify-between text-sm mb-2">
                <div>
                  <span className="text-gray-700">{addon.label}</span>
                  <span className="text-gray-400 text-xs ml-1.5">({addon.frequencyLabel})</span>
                </div>
                <span className="font-semibold text-gray-700">
                  {addon.isOneOff
                    ? <span className="text-amber-600">{fmt(addon.oneOffAmount)} one-off</span>
                    : `${fmt(addon.weeklyEquivalent)}/wk`
                  }
                </span>
              </div>
            ))}

            {/* Totals row */}
            <div className="border-t border-gray-200 pt-3 mt-1">
              <div className="flex items-center justify-between text-base font-bold text-brand-navy mb-1">
                <span>Total weekly</span>
                <span>{fmt(estimate.totalWeekly)}/wk</span>
              </div>
              {hasOneOffs && (
                <div className="flex items-center justify-between text-xs text-amber-600 font-medium">
                  <span>One-off charges</span>
                  <span>+{fmt(estimate.addonsOneOffTotal)} (invoiced at first service)</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Annual summary ── */}
      <div
        className={cn(
          'grid grid-cols-3 gap-3 mb-6 transition-all duration-700 delay-200',
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        {[
          { icon: Calendar, label: 'Monthly equivalent', value: fmt(estimate.totalMonthly) },
          { icon: Zap, label: 'Annual total', value: fmt(estimate.totalAnnual) },
          { icon: CheckCircle2, label: 'Mowing visits/year', value: `${Math.round(estimate.mowingVisitsPerYear)}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <Icon className="w-4 h-4 text-brand-teal mx-auto mb-1" />
            <p className="text-lg font-black text-brand-navy">{value}</p>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── What's included ── */}
      <div
        className={cn(
          'bg-white border border-gray-200 rounded-xl p-4 mb-6 transition-all duration-700 delay-300',
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What's included</p>
        <div className="flex flex-col gap-1.5">
          {[
            '✅ Free initial property refresh (first service on us)',
            '✅ Team confirms exact pricing within 24 hours',
            '✅ You choose your preferred start week',
            '✅ No upfront payment required',
            '✅ All staff insured and background checked',
          ].map((item) => (
            <p key={item} className="text-xs text-gray-700">{item}</p>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div
        className={cn(
          'flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-6 transition-all duration-700 delay-[400ms]',
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">This is an estimate.</span> Our team will review your property details and confirm your exact pricing within 24 hours of signup. The final price may vary slightly based on an on-site assessment.
        </p>
      </div>

      {/* ── CTA ── */}
      <div
        className={cn(
          'transition-all duration-700 delay-500',
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <button
          onClick={handleStartSubscription}
          disabled={submitting}
          className="w-full btn-primary justify-center text-base py-4 mb-3"
        >
          {submitting ? (
            'Setting up your account…'
          ) : (
            <>
              Start My Subscription — No upfront payment required
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="btn-secondary flex-1 justify-center text-sm py-2.5"
          >
            Edit choices
          </button>
          <button
            onClick={resetWizard}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-navy transition-colors px-4 py-2.5 rounded-xl hover:bg-gray-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start over
          </button>
        </div>

        {!session && (
          <p className="text-center text-xs text-gray-400 mt-4">
            You'll be asked to create a free account to lock in this quote.
          </p>
        )}
      </div>
    </div>
  )
}
