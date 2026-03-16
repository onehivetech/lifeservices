import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'My Dashboard — LIFE Services',
}

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg">
        {/* Dashboard will be implemented in Stage 5 */}
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="section-heading mb-4">My LIFE Dashboard</h1>
          <p className="section-sub mx-auto">
            Customer dashboard coming in Stage 5.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
