'use client'

import { useWizardStore } from '@/store/wizardStore'
import { RadioCard } from '@/components/ui/RadioCard'
import { cn } from '@/lib/utils'
import { Lock, Unlock, CalendarDays, Info } from 'lucide-react'
import type { ContractType, PaymentCadence } from '@/types'

interface Step5Props {
  onNext: () => void
  onBack: () => void
}

interface CadenceOption {
  value: PaymentCadence
  label: string
  description: string
  icon: string
  fixed12Only: boolean
  badge?: string
}

const CADENCE_OPTIONS: CadenceOption[] = [
  {
    value: 'WEEKLY',
    label: 'Weekly',
    description: 'Small regular payments — easiest on your budget',
    icon: '📅',
    fixed12Only: false,
  },
  {
    value: 'FORTNIGHTLY',
    label: 'Fortnightly',
    description: 'Every two weeks, aligned to your pay cycle',
    icon: '🗓️',
    fixed12Only: false,
  },
  {
    value: 'MONTHLY',
    label: 'Monthly',
    description: 'One payment per month — most popular choice',
    icon: '📆',
    fixed12Only: false,
  },
  {
    value: 'ANNUALLY',
    label: 'Annually (pay upfront)',
    description: 'Pay for the full year upfront and save an extra 10% on top of your lock-in discount',
    icon: '💰',
    fixed12Only: true,
    badge: 'Extra 10% off',
  },
]

export function Step5LockInCadence({ onNext, onBack }: Step5Props) {
  const { formData, updateFormData } = useWizardStore()

  function selectContractType(contractType: ContractType) {
    // If switching to Flexi, clear annual cadence (not available)
    const newCadence =
      contractType === 'FLEXI' && formData.paymentCadence === 'ANNUALLY'
        ? 'MONTHLY'
        : formData.paymentCadence
    updateFormData({ contractType, paymentCadence: newCadence as PaymentCadence })
  }

  function selectCadence(cadence: PaymentCadence) {
    // Annual is only allowed on FIXED_12
    if (cadence === 'ANNUALLY' && formData.contractType !== 'FIXED_12') return
    updateFormData({ paymentCadence: cadence })
  }

  const isFixed = formData.contractType === 'FIXED_12'
  const isValid = formData.contractType !== null && formData.paymentCadence !== null

  return (
    <div>
      {/* Contract type */}
      <div className="mb-8">
        <label className="label text-base mb-1">Contract type</label>
        <p className="text-xs text-gray-500 mb-4">Choose how you want to commit to your LIFE Services plan.</p>

        <div className="grid gap-3">
          {/* 12-Month Fixed */}
          <button
            type="button"
            onClick={() => selectContractType('FIXED_12')}
            className={cn(
              'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
              isFixed
                ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20'
                : 'border-gray-200 bg-white hover:border-brand-teal',
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                isFixed ? 'bg-brand-green/20' : 'bg-gray-100',
              )}>
                <Lock className={cn('w-5 h-5', isFixed ? 'text-brand-green' : 'text-gray-500')} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-brand-navy">12-Month Fixed</span>
                  <span className="bg-brand-green/10 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Save 10%
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Lock in your price for 12 months — no surprise increases. Pay weekly, fortnightly, monthly, or annually (annual = extra 10% off). Cancellation requires paying out the remaining contract balance.
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {[
                    '✅ 10% lock-in discount applied',
                    '✅ Price guaranteed for 12 months',
                    '✅ Annual payment option (save another 10%)',
                    '⚠️ Cancellation = pay remaining balance',
                  ].map((point) => (
                    <li key={point} className="text-xs text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </button>

          {/* Flexi */}
          <button
            type="button"
            onClick={() => selectContractType('FLEXI')}
            className={cn(
              'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
              !isFixed && formData.contractType !== null
                ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20'
                : 'border-gray-200 bg-white hover:border-brand-teal',
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                !isFixed && formData.contractType !== null ? 'bg-brand-teal/20' : 'bg-gray-100',
              )}>
                <Unlock className={cn(
                  'w-5 h-5',
                  !isFixed && formData.contractType !== null ? 'text-brand-teal' : 'text-gray-500',
                )} />
              </div>
              <div className="flex-1">
                <span className="font-bold text-brand-navy">Flexi Plan</span>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  No lock-in, no long-term commitment. Cancel anytime with 30 days notice. Prices may fluctuate with market rates.
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {[
                    '✅ Cancel with 30 days notice — no payout',
                    '✅ No long-term commitment',
                    '❌ No lock-in discount',
                    '❌ No annual payment option',
                  ].map((point) => (
                    <li key={point} className="text-xs text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Payment cadence */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <label className="label text-base mb-0">Payment frequency</label>
          <CalendarDays className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 mb-4">
          All options are the same total cost (except annual, which gets an extra discount).
        </p>

        <div className="grid grid-cols-2 gap-3">
          {CADENCE_OPTIONS.map((opt) => {
            const disabled = opt.fixed12Only && !isFixed
            const selected = formData.paymentCadence === opt.value

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !disabled && selectCadence(opt.value)}
                disabled={disabled}
                className={cn(
                  'relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                  selected && !disabled
                    ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20'
                    : !disabled
                    ? 'border-gray-200 bg-white hover:border-brand-teal'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed',
                )}
              >
                {opt.badge && isFixed && (
                  <span className="absolute -top-2.5 left-3 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {opt.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{opt.icon}</span>
                  <span className="font-semibold text-brand-navy text-sm">{opt.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{opt.description}</p>
                {disabled && (
                  <p className="text-[10px] text-gray-400 mt-1">Requires 12-month plan</p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary callout */}
      {formData.contractType && formData.paymentCadence && (
        <div className="mb-8 p-4 bg-brand-navy/5 border border-brand-navy/10 rounded-xl">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-navy/60 shrink-0 mt-0.5" />
            <div className="text-xs text-brand-navy leading-relaxed">
              <span className="font-semibold">Your selection: </span>
              {formData.contractType === 'FIXED_12'
                ? '12-month fixed contract'
                : 'Flexi plan (cancel anytime)'
              },{' '}
              billed {formData.paymentCadence.toLowerCase()}.
              {formData.contractType === 'FIXED_12' && (
                <span className="text-brand-green font-semibold">
                  {' '}10% lock-in discount applied.
                  {formData.paymentCadence === 'ANNUALLY' && ' +10% annual payment discount.'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 justify-center">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={cn('btn-primary flex-1 justify-center', !isValid && 'opacity-50 cursor-not-allowed')}
        >
          See My Quote →
        </button>
      </div>
    </div>
  )
}
