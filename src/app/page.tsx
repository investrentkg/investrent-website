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

// Schema.org structured data — LocalBusiness
function JsonLd({ office }: { office: Awaited<ReturnType<typeof getOffice>> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": office?.name ?? "InvestRent Nieruchomości",
    "description": "Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem.",
    "url": "https://www.investrent.com.pl",
    "telephone": office?.phone ?? "+48731554341",
    "email": office?.email ?? "biuro@investrent.com.pl",
    "image": "https://www.investrent.com.pl/hero.jpg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": office?.address ?? "ul. Twoja Ulica 1",
      "addressLocality": "Kołobrzeg",
      "postalCode": "78-100",
      "addressRegion": "Zachodniopomorskie",
      "addressCountry": "PL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 54.1776,
      "longitude": 15.5734
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "18:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "14:00" }
    ],
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" },
    "areaServed": [
      { "@type": "City", "name": "Kołobrzeg" },
      { "@type": "City", "name": "Mielno" },
      { "@type": "City", "name": "Dźwirzyno" }
    ]
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}

export default async function Home() {
  // Równoległe zapytania do API — szybciej niż sekwencyjne
  const [offersData, teamData, officeData, statsData] = await Promise.all([
    getPublicOffers({ limit: 6, tab: 'new' }),
    getTeam(),
    getOffice(),
    getStats(),
  ])

  return (
    <>
      <JsonLd office={officeData} />
      <Nav           office={officeData} />
      <Hero          stats={statsData} />
      <CallbackStrip />
      <OffersSection initialOffers={offersData} />
      <About />
      <Services />
      <ValuationCTA />
      <Reviews />
      <Team          members={teamData?.data ?? []} />
      <Contact       office={officeData} />
      <Footer        office={officeData} />
      <FloatingWA />
    </>
  )
}
