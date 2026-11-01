export type PixelTrack = (event: 'Lead', options: { eventID: string }) => void

export type WycenaMetaTracking = {
  event_id: string
  /** Podpisany przez serwer paragon zgody Marketing (POST /api/public/valuation/meta-consent-receipt, wazny 2 h); samo marketing_consent nie wystarcza. */
  consent_receipt: string
  fbc?: string
  fbp?: string
  fbclid?: string
  utm?: Record<string, string>
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const safeValue = (value: string | undefined, max = 512) => value && value.length <= max && /^[A-Za-z0-9_.!-]+$/.test(value) ? value : undefined

const RECEIPT_RE = /^v1\.[A-Za-z0-9_-]{10,400}\.[A-Za-z0-9_-]{43}$/
export const isPlausibleReceipt = (value: unknown): value is string => typeof value === 'string' && value.length <= 600 && RECEIPT_RE.test(value)

export function createWycenaMetaEventId(randomUUID: () => string = () => crypto.randomUUID()): string | null {
  try {
    const value = `wyc_${randomUUID()}`
    return /^[A-Za-z0-9_-]{16,128}$/.test(value) ? value : null
  } catch { return null }
}

function metaCookie(cookie: string, name: '_fbp' | '_fbc'): string | undefined {
  const entry = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))
  return safeValue(entry?.slice(name.length + 1))
}

export function buildWycenaMetaTracking(input: {
  enabled: boolean
  marketingConsent: boolean
  eventId: string | null
  /** Paragon zgody z serwera; bez niego nie budujemy meta_tracking (fail closed). */
  consentReceipt: string | null | undefined
  readCookie: () => string
  search: string
  attribution?: Record<string, unknown> | null
}): WycenaMetaTracking | undefined {
  if (!input.enabled || !input.marketingConsent || !input.eventId || !/^[A-Za-z0-9_-]{16,128}$/.test(input.eventId) || !isPlausibleReceipt(input.consentReceipt)) return undefined
  let cookie = ''
  try { cookie = input.readCookie() } catch { /* brak cookie = brak identyfikatorow Meta */ }
  const out: WycenaMetaTracking = { event_id: input.eventId, consent_receipt: input.consentReceipt }
  const fbp = metaCookie(cookie, '_fbp')
  const fbc = metaCookie(cookie, '_fbc')
  if (fbp) out.fbp = fbp
  if (fbc) out.fbc = fbc
  try {
    const fbclid = safeValue(new URLSearchParams(input.search).get('fbclid') ?? undefined, 256)
    if (fbclid) out.fbclid = fbclid
  } catch { /* bledny query nie blokuje formularza */ }
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = input.attribution?.[key]
    if (typeof value === 'string' && value.trim()) utm[key] = value.trim().slice(0, 100)
  }
  if (Object.keys(utm).length) out.utm = utm
  return out
}

export function trackConsentedWycenaLead(input: {
  enabled: boolean
  marketingConsent: boolean
  pixelAvailable: boolean
  eventId: string
  track: PixelTrack
}): boolean {
  if (!input.enabled || !input.marketingConsent || !input.pixelAvailable || !/^[A-Za-z0-9_-]{16,128}$/.test(input.eventId)) return false
  try { input.track('Lead', { eventID: input.eventId }); return true } catch { return false }
}

/** Paragon wazny 2 h po stronie serwera; odnawiamy po 90 min, zeby nie wyslac przeterminowanego. */
export const CONSENT_RECEIPT_MAX_AGE_MS = 90 * 60 * 1000

/**
 * Pobiera paragon zgody. Fail closed: brak flagi/zgody/event_id, blad sieci, status inny niz 200,
 * ok !== true albo zly format paragonu = null (wtedy nie wysylamy meta_tracking i nie odpalamy Lead w przegladarce).
 */
export async function requestMetaConsentReceipt(input: {
  enabled: boolean
  marketingConsent: boolean
  eventId: string | null
  url: string
  turnstileToken?: string | null
  fetchImpl?: typeof fetch
}): Promise<string | null> {
  if (!input.enabled || !input.marketingConsent || !input.eventId || !/^[A-Za-z0-9_-]{16,128}$/.test(input.eventId)) return null
  try {
    const res = await (input.fetchImpl ?? fetch)(input.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: input.eventId, marketing_consent: true, ...(input.turnstileToken ? { turnstileToken: input.turnstileToken } : {}) }),
    })
    if (!res.ok) return null
    const data = await res.json() as { ok?: unknown; receipt?: unknown } | null
    return data && data.ok === true && isPlausibleReceipt(data.receipt) ? data.receipt : null
  } catch { return null }
}

/** Co zrobic z Pixelem po zmianie zgody Marketing: grant tylko przy fladze + ID + zgodzie, w kazdym innym razie revoke (lub nic, gdy Pixel wylaczony). */
export function pixelConsentAction(input: { enabled: boolean; pixelId: string; marketingConsent: boolean }): 'grant' | 'revoke' | 'none' {
  if (!input.enabled || !input.pixelId) return 'none'
  return input.marketingConsent ? 'grant' : 'revoke'
}