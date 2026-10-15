// Adapter wysylki numeru z bloku telefonu pod wynikiem /wycena (JEDNA funkcja: latwo przelaczyc).
//  - callback (flaga NEXT_PUBLIC_WYCENA_CALLBACK=on i jest valuation_token z /estimate): POST /api/public/valuation/callback
//    { valuation_token, phone, consent: { checked, version }, utm? }. Serwer wiaze zgloszenie z wycena.
//  - w przeciwnym razie (tryb awaryjny): dotychczasowy POST /api/public/leads (submitLead) z wynikiem wyceny w notes.
// Zwraca { ok } bez rzucania; na porazce sieciowej callbacku probuje trybu awaryjnego (jeden zapis, nie dwa).
import type { EstimateOutcome, FormValues } from './valuation'
import { normalizePhoneForSend } from './valuation.ts'

export type PhoneRequestInput = {
  phone: string
  valuationToken: string | null
  consentVersion: string
  values: FormValues
  outcome: EstimateOutcome | null
  utm: string                       // "utm_source=x utm_campaign=y" (readUtm)
  turnstileToken?: string | null
  honeypot?: string
}
export type PhoneRequestResult = { ok: true; via: 'callback' | 'lead' } | { ok: false; reason: string }
export type PhoneRequestDeps = {
  callbackEnabled: boolean
  callbackUrl: string
  fetchImpl?: typeof fetch
  /** zapis awaryjny: dotychczasowy lead z wynikiem w notes (cialo budowane przez wolajacego) */
  submitLeadFallback: () => Promise<{ ok: boolean; reason?: string }>
}

export function utmObject(utm: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of utm.split(' ')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i)] = part.slice(i + 1)
  }
  return out
}

export async function sendPhoneRequest(input: PhoneRequestInput, deps: PhoneRequestDeps): Promise<PhoneRequestResult> {
  if (deps.callbackEnabled && input.valuationToken) {
    const f = deps.fetchImpl ?? fetch
    try {
      const u = utmObject(input.utm)
      const res = await f(deps.callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valuation_token: input.valuationToken,
          phone: normalizePhoneForSend(input.phone),
          consent: { checked: true, version: input.consentVersion },
          ...(Object.keys(u).length ? { utm: u } : {}),
          ...(input.turnstileToken ? { turnstile_token: input.turnstileToken } : {}),
          hp_field: input.honeypot ?? '',
        }),
      })
      if (res.ok) {
        let data: { ok?: unknown } | null = null
        try { data = await res.json() } catch { /* pusta odpowiedz */ }
        if (!data || data.ok === true) return { ok: true, via: 'callback' }
      }
      // blad HTTP albo odpowiedz bez ok: tryb awaryjny ponizej
    } catch { /* siec: tryb awaryjny ponizej */ }
  }
  const r = await deps.submitLeadFallback()
  return r.ok ? { ok: true, via: 'lead' } : { ok: false, reason: r.reason ?? 'unknown' }
}