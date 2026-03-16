import Link from 'next/link'
import { Leaf, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'

const footerLinks = {
  Services: [
    { label: 'Lawn Mowing', href: '/services#mowing' },
    { label: 'Pest Control', href: '/services#pest' },
    { label: 'Pressure Washing', href: '/services#pressure' },
    { label: 'Gutter Cleaning', href: '/services#gutters' },
    { label: 'Gardening', href: '/services#gardening' },
    { label: 'Handyman', href: '/services#handyman' },
  ],
  Company: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Packages', href: '/packages' },
    { label: 'Suburbs We Serve', href: '/suburbs' },
    { label: 'Testimonials', href: '/testimonials' },
  ],
  Account: [
    { label: 'Get a Quote', href: '/packages' },
    { label: 'My Dashboard', href: '/dashboard' },
    { label: 'Sign In', href: '/login' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <span className="text-3xl font-black text-white tracking-tight">LIFE</span>
                <Leaf className="absolute -top-1 -right-3 w-4 h-4 text-brand-green rotate-12" />
              </div>
              <span className="ml-3 text-sm font-semibold text-gray-400 uppercase tracking-widest mt-1">Services</span>
            </div>
            <p className="text-brand-teal font-medium mb-4">Get your LIFE back.</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium property maintenance subscriptions. We handle your yard, pests, gutters & more — so you don't have to.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-teal shrink-0" />
                <span>Banyo, Brisbane QLD 4014</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-teal shrink-0" />
                <a href="tel:+61400000000" className="hover:text-white transition-colors">0400 000 000</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a href="mailto:hello@lifeservices.com.au" className="hover:text-white transition-colors">hello@lifeservices.com.au</a>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick quote form */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-6 max-w-xl">
            <h3 className="font-bold text-white mb-1">Quick quote</h3>
            <p className="text-gray-400 text-sm mb-4">Enter your address and we'll get back to you within 24 hours.</p>
            <form className="flex gap-3">
              <input
                type="text"
                placeholder="Your address in Brisbane..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
              />
              <button type="submit" className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap">
                Get Quote
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} LIFE Services. All rights reserved. ABN 00 000 000 000</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
