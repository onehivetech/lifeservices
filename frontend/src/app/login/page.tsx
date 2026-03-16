'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.ok) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    } else {
      toast.error('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative">
              <span className="text-3xl font-black text-brand-navy">LIFE</span>
              <Leaf className="absolute -top-1 -right-3 w-4 h-4 text-brand-green rotate-12" />
            </div>
          </Link>
          <p className="text-brand-teal font-medium text-sm mt-2">Get your LIFE back</p>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to manage your subscriptions</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary justify-center mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/packages" className="text-brand-green font-semibold hover:underline">
                Get a quote to get started
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
