'use client'

import { useEffect } from 'react'
import { captureAttribution, registerMarketingConsentCheck } from '@/lib/attribution'
import { hasMarketingConsent, onConsentChange } from '@/lib/consentStore'

// Zapisuje parametry kampanii (utm_*, flaga fbclid) przy wejsciu na dowolna strone - ale WYLACZNIE za zgoda
// marketingowa z banera (website#35). Bez zgody nic nie zapisuje; po udzieleniu zgody zapisuje parametry z biezacego adresu;
// po wycofaniu zgody klucz sessionStorage kasuje applyChoice (consentStore). Nic nie renderuje, nie laduje skryptow, nie loguje wartosci.
registerMarketingConsentCheck(hasMarketingConsent)

export default function AttributionCapture() {
  useEffect(() => {
    if (hasMarketingConsent()) captureAttribution(window.location.search)
    return onConsentChange((_analytics, marketing) => {
      if (marketing) captureAttribution(window.location.search)
    })
  }, [])
  return null
}