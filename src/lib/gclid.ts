// Pelna wartosc gclid (Google Ads) przy leadzie z kalkulatora - wariant B (werdykt Prawnika 12.11; CRM: lib/leadGclid.ts, tabela lead_gclid).
// Decyzja Daniela 13.11: wartosc wysylamy do CRM TYLKO przy zgodzie "Reklamowe" w wersji 5 (Meta + Google Ads, GOOGLE_ADS_CONSENT_ENABLED);
// bez zgody NIC nie zapisujemy w przegladarce i niczego nie wysylamy. Serwer dodatkowo sprawdza wersje zgody w znaczniku [Zgoda-kalkulator]
// (GCLID_CONSENT_VERSIONS) i flage GCLID_FULL_CAPTURE_ENABLED - bez nich pole jest odrzucane (fail closed).
// Wartosc przechowujemy tylko w sessionStorage (klucz ir_gclid), kasujemy po wycofaniu zgody Reklamowe; nigdy w logach, URL-ach ani analityce.
// Plik bez Reacta i bez consentStore (testowalny w node): zgoda przekazywana przez wywolujacego.
import type { Attribution } from './attribution.ts'

export const GCLID_STORAGE_KEY = 'ir_gclid'
export const GCLID_TYPE_STORAGE_KEY = 'ir_gclid_type'
export const GCLID_RE = /^[A-Za-z0-9_-]{10,128}$/
export type ClickIdType = 'gclid' | 'gbraid' | 'wbraid'
export type ClickId = { type: ClickIdType; value: string }

type StorageLike = Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>>

function getSessionStorage(): StorageLike | null {
  try { return typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null } catch { return null }
}

/** Zwalidowany identyfikator klikniecia z pierwszenstwem gclid > gbraid > wbraid. */
export function parseClickIdValue(search: string): ClickId | null {
  try {
    const params = new URLSearchParams(search)
    for (const type of ['gclid', 'gbraid', 'wbraid'] as const) {
      const value = (params.get(type) ?? '').trim()
      if (GCLID_RE.test(value)) return { type, value }
    }
    return null
  } catch { return null }
}

/** Kompatybilny odczyt samego gclid. */
export function parseGclidValue(search: string): string | null {
  const clickId = parseClickIdValue(search)
  return clickId?.type === 'gclid' ? clickId.value : null
}

/** Zapis gclid z biezacego adresu. Bez zgody Reklamowe (adsOk=false) = nic nie zapisuje. Zwraca zapisana wartosc albo null. */
export function captureGclid(search: string, adsOk: boolean, storage: StorageLike | null = getSessionStorage()): string | null {
  if (!adsOk) return null
  const clickId = parseClickIdValue(search)
  if (!clickId) return null
  try {
    storage?.setItem(GCLID_STORAGE_KEY, clickId.value)
    storage?.setItem(GCLID_TYPE_STORAGE_KEY, clickId.type)
  } catch { /* storage niedostepny - trudno */ }
  return clickId.value
}

/** Odczyt do wyslania z leadem; bez zgody Reklamowe zawsze null (nawet gdy wartosc zostala w storage). Ponowna walidacja ksztaltu. */
export function readGclid(adsOk: boolean, storage: StorageLike | null = getSessionStorage()): string | null {
  if (!adsOk) return null
  try {
    const raw = storage?.getItem(GCLID_STORAGE_KEY)
    return raw && GCLID_RE.test(raw) ? raw : null
  } catch { return null }
}

/** Kasuje wartosc i jej typ po wycofaniu zgody Reklamowe. */
export function clearGclid(storage: StorageLike | null = getSessionStorage()): void {
  try {
    storage?.removeItem?.(GCLID_STORAGE_KEY)
    storage?.removeItem?.(GCLID_TYPE_STORAGE_KEY)
  } catch { /* storage niedostepny - trudno */ }
}

/** Dokleja gclid do atrybucji leada (tylko przy zgodzie i poprawnej wartosci); bez tego zwraca atrybucje bez zmian. */
export function attributionWithGclid(attribution: Attribution | null, adsOk: boolean, storage?: StorageLike | null): Attribution | null {
  const activeStorage = storage === undefined ? getSessionStorage() : storage
  const g = readGclid(adsOk, activeStorage)
  if (!g) return attribution
  let type: ClickIdType = 'gclid'
  try {
    const storedType = activeStorage?.getItem(GCLID_TYPE_STORAGE_KEY)
    if (storedType === 'gbraid' || storedType === 'wbraid') type = storedType
  } catch { /* wsteczna kompatybilnosc: brak typu oznacza gclid */ }
  return { ...(attribution ?? {}), [type]: g }
}
