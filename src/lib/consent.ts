// Zgody na cookies/identyfikatory (art. 399 Prawa komunikacji elektronicznej - następca art. 173 PT od 10.11.2024; § 25 TDDDG; art. 6 ust. 1 lit. a RODO).
// Czysta logika BEZ importów Next/React - importowalna przez `node --test` (patrz consent.test.mjs).
//
// Zasady (wg opinii Prawnika z 03.10.2026):
//  - kategorie: niezbędne (zawsze), analityka, marketing; analityka i marketing domyślnie WYŁĄCZONE;
//  - zapis wyboru w localStorage (klucz techniczny - zapamiętanie wyboru użytkownika jest "niezbędne");
//  - wybór jest wersjonowany i wygasa po CONSENT_MAX_AGE_MS (ponowne pytanie) albo po zmianie CONSENT_VERSION
//    (np. gdy dojdzie nowa kategoria/dostawca);
//  - wycofanie zgody w każdej chwili (CookieSettingsButton w stopce) - tak łatwe jak jej udzielenie.

export const CONSENT_STORAGE_KEY = 'ir_consent'
/** Zwiększyć, gdy zmienia się zakres kategorii/dostawców - wymusza ponowne pytanie. */
export const CONSENT_VERSION = 1
/** Ponowne pytanie po 12 miesiącach (propozycja do opinii Prawnika). */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000
/** Zdarzenie okna: otwiera ustawienia cookies (przycisk w stopce / w polityce). */
export const CONSENT_OPEN_EVENT = 'ir-consent-open'

export interface ConsentState {
  v: number
  analytics: boolean
  marketing: boolean
  /** Czas udzielenia/zmiany zgody (ms od epoki). */
  ts: number
}

export type ConsentChoice = { analytics: boolean; marketing: boolean }
export const REJECT_ALL: ConsentChoice = { analytics: false, marketing: false }
export const ACCEPT_ALL: ConsentChoice = { analytics: true, marketing: true }

export function makeConsent(choice: ConsentChoice, now: number = Date.now()): ConsentState {
  return { v: CONSENT_VERSION, analytics: !!choice.analytics, marketing: !!choice.marketing, ts: now }
}

/**
 * Odczyt zapisanego stanu. null = trzeba zapytać (brak zapisu, uszkodzony, inna wersja, wygasły,
 * data z przyszłości > 1 doba - zepsuty zegar/manipulacja). Nigdy nie rzuca.
 */
export function parseConsent(raw: string | null | undefined, now: number = Date.now()): ConsentState | null {
  if (!raw) return null
  try {
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return null
    if (o.v !== CONSENT_VERSION) return null
    if (typeof o.analytics !== 'boolean' || typeof o.marketing !== 'boolean') return null
    if (typeof o.ts !== 'number' || !Number.isFinite(o.ts)) return null
    if (o.ts > now + 24 * 60 * 60 * 1000) return null
    if (now - o.ts > CONSENT_MAX_AGE_MS) return null
    return { v: o.v, analytics: o.analytics, marketing: o.marketing, ts: o.ts }
  } catch {
    return null
  }
}

export const serializeConsent = (s: ConsentState): string => JSON.stringify({ v: s.v, analytics: s.analytics, marketing: s.marketing, ts: s.ts })

/** Minimalny interfejs Storage (testy podstawiają atrapę). */
export interface StorageLike { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem?(k: string): void }

export function readStoredConsent(storage: StorageLike | null | undefined, now: number = Date.now()): ConsentState | null {
  try { return storage ? parseConsent(storage.getItem(CONSENT_STORAGE_KEY), now) : null } catch { return null }
}

/** true = zapisano; false = storage niedostępny (tryb prywatny/blokada) - wybór działa wtedy tylko do końca wizyty. */
export function writeStoredConsent(storage: StorageLike | null | undefined, state: ConsentState): boolean {
  try { if (!storage) return false; storage.setItem(CONSENT_STORAGE_KEY, serializeConsent(state)); return true } catch { return false }
}

/** Argumenty `gtag('consent', 'update', ...)` (Consent Mode v2) dla danego stanu; null stan = wszystko odmowa. */
export function googleConsentArgs(s: ConsentState | null): Record<'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization', 'granted' | 'denied'> {
  // Google Analytics to wyłącznie analityka; reklamowe sygnały Google (ad_*) nie są używane - zawsze odmowa
  // (zgoda "marketing" dotyczy piksela Meta, nie Google Ads).
  return { analytics_storage: s?.analytics ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }
}

/** Nazwy cookies Google Analytics do usunięcia po wycofaniu zgody na analitykę (`_ga`, `_ga_<ID>`, `_gid`, `_gat*`). */
export function gaCookieNames(cookieString: string): string[] {
  return (cookieString || '').split(';').map(p => p.split('=')[0].trim()).filter(n => /^(_ga(_[A-Za-z0-9]+)?|_gid|_gat(_.+)?)$/.test(n))
}

/** Nazwy cookies Meta (`_fbp`, `_fbc`) do usunięcia po wycofaniu zgody marketingowej. */
export function metaCookieNames(cookieString: string): string[] {
  return (cookieString || '').split(';').map(p => p.split('=')[0].trim()).filter(n => n === '_fbp' || n === '_fbc')
}

/** Czy pokazać kategorię "marketing": tylko gdy faktycznie coś marketingowego jest wdrożone (id piksela). Nie pytamy o zgodę na nic, czego nie ma. */
export const marketingAvailable = (pixelId: string | undefined | null): boolean => !!pixelId && /^\d{6,20}$/.test(String(pixelId))

/** Zdarzenie okna wysyłane po KAŻDEJ zmianie wyboru (detail: ConsentState). Inne moduły (np. atrybucja UTM) mogą nasłuchiwać zamiast odpytywać. */
export const CONSENT_CHANGE_EVENT = 'ir-consent-change'

/** Czy wolno uruchomić analitykę (GA4, zapis UTM do Web Storage itp.). Brak wyboru (null/undefined) = NIE. */
export const analyticsAllowed = (s: ConsentState | null | undefined): boolean => !!s && s.analytics === true
/** Czy wolno uruchomić marketing (piksel Meta itp.). Brak wyboru = NIE. */
export const marketingAllowed = (s: ConsentState | null | undefined): boolean => !!s && s.marketing === true

/**
 * Przejście stanu przy zapisie wyboru: nowy stan + które cookies posprzątać (tylko przy WYCOFANIU kategorii,
 * nie gdy kategoria nigdy nie była włączona). Czysta funkcja - testowalna bez przeglądarki.
 */
export function applyChoice(prev: ConsentState | null | undefined, choice: ConsentChoice, now: number = Date.now()): { next: ConsentState; clearGa: boolean; clearMeta: boolean } {
  const next = makeConsent(choice, now)
  return { next, clearGa: !!prev?.analytics && !next.analytics, clearMeta: !!prev?.marketing && !next.marketing }
}