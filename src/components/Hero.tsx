"use client"
import { useState, useEffect } from 'react'
import { Search, Handshake, Clock, Star, Award, Home } from 'lucide-react'
import HeroWidget from '@/components/HeroWidget'
import WycenaModal from '@/components/WycenaModal'
import type { PublicStats } from '@/types'

interface HeroProps {
  stats: PublicStats | null
  googleRating?: number
  googleTotal?: number
}

export default function Hero({ stats, googleRating = 4.8, googleTotal = 55 }: HeroProps) {
  const s = { active_offers: stats?.active_offers ?? 30, completed_transactions: Math.max(stats?.completed_transactions ?? 0, 300), team_size: stats?.team_size ?? 7 }
  const [isDesktop, setIsDesktop] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    // Uruchamia sekwencję animacji wejścia zaraz po zamontowaniu (niezależnie od wideo,
    // żeby tekst nie czekał na załadowanie klipu na wolniejszych łączach)
    const t = setTimeout(() => setMounted(true), 80)
    return () => { window.removeEventListener('resize', check); clearTimeout(t) }
  }, [])

  const STATS = [
    { icon: <Handshake size={20} />, val: `${Math.max(s.completed_transactions, 150)}+`, label: 'transakcji' },
    { icon: <Clock size={20} />,     val: 'do 60 min',         label: 'odpowiedź' },
    { icon: <Star size={20} />,      val: `${googleRating}/5`, label: 'ocena klientów' },
    { icon: <Award size={20} />,     val: 'Bezpłatna',         label: 'wycena' },
  ]

  return (
    <section className="relative flex items-center" style={{ minHeight: '620px', padding: '90px 0 96px' }}>

      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 35%', opacity: videoReady ? 1 : 0, transition: 'opacity 1.2s ease' }}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero.jpg"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Statyczne zdjęcie jako natychmiastowy fallback, zanim wideo się załaduje/jeśli się nie uda */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero.jpg)', backgroundPosition: 'center 35%', opacity: videoReady ? 0 : 1, transition: 'opacity 1.2s ease' }}
        ></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,42,92,.93) 0%, rgba(13,42,92,.85) 30%, rgba(26,79,160,.65) 52%, rgba(13,42,92,.04) 100%), linear-gradient(to bottom, rgba(13,42,92,.68) 0%, transparent 36%, rgba(9,30,64,.70) 100%)' }}></div>
      </div>

      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-16 items-center">

          <div>
            <div className={`tag bg-gold/20 border border-gold/35 text-gold mb-5 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '80ms' }}>
              <Award size={14} /> Kołobrzeg i okolice
            </div>
            <h1 className={`heading text-[32px] md:text-[50px] text-white leading-[1.1] mb-5 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '200ms' }}>
              Twoje wymarzone<br />
              <span className="text-gold">nieruchomości</span><br />
              nad Bałtykiem
            </h1>
            <p className={`text-white/70 text-[15px] leading-[1.8] max-w-[480px] mb-8 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '340ms' }}>
              Pomagamy kupować, sprzedawać i wynajmować nieruchomości w Kołobrzegu i okolicach.
              Bezpiecznie, skutecznie i bez stresu — od pierwszego kontaktu po klucze.
            </p>
            <div className={`flex gap-3 mb-8 flex-wrap hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '460ms' }}>
              <a href="/oferty" className="btn-gold text-[14px] font-bold">
                <Search size={17} /> Szukam nieruchomości
              </a>
              <button type="button" onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white/12 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl border border-white/28 hover:bg-white/18 transition-all"
                style={{ cursor: 'pointer' }}>
                <Home size={17} /> Chcę sprzedać
              </button>
            </div>
            <div className={`flex gap-7 pt-5 border-t border-white/15 flex-wrap hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '580ms' }}>
              {STATS.map(st => (
                <div key={st.label} className="flex items-center gap-2.5">
                  <span className="text-gold">{st.icon}</span>
                  <div>
                    <div className="font-mont font-black text-white text-[15px]">{st.val}</div>
                    <div className="text-white/45 text-[10px] uppercase tracking-[.8px]">{st.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <WycenaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          <div className={`hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ display: isDesktop ? 'block' : 'none', transitionDelay: '340ms' }}>
            <HeroWidget />
          </div>

        </div>
      </div>

    </section>
  )
}
