'use client'

import { useWizardStore } from '@/store/wizardStore'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'
import { Check, Star, Info, ChevronDown } from 'lucide-react'
import type { Tier, AddonType, AddonFrequency } from '@/types'

interface Step4Props {
  onNext: () => void
  onBack: () => void
}

// ─────────────────────────────────────────────
// TIER DATA (no prices — shown in Step 6 only)
// ─────────────────────────────────────────────

interface TierCard {
  tier: Tier
  label: string
  cadence: string
  tagline: string
  includes: string[]
  popular: boolean
  accentColor: string
  bgColor: string
  borderColor: string
  textColor: string
}

const TIER_CARDS: TierCard[] = [
  {
    tier: 'BRONZE',
    label: 'Bronze',
    cadence: 'Every 6 weeks',
    tagline: 'Keep it tidy, year-round.',
    includes: [
      'Lawn mowing',
      'Edging & weeding',
      'Basic tidy-up',
    ],
    popular: false,
    accentColor: '#92400E',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-800',
  },
  {
    tier: 'SILVER',
    label: 'Silver',
    cadence: 'Every 4 weeks',
    tagline: 'Our most popular plan.',
    includes: [
      'All Bronze inclusions',
      'Hedge trimming',
      'Basic pest control',
      'Driveway spot clean',
    ],
    popular: true,
    accentColor: '#4B5563',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-700',
  },
  {
    tier: 'GOLD',
    label: 'Gold',
    cadence: 'Monthly / 3-weekly (summer)',
    tagline: 'More visits, more coverage.',
    includes: [
      'All Silver inclusions',
      'Quarterly pressure wash',
      'Advanced pest control',
      '1 hr handyman per month',
    ],
    popular: false,
    accentColor: '#B45309',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-800',
  },
  {
    tier: 'PLATINUM',
    label: 'Platinum',
    cadence: '3-weekly / fortnightly (summer)',
    tagline: 'The full set-and-forget package.',
    includes: [
      'All Gold inclusions',
      'Small carpentry / plastering (up to $300)',
      'Annual full property refresh',
      'Priority booking',
    ],
    popular: false,
    accentColor: '#6D28D9',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-800',
  },
]

// ─────────────────────────────────────────────
// ADD-ON DATA
// ─────────────────────────────────────────────

interface AddonConfig {
  addonType: AddonType
  label: string
  description: string
  icon: string
  frequencies: { value: AddonFrequency; label: string }[]
  defaultFrequency: AddonFrequency
  blockSizes?: number[]  // gardening only
  defaultBlockSize?: number
}

