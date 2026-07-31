import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from '@/app/oferty/OffersPageClient'
import { getPublicOffers, getOffice } from '@/lib/api'
import { KeyRound, Shield, Clock, Star, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wynajem nieruchomości Kołobrzeg | InvestRent',
  description: 'Mieszkania i lokale do wynajęcia w Kołobrzegu. Sprawdź nasze oferty najmu.',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

export default async function WynajemPage() {
  const [data, officeData] = await Promise.all([
    getPublicOffers({ limit: 9, transaction_type: 'wynajem' } as any),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', padding: '56px 0 48px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Wynajem' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              Znajdź mieszkanie<br />do wynajęcia nad morzem
            </h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 520, lineHeight: 1.8, marginBottom: 28 }}>
              Mieszkania, apartamenty i lokale do wynajęcia w Kołobrzegu i okolicach. Długoterminowy wynajem dla osób szukających stałego miejsca.
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
              {[{ icon: Shield, text: 'Zweryfikowane oferty' }, { icon: Clock, text: 'Szybki kontakt' }, { icon: Star, text: 'Transparentne koszty' }].map(b => {
                const Icon = b.icon; return (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={16} color="rgba(255,255,255,.9)" />
                    <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 14 }}>{b.text}</span>
                  </div>
                )
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
        {/* Banner informacyjny */}
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
            padding: '14px 20px', margin: '0 0 20px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: 14, color: '#1e40af', margin: 0, lineHeight: 1.6 }}>
              <strong>Nie wszystkie nieruchomości trafiają od razu na stronę.</strong>{' '}
              Skontaktuj się z nami aby poznać naszą pełną ofertę.
            </p>
          </div>
        </div>
        <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} defaultTransaction="wynajem" />
      </main>
      <Footer office={office} />
      <FloatingWA />

      <SocialSidebar office={office} />
    </>
  )
}
