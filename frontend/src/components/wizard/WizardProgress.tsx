import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  number: number
  label: string
}

const STEPS: Step[] = [
  { number: 1, label: 'Address' },
  { number: 2, label: 'Property' },
  { number: 3, label: 'Access' },
  { number: 4, label: 'Package' },
  { number: 5, label: 'Contract' },
  { number: 6, label: 'Your Quote' },
]

interface WizardProgressProps {
  currentStep: number
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {/* Progress line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-brand-green z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep
          const isActive = step.number === currentStep
          const isFuture = step.number > currentStep

          return (
            <div key={step.number} className="flex flex-col items-center z-10 flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-xs font-bold',
                  isCompleted && 'bg-brand-green border-brand-green text-white',
                  isActive && 'bg-white border-brand-green text-brand-green ring-4 ring-brand-green/20',
                  isFuture && 'bg-white border-gray-300 text-gray-400',
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-[10px] font-semibold hidden sm:block transition-colors',
                  isCompleted && 'text-brand-green',
                  isActive && 'text-brand-navy',
                  isFuture && 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile: current step label */}
      <div className="sm:hidden mt-3 text-center">
        <span className="text-xs font-semibold text-brand-navy">
          Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  )
}
