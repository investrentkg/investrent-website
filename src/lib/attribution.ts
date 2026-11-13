// Atrybucja reklamowa (UTM) - zapis w sessionStorage i dolaczanie do zadan wysylanych do CRM.
//
// Co zapisujemy: utm_source / utm_medium / utm_campaign / utm_content oraz TYLKO flage
// fbclid_present (pelnego fbclid nie zapisujemy ani nie wysylamy). Gdzie: sessionStorage
// (do zamkniecia karty). Wartosci sa deklarowane przez przegladarke - niezweryfikowane.
// Normalizacja identyczna z backendem CRM (PR-1): male litery, biala lista [a-z0-9_.-],
// max 64 znaki; dluzsze przycinane, wartosc z innymi znakami odrzucana.
//
// Kazdy dostep do storage jest w try/catch (tryb prywatny, przegladarka wbudowana FB/IG,
// zablokowane dane witryny) - brak storage nigdy nie moze zepsuc formularza.
// Wartosci UTM nie sa logowane (konsola/analityka).
//
// ZGODA (decyzja Dyrektora 09.10.2026, kategoria "Marketingowe" (klucz attribution, rozlaczny od Reklamowe/Pixel) z banera website#35): zapis do sessionStorage i odczyt/wysylka do CRM
// TYLKO gdy zgoda marketingowa (sprawdzana przez zarejestrowany "gate" - ten plik nie importuje Reacta/consentStore, zeby zostal testowalny w node).
// Bez zgody: nic nie zapisujemy i niczego nie dolaczamy; po wycofaniu zgody klucz kasuje applyChoice z #35.
//
// OPCJA (NIE wdrozona - czeka na odpowiedz Prawnika, P7 ePrivacy): zapas w localStorage
// z TTL 30 min na wypadek "otworz w przegladarce" z IAB Facebooka/Instagrama.
export const ATTRIBUTION_FALLBACK_LOCALSTORAGE_TTL_MS = 0 // 0 = wylaczone; opcja: 30 * 60 * 1000 po decyzji Prawnika

export const ATTRIBUTION_STORAGE_KEY = 'ir_attr'
export const ATTRIBUTION_MAX_LEN = 64
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const
type UtmKey = (typeof UTM_KEYS)[number]

export type Attribution = Partial<Record<UtmKey, string>> & { fbclid_present?: true; gclid_present?: true; landing_page?: string; gclid?: string }

// Strona wejscia w sesji (sciezka od "/", bez domeny, query, hasha). Kontrakt CRM: [a-z0-9/_.-], bez "//", max 80 znakow.
// Sciezka z innymi znakami (np. polskie litery po kodowaniu) jest pomijana, zeby CRM nie dostal wartosci do odrzucenia.
export const LANDING_PAGE_MAX_LEN = 80
export function normalizeLandingPage(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.trim().toLowerCase().slice(0, LANDING_PAGE_MAX_LEN)
  if (!/^\/[a-z0-9/_.-]*$/.test(v) || v.includes('//')) return null
  return v
}

// Zwraca znormalizowana wartosc albo null (pusta / niedozwolone znaki).
export function normalizeAttributionValue(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.trim().toLowerCase().slice(0, ATTRIBUTION_MAX_LEN)
  if (!v || !/^[a-z0-9_.-]+$/.test(v)) return null
  return v
}

export function isEmptyAttribution(a: Attribution | null | undefined): boolean {
  return !a || (!a.fbclid_present && !a.gclid_present && !a.gclid && !a.landing_page && UTM_KEYS.every(k => !a[k]))
}

// Parsuje location.search (+ opcjonalnie pathname jako landing_page). Zwraca null, gdy brak utm_* / fbclid / poprawnej sciezki.
export function parseAttribution(search: string, pathname?: string): Attribution | null {
  try {
    const p = new URLSearchParams(search)
    const out: Attribution = {}
    for (const k of UTM_KEYS) {
      const v = normalizeAttributionValue(p.get(k))
      if (v) out[k] = v
    }
    if ((p.get('fbclid') ?? '').trim()) out.fbclid_present = true
    // gclid (Google Ads): jak fbclid - tylko flaga, nigdy wartosc (identyfikator klikniecia = dana osobowa).
    if ((p.get('gclid') ?? '').trim()) out.gclid_present = true
    const lp = normalizeLandingPage(pathname)
    if (lp) out.landing_page = lp
    return isEmptyAttribution(out) ? null : out
  } catch {
    return null
  }
}

