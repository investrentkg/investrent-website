import Link from 'next/link'
import { ZADATEK_HEADING, ZADATEK_ITEMS, ZADATEK_OUTRO, ZADATEK_CTA_LABEL, ZADATEK_CTA_HREF, zadatekIntro } from '@/lib/kupnoZadatek'

// Blok "Co sprawdzić przed zadatkiem" (DRAFT do akceptacji Ernesta/Daniela, D75). Zwykły HTML bez JS, bez obietnic i cen.

export default function BeforeDeposit() {
  return (
    <section style={{ padding: '48px 0', background: '#fff' }} aria-labelledby="zadatek-heading">
      <div className="container" style={{ maxWidth: 760 }}>
        <h2 id="zadatek-heading" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', marginBottom: 12 }}>
          {ZADATEK_HEADING}
        </h2>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>{zadatekIntro()}</p>
        <ol style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ZADATEK_ITEMS.map(i => (
            <li key={i.id} style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
              <strong style={{ color: '#0d2a5c' }}>{i.title}.</strong> {i.desc}
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, marginTop: 20 }}>
          {ZADATEK_OUTRO}{' '}
          <Link href={ZADATEK_CTA_HREF} style={{ color: '#1a4fa0', fontWeight: 700 }}>{ZADATEK_CTA_LABEL}</Link>.
        </p>
      </div>
    </section>
  )
}
