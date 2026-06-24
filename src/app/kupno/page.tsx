import { getPublicOffers } from '@/lib/api'
import PageLayout from '@/components/PageLayout'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from '@/app/oferty/OffersPageClient'
import { Search, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kupno nieruchomości Kołobrzeg | InvestRent',
  description: 'Szukasz mieszkania, domu lub działki w Kołobrzegu? Znajdziemy Ci idealną nieruchomość. Bezpłatna pomoc, odpowiedź do 60 minut.',
}

const STEPS = [
  { n: '01', title: 'Powiedz nam czego szukasz', desc: 'Zadzwoń, napisz lub wypełnij formularz. Określ budżet, lokalizację i wymagania.' },
  { n: '02', title: 'Prezentujemy dopasowane oferty', desc: 'W ciągu 24h przygotujemy listę nieruchomości idealnie pasujących do Twoich potrzeb.' },
  { n: '03', title: 'Oglądamy i negocjujemy', desc: 'Organizujemy wizyty, pomagamy w negocjacjach cenowych. Reprezentujemy Twoje interesy.' },
  { n: '04', title: 'Bezpieczna finalizacja', desc: 'Sprawdzamy stan prawny, towarzyszymy u notariusza. Klucze w Twoich rękach.' },
]

export default async function KupnoPage() {
  const data = await getPublicOffers({ limit: 9, transaction_type: 'sprzedaz' })
  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0d2a5c 0%, #1a4fa0 100%)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.06)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Kupno' }]} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(245,166,35,.2)', border: '1px solid rgba(245,166,35,.35)', color: '#f5a623', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 18 }}>
            <Search size={12} /> Kupno nieruchomości
          </div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
            Znajdź wymarzoną<br />nieruchomość nad Bałtykiem
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, maxWidth: 560, lineHeight: 1.8, marginBottom: 28 }}>
            Pomagamy kupić mieszkanie, dom lub działkę w Kołobrzegu i okolicach. Znamy każdą ofertę na rynku — zarówno na sprzedaż przez agencje, jak i bezpośrednio od właścicieli.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: ShieldCheck, text: 'Weryfikacja stanu prawnego' },
              { icon: Clock,       text: 'Odpowiedź do 60 minut' },
              { icon: Award,       text: 'Bezpłatna pomoc' },
            ].map(b => {
              const Icon = b.icon
              return (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color="#f5a623" />
                  <span style={{ color: 'rgba(255,255,255,.8)', fontSize: 14 }}>{b.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Process */}
      <div style={{ background: 'white', padding: '56px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>Jak działamy</div>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', letterSpacing: '-.5px' }}>Proces zakupu krok po kroku</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 40, color: 'rgba(26,79,160,.1)', marginBottom: 8 }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 16, color: '#0d2a5c', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Offers */}
      <div style={{ background: '#f8fafc', padding: '48px 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 26, color: '#0d2a5c' }}>Aktualne oferty na sprzedaż</h2>
            <a href="/oferty?transaction_type=sprzedaz" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1a4fa0', fontWeight: 700, fontSize: 13, border: '1.5px solid #1a4fa0', padding: '8px 18px', borderRadius: 9, textDecoration: 'none' }}>
              Wszystkie <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} defaultTransaction="sprzedaz" />
    </PageLayout>
  )
}
