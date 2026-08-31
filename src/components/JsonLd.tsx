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
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": office?.name ?? "InvestRent Nieruchomości",
    "description": "Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem.",
    "url": "https://www.investrent.com.pl",
    "telephone": office?.phone ?? "+48731554341",
    "email": office?.email ?? "biuro@investrent.com.pl",
    "image": "https://www.investrent.com.pl/logo.png",
    "address": {
      "@type": "PostalAddress",
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
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": String(googleRating), "reviewCount": String(googleTotal) }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
}
