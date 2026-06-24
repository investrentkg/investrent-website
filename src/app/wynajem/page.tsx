import { getPublicOffers } from '@/lib/api'
import PageLayout from '@/components/PageLayout'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from '@/app/oferty/OffersPageClient'
import { KeyRound, ArrowRight, Shield, Clock, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wynajem nieruchomości Kołobrzeg | InvestRent',
  description: 'Szukasz mieszkania lub lokalu do wynajęcia w Kołobrzegu? Sprawdź nasze oferty najmu. Pomożemy Ci znaleźć idealne miejsce.',
}

export default async function WynajemPage() {
  const data = await getPublicOffers({ limit: 9, transaction_type: 'wynajem' })
  return (
    <PageLayout>
      <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', padding: '56px 0 48px' }}>
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Wynajem' }]} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(255,255,255,.15)', color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 18 }}>
            <KeyRound size={12} /> Wynajem nieruchomości
          </div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
            Znajdź mieszkanie<br />do wynajęcia nad morzem
          </h1>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 16, maxWidth: 520, lineHeight: 1.8, marginBottom: 28 }}>
            Mieszkania, apartamenty i lokale do wynajęcia w Kołobrzegu i okolicach. Długoterminowy wynajem dla osób poszukujących stałego miejsca.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ icon: Shield, text: 'Zweryfikowane oferty' }, { icon: Clock, text: 'Szybki kontakt' }, { icon: Star, text: 'Bez ukrytych opłat' }].map(b => {
              const Icon = b.icon
              return <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={16} color="rgba(255,255,255,.9)" /><span style={{ color: 'rgba(255,255,255,.8)', fontSize: 14 }}>{b.text}</span></div>
            })}
          </div>
        </div>
      </div>
      <div style={{ background: '#f8fafc', padding: '32px 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 24, color: '#0d2a5c' }}>Oferty do wynajęcia</h2>
            <a href="/oferty?transaction_type=wynajem" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#059669', fontWeight: 700, fontSize: 13, border: '1.5px solid #059669', padding: '8px 18px', borderRadius: 9, textDecoration: 'none' }}>
              Wszystkie <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} defaultTransaction="wynajem" />
    </PageLayout>
  )
}
