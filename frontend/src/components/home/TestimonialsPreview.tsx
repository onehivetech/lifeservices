import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah M.',
    suburb: 'Nudgee',
    rating: 5,
    text: "I've had 3 different lawn guys in the past two years. LIFE Services is the first one who just… shows up. Every time. Exactly when they say. My yard has never looked better.",
    plan: 'Silver',
  },
  {
    name: 'James K.',
    suburb: 'Nundah',
    rating: 5,
    text: 'The Gold plan is honestly a game changer. Mowing, pest control AND pressure washing all sorted with one subscription. I haven\'t thought about my yard in months.',
    plan: 'Gold',
  },
  {
    name: 'Michelle T.',
    suburb: 'Aspley',
    rating: 5,
    text: 'Super easy to sign up. The quote wizard took me maybe 4 minutes, they confirmed pricing the next morning, and the team arrived the following week. No fuss.',
    plan: 'Bronze',
  },
]

export function TestimonialsPreview() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-heading">Brisbane homeowners love it</h2>
          <p className="section-sub mx-auto">Don't take our word for it — here's what your neighbours are saying.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card flex flex-col">
              <Quote className="w-8 h-8 text-brand-green/30 mb-3" />
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">{t.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-brand-navy text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.suburb} · {t.plan} plan</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
