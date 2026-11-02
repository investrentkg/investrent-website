// Linkowanie kontekstowe ze strony oferty: link do kategorii + do 3 podobnych ofert.
// Cel SEO: oferty dostają dodatkowe ścieżki wejścia (Google w GSC pokazuje "strona odsyłająca: nie wykryto"
// dla ofert niezindeksowanych), a kupujący ma gdzie pójść dalej. Funkcje czyste, bez efektów ubocznych.

export type RelatedCandidate = {
  id: string
  slug?: string | null
  property_type?: string | null
  transaction_type?: string | null
  address_city?: string | null
}

export const RELATED_OFFERS_LIMIT = 3

const SALE_CATEGORY: Record<string, { href: string; label: string }> = {
  mieszkanie: { href: '/mieszkania-na-sprzedaz-kolobrzeg', label: 'Zobacz więcej mieszkań na sprzedaż w Kołobrzegu' },
  dom: { href: '/domy-na-sprzedaz-kolobrzeg', label: 'Zobacz więcej domów na sprzedaż w Kołobrzegu' },
  dzialka: { href: '/dzialki-na-sprzedaz-kolobrzeg', label: 'Zobacz więcej działek na sprzedaż w Kołobrzegu' },
}

// Kategoria dla sprzedaży mieszkań/domów/działek; wszystko inne (wynajem, lokale, hale, garaże) wraca na ogólną listę.
export function categoryLink(offer: Pick<RelatedCandidate, 'property_type' | 'transaction_type'>): { href: string; label: string } {
  if (offer.transaction_type === 'sprzedaz' && offer.property_type && SALE_CATEGORY[offer.property_type]) {
    return SALE_CATEGORY[offer.property_type]
  }
  return { href: '/oferty', label: 'Zobacz wszystkie oferty' }
}

// Podobne: ten sam typ i rodzaj transakcji (filtrowane po stronie API), bez bieżącej oferty; najpierw ta sama miejscowość,
// potem pozostałe w kolejności z API. Oferty bez adresu URL (brak slug i id) pomijane.
export function pickRelated<T extends RelatedCandidate>(current: RelatedCandidate, candidates: readonly T[], limit = RELATED_OFFERS_LIMIT): T[] {
  const city = (current.address_city ?? '').trim().toLowerCase()
  const others = candidates.filter(c => c.id && c.id !== current.id && (c.slug || c.id) && (c.slug ?? c.id) !== (current.slug ?? current.id))
  const sameCity = city ? others.filter(c => (c.address_city ?? '').trim().toLowerCase() === city) : []
  const rest = others.filter(c => !sameCity.includes(c))
  return [...sameCity, ...rest].slice(0, limit)
}
