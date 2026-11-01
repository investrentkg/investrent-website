// Licznik lejka kalkulatora /wycena (CRM #1066: POST /api/public/valuation/funnel-step). Fire-and-forget, bez cookies, bez danych osobowych.
// Wylaczony domyslnie (NEXT_PUBLIC_WYCENA_FUNNEL=on wlaczamy po migracji i fladze CRM). Kroki: entry, start, valuation, consent_screen, submit, reject (z kodem).
import { FUNNEL_ON } from './wycenaFlags.ts'

export type FunnelStep = 'entry' | 'start' | 'valuation' | 'consent_screen' | 'submit' | 'reject'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.investrent.com.pl'
export const FUNNEL_URL = `${API}/api/public/valuation/funnel-step`

/** Wartosc UTM do licznika: po zlowercase tylko [a-z0-9_-], 1-40 znakow. Inaczej POMIJAMY pole (nie obcinamy, nie naprawiamy): dowolny tekst z URL moglby zawierac dane osobowe. */
export const FUNNEL_UTM_VALUE = /^[a-z0-9_-]{1,40}$/
export function safeUtmValue(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.toLowerCase()
  return FUNNEL_UTM_VALUE.test(v) ? v : null
}

/** UTM z adresu strony (bez zapisu w storage; serwer normalizuje i liczy tylko agregat dzienny): biala lista dwoch kluczy, wartosci przechodza safeUtmValue albo sa pomijane. */
export function utmFromSearch(search: string): { utm_source?: string; utm_campaign?: string } {
  try {
    const p = new URLSearchParams(search)
    const out: { utm_source?: string; utm_campaign?: string } = {}
    const s = safeUtmValue(p.get('utm_source')); if (s) out.utm_source = s
    const c = safeUtmValue(p.get('utm_campaign')); if (c) out.utm_campaign = c
    return out
  } catch { return {} }
}
type Deps = { enabled?: boolean; search?: string; fetchImpl?: typeof fetch }

/**
 * Wysyla krok (nigdy nie rzuca, nie blokuje UX). `variant` krotki kod (np. phone_block), `reason` tylko dla reject.
 * JEDYNY transport: fetch keepalive z credentials:'omit' (bez ciasteczek). sendBeacon usuniety: wysyla z credentials=include i wymagalby Access-Control-Allow-Credentials po stronie CRM (recenzja Codexa 15.10.2026).
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
  } catch { /* licznik nigdy nie psuje formularza */ }
  return false
}