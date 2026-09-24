import type { Office } from '@/types'

// WYDZIELONE (31.08, audyt SEO Daniela: "investrent opinie" ma wysoka
// pozycje ale zero klikniec - dedykowana strona /o-nas ma widget z
// opiniami, ale w przeciwienstwie do strony glownej NIE MIALA tych
// samych znacznikow schema.org/AggregateRating, mimo ze to WLASNIE ta
// strona pojawia sie w wynikach wyszukiwania dla zapytan o opinie).
// Funkcja byla wczesniej zdefiniowana WYLACZNIE lokalnie w
// src/app/page.tsx (strona glowna) - wydzielona tutaj, zeby ta sama,
// juz sprawdzona logika (dane zywe z tego samego zrodla co widoczny
// widget, nie sztywne liczby) byla dostepna tez na /o-nas i kazdej
// kolejnej stronie, ktora tego bedzie potrzebowac, bez duplikowania kodu.
export function JsonLd({ office, googleRating, googleTotal }: { office: Office | null; googleRating: number; googleTotal: number }) {
  const sameAs = [office?.facebook_url, office?.instagram_url].filter((u): u is string => !!u)
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    // NOWE (24.09.2026, paczka SEO): stabilny @id - ten sam byt biznesowy
    // opisany na /, /o-nas i /kontakt jest dla Google jednym obiektem.
    "@id": "https://www.investrent.com.pl/#biuro",
    "name": office?.name ?? "InvestRent Nieruchomości",
    "alternateName": "Invest Rent",
    "description": "Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem.",
    "url": "https://www.investrent.com.pl",
    "telephone": office?.phone ?? "+48731554341",
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
    "geo": { "@type": "GeoCoordinates", "latitude": 54.1764, "longitude": 15.5830 },
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
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": String(googleRating), "reviewCount": String(googleTotal) }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
}
