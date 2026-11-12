"use client"
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { hasAdsConsent } from '@/lib/consentStore'
import { onConsentChange } from '@/lib/consentStore'
import { WYCENA_META_TRACKING_ON, WYCENA_FUNNEL_EVENTS_V2 } from '@/lib/wycenaFlags'
import { metaVariantParams } from '@/lib/wycenaFunnelEvents'
import { initPixelWithoutAutoMatching, pixelConsentAction, trackConsentedWycenaLead } from '@/lib/wycenaMetaPixel'

declare global {
  interface Window { fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; push?: (...args: unknown[]) => void; loaded?: boolean; version?: string } }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''
const callPixel = (...args: unknown[]) => {
  const pixel = window.fbq as NonNullable<Window['fbq']> | undefined
  pixel?.(...args)
}

function loadPixel() {
  if (typeof window === 'undefined' || !PIXEL_ID || window.fbq) return
  const fbq = ((...args: unknown[]) => { if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue?.push(args) }) as NonNullable<Window['fbq']>
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  window.fbq = fbq
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
  initPixelWithoutAutoMatching(fbq, PIXEL_ID)
}

/** capiSignal = pole meta_capi z odpowiedzi CRM (undefined = brak pola, dotychczasowe zachowanie); Lead tylko przy dispatched===true z tym samym event_id. */
export function trackWycenaMetaLead(eventId: string | null | undefined, capiSignal?: unknown, variant?: string): void {
  if (!WYCENA_META_TRACKING_ON || !PIXEL_ID || !hasAdsConsent() || typeof window === 'undefined' || !window.fbq || !eventId) return
  trackConsentedWycenaLead({
    enabled: WYCENA_META_TRACKING_ON,
    marketingConsent: hasAdsConsent(),
    pixelAvailable: true,
    eventId,
    capiSignal,
    params: WYCENA_FUNNEL_EVENTS_V2 ? metaVariantParams(variant) : undefined,
    track: (event, options, params) => window.fbq?.('track', event, params ?? {}, options),
  })
}

/** Custom event Meta etapu lejka (WycenaStart / WycenaWynik) wg planu z wycenaFunnelEvents.ts. Flaga FUNNEL_EVENTS_V2 + flaga Pixela + zgoda Reklamowe; bez eventID i bez danych osobowych. */
export function trackWycenaMetaCustom(name: string, params: Record<string, string>): void {
  if (!WYCENA_FUNNEL_EVENTS_V2 || !WYCENA_META_TRACKING_ON || !PIXEL_ID || !hasAdsConsent() || typeof window === 'undefined' || !window.fbq) return
  try { window.fbq('trackCustom', name, params) } catch { /* pomiar nigdy nie psuje formularza */ }
}

export default function WycenaMetaPixel() {
  const pathname = usePathname()
  const lastPageView = useRef<string | null>(null)
  useEffect(() => {
    const grantAndTrackPageView = () => {
      if (window.fbq) callPixel('consent', 'grant')
      else {
        loadPixel()
        callPixel('consent', 'grant')
      }
      if (lastPageView.current !== pathname) {
        callPixel('track', 'PageView')
        lastPageView.current = pathname
      }
    }
    const sync = () => {
      const action = pixelConsentAction({ enabled: WYCENA_META_TRACKING_ON, pixelId: PIXEL_ID, marketingConsent: hasAdsConsent() })
      if (action === 'grant') grantAndTrackPageView()
      else if (action === 'revoke') { callPixel('consent', 'revoke'); lastPageView.current = null }
    }
    sync()
    return onConsentChange((_analytics, _marketing, ads) => {
      const action = pixelConsentAction({ enabled: WYCENA_META_TRACKING_ON, pixelId: PIXEL_ID, marketingConsent: ads })
      if (action === 'grant') grantAndTrackPageView()
      else if (action === 'revoke') { callPixel('consent', 'revoke'); lastPageView.current = null }
    })
  }, [pathname])
  return null
}
