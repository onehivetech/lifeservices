import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaBanner() {
  return (
    <section className="py-20 bg-brand-navy text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Ready to get your{' '}
          <span className="text-brand-green">LIFE</span> back?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">
          Takes 3 minutes. No upfront payment. Free initial property refresh included for all new customers.
        </p>
        <Link href="/packages" className="btn-primary text-lg py-4 px-10">
          Start My Subscription <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-gray-500 text-sm mt-4">
          No credit card required to get your quote.
        </p>
      </div>
    </section>
  )
}
