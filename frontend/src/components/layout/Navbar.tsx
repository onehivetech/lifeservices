'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Packages', href: '/packages' },
  { label: 'Services', href: '/services' },
  { label: 'Suburbs', href: '/suburbs' },
  { label: 'Testimonials', href: '/testimonials' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <span className="text-2xl font-black text-brand-navy tracking-tight">LIFE</span>
              <Leaf className="absolute -top-1 -right-3 w-3.5 h-3.5 text-brand-green rotate-12" />
            </div>
            <div className="ml-3 flex flex-col leading-none">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Services</span>
              <span className="text-[10px] text-brand-teal font-medium">Get your LIFE back</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-brand-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
                  My Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-500 hover:text-brand-navy transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-navy transition-colors">
                  Sign in
                </Link>
                <Link href="/packages" className="btn-primary text-sm py-2 px-5">
                  Get a Quote
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-bg rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 px-3">
                {session ? (
                  <>
                    <Link href="/dashboard" className="btn-secondary text-sm justify-center">My Dashboard</Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-gray-500 text-center py-2">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/packages" className="btn-primary text-sm justify-center">Get a Quote</Link>
                    <Link href="/login" className="btn-secondary text-sm justify-center">Sign in</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
