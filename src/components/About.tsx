import { MapPin, ShieldCheck, Clock, Trophy } from 'lucide-react'

const POINTS = [
  { icon: MapPin,       title: 'Lokalny ekspert',          desc: 'Znamy każdą ulicę Kołobrzegu i okolic. Wiemy które lokalizacje zyskają na wartości.' },
  { icon: ShieldCheck,  title: 'Bezpieczna transakcja',    desc: 'Weryfikujemy stan prawny każdej nieruchomości. Zero niespodzianek po zakupie.' },
  { icon: Clock,        title: 'Odpowiadamy do 60 minut',  desc: 'Żadnego czekania. Kontaktujemy się z każdym klientem tego samego dnia.' },
]

// Jeśli public/about.jpg istnieje – użyj go, w przeciwnym razie Unsplash fallback
const ABOUT_IMG = '/about.jpg'
const ABOUT_FALLBACK = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&fit=crop&h=600'

export default function About() {
  return (
    <section id="o-nas" className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 1024 ? '1fr' : '1fr 1.2fr', gap: '72px', alignItems: 'center' }}
          className="about-grid" style={{ overflow: 'hidden' }}>
          <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
              src={ABOUT_FALLBACK}
              alt="Biuro nieruchomości InvestRent w Kołobrzegu"
              style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 24, left: 24,
              background: 'white', borderRadius: 12, padding: '16px 20px',
              boxShadow: '0 8px 24px rgba(0,0,0,.12)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 44, height: 44, background: '#f5a623', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trophy size={22} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16, color: '#111827' }}>Nr 1</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>biuro nad Bałtykiem</div>
              </div>
            </div>
          </div>
          <div>
            <div className="tag" style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0', marginBottom: 14 }}>O nas</div>
            <h2 className="heading" style={{ fontSize: 32, color: '#0d2a5c', lineHeight: 1.15, marginBottom: 18 }}>
              Nieruchomości nad Bałtykiem — to nasza specjalność
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 16 }}>
              InvestRent to kołobrzeskie biuro nieruchomości z wieloletnim doświadczeniem na rynku nadmorskim. Doskonale znamy lokalne realia — od cen po prawne zawiłości rynku wakacyjnego.
            </p>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 24 }}>
              Naszą misją jest przeprowadzenie klientów przez każdą transakcję bezpiecznie i bez stresu. Nie znikamy po podpisaniu umowy — jesteśmy do dyspozycji przez cały proces i długo po nim.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {POINTS.map(pt => {
                const Icon = pt.icon
                return (
                  <div key={pt.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 30, height: 30, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Icon size={15} color="#1a4fa0" />
                    </div>
                    <div>
                      <strong style={{ fontSize: 13, fontWeight: 700, color: '#0d2a5c', display: 'block', marginBottom: 2 }}>{pt.title}</strong>
                      <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{pt.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
