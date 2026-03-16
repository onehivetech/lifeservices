import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Get a Quote — LIFE Services',
  description: 'Complete our 6-step property wizard to get your personalised maintenance subscription quote.',
}

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg">
        {/* Wizard will be implemented in Stage 3 */}
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="section-heading mb-4">Get Your Personalised Quote</h1>
          <p className="section-sub mx-auto">
            The property profile wizard is coming in Stage 3. Stay tuned!
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
