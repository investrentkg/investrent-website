'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

// Zapisuje parametry kampanii (utm_*, flaga fbclid) przy wejsciu na dowolna strone.
// Nic nie renderuje, nie laduje zewnetrznych skryptow, nie loguje wartosci.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution(window.location.search)
  }, [])
  return null
}
