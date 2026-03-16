import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const trustPoints = [
  'Free initial property refresh',
  'Pricing confirmed within 24 hours',
  'No upfront payment required',
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#1e4a73] to-brand-navy text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              Now serving Banyo &amp; surrounds
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              Get your{' '}
              <span className="text-brand-green">LIFE</span>{' '}
              back.
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-lg">
              Your yard, sorted. A subscription that covers lawn mowing, pest control, pressure washing &amp; more — all done for you, on a regular schedule.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/packages" className="btn-primary text-base py-4 px-8">
                Get My Instant Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-it-works" className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 text-base py-4 px-8">
                How It Works
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Right: before/after placeholder */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800 aspect-[4/3]">
              {/* Placeholder for before/after photo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-3">🌿</div>
                  <p className="font-semibold">Before &amp; After</p>
                  <p className="text-sm mt-1">Brisbane yard transformation</p>
                </div>
              </div>
              {/* Before/After label */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">BEFORE</span>
                <span className="bg-brand-green/90 text-white text-xs font-bold px-3 py-1 rounded-full">AFTER</span>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white text-brand-navy rounded-2xl shadow-xl p-4 max-w-[180px]">
              <div className="text-3xl font-black text-brand-green mb-1">200+</div>
              <div className="text-xs font-semibold text-gray-600 leading-tight">Happy Brisbane homeowners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
