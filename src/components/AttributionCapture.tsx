'use client'

import { useEffect } from 'react'
import { captureAttribution, registerMarketingConsentCheck } from '@/lib/attribution'
import { hasAttributionConsent, hasGoogleAdsConsent, onConsentChange } from '@/lib/consentStore'
import { captureGclid } from '@/lib/gclid'

// Zapisuje parametry kampanii (utm_*, flaga fbclid) przy wejsciu na dowolna strone - ale WYLACZNIE za zgoda
// "Marketingowe" z banera (website#35, klucz attribution; to NIE jest zgoda "Reklamowe"/Pixel - te sa rozlaczne).
// Bez zgody nic nie zapisuje; po udzieleniu zgody zapisuje parametry z biezacego adresu; po wycofaniu klucz sessionStorage
// kasuje applyChoice (consentStore, clearAttribution). Nic nie renderuje, nie laduje skryptow, nie loguje wartosci.
registerMarketingConsentCheck(hasAttributionConsent)

export default function AttributionCapture() {
  useEffect(() => {
    if (hasAttributionConsent()) captureAttribution(window.location.search, undefined, window.location.pathname)
    // Pelna wartosc gclid: osobna kategoria "Reklamowe" v5 (Meta + Google Ads), nie "Marketingowe".
    captureGclid(window.location.search, hasGoogleAdsConsent())
    return onConsentChange((_analytics, attribution) => {
      if (attribution) captureAttribution(window.location.search, undefined, window.location.pathname)
      captureGclid(window.location.search, hasGoogleAdsConsent())
    })
  }, [])
  return null
}