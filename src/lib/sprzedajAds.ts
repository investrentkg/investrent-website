// Formularz sprzedazowy (/sprzedaj-z-investrent): gclid do CRM TYLKO przy zgodzie Reklamowe v5 (hasGoogleAdsConsent, wywolujacy podaje adsOk)
// i ze wlasnym dowodem zgody w notatce: `[Zgoda-reklamowe] czas=<ISO>; kanał=sprzedaj; wersja=<N>` (CRM: lib/leadGclid.ts parseAdsConsentMarker,
// wersja reklamowe-<N> musi byc w GCLID_CONSENT_VERSIONS, flaga GCLID_FULL_CAPTURE_ENABLED). Bez gclid w storage/zgody: notes i atrybucja bez zmian.
// Plik bez Reacta (testowalny w node).
import { attributionWithGclid, readGclid } from './gclid.ts'
import type { Attribution } from './attribution.ts'

export const ADS_CONSENT_VERSION = '5'
export const ADS_CONSENT_CHANNEL = 'sprzedaj'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function adsConsentMarker(now: Date = new Date()): string {
  return `[Zgoda-reklamowe] czas=${now.toISOString()}; kanał=${ADS_CONSENT_CHANNEL}; wersja=${ADS_CONSENT_VERSION}`
}

/** Zwraca notes (z dopisanym znacznikiem) i atrybucje z gclid tylko gdy jest zgoda Reklamowe i poprawny gclid; inaczej { notes } bez zmian. */
export function sprzedajLeadAds(input: { adsOk: boolean; notes: string; attribution: Attribution | null; now?: Date; storage?: StorageLike | null }): { notes: string; attribution?: Attribution } {
  const g = readGclid(input.adsOk, input.storage === undefined ? undefined : input.storage)
  if (!g) return { notes: input.notes }
  const attribution = attributionWithGclid(input.attribution, input.adsOk, input.storage)
  return { notes: `${input.notes}\n${adsConsentMarker(input.now)}`, ...(attribution ? { attribution } : {}) }
}