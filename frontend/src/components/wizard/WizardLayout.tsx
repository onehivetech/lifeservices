'use client'

import { WizardProgress } from './WizardProgress'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardLayoutProps {
  currentStep: number
  title: string
  subtitle?: string
  onBack?: () => void
  children: React.ReactNode
  /** If true, stretch to full-width content (Step 6 reveal) */
  wide?: boolean
}

export function WizardLayout({
  currentStep,
  title,
  subtitle,
  onBack,
  children,
  wide = false,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero strip */}
      <div className="bg-brand-navy text-white pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <WizardProgress currentStep={currentStep} />
          <div className="mt-8">
            <h1 className="text-2xl sm:text-3xl font-black leading-tight">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-gray-300 text-sm leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card panel */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-8 pb-16">
        <div className={cn('bg-white rounded-2xl shadow-card p-6 sm:p-8', wide && 'sm:max-w-3xl sm:mx-auto')}>
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-navy transition-colors mb-6 -ml-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
