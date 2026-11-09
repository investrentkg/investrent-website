import { getPublicOffers } from '@/lib/api'

// Blok zwyklych linkow <a href> (HTML z serwera) do najnowszych ofert sprzedazy i do kategorii (SEO, wewnetrzne linkowanie).
// Brak ofert albo blad API = blok sie nie renderuje (strona dziala jak dotad).
export const CURRENT_OFFERS_LIMIT = 3
export const CURRENT_OFFERS_CATEGORY_LINKS = [
  { href: '/mieszkania-na-sprzedaz-kolobrzeg', label: 'Mieszkania na sprzedaż w Kołobrzegu' },
  { href: '/domy-na-sprzedaz-kolobrzeg', label: 'Domy na sprzedaż w Kołobrzegu' },
]

async function loadLatest() {
  try {
    const res: any = await getPublicOffers({ limit: 12, transaction_type: 'sprzedaz' } as any)
    return ((res?.data ?? []) as any[])
      .filter(o => o && o.transaction_type === 'sprzedaz' && (o.slug || o.id) && typeof o.title === 'string' && o.title.trim())
      .slice(0, CURRENT_OFFERS_LIMIT)
  } catch {
    return []
  }
}

export default async function CurrentOffersLinks() {
  const offers = await loadLatest()
  if (!offers.length) return null
  return (
    <section style={{ padding: '32px 0', background: '#fff' }} aria-labelledby="aktualne-oferty-linki">
      <div className="container" style={{ maxWidth: 760 }}>
        <h2 id="aktualne-oferty-linki" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 20, color: '#0d2a5c', marginBottom: 12 }}>Aktualne oferty</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {offers.map(o => (
            <li key={o.id ?? o.slug}>
              <a href={`/oferty/${o.slug || o.id}`} style={{ color: '#1a4fa0', fontSize: 15, lineHeight: 1.6, textDecoration: 'underline' }}>{o.title}</a>
            </li>
          ))}
          {CURRENT_OFFERS_CATEGORY_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} style={{ color: '#1a4fa0', fontSize: 15, lineHeight: 1.6, textDecoration: 'underline' }}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
