// Zgody na cookies/identyfikatory (art. 399 Prawa komunikacji elektronicznej - następca art. 173 PT od 10.11.2024; § 25 TDDDG; art. 6 ust. 1 lit. a RODO).
// Czysta logika BEZ importów Next/React - importowalna przez `node --test` (patrz consent.test.mjs).
//
// Zasady (wg opinii Prawnika z 03.10.2026):
//  - kategorie: niezbędne (zawsze), analityka, marketingowe (pomiar kampanii/UTM - dane wyłącznie wewnętrzne), reklamowe (Meta Pixel/CAPI - udostępnianie danych Meta, jeszcze niewdrożone); wszystkie opcjonalne domyślnie WYŁĄCZONE;
//  - zapis wyboru w localStorage (klucz techniczny - zapamiętanie wyboru użytkownika jest "niezbędne");
//  - wybór jest wersjonowany i wygasa po CONSENT_MAX_AGE_MS (ponowne pytanie) albo po zmianie CONSENT_VERSION
//    (np. gdy dojdzie nowa kategoria/dostawca);
//  - wycofanie zgody w każdej chwili (CookieSettingsButton w stopce) - tak łatwe jak jej udzielenie.

export const CONSENT_STORAGE_KEY = 'ir_consent'
/** Zwiększyć, gdy zmienia się zakres kategorii/dostawców - wymusza ponowne pytanie. */
/**
 * Google Ads w kategorii Reklamowe (12.11.2026, werdykt Prawnika + decyzja Daniela): FLAGA NEXT_PUBLIC_GOOGLE_ADS_CONSENT.
 * OFF (domyslnie) = zachowanie jak dotad: wersja zgody 4, opis Reklamowe bez zmian, ad_* zawsze 'denied'.
 * ON = wersja zgody 5 (ponowne pytanie wszystkich), kategoria Reklamowe obejmuje Meta + Google Ads (teksty, tabela cookies, polityka),
 * po zgodzie Reklamowe ad_storage/ad_user_data/ad_personalization = 'granted'.
 * NIE WLACZAC przed: akceptacja tekstow (Krytyk, Prawnik, trzeci recenzent, przeglad DE Ernesta), decyzja Daniela i testem na zywo w czystej przegladarce.
 */
export const GOOGLE_ADS_CONSENT_ENABLED: boolean = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONSENT === 'on'
export const CONSENT_VERSION = GOOGLE_ADS_CONSENT_ENABLED ? 5 : 4
// v2 (09.10.2026): kategoria Marketingowe zawsze widoczna (zapis atrybucji UTM, website#42).
// v3 (09.10.2026, doprecyzowanie Prawnika pkt c): rozdzielone zgody - `attribution` (UTM, dane tylko wewnętrzne) i `ads` (Meta Pixel/CAPI, odrębny administrator);
// zapisy z v1/v2 = brak zgody, ponowne pytanie.
// v5 (12.11.2026, za flaga NEXT_PUBLIC_GOOGLE_ADS_CONSENT): Reklamowe obejmuje Meta + Google Ads (cookies _gcl_aw/_gcl_au), zdanie w Analitycznych o modelu konwersji Ads; ponowne pytanie wszystkich.
// v4 (11.11.2026, Prawnik TAK, decyzja Daniela): nowy, niski baner (trzy przyciski jednakowego stylu, krotka pierwsza warstwa) i zmiana opisu kategorii Reklamowe; wersja rosnie dla calego serwisu - ponowne pytanie. Gdy powstanie Pixel/CAPI: ADS_AVAILABLE=true BEZ podbijania wersji (klucz `ads` jest już w zapisie).
/** Ponowne pytanie po 12 miesiącach (propozycja do opinii Prawnika). */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000
/** Zdarzenie okna: otwiera ustawienia cookies (przycisk w stopce / w polityce). */
export const CONSENT_OPEN_EVENT = 'ir-consent-open'

export interface ConsentState {
  v: number
  analytics: boolean
  /** Marketingowe: zapis atrybucji UTM (dane wyłącznie wewnętrzne, nie opuszczają systemów InvestRent). */
  attribution: boolean
  /** Reklamowe: Meta Pixel/CAPI - udostępnianie danych Meta (odrębny administrator). Do czasu wdrożenia zawsze false (ADS_AVAILABLE). */
  ads: boolean
  /** Czas udzielenia/zmiany zgody (ms od epoki). */
  ts: number
}

/** Czy kategoria Reklamowe (Pixel/CAPI) jest już wdrożona i wybieralna. FALSE = przełącznik w panelu nieaktywny, zgoda `ads` nigdy nie jest zapisywana jako true. */
export const META_PIXEL_ENABLED: boolean = process.env.NEXT_PUBLIC_META_PIXEL_ENABLED === 'on'
export const ADS_AVAILABLE: boolean = META_PIXEL_ENABLED || GOOGLE_ADS_CONSENT_ENABLED

export type ConsentChoice = { analytics: boolean; attribution: boolean; ads: boolean }
export const REJECT_ALL: ConsentChoice = { analytics: false, attribution: false, ads: false }
export const ACCEPT_ALL: ConsentChoice = { analytics: true, attribution: true, ads: true }

