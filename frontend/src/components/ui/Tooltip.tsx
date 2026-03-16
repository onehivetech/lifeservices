'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  className?: string
}

export function Tooltip({ content, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span className={cn('relative inline-flex items-center', className)}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-gray-400 hover:text-brand-teal transition-colors"
        aria-label="More information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 px-3 py-2 bg-brand-navy text-white text-xs rounded-lg shadow-lg leading-relaxed pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-navy" />
        </div>
      )}
    </span>
  )
}
