import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { PropertyWizard } from '@/components/wizard/PropertyWizard'

export const metadata: Metadata = {
  title: 'Get Your Quote — LIFE Services',
  description:
    'Complete our 6-step property wizard to get a personalised maintenance subscription quote. Takes under 3 minutes.',
}

/**
 * /packages — the property profile wizard.
 * The Navbar is rendered outside the wizard so users can navigate away,
 * but the WizardLayout takes over the full page below the nav.
 */
export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <PropertyWizard />
    </>
  )
}
