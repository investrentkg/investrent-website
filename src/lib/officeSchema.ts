import type { Office } from '@/types'
import type { VerifiedRating } from './schemaRating.ts'
import { formatPhoneHref } from './phone.ts'

// Wspolrzedne biura (ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg).
// ZMIANA (03.10.2026): poprzednio 54.1764 / 15.5830 (3 miejsca po przecinku,
// punkt ok. 400 m na wschod od adresu). Google wymaga co najmniej 5 miejsc.
// Zrodlo: OpenStreetMap (Nominatim, jednorazowe zapytanie): budynek
// Ratuszowa 12 = 54.17707 / 15.57670, wezel biura (estate_agent 12/1) =
// 54.17705 / 15.57682. UWAGA: to dane z OSM, NIE z wizytowki Google - przy
// najblizszej okazji potwierdzic pineske w Google Maps (wizytowka "Invest Rent
// Nieruchomosci") i w razie rozbieznosci poprawic te stale.
export const OFFICE_GEO = { latitude: 54.17705, longitude: 15.57682 } as const

/**
 * Buduje obiekt schema.org (RealEstateAgent) dla JsonLd.
 * `rating` - wiarygodna ocena z getVerifiedRating(); gdy null/undefined pole
 * aggregateRating jest POMIJANE (zamiast sztywnych liczb zapasowych).
 */
export function buildOfficeSchema(office: Office | null, rating?: VerifiedRating | null) {
  const sameAs = [office?.facebook_url, office?.instagram_url].filter((u): u is string => !!u)
  // NAP: telefon w CRM to surowe cyfry ("731554341"), bez kodu kraju - Google
  // zaleca format miedzynarodowy (E.164), a widoczny numer to +48 731 554 341.
  const telephone = formatPhoneHref(office?.phone) || '+48731554341'
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    // NOWE (24.09.2026, paczka SEO): stabilny @id - ten sam byt biznesowy
    // opisany na /, /o-nas i /kontakt jest dla Google jednym obiektem.
    "@id": "https://www.investrent.com.pl/#biuro",
    "name": office?.name ?? "InvestRent Nieruchomości",
    "alternateName": "Invest Rent",
    "description": "Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem.",
    "url": "https://www.investrent.com.pl",
    "telephone": telephone,
    "email": office?.email ?? "biuro@investrent.com.pl",
    "image": "https://www.investrent.com.pl/logo.png",
    "address": {
      "@type": "PostalAddress",
      // NAPRAWA (audyt SEO 09.09.2026, punkt P0): brakujace streetAddress
      // utrudnialo Google powiazanie strony z wizytowka Google Business
      // Profile (niepelny NAP w schemacie). Ta sama, jedyna wersja adresu
      // uzywana wszedzie indziej w tym repo (Contact.tsx, Footer, FALLBACK_OFFICE
      // na kazdej podstronie) - musi zostac identyczna z wizytowka Google.
      "streetAddress": "ul. Ratuszowa 12/1 lok. 3",
      "addressLocality": "Kołobrzeg",
      "postalCode": "78-100",
      "addressRegion": "Zachodniopomorskie",
      "addressCountry": "PL"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": OFFICE_GEO.latitude, "longitude": OFFICE_GEO.longitude },
    "areaServed": [
      { "@type": "City", "name": "Kołobrzeg" },
      { "@type": "City", "name": "Ustronie Morskie" },
      { "@type": "City", "name": "Dźwirzyno" },
      { "@type": "City", "name": "Gąski" },
      { "@type": "City", "name": "Trzebiatów" },
    ],
    // NOWE (24.09.2026): godziny otwarcia - te same, ktore sa widoczne na
    // stronie (Contact.tsx: "Pon-Pt 8:00-16:00 - Sob 9:00-14:00"). Przy zmianie
    // godzin zaktualizowac OBA miejsca.
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:00", "closes": "16:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "14:00" },
    ],
    // sameAs tylko z profili faktycznie ustawionych w Ustawieniach biura (CRM).
    ...(sameAs.length > 0 ? { "sameAs": sameAs } : {}),
    // aggregateRating TYLKO z wiarygodnych, swiezych danych (patrz schemaRating.ts);
    // wartosci jako liczby - te same, co widoczny widget (jeden obiekt zrodlowy).
    ...(rating ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating.rating, "reviewCount": rating.total } } : {}),
  }
}
