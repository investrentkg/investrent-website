// Uzupełnienia JSON-LD oferty (plan SEO v4 krok 13): seller, dateModified, image jako lista.
// Tylko pola dostępne dziś w publicznym API oferty (offer_photos[].url, updated_at, created_at).
// Stałe i funkcje w .ts, bo test (node --test) nie importuje .tsx.

export const OFFER_SELLER = {
  '@type': 'RealEstateAgent',
  name: 'InvestRent Nieruchomości',
  url: 'https://www.investrent.com.pl',
} as const

export const OFFER_IMAGES_MAX = 10

type OfferLike = {
  offer_photos?: { url?: string | null }[] | null
  created_at?: string | null
  updated_at?: string | null
}

/** Zdjęcia oferty jako lista adresów (główne pierwsze, bo API sortuje po sort_order), bez pustych i duplikatów, max OFFER_IMAGES_MAX. */
export function offerImages(offer: OfferLike, max: number = OFFER_IMAGES_MAX): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of offer.offer_photos ?? []) {
    const u = p?.url
    if (typeof u !== 'string' || !u || seen.has(u)) continue
    seen.add(u)
    out.push(u)
    if (out.length >= max) break
  }
  return out
}

/** dateModified = updated_at, ale tylko gdy jest poprawną datą i nie wcześniejszą niż created_at (inaczej pomijamy pole). */
export function offerDateModified(offer: OfferLike): string | undefined {
  const upd = offer.updated_at ? Date.parse(offer.updated_at) : NaN
  if (Number.isNaN(upd)) return undefined
  const cr = offer.created_at ? Date.parse(offer.created_at) : NaN
  if (!Number.isNaN(cr) && upd < cr) return undefined
  return offer.updated_at as string
}
