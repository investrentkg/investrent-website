"use client"
import { useSyncExternalStore } from 'react'
import {
  CONSENT_STORAGE_KEY, CONSENT_CHANGE_EVENT, applyChoice, analyticsAllowed, marketingAllowed, readStoredConsent, writeStoredConsent, gaCookieNames, metaCookieNames,
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
  const { next, clearGa, clearMeta } = applyChoice(getConsent(), choice)
  writeStoredConsent(storage(), next)
  state = next // także gdy storage niedostępny: wybór działa do końca wizyty
  try {
    if (clearGa) deleteCookies(gaCookieNames(document.cookie))
    if (clearMeta) deleteCookies(metaCookieNames(document.cookie))
  } catch { /* czyszczenie cookies nigdy nie może zepsuć strony */ }
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
export function hasMarketingConsent(): boolean { return marketingAllowed(getConsent()) }

/** Wywołuje cb po każdej zmianie wyboru (także z innej karty). Zwraca funkcję wypisującą. */
export function onConsentChange(cb: (analytics: boolean, marketing: boolean) => void): () => void {
  return subscribeConsent(() => { const s = getConsent(); cb(analyticsAllowed(s), marketingAllowed(s)) })
}