export function makeConsent(choice: ConsentChoice, now: number = Date.now()): ConsentState {
  return { v: CONSENT_VERSION, analytics: !!choice.analytics, attribution: !!choice.attribution, ads: ADS_AVAILABLE && !!choice.ads, ts: now }
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
    if (typeof o.analytics !== 'boolean' || typeof o.attribution !== 'boolean' || typeof o.ads !== 'boolean') return null
    if (typeof o.ts !== 'number' || !Number.isFinite(o.ts)) return null
    if (o.ts > now + 24 * 60 * 60 * 1000) return null
    if (now - o.ts > CONSENT_MAX_AGE_MS) return null
    return { v: o.v, analytics: o.analytics, attribution: o.attribution, ads: o.ads, ts: o.ts }
  } catch {
    return null
  }
}

export const serializeConsent = (s: ConsentState): string => JSON.stringify({ v: s.v, analytics: s.analytics, attribution: s.attribution, ads: s.ads, ts: s.ts })

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
  // Flaga GOOGLE_ADS_CONSENT_ENABLED OFF: GA4 to wyłącznie analityka, sygnały reklamowe Google (ad_*) zawsze odmowa.
  // ON: ad_* = granted tylko przy zgodzie Reklamowe (s.ads); analityka niezależnie od niej.
  const ad = GOOGLE_ADS_CONSENT_ENABLED && !!s?.ads ? 'granted' : 'denied'
  return { analytics_storage: s?.analytics ? 'granted' : 'denied', ad_storage: ad, ad_user_data: ad, ad_personalization: ad }
}

/** Nazwy cookies Google Analytics do usunięcia po wycofaniu zgody na analitykę (`_ga`, `_ga_<ID>`, `_gid`, `_gat*`). */
export function gaCookieNames(cookieString: string): string[] {
  return (cookieString || '').split(';').map(p => p.split('=')[0].trim()).filter(n => /^(_ga(_[A-Za-z0-9]+)?|_gid|_gat(_.+)?)$/.test(n))
}

/** Nazwy cookies Meta (`_fbp`, `_fbc`) do usunięcia po wycofaniu zgody reklamowej (ads). */
export function metaCookieNames(cookieString: string): string[] {
  return (cookieString || '').split(';').map(p => p.split('=')[0].trim()).filter(n => n === '_fbp' || n === '_fbc')
}

/** Nazwy cookies Google Ads (`_gcl_aw`, `_gcl_au`) do usunięcia po wycofaniu zgody Reklamowe. */
export function googleAdsCookieNames(cookieString: string): string[] {
  return (cookieString || '').split(';').map(p => p.split('=')[0].trim()).filter(n => n === '_gcl_aw' || n === '_gcl_au' || /^_gcl_(aw|au)_.+$/.test(n))
}

/** Klucz sessionStorage z atrybucją reklamową UTM (website#42, src/lib/attribution.ts: ATTRIBUTION_STORAGE_KEY). Kasowany po wycofaniu zgody marketingowej (attribution). */
/** Utrzymać zgodnie z #42. */
export const ATTRIBUTION_SESSION_KEY = 'ir_attr'

/** Zdarzenie okna wysyłane po KAŻDEJ zmianie wyboru (detail: ConsentState). Inne moduły (np. atrybucja UTM) mogą nasłuchiwać zamiast odpytywać. */
export const CONSENT_CHANGE_EVENT = 'ir-consent-change'

/** Czy wolno uruchomić analitykę (GA4, zapis UTM do Web Storage itp.). Brak wyboru (null/undefined) = NIE. */
export const analyticsAllowed = (s: ConsentState | null | undefined): boolean => !!s && s.analytics === true
/** Czy wolno zapisywać atrybucję UTM (kategoria Marketingowe; dane wyłącznie wewnętrzne). Brak wyboru = NIE. Rozłączne z adsAllowed. */
export const attributionAllowed = (s: ConsentState | null | undefined): boolean => !!s && s.attribution === true
/** Czy wolno uruchomić piksel/CAPI Meta (kategoria Reklamowe; udostępnianie danych Meta). Brak wyboru = NIE. Rozłączne z attributionAllowed. */
export const adsAllowed = (s: ConsentState | null | undefined): boolean => !!s && s.ads === true

/**
 * Przejście stanu przy zapisie wyboru: nowy stan + które cookies posprzątać (tylko przy WYCOFANIU kategorii,
 * nie gdy kategoria nigdy nie była włączona). Czysta funkcja - testowalna bez przeglądarki.
 */
export function applyChoice(prev: ConsentState | null | undefined, choice: ConsentChoice, now: number = Date.now()): { next: ConsentState; clearGa: boolean; clearMeta: boolean; clearAttribution: boolean } {
  const next = makeConsent(choice, now)
  return {
    next,
    clearGa: !!prev?.analytics && !next.analytics,
    clearMeta: !!prev?.ads && !next.ads,
    clearAttribution: !!prev?.attribution && !next.attribution,
  }
}
