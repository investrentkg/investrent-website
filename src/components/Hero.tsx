"use client"
import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import HeroSearch from '@/components/HeroSearch'
import { RESPONSE_BADGE } from '@/lib/responseTime'
import type { PublicStats } from '@/types'

interface HeroProps {
  stats: PublicStats | null
  // ZMIANA (03.10.2026): null/brak = brak wiarygodnej, swiezej oceny
  // (patrz src/lib/schemaRating.ts) - kafelek z ocena jest wtedy ukrywany
  // zamiast pokazywac sztywne "4.9/5".
  googleRating?: number | null
  // Liczba opinii z TEGO SAMEGO obiektu getVerifiedRating co ocena i JSON-LD (jedno źródło).
  // null = ocena i liczba w ogóle się nie pokazują.
  googleTotal?: number | null
}

// Każdy wiersz nagłówka jako lista słów, żeby móc odsłaniać je pojedynczo
// (rozmycie -> ostrość, z narastającym opóźnieniem) zamiast wjeżdżania całego bloku naraz.
// NAPRAWA (audyt webmasterski, Daniel 30.07.2026): H1 to najsilniejszy
// pojedynczy sygnal SEO na calej stronie - poprzednia wersja konczyla sie
// na "nad Baltykiem" (caly region, mniej precyzyjne), bez dokladnej nazwy
// miasta w samym naglowku (byla tylko w malej plakietce nad nim). Przy celu
// "zdominowac wyszukiwania lokalne dla Kolobrzegu" to realna, warta poprawy
// okazja - "w Kolobrzegu" zamiast "nad Baltykiem" jako ostatnia linia.
//
// ZMIANA (24.09.2026, paczka SEO - diagnoza pozycji): H1 nie zawieral slowa
// "biuro" (fraza "biuro nieruchomosci kolobrzeg" byla tylko w title/meta).
// Teraz H1 = "Biuro nieruchomości w Kołobrzegu" (te same 3 wiersze i ten sam
// zloty akcent co wczesniej, wiec uklad/animacja bez zmian). Dotychczasowy,
// bardziej emocjonalny przekaz ("Twoje wymarzone nieruchomosci") zostaje w
// tekscie pod naglowkiem.
const HEADLINE_LINES: { words: string[]; gold?: boolean }[] = [
  { words: ['Biuro', 'nieruchomości', 'w', 'Kołobrzegu'] },
]

export default function Hero({ stats, googleRating = null, googleTotal = null }: HeroProps) {
  const s = { active_offers: stats?.active_offers ?? 30, completed_transactions: Math.max(stats?.completed_transactions ?? 0, 150), team_size: stats?.team_size ?? 7 }
  const [isDesktop, setIsDesktop] = useState(false)
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

  // Jeden pasek zaufania (makieta M3): 150+ transakcji, ocena i liczba opinii z JEDNEGO źródła
  // (getVerifiedRating), czas kontaktu. Brak wiarygodnych danych oceny = ocena się nie pokazuje.
  const showRating = !!googleRating && !!googleTotal
  const ratingText = googleRating ? googleRating.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : ''

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
          className="absolute inset-0 bg-cover bg-center hero-bg"
          style={{
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
        <div>

          <div>
            <div className={`text-gold mb-5 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '80ms', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
              Kołobrzeg i okolice
            </div>

            <h1 className="heading m3-h1 text-[25px] min-[480px]:text-[32px] md:text-[52px] text-white leading-[1.08] mb-5" style={{ maxWidth: 700, letterSpacing: -1 }}>
              {HEADLINE_LINES.map((line, lineIdx) => (
                <span key={lineIdx} style={{ display: 'flex', flexWrap: 'wrap', overflow: 'visible' }}>
                  {line.words.map((word) => {
                    wordIndex++
                    const delay = 280 + wordIndex * 190
                    return (
                      <span
                        key={word}
                        className={`word-reveal ${mounted ? 'word-reveal-in' : ''}`}
                        style={{ transitionDelay: `${delay}ms` }}
                      >
                        {word}&nbsp;
                      </span>
                    )
                  })}
                </span>
              ))}
            </h1>

            <p className={`text-white/90 text-[16px] md:text-[17px] leading-[1.7] max-w-[560px] mb-7 hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '1200ms' }}>
              Pomagamy kupować, sprzedawać i <a href="/wynajem" className="text-white underline underline-offset-2 hover:text-gold">wynajmować</a> nieruchomości
              nad Bałtykiem. Bezpiecznie, skutecznie i bez stresu — od pierwszego kontaktu po klucze.
            </p>
            <div className={`m3-hero-ctas hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '1380ms' }}>
              <a href="/wycena" className="btn-gold text-[15px] font-extrabold" style={{ minHeight: 48 }}>
                Bezpłatna wycena
              </a>
              <a href="tel:+48731554341" className="m3-btn-ghost">
                Zadzwoń 731 554 341
              </a>
            </div>
            <div className={`hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '1500ms' }}>
              <HeroSearch />
              <a href="/kolobrzeg" className="m3-seo">Poznaj rynek nieruchomości w Kołobrzegu →</a>
            </div>
            <div className={`m3-trust hero-reveal ${mounted ? 'hero-reveal-in' : ''}`} style={{ transitionDelay: '1700ms' }}>
              <span className="m3-stat"><b>{Math.max(s.completed_transactions, 150)}+</b><small>transakcji</small></span>
              {showRating && (
                <>
                  <span>{ratingText} <Star size={15} fill="#f5a623" color="#f5a623" aria-hidden="true" /></span>
                  <span>{googleTotal} opinii w Google</span>
                </>
              )}
              <span>kontakt {RESPONSE_BADGE}</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
