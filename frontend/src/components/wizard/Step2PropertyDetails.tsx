'use client'

import { useWizardStore } from '@/store/wizardStore'
import { RadioCard } from '@/components/ui/RadioCard'
import { CheckCard } from '@/components/ui/CheckCard'
import { cn } from '@/lib/utils'
import type { BlockType, HomeType } from '@/types'

interface Step2Props {
  onNext: () => void
  onBack: () => void
}

const GRASS_LOCATIONS = [
  {
    id: 'FRONT_YARD',
    title: 'Front yard',
    description: 'Grass area between the house and the street',
    icon: '🏡',
  },
  {
    id: 'REAR_YARD',
    title: 'Rear yard',
    description: 'Backyard behind the house',
    icon: '🌿',
  },
  {
    id: 'SIDES',
    title: 'Side areas',
    description: 'Grass along the sides of the house',
    icon: '↔️',
  },
  {
    id: 'FULL_PERIMETER',
    title: 'Full perimeter',
    description: 'Grass right around the entire block',
    icon: '🔄',
  },
]

export function Step2PropertyDetails({ onNext, onBack }: Step2Props) {
  const { formData, updateFormData } = useWizardStore()

  function toggleGrassLocation(id: string) {
    const current = formData.grassLocations
    const updated = current.includes(id)
      ? current.filter((g) => g !== id)
      : [...current, id]
    updateFormData({ grassLocations: updated })
  }

  const isValid =
    formData.blockType !== null &&
    formData.homeType !== null &&
    formData.grassLocations.length > 0

  return (
    <div>
      {/* Block type */}
      <div className="mb-7">
        <label className="label text-base mb-3">Block type</label>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard
            selected={formData.blockType === 'CORNER'}
            onSelect={() => updateFormData({ blockType: 'CORNER' as BlockType })}
            icon="🔀"
            title="Corner block"
            description="Property sits on a street corner — more perimeter to mow"
          />
          <RadioCard
            selected={formData.blockType === 'INLINE'}
            onSelect={() => updateFormData({ blockType: 'INLINE' as BlockType })}
            icon="📏"
            title="Inline block"
            description="Standard mid-street block"
          />
        </div>
      </div>

      {/* Home type */}
      <div className="mb-7">
        <label className="label text-base mb-3">Home type</label>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard
            selected={formData.homeType === 'LOW_SET'}
            onSelect={() => updateFormData({ homeType: 'LOW_SET' as HomeType })}
            icon="🏠"
            title="Low set"
            description="Ground-level slab home"
          />
          <RadioCard
            selected={formData.homeType === 'HIGH_SET'}
            onSelect={() => updateFormData({ homeType: 'HIGH_SET' as HomeType })}
            icon="🏚️"
            title="High set"
            description="Raised on stumps/stilts — under-house access required"
          />
        </div>
      </div>

      {/* Grass locations */}
      <div className="mb-7">
        <label className="label text-base mb-3">
          Where is the grass?{' '}
          <span className="text-gray-400 font-normal">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {GRASS_LOCATIONS.map((loc) => (
            <CheckCard
              key={loc.id}
              checked={formData.grassLocations.includes(loc.id)}
              onChange={() => toggleGrassLocation(loc.id)}
              icon={loc.icon}
              title={loc.title}
              description={loc.description}
            />
          ))}
        </div>
        {formData.grassLocations.length === 0 && (
          <p className="text-xs text-red-500 mt-2">Please select at least one grass area.</p>
        )}
      </div>

      {/* Pool */}
      <div className="mb-8">
        <label className="label text-base mb-3">Does your property have a pool?</label>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard
            selected={formData.hasPool === true}
            onSelect={() => updateFormData({ hasPool: true })}
            icon="🏊"
            title="Yes, I have a pool"
            description="We'll include pool surround mowing and edging"
          />
          <RadioCard
            selected={formData.hasPool === false && formData.blockType !== null}
            onSelect={() => updateFormData({ hasPool: false })}
            icon="❌"
            title="No pool"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 justify-center">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={cn('btn-primary flex-1 justify-center', !isValid && 'opacity-50 cursor-not-allowed')}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
