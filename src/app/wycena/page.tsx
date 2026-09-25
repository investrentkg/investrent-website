import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import WycenaClient from './WycenaClient'
import { T } from './texts'
import type { Metadata } from 'next'

// Strona ma byc INDEKSOWANA (fraza "wycena mieszkania Kolobrzeg") - brak robots noindex.
export const metadata: Metadata = {
  title: T.metaTitle,
  description: T.metaDescription,
  alternates: { canonical: 'https://www.investrent.com.pl/wycena' },
  openGraph: { title: T.metaTitle, description: T.metaDescription, url: 'https://www.investrent.com.pl/wycena', type: 'website', locale: 'pl_PL' },
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

// Tylko BreadcrumbList - jedyny znacznik, ktory dokladnie odpowiada tresci strony.
// Celowo BEZ Product/Offer/AggregateRating (kalkulator nie jest produktem ani usluga z cena).
const BREADCRUMBS = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://www.investrent.com.pl/' },
    { '@type': 'ListItem', position: 2, name: 'Wycena nieruchomości', item: 'https://www.investrent.com.pl/wycena' },
  ],
}

export default async function WycenaPage() {
  const office = (await getOffice().catch(() => null)) ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main id="glowna-tresc">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMBS) }} />
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '32px 0 36px' }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Wycena nieruchomości' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(26px, 5vw, 38px)', color: 'white', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 14 }}>
              {T.h1}
            </h1>
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 16, lineHeight: 1.7, maxWidth: 620, margin: 0 }}>{T.intro}</p>
          </div>
        </div>
        <WycenaClient />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
