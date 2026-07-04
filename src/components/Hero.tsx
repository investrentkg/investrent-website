"use client"
import { useState, useEffect, useRef } from 'react'
import { Search, Handshake, Clock, Star, Award, Home, ChevronDown } from 'lucide-react'
import HeroWidget from '@/components/HeroWidget'
import WycenaModal from '@/components/WycenaModal'
import AnimatedCounter from '@/components/AnimatedCounter'
import type { PublicStats } from '@/types'

interface HeroProps {
  stats: PublicStats | null
  googleRating?: number
  googleTotal?: number
}

// ═══════════════════════════════════════════════════════════════════════
// HERO — teatralna sekwencja "przypięta" do ekranu na czas dłuższego scrolla
// (klasyczna technika scrollytelling: wysoki kontener + position:sticky w środku).
//
// AKT 1 (progress 0 -> 0.45): ogromny, wyśrodkowany napis na tle wideo latarni.
// PRZEJŚCIE (0.30 -> 0.62): Akt 1 zanika i skaluje się w górę, Akt 2 wjeżdża.
// AKT 2 (progress >= 0.55): normalny układ hero (tekst + wyszukiwarka + statystyki),
//   dokładnie taki, jaki był wcześniej - od tego miejsca strona wraca do zwykłego,
//   funkcjonalnego układu.
// ═══════════════════════════════════════════════════════════════════════

const PIN_HEIGHT_VH = 230 // ile "wysokości ekranu" trwa cała sekwencja, zanim hero "puści"

