import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { getOffice } from '@/lib/api'
import WycenaClient from './WycenaClient'
import { T } from './texts'
import type { Metadata } from 'next'

// Strona ma byc INDEKSOWANA (fraza "wycena mieszkania Kolobrzeg") - brak robots noindex.
// Flaga NEXT_PUBLIC_VALUATION_ENABLED='false' wylacza kalkulator (sam formularz z numerem, bez obietnicy
// natychmiastowej wyceny). Kazda inna wartosc = kalkulator wlaczony; odpowiedz 503 backendu i tak
// przelacza strone w tryb 'wylaczony' po stronie klienta.
const CALC_ENABLED = process.env.NEXT_PUBLIC_VALUATION_ENABLED !== 'false'

export const metadata: Metadata = {
  title: { absolute: T.metaTitle }, // bez doklejania marki (layout ma szablon)
  description: CALC_ENABLED ? T.metaDescription : T.metaDescriptionOff,
  alternates: { canonical: 'https://www.investrent.com.pl/wycena' },
  openGraph: { title: T.metaTitle, description: CALC_ENABLED ? T.metaDescription : T.metaDescriptionOff, url: 'https://www.investrent.com.pl/wycena', type: 'website', locale: 'pl_PL' },
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
        <WycenaClient initialEnabled={CALC_ENABLED} />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
