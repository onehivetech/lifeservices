import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { HowItWorksPreview } from '@/components/home/HowItWorksPreview'
import { PackagesPreview } from '@/components/home/PackagesPreview'
import { TestimonialsPreview } from '@/components/home/TestimonialsPreview'
import { SuburbsPreview } from '@/components/home/SuburbsPreview'
import { CtaBanner } from '@/components/home/CtaBanner'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <HowItWorksPreview />
        <PackagesPreview />
        <TestimonialsPreview />
        <SuburbsPreview />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
