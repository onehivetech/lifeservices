import { Shield, Clock, Star, Repeat } from 'lucide-react'

const items = [
  { icon: Shield, label: 'Fully Insured', sub: 'All staff background checked' },
  { icon: Clock, label: '24hr Confirmation', sub: 'Pricing confirmed fast' },
  { icon: Star, label: '5-Star Rated', sub: 'Brisbane homeowners love us' },
  { icon: Repeat, label: 'Set & Forget', sub: 'We handle the scheduling' },
]

export function TrustBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <p className="font-semibold text-brand-navy text-sm">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
