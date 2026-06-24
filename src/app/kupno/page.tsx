import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from '@/app/oferty/OffersPageClient'
import { getPublicOffers, getOffice } from '@/lib/api'
import { Search, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kupno nieruchomości Kołobrzeg | InvestRent',
  description: 'Szukasz mieszkania lub domu w Kołobrzegu? Znajdziemy Ci idealną nieruchomość. Bezpłatna pomoc, odpowiedź do 60 minut.',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

const STEPS = [
  { n: '01', title: 'Powiedz nam czego szukasz', desc: 'Zadzwoń lub napisz. Określ budżet, lokalizację i wymagania.' },
  { n: '02', title: 'Prezentujemy dopasowane oferty', desc: 'W ciągu 24h przygotujemy listę nieruchomości idealnie pasujących do Twoich potrzeb.' },
  { n: '03', title: 'Oglądamy i negocjujemy', desc: 'Organizujemy wizyty, pomagamy w negocjacjach. Reprezentujemy Twoje interesy.' },
  { n: '04', title: 'Bezpieczna finalizacja', desc: 'Sprawdzamy stan prawny, towarzyszymy u notariusza. Klucze w Twoich rękach.' },
]

export default async function KupnoPage() {
  const [data, officeData] = await Promise.all([
    getPublicOffers({ limit: 9, transaction_type: 'sprzedaz' }),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Kupno' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              Znajdź wymarzoną<br />nieruchomość nad Bałtykiem
            </h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, maxWidth: 560, lineHeight: 1.8, marginBottom: 28 }}>
              Pomagamy kupić mieszkanie, dom lub działkę w Kołobrzegu i okolicach. Znamy każdą ofertę na rynku — zarówno z agencji, jak i bezpośrednio od właścicieli.
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
              {[
                { icon: ShieldCheck, text: 'Weryfikacja stanu prawnego' },
                { icon: Clock,       text: 'Odpowiedź do 60 minut' },
                { icon: Award,       text: 'Bezpłatna pomoc' },
              ].map(b => { const Icon = b.icon; return (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color="#f5a623" />
                  <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 14 }}>{b.text}</span>
                </div>
              )})}
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '56px 0' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', textAlign: 'center' as const, marginBottom: 40 }}>
              Proces zakupu krok po kroku
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {STEPS.map(s => (
                <div key={s.n}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 40, color: 'rgba(26,79,160,.12)', marginBottom: 8 }}>{s.n}</div>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 16, color: '#0d2a5c', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '40px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 24, color: '#0d2a5c' }}>Aktualne oferty na sprzedaż</h2>
              <a href="/oferty?transaction_type=sprzedaz" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1a4fa0', fontWeight: 700, fontSize: 13, border: '1.5px solid #1a4fa0', padding: '8px 18px', borderRadius: 9, textDecoration: 'none' }}>
                Wszystkie <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
        <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} defaultTransaction="sprzedaz" />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
