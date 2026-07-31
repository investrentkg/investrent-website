"use client"
import { useState, useEffect, useRef } from 'react'
import { Search, Handshake, Clock, Star, Award, Home } from 'lucide-react'
import HeroWidget from '@/components/HeroWidget'
import WycenaModal from '@/components/WycenaModal'
import AnimatedCounter from '@/components/AnimatedCounter'
import type { PublicStats } from '@/types'

interface HeroProps {
  stats: PublicStats | null
  googleRating?: number
  googleTotal?: number
}

// Każdy wiersz nagłówka jako lista słów, żeby móc odsłaniać je pojedynczo
// (rozmycie -> ostrość, z narastającym opóźnieniem) zamiast wjeżdżania całego bloku naraz.
// NAPRAWA (audyt webmasterski, Daniel 30.07.2026): H1 to najsilniejszy
// pojedynczy sygnal SEO na calej stronie - poprzednia wersja konczyla sie
// na "nad Baltykiem" (caly region, mniej precyzyjne), bez dokladnej nazwy
// miasta w samym naglowku (byla tylko w malej plakietce nad nim). Przy celu
// "zdominowac wyszukiwania lokalne dla Kolobrzegu" to realna, warta poprawy
// okazja - "w Kolobrzegu" zamiast "nad Baltykiem" jako ostatnia linia.
const HEADLINE_LINES: { words: string[]; gold?: boolean }[] = [
  { words: ['Twoje', 'wymarzone'] },
  { words: ['nieruchomości'], gold: true },
  { words: ['w', 'Kołobrzegu'] },
]

export default function Hero({ stats, googleRating = 4.9, googleTotal = 55 }: HeroProps) {
  const s = { active_offers: stats?.active_offers ?? 30, completed_transactions: Math.max(stats?.completed_transactions ?? 0, 150), team_size: stats?.team_size ?? 7 }
  const [isDesktop, setIsDesktop] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0) // 0 = na górze, 1 = wyscrollowane poza hero
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    const t = setTimeout(() => setMounted(true), 80)

    // Scroll-linked: liczymy postęp przewinięcia WEWNĄTRZ wysokości hero,
    // żeby wideo w tle mogło się delikatnie oddalić/przygasić, a treść
    // "odjechać" lekkim parallaxem, zamiast być statyczną, martwą sekcją.
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1)
          setScrollProgress(progress)
        }
        rafId = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

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

  // Indeks globalny słowa (do wyliczenia narastającego opóźnienia niezależnie od wiersza)
  let wordIndex = -1

  return (
    <section ref={sectionRef} className="relative flex items-center" style={{ minHeight: '620px', padding: '90px 0 96px', overflow: 'hidden' }}>

      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        {/* NAPRAWA (audyt webmasterski, Daniel 30.07.2026): wideo w tle
            wczesniej ladowalo sie ZAWSZE, rowniez na telefonach - realny
            koszt danych/baterii na mobile za niewielka korzysc wizualna
            (male ekrany, czesto tryb oszczedzania danych). Na desktopie
            (isDesktop, próg 1024px - ten sam co reszta strony) wideo dziala
            jak wczesniej; na mobile pokazuje sie TYLKO statyczny hero.jpg
            (ktory i tak byl posterem/tlem tego wideo, wiec brak wizualnej
            "dziury"). Plik wideo tez skompresowany osobno: 2.6MB -> 546KB
            (skalowanie 1920x1080->1280x720, wyzsze CRF, bez audio ktore
            i tak bylo wyciszone). */}
        {isDesktop && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: 'center 35%',
              opacity: videoReady ? 1 : 0,
              transform: `scale(${1 + scrollProgress * 0.09})`,
              filter: `brightness(${1 - scrollProgress * 0.35})`,
              transition: 'opacity 1.2s ease',
            }}
            autoPlay
            muted
            loop
            playsInline
            poster="/hero.jpg"
            onCanPlay={() => setVideoReady(true)}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        )}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/hero.jpg)',
            backgroundPosition: 'center 35%',
            opacity: videoReady ? 0 : 1,
            transform: `scale(${1 + scrollProgress * 0.09})`,
            filter: `brightness(${1 - scrollProgress * 0.35})`,
            transition: 'opacity 1.2s ease',
          }}
        ></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,42,92,.93) 0%, rgba(13,42,92,.85) 30%, rgba(26,79,160,.65) 52%, rgba(13,42,92,.04) 100%), linear-gradient(to bottom, rgba(13,42,92,.68) 0%, transparent 36%, rgba(9,30,64,.70) 100%)' }}></div>
      </div>

      <div
        className="container relative z-10 w-full"
        style={{
          transform: `translateY(${scrollProgress * -36}px)`,
          opacity: 1 - scrollProgress * 0.55,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-16 items-center">

          <div>
            <div className={`tag bg-gold/20 border border-gold/35 text-gold mb-5 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '80ms' }}>
              <Award size={14} /> Kołobrzeg i okolice
            </div>

            <h1 className="heading text-[32px] md:text-[50px] text-white leading-[1.1] mb-5">
              {HEADLINE_LINES.map((line, lineIdx) => (
                <span key={lineIdx} className="block" style={{ overflow: 'visible' }}>
                  {line.words.map((word) => {
                    wordIndex++
                    const delay = 280 + wordIndex * 190
                    return (
                      <span
                        key={word}
                        className={`word-reveal ${line.gold ? 'text-gold' : ''} ${mounted ? 'word-reveal-in' : ''}`}
                        style={{ transitionDelay: `${delay}ms` }}
                      >
                        {word}&nbsp;
                      </span>
                    )
                  })}
                </span>
              ))}
            </h1>

            <p className={`text-white/70 text-[15px] leading-[1.8] max-w-[480px] mb-8 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '1200ms' }}>
              Pomagamy kupować, sprzedawać i wynajmować nieruchomości w Kołobrzegu i okolicach.
              Bezpiecznie, skutecznie i bez stresu — od pierwszego kontaktu po klucze.
            </p>
            <div className={`flex gap-3 mb-8 flex-wrap hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '1380ms' }}>
              <a href="/oferty" className="btn-gold text-[14px] font-bold">
                <Search size={17} /> Szukam nieruchomości
              </a>
              <button type="button" onClick={() => setModalOpen(true)}
                className="cta-pulse inline-flex items-center gap-2 bg-white/12 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl border border-white/28 hover:bg-white/18 transition-all"
                style={{ cursor: 'pointer' }}>
                <Home size={17} /> Chcę sprzedać
              </button>
            </div>
            <div className="flex gap-7 pt-5 border-t border-white/15 flex-wrap">
              {STATS.map((st, i) => {
                const revealDelay = 1600 + i * 300
                return (
                  <div
                    key={st.label}
                    className={`flex items-center gap-2.5 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`}
                    style={{ transitionDelay: `${revealDelay}ms` }}
                  >
                    <span className="text-gold">{st.icon}</span>
                    <div>
                      <div className="font-mont font-black text-white text-[15px]">
                        <AnimatedCounter value={st.val} startDelay={revealDelay + 250} />
                      </div>
                      <div className="text-white/45 text-[10px] uppercase tracking-[.8px]">{st.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <WycenaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          <div className={`hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ display: isDesktop ? 'block' : 'none', transitionDelay: '480ms' }}>
            <HeroWidget />
          </div>

        </div>
      </div>

    </section>
  )
}
