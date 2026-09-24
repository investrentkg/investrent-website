// Odporne wysylanie leada do CRM (POST /api/public/leads).
//
// Wczesniej submitLead robil `await res.json()` bez try/catch - przy bledzie
// sieci, CORS albo 502/504 z HTML-em (Railway/proxy) wyjatek nie byl
// obslugiwany i formularz wisial na "Wysylanie...". Ta funkcja NIGDY nie rzuca:
// zawsze zwraca { ok: true } albo { ok: false, reason }.
// Sukces tylko gdy HTTP 2xx ORAZ odpowiedz jest JSON-em z ok === true.

export const LEAD_TIMEOUT_MS = 15000
// Numer biura - ta sama wartosc zapasowa co w Contact.tsx.
export const LEAD_FALLBACK_PHONE = '+48 731 554 341'
export const LEAD_ERROR_MESSAGE = `Nie udało się wysłać — spróbuj ponownie lub zadzwoń: ${LEAD_FALLBACK_PHONE}`

export type LeadFailReason = 'timeout' | 'network' | 'http' | 'invalid_response' | 'rejected'
// Przy porazce `error` zawsze niesie tekst do pokazania (komunikat serwera ze
// znanego bledu walidacji albo ogolny LEAD_ERROR_MESSAGE) - MortgageMiniCalculator
// czyta res.error, wiec porazka bez tego pola bylaby tam wzieta za sukces.
export type LeadResult = { ok: true; error?: undefined } | { ok: false; reason: LeadFailReason; status?: number; error: string }

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

function fail(reason: LeadFailReason, status?: number, body?: { error?: unknown } | null): LeadResult {
  const serverMsg = body && typeof body.error === 'string' && body.error.trim() ? body.error : null
  return { ok: false, reason, status, error: serverMsg ?? LEAD_ERROR_MESSAGE }
}

export async function postLead(
  url: string,
  payload: unknown,
  opts: { timeoutMs?: number; fetchImpl?: FetchLike } = {}
): Promise<LeadResult> {
  const doFetch: FetchLike = opts.fetchImpl ?? ((u, i) => fetch(u, i))
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; controller.abort() }, opts.timeoutMs ?? LEAD_TIMEOUT_MS)
  try {
    const res = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    let data: { ok?: unknown; error?: unknown } | null = null
    try {
      data = await res.json()
    } catch {
      // 502/504 z HTML-em albo pusta odpowiedz
      return fail(res.ok ? 'invalid_response' : 'http', res.status)
    }
    if (!res.ok) return fail('http', res.status, data)
    if (data && data.ok === true) return { ok: true }
    return fail('rejected', res.status, data)
  } catch {
    return fail(timedOut ? 'timeout' : 'network')
  } finally {
    clearTimeout(timer)
  }
}

// Zdarzenie GA4 po UDANYM wyslaniu leada. Wysylamy WYLACZNIE zrodlo formularza -
// zadnych danych osobowych (telefon, imie, e-mail, tresc wiadomosci).
// Gdy GA nie jest zaladowane (brak NEXT_PUBLIC_GA_MEASUREMENT_ID, adblock) - no-op.
export function trackLeadSuccess(source: string | undefined): void {
  try {
    const w = typeof window !== 'undefined' ? (window as unknown as { gtag?: (...a: unknown[]) => void }) : undefined
    if (w && typeof w.gtag === 'function') {
      w.gtag('event', 'generate_lead', { lead_source: source || 'unknown' })
    }
  } catch {
    // analityka nigdy nie moze zepsuc formularza
  }
}
