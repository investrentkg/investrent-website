// Licznik lejka kalkulatora /wycena (CRM #1066: POST /api/public/valuation/funnel-step). Fire-and-forget, bez cookies, bez danych osobowych.
// Wylaczony domyslnie (NEXT_PUBLIC_WYCENA_FUNNEL=on wlaczamy po migracji i fladze CRM). Kroki: entry, start, valuation, consent_screen, submit, reject (z kodem).
import { FUNNEL_ON } from './wycenaFlags.ts'

export type FunnelStep = 'entry' | 'start' | 'valuation' | 'consent_screen' | 'submit' | 'reject'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
export const FUNNEL_URL = `${API}/api/public/valuation/funnel-step`

/** Biala lista kluczy UTM wysylanych do licznika (inne klucze z adresu sa ignorowane). */
export const FUNNEL_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
/** Wartosc UTM do licznika: po zlowercase tylko [a-z0-9_-], 1-40 znakow. Inaczej POMIJAMY pole (nie obcinamy, nie naprawiamy): dowolny tekst z URL moze zawierac dane osobowe. */
export const FUNNEL_UTM_VALUE = /^[a-z0-9_-]{1,40}$/
export function safeUtmValue(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.toLowerCase()
  return FUNNEL_UTM_VALUE.test(v) ? v : null
}

/** UTM z adresu strony (bez zapisu w storage; serwer liczy tylko agregat dzienny): biala lista kluczy, wartosci przechodza safeUtmValue albo sa pomijane. */
export function utmFromSearch(search: string): Partial<Record<(typeof FUNNEL_UTM_KEYS)[number], string>> {
  try {
    const p = new URLSearchParams(search)
    const out: Partial<Record<(typeof FUNNEL_UTM_KEYS)[number], string>> = {}
    for (const k of FUNNEL_UTM_KEYS) {
      const v = safeUtmValue(p.get(k))
      if (v) out[k] = v
    }
    return out
  } catch { return {} }
}

type Deps = { enabled?: boolean; search?: string; fetchImpl?: typeof fetch }

/**
 * Wysyla krok (nigdy nie rzuca, nie blokuje UX). `variant` krotki kod (np. phone_block), `reason` tylko dla reject.
 * JEDYNY transport: fetch keepalive z credentials:'omit' (bez ciasteczek). sendBeacon USUNIETY (wysyla z credentials=include i wymagalby
 * Access-Control-Allow-Credentials na preflight; recenzja Codexa 15.10.2026).
 */
export function sendFunnelStep(step: FunnelStep, extra: { variant?: string; reason?: string } = {}, deps: Deps = {}): boolean {
  const enabled = deps.enabled ?? FUNNEL_ON
  if (!enabled) return false
  try {
    const search = deps.search ?? (typeof window !== 'undefined' ? window.location.search : '')
    const body = JSON.stringify({ step, ...utmFromSearch(search), ...(extra.variant ? { variant: extra.variant } : {}), ...(extra.reason ? { reason: extra.reason } : {}) })
    const f = deps.fetchImpl ?? (typeof fetch === 'function' ? fetch : null)
    if (!f) return false
    void Promise.resolve(f(FUNNEL_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true, credentials: 'omit' })).catch(() => {})
    return true
  } catch { return false }
}