import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LIFE Services — Get your LIFE back',
  description:
    'Premium property maintenance subscriptions in Banyo, Brisbane. Lawn mowing, pest control, pressure washing, gutter cleaning & more — done for you, on a schedule.',
  keywords: 'lawn mowing Brisbane, property maintenance subscription, Banyo lawn care, LIFE Services',
  openGraph: {
    title: 'LIFE Services — Get your LIFE back',
    description: 'Premium property maintenance subscriptions in Brisbane.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-bg text-brand-navy antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#1A3C5E',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