export default function Hero({ stats, googleRating = 4.8, googleTotal = 55 }: HeroProps) {
  const s = { active_offers: stats?.active_offers ?? 30, completed_transactions: Math.max(stats?.completed_transactions ?? 0, 300), team_size: stats?.team_size ?? 7 }
  const [isDesktop, setIsDesktop] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0) // 0 -> 1 przez całą wysokość PIN_HEIGHT_VH
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    const t = setTimeout(() => setMounted(true), 80)

    let rafId: number | null = null
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const el = wrapperRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const scrollDistance = rect.height - window.innerHeight
          const p = scrollDistance > 0 ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1) : 0
          setProgress(p)
        }
        rafId = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const STATS = [
    { icon: <Handshake size={20} />, val: `${Math.max(s.completed_transactions, 150)}+`, label: 'transakcji' },
    { icon: <Clock size={20} />,     val: 'do 60 min',         label: 'odpowiedź' },
    { icon: <Star size={20} />,      val: `${googleRating}/5`, label: 'ocena klientów' },
    { icon: <Award size={20} />,     val: 'Bezpłatna',         label: 'wycena' },
  ]

  // Pomocnicza funkcja: mapuje progress z zakresu [a,b] na [0,1], z clampem
  const mapRange = (p: number, a: number, b: number) => Math.min(Math.max((p - a) / (b - a), 0), 1)

  const act1Progress = mapRange(progress, 0, 0.42)        // 0->1 w trakcie trwania Aktu 1
  const act1Out = mapRange(progress, 0.28, 0.58)          // 0->1 zanikanie Aktu 1
  const act2In = mapRange(progress, 0.42, 0.72)           // 0->1 wjazd Aktu 2
  const videoScale = 1 + Math.min(progress, 1) * 0.16
  const videoBrightness = 1 - mapRange(progress, 0.3, 0.9) * 0.45

  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: `${PIN_HEIGHT_VH}vh` }}>
      <section className="relative" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ── Tło: wideo latarni, przez CAŁĄ sekwencję (delikatnie się powiększa i przyciemnia) ── */}
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: 'center 35%',
              opacity: videoReady ? 1 : 0,
              transform: `scale(${videoScale})`,
              filter: `brightness(${videoBrightness})`,
              transition: 'opacity 1.2s ease',
            }}
            autoPlay muted loop playsInline poster="/hero.jpg"
            onCanPlay={() => setVideoReady(true)}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/hero.jpg)', backgroundPosition: 'center 35%',
              opacity: videoReady ? 0 : 1,
              transform: `scale(${videoScale})`, filter: `brightness(${videoBrightness})`,
              transition: 'opacity 1.2s ease',
            }}
          ></div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,42,92,.93) 0%, rgba(13,42,92,.85) 30%, rgba(26,79,160,.65) 52%, rgba(13,42,92,.04) 100%), linear-gradient(to bottom, rgba(13,42,92,.68) 0%, transparent 36%, rgba(9,30,64,.70) 100%)' }}></div>
          {/* Dodatkowa, narastająca ciemna nakładka na środek - żeby duży napis Aktu 1 zawsze był czytelny niezależnie od jasnej części zdjęcia (zachód słońca) */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(9,20,45,.55) 0%, rgba(9,20,45,.15) 60%, transparent 100%)', opacity: 1 - act1Out }}></div>
        </div>

        {/* ── AKT 1: ogromny, wyśrodkowany napis (dominuje na starcie, znika przy scrollu) ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
          style={{
            opacity: mounted ? (1 - act1Out) : 0,
            transform: `scale(${1 + act1Out * 0.18}) translateY(${-act1Out * 40}px)`,
            pointerEvents: act1Out > 0.5 ? 'none' : 'auto',
          }}
        >
          <div
            className="tag bg-gold/25 border border-gold/40 text-gold mb-7"
            style={{ opacity: Math.min(act1Progress * 2.2, 1), transform: `translateY(${(1 - Math.min(act1Progress * 2.2, 1)) * 16}px)` }}
          >
            <Award size={14} /> Kołobrzeg i okolice
          </div>
          <h1
            className="heading text-white leading-[1.05]"
            style={{
              fontSize: 'clamp(38px, 7vw, 92px)',
              opacity: Math.min(act1Progress * 1.6, 1),
              transform: `translateY(${(1 - Math.min(act1Progress * 1.6, 1)) * 26}px)`,
              textShadow: '0 4px 40px rgba(0,0,0,.35)',
            }}
          >
            Twoje wymarzone<br />
            <span className="text-gold">nieruchomości</span><br />
            nad Bałtykiem
          </h1>
          <div
            className="flex items-center gap-2 text-white/60 text-[13px] uppercase tracking-[2px] mt-10"
            style={{ opacity: Math.min(Math.max(act1Progress * 2 - 0.6, 0), 1) * (1 - act1Out * 2 > 0 ? 1 : 0) }}
          >
            Przewiń, aby zacząć <ChevronDown size={16} className="animate-bounce" />
          </div>
        </div>

        {/* ── AKT 2: normalny, funkcjonalny układ hero (wjeżdża, zostaje na stałe) ── */}
        <div
          className="container relative z-10 w-full h-full flex items-center"
          style={{
            opacity: act2In,
            transform: `translateY(${(1 - act2In) * 46}px)`,
            pointerEvents: act2In > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-16 items-center w-full">

            <div>
              <div className="tag bg-gold/20 border border-gold/35 text-gold mb-5">
                <Award size={14} /> Kołobrzeg i okolice
              </div>
              <h1 className="heading text-[32px] md:text-[50px] text-white leading-[1.1] mb-5">
                Twoje wymarzone<br />
                <span className="text-gold">nieruchomości</span><br />
                nad Bałtykiem
              </h1>
              <p className="text-white/70 text-[15px] leading-[1.8] max-w-[480px] mb-8">
                Pomagamy kupować, sprzedawać i wynajmować nieruchomości w Kołobrzegu i okolicach.
                Bezpiecznie, skutecznie i bez stresu — od pierwszego kontaktu po klucze.
              </p>
              <div className="flex gap-3 mb-8 flex-wrap">
                <a href="/oferty" className="btn-gold text-[14px] font-bold">
                  <Search size={17} /> Szukam nieruchomości
                </a>
                <button type="button" onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white/12 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl border border-white/28 hover:bg-white/18 transition-all"
                  style={{ cursor: 'pointer' }}>
                  <Home size={17} /> Chcę sprzedać
                </button>
              </div>
              <div className="flex gap-7 pt-5 border-t border-white/15 flex-wrap">
                {STATS.map(st => (
                  <div key={st.label} className="flex items-center gap-2.5">
                    <span className="text-gold">{st.icon}</span>
                    <div>
                      <div className="font-mont font-black text-white text-[15px]">
                        <AnimatedCounter value={st.val} />
                      </div>
                      <div className="text-white/45 text-[10px] uppercase tracking-[.8px]">{st.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <WycenaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <div style={{ display: isDesktop ? 'block' : 'none' }}>
              <HeroWidget />
            </div>

          </div>
        </div>

      </section>
    </div>
  )
}
