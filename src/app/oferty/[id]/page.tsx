// NAPRAWA (audyt SEO 31.07.2026, punkt 4): jak na stronie glownej, ale
// krotsze okno odswiezania (60s zamiast 300s) - cena/dostepnosc pojedynczej
// oferty moze sie zmienic bardziej "pilnie" niz ogolna lista na stronie
// glownej, wiec balans przechyla sie bardziej w strone swiezosci danych.
export const revalidate = 60

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import OfferDetailClient from './OfferDetailClient'
import { getPublicOffer, getOffice } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

const BASE_URL = 'https://www.investrent.com.pl'

// NAPRAWA (audyt SEO 31.07.2026, Daniel: "ocena 10 na 10") - mapowanie typu
// nieruchomosci z naszego systemu na najblizszy, poprawny typ schema.org.
// Brak idealnego odpowiednika dla dzialki/lokalu/magazynu/garazu w hierarchii
// Accommodation - uzywamy szerszego, ale wciaz poprawnego "Accommodation"
// zamiast na sile dopasowywac zly typ (np. Apartment dla dzialki bylby
// merytorycznie falszywy sygnal dla Google).
const SCHEMA_TYPE_MAP: Record<string, string> = {
  mieszkanie: 'Apartment',
  dom: 'House',
}

function propertyTypeLabel(t: string): string {
  const map: Record<string, string> = {
    mieszkanie: 'Mieszkanie', dom: 'Dom', dzialka: 'Działka',
    lokal: 'Lokal użytkowy', magazyn: 'Hala/Magazyn', garaz: 'Garaż',
  }
  return map[t] ?? t
}

function transactionLabel(t: string): string {
  return t === 'wynajem' ? 'wynajem' : 'sprzedaż'
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const offer = await getPublicOffer(params.id) as any
  if (!offer) return { title: 'Oferta | InvestRent' }
  // NAPRAWA (audyt SEO, punkt 5): opis byl bardzo ubogi ("{typ} w {miasto}.
  // {cena} zl") - brak ulicy/dzielnicy, metrazu, pokoi. Teraz wykorzystuje
  // kazda dostepna, konkretna dana - wiecej fraz kluczowych ktorymi ludzie
  // faktycznie szukaja, bez wymyslania tresci ktorej oferta nie ma.
  const locationBits = [offer.address_district, offer.address_city].filter(Boolean).join(', ')
  const descParts = [
    `${propertyTypeLabel(offer.property_type)} na ${transactionLabel(offer.transaction_type)}`,
    locationBits && `w ${locationBits}`,
    offer.area && `${offer.area} m²`,
    offer.rooms_count && `${offer.rooms_count} pok.`,
    offer.price ? `${offer.price.toLocaleString('pl-PL')} zł` : 'cena na zapytanie',
  ].filter(Boolean)
  const description = descParts.join(', ') + '.'
  const mainPhoto = offer.offer_photos?.find((p: any) => p.is_main)?.url || offer.offer_photos?.[0]?.url
  const title = `${offer.title ?? propertyTypeLabel(offer.property_type)} | InvestRent Kołobrzeg`
  return {
    title,
    description,
    // NAPRAWA (audyt SEO, punkt 6): udostepnienie linku do KONKRETNEJ oferty
    // na Facebooku/WhatsApp pokazywalo ogolne zdjecie strony glownej
    // (dziedziczone z layout.tsx) zamiast zdjecia TEJ nieruchomosci - realnie
    // obniza klikalnosc gdy agent wysyla link klientowi.
    openGraph: mainPhoto ? {
      title, description, images: [{ url: mainPhoto, width: 1200, height: 800, alt: offer.title ?? propertyTypeLabel(offer.property_type) }],
    } : undefined,
    twitter: mainPhoto ? { card: 'summary_large_image', title, description, images: [mainPhoto] } : undefined,
    // NAPRAWA (audyt SEO, punkt 3): brak kanonicznych URL na calej stronie -
    // tutaj szczegolnie wazne, bo w przyszlosci mozliwe filtrowanie/parametry
    // przy tym samym ID oferty.
    alternates: { canonical: `${BASE_URL}/oferty/${params.id}` },
  }
}

// NAPRAWA (audyt SEO, punkt 1) - dane strukturalne pojedynczej oferty. To
// najwieksza, pojedyncza przegapiona szansa audytu: dynamiczne strony ofert
// istnialy, ale bez zadnych danych strukturalnych Google widzial je jako
// "zwykly tekst", nie jako ogloszenie nieruchomosci z cena/dostepnoscia.
function OfferJsonLd({ offer }: { offer: any }) {
  const schemaType = SCHEMA_TYPE_MAP[offer.property_type] ?? 'Accommodation'
  const mainPhoto = offer.offer_photos?.find((p: any) => p.is_main)?.url || offer.offer_photos?.[0]?.url
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    url: `${BASE_URL}/oferty/${offer.id}`,
    name: offer.title ?? `${propertyTypeLabel(offer.property_type)} na ${transactionLabel(offer.transaction_type)}, ${offer.address_city}`,
    description: offer.description ?? undefined,
    ...(mainPhoto ? { image: mainPhoto } : {}),
    datePosted: offer.created_at,
    about: {
      '@type': schemaType,
      name: offer.title ?? propertyTypeLabel(offer.property_type),
      ...(offer.area ? { floorSize: { '@type': 'QuantitativeValue', value: offer.area, unitCode: 'MTK' } } : {}),
      ...(offer.rooms_count ? { numberOfRooms: offer.rooms_count } : {}),
      address: {
        '@type': 'PostalAddress',
        addressLocality: offer.address_city,
        ...(offer.address_district ? { addressRegion: offer.address_district } : {}),
        ...(offer.address_street ? { streetAddress: offer.address_street } : {}),
        addressCountry: 'PL',
      },
      ...(offer.address_lat && offer.address_lng ? {
        geo: { '@type': 'GeoCoordinates', latitude: offer.address_lat, longitude: offer.address_lng },
      } : {}),
    },
    offers: {
      '@type': 'Offer',
      price: offer.price ?? undefined,
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
      businessFunction: offer.transaction_type === 'wynajem'
        ? 'http://purl.org/goodrelations/v1#LeaseOut'
        : 'http://purl.org/goodrelations/v1#Sell',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// NAPRAWA (audyt SEO, punkt 8) - okruszki (Breadcrumb) byly juz widoczne
// wizualnie na stronie, ale bez towarzyszacych danych strukturalnych
// BreadcrumbList Google nie pokazuje ich jako dodatkowej sciezki nawigacji
// pod tytulem w wynikach wyszukiwania.
function BreadcrumbJsonLd({ offer }: { offer: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Oferty', item: `${BASE_URL}/oferty` },
      { '@type': 'ListItem', position: 3, name: offer.title ?? offer.ref_number, item: `${BASE_URL}/oferty/${offer.id}` },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default async function OfferPage({ params }: { params: { id: string } }) {
  const [offer, officeData] = await Promise.all([
    getPublicOffer(params.id),
    getOffice(),
  ]) as any[]
  if (!offer) notFound()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <OfferJsonLd offer={offer} />
      <BreadcrumbJsonLd offer={offer} />
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '24px 0 20px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Oferty', href: '/oferty' }, { label: offer.title ?? offer.ref_number }]} />
          </div>
        </div>
        <OfferDetailClient offer={offer} />
      </main>
      <Footer office={office} />
      <FloatingWA />

      <SocialSidebar office={office} />
    </>
  )
}
