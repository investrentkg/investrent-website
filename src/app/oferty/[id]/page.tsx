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
import { OfferCard } from '@/components/OffersSection'
import { getPublicOfferResult, getOffice, getPublicOffers } from '@/lib/api'
import { notFound, permanentRedirect } from 'next/navigation'
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

export async function generateMetadata({ params, searchParams }: { params: { id: string }; searchParams: { preview?: string } }): Promise<Metadata> {
  const previewToken = searchParams?.preview
  const result = await getPublicOfferResult(params.id, previewToken)
  // Tryb podgladu (13.09.2026, patrz backend lib/offerPreviewToken.ts) -
  // link roboczy do przejrzenia jeszcze niezatwierdzonej oferty. Musi byc
  // NIEZNAJDYWALNY dla wyszukiwarek niezaleznie od tego co dalej zwroci
  // backend, wiec noindex ustawiamy PRZED jakimkolwiek innym warunkiem.
  if (previewToken) {
    if (result.status !== 'ok') return { title: 'Podgląd oferty', robots: { index: false, follow: false } }
    const offer = result.data as any
    return { title: `[PODGLĄD] ${offer.title ?? 'Oferta'}`, robots: { index: false, follow: false } }
  }
  // NAPRAWA (audyt SEO 09.09.2026): tytuly ponizej mialy zaszyta marke
  // ("| InvestRent Kołobrzeg"/"| InvestRent") ORAZ layout.tsx doklejal
  // WLASNY szablon ("%s | InvestRent Nieruchomości") na wierzch - efekt
  // to zdublowana marka w <title> (np. "...| InvestRent Kołobrzeg |
  // InvestRent Nieruchomości", 100 znakow), realna tresc (lokalizacja/cena)
  // obcinana przez Google w wynikach wyszukiwania. Marka teraz TYLKO raz,
  // z szablonu layout.tsx - tu zostaje sama tresc strony.
  if (result.status === 'not_found') return { title: 'Oferta nie znaleziona' }
  // NAPRAWA (19.08, Google Search Console: 40 stron z bledem 404). Oferta
  // ISTNIEJE ale zostala sprzedana/wycofana - Next.js 14 App Router nie
  // wspiera customowego kodu HTTP (410) dla server components bez wiekszej
  // przebudowy na route handler, wiec noindex jest NAJSILNIEJSZYM dostepnym
  // sygnalem zeby Google nie indeksowal/usunal ta strone z indeksu, mimo ze
  // sama strona zwraca 200 (API backendu i tak juz zwraca prawdziwe 410).
  if (result.status === 'gone') {
    return { title: 'Ta oferta nie jest już dostępna', robots: { index: false, follow: true } }
  }
  const offer = result.data as any
  // NAPRAWA (audyt SEO, punkt 5): opis byl bardzo ubogi ("{typ} w {miasto}.
  // {cena} zl") - brak ulicy/dzielnicy, metrazu, pokoi. Teraz wykorzystuje
  // kazda dostepna, konkretna dana - wiecej fraz kluczowych ktorymi ludzie
  // faktycznie szukaja, bez wymyslania tresci ktorej oferta nie ma.
  // ZMIANA (24.09.2026, paczka SEO): opis skladany z pol strukturalnych w
  // poprawnej polszczyznie: zamiast dawnego "w Sianozety, Kolobrzeg" (bledna
  // odmiana, bo miejscowosc byla wstawiana po "w") uzywamy odmiany-neutralnego
  // "Lokalizacja: miasto (dzielnica)"; zawsze typ, transakcja, lokalizacja,
  // metraz, pokoje i cena => unikalny opis per oferta. ZASADA: bez ulicy/numeru w meta
  // (brak dokladnego adresu w publicznym tekscie ogloszenia).
  const locationLabel = offer.address_city
    ? `${offer.address_city}${offer.address_district ? ` (${offer.address_district})` : ''}`
    : ''
  const descParts = [
    `${propertyTypeLabel(offer.property_type)} na ${transactionLabel(offer.transaction_type)}`,
    locationLabel && `lokalizacja: ${locationLabel}`,
    offer.area && `${offer.area} m²`,
    offer.rooms_count && `${offer.rooms_count} pok.`,
    offer.price ? `${Number(offer.price).toLocaleString('pl-PL')} zł` : 'cena na zapytanie',
  ].filter(Boolean)
  const description = `${descParts.join(', ')}. Oferta biura nieruchomości InvestRent Kołobrzeg.`
  // NAPRAWA (23.09, zgłoszenie Weroniki - miniaturka na liście ofert vs
  // pierwsze zdjęcie w galerii oferty pokazywały co innego): is_main
  // potrafiło się rozjechać z sort_order (patrz naprawa w offers.ts
  // /reorder). Backend (public.ts, GET /offers/:id) już sortuje
  // offer_photos po sort_order rosnąco, więc [0] JEST zdjęciem głównym
  // z definicji - to samo zdjęcie co pierwszy slajd w galerii poniżej
  // (OfferDetailClient.tsx -> Gallery), zamiast osobno liczonego is_main.
  const mainPhoto = offer.offer_photos?.[0]?.url
  // Tytul: wlasny tytul oferty (jesli agent go nadal), a gdy pusty - generowany
  // z typu, metrazu i miejscowosci (wczesniej samo "Mieszkanie" - nieunikalne).
  const title = offer.title
    ?? [
      `${propertyTypeLabel(offer.property_type)} na ${transactionLabel(offer.transaction_type)}`,
      offer.address_city,
      offer.area && `${offer.area} m²`,
      offer.rooms_count && `${offer.rooms_count} pok.`,
    ].filter(Boolean).join(', ')
  // OG/Twitter NIE sa objete szablonem layout.tsx (osobne pola, nie
  // dziedzicza title.template), wiec tu marka zostaje doklejona jawnie -
  // inaczej niz <title> ponizej, gdzie robi to sam szablon.
  const socialTitle = `${title} | InvestRent Kołobrzeg`
  return {
    title,
    description,
    // NAPRAWA (audyt SEO, punkt 6): udostepnienie linku do KONKRETNEJ oferty
    // na Facebooku/WhatsApp pokazywalo ogolne zdjecie strony glownej
    // (dziedziczone z layout.tsx) zamiast zdjecia TEJ nieruchomosci - realnie
    // obniza klikalnosc gdy agent wysyla link klientowi.
    openGraph: mainPhoto ? {
      title: socialTitle, description, images: [{ url: mainPhoto, width: 1200, height: 800, alt: offer.title ?? propertyTypeLabel(offer.property_type) }],
    } : undefined,
    twitter: mainPhoto ? { card: 'summary_large_image', title: socialTitle, description, images: [mainPhoto] } : undefined,
    // NAPRAWA (audyt SEO, punkt 3): brak kanonicznych URL na calej stronie -
    // tutaj szczegolnie wazne, bo w przyszlosci mozliwe filtrowanie/parametry
    // przy tym samym ID oferty.
    // NOWE (22.09.2026, czytelne adresy ofert): kanoniczny URL to ZAWSZE
    // aktualny slug, niezaleznie od tego, jakim parametrem (UUID/stary
    // previous_slug/aktualny slug) trafiono na te strone - Google ma miec
    // jeden, spojny adres kanoniczny do zaindeksowania.
    alternates: { canonical: `${BASE_URL}/oferty/${offer.slug || params.id}` },
  }
}

