import Link from 'next/link'
import { isCommercialHubOn } from '@/lib/commercialHub'
import { COMMERCIAL_PATH } from '@/content/komercyjne'

// Kafel "Nieruchomości komercyjne" na stronie głównej (decyzja Daniela 07.11.2026). Tylko przy fladze NEXT_PUBLIC_COMMERCIAL_HUB.
// Treść wyłącznie z faktów zatwierdzonych (FAKTY_komercyjne_zatwierdzone_07_11.md): typy obiektów, sprzedaż, szukanie obiektu. Bez liczb.
export default function CommercialTile() {
  if (!isCommercialHubOn()) return null
  return (
    <section className="container" style={{ padding: '0 0 32px' }}>
      <Link href={COMMERCIAL_PATH} style={{ display: 'block', padding: '16px 18px 16px 16px', border: '1px solid #e5e7eb', borderLeft: '3px solid #c59a2e', borderRadius: 12, background: '#fff', textDecoration: 'none' }}>
        <span style={{ display: 'block', fontWeight: 700, fontSize: 17, color: '#0d2a5c', marginBottom: 4 }}>Nieruchomości komercyjne</span>
        <span style={{ display: 'block', fontSize: 14, lineHeight: 1.5, color: '#475569' }}>Działki, hale i magazyny, lokale usługowe i obiekty inwestycyjne. Sprzedaż oraz szukanie obiektu dla inwestora.</span>
      </Link>
    </section>
  )
}
