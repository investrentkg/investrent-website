// Blok "Aktuelle Angebote" dla strony DE (DRAFT, krok 14): serwerowy komponent, NIEPODPIĘTY do żadnej strony
// do czasu #87 (layout DE), akceptacji tekstu i sygnału Dyrektora. Dane na żywo z publicznego API, tylko pola strukturalne.
import Link from 'next/link'
import { getPublicOffers } from '@/lib/api'
import { selectDeOffers, deOfferTitle, dePrice, deOfferStatusLabel } from '@/lib/deOffers'

export default async function DeOffers() {
  const res = await getPublicOffers({ limit: 24 }).catch(() => null)
  const offers = selectDeOffers(res?.data ?? [])
  if (offers.length === 0) return null
  return (
    <section aria-labelledby="de-offers-heading">
      <h2 id="de-offers-heading">Aktuelle Angebote</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {offers.map(o => {
          const status = deOfferStatusLabel(o.status)
          return (
            <li key={o.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px' }}>
              <Link href={`/oferty/${o.slug || o.id}`} style={{ color: '#1a4fa0', fontWeight: 600 }}>{deOfferTitle(o)}</Link>
              <div>{dePrice(o.price as number)}{status ? ` · ${status}` : ''}</div>
            </li>
          )
        })}
      </ul>
      <p><Link href="/oferty" style={{ color: '#1a4fa0' }}>Alle Angebote ansehen</Link> (auf Polnisch)</p>
    </section>
  )
}
