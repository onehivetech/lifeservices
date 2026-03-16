/**
 * Minimal Google Maps type declarations for use in Step1Address.
 * The full @types/google.maps package can be added later; this
 * covers the subset of the API we actually use.
 */

declare namespace google {
  namespace maps {
    function event(this: void): void
    namespace event {
      function clearInstanceListeners(instance: object): void
    }
    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
    }
    class LatLngBounds {
      constructor(sw: { lat: number; lng: number }, ne: { lat: number; lng: number })
      getNorthEast(): LatLng
      getSouthWest(): LatLng
    }
    namespace places {
      interface AutocompleteOptions {
        componentRestrictions?: { country: string | string[] }
        fields?: string[]
        types?: string[]
        bounds?: LatLngBounds
      }
      interface PlaceResult {
        formatted_address?: string
        geometry?: {
          location?: LatLng
          viewport?: LatLngBounds
        }
        address_components?: Array<{
          long_name: string
          short_name: string
          types: string[]
        }>
      }
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          options?: AutocompleteOptions
        )
        addListener(eventName: string, handler: () => void): void
        getPlace(): PlaceResult
      }
    }
  }
}
