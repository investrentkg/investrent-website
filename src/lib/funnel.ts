// Licznik lejka kalkulatora /wycena (CRM #1066: POST /api/public/valuation/funnel-step). Fire-and-forget, bez cookies, bez danych osobowych.
// Wylaczony domyslnie (NEXT_PUBLIC_WYCENA_FUNNEL=on wlaczamy po migracji i fladze CRM). Kroki: entry, start, valuation, consent_screen, submit, reject (z kodem).
import { FUNNEL_ON } from './wycenaFlags.ts'

export type FunnelStep = 'entry' | 'start' | 'valuation' | 'consent_screen' | 'submit' | 'reject'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
export const FUNNEL_URL = `${API}/api/public/valuation/funnel-step`

/** UTM z adresu strony (bez zapisu w storage; serwer normalizuje i liczy tylko agregat dzienny). */
export function utmFromSearch(search: string): { utm_source?: string; utm_campaign?: string } {
  try {
    const p = new URLSearchParams(search)
    const out: { utm_source?: string; utm_campaign?: string } = {}
    const s = (p.get('utm_source') ?? '').slice(0, 64); if (s) out.utm_source = s
    const c = (p.get('utm_campaign') ?? '').slice(0, 64); if (c) out.utm_campaign = c
    return out
  } catch { return {} }
}

type Deps = { enabled?: boolean; search?: string; beacon?: (url: string, body: Blob) => boolean; fetchImpl?: typeof fetch }

/**
 * Wysyla krok (nigdy nie rzuca, nie blokuje UX). `variant` krotki kod (np. phone_block), `reason` tylko dla reject.
 * Transport: fetch keepalive z credentials:'omit' (bez ciasteczek; nie wymaga CORS z credentials), a gdy fetch niedostepny - sendBeacon (snippet z CRM #1066).
 * Uwaga: sendBeacon wysyla z credentials=include, wiec przy preflight wymaga Access-Control-Allow-Credentials po stronie CRM; dlatego fetch jest pierwszy.
 */
export function sendFunnelStep(step: FunnelStep, extra: { variant?: string; reason?: string } = {}, deps: Deps = {}): boolean {
  const enabled = deps.enabled ?? FUNNEL_ON
  if (!enabled) return false
  try {
    const search = deps.search ?? (typeof window !== 'undefined' ? window.location.search : '')
    const body = JSON.stringify({ step, ...utmFromSearch(search), ...(extra.variant ? { variant: extra.variant } : {}), ...(extra.reason ? { reason: extra.reason } : {}) })
    const f = deps.fetchImpl ?? (typeof fetch === 'function' ? fetch : null)
    if (f) {
      void Promise.resolve(f(FUNNEL_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true, credentials: 'omit' })).catch(() => {})
      return true
    }
    const beacon = deps.beacon ?? (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function' ? (u: string, b: Blob) => navigator.sendBeacon(u, b) : null)
    if (beacon && beacon(FUNNEL_URL, new Blob([body], { type: 'application/json' }))) return true
  } catch { /* licznik nigdy nie psuje formularza */ }
  return false
}