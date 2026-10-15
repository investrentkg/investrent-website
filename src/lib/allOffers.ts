// Pobranie WSZYSTKICH aktywnych ofert do statystyk per miejscowość (hub nadmorskich miejscowości).
// Po recenzji PR #58: bez sztywnego limitu 5 stron - idziemy po wszystkich stronach wg pagination.pages (z bezpiecznikiem),
// a gdy katalog nie został pobrany w całości, zwracamy complete=false, żeby strona nie pokazywała statystyk z niepełnych danych.
import { getPublicOffers } from '@/lib/api'

export interface LoadedOffers {
  offers: Array<{ address_city: string; price_per_m2: number | null; property_type?: string }>
  complete: boolean
}

const PAGE_SIZE = 24
const MAX_PAGES = 60 // bezpiecznik: 60 x 24 = 1440 ofert, wielokrotnie ponad skalę biura

export async function loadAllOffers(): Promise<LoadedOffers> {
  const offers: LoadedOffers['offers'] = []
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await getPublicOffers({ page, limit: PAGE_SIZE })
      if (!res) return { offers, complete: false }
      offers.push(...res.data)
      const pages = res.pagination?.pages ?? 1
      if (page >= pages) return { offers, complete: true }
    }
    return { offers, complete: false } // przekroczony bezpiecznik
  } catch {
    return { offers, complete: false }
  }
}
