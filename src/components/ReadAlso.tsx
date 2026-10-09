// Blok „Przeczytaj też" (08.10.2026, SEO): linki wewnętrzne do 3 wpisów bloga, które Google znalazł, ale jeszcze nie zindeksował
// (brak linków wewnętrznych = słaby sygnał). Używany na stronie głównej, /kolobrzeg i /wynajem. Tytuły = tytuły wpisów w CRM.
const POSTS = [
  { href: '/blog/nieruchomosci-kolobrzeg-co-warto-wiedziec-przed-zakupem-sprzedaza-lub-wynajmem-n', title: 'Nieruchomości Kołobrzeg – co warto wiedzieć przed zakupem, sprzedażą lub wynajmem nad Bałtykiem' },
  { href: '/blog/trudne-nieruchomosci-w-kolobrzegu-czym-sa-i-jak-skutecznie-je-sprzedac-lub-kupic', title: 'Trudne nieruchomości w Kołobrzegu – czym są i jak skutecznie je sprzedać lub kupić' },
  { href: '/blog/wynajem-mieszkania-w-kolobrzegu-kompletny-przewodnik-dla-najemcow-i-wlascicieli', title: 'Wynajem mieszkania w Kołobrzegu – kompletny przewodnik dla najemców i właścicieli' },
]

export default function ReadAlso() {
  return (
    <section style={{ padding: '40px 0', background: '#fff' }} aria-labelledby="przeczytaj-tez">
      <div className="container" style={{ maxWidth: 760 }}>
        <h2 id="przeczytaj-tez" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', marginBottom: 16 }}>Przeczytaj też</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {POSTS.map(p => (
            <li key={p.href}>
              <a href={p.href} style={{ color: '#1a4fa0', fontSize: 15, lineHeight: 1.6, textDecoration: 'underline' }}>{p.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
