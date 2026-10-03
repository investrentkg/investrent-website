import type { Office } from '@/types'
import type { VerifiedRating } from '@/lib/schemaRating'
import { buildOfficeSchema } from '@/lib/officeSchema'
import { serializeJsonLd } from '@/lib/jsonLd'

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
//
// ZMIANA (03.10.2026): zamiast `googleRating`/`googleTotal` (ze sztywnymi
// fallbackami 4.9/55 na stronach) komponent przyjmuje opcjonalne `rating`
// ({ rating, total } z getVerifiedRating() - src/lib/schemaRating.ts).
// Gdy null/brak (API opinii zawiodlo, stale:true albo dane starsze niz
// 14 dni) pole aggregateRating jest POMIJANE. Sam schemat budowany jest w
// src/lib/officeSchema.ts (czysta funkcja, objeta testami).
export function JsonLd({ office, rating }: { office: Office | null; rating?: VerifiedRating | null }) {
  const schema = buildOfficeSchema(office, rating)
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
}
