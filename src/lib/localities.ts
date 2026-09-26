// Konfiguracja lokalizacji kalkulatora wyceny per biuro (v11.3, 26.09.2026).
// CRM ma byc produktem SaaS: miasto domowe biura, slowniki i wylaczone dzielnice to KONFIGURACJA biura, nie stale w kodzie.
// Dzis jedyna konfiguracja to InvestRent (Kolobrzeg); dla innego biura wystarczy podac inny obiekt CalculatorConfig
// (docelowo z API/tenanta). Pola miejscowosc i dzielnica NIE sa wolnym tekstem (recenzja Krytyka): wartosc spoza slownika = "Inna ...".

export interface CalculatorConfig {
  /** Miejscowosc, dla ktorej liczymy widelki online (miasto domowe biura). */
  homeCity: string
  /** Slownik miejscowosci (pierwsza = homeCity). Zrodlo: backend/src/lib/localities.ts (WESTERN_POMERANIA_LOCALITIES), podzbior. */
  cities: string[]
  /** Slownik dzielnic/osiedli miasta domowego. LISTA CZESCIOWA (patrz districtsSource). */
  districts: string[]
  /** Dzielnice, dla ktorych biuro NIE podaje widelek online (tylko wycena agenta); wzorce po normalizacji (bez ogonkow, male litery). */
  restrictedDistrictPatterns: string[]
  otherCity: string
  otherDistrict: string
  /** Skad pochodzi lista dzielnic (jawnie, sprawdzalnie). NIE uzupelniac z pamieci. */
  districtsSource: string
  /** Data ostatniego przegladu listy dzielnic przez biuro; null = nieprzegladana. */
  districtsReviewedAt: string | null
  /** Aliasy pisowni miejscowosci: klucz = nazwa po fold, wartosc = nazwa kanoniczna ze slownika (np. bogucin -> Bogucino). */
  cityAliases?: Record<string, string>
}

export const INVESTRENT_CONFIG: CalculatorConfig = {
  homeCity: 'Kołobrzeg',
  cities: [
    'Kołobrzeg',
    'Szczecin', 'Koszalin', 'Świnoujście', 'Stargard', 'Police', 'Goleniów', 'Gryfice', 'Białogard',
    'Darłowo', 'Wałcz', 'Szczecinek', 'Choszczno', 'Myślibórz', 'Pyrzyce', 'Barlinek', 'Gryfino', 'Nowogard',
    'Trzebiatów', 'Międzyzdroje', 'Wolin', 'Kamień Pomorski', 'Dziwnów', 'Świdwin', 'Połczyn-Zdrój', 'Drawsko Pomorskie',
    'Złocieniec', 'Czaplinek', 'Łobez', 'Resko', 'Chojna', 'Dębno', 'Sławno', 'Sianów', 'Mielno', 'Karlino',
    'Ustronie Morskie', 'Sarbinowo', 'Dźwirzyno', 'Grzybowo', 'Zieleniewo', 'Bogucino', 'Budzistowo',
    'Rewal', 'Pobierowo', 'Niechorze', 'Pogorzelica', 'Mrzeżyno', 'Łukęcin', 'Międzywodzie', 'Unieście',
    'Darłówko', 'Jarosławiec', 'Ustka', 'Dąbki', 'Kołczewo', 'Rusinowo', 'Mielenko', 'Kukinia',
    'Kobylanka', 'Bezrzecze', 'Mierzyn', 'Skolwin', 'Dobra Szczecińska', 'Kołbaskowo',
  ],
  // Nazwy WYLACZNIE z danych/polityki (nie z pamieci): ogloszenia w portal_listings_archive (address_district, miasto Kolobrzeg,
  // >= 8 ogloszen, odczyt 26.09.2026: Podczele, Radzikowo, Zachodnia, Srodmiescie, "Kolobrzeg Centrum") oraz BLOCKED_DISTRICT_PATTERNS
  // backendu (srodmiesc, centrum, stare miasto). Lista jest CZESCIOWA; brak na liscie = "Inna dzielnica".
  districts: ['Śródmieście', 'Centrum', 'Stare Miasto', 'Podczele', 'Radzikowo', 'Zachodnia'],
  restrictedDistrictPatterns: ['srodmiesc', 'centrum', 'stare miasto'],
  otherCity: 'Inna lokalizacja',
  otherDistrict: 'Inna dzielnica',
  districtsSource: 'portal_listings_archive.address_district (miasto Kołobrzeg, >= 8 ogłoszeń, odczyt 26.09.2026) + BLOCKED_DISTRICT_PATTERNS backendu (publicValuationRules.ts); przegląd listy: decyzja Daniela, biuro (26.09.2026): Grzybowo, Bogucino, Budzistowo, Zieleniewo i Dźwirzyno to osobne miejscowości (nie dzielnice Kołobrzegu); docelowo rejestr urzędowy (TERYT/SIMC lub wykaz osiedli w BIP miasta)',
  districtsReviewedAt: '2026-09-26',
  // Decyzja biura 26.09.2026: te 5 miejscowosci klient wybiera jako MIEJSCOWOSC, nigdy jako dzielnice Kolobrzegu. "Bogucin" -> forma urzedowa Bogucino.
  cityAliases: { bogucin: 'Bogucino' },
}

/** Aktywna konfiguracja (dzis stala InvestRent; docelowo z konfiguracji tenanta). */
export let CALCULATOR_CONFIG: CalculatorConfig = INVESTRENT_CONFIG
export function setCalculatorConfig(c: CalculatorConfig): void { CALCULATOR_CONFIG = c }

// Zgodnosc wsteczna nazw uzywanych w reszcie kodu (wartosci z aktywnej konfiguracji w chwili importu; dla testow i UI).
export const OTHER_CITY = INVESTRENT_CONFIG.otherCity
export const OTHER_DISTRICT = INVESTRENT_CONFIG.otherDistrict
export const CITY_LIST: string[] = INVESTRENT_CONFIG.cities
export const KOLOBRZEG_DISTRICTS: string[] = INVESTRENT_CONFIG.districts

export const fold = (t: string): string =>
  t.trim().toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').split(/\s+/).join(' ')

function canonical(list: string[], extra: string, value: string, aliases?: Record<string, string>): string | null {
  let f = fold(value)
  if (!f) return null
  if (f === fold(extra)) return extra
  const alias = aliases?.[f]
  if (alias) f = fold(alias)
  return list.find(x => fold(x) === f) ?? null
}
/** Nazwa z diakrytykami ze slownika albo "Inna lokalizacja"; null = spoza slownika. */
export const canonicalCity = (v: string): string | null => canonical(CALCULATOR_CONFIG.cities, CALCULATOR_CONFIG.otherCity, v, CALCULATOR_CONFIG.cityAliases)
/** Nazwa dzielnicy ze slownika albo "Inna dzielnica"; null = spoza slownika. */
export const canonicalDistrict = (v: string): string | null => canonical(CALCULATOR_CONFIG.districts, CALCULATOR_CONFIG.otherDistrict, v)
/** Czy miejscowosc to miasto domowe biura (dla ktorego liczymy widelki online). */
export const isHomeCity = (city: string): boolean => fold(city) === fold(CALCULATOR_CONFIG.homeCity)
/** Czy dzielnica jest wylaczona z widelek online (Srodmiescie itd.). */
export const isRestrictedDistrict = (district: string): boolean => {
  const f = fold(district)
  return CALCULATOR_CONFIG.restrictedDistrictPatterns.some(p => f.includes(p))
}
