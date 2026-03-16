'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Loader2, AlertCircle, CheckCircle2, Search } from 'lucide-react'
import { useWizardStore } from '@/store/wizardStore'
import { cn } from '@/lib/utils'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

interface Step1Props {
  onNext: () => void
}

/**
 * Uses Google Maps Places Autocomplete to:
 *  1. Autocomplete the address in Brisbane/QLD
 *  2. Reverse-geocode to pull suburb
 *  3. Estimate mowable area from the parcel/lot geometry
 *     (if available via Maps JS API polygon data)
 *
 * Falls back gracefully to manual text input when no API key is present.
 */
export function Step1Address({ onNext }: Step1Props) {
  const { formData, updateFormData } = useWizardStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const [inputValue, setInputValue] = useState(formData.address || '')
  const [apiLoaded, setApiLoaded] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [areaEstimating, setAreaEstimating] = useState(false)
  const [areaSource, setAreaSource] = useState<'maps' | 'estimate' | null>(
    formData.mowableAreaM2 ? 'estimate' : null
  )

  // Load Google Maps JS API
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setApiError(true)
      return
    }

    if (window.google?.maps?.places) {
      setApiLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
    script.async = true
    script.onload = () => setApiLoaded(true)
    script.onerror = () => setApiError(true)
    document.head.appendChild(script)

    return () => {
      // Script persists for the session; don't remove it
    }
  }, [])

  // Initialise autocomplete once Maps is loaded
  useEffect(() => {
    if (!apiLoaded || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'AU' },
      fields: ['formatted_address', 'geometry', 'address_components'],
      types: ['address'],
      bounds: new window.google.maps.LatLngBounds(
        { lat: -27.8, lng: 152.6 },  // SW Brisbane
        { lat: -26.9, lng: 153.5 },  // NE Brisbane
      ),
    })

    autocompleteRef.current.addListener('place_changed', handlePlaceChanged)

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiLoaded])

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace()
    if (!place?.geometry?.location) return

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    // Extract suburb from address components
    const components = place.address_components || []
    const suburb =
      components.find((c) => c.types.includes('locality'))?.long_name ||
      components.find((c) => c.types.includes('sublocality'))?.long_name ||
      ''

    setInputValue(place.formatted_address || '')
    updateFormData({
      address: place.formatted_address || '',
      suburb,
      lat,
      lng,
    })

    // Attempt to estimate mowable area from the lot viewport bounds
    estimateMowableArea(place, lat, lng)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFormData])

  /**
   * Estimates mowable area from the place viewport.
   * The Google Places API doesn't return lot polygon data directly, so we use
   * the viewport bounding box as a rough proxy for the lot size.
   * A more accurate approach would use the Maps Tile API or a parcel data service.
   *
   * For typical Brisbane residential blocks this gives a reasonable starting estimate
   * that the team will confirm in the 24hr review.
   */
  function estimateMowableArea(
    place: google.maps.places.PlaceResult,
    lat: number,
    lng: number
  ) {
    setAreaEstimating(true)

    try {
      const viewport = place.geometry?.viewport
      if (viewport) {
        const ne = viewport.getNorthEast()
        const sw = viewport.getSouthWest()

        // Approximate dimensions in metres using the Haversine-derived factor
        const latDiff = Math.abs(ne.lat() - sw.lat())
        const lngDiff = Math.abs(ne.lng() - sw.lng())
        const latMetres = latDiff * 111_000
        const lngMetres = lngDiff * 111_000 * Math.cos((lat * Math.PI) / 180)

        // The viewport typically covers more than just the property,
        // so we apply a reduction factor for typical residential lots
        // and subtract house footprint (assumed ~20% of lot for Brisbane low-set)
        const rawM2 = latMetres * lngMetres
        let estimatedM2: number

        if (rawM2 < 1000) {
          // Small lot — viewport is tight, use as-is minus house footprint
          estimatedM2 = Math.round(rawM2 * 0.55)
        } else {
          // Larger viewport; parcel is usually a fraction of it
          estimatedM2 = Math.round(Math.min(rawM2 * 0.15, 1200))
        }

        // Clamp to sensible Brisbane residential range (50 – 2000 m²)
        estimatedM2 = Math.max(50, Math.min(2000, estimatedM2))

        updateFormData({ mowableAreaM2: estimatedM2 })
        setAreaSource('maps')
      } else {
        // No viewport: fall back to typical Brisbane medium block
        updateFormData({ mowableAreaM2: 350 })
        setAreaSource('estimate')
      }
    } catch {
      updateFormData({ mowableAreaM2: 350 })
      setAreaSource('estimate')
    } finally {
      setAreaEstimating(false)
    }
  }

  function handleManualInput(value: string) {
    setInputValue(value)
    // Update address in store (suburb/lat/lng not available without autocomplete)
    updateFormData({ address: value, suburb: '', lat: null, lng: null, mowableAreaM2: null })
    setAreaSource(null)
  }

  function handleManualArea(value: string) {
    const num = parseFloat(value)
    if (!isNaN(num) && num > 0) {
      updateFormData({ mowableAreaM2: num })
      setAreaSource('estimate')
    } else {
      updateFormData({ mowableAreaM2: null })
      setAreaSource(null)
    }
  }

  const isValid = inputValue.trim().length >= 5

  return (
    <div>
      <div className="mb-6">
        <label className="label">
          Your property address
        </label>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleManualInput(e.target.value)}
            placeholder="Start typing your Brisbane address…"
            className="input pl-9 pr-10"
            autoComplete="off"
          />
          {inputValue && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {areaEstimating
                ? <Loader2 className="w-4 h-4 text-brand-teal animate-spin" />
                : isValid
                ? <CheckCircle2 className="w-4 h-4 text-brand-green" />
                : null}
            </div>
          )}
        </div>

        {apiError && !GOOGLE_MAPS_API_KEY && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Address autocomplete not available (Google Maps API key not configured). Enter your address manually.
          </p>
        )}
        {apiError && GOOGLE_MAPS_API_KEY && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Could not load address autocomplete. Please type your address manually.
          </p>
        )}
        {!apiError && GOOGLE_MAPS_API_KEY && !apiLoaded && (
          <p className="mt-2 text-xs text-gray-400 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            Loading address search…
          </p>
        )}
      </div>

      {/* Suburb (auto-populated or manual) */}
      <div className="mb-6">
        <label className="label">Suburb</label>
        <input
          type="text"
          value={formData.suburb}
          onChange={(e) => updateFormData({ suburb: e.target.value })}
          placeholder="e.g. Nudgee"
          className="input"
        />
      </div>

      {/* Mowable area */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <label className="label mb-0">Estimated mowable area (m²)</label>
        </div>

        <div className="relative">
          <input
            type="number"
            value={formData.mowableAreaM2 ?? ''}
            onChange={(e) => handleManualArea(e.target.value)}
            placeholder="e.g. 350"
            min={10}
            max={5000}
            className="input pr-12"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            m²
          </span>
        </div>

        {areaSource === 'maps' && formData.mowableAreaM2 && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-teal font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Auto-estimated from your property ({formData.mowableAreaM2} m²). You can adjust this.
          </p>
        )}
        {areaSource === 'estimate' && formData.mowableAreaM2 && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Using a typical estimate. Our team will measure your exact area before confirming your price.
          </p>
        )}
        {!formData.mowableAreaM2 && (
          <p className="mt-2 text-xs text-gray-400">
            Not sure? Leave blank and we'll estimate it from your address. You can always update it.
          </p>
        )}
      </div>

      {/* Suburb chips for quick selection (common service suburbs) */}
      {!formData.suburb && (
        <div className="mb-8">
          <p className="text-xs text-gray-500 mb-2">Common suburbs we serve:</p>
          <div className="flex flex-wrap gap-2">
            {['Banyo', 'Nudgee', 'Nundah', 'Zillmere', 'Aspley', 'Bracken Ridge', 'Northgate', 'Boondall'].map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateFormData({ suburb: s })}
                  className="text-xs px-3 py-1 bg-brand-bg text-brand-navy rounded-full border border-gray-200 hover:border-brand-teal hover:bg-brand-teal/5 transition-colors"
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!isValid}
        className={cn(
          'w-full btn-primary justify-center',
          !isValid && 'opacity-50 cursor-not-allowed',
        )}
      >
        Continue to Property Details
      </button>
    </div>
  )
}
