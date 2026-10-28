import type { MarketCardView } from './marketCard'

export type V4PriceBand = { low: number; high: number; count: number } | null
export type MarketCardV4Summary = {
  transactions: V4PriceBand
  offers: V4PriceBand
  kind: MarketCardView['kind']
}

function bandFor(areaM2: number | null, p25: number | null, p75: number | null, count: number): V4PriceBand {
  if (!Number.isFinite(areaM2) || areaM2 == null || areaM2 <= 0 || p25 == null || p75 == null || p25 < 0 || p75 < 0 || p25 > p75) return null
  const low = Math.round(p25 * areaM2)
  const high = Math.round(p75 * areaM2)
  if (!Number.isSafeInteger(low) || !Number.isSafeInteger(high)) return null
  return { low, high, count }
}

/** Przelicza wyłącznie dostępne kwartyle P25–P75; brak lub niespójność danych daje null. */
export function summarizeMarketCardV4(view: MarketCardView, areaM2: number | null): MarketCardV4Summary {
  if (view.kind !== 'card') return { kind: view.kind, transactions: null, offers: null }
  return {
    kind: view.kind,
    transactions: view.transactions ? bandFor(areaM2, view.transactions.p25, view.transactions.p75, view.transactions.count) : null,
    offers: view.offers ? bandFor(areaM2, view.offers.p25, view.offers.p75, view.offers.count) : null,
  }
}
