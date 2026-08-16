import type { Office } from '@/types'

const HOUSES_ICON = 'data:image/png;base64,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'

const LINKS = [
  // NAPRAWA (audyt webmasterski, Daniel 30.07.2026): 'Polityka prywatności'
  // wskazywala na /polityka-prywatnosci - strona ktora NIGDY nie istniala
  // (martwy link w stopce, widoczny na kazdej podstronie serwisu). RODO i
  // polityka prywatnosci to w praktyce ten sam dokument - skonsolidowane do
  // jednego, istniejacego linku (/rodo) zamiast dwoch etykiet z czego jedna
  // byla martwa.
  { label: 'Polityka prywatności (RODO)', href: '/rodo' },
  { label: 'Mapa strony',         href: '/sitemap.xml' },
  { label: 'Kontakt',             href: '/kontakt' },
  { label: 'Kalkulator kredytowy', href: '/#kalkulator' },
  // NOWE (16.08, Daniel: "gorne menu zrobilo sie za ciasne, blog jako
  // opcjonalna zakladka nie wnosi tyle na topie zeby tam zajmowac
  // miejsce - powinien byc tutaj obok mapy strony/kontaktu"). Przeniesione
  // z Nav.tsx (patrz komentarz tam) - link wciaz istnieje, tylko nie
  // zabiera juz miejsca w ciasnym, gornym pasku nawigacji.
  { label: 'Blog',                href: '/blog' },
]

export default function Footer({ office }: { office: Office | null }) {
  const name = office?.name ?? 'InvestRent Nieruchomości'
  return (
    <footer style={{ background: '#0d2a5c', padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {/* Logo — identyczne jak w navbarze: białe kontury domków + tekst */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HOUSES_ICON} alt="InvestRent"
              style={{ height: 42, width: 'auto', display: 'block' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-montserrat), Arial Black, sans-serif', fontWeight: 800, color: 'rgba(255,255,255,.9)', fontSize: 14, letterSpacing: '.5px' }}>INVEST RENT</span>
              <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 3 }}>nieruchomości · Kołobrzeg</span>
            </div>
            {/* Ikonki social media - żądanie Daniela 16.07.2026, pokazywane
                tylko gdy link faktycznie ustawiony w Ustawieniach biura.
                NAPRAWA 17.07.2026: Footer.tsx jest Server Component (bez 'use
                client') - onMouseEnter/onMouseLeave jako propsy na zwykłym <a>
                w komponencie serwerowym rzuca w Next.js "Event handlers cannot
                be passed to Client Component props" - działało tylko na
                stronach z ZAMROŻONYMI, starymi danymi (statyczne/ISR, budowane
                zanim facebook_url/instagram_url miały wartość), więc błąd był
                niewidoczny do czasu aż realne dane zaczęły przez to przechodzić
                na stronach renderowanych świeżo (/ i /oferty, force-dynamic) -
                stąd "Application error" na całej stronie głównej. Zamienione
                na czysty CSS hover (klasa .social-icon), zero JS potrzebne. */}
            {(office?.facebook_url || office?.instagram_url) && (
              <div style={{ display: 'flex', gap: 10, marginLeft: 14 }}>
                {office?.facebook_url && (
                  <a href={office.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="social-icon"
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,.85)"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
                  </a>
                )}
                {office?.instagram_url && (
                  <a href={office.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="social-icon"
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,.85)" stroke="none"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {LINKS.map(l => (
                <a key={l.label} href={l.href}
                  style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, textDecoration: 'none' }}>
                  {l.label}
                </a>
              ))}
            </div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 12 }}>
              © {new Date().getFullYear()} {name} · Wszystkie prawa zastrzeżone
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
