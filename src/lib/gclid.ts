// Pelna wartosc gclid (Google Ads) przy leadzie z kalkulatora - wariant B (werdykt Prawnika 12.11; CRM: lib/leadGclid.ts, tabela lead_gclid).
// Decyzja Daniela 13.11: wartosc wysylamy do CRM TYLKO przy zgodzie "Reklamowe" w wersji 5 (Meta + Google Ads, GOOGLE_ADS_CONSENT_ENABLED);
// bez zgody NIC nie zapisujemy w przegladarce i niczego nie wysylamy. Serwer dodatkowo sprawdza wersje zgody w znaczniku [Zgoda-kalkulator]
// (GCLID_CONSENT_VERSIONS) i flage GCLID_FULL_CAPTURE_ENABLED - bez nich pole jest odrzucane (fail closed).
// Wartosc przechowujemy tylko w sessionStorage (klucz ir_gclid), kasujemy po wycofaniu zgody Reklamowe; nigdy w logach, URL-ach ani analityce.
// Plik bez Reacta i bez consentStore (testowalny w node): zgoda przekazywana przez wywolujacego.
import type { Attribution } from './attribution.ts'

export const GCLID_STORAGE_KEY = 'ir_gclid'
export const GCLID_RE = /^[A-Za-z0-9_-]{10,128}$/

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

function getSessionStorage(): StorageLike | null {
  try { return typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null } catch { return null }
}

/** Zwalidowany gclid z location.search albo null. Wielkosc liter zachowana (identyfikator jest wrazliwy na wielkosc). */
export function parseGclidValue(search: string): string | null {
  try {
    const v = (new URLSearchParams(search).get('gclid') ?? '').trim()
    return GCLID_RE.test(v) ? v : null
  } catch { return null }
}

/** Zapis gclid z biezacego adresu. Bez zgody Reklamowe (adsOk=false) = nic nie zapisuje. Zwraca zapisana wartosc albo null. */
export function captureGclid(search: string, adsOk: boolean, storage: StorageLike | null = getSessionStorage()): string | null {
  if (!adsOk) return null
  const v = parseGclidValue(search)
  if (!v) return null
  try { storage?.setItem(GCLID_STORAGE_KEY, v) } catch { /* storage niedostepny - trudno */ }
  return v
}

/** Odczyt do wyslania z leadem; bez zgody Reklamowe zawsze null (nawet gdy wartosc zostala w storage). Ponowna walidacja ksztaltu. */
export function readGclid(adsOk: boolean, storage: StorageLike | null = getSessionStorage()): string | null {
  if (!adsOk) return null
  try {
    const raw = storage?.getItem(GCLID_STORAGE_KEY)
    return raw && GCLID_RE.test(raw) ? raw : null
  } catch { return null }
}

/** Dokleja gclid do atrybucji leada (tylko przy zgodzie i poprawnej wartosci); bez tego zwraca atrybucje bez zmian. */
export function attributionWithGclid(attribution: Attribution | null, adsOk: boolean, storage?: StorageLike | null): Attribution | null {
  const g = readGclid(adsOk, storage === undefined ? getSessionStorage() : storage)
  if (!g) return attribution
  return { ...(attribution ?? {}), gclid: g }
}
