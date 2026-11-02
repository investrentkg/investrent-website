import Link from 'next/link'
import { PATH_CHOICE_LINKS } from '@/lib/pathChoice'

// Blok "Czego dziś szukasz?": cztery równorzędne ścieżki (sprzedający i kupujący obok siebie), PLAN SEO v4 krok 7.
// Dotąd strona główna i /oferty kierowały wejścia wewnętrzne głównie do sprzedających albo wcale; blok daje obu torom
// ten sam rozmiar, zwykłe linki w HTML (bez JS) i opisowe zakotwiczenia. Bez cen, liczb i obietnic.

export default function PathChoice({ id = 'sciezki' }: { id?: string }) {
  return (
    <section className="container" style={{ padding: '32px 0' }} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', marginBottom: 16 }}>
        Czego dziś szukasz?
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {PATH_CHOICE_LINKS.map(l => (
          <li key={l.href}>
            <Link href={l.href} style={{ display: 'block', height: '100%', padding: '16px 18px', border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff', textDecoration: 'none' }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#0d2a5c', marginBottom: 4 }}>{l.title}</span>
              <span style={{ display: 'block', fontSize: 14, lineHeight: 1.5, color: '#475569' }}>{l.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
