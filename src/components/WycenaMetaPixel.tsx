"use client"
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { hasAdsConsent } from '@/lib/consentStore'
import { onConsentChange } from '@/lib/consentStore'
import { WYCENA_META_TRACKING_ON } from '@/lib/wycenaFlags'
import { pixelConsentAction, trackConsentedWycenaLead } from '@/lib/wycenaMetaPixel'

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
  fbq('init', PIXEL_ID)
}

export function trackWycenaMetaLead(eventId: string | null | undefined): void {
  if (!WYCENA_META_TRACKING_ON || !PIXEL_ID || !hasAdsConsent() || typeof window === 'undefined' || !window.fbq || !eventId) return
  trackConsentedWycenaLead({
    enabled: WYCENA_META_TRACKING_ON,
    marketingConsent: hasAdsConsent(),
    pixelAvailable: true,
    eventId,
    track: (event, options) => window.fbq?.('track', event, {}, options),
  })
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
