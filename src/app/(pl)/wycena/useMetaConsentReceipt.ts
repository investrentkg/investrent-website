"use client"
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createElement } from 'react'
import { adsAllowed } from '@/lib/consent'
import { useConsent } from '@/lib/consentStore'
import { WYCENA_META_TRACKING_ON } from '@/lib/wycenaFlags'
import { CONSENT_RECEIPT_MAX_AGE_MS, createWycenaMetaEventId, requestMetaConsentReceipt } from '@/lib/wycenaMetaPixel'
import Turnstile from './Turnstile'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
const RECEIPT_URL = `${API}/api/public/valuation/meta-consent-receipt`
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

export type MetaReceipt = { eventId: string; receipt: string }

/**
 * Paragon zgody Meta CAPI: po zaakceptowaniu kategorii Marketing (i fladze ON) tworzy event_id i pobiera z CRM podpisany paragon.
 * Wlasny widget Turnstile (token jest jednorazowy, wiec nie dzielimy go z leadem). Wycofanie zgody kasuje event_id i paragon.
 * getReceipt() zwraca null, gdy paragonu nie ma / jest stary / zgoda cofnieta -> wywolujacy NIE wysyla meta_tracking (fail closed).
 */
export function useMetaConsentReceipt(): { getReceipt: () => MetaReceipt | null; widget: ReactNode } {
  const consent = useConsent()
  const active = WYCENA_META_TRACKING_ON && adsAllowed(consent ?? null)
  const [tsToken, setTsToken] = useState<string | null>(null)
  const [tsReset, setTsReset] = useState(0)
  const stored = useRef<(MetaReceipt & { at: number }) | null>(null)
  const eventId = useRef<string | null>(null)
  const pending = useRef(false)
  const failures = useRef(0)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    if (!active) { stored.current = null; eventId.current = null; failures.current = 0; setTsToken(null) }
  }, [active])

  useEffect(() => {
    if (!active || pending.current || failures.current >= 3) return
    const current = stored.current
    if (current && Date.now() - current.at < CONSENT_RECEIPT_MAX_AGE_MS) return
    if (TURNSTILE_SITE_KEY && !tsToken) return
    if (!eventId.current) eventId.current = createWycenaMetaEventId()
    const id = eventId.current
    pending.current = true
    void requestMetaConsentReceipt({ enabled: WYCENA_META_TRACKING_ON, marketingConsent: true, eventId: id, url: RECEIPT_URL, turnstileToken: tsToken })
      .then(receipt => { if (!receipt) failures.current += 1; if (receipt && id && activeRef.current && eventId.current === id) stored.current = { eventId: id, receipt, at: Date.now() } })
      .finally(() => { pending.current = false; if (TURNSTILE_SITE_KEY) { setTsToken(null); setTsReset(n => n + 1) } })
  }, [active, tsToken])

  const getReceipt = useCallback((): MetaReceipt | null => {
    const s = stored.current
    if (!activeRef.current || !s || Date.now() - s.at >= CONSENT_RECEIPT_MAX_AGE_MS) return null
    return { eventId: s.eventId, receipt: s.receipt }
  }, [])

  const widget = active && TURNSTILE_SITE_KEY
    ? createElement(Turnstile, { siteKey: TURNSTILE_SITE_KEY, resetKey: tsReset, onToken: setTsToken, onFail: () => setTsToken(null) })
    : null
  return { getReceipt, widget }
}