const ADDON_CONFIGS: AddonConfig[] = [
  {
    addonType: 'PEST_CONTROL',
    label: 'Pest Control',
    description: 'Whole-home spray — spiders, cockroaches, ants & more. Done within 2 weeks of signup.',
    icon: '🐛',
    frequencies: [
      { value: 'ONE_OFF', label: 'One-off' },
      { value: 'MONTHLY', label: 'Monthly (12 payments)' },
    ],
    defaultFrequency: 'ONE_OFF',
  },
  {
    addonType: 'PRESSURE_WASHING',
    label: 'Pressure Washing',
    description: 'Driveway, paths, patios & fences blasted clean.',
    icon: '💧',
    frequencies: [
      { value: 'ONE_OFF', label: 'One-off' },
      { value: 'EVERY_3_MONTHS', label: 'Every 3 months' },
      { value: 'EVERY_6_MONTHS', label: 'Every 6 months' },
      { value: 'ANNUALLY', label: 'Annually' },
    ],
    defaultFrequency: 'EVERY_6_MONTHS',
  },
  {
    addonType: 'GUTTER_CLEANING',
    label: 'Gutter Cleaning',
    description: 'Clear gutters and downpipes — prevents water damage and mosquito breeding.',
    icon: '🏗️',
    frequencies: [
      { value: 'ONE_OFF', label: 'One-off' },
      { value: 'EVERY_6_MONTHS', label: 'Every 6 months' },
      { value: 'ANNUALLY', label: 'Annually' },
    ],
    defaultFrequency: 'EVERY_6_MONTHS',
  },
  {
    addonType: 'GARDENING',
    label: 'Gardening Blocks',
    description: 'Weeding, pruning, garden bed maintenance. Priced per timed block at $2.20/min.',
    icon: '🌱',
    frequencies: [
      { value: 'ONE_OFF', label: 'One-off' },
      { value: 'EVERY_VISIT', label: 'Every mowing visit' },
      { value: 'EVERY_SECOND_VISIT', label: 'Every 2nd visit' },
      { value: 'EVERY_3_MONTHS', label: 'Every 3 months' },
      { value: 'EVERY_6_MONTHS', label: 'Every 6 months' },
      { value: 'ANNUALLY', label: 'Annually' },
    ],
    defaultFrequency: 'EVERY_VISIT',
    blockSizes: [15, 30, 45, 60],
    defaultBlockSize: 30,
  },
  {
    addonType: 'HANDYMAN',
    label: 'Handyman',
    description: 'Minor repairs, odd jobs, installations. 1 hour per visit at a fixed rate.',
    icon: '🔧',
    frequencies: [
      { value: 'ONE_OFF', label: 'One-off' },
      { value: 'MONTHLY', label: 'Monthly' },
      { value: 'EVERY_3_MONTHS', label: 'Every 3 months' },
    ],
    defaultFrequency: 'ONE_OFF',
  },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function Step4PackageAddons({ onNext, onBack }: Step4Props) {
  const { formData, updateFormData } = useWizardStore()

  function selectTier(tier: Tier) {
    updateFormData({ tier })
  }

  function toggleAddon(addonType: AddonType) {
    const config = ADDON_CONFIGS.find((a) => a.addonType === addonType)!
    const current = formData.addons
    const existing = current.find((a) => a.addonType === addonType)

    if (existing) {
      // Remove
      updateFormData({ addons: current.filter((a) => a.addonType !== addonType) })
    } else {
      // Add with defaults
      updateFormData({
        addons: [
          ...current,
          {
            addonType,
            enabled: true,
            frequency: config.defaultFrequency,
            blockSize: config.defaultBlockSize,
          },
        ],
      })
    }
  }

  function updateAddonFrequency(addonType: AddonType, frequency: AddonFrequency) {
    updateFormData({
      addons: formData.addons.map((a) =>
        a.addonType === addonType ? { ...a, frequency } : a
      ),
    })
  }

  function updateAddonBlockSize(addonType: AddonType, blockSize: number) {
    updateFormData({
      addons: formData.addons.map((a) =>
        a.addonType === addonType ? { ...a, blockSize } : a
      ),
    })
  }

  const isValid = formData.tier !== null

  return (
    <div>
      {/* No-pricing notice */}
      <div className="flex items-start gap-2.5 p-3 bg-brand-teal/10 border border-brand-teal/30 rounded-xl mb-6">
        <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
        <p className="text-xs text-brand-navy leading-relaxed">
          <span className="font-semibold">No prices shown yet.</span> Complete all 6 steps to see your personalised quote. Pricing is calculated from your specific property details.
        </p>
      </div>

      {/* Tier selection */}
      <div className="mb-8">
        <label className="label text-base mb-1">Choose your mowing plan</label>
        <p className="text-xs text-gray-500 mb-4">All plans include your first service free as a property refresh.</p>

        <div className="grid gap-3">
          {TIER_CARDS.map((card) => {
            const isSelected = formData.tier === card.tier
            return (
              <button
                key={card.tier}
                type="button"
                onClick={() => selectTier(card.tier)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-brand-green ring-2 ring-brand-green/20 shadow-sm'
                    : `${card.borderColor} hover:border-brand-teal`,
                  card.bgColor,
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Selection dot */}
                  <div
                    className={cn(
                      'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                      isSelected ? 'border-brand-green bg-brand-green' : 'border-gray-300 bg-white',
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={cn('font-black text-base', card.textColor)}
                        style={{ color: card.accentColor }}
                      >
                        {card.label}
                      </span>
                      {card.popular && (
                        <span className="inline-flex items-center gap-1 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Star className="w-2.5 h-2.5" /> Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">{card.cadence}</p>
                    <p className="text-xs text-gray-500 mb-2 italic">{card.tagline}</p>
                    <ul className="flex flex-col gap-1">
                      {card.includes.map((item) => (
                        <li key={item} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Check className="w-3 h-3 text-brand-green shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Standalone plan note */}
        <p className="mt-3 text-xs text-gray-400 text-center">
          Want add-ons only (no mowing)? You can choose that on the next screen.
        </p>
      </div>

      {/* Add-ons */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <label className="label text-base mb-0">Add-on services</label>
          <Tooltip content="Add-ons are independent services you can bundle with your mowing plan or order standalone. Pricing shown on the final step." />
        </div>
        <p className="text-xs text-gray-500 mb-4">
          All optional. Each add-on runs on its own schedule alongside your mowing visits.
        </p>

        <div className="flex flex-col gap-3">
          {ADDON_CONFIGS.map((config) => {
            const selected = formData.addons.find((a) => a.addonType === config.addonType)
            const isEnabled = !!selected

            return (
              <div
                key={config.addonType}
                className={cn(
                  'rounded-xl border-2 overflow-hidden transition-all duration-200',
                  isEnabled
                    ? 'border-brand-green bg-brand-green/5'
                    : 'border-gray-200 bg-white',
                )}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => toggleAddon(config.addonType)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <span className="text-2xl shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-navy text-sm">{config.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{config.description}</p>
                  </div>
                  {/* Toggle switch */}
                  <div
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors duration-200',
                      isEnabled ? 'bg-brand-green' : 'bg-gray-300',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
                        isEnabled ? 'translate-x-6' : 'translate-x-1',
                      )}
                    />
                  </div>
                </button>

                {/* Expanded controls when enabled */}
                {isEnabled && selected && (
                  <div className="px-4 pb-4 pt-0 border-t border-brand-green/20 bg-white">
                    <div className="flex flex-wrap gap-3 mt-3">
                      {/* Frequency selector */}
                      <div className="flex-1 min-w-[140px]">
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                          Frequency
                        </label>
                        <div className="relative">
                          <select
                            value={selected.frequency}
                            onChange={(e) =>
                              updateAddonFrequency(config.addonType, e.target.value as AddonFrequency)
                            }
                            className="input py-2 pr-8 text-sm appearance-none"
                          >
                            {config.frequencies.map((f) => (
                              <option key={f.value} value={f.value}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Block size selector (gardening only) */}
                      {config.blockSizes && (
                        <div className="flex-1 min-w-[120px]">
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            Block size
                          </label>
                          <div className="flex gap-1.5">
                            {config.blockSizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => updateAddonBlockSize(config.addonType, size)}
                                className={cn(
                                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                                  selected.blockSize === size
                                    ? 'bg-brand-green border-brand-green text-white'
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-brand-teal',
                                )}
                              >
                                {size}m
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {selected.blockSize ? `${selected.blockSize} min = $${(selected.blockSize * 2.20).toFixed(0)}/visit` : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
          {!isValid ? 'Select a plan to continue' : 'Choose Contract Type'}
        </button>
      </div>
    </div>
  )
}
