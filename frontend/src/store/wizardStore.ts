import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WizardFormData, Tier, ContractType, PaymentCadence, AddonSelection, BlockType, HomeType, ContactPreference } from '@/types'

interface WizardState {
  currentStep: number
  formData: WizardFormData
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<WizardFormData>) => void
  resetWizard: () => void
}

const initialFormData: WizardFormData = {
  address: '',
  suburb: '',
  mowableAreaM2: null,
  lat: null,
  lng: null,
  blockType: null,
  homeType: null,
  grassLocations: [],
  hasPool: false,
  accessIssues: [],
  accessNotes: '',
  preferredContact: 'EMAIL',
  hearAboutUs: '',
  notes: '',
  tier: null,
  addons: [],
  contractType: null,
  paymentCadence: null,
  estimatedWeeklyPrice: null,
  estimatedTotalMonthly: null,
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 6),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetWizard: () =>
        set({
          currentStep: 1,
          formData: initialFormData,
        }),
    }),
    {
      name: 'life-services-wizard',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
      }),
    }
  )
)
