import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import type { Metadata } from 'next'

// NOWE (06.08, weryfikacja marki Google Ads API): Google odrzucił pierwszą
// próbę weryfikacji z dwoma powodami - (1) "Strona główna nie wyjaśnia celu
// aplikacji" i (2) "Nazwa aplikacji InvestRent CRM skonfigurowana na ekranie
// zgody OAuth nie pasuje do nazwy aplikacji na stronie głównej". Strona
// główna investrent.com.pl to strona biura nieruchomości dla klientów - nie
// ma tam nic o wewnętrznym narzędziu CRM. Ta podstrona istnieje WYŁĄCZNIE
// po to, żeby pole "Strona główna aplikacji" na ekranie zgody OAuth mogło
// wskazywać na coś, co faktycznie opisuje aplikację "InvestRent CRM" -
// nazwa w treści poniżej musi być IDENTYCZNA jak nazwa w Google Cloud
// Console (Elementy marki -> Nazwa aplikacji), inaczej weryfikacja znów
// się nie powiedzie.

export const metadata: Metadata = {
  title: 'InvestRent CRM',
  description: 'InvestRent CRM - wewnętrzne narzędzie InvestRent Nieruchomości do zarządzania ofertami, klientami i kampaniami reklamowymi.',
  // Strona czysto techniczna (nie dla klientów odwiedzających serwis) -
  // ten sam wzorzec co /rodo, patrz komentarz tam.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.investrent.com.pl/crm' },
}

const FALLBACK_OFFICE = {
  name: 'InvestRent', logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341', email: 'biuro@investrent.com.pl',
  website: null, working_hours: null,
}

export default async function CrmPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '32px 0 24px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'InvestRent CRM' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: 'white', letterSpacing: '-1px', marginTop: 12 }}>
              InvestRent CRM
            </h1>
          </div>
        </div>

        <div style={{ background: 'white', padding: '48px 0 64px' }}>
          <div className="container" style={{ maxWidth: 780 }}>
            <div style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.85 }}>
              <p style={{ marginBottom: 20 }}>
                <strong>InvestRent CRM</strong> to wewnętrzny system informatyczny firmy Investrent sp. z o.o.
                (InvestRent Nieruchomości), używany wyłącznie przez pracowników biura do zarządzania
                ofertami nieruchomości, bazą klientów, transakcjami oraz kampaniami reklamowymi firmy.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>
                Do czego służy
              </h2>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li style={{ marginBottom: 8 }}>Zarządzanie ofertami nieruchomości i publikacja na portalach ogłoszeniowych.</li>
                <li style={{ marginBottom: 8 }}>Zarządzanie bazą klientów i procesem sprzedaży/wynajmu.</li>
                <li style={{ marginBottom: 8 }}>Zarządzanie i raportowanie kampanii reklamowych firmy (Google Ads, Meta Ads) na potrzeby promocji ofert i pozyskiwania klientów.</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>
                Kto ma dostęp
              </h2>
              <p style={{ marginBottom: 20 }}>
                Wyłącznie pracownicy Investrent sp. z o.o. — agenci i menadżerowie biura. System nie jest
                produktem komercyjnym, nie jest sprzedawany ani udostępniany podmiotom trzecim, klientom
                firmy ani ogółowi społeczeństwa.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>
                Właściciel
              </h2>
              <p>
                Investrent sp. z o.o. z siedzibą w Kołobrzegu, przy ul. Ratuszowej 12/1 lok. 3, NIP: 671 185 85 59.
                Kontakt: <a href="mailto:biuro@investrent.com.pl" style={{ color: '#1a4fa0' }}>biuro@investrent.com.pl</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
      <SocialSidebar office={office} />
    </>
  )
}
