import Link from 'next/link'
import { LOCALITIES } from '@/content/miejscowosci'
import { foldCity, formatRcnCell } from '@/lib/localityOffers'

// SEO (31.10.2026): unikalny blok „Okolica” na stronie oferty. Oferty z opisami z portali bywają
// uznawane przez Google za treść podobną do innych ('zeskanowana, jeszcze niezindeksowana').
// Blok dodaje oparte na faktach, niepowtarzalne informacje o miejscowości z istniejącej treści
// (src/content/miejscowosci: dojazd, komunikacja, ceny z RCN przy próbie >= 10).
// Bez adresu oferty: używamy tylko nazwy miejscowości (address_city). Tylko miejscowości 'approved'.
export default function OfferAreaBlock({ city }: { city: string | null | undefined }) {
  const key = foldCity(city)
  const l = key ? LOCALITIES.find(x => x.status === 'approved' && x.cityNames.some(n => foldCity(n) === key)) : undefined
  if (!l) return null
  const rcn = l.rcn ? formatRcnCell(l.rcn) : null
  const hasRcn = !!l.rcn && l.rcn.n >= 10 && l.rcn.medianPerM2 != null
  return (
    <section className="container" style={{ margin: '8px auto 40px', maxWidth: 1100 }} aria-labelledby="okolica-heading">
      <h2 id="okolica-heading" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 22, color: '#0d2a5c', marginBottom: 12 }}>
        Okolica: {l.name}
      </h2>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7, color: '#334155', fontSize: 15 }}>
        <li>Do centrum Kołobrzegu: {l.distanceKm}, {l.driveMin} samochodem (gmina {l.gmina}).</li>
        <li>Komunikacja: {l.bus}.</li>
        {hasRcn && <li>Ceny transakcyjne lokali z rejestru (RCN): {rcn}. Rejestr publikuje dane z opóźnieniem.</li>}
      </ul>
      <p style={{ marginTop: 12, fontSize: 15 }}>
        <Link href={`/nadmorskie-miejscowosci-kolobrzeg/${l.slug}`} style={{ color: '#1a4fa0', fontWeight: 600 }}>
          Więcej o miejscowości {l.name}: dojazd, rynek i ceny z rejestru
        </Link>
      </p>
    </section>
  )
}
