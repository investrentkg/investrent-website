import { serializeJsonLd } from '@/lib/jsonLd'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from '@/app/(pl)/oferty/OffersPageClient'
import AllOffersLinks from '@/components/AllOffersLinks'
import { getPublicOffers, getOffice } from '@/lib/api'
import type { SaleListingContent } from '@/content/sprzedaz'

// Wspólny szablon stron listingu sprzedaży (/mieszkania-na-sprzedaz-kolobrzeg, /domy-na-sprzedaz-kolobrzeg).
// Bez filtra miejscowości po stronie API (backend nie ma parametru city; dodać osobnym PR) — lista to publiczne oferty sprzedaży danego typu.
const BASE = 'https://www.investrent.com.pl'
const FALLBACK_OFFICE = { name: 'InvestRent Nieruchomości', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }
const link = { color: '#1a4fa0', fontWeight: 600 }

export default async function SaleListingPage({ c }: { c: SaleListingContent }) {
  const [data, officeData] = await Promise.all([
    getPublicOffers({ limit: 12, transaction_type: 'sprzedaz', property_type: c.propertyType } as any),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  const offers: any[] = data?.data ?? []
  const itemList = offers.slice(0, 12).map((o, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}/oferty/${o.slug || o.id}` }))
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: BASE },
      { '@type': 'ListItem', position: 2, name: c.breadcrumb, item: BASE + c.path },
    ] },
    ...(itemList.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: itemList }] : []),
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ]
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: c.breadcrumb }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 40, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>{c.h1}</h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 620, lineHeight: 1.8 }}>{c.lead}</p>
          </div>
        </div>
        <OffersPageClient initialOffers={offers} initialTotal={data?.pagination?.total ?? 0} defaultType={c.propertyType} defaultTransaction="sprzedaz" />
        <AllOffersLinks filter={{ transaction_type: 'sprzedaz', property_type: c.propertyType }} heading={c.propertyType === 'dom' ? 'Wszystkie domy na sprzedaż' : c.propertyType === 'dzialka' ? 'Wszystkie działki na sprzedaż' : 'Wszystkie mieszkania na sprzedaż'} />
        {offers.length === 0 && (
          <div className="container" style={{ padding: '24px 0', maxWidth: 760 }}>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8 }}>Aktualnie nie mamy opublikowanych ofert tego typu. Zajrzyj do <a href="/oferty" style={link}>wszystkich ofert</a> albo napisz do nas, a poinformujemy Cię o nowych.</p>
          </div>
        )}
        <div style={{ padding: '56px 0 8px', background: 'white' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            {c.sections.map(sec => (
              <section key={sec.heading} style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', marginBottom: 12 }}>{sec.heading}</h2>
                {sec.paragraphs.map(t => <p key={t} style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 12 }}>{t}</p>)}
                {sec.bullets && (
                  <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sec.bullets.map(b => <li key={b} style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>{b}</li>)}
                  </ul>
                )}
              </section>
            ))}
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.9 }}>
              Zobacz też: <a href="/kupno" style={link}>kupno nieruchomości</a> · <a href="/kolobrzeg" style={link}>nieruchomości w Kołobrzegu</a> · <a href="/wycena" style={link}>wycena nieruchomości</a> · <a href="/blog/ile-kosztuje-mieszkanie-w-kolobrzegu-ceny-ofertowe-i-transakcyjne" style={link}>ceny ofertowe i transakcyjne</a> · <a href="/nadmorskie-miejscowosci-kolobrzeg" style={link}>nadmorskie miejscowości</a>
            </p>
          </div>
        </div>
        <div style={{ padding: '56px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', textAlign: 'center', marginBottom: 32 }}>Najczęściej zadawane pytania</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {c.faq.map(f => (
                <div key={f.q} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {ld.map((o, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(o) }} />)}
      </main>
      <Footer office={office} />
      <SocialSidebar office={office} />
    </>
  )
}
