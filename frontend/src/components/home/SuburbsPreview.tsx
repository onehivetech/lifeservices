import Link from 'next/link'
import { MapPin } from 'lucide-react'

const suburbs = [
  'Banyo', 'Nudgee', 'Nundah', 'Zillmere',
  'Aspley', 'Bracken Ridge', 'Northgate', 'Virginia',
  'Geebung', 'Boondall', 'Shorncliffe', 'Sandgate',
]

export function SuburbsPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-heading mb-4">We service your suburb</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Based in Banyo, we cover Brisbane's north and north-east. If you're in one of these suburbs (or nearby), we'd love to help.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {suburbs.map((suburb) => (
                <span
                  key={suburb}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg text-brand-navy text-sm font-medium rounded-full border border-gray-200"
                >
                  <MapPin className="w-3 h-3 text-brand-teal" />
                  {suburb}
                </span>
              ))}
            </div>
            <Link href="/suburbs" className="btn-outline-green">
              View full service area
            </Link>
          </div>
          {/* Map placeholder */}
          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-3">🗺️</div>
              <p className="font-semibold">Service Area Map</p>
              <p className="text-sm mt-1">Brisbane North & North-East</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
