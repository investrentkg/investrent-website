// Podstrona miejscowości huba „Nadmorskie miejscowości pod Kołobrzegiem".
// STATUS 'draft' (domyślny): robots noindex,follow i brak w sitemap - strona jest dostępna z huba, ale nie jest indeksowana.
// Awans do indeksu = zmiana status: 'approved' w src/content/miejscowosci/index.ts, gdy miejscowość ma >= 500 słów
// unikalnych faktów (rejestr cen z próbą, osiedla, plaże) i >= 1 aktywną ofertę lub cenę z rejestru (decyzja Daniela 15.10.2026).
export const revalidate = 300
export const dynamicParams = false

import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import { loadAllOffers } from '@/lib/allOffers'
import { HUB, LOCALITIES, BEACH_RANGE, getLocality } from '@/content/miejscowosci'
import { summarizeCity, formatOffersCount, formatPriceCell, formatRcnCell } from '@/lib/localityOffers'
import { serializeJsonLd } from '@/lib/jsonLd'
import type { Metadata } from 'next'
import { buildBreadcrumbJsonLd } from '@/lib/seoSchemas'

const BASE_URL = 'https://www.investrent.com.pl'

export function generateStaticParams() {
  return LOCALITIES.map(l => ({ slug: l.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const l = getLocality(params.slug)
  if (!l) return { title: 'Nie znaleziono' }
  const approved = l.status === 'approved'
  return {
    title: { absolute: `Nieruchomości ${l.name}: dojazd, plaża, oferta | InvestRent` },
    description: `${l.name}: ${l.distanceKm} (${l.driveMin}) od centrum Kołobrzegu, plaża, komunikacja i aktualne oferty nieruchomości.`,
    alternates: { canonical: `${BASE_URL}${HUB.path}/${l.slug}` },
    robots: approved ? { index: true, follow: true } : { index: false, follow: true },
  }
}

export default async function LocalityPage({ params }: { params: { slug: string } }) {
  const l = getLocality(params.slug)
  if (!l) notFound()
  const office = await getOffice()
  const { offers, complete } = await loadAllOffers()
  const s = summarizeCity(offers, l.cityNames)
  const p: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 12 }
  const h2: React.CSSProperties = { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', margin: '28px 0 10px' }
  const o = office ?? { name: '', logo_url: '/logo.png', address: '', phone: '', email: '', website: null, working_hours: null }

  return (
    <>
      <Nav office={o as any} />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildBreadcrumbJsonLd([
          { name: 'Strona główna', path: '/' },
          { name: 'Nadmorskie miejscowości', path: HUB.path },
          { name: l.name, path: `${HUB.path}/${l.slug}` },
        ])) }} />
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '48px 0 40px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Nadmorskie miejscowości', href: HUB.path }, { label: l.name }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 34, color: 'white', lineHeight: 1.15, margin: '0 0 8px' }}>Nieruchomości: {l.name}</h1>
          </div>
        </div>
        <div style={{ padding: '32px 0 56px', background: 'white' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <p style={p}>{l.summary}</p>
            <h2 style={h2}>W skrócie</h2>
            <ul style={{ paddingLeft: 20, color: '#374151', lineHeight: 1.9, fontSize: 15 }}>
              <li>Dojazd samochodem do centrum Kołobrzegu: {l.distanceKm}, {l.driveMin}</li>
              <li>Gmina: {l.gmina}{l.residents ? ` · mieszkańcy (spis 2021): ${l.residents}` : ''}</li>
              <li>Autobus: {l.bus}{l.school ? ` · szkoła podstawowa: ${l.school}` : ''}</li>
              <li>Odległość od plaży: {BEACH_RANGE}</li>
              <li>Aktualne oferty w naszym katalogu: {complete ? formatOffersCount(s.count) : 'zapytaj w biurze'}</li>
              <li>Ceny ofertowe z naszej bazy: {complete ? formatPriceCell(s) : '—'}</li>
              <li>Ceny transakcyjne (RCN, dane do 01.2026): {formatRcnCell(l.rcn)}</li>
            </ul>
            <p style={{ ...p, fontSize: 13, color: '#6b7280' }}>Ceny to ceny ofertowe z naszej bazy, nie transakcyjne ani poziom rynku; zakres pokazujemy tylko przy co najmniej 3 ofertach.</p>
            {l.sections?.map(sec => (
              <section key={sec.heading}>
                <h2 style={h2}>{sec.heading}</h2>
                {sec.paragraphs.map(t => <p key={t} style={p}>{t}</p>)}
              </section>
            ))}
            {l.faq && l.faq.length > 0 && (
              <section>
                <h2 style={h2}>Najczęstsze pytania</h2>
                {l.faq.map(f => (<div key={f.q}><h3 style={{ fontSize: 16, color: '#0d2a5c', margin: '14px 0 6px' }}>{f.q}</h3><p style={p}>{f.a}</p></div>))}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: l.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
              </section>
            )}
            <p style={p}>Aktualnych propozycji zapytaj w biurze — oferta zmienia się na bieżąco.</p>
            <p>
              <a href={HUB.path} style={{ color: '#1a4fa0', fontWeight: 700, textDecoration: 'none' }}>← Porównanie wszystkich miejscowości</a>
              {' · '}
              <a href="/kontakt" style={{ color: '#1a4fa0', fontWeight: 700, textDecoration: 'none' }}>Kontakt z biurem →</a>
            </p>
          </div>
        </div>
      </main>
      <Footer office={o as any} />
      <SocialSidebar office={o as any} />
    </>
  )
}
