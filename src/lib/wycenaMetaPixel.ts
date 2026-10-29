export type PixelTrack = (event: 'Lead', options: { eventID: string }) => void

export type WycenaMetaTracking = {
  event_id: string
  marketing_consent: true
  fbc?: string
  fbp?: string
  fbclid?: string
  utm?: Record<string, string>
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const safeValue = (value: string | undefined, max = 512) => value && value.length <= max && /^[A-Za-z0-9_.!-]+$/.test(value) ? value : undefined

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
  readCookie: () => string
  search: string
  attribution?: Record<string, unknown> | null
}): WycenaMetaTracking | undefined {
  if (!input.enabled || !input.marketingConsent || !input.eventId || !/^[A-Za-z0-9_-]{16,128}$/.test(input.eventId)) return undefined
  let cookie = ''
  try { cookie = input.readCookie() } catch { /* brak cookie = brak identyfikatorow Meta */ }
  const out: WycenaMetaTracking = { event_id: input.eventId, marketing_consent: true }
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
