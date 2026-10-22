// Linki wewnętrzne do wpisów o cenach i do huba miejscowości (SEO, 22.10.2026).
// Powód: Google znalazł wpisy i hub, ale żadna kluczowa strona do nich nie linkowała (słaby sygnał indeksacji).
// Zakotwiczenia opisowe, każda fraza użyta raz; wpis A = „ceny w liczbach”, wpis B = „od czego zależy cena” (bez kanibalizacji).
const POST_A = '/blog/ile-kosztuje-mieszkanie-w-kolobrzegu-ceny-ofertowe-i-transakcyjne'
const POST_B = '/blog/ceny-nieruchomosci-w-kolobrzegu-ile-realnie-kosztuje-mieszkanie-nad-morzem-i-od-'
const HUB = '/nadmorskie-miejscowosci-kolobrzeg'

export type RelatedKey = 'wycena' | 'sprzedaz' | 'kupno' | 'kolobrzeg' | 'home' | 'hub'

const LINKS: Record<RelatedKey, { href: string; title: string }[]> = {
  wycena: [{ href: POST_A, title: 'Zobacz, ile kosztuje mieszkanie w Kołobrzegu: ceny ofertowe i transakcyjne' }],
  sprzedaz: [
    { href: '/mieszkania-na-sprzedaz-kolobrzeg', title: 'Mieszkania na sprzedaż w Kołobrzegu: aktualne oferty' },
    { href: '/domy-na-sprzedaz-kolobrzeg', title: 'Domy na sprzedaż w Kołobrzegu i okolicy: aktualne oferty' },
    { href: POST_A, title: 'Jakie ceny widzimy na rynku: ceny ofertowe i transakcyjne w Kołobrzegu' },
    { href: HUB, title: 'Nieruchomości w nadmorskich miejscowościach koło Kołobrzegu' },
  ],
  kupno: [
    { href: '/mieszkania-na-sprzedaz-kolobrzeg', title: 'Mieszkania na sprzedaż w Kołobrzegu: aktualne oferty' },
    { href: '/domy-na-sprzedaz-kolobrzeg', title: 'Domy na sprzedaż w Kołobrzegu i okolicy: aktualne oferty' },
    { href: POST_B, title: 'Od czego zależy cena kupowanego mieszkania' },
    { href: HUB, title: 'Nadmorskie miejscowości w okolicy Kołobrzegu' },
  ],
  kolobrzeg: [
    { href: POST_B, title: 'Od czego zależy cena nieruchomości w Kołobrzegu' },
    { href: POST_A, title: 'Ceny ofertowe i transakcyjne mieszkań w Kołobrzegu' },
    { href: '/mieszkania-na-sprzedaz-kolobrzeg', title: 'Mieszkania na sprzedaż w Kołobrzegu: aktualne oferty' },
    { href: '/domy-na-sprzedaz-kolobrzeg', title: 'Domy na sprzedaż w Kołobrzegu i okolicy: aktualne oferty' },
  ],
  home: [
    { href: '/mieszkania-na-sprzedaz-kolobrzeg', title: 'Mieszkania na sprzedaż w Kołobrzegu: aktualne oferty' },
    { href: '/domy-na-sprzedaz-kolobrzeg', title: 'Domy na sprzedaż w Kołobrzegu i okolicy: aktualne oferty' },
    { href: POST_B, title: 'Co wpływa na wartość nieruchomości nad morzem' },
    { href: HUB, title: 'Miejscowości nad morzem w okolicy Kołobrzegu' },
  ],
  hub: [{ href: POST_A, title: 'Ceny ofertowe i transakcyjne w Kołobrzegu' }],
}

export default function RelatedLinks({ page }: { page: RelatedKey }) {
  return (
    <section style={{ padding: '32px 0', background: '#fff' }} aria-labelledby={`powiazane-${page}`}>
      <div className="container" style={{ maxWidth: 760 }}>
        <h2 id={`powiazane-${page}`} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 20, color: '#0d2a5c', marginBottom: 12 }}>Przydatne informacje</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LINKS[page].map(l => (
            <li key={l.href}>
              <a href={l.href} style={{ color: '#1a4fa0', fontSize: 15, lineHeight: 1.6, textDecoration: 'underline' }}>{l.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
