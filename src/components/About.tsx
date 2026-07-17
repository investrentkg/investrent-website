"use client"
import { useState, useEffect } from 'react'
import { MapPin, ShieldCheck, Clock, Trophy } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

const POINTS = [
  { icon: MapPin,       title: 'Lokalny ekspert',          desc: 'Znamy każdą ulicę Kołobrzegu i okolic. Wiemy które lokalizacje zyskają na wartości.' },
  { icon: ShieldCheck,  title: 'Bezpieczna transakcja',    desc: 'Weryfikujemy stan prawny każdej nieruchomości. Zero niespodzianek po zakupie.' },
  { icon: Clock,        title: 'Odpowiadamy do 60 minut',  desc: 'Żadnego czekania. Kontaktujemy się z każdym klientem tego samego dnia.' },
]

const IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&fit=crop&h=600'

export default function About() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section id="o-nas" className="section">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1.2fr' : '1fr',
          gap: isDesktop ? '72px' : '32px',
          alignItems: 'center',
        }}>

          {/* Zdjęcie */}
          <ScrollReveal>
          <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
            <img
              src={IMG}
              alt="Biuro nieruchomości InvestRent w Kołobrzegu"
              style={{ width: '100%', height: isDesktop ? 500 : 280, objectFit: 'cover', display: 'block' }}
            />
            <ScrollReveal delay={280} style={{ position: 'absolute', bottom: 24, left: 24 }}>
            <div style={{
              background: 'white', borderRadius: 12, padding: '16px 20px',
              boxShadow: '0 8px 24px rgba(0,0,0,.12)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 44, height: 44, background: '#f5a623', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trophy size={22} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16, color: '#0d2a5c' }}>4.9/5</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>ocena klientów (Google)</div>
              </div>
            </div>
            </ScrollReveal>
          </div>
          </ScrollReveal>

          {/* Tekst */}
          <div>
            <div className="tag" style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0', marginBottom: 16 }}>
              O nas
            </div>
            <h2 className="heading" style={{ fontSize: isDesktop ? 32 : 26, color: '#0d2a5c', lineHeight: 1.15, marginBottom: 16 }}>
              Nieruchomości nad Bałtykiem&nbsp;— to nasza specjalność
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 16 }}>
              InvestRent to kołobrzeskie biuro nieruchomości z wieloletnim doświadczeniem na rynku nadmorskim. Doskonale znamy lokalne realia — od cen po prawne zawiłości rynku wakacyjnego.
            </p>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 24 }}>
              Naszą misją jest przeprowadzenie klientów przez każdą transakcję bezpiecznie i bez stresu. Nie znikamy po podpisaniu umowy — jesteśmy do dyspozycji przez cały proces i długo po nim.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {POINTS.map((pt, i) => {
                const Icon = pt.icon
                return (
                  <ScrollReveal key={pt.title} delay={i * 120}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, background: 'rgba(26,79,160,.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="#1a4fa0" />
                    </div>
                    <div>
                      <strong style={{ fontSize: 13, fontWeight: 700, color: '#0d2a5c', display: 'block', marginBottom: 2 }}>{pt.title}</strong>
                      <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{pt.desc}</span>
                    </div>
                  </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
