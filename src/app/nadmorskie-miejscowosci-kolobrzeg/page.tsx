// Hub „Nadmorskie miejscowości pod Kołobrzegiem" (SEO, decyzja Daniela 15.10.2026: „Tak, hub teraz").
// Jedna strona indeksowana zamiast 4 cienkich: porównanie Grzybowa, Sianożęt, Ustronia Morskiego i Dźwirzyna.
// Podstrony miejscowości są noindex,follow do czasu statusu 'approved' w src/content/miejscowosci (patrz [slug]/page.tsx).
// Treść w danych (src/content/miejscowosci/index.ts), nazwa biura i kontakt z getOffice() - bez stałych nazw w kodzie (SaaS).
export const revalidate = 300

import { serializeJsonLd } from '@/lib/jsonLd'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice, getPublicOffers } from '@/lib/api'
import { HUB, LOCALITIES, BEACH_RANGE } from '@/content/miejscowosci'
import { summarizeCity, formatOffersCount, formatPriceCell } from '@/lib/localityOffers'
import type { Metadata } from 'next'

const BASE_URL = 'https://www.investrent.com.pl'

export const metadata: Metadata = {
  title: HUB.title,
  description: HUB.description,
  alternates: { canonical: `${BASE_URL}${HUB.path}` },
}

const FALLBACK_OFFICE = { name: '', logo_url: '/logo.png', address: '', phone: '', email: '', website: null, working_hours: null }

// Oferty pobieramy stronami (limit 24 = maksimum API); 5 stron = 120 ofert z zapasem ponad skalę biura.
async function loadAllOffers() {
  const out: Array<{ address_city: string; price_per_m2: number | null }> = []
  try {
    for (let page = 1; page <= 5; page++) {
      const res = await getPublicOffers({ page, limit: 24 })
      if (!res) break
      out.push(...res.data)
      if (page >= (res.pagination?.pages ?? 1)) break
    }
  } catch {
    // brak API: tabela pokaże „zapytaj w biurze", strona nie wywala się
  }
  return out
}

export default async function HubPage() {
  const [office, offers] = await Promise.all([getOffice(), loadAllOffers()])
  const o = office ?? FALLBACK_OFFICE
  const rows = LOCALITIES.map(l => ({ l, s: summarizeCity(offers, l.cityNames) }))
  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 13, color: '#0d2a5c', background: '#eff6ff', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '10px 12px', fontSize: 13.5, color: '#374151', borderTop: '1px solid #e5e7eb', verticalAlign: 'top' }
  const h2: React.CSSProperties = { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', margin: '32px 0 12px' }
  const p: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 12 }

  return (
    <>
      <Nav office={o as any} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '48px 0 40px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Kołobrzeg', href: '/kolobrzeg' }, { label: 'Nadmorskie miejscowości' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 34, color: 'white', letterSpacing: '-0.5px', lineHeight: 1.15, margin: '0 0 16px' }}>{HUB.h1}</h1>
          </div>
        </div>

        <div style={{ padding: '32px 0 56px', background: 'white' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <p style={p}>{HUB.intro}</p>

            <h2 style={h2}>Porównanie w skrócie</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
                <thead>
                  <tr>
                    <th style={th}></th>
                    {rows.map(({ l }) => <th key={l.slug} style={th}>{l.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Dojazd samochodem do centrum Kołobrzegu</th>{rows.map(({ l }) => <td key={l.slug} style={td}>{l.distanceKm}, {l.driveMin}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Gmina</th>{rows.map(({ l }) => <td key={l.slug} style={td}>{l.gmina}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Mieszkańcy (spis 2021)</th>{rows.map(({ l }) => <td key={l.slug} style={td}>{l.residents ?? '—'}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Autobus</th>{rows.map(({ l }) => <td key={l.slug} style={td}>{l.bus}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Szkoła podstawowa</th>{rows.map(({ l }) => <td key={l.slug} style={td}>{l.school ?? '—'}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Odległość od plaży</th>{rows.map(({ l }) => <td key={l.slug} style={td}>{BEACH_RANGE}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Aktualne oferty w naszym katalogu</th>{rows.map(({ l, s }) => <td key={l.slug} style={td}>{formatOffersCount(s.count)}</td>)}</tr>
                  <tr><th style={{ ...td, fontWeight: 600 }} scope="row">Ceny ofertowe z naszej bazy</th>{rows.map(({ l, s }) => <td key={l.slug} style={td}>{formatPriceCell(s)}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <p style={{ ...p, fontSize: 13, color: '#6b7280', marginTop: 10 }}>{HUB.tableNote}</p>

            <h2 style={h2}>{HUB.buyersHeading}</h2>
            <p style={p}>{HUB.buyers}</p>

            {[...rows].sort((a, b) => ['ustronie-morskie', 'sianozety', 'dzwirzyno', 'grzybowo'].indexOf(a.l.slug) - ['ustronie-morskie', 'sianozety', 'dzwirzyno', 'grzybowo'].indexOf(b.l.slug)).map(({ l }) => (
              <section key={l.slug}>
                <h2 style={h2}>{l.name}</h2>
                <p style={p}>{l.summary}</p>
                {l.status === 'approved' && (
                  <p style={p}><a href={`${HUB.path}/${l.slug}`} style={{ color: '#1a4fa0', fontWeight: 700 }}>Więcej o miejscowości: {l.name} →</a></p>
                )}
              </section>
            ))}

            <h2 style={h2}>{HUB.differentHeading}</h2>
            <p style={p}>{HUB.different}</p>

            <h2 style={h2}>{HUB.dailyHeading}</h2>
            <p style={p}>{HUB.daily}</p>

            <h2 style={h2}>Najczęstsze pytania</h2>
            {HUB.faq.map(f => (
              <div key={f.q} style={{ marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 4 }}>{f.q}</h3>
                <p style={{ ...p, marginBottom: 0 }}>{f.a}</p>
              </div>
            ))}

            <h2 style={h2}>Chcesz porozmawiać?</h2>
            <p style={p}>{HUB.cta}</p>
            <p>
              <a href="/kontakt" style={{ display: 'inline-block', background: '#f5a623', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>Skontaktuj się z biurem</a>
              {' '}
              <a href="/oferty" style={{ display: 'inline-block', color: '#1a4fa0', fontWeight: 700, padding: '12px 16px', textDecoration: 'none' }}>Zobacz oferty →</a>
            </p>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Strona główna', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: 'Kołobrzeg', item: `${BASE_URL}/kolobrzeg` },
                { '@type': 'ListItem', position: 3, name: 'Nadmorskie miejscowości', item: `${BASE_URL}${HUB.path}` },
              ],
            },
            {
              '@type': 'FAQPage',
              mainEntity: HUB.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
          ],
        }) }} />
      </main>
      <Footer office={o as any} />
      <SocialSidebar office={o as any} />
    </>
  )
}
