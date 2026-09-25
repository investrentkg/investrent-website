// Publiczny kalkulator wyceny (strona /wycena) - logika bez Reacta: walidacja,
// wywolanie POST /api/public/valuation/estimate, mapowanie odpowiedzi na
// bezpieczne stany UI, skladanie notatki do leada.
//
// Zasady: funkcje NIGDY nie rzucaja (blad sieci, timeout, odpowiedz nie-JSON,
// 429/503/400 -> zwykly wynik z polem kind), zadnych danych osobowych w GA4.
// Kontrakt backendu (budowany rownolegle) - patrz opis PR.

export const ESTIMATE_TIMEOUT_MS = 45000 // wycena uruchamia silnik AI - dluzej niz zwykly lead
// Numer biura - ta sama wartosc co LEAD_FALLBACK_PHONE (leadSubmit.ts).
export const OFFICE_PHONE = '+48\u00A0731\u00A0554\u00A0341'

export type PropertyType = 'mieszkanie' | 'dom' | 'dzialka'
export type Condition = 'do_remontu' | 'dobry' | 'po_remoncie' | 'deweloperski'

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'mieszkanie', label: 'Mieszkanie' },
  { value: 'dom', label: 'Dom' },
  { value: 'dzialka', label: 'Działka' },
]
export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'do_remontu', label: 'Do remontu' },
  { value: 'dobry', label: 'Dobry' },
  { value: 'po_remoncie', label: 'Po remoncie' },
  { value: 'deweloperski', label: 'Stan deweloperski' },
]
export const DEFAULT_CITY = 'Kołobrzeg'

export type FormValues = {
  property_type: PropertyType | ''
  city: string
  district: string
  area_m2: string
  rooms: string
  floor: string
  condition: Condition | ''
}
export const EMPTY_FORM: FormValues = {
  property_type: '', city: DEFAULT_CITY, district: '', area_m2: '', rooms: '', floor: '', condition: '',
}

export type FormErrors = Partial<Record<keyof FormValues, string>>

export type EstimatePayload = {
  property_type: PropertyType
  city: string
  district?: string
  area_m2: number
  rooms?: number
  floor?: number
  condition?: Condition
  website: string // honeypot - w UI zawsze puste (pole ukryte), wypelnia je tylko bot
  turnstile_token?: string
}

function parseNum(s: string): number {
  return Number(s.trim().replace(',', '.'))
}

// Pola pokoje/pietro/stan dotycza tylko wybranych typow nieruchomosci.
export function fieldApplies(type: FormValues['property_type'], field: 'rooms' | 'floor' | 'condition'): boolean {
  if (type === 'dzialka') return false
  if (field === 'floor') return type === 'mieszkanie'
  return true
}

// Zakres liczb online = lustro regul backendu (canAttemptNumbers): mieszkanie w Kolobrzegu z PODANA dzielnica, bez Srodmiescia.
// Backend jest zrodlem prawdy; ta kopia sluzy tylko do trafnych komunikatow (nie do decyzji o liczbach).
export const foldText = (t: string) => t.trim().toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ')
const BLOCKED_DISTRICT = [/srodmiesc/, /centrum/, /stare miasto/]
export function isKolobrzeg(city: string): boolean { return foldText(city) === 'kolobrzeg' }
export function districtIsBlocked(district: string): boolean { return BLOCKED_DISTRICT.some(re => re.test(foldText(district))) }
// true = to zapytanie jest POZA zakresem liczb online (dom, dzialka, inna miejscowosc, Srodmiescie) - odmienny komunikat niz "za malo danych".
export function isOutOfScope(v: Pick<FormValues, 'property_type' | 'city' | 'district'>): boolean {
  if (v.property_type !== 'mieszkanie') return true
  if (!isKolobrzeg(v.city)) return true
  return !!v.district.trim() && districtIsBlocked(v.district)
}

// Minimalny czas od zaladowania strony do wyslania formularza (odsiew najprostszych botow). Tylko front; backend tego nie egzekwuje.
export const MIN_FILL_MS = 3000
export function submittedTooFast(loadedAt: number, now: number, minMs: number = MIN_FILL_MS): boolean {
  return now - loadedAt < minMs
}

