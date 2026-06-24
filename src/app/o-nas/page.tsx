import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Team from '@/components/Team'
import Reviews from '@/components/Reviews'
import Breadcrumb from '@/components/Breadcrumb'
import { getTeam, getStats, getOffice } from '@/lib/api'
import { MapPin, Phone, Mail, Shield, Heart, TrendingUp, Users, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nas | InvestRent Nieruchomości Kołobrzeg',
  description: 'Poznaj zespół InvestRent — biura nieruchomości z Kołobrzegu specjalizującego się w rynku nadmorskim.',
}

const FALLBACK_OFFICE = { name: 'InvestRent Nieruchomości', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

const VALUES = [
  { icon: Shield,     title: 'Bezpieczenstwo',  desc: 'Kazda transakcja przeprowadzana jest z pelna weryfikacja prawna. Zero niespodzianek.' },
  { icon: Heart,      title: 'Zaangazowanie',   desc: 'Traktujemy kazdego klienta indywidualnie. Nie znikamy po podpisaniu umowy.' },
  { icon: TrendingUp, title: 'Skutecznosc',     desc: 'Sredni czas sprzedazy u nas to 45 dni. Rynek w Kolobrzegu to 90+ dni.' },
  { icon: Users,      title: 'Lokalne',         desc: 'Jestesmy stad. Znamy kazda ulice, kazda lokalizacje i kazda inwestycje.' },
]

const WHY = [
  '500+ transakcji w Kolobrzegu i okolicach',
  'Sredni czas sprzedazy: 45 dni (rynek: 90+ dni)',
  'Pelna obsluga prawna i notarialna w cenie',
  'Ekspozycja na wszystkich glownych portalach',
  'Ocena klientow: 4.9/5 na podstawie 127 opinii',
]

export default async function ONasPage() {
  const [teamData, statsData, officeData] = await Promise.all([getTeam(), getStats(), getOffice()])
  const office = officeData ?? FALLBACK_OFFICE
  const trans = statsData?.completed_transactions ?? 500
  const teamSize = statsData?.team_size ?? 6

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona glowna', href: '/' }, { label: 'O nas' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              Jestesmy stad.<br />Kolobrzeg to nasza specjalnosc.
            </h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, maxWidth: 560, lineHeight: 1.8 }}>
              InvestRent to biuro nieruchomosci z Kolobrzegu z wieloletnim doswiadczeniem na rynku nadmorskim.
            </p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px 0', borderBottom: '1px solid #e5e7eb' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {[
                { val: trans + '+', label: 'Transakcji' },
                { val: '4.9/5',     label: 'Ocena klientow' },
                { val: teamSize,    label: 'Ekspertow w zespole' },
                { val: 'Kolobrzeg', label: 'Siedziba biura' },
              ].map((st, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '20px', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 36, color: '#0d2a5c', marginBottom: 4 }}>{st.val}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '56px 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 18, lineHeight: 1.2 }}>
                  Zbudowani na zaufaniu i lokalnej wiedzy
                </h2>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 20 }}>
                  InvestRent powstalo z pasji do lokalnego rynku nadmorskiego. Specjalizujemy sie w Kolob rzegu i calym Wybrzezu Baltyckim — od Mielna przez Dzwirzyno po Rewal.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {WHY.map(w => (
                    <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, color: '#374151' }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {VALUES.map(v => {
                  const Icon = v.icon
                  return (
                    <div key={v.title} style={{ background: 'white', borderRadius: 14, padding: '22px', border: '1px solid #e5e7eb' }}>
                      <div style={{ width: 44, height: 44, background: 'rgba(26,79,160,.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <Icon size={20} color="#1a4fa0" />
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 6 }}>{v.title}</h3>
                      <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.7 }}>{v.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <Team members={teamData?.data ?? []} />
        <Reviews />

        <div style={{ background: 'white', padding: '48px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', marginBottom: 20 }}>Odwiedz nasze biuro</h2>
                {[
                  { icon: MapPin, label: 'Adres',   val: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg' },
                  { icon: Phone,  label: 'Telefon', val: '+48 731 554 341' },
                  { icon: Mail,   label: 'Email',   val: 'biuro@investrent.com.pl' },
                ].map(c => {
                  const Icon = c.icon
                  return (
                    <div key={c.label} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 44, height: 44, background: '#eff6ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color="#1a4fa0" />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '.8px', textTransform: 'uppercase' as const, marginBottom: 3 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a4fa0' }}>{c.val}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ background: '#f0f4ff', borderRadius: 16, height: 280, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 10, color: '#9ca3af', border: '1px solid #e5e7eb' }}>
                <MapPin size={40} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>Mapa Google Maps</div>
                <div style={{ fontSize: 12 }}>ul. Ratuszowa 12/1 lok. 3, Kolobrzeg</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
