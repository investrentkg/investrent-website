// Zapamietanie wyboru "Zaladuj mape Google" (click-to-load, ConsentEmbed.tsx).
// Czysta logika BEZ importow Next/React - testowalna przez `node --test` (mapConsent.test.mjs).
//
// Zasady (decyzja Daniela 18.10.2026, wariant A):
//  - wybor zapisywany WYLACZNIE po stronie klienta w localStorage (nie cookie, nic nie trafia na serwer);
//  - zapis: {"v":1,"ts":<ms>}; wazny 12 miesiecy, potem ignorowany i usuwany;
//  - brak localStorage / wyjatki (tryb prywatny, zablokowane dane) = zachowanie jak dotad (przycisk);
//  - mapa laduje sie sama TYLKO przy waznym zapisie; wycofanie = usuniecie wpisu (clearMapConsent).

export const MAP_CONSENT_KEY = 'mapGoogleConsent'
/** Zwiekszyc, gdy zmieni sie zakres/dostawca - wymusza ponowne klikniecie. */
export const MAP_CONSENT_VERSION = 1
/** 12 miesiecy. */
export const MAP_CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

export interface MapStorageLike { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

/** true = zapis wazny (wersja, znacznik czasu, nie wygasl, nie z przyszlosci > 1 doba). Nigdy nie rzuca. */
export function isValidMapConsent(raw: string | null | undefined, now: number = Date.now()): boolean {
  if (!raw) return false
  try {
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return false
    if (o.v !== MAP_CONSENT_VERSION) return false
    if (typeof o.ts !== 'number' || !Number.isFinite(o.ts)) return false
    if (o.ts > now + 24 * 60 * 60 * 1000) return false
    if (now - o.ts > MAP_CONSENT_MAX_AGE_MS) return false
    return true
  } catch {
    return false
  }
}

/** localStorage albo null (SSR, tryb prywatny, zablokowane dane - sam dostep do wlasciwosci moze rzucic). */
export function getMapStorage(): MapStorageLike | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage ?? null
  } catch {
    return null
  }
}

/** true = jest wazny zapisany wybor. Wpis niewazny/wygasly jest usuwany. */
export function readMapConsent(storage: MapStorageLike | null | undefined, now: number = Date.now()): boolean {
  try {
    if (!storage) return false
    const raw = storage.getItem(MAP_CONSENT_KEY)
    if (raw === null || raw === undefined) return false
    if (isValidMapConsent(raw, now)) return true
    try { storage.removeItem(MAP_CONSENT_KEY) } catch { /* ignoruj */ }
    return false
  } catch {
    return false
  }
}

/** true = zapisano; false = storage niedostepny (wybor dziala wtedy tylko do konca wizyty). */
export function writeMapConsent(storage: MapStorageLike | null | undefined, now: number = Date.now()): boolean {
  try {
    if (!storage) return false
    storage.setItem(MAP_CONSENT_KEY, JSON.stringify({ v: MAP_CONSENT_VERSION, ts: now }))
    return true
  } catch {
    return false
  }
}

/** Wycofanie wyboru: usuwa wpis. true = usunieto (lub nic nie bylo); false = storage niedostepny. */
export function clearMapConsent(storage: MapStorageLike | null | undefined): boolean {
  try {
    if (!storage) return false
    storage.removeItem(MAP_CONSENT_KEY)
    return true
  } catch {
    return false
  }
}

/** Zdarzenie okna: wycofano wybor mapy - KAZDA instancja MapEmbed na stronie ma wrocic do przycisku. */
export const MAP_CONSENT_REVOKED_EVENT = 'ir-map-consent-revoked'

/** Czy mapa ma zaladowac sie sama (ważny wpis w localStorage przegladarki). Uzywane w efekcie po zamontowaniu. */
export function shouldAutoLoadMap(now: number = Date.now()): boolean {
  return readMapConsent(getMapStorage(), now)
}

/** Wycofanie: usuwa wpis i powiadamia wszystkie instancje w tej karcie (CustomEvent); inne karty dostana zdarzenie `storage`. */
export function revokeMapConsent(): void {
  clearMapConsent(getMapStorage())
  try {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(MAP_CONSENT_REVOKED_EVENT))
  } catch { /* ignoruj */ }
}

/** Nasluch wycofania (ta karta: CustomEvent; inne karty: `storage` z usunieciem klucza). Zwraca funkcje odpinajaca. */
export function onMapConsentRevoked(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (e: StorageEvent) => { if (e.key === MAP_CONSENT_KEY && e.newValue === null) handler() }
  window.addEventListener(MAP_CONSENT_REVOKED_EVENT, handler)
  window.addEventListener('storage', onStorage)
  return () => { window.removeEventListener(MAP_CONSENT_REVOKED_EVENT, handler); window.removeEventListener('storage', onStorage) }
}