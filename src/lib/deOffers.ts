// Blok "Aktuelle Angebote" na przyszłej stronie DE /de/wohnung-kaufen-kolberg (plan SEO v4 krok 14, DRAFT).
// Tylko pola strukturalne oferty (typ, metraż, pokoje, dzielnica, cena), bez kopiowania tekstów ogłoszeń i bez ulicy.
// Logika w .ts, bo test (node --test) nie importuje .tsx.

export const DE_OFFERS_MAX = 6

const PROPERTY_TYPE_DE: Record<string, string> = {
  mieszkanie: 'Wohnung',
  dom: 'Haus',
}

type DeOfferInput = {
  id: string
  slug?: string | null
  property_type?: string | null
  transaction_type?: string | null
  status?: string | null
  price?: number | null
  area?: number | null
  rooms_count?: number | null
  address_city?: string | null
  address_district?: string | null
  created_at?: string | null
}

// Do bloku kupna: sprzedaż mieszkań i domów z ceną i metrażem, najnowsze pierwsze.
export function selectDeOffers<T extends DeOfferInput>(offers: T[], max: number = DE_OFFERS_MAX): T[] {
  return offers
    .filter(o => o.transaction_type === 'sprzedaz'
      && !!o.property_type && o.property_type in PROPERTY_TYPE_DE
      && (o.status == null || o.status === 'opublikowana' || o.status === 'zarezerwowana')
      && typeof o.price === 'number' && o.price > 0
      && typeof o.area === 'number' && o.area > 0)
    .sort((a, b) => Date.parse(b.created_at ?? '') - Date.parse(a.created_at ?? '') || 0)
    .slice(0, max)
}

export function dePrice(price: number): string {
  return `${Math.round(price).toLocaleString('de-DE')} PLN`
}

export function deArea(area: number): string {
  return `${String(Math.round(area * 10) / 10).replace('.', ',')} m²`
}

// Np. "Wohnung · 54,2 m² · 3 Zimmer · Kołobrzeg (Zachód)"
export function deOfferTitle(o: DeOfferInput): string {
  const type = PROPERTY_TYPE_DE[o.property_type ?? ''] ?? 'Immobilie'
  const parts = [type]
  if (typeof o.area === 'number' && o.area > 0) parts.push(deArea(o.area))
  if (typeof o.rooms_count === 'number' && o.rooms_count > 0) parts.push(`${o.rooms_count} Zimmer`)
  if (o.address_city) parts.push(o.address_district ? `${o.address_city} (${o.address_district})` : o.address_city)
  return parts.join(' · ')
}

export function deOfferStatusLabel(status: unknown): string | null {
  return status === 'zarezerwowana' ? 'Reserviert' : null
}