export function validateForm(v: FormValues): FormErrors {
  const e: FormErrors = {}
  if (!v.property_type) e.property_type = 'Wybierz rodzaj nieruchomości.'
  const city = v.city.trim()
  if (city.length < 2) e.city = 'Podaj miejscowość.'
  else if (city.length > 80) e.city = 'Nazwa miejscowości jest za długa.'
  if (v.district.trim().length > 80) e.district = 'Nazwa dzielnicy jest za długa.'
  else if (v.property_type === 'mieszkanie' && isKolobrzeg(city) && !v.district.trim()) {
    e.district = 'Podaj dzielnicę lub osiedle — bez niej nie policzymy widełek. Jeśli nie znasz nazwy, możesz zostawić sam numer telefonu i zaznaczyć zgodę na telefon w sprawie wyceny, a agent przygotuje wycenę indywidualnie.'
  }

  const area = parseNum(v.area_m2)
  if (!v.area_m2.trim() || !Number.isFinite(area)) e.area_m2 = 'Podaj powierzchnię w metrach kwadratowych.'
  else if (area < 8 || area > (v.property_type === 'dzialka' ? 1000000 : 2000)) {
    e.area_m2 = v.property_type === 'dzialka' ? 'Podaj powierzchnię od 8 do 1\u00A0000\u00A0000\u00A0m².' : 'Podaj powierzchnię od 8 do 2000 m².'
  }

  if (fieldApplies(v.property_type, 'rooms') && v.rooms.trim()) {
    const r = parseNum(v.rooms)
    if (!Number.isInteger(r) || r < 1 || r > 20) e.rooms = 'Podaj liczbę pokoi od 1 do 20.'
  }
  if (fieldApplies(v.property_type, 'floor') && v.floor.trim()) {
    const f = parseNum(v.floor)
    if (!Number.isInteger(f) || f < -1 || f > 40) e.floor = 'Podaj piętro od -1 do 40 (parter to 0, suterena to -1).'
  }
  return e
}

export function buildPayload(v: FormValues, honeypot = '', turnstileToken?: string | null): EstimatePayload {
  const p: EstimatePayload = {
    property_type: v.property_type as PropertyType,
    city: v.city.trim(),
    area_m2: parseNum(v.area_m2),
    website: honeypot,
  }
  if (turnstileToken) p.turnstile_token = turnstileToken
  if (v.district.trim()) p.district = v.district.trim()
  if (fieldApplies(v.property_type, 'rooms') && v.rooms.trim()) p.rooms = parseNum(v.rooms)
  if (fieldApplies(v.property_type, 'floor') && v.floor.trim()) p.floor = parseNum(v.floor)
  if (fieldApplies(v.property_type, 'condition') && v.condition) p.condition = v.condition
  return p
}

// ── Odpowiedz backendu ──
export type Range = { low: number; high: number }
export type EstimateOutcome =
  | { kind: 'range'; range: Range; pricePerM2: Range | null; comparables: { min: number; max: number } | null; quality: string | null; disclaimer: string | null; message: string | null }
  | { kind: 'no_numbers'; message: string | null; disclaimer: string | null }
  | { kind: 'rate_limited'; retryAfterSeconds: number | null }
  | { kind: 'disabled' }
  | { kind: 'invalid'; message: string | null }
  | { kind: 'error'; reason: 'timeout' | 'network' | 'http' | 'invalid_response' }

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

function asRange(x: unknown): Range | null {
  if (!x || typeof x !== 'object') return null
  const { low, high } = x as { low?: unknown; high?: unknown }
  if (typeof low !== 'number' || typeof high !== 'number' || !Number.isFinite(low) || !Number.isFinite(high)) return null
  if (low <= 0 || high < low) return null
  return { low, high }
}
const str = (x: unknown): string | null => (typeof x === 'string' && x.trim() ? x : null)

