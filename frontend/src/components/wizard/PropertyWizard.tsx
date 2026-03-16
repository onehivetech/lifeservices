'use client'

import { useWizardStore } from '@/store/wizardStore'
import { WizardLayout } from './WizardLayout'
import { Step1Address } from './Step1Address'
import { Step2PropertyDetails } from './Step2PropertyDetails'
import { Step3AccessNotes } from './Step3AccessNotes'
import { Step4PackageAddons } from './Step4PackageAddons'
import { Step5LockInCadence } from './Step5LockInCadence'
import { Step6Reveal } from './Step6Reveal'

const STEP_META = [
  {
    title: "What's your address?",
    subtitle: "We'll look up your property to estimate mowable area and confirm we service your suburb.",
  },
  {
    title: 'Tell us about your property',
    subtitle: "A few quick details so we can price your service accurately — takes 30 seconds.",
  },
  {
    title: 'Access & preferences',
    subtitle: "Help us prepare for your first visit. All fields optional.",
  },
  {
    title: 'Choose your plan',
    subtitle: "Pick your mowing tier and any add-on services. No pricing shown yet — that comes in the final step.",
  },
  {
    title: 'Lock-in & payment',
    subtitle: "Choose how you'd like to commit and how often you want to be billed.",
  },
  {
    title: 'Your instant estimate',
    subtitle: "Based on your property and selections — confirmed by our team within 24 hours.",
  },
]

export function PropertyWizard() {
  const { currentStep, nextStep, prevStep } = useWizardStore()
  const step = STEP_META[currentStep - 1]

  return (
    <WizardLayout
      currentStep={currentStep}
      title={step.title}
      subtitle={step.subtitle}
      onBack={currentStep > 1 ? prevStep : undefined}
      wide={currentStep === 6}
    >
      {currentStep === 1 && <Step1Address onNext={nextStep} />}
      {currentStep === 2 && <Step2PropertyDetails onNext={nextStep} onBack={prevStep} />}
      {currentStep === 3 && <Step3AccessNotes onNext={nextStep} onBack={prevStep} />}
      {currentStep === 4 && <Step4PackageAddons onNext={nextStep} onBack={prevStep} />}
      {currentStep === 5 && <Step5LockInCadence onNext={nextStep} onBack={prevStep} />}
      {currentStep === 6 && <Step6Reveal onBack={prevStep} />}
    </WizardLayout>
  )
}
