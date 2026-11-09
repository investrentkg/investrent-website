import ScrollReveal from '@/components/ScrollReveal'
import { HOME_TEXT_A } from '@/lib/sprzedazSeo'

// Sekcja "O nas" wg makiety M3: tekst (z linkami SEO bez zmian) + trzy filary obok. Stockowe zdjęcie z plakietką
// oceny usunięte: ocena Google jest teraz w JEDNYM pasku zaufania w hero (i w stopce bloku opinii), nie w trzech miejscach.
const POINTS = [
  { title: 'Lokalny ekspert', desc: 'Znamy każdą ulicę Kołobrzegu i okolic. Wiemy które lokalizacje zyskają na wartości.' },
  { title: 'Bezpieczna transakcja', desc: 'Weryfikujemy stan prawny każdej nieruchomości. Zero niespodzianek po zakupie.' },
  { title: 'Odpowiadamy jak najszybciej', desc: 'Nie później niż w ciągu 24 godzin, bez zbędnego czekania.' },
]

export default function About() {
  return (
    <section id="o-nas" className="m3-about">
      <div className="container">
        <div className="m3-about-grid">
          <div>
            <div className="tag" style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0', marginBottom: 16 }}>
              O nas
            </div>
            <h2 className="heading" style={{ fontSize: 'clamp(26px, 3.4vw, 32px)', color: '#0d2a5c', lineHeight: 1.15, marginBottom: 16 }}>
              Nieruchomości nad Bałtykiem&nbsp;— to nasza specjalność
            </h2>
            <p style={{ fontSize: 15, color: '#3d4963', lineHeight: 1.7, marginBottom: 14 }}>
              InvestRent to kołobrzeskie <a href="/kolobrzeg" style={{ color: '#0d2a5c', textDecoration: 'underline' }}>biuro nieruchomości</a> z wieloletnim doświadczeniem na rynku nadmorskim. Doskonale znamy lokalne realia — od cen po prawne zawiłości rynku wakacyjnego.
            </p>
            <p style={{ fontSize: 15, color: '#3d4963', lineHeight: 1.7, marginBottom: 14 }}>
              Naszą misją jest przeprowadzenie klientów przez każdą transakcję bezpiecznie i bez stresu. Nie znikamy po podpisaniu umowy — jesteśmy do dyspozycji przez cały proces i długo po nim.
            </p>
            {/* SEO krok 2 (18.10.2026): tekst A (zaakceptowany dosłownie) + link do /sprzedaz */}
            <p style={{ fontSize: 15, color: '#3d4963', lineHeight: 1.7 }}>
              {HOME_TEXT_A}{' '}
              Zobacz, jak wygląda <a href="/sprzedaz" style={{ color: '#0d2a5c', textDecoration: 'underline' }}>sprzedaż nieruchomości w Kołobrzegu</a> z naszym biurem.
            </p>
          </div>
          <div className="m3-pil">
            {POINTS.map((pt, i) => (
              <ScrollReveal key={pt.title} delay={i * 120}>
                <div>
                  <b>{pt.title}</b>
                  <span>{pt.desc}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
