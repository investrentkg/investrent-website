// Podsumowanie ofert per miejscowość dla huba „Nadmorskie miejscowości pod Kołobrzegiem" (15.10.2026).
// Czysta logika (bez dostępu do sieci), żeby dało się ją testować: node --test src/lib/localityOffers.test.mjs
// Zasady (decyzja Daniela/Dyrektora): ceny pokazujemy TYLKO przy >= MIN_SAMPLE_FOR_PRICE ofertach z ceną za m²;
// przy mniejszej próbie samą liczbę ofert; przy 0 ofert „zapytaj w biurze". To są ceny OFERTOWE, nie rynkowe.

export const MIN_SAMPLE_FOR_PRICE = 3

export interface OfferLike {
  address_city?: string | null
  price_per_m2?: number | string | null
  property_type?: string | null
}

/** Typy, których cena za m² nie jest porównywalna z lokalami/domami (grunty, garaże) - nie wchodzą do próby cen. */
export const PRICE_EXCLUDED_TYPES = ['dzialka', 'garaz']

export interface CitySummary {
  count: number
  /** Zakres cen ofertowych za m² - tylko gdy próba >= MIN_SAMPLE_FOR_PRICE. */
  price: { min: number; max: number; median: number; n: number } | null
}

/** Normalizacja nazwy miejscowości: małe litery, bez ogonków, bez wielokrotnych spacji. */
export function foldCity(value: string | null | undefined): string {
  return String(value ?? '')
    .toLocaleLowerCase('pl')
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/** `cityNames` - nazwy kanoniczne i aliasy tej miejscowości w `address_city`. */
export function summarizeCity(offers: OfferLike[], cityNames: string[]): CitySummary {
  const wanted = new Set(cityNames.map(foldCity))
  const own = offers.filter(o => wanted.has(foldCity(o.address_city)))
  const prices = own
    .filter(o => !PRICE_EXCLUDED_TYPES.includes(String(o.property_type ?? '')))
    .map(o => Number(o.price_per_m2))
    .filter(n => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b)
  if (prices.length < MIN_SAMPLE_FOR_PRICE) return { count: own.length, price: null }
  return {
    count: own.length,
    price: { min: prices[0], max: prices[prices.length - 1], median: median(prices), n: prices.length },
  }
}

// Ceny TRANSAKCYJNE z Rejestru Cen Nieruchomości (RCN, przez Cenogram): mediana tylko przy próbie >= 10 (decyzja 15.10.2026).
export const MIN_SAMPLE_FOR_RCN_MEDIAN = 10

export interface RcnSample {
  /** Liczba transakcji lokali mieszkalnych na wolnym rynku w okresie. */
  n: number
  /** Mediana zł/m² z narzędzia; używana tylko gdy n >= MIN_SAMPLE_FOR_RCN_MEDIAN. */
  medianPerM2: number | null
  /** Zakres dat transakcji, np. 10.2024-12.2025. */
  period: string
  /** Poziom agregacji, np. gmina (gdy nie jest to sama miejscowość). */
  level?: string
}

export function formatRcnCell(s: RcnSample | null): string {
  if (!s) return '—'
  if (s.n < MIN_SAMPLE_FOR_RCN_MEDIAN || s.medianPerM2 == null) {
    const word = s.n === 1 ? 'transakcja' : s.n >= 2 && s.n <= 4 ? 'transakcje' : 'transakcji'
    return `brak wystarczającej próby (${s.n} ${word}, ${s.period})`
  }
  const lvl = s.level ? `${s.level}: ` : ''
  return `${lvl}mediana ok. ${formatThousands(s.medianPerM2)} tys. zł/m² (${s.n} transakcji, ${s.period})`
}

/** „18,9" z 18900 - tys. zł za m², jedno miejsce po przecinku, przecinek dziesiętny. */
export function formatThousands(perM2: number): string {
  return (Math.round(perM2 / 100) / 10).toFixed(1).replace('.', ',')
}

export function formatOffersCount(n: number): string {
  if (n === 0) return 'zapytaj w biurze'
  if (n === 1) return '1 oferta'
  const last = n % 10
  const lastTwo = n % 100
  return last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? `${n} oferty` : `${n} ofert`
}

export function formatPriceCell(s: CitySummary): string {
  if (!s.price) return s.count === 0 ? '—' : 'zbyt mało ofert do zakresu'
  const { min, max, median: med, n } = s.price
  return `od ok. ${formatThousands(min)} do ${formatThousands(max)} tys. zł/m², mediana ok. ${formatThousands(med)} (${formatOffersCount(n)})`
}
