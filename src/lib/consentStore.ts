"use client"
import { useSyncExternalStore } from 'react'
import {
  CONSENT_STORAGE_KEY, CONSENT_CHANGE_EVENT, applyChoice, analyticsAllowed, attributionAllowed, adsAllowed, readStoredConsent, writeStoredConsent, gaCookieNames, metaCookieNames, ATTRIBUTION_SESSION_KEY,
  type ConsentChoice, type ConsentState,
} from './consent'

// Przeglądarkowy magazyn stanu zgody (localStorage + synchronizacja kart). Logika czysta: ./consent.ts.
// Wartości: undefined = jeszcze nie odczytano (SSR/pierwszy render), null = trzeba zapytać, obiekt = jest wybór.

let state: ConsentState | null | undefined
const listeners = new Set<() => void>()

function storage(): Storage | null {
  try { return typeof window !== 'undefined' ? window.localStorage : null } catch { return null }
}

function read(): ConsentState | null { return readStoredConsent(storage()) }

function notify() { listeners.forEach(l => l()) }

export function getConsent(): ConsentState | null | undefined {
  if (typeof window === 'undefined') return undefined
  if (state === undefined) state = read()
  return state
}

function deleteCookies(names: string[]) {
  // _ga* bywa ustawiane na domenie nadrzędnej - kasujemy dla bieżącego hosta i domeny nadrzędnej.
  const host = window.location.hostname
  const parts = host.split('.')
  const domains = [host, ...(parts.length > 2 ? [parts.slice(-2).join('.')] : []), ...(parts.length >= 2 ? ['.' + parts.slice(-2).join('.')] : [])]
  for (const n of names) {
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    for (const d of domains) document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`
  }
}

/** Zapisuje wybór. Przy wycofaniu zgody usuwa cookies danej kategorii (best effort). */
export function setConsent(choice: ConsentChoice): ConsentState {
  const { next, clearGa, clearMeta, clearAttribution } = applyChoice(getConsent(), choice)
  writeStoredConsent(storage(), next)
  state = next // także gdy storage niedostępny: wybór działa do końca wizyty
  try {
    if (clearGa) deleteCookies(gaCookieNames(document.cookie))
    if (clearMeta) deleteCookies(metaCookieNames(document.cookie))
  } catch { /* czyszczenie cookies nigdy nie może zepsuć strony */ }
  // Wycofanie zgody marketingowej (attribution): kasujemy zapisaną atrybucję UTM (website#42) z sessionStorage.
  if (clearAttribution) { try { window.sessionStorage.removeItem(ATTRIBUTION_SESSION_KEY) } catch { /* brak sessionStorage */ } }
  notify()
  try { window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: next })) } catch { /* zdarzenie to tylko wygoda dla innych modulow */ }
  return next
}

function onStorage(e: StorageEvent) {
  if (e.key === CONSENT_STORAGE_KEY || e.key === null) { state = read(); notify() }
}

export function subscribeConsent(l: () => void): () => void {
  listeners.add(l)
  if (listeners.size === 1 && typeof window !== 'undefined') window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    if (listeners.size === 0 && typeof window !== 'undefined') window.removeEventListener('storage', onStorage)
  }
}

export function useConsent(): ConsentState | null | undefined {
  return useSyncExternalStore(subscribeConsent, getConsent, () => undefined)
}

/**
 * Publiczny punkt zgody dla innych modułów (np. atrybucja UTM w sessionStorage/localStorage - website#42):
 * zapis czegokolwiek w urządzeniu użytkownika poza koniecznym ma być za tym warunkiem.
 * Zwraca false przed wyborem, po odrzuceniu i po stronie serwera. Nie rzuca.
 */
export function hasAnalyticsConsent(): boolean { return analyticsAllowed(getConsent()) }
/** Marketingowe: zapis atrybucji UTM (dane wyłącznie wewnętrzne). Rozłączne z hasAdsConsent. */
export function hasAttributionConsent(): boolean { return attributionAllowed(getConsent()) }
/** Reklamowe: Meta Pixel/CAPI (udostępnianie danych Meta). Do wdrożenia piksela zawsze false. */
export function hasAdsConsent(): boolean { return adsAllowed(getConsent()) }

/** Wywołuje cb po każdej zmianie wyboru (także z innej karty). Zwraca funkcję wypisującą. */
export function onConsentChange(cb: (analytics: boolean, attribution: boolean, ads: boolean) => void): () => void {
  return subscribeConsent(() => { const s = getConsent(); cb(analyticsAllowed(s), attributionAllowed(s), adsAllowed(s)) })
}