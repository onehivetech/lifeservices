import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Bronze',
    cadence: 'Every 6 weeks',
    includes: ['Lawn mowing', 'Edging & weeding', 'Basic tidy-up'],
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    popular: false,
  },
  {
    name: 'Silver',
    cadence: 'Every 4 weeks',
    includes: ['All Bronze inclusions', 'Hedge trimming', 'Basic pest control', 'Driveway spot clean'],
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    popular: true,
  },
  {
    name: 'Gold',
    cadence: 'Monthly / 3-weekly (summer)',
    includes: ['All Silver inclusions', 'Quarterly pressure wash', 'Advanced pest control', '1hr handyman/month'],
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    popular: false,
  },
  {
    name: 'Platinum',
    cadence: '3-weekly / fortnightly (summer)',
    includes: ['All Gold inclusions', 'Small carpentry/plastering', 'Annual full refresh', 'Priority booking'],
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    popular: false,
  },
]

export function PackagesPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-heading">Pick your plan</h2>
          <p className="section-sub mx-auto">Every plan includes a free initial property refresh. Prices calculated to your specific block.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl border-2 p-6 flex flex-col',
                tier.popular ? 'border-brand-green shadow-xl shadow-brand-green/10' : tier.border,
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-green text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', tier.bg)}>
                <span className={cn('font-black text-sm', tier.color)}>{tier.name[0]}</span>
              </div>
              <h3 className={cn('text-xl font-black mb-1', tier.color)}>{tier.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{tier.cadence}</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/packages"
                className={cn(
                  'text-center text-sm font-semibold py-2.5 rounded-xl transition-colors',
                  tier.popular
                    ? 'bg-brand-green text-white hover:bg-green-600'
                    : 'border-2 border-current text-brand-navy hover:bg-brand-bg ' + tier.color,
                )}
              >
                Get {tier.name} Quote
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Prices personalised to your property — complete the 6-step wizard to see your exact quote.
        </p>
      </div>
    </section>
  )
}
