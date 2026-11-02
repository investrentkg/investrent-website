import Link from 'next/link'
import { OfferCard } from '@/components/OffersSection'
import { getPublicOffers } from '@/lib/api'
import { categoryLink, pickRelated, RELATED_OFFERS_LIMIT } from '@/lib/relatedOffers'

// SEO (02.11.2026): linki kontekstowe ze strony oferty: kategoria + do 3 podobnych ofert (ten sam typ i rodzaj transakcji,
// najpierw ta sama miejscowość). Daje ofertom dodatkowe ścieżki wejścia i kupującemu następny krok. Renderowane po stronie serwera
// (zwykłe linki w HTML); brak odpowiedzi API = sam link do kategorii, strona nie zależy od tego bloku.
export default async function RelatedOffers({ offer }: { offer: { id: string; slug?: string | null; property_type?: string | null; transaction_type?: string | null; address_city?: string | null } }) {
  const cat = categoryLink(offer)
  const res = offer.property_type && offer.transaction_type
    ? await getPublicOffers({ property_type: offer.property_type, transaction_type: offer.transaction_type, limit: 12 })
    : null
  const related = pickRelated(offer, res?.data ?? [], RELATED_OFFERS_LIMIT)
  return (
    <section className="container" style={{ margin: '8px auto 40px', maxWidth: 1100 }} aria-labelledby="podobne-heading">
      <h2 id="podobne-heading" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 22, color: '#0d2a5c', marginBottom: 12 }}>
        Podobne oferty
      </h2>
      {related.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 16 }}>
          {related.map(o => <OfferCard key={o.id} offer={o} tab="new" />)}
        </div>
      )}
      <p style={{ fontSize: 15, margin: 0 }}>
        <Link href={cat.href} style={{ color: '#1a4fa0', fontWeight: 600 }}>{cat.label}</Link>
      </p>
    </section>
  )
}
