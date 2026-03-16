import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface RadioCardProps {
  selected: boolean
  onSelect: () => void
  title: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  icon,
  disabled = false,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={!disabled ? onSelect : undefined}
      disabled={disabled}
      className={cn(
        'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3',
        selected
          ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20'
          : 'border-gray-200 bg-white hover:border-brand-teal hover:bg-brand-teal/5',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {icon && (
        <div className="mt-0.5 text-2xl shrink-0">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-navy text-sm">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div
        className={cn(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
          selected ? 'border-brand-green bg-brand-green' : 'border-gray-300',
        )}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  )
}
