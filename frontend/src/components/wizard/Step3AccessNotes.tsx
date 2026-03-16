'use client'

import { useWizardStore } from '@/store/wizardStore'
import { CheckCard } from '@/components/ui/CheckCard'
import { RadioCard } from '@/components/ui/RadioCard'
import { cn } from '@/lib/utils'
import type { ContactPreference } from '@/types'

interface Step3Props {
  onNext: () => void
  onBack: () => void
}

const ACCESS_ISSUES = [
  {
    id: 'GATE_CODE',
    title: 'Gate code required',
    description: 'Property has a coded gate',
    icon: '🔐',
  },
  {
    id: 'DOGS_ON_PROPERTY',
    title: 'Dogs on property',
    description: 'Dogs will be present during service',
    icon: '🐕',
  },
  {
    id: 'NARROW_SIDE_ACCESS',
    title: 'Narrow side access',
    description: 'Ride-on mower may not fit — manual mower required',
    icon: '↕️',
  },
  {
    id: 'PADLOCKED_GATE',
    title: 'Padlocked gate',
    description: 'We\'ll arrange key handover before first visit',
    icon: '🔒',
  },
]

const CONTACT_OPTIONS: { value: ContactPreference; title: string; icon: string }[] = [
  { value: 'CALL', title: 'Phone call', icon: '📞' },
  { value: 'TEXT', title: 'Text / SMS', icon: '💬' },
  { value: 'EMAIL', title: 'Email', icon: '📧' },
]

const HOW_HEARD_OPTIONS = [
  'Google',
  'Facebook / Instagram',
  'Letter drop / flyer',
  'Neighbour or friend',
  'Real estate agent',
  'Other',
]

export function Step3AccessNotes({ onNext, onBack }: Step3Props) {
  const { formData, updateFormData } = useWizardStore()

  function toggleAccessIssue(id: string) {
    const current = formData.accessIssues
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id]
    updateFormData({ accessIssues: updated })
  }

  // Step 3 is optional — all fields have defaults, always valid
  const isValid = formData.preferredContact !== null

  return (
    <div>
      {/* Access issues */}
      <div className="mb-7">
        <label className="label text-base mb-1">Any access issues?</label>
        <p className="text-xs text-gray-500 mb-3">Select all that apply — helps our team prepare for your first visit.</p>
        <div className="grid grid-cols-2 gap-3">
          {ACCESS_ISSUES.map((issue) => (
            <CheckCard
              key={issue.id}
              checked={formData.accessIssues.includes(issue.id)}
              onChange={() => toggleAccessIssue(issue.id)}
              icon={issue.icon}
              title={issue.title}
              description={issue.description}
            />
          ))}
        </div>
      </div>

      {/* Free-text access notes */}
      {(formData.accessIssues.includes('GATE_CODE') || formData.accessIssues.includes('PADLOCKED_GATE')) && (
        <div className="mb-7 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <label className="label text-sm mb-2">
            {formData.accessIssues.includes('GATE_CODE') ? 'Gate code' : 'Key / access details'}
          </label>
          <input
            type="text"
            value={formData.accessNotes}
            onChange={(e) => updateFormData({ accessNotes: e.target.value })}
            placeholder={formData.accessIssues.includes('GATE_CODE') ? 'e.g. Code is 1234' : 'e.g. Key under the mat'}
            className="input text-sm"
          />
          <p className="text-xs text-amber-700 mt-2">🔒 This is stored securely and only shared with your assigned technician.</p>
        </div>
      )}

      {/* Preferred contact */}
      <div className="mb-7">
        <label className="label text-base mb-3">Preferred way to contact you</label>
        <div className="grid grid-cols-3 gap-3">
          {CONTACT_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.value}
              selected={formData.preferredContact === opt.value}
              onSelect={() => updateFormData({ preferredContact: opt.value })}
              icon={opt.icon}
              title={opt.title}
            />
          ))}
        </div>
      </div>

      {/* How did you hear about us */}
      <div className="mb-7">
        <label className="label text-base mb-2">How did you hear about us?</label>
        <select
          value={formData.hearAboutUs}
          onChange={(e) => updateFormData({ hearAboutUs: e.target.value })}
          className="input"
        >
          <option value="">Select one…</option>
          {HOW_HEARD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* General notes */}
      <div className="mb-8">
        <label className="label text-base mb-2">Anything else we should know?</label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="e.g. Please avoid the herb garden near the back fence, or our dog will be tied up but he's friendly…"
          rows={3}
          className="input resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">Optional — any info that helps us do a better job.</p>
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
          Choose Your Package
        </button>
      </div>
    </div>
  )
}
