import PageLayout from '@/components/PageLayout'
import Breadcrumb from '@/components/Breadcrumb'
import Team from '@/components/Team'
import Reviews from '@/components/Reviews'
import { getTeam, getStats } from '@/lib/api'
import { MapPin, Phone, Mail, Award, Users, TrendingUp, Shield, Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nas | InvestRent Nieruchomości Kołobrzeg',
  description: 'Poznaj zespół InvestRent — biura nieruchomości z Kołobrzegu specjalizującego się w rynku nadmorskim. 500+ transakcji, ocena 4.9/5.',
}

const VALUES = [
  { icon: Shield,    title: 'Bezpieczeństwo', desc: 'Każda transakcja przeprowadzana jest z pełną weryfikacją prawną. Zero niespodzianek.' },
  { icon: Heart,     title: 'Zaangażowanie',  desc: 'Traktujemy każdego klienta indywidualnie. Nie znikamy po podpisaniu umowy.' },
  { icon: TrendingUp,title: 'Skuteczność',    desc: 'Średni czas sprzedaży u nas to 45 dni. Rynek w Kołobrzegu to 90+.' },
  { icon: Users,     title: 'Lokalność',      desc: 'Jesteśmy stąd. Znamy każdą ulicę, każdą lokalizację i każdą inwestycję.' },
]

export default async function ONasPage() {
  const [teamData, statsData] = await Promise.all([getTeam(), getStats()])
  const s = statsData ?? { active_offers: 0, completed_transactions: 500, team_size: 6 }

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px' }}>
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'O nas' }]} />
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
            Jesteśmy stąd.<br />Kołobrzeg to nasza specjalność.
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, maxWidth: 560, lineHeight: 1.8 }}>
            InvestRent to biuro nieruchomości z Kołobrzegu z wieloletnim doświadczeniem na rynku nadmorskim. Łączymy lokalną wiedzę z profesjonalną obsługą.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'white', padding: '40px 0', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { val: `${s.completed_transactions}+`, label: 'Zrealizowanych transakcji' },
              { val: '4.9/5',  label: 'Ocena klientów' },
              { val: `${s.team_size}`,       label: 'Ekspertów w zespole' },
              { val: 'Kołobrzeg', label: 'Siedziba biura' },
            ].map((st, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '20px', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 36, color: '#0d2a5c', marginBottom: 4 }}>{st.val}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div style={{ padding: '56px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 16 }}>Nasza historia</div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 18, lineHeight: 1.2 }}>Zbudowani na zaufaniu i lokalnej wiedzy</h2>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 16 }}>
                InvestRent Nieruchomości powstało z pasji do lokalnego rynku nadmorskiego i z przekonania, że klienci zasługują na więcej niż standardową obsługę agencyjną.
              </p>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 16 }}>
                Specjalizujemy się w Kołobrzegu i całym Wybrzeżu Bałtyckim — od Mielna przez Dźwirzyno po Rewal. Znamy tutejszy rynek jak własną kieszeń.
              </p>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8 }}>
                Nasza misja jest prosta: przeprowadzić każdego klienta przez transakcję bezpiecznie, skutecznie i bez stresu. Nie znikamy po podpisaniu umowy.
              </p>
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

      {/* Team */}
      <Team members={teamData?.data ?? []} />

      {/* Reviews */}
      <Reviews />

      {/* Office location */}
      <div style={{ background: 'white', padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', marginBottom: 20 }}>Odwiedź nasze biuro</h2>
              {[
                { icon: MapPin, label: 'Adres',          val: 'ul. Ratuszowa 12/1 lok. 3
78-100 Kołobrzeg' },
                { icon: Phone,  label: 'Telefon',        val: '+48 731 554 341' },
                { icon: Mail,   label: 'Email',          val: 'biuro@investrent.com.pl' },
              ].map(c => {
                const Icon = c.icon
                return (
                  <div key={c.label} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, background: '#eff6ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="#1a4fa0" />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 3 }}>{c.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a4fa0', whiteSpace: 'pre-line' }}>{c.val}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ background: '#f0f4ff', borderRadius: 16, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#9ca3af', border: '1px solid #e5e7eb' }}>
              <MapPin size={40} />
              <div style={{ fontWeight: 600, fontSize: 14 }}>Mapa Google Maps</div>
              <div style={{ fontSize: 12 }}>ul. Ratuszowa 12/1 lok. 3, Kołobrzeg</div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