// NAPRAWA (audyt SEO, punkt 1) - dane strukturalne pojedynczej oferty. To
// najwieksza, pojedyncza przegapiona szansa audytu: dynamiczne strony ofert
// istnialy, ale bez zadnych danych strukturalnych Google widzial je jako
// "zwykly tekst", nie jako ogloszenie nieruchomosci z cena/dostepnoscia.
function OfferJsonLd({ offer }: { offer: any }) {
  const schemaType = SCHEMA_TYPE_MAP[offer.property_type] ?? 'Accommodation'
  // NAPRAWA (23.09) - patrz komentarz przy generateMetadata wyżej.
  const mainPhoto = offer.offer_photos?.[0]?.url
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    url: `${BASE_URL}/oferty/${offer.slug || offer.id}`,
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
}

// NAPRAWA (audyt SEO, punkt 8) - okruszki (Breadcrumb) byly juz widoczne
// wizualnie na stronie, ale bez towarzyszacych danych strukturalnych
// BreadcrumbList Google nie pokazuje ich jako dodatkowej sciezki nawigacji
// pod tytulem w wynikach wyszukiwania.
// NOWE (13.09.2026, Daniel/SEO) - kazda strona oferty z filmem powinna
// miec dedykowane oznakowanie schema.org VideoObject (embedUrl -> YouTube),
// niezaleznie od mechanizmu blokujacego sugestie YouTube w VideoEmbed
// (OfferDetailClient.tsx) - to inny sygnal, DLA WYSZUKIWAREK, nie dla
// widza. Renderowane tylko gdy offer.video_url faktycznie wskazuje na
// YouTube (jedyny obslugiwany dzis kanal hostingu wideo dla ofert, patrz
// decyzja Daniela 13.09 - self-hosting w Supabase Storage odrzucony ze
// wzgledu na koszt transferu + brak adaptacyjnego streamingu).
function VideoJsonLd({ offer }: { offer: any }) {
  const youtubeMatch = (offer.video_url as string)?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/)
  if (!youtubeMatch) return null
  const youtubeId = youtubeMatch[1]
  // NAPRAWA (23.09) - patrz komentarz przy generateMetadata wyżej.
  const mainPhoto = offer.offer_photos?.[0]?.url
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Prezentacja wideo: ${offer.title ?? propertyTypeLabel(offer.property_type)}`,
    description: offer.description ? offer.description.slice(0, 500) : `Prezentacja wideo oferty w ${offer.address_city}`,
    // thumbnailUrl jest WYMAGANE przez Google dla VideoObject - miniatura
    // YouTube jest zawsze dostepna pod tym stalym adresem, niezaleznie od
    // tego czy mamy wlasne zdjecie glowne oferty.
    thumbnailUrl: mainPhoto ? [mainPhoto] : [`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`],
    uploadDate: offer.created_at,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
}

function BreadcrumbJsonLd({ offer }: { offer: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Oferty', item: `${BASE_URL}/oferty` },
      { '@type': 'ListItem', position: 3, name: offer.title ?? offer.ref_number, item: `${BASE_URL}/oferty/${offer.slug || offer.id}` },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
}

export default async function OfferPage({ params, searchParams }: { params: { id: string }; searchParams: { preview?: string } }) {
  const previewToken = searchParams?.preview
  const [result, officeData] = await Promise.all([
    getPublicOfferResult(params.id, previewToken),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  if (result.status === 'not_found') notFound()

  // NAPRAWA (19.08, Google Search Console: 40 stron z bledem 404). Oferta
  // ISTNIEJE ale zostala sprzedana/wycofana - zamiast golego 404 (ktory
  // zatrzymuje caly ruch z Google/starych linkow bez zadnej propozycji),
  // pokazujemy jasny komunikat + podobne, wciaz aktywne oferty tego samego
  // typu/miasta - zatrzymuje wartosc odwiedzin zamiast je marnowac.
  if (result.status === 'gone') {
    const { property_type, transaction_type, address_city } = result.context
    const similar = await getPublicOffers({
      property_type: property_type || undefined,
      transaction_type: transaction_type || undefined,
      limit: 6,
    })
    return (
      <>
        <Nav office={office} />
        <main>
          <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '24px 0 20px' }}>
            <div className="container">
              <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Oferty', href: '/oferty' }, { label: 'Oferta niedostępna' }]} />
            </div>
          </div>
          <div className="container" style={{ padding: '48px 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>Ta oferta nie jest już dostępna</h1>
            <p style={{ color: '#64748b', marginBottom: 32, fontSize: 16 }}>
              {address_city
                ? `Nieruchomość w ${address_city} została już sprzedana lub wynajęta. Zobacz podobne, aktualne oferty poniżej.`
                : 'Ta nieruchomość została już sprzedana lub wynajęta. Zobacz podobne, aktualne oferty poniżej.'}
            </p>
            {similar && similar.data.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, textAlign: 'left', maxWidth: 1100, margin: '0 auto' }}>
                {similar.data.map(o => <OfferCard key={o.id} offer={o} tab="new" />)}
              </div>
            ) : (
              <a href="/oferty" style={{ display: 'inline-block', padding: '12px 28px', background: '#0d2a5c', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                Zobacz wszystkie oferty
              </a>
            )}
          </div>
        </main>
        <Footer office={office} />
        <FloatingWA />
        <SocialSidebar office={office} />
      </>
    )
  }

  const offer = result.data as any

  // NOWE (22.09.2026, czytelne adresy ofert zamiast UUID) - jesli trafienie
  // NIE bylo 1:1 po aktualnym slugu (stary surowy UUID, albo previous_slug
  // po edycji typu/pokoi/miasta/ulicy oferty), 308-przekieruj na kanoniczny
  // adres zamiast renderowac tresc pod nieaktualnym URL-em - ta sama
  // filozofia "nigdy nie 404, zawsze przekieruj" co juz dziala w
  // next.config.js. Pomijane w trybie podgladu (link roboczy dla managera,
  // celowo generowany po UUID, patrz routes/offers.ts preview-link).
  if (!previewToken && offer.resolved_via && offer.resolved_via !== 'slug' && offer.canonical_slug) {
    permanentRedirect(`/oferty/${offer.canonical_slug}`)
  }

  return (
    <>
      {/* Dane strukturalne (JSON-LD) i tag kanoniczny to sygnaly DLA
          WYSZUKIWAREK ze strona jest realna/indeksowalna - w trybie
          podgladu (oferta jeszcze niezatwierdzona) celowo je pomijamy,
          niezaleznie od tego ze <head> ma juz robots:noindex wyzej. */}
      {!previewToken && <OfferJsonLd offer={offer} />}
      {!previewToken && <BreadcrumbJsonLd offer={offer} />}
      {!previewToken && offer.video_url && <VideoJsonLd offer={offer} />}
      {previewToken && (
        <div style={{ background: '#7c2d12', color: '#fff', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600 }}>
          🔒 PODGLĄD ROBOCZY — ta oferta nie jest jeszcze opublikowana ani widoczna dla odwiedzających stronę
        </div>
      )}
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '24px 0 20px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Oferty', href: '/oferty' }, { label: offer.title || offer.ref_number }]} />
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
