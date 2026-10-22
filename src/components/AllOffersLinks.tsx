import { getPublicOffers } from '@/lib/api'

// Lista linków do WSZYSTKICH ofert w surowym HTML (SEO, 22.10.2026).
// Powód: lista ofert (OffersPageClient) renderuje na serwerze tylko pierwszą porcję (9), a filtry i kolejne strony działają
// po stronie przeglądarki, więc Google nie miał linków wewnętrznych do większości ofert (znał je tylko z sitemap).
// To zwykła, widoczna lista tekstowa (nie ukryta), niezależna od JavaScriptu.
type Row = { id: string; slug?: string | null; title?: string | null; address_city?: string | null; property_type?: string | null; transaction_type?: string | null }

const TYPE: Record<string, string> = { mieszkanie: 'Mieszkanie', dom: 'Dom', dzialka: 'Działka', lokal: 'Lokal', garaz: 'Garaż' }

async function loadRows(filter: { property_type?: string; transaction_type?: string }): Promise<Row[]> {
  const rows: Row[] = []
  try {
    for (let page = 1; page <= 20; page++) {
      const res: any = await getPublicOffers({ page, limit: 24, ...filter } as any)
      if (!res?.data) break
      rows.push(...res.data)
      if (page >= (res.pagination?.pages ?? 1)) break
    }
  } catch {
    // brak listy nie może zepsuć strony
  }
  return rows
}

export default async function AllOffersLinks({ filter = {}, heading = 'Wszystkie oferty' }: { filter?: { property_type?: string; transaction_type?: string }; heading?: string }) {
  const rows = await loadRows(filter)
  if (!rows.length) return null
  return (
    <section style={{ padding: '40px 0', background: '#fff' }} aria-labelledby="wszystkie-oferty">
      <div className="container" style={{ maxWidth: 980 }}>
        <h2 id="wszystkie-oferty" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 20, color: '#0d2a5c', marginBottom: 14 }}>{heading} ({rows.length})</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, columnWidth: 300, columnGap: 28 }}>
          {rows.map(r => {
            const label = r.title || [TYPE[r.property_type ?? ''] ?? 'Nieruchomość', r.address_city].filter(Boolean).join(', ')
            return (
              <li key={r.id} style={{ breakInside: 'avoid', marginBottom: 6 }}>
                <a href={`/oferty/${r.slug || r.id}`} style={{ color: '#1a4fa0', fontSize: 14, lineHeight: 1.5, textDecoration: 'underline' }}>{label}</a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
