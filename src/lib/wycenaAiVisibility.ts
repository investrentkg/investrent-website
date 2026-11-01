// Ocena AI w ukladzie v4: ukryta, gdy rejestry nie maja danych dla nieruchomosci (decyzja Daniela 01.11) - zostaje komunikat o braku danych + kontakt.
export type MarketCardKind = 'card' | 'nodata' | 'none' | null

export function showAiEstimate(cardKind: MarketCardKind): boolean {
  return cardKind !== 'nodata'
}
