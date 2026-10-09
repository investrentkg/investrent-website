'use client'

import { useEffect } from 'react'
import { captureAttribution, registerMarketingConsentCheck } from '@/lib/attribution'
import { hasAttributionConsent, onConsentChange } from '@/lib/consentStore'

// Zapisuje parametry kampanii (utm_*, flaga fbclid) przy wejsciu na dowolna strone - ale WYLACZNIE za zgoda
// "Marketingowe" z banera (website#35, klucz attribution; to NIE jest zgoda "Reklamowe"/Pixel - te sa rozlaczne).
// Bez zgody nic nie zapisuje; po udzieleniu zgody zapisuje parametry z biezacego adresu; po wycofaniu klucz sessionStorage
// kasuje applyChoice (consentStore, clearAttribution). Nic nie renderuje, nie laduje skryptow, nie loguje wartosci.
registerMarketingConsentCheck(hasAttributionConsent)

export default function AttributionCapture() {
  useEffect(() => {
    if (hasAttributionConsent()) captureAttribution(window.location.search)
    return onConsentChange((_analytics, attribution) => {
      if (attribution) captureAttribution(window.location.search)
    })
  }, [])
  return null
}