// NAPRAWA (audyt SEO 31.07.2026, punkt 4): "force-dynamic" renderowal strone
// od nowa przy KAZDYM wejsciu (pelne zapytanie do API za kazdym razem) -
// wplywa na szybkosc ladowania (Core Web Vitals to realny czynnik
// pozycjonowania Google). Dane na stronie glownej (lista ofert, opinie) nie
// musza byc aktualizowane co sekunde - odswiezanie co 5 minut (ISR) to
// zero realnej straty dla uzytkownika, a zauwazalny zysk w czasie ladowania
// (wiekszosc wejsc dostaje strone z cache, nie czeka na API).
export const revalidate = 300

import type { Metadata } from 'next'
import { getPublicOffers, getTeam, getOffice, getStats } from '@/lib/api'
import Nav           from '@/components/Nav'
import Hero          from '@/components/Hero'
import CallbackStrip from '@/components/CallbackStrip'
import OffersSection from '@/components/OffersSection'
import About         from '@/components/About'
import Services      from '@/components/Services'
import ValuationCTA  from '@/components/ValuationCTA'
import Reviews       from '@/components/Reviews'
import Team          from '@/components/Team'
import Contact       from '@/components/Contact'
import Footer        from '@/components/Footer'
import MortgageCalcSection from '@/components/MortgageCalcSection'
import FloatingWA    from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import type { Office } from '@/types'

// NAPRAWA (audyt SEO 31.07.2026, punkt 3): strona glowna nie mial WLASNEGO
// eksportu metadata w ogole - dziedziczyla wszystko z layout.tsx, w tym
// brak kanonicznego URL. Reszta (title/description) zostaje z layout.tsx
// przez dziedziczenie (Next.js merguje), tutaj dodajemy tylko brakujacy
// canonical.
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.investrent.com.pl' },
}

function JsonLd({ office, googleRating, googleTotal }: { office: Office | null; googleRating: number; googleTotal: number }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": office?.name ?? "InvestRent Nieruchomości",
    "description": "Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem.",
    "url": "https://www.investrent.com.pl",
    "telephone": office?.phone ?? "+48731554341",
    "email": office?.email ?? "biuro@investrent.com.pl",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kołobrzeg",
      "postalCode": "78-100",
      "addressRegion": "Zachodniopomorskie",
      "addressCountry": "PL"
    },
    // NAPRAWA (audyt SEO 31.07.2026, doprecyzowanie): to byly sztywne liczby
    // "4.9"/"55" NIEZALEZNE od faktycznej, zywej oceny pobieranej z Google
    // (widocznej na stronie w komponencie Hero) - jesli prawdziwa ocena
    // kiedykolwiek sie zmieni, dane strukturalne pokazywalyby Google
    // nieaktualna/niezgodna wartosc wzgledem tego co widzi realny
    // uzytkownik na stronie. Teraz oba miejsca czerpia z tego samego zrodla.
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": String(googleRating), "reviewCount": String(googleTotal) }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
}

// Fallback office gdy API niedostępne
const FALLBACK_OFFICE: Office = {
  name: 'InvestRent Nieruchomości',
  logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341',
  email: 'biuro@investrent.com.pl',
  website: null,
  working_hours: null,
}

export default async function Home() {
  const [offersData, teamData, officeData, statsData, reviewsData] = await Promise.all([
    getPublicOffers({ limit: 6 }),
    getTeam(),
    getOffice(),
    getStats(),
    fetch('https://investrent-crm-production.up.railway.app/api/public/google-reviews')
      .then(r => r.json()).catch(() => null),
  ])
  // NAPRAWA 17.07.2026: `reviewsData?.rating ?? 4.8` wyglądało bezpiecznie, ale
  // `??` zastępuje TYLKO null/undefined - jeśli API zwróciło poprawną
  // odpowiedź (ok:true) z rating:0/total:0 (np. Google chwilowo nie zwrócił
  // danych oceny), literalne 0 przechodziło przez `??` bez zmian i strona
  // pokazywała "0/5" / "0 opinii" - gorsze niż jakikolwiek fallback.
  const googleRating: number = reviewsData?.rating ? reviewsData.rating : 4.9
  const googleTotal: number  = reviewsData?.total  ? reviewsData.total  : 55

  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <JsonLd office={office} googleRating={googleRating} googleTotal={googleTotal} />
      <Nav           office={office} />
      <Hero          stats={statsData} googleRating={googleRating} googleTotal={googleTotal} />
      <CallbackStrip />
      <OffersSection initialOffers={offersData} />
      <About />
      <Services />
      <ValuationCTA />
      <Reviews />
      <Team          members={teamData?.data ?? []} />
      <Contact       office={office} />
      <MortgageCalcSection />
      <Footer        office={office} />
      <FloatingWA />

      <SocialSidebar office={office} />
    </>
  )
}
