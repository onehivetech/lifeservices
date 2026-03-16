import { useMemo } from 'react'
import { calculatePriceEstimate, wizardAddonsToInputs, type PriceEstimate } from '@/lib/pricing'
import { useWizardStore } from '@/store/wizardStore'

/**
 * Computes a live price estimate from the current wizard store state.
 * Returns null if required fields (tier, contractType, paymentCadence) aren't set yet.
 */
export function usePriceEstimate(): PriceEstimate | null {
  const { formData } = useWizardStore()

  return useMemo(() => {
    const { tier, contractType, paymentCadence } = formData
    if (!tier || !contractType || !paymentCadence) return null

    return calculatePriceEstimate({
      mowableAreaM2: formData.mowableAreaM2,
      blockType: formData.blockType,
      homeType: formData.homeType,
      grassLocations: formData.grassLocations,
      hasPool: formData.hasPool,
      tier,
      contractType,
      paymentCadence,
      addons: wizardAddonsToInputs(formData.addons),
    })
  }, [formData])
}

/**
 * Returns estimated price for a specific tier without touching wizard state.
 * Useful for tier comparison cards.
 */
export function useTierEstimate(tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'): PriceEstimate | null {
  const { formData } = useWizardStore()

  return useMemo(() => {
    const { contractType, paymentCadence } = formData
    if (!contractType || !paymentCadence) return null

    return calculatePriceEstimate({
      mowableAreaM2: formData.mowableAreaM2,
      blockType: formData.blockType,
      homeType: formData.homeType,
      grassLocations: formData.grassLocations,
      hasPool: formData.hasPool,
      tier,
      contractType,
      paymentCadence,
      addons: [],
    })
  }, [formData, tier])
}