// Zamienia surowa odpowiedz (status + body) na wynik dla UI. Wydzielone, zeby
// dalo sie testowac bez sieci. Liczby pokazujemy WYLACZNIE gdy mode==='range'
// i widelki sa poprawne - w kazdym innym przypadku degradujemy do 'no_numbers'.
export function interpretResponse(status: number, body: unknown): EstimateOutcome {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  if (status === 429 || b.error === 'rate_limited') {
    const s = typeof b.retry_after_seconds === 'number' && b.retry_after_seconds > 0 ? b.retry_after_seconds : null
    return { kind: 'rate_limited', retryAfterSeconds: s }
  }
  if (status === 503 || b.error === 'disabled') return { kind: 'disabled' }
  if (status === 400) return { kind: 'invalid', message: str(b.message) ?? str(b.error) }
  if (status < 200 || status >= 300) return { kind: 'error', reason: 'http' }
  if (b.ok !== true) return { kind: 'error', reason: 'invalid_response' }

  if (b.mode === 'range') {
    const range = asRange(b.range)
    if (range) {
      const c = b.comparables as { min?: unknown; max?: unknown } | undefined
      const comparables = c && typeof c.min === 'number' && typeof c.max === 'number' ? { min: c.min, max: c.max } : null
      return {
        kind: 'range', range, pricePerM2: asRange(b.price_per_m2), comparables,
        quality: str(b.quality), disclaimer: str(b.disclaimer), message: str(b.message),
      }
    }
    return { kind: 'no_numbers', message: null, disclaimer: str(b.disclaimer) }
  }
  if (b.mode === 'no_numbers') return { kind: 'no_numbers', message: str(b.message), disclaimer: str(b.disclaimer) }
  return { kind: 'error', reason: 'invalid_response' }
}

export async function requestEstimate(
  url: string,
  payload: EstimatePayload,
  opts: { timeoutMs?: number; fetchImpl?: FetchLike } = {}
): Promise<EstimateOutcome> {
  const doFetch: FetchLike = opts.fetchImpl ?? ((u, i) => fetch(u, i))
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; controller.abort() }, opts.timeoutMs ?? ESTIMATE_TIMEOUT_MS)
  try {
    const res = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    let data: unknown = null
    try { data = await res.json() } catch {
      // 502/504 z HTML-em albo pusta odpowiedz
      if (res.status === 503 || res.status === 429) return interpretResponse(res.status, null)
      return { kind: 'error', reason: res.ok ? 'invalid_response' : 'http' }
    }
    return interpretResponse(res.status, data)
  } catch {
    return { kind: 'error', reason: timedOut ? 'timeout' : 'network' }
  } finally {
    clearTimeout(timer)
  }
}

// ── Formatowanie ──
export function formatPLN(n: number): string {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n)
}
export function formatRange(r: Range): string {
  return `${formatPLN(r.low)} – ${formatPLN(r.high)}`
}

// ── Notatka do leada (pole notes w /api/public/leads) ──
// Wersja tekstow zgod i klauzuli (texts.ts: consentCall, consentMarketing, consentInfoPrefix). v11 = wersja OCZEKUJACA (v2-v10 zastapione przed publikacja po recenzjach Krytyka):
// publikacja na produkcji wymaga zatwierdzenia tresci (Krytyk + przeglad AI; kancelaria nieangazowana wg decyzji Daniela 25.09); kazda zmiana tych tekstow = nowy numer wersji.
// Pelne brzmienie danej wersji jest wersjonowane w repo (git) - do leada zapisujemy TYLKO znacznik (limit backendu: 500 znakow).
export const CONSENT_VERSION = 'wycena-2026-09-26-v11'
export const NOTES_MAX = 490 // backend /api/public/leads zapisuje clean(notes) = pierwsze 500 znakow (odrzuca > 1000)

export function describeInput(v: FormValues): string {
  const type = PROPERTY_TYPES.find(t => t.value === v.property_type)?.label ?? v.property_type
  const cond = CONDITIONS.find(c => c.value === v.condition)?.label
  const parts = [
    `${type}, ${v.city.trim()}${v.district.trim() ? ` (${v.district.trim()})` : ''}`,
    `${v.area_m2.trim()} m²`,
  ]
  if (fieldApplies(v.property_type, 'rooms') && v.rooms.trim()) parts.push(`pokoje: ${v.rooms.trim()}`)
  if (fieldApplies(v.property_type, 'floor') && v.floor.trim()) parts.push(`piętro: ${v.floor.trim()}`)
  if (cond && fieldApplies(v.property_type, 'condition')) parts.push(`stan: ${cond}`)
  return parts.join(', ')
}

