import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = { title: 'Services — LIFE Services' }

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="section-heading mb-4">Our Services</h1>
          <p className="section-sub mx-auto">Full page coming in Stage 6.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