function sameUtm(a: Attribution, b: Attribution): boolean {
  return UTM_KEYS.every(k => (a[k] ?? '') === (b[k] ?? ''))
}

// Regula: pierwsze dotkniecie w sesji wygrywa, chyba ze nowy URL niesie niepuste,
// ROZNE utm_* - wtedy nadpisuje. Sam fbclid (bez utm) nie nadpisuje, tylko ustawia flage.
export function mergeAttribution(stored: Attribution | null, incoming: Attribution | null): Attribution | null {
  if (isEmptyAttribution(incoming)) return isEmptyAttribution(stored) ? null : stored
  const inc = incoming as Attribution
  if (isEmptyAttribution(stored)) return inc
  const st = stored as Attribution
  const incHasUtm = UTM_KEYS.some(k => inc[k])
  if (incHasUtm && !sameUtm(st, inc)) return inc
  // Pierwsza strona wejscia w sesji zostaje; uzupelniamy ja tylko gdy jej brakowalo.
  const merged: Attribution = { ...st }
  if (inc.fbclid_present) merged.fbclid_present = true
  if (inc.gclid_present) merged.gclid_present = true
  if (!st.landing_page && inc.landing_page) merged.landing_page = inc.landing_page
  return merged.fbclid_present === st.fbclid_present && merged.gclid_present === st.gclid_present && merged.landing_page === st.landing_page ? st : merged
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

// Bramka zgody marketingowej. Domyslnie (brak rejestracji) = ODMOWA dla prawdziwego sessionStorage.
// Dotyczy tylko sciezki domyslnej (storage nie podany); jawnie podany storage (testy) omija bramke.
let marketingConsentCheck: (() => boolean) | null = null
export function registerMarketingConsentCheck(fn: (() => boolean) | null): void { marketingConsentCheck = fn }
function consentOk(): boolean {
  try { return !!marketingConsentCheck && marketingConsentCheck() === true } catch { return false }
}

function getSessionStorage(): StorageLike | null {
  try {
    return typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null
  } catch {
    return null
  }
}

// Odczyt z storage z ponowna walidacja (storage mozna recznie zmienic).
export function readStoredAttribution(storage: StorageLike | null = getSessionStorage()): Attribution | null {
  try {
    const raw = storage?.getItem(ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as Record<string, unknown>
    if (!o || typeof o !== 'object') return null
    const out: Attribution = {}
    for (const k of UTM_KEYS) {
      const v = normalizeAttributionValue(o[k])
      if (v) out[k] = v
    }
    if (o.fbclid_present === true) out.fbclid_present = true
    if (o.gclid_present === true) out.gclid_present = true
    const lp = normalizeLandingPage(o.landing_page)
    if (lp) out.landing_page = lp
    return isEmptyAttribution(out) ? null : out
  } catch {
    return null
  }
}

// Wywolywane przy wejsciu na dowolna strone. Zwraca aktualna atrybucje (po scaleniu).
export function captureAttribution(search: string, storage?: StorageLike | null, pathname?: string): Attribution | null {
  if (storage === undefined) { if (!consentOk()) return null; storage = getSessionStorage() }
  const stored = readStoredAttribution(storage)
  const merged = mergeAttribution(stored, parseAttribution(search, pathname))
  if (merged && merged !== stored) {
    try { storage?.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged)) } catch { /* storage niedostepny - trudno */ }
  }
  return merged
}

// Atrybucja do dolaczenia do zadania; null gdy brak (wtedy cialo zadania bez zmian).
export function getAttribution(storage?: StorageLike | null): Attribution | null {
  if (storage === undefined) { if (!consentOk()) return null; storage = getSessionStorage() }
  return readStoredAttribution(storage)
}

// Dokleja `attribution` do payloadu tylko gdy istnieje i jest niepuste; nie nadpisuje juz ustawionego.
export function withAttribution<T extends object>(payload: T, attribution: Attribution | null = getAttribution()): T | (T & { attribution: Attribution }) {
  if ('attribution' in payload || isEmptyAttribution(attribution)) return payload
  return { ...payload, attribution: attribution as Attribution }
}
