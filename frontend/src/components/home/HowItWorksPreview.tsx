import Link from 'next/link'
import { ClipboardList, Calculator, CalendarCheck, Smile } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Tell us about your property',
    desc: 'Fill in our quick 6-step property profile. Address, grass areas, access notes — takes under 3 minutes.',
  },
  {
    icon: Calculator,
    step: '02',
    title: 'Get your instant estimate',
    desc: 'We calculate a personalised quote based on your block, tier choice, and add-ons.',
  },
  {
    icon: CalendarCheck,
    step: '03',
    title: 'We confirm within 24 hours',
    desc: 'Our team reviews your property and locks in your exact pricing. You choose your start week.',
  },
  {
    icon: Smile,
    step: '04',
    title: 'Relax — we\'ve got this',
    desc: 'Your subscription runs on autopilot. Regular visits, automatic billing, no chasing required.',
  },
]

export function HowItWorksPreview() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-heading">How it works</h2>
          <p className="section-sub mx-auto">Four simple steps to a property that takes care of itself.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="card relative">
              <div className="absolute top-4 right-4 text-5xl font-black text-gray-100 leading-none select-none">
                {step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="font-bold text-brand-navy text-base mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/how-it-works" className="btn-outline-green">
            Learn more about the process
          </Link>
        </div>
      </div>
    </section>
  )
}
