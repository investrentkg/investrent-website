// NAPRAWA (audyt SEO 31.07.2026, punkt 4): "force-dynamic" renderowal strone
// od nowa przy KAZDYM wejsciu (pelne zapytanie do API za kazdym razem) -
// wplywa na szybkosc ladowania (Core Web Vitals to realny czynnik
// pozycjonowania Google). Dane na stronie glownej (lista ofert, opinie) nie
// musza byc aktualizowane co sekunde - odswiezanie co 5 minut (ISR) to
// zero realnej straty dla uzytkownika, a zauwazalny zysk w czasie ladowania
// (wiekszosc wejsc dostaje strone z cache, nie czeka na API).
export const revalidate = 300

import type { Metadata } from 'next'
import { getPublicOffers, getTeam, getOffice, getStats, getPageContent } from '@/lib/api'
import Nav           from '@/components/Nav'
import Hero          from '@/components/Hero'
import CallbackStrip from '@/components/CallbackStrip'
import OffersSection from '@/components/OffersSection'
import About         from '@/components/About'
import Services      from '@/components/Services'
import ValuationCTA  from '@/components/ValuationCTA'
import Reviews       from '@/components/Reviews'
import { JsonLd }    from '@/components/JsonLd'
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
//
// ZMIANA (16.08, Daniel: "chce miec mozliwosc APLIKACJI sugestii SEO z
// poziomu CRM - inni administratorzy tez musza to moc zrobic samodzielnie,
// nie tylko ja przez Claude'a"). Zamienione z statycznego eksportu na
// generateMetadata() - title/description teraz JAWNIE nadpisywane tutaj
// (zamiast tylko dziedziczyc z layout.tsx), z wartoscia z CRM (jesli ktos
// jej uzyl) albo z fallbackiem do TYCH SAMYCH wartosci co dotychczas w
// layout.tsx - zero zmiany zachowania dopoki nikt nic nie edytuje.
const DEFAULT_TITLE = 'InvestRent Nieruchomości Kołobrzeg | Kupno, Sprzedaż, Wynajem'
const DEFAULT_DESCRIPTION = 'Biuro nieruchomości Kołobrzeg. Kupno, sprzedaż i wynajem mieszkań nad Bałtykiem. Odpowiadamy do 60 minut. Bezpłatna wycena nieruchomości.'
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('strona-glowna')
  return {
    title: content?.blocks?.meta_title || DEFAULT_TITLE,
    description: content?.blocks?.meta_description || DEFAULT_DESCRIPTION,
    alternates: { canonical: 'https://www.investrent.com.pl' },
  }
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
      <main>
        <Hero          stats={statsData} googleRating={googleRating} googleTotal={googleTotal} />
        <CallbackStrip />
        <OffersSection initialOffers={offersData} />
        <About />
        <Services />
        <ValuationCTA />
        <Reviews initial={reviewsData?.ok ? { rating: googleRating, total: googleTotal, reviews: reviewsData.reviews } : null} />
        <Team          members={teamData?.data ?? []} />
        <Contact       office={office} />
        <MortgageCalcSection />
      </main>
      <Footer        office={office} />
      <FloatingWA />

      <SocialSidebar office={office} />
    </>
  )
}
