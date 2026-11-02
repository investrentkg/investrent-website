// Reguły indeksowania ofert (plan SEO v4 krok 13): sprzedane/wygasłe poza sitemapą,
// strona 200 + noindex,follow, bez danych z ceną; zarezerwowana zostaje z LimitedAvailability.
// Logika w .ts, bo test (node --test) nie importuje .tsx.

export const INDEXABLE_OFFER_STATUSES = ['opublikowana', 'zarezerwowana'] as const

export function isIndexableOfferStatus(status: unknown): boolean {
  return typeof status === 'string' && (INDEXABLE_OFFER_STATUSES as readonly string[]).includes(status)
}

// Strona oferty, której już nie ma (sprzedana/wygasła): Google ma ją wycofać z indeksu,
// ale podążać za linkami do podobnych ofert.
export const GONE_OFFER_ROBOTS = { index: false, follow: true } as const

export function offerAvailability(status: unknown): string {
  return status === 'zarezerwowana'
    ? 'https://schema.org/LimitedAvailability'
    : 'https://schema.org/InStock'
}

type SitemapOffer = { id: string; slug?: string | null; status?: string | null; created_at?: string | null; updated_at?: string | null }

function validDate(value: unknown): Date | undefined {
  if (typeof value !== 'string' || !value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d
}

// lastModified = realna data zmiany oferty (updated_at), a gdy jej brak, data dodania.
export function offerLastModified(offer: SitemapOffer): Date | undefined {
  return validDate(offer.updated_at) ?? validDate(offer.created_at)
}

// Do sitemapy trafiają tylko oferty w statusie indeksowalnym. Publiczne API zwraca dziś wyłącznie
// takie oferty; filtr jest zabezpieczeniem na wypadek zmiany po stronie API. Brak pola status = indeksowalna (lista API i tak filtruje), by brak pola nie opróżnił sitemapy.
export function sitemapOfferEntries(offers: SitemapOffer[], baseUrl: string) {
  return offers
    .filter(o => o.status == null || isIndexableOfferStatus(o.status))
    .map(o => {
      const lastModified = offerLastModified(o)
      return {
        url: `${baseUrl}/oferty/${o.slug || o.id}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })
}