export function describeOutcome(o: EstimateOutcome | null): string {
  if (!o) return 'Wycena orientacyjna: nie wykonano.'
  if (o.kind === 'range') {
    const m2 = o.pricePerM2 ? `, ${formatRange(o.pricePerM2)}/m²` : ''
    return `Wycena orientacyjna (kalkulator na stronie): ${formatRange(o.range)}${m2}${o.quality ? `, jakość: ${o.quality}` : ''}.`
  }
  if (o.kind === 'no_numbers') return 'Wycena orientacyjna: kalkulator nie podał liczb (za mało danych) — potrzebna wycena indywidualna.'
  if (o.kind === 'disabled') return 'Wycena orientacyjna: kalkulator wyłączony — wycena indywidualna.'
  if (o.kind === 'rate_limited') return 'Wycena orientacyjna: limit zapytań — wycena indywidualna.'
  return 'Wycena orientacyjna: nie udało się obliczyć — wycena indywidualna.'
}

export function isValidPhone(p: string): boolean {
  const cleaned = p.replace(/[\s\-()]/g, '')
  return /^(\+?[1-9]\d{7,14}|\d{9})$/.test(cleaned)
}

export function readUtm(search: string): string {
  try {
    const p = new URLSearchParams(search)
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    return keys.map(k => [k, (p.get(k) ?? '').slice(0, 80)]).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' ')
  } catch { return '' }
}

export type ConsentRecord = { at?: string }

// Kiedy mozna ponowic po 429: backend zwraca retry_after_seconds z faktycznego okna (30 zapytan/h albo 3 wyceny/24 h na IP).
export function formatRetryAfter(seconds: number | null): string {
  // Zwraca fraze po "za okolo": "minutę" / "N min" / "N h" (zaokraglone w gore, maks. 24 h).
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return '24 h'
  if (seconds < 60) return 'minutę'
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} min`
  return `${Math.min(24, Math.ceil(seconds / 3600))} h`
}

// Znacznik dowodu zgody. Styl jak [Meta-zgoda] (pary klucz=wartosc oddzielone "; "), ale osobny prefiks "[Zgoda-kalkulator]":
// NIE pasuje do parsera zgod CRM (wzorzec "[Zgoda]" / "[Wypisanie]" w consentRules.ts) ani do blokady looksLikeConsentNote, wiec nie udaje wpisu podpisanego serwerem.
// UWAGA: endpoint publiczny nie podpisuje wpisow (podpis HMAC ma tylko serwer); wartosc dowodowa = wersja tekstu w repo + czas zapisu notatki po stronie CRM.
export function buildConsentMarker(c: ConsentRecord): string {
  // v11: jedyny kanal to telefon-wycena (zgoda na oddzwonienie w sprawie wyceny); marketingu w kalkulatorze nie ma (v12).
  return `[Zgoda-kalkulator] kanał=telefon-wycena; czas=${c.at ?? new Date().toISOString()}; wersja=${CONSENT_VERSION}`
}

// Notatka musi zmiescic sie w NOTES_MAX (backend obcina po 500 znakach). Kolejnosc = priorytet: znacznik zgody PIERWSZY, UTM ostatni
// (UTM jest obcinany; zgoda nigdy).
export function buildLeadNotes(v: FormValues, o: EstimateOutcome | null, utm: string, c: ConsentRecord): string {
  const lines = [
    buildConsentMarker(c),
    `Źródło: kalkulator wyceny (z wynikiem: ${o?.kind === 'range' ? 'tak' : 'nie'}) — strona /wycena.`,
    v.property_type ? `Dane: ${describeInput(v)}.` : '',
    describeOutcome(o),
    utm ? `UTM: ${utm}` : '',
  ].filter(Boolean)
  let out = ''
  for (const l of lines) {
    const next = out ? `${out}\n${l}` : l
    if (next.length <= NOTES_MAX) { out = next; continue }
    const room = NOTES_MAX - out.length - 1
    if (room > 20) out += `\n${l.slice(0, room)}`
    break
  }
  return out
}

// ── GA4: tylko zdarzenia i parametry nieosobowe ──
export function trackValuation(event: 'wycena_view' | 'wycena_estimate_success' | 'wycena_estimate_no_numbers' | 'wycena_lead', params: Record<string, string> = {}): void {
  try {
    const w = typeof window !== 'undefined' ? (window as unknown as { gtag?: (...a: unknown[]) => void }) : undefined
    if (w && typeof w.gtag === 'function') w.gtag('event', event, params)
  } catch {
    // analityka nigdy nie moze zepsuc formularza
  }
}
