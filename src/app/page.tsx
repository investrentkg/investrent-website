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
import FloatingWA    from '@/components/FloatingWA'
import type { Office } from '@/types'

function JsonLd({ office }: { office: Office | null }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": office?.name ?? "InvestRent Nieruchomości",
    "description": "Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem.",
    "url": "https://investrent-website-production.up.railway.app",
    "telephone": office?.phone ?? "+48731554341",
    "email": office?.email ?? "biuro@investrent.com.pl",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kołobrzeg",
      "postalCode": "78-100",
      "addressRegion": "Zachodniopomorskie",
      "addressCountry": "PL"
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// Fallback office gdy API niedostępne
const FALLBACK_OFFICE: Office = {
  name: 'InvestRent Nieruchomości',
  logo_url: '/logo.png',
  address: 'ul. Twoja Ulica 1, 78-100 Kołobrzeg',
  phone: '+48 731 554 341',
  email: 'biuro@investrent.com.pl',
  website: null,
  working_hours: null,
}

export default async function Home() {
  const [offersData, teamData, officeData, statsData] = await Promise.all([
    getPublicOffers({ limit: 6, tab: 'new' }),
    getTeam(),
    getOffice(),
    getStats(),
  ])

  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <JsonLd office={office} />
      <Nav           office={office} />
      <Hero          stats={statsData} />
      <CallbackStrip />
      <OffersSection initialOffers={offersData} />
      <About />
      <Services />
      <ValuationCTA />
      <Reviews />
      <Team          members={teamData?.data ?? []} />
      <Contact       office={office} />
      <Footer        office={office} />
      <FloatingWA />
    </>
  )
}
