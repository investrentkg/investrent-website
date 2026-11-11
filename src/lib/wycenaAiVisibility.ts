// Ocena AI w ukladzie v4: ukryta, gdy rejestry nie maja danych dla nieruchomosci (decyzja Daniela 01.11) - zostaje komunikat o braku danych + kontakt.
export type MarketCardKind = 'card' | 'nodata' | 'none' | 'v4f' | null

export function showAiEstimate(cardKind: MarketCardKind): boolean {
  return cardKind !== 'nodata' && cardKind !== 'v4f' // v4f: dwa kafle (transakcje, oferty) zastepuja karte oceny modelu AI
}
