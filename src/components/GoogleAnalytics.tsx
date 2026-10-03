"use client"
import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { useConsent } from '@/lib/consentStore'
import { googleConsentArgs } from '@/lib/consent'

// GA4 ładowany DOPIERO po zgodzie na analitykę (art. 399 PKE / § 25 TDDDG): przed zgodą nie ma żadnego połączenia
// z googletagmanager.com, nie ma window.gtag (helpery track*/trackValuation są wtedy no-op), nie ma cookies _ga*.
// Consent Mode v2: domyślnie wszystko "denied", po zgodzie "update" analytics_storage=granted (reklamowe sygnały
// Google nie są używane - zawsze denied). Wycofanie: ga-disable-<ID>=true + consent update + usunięcie cookies
// (consentStore.setConsent). Zmiana kategorii/dostawcy = nowa wersja zgody (lib/consent.ts CONSENT_VERSION).
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const consent = useConsent()
  const on = !!consent?.analytics
  const wasOn = useRef(false)

  useEffect(() => {
    const w = window as unknown as Record<string, unknown> & { gtag?: (...a: unknown[]) => void }
    if (on) {
      wasOn.current = true
      w[`ga-disable-${gaId}`] = false
      w.gtag?.('consent', 'update', googleConsentArgs(consent ?? null))
    } else if (wasOn.current) {
      w[`ga-disable-${gaId}`] = true
      w.gtag?.('consent', 'update', googleConsentArgs(null))
    }
  }, [on, gaId, consent])

  if (!on) return null
  const granted = JSON.stringify(googleConsentArgs(consent ?? null))
  const denied = JSON.stringify(googleConsentArgs(null))
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', ${denied});
          gtag('consent', 'update', ${granted});
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
