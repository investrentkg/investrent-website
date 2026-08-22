"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TeamMember } from '@/types'
import ScrollReveal from '@/components/ScrollReveal'

const BADGE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  manager:    { bg: 'bg-amber-100',   text: 'text-amber-800',   label: 'Management' },
  agent:      { bg: 'bg-blue/8',      text: 'text-blue',        label: 'Agent' },
  superadmin: { bg: 'bg-slate-100',   text: 'text-slate-600',   label: 'Admin' },
}
const AVATAR_GRADIENT: string[] = [
  'from-blue to-navy',
  'from-gold to-amber-500',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-red-500 to-red-700',
  'from-sky-500 to-sky-700',
]

interface Props { members: TeamMember[] }

export default function Team({ members }: Props) {
  // NAPRAWA (Daniel 31.07, prewencyjnie po tym samym błędzie w karuzeli
  // ofert): ten sam mechanizm co tam - natywne przewijanie (scroll-snap)
  // zamiast recznie liczonego w JS transform: translateX. Eliminuje cala
  // klase bledow (puste kolumny, "zablokowany" pasek) u zrodla.
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [perView, setPerView] = useState(3)
  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const FALLBACK_MEMBERS: TeamMember[] = [
    { id: 'f1', full_name: 'Daniel Kamiński', role: 'manager', role_label: 'Właściciel', avatar_url: null, bio: 'Założyciel i właściciel InvestRent. Wieloletni specjalista rynku nieruchomości nadmorskich — Kołobrzeg i okolice.', specialization: 'Zarządzanie i inwestycje' },
    { id: 'f2', full_name: 'Dawid Sadownik', role: 'manager', role_label: 'Właściciel', avatar_url: null, bio: 'Współwłaściciel InvestRent, odpowiedzialny za rozwój firmy i strategię działania.', specialization: 'Zarządzanie i rozwój' },
    { id: 'f3', full_name: 'Weronika Skwarek', role: 'manager', role_label: 'Manager', avatar_url: null, bio: 'Zarządza codzienną pracą biura, marketingiem i obecnością InvestRent na portalach nieruchomości.', specialization: 'Marketing i operacje' },
    { id: 'f4', full_name: 'Marta Semak', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Doświadczona agentka specjalizująca się w sprzedaży mieszkań i apartamentów. Znana z zaangażowania i skuteczności.', specialization: 'Sprzedaż mieszkań' },
    { id: 'f5', full_name: 'Tomasz Rybiński', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Specjalista od nieruchomości komercyjnych i inwestycyjnych. Bogate doświadczenie w obsłudze wymagających klientów.', specialization: 'Nieruchomości inwestycyjne' },
    { id: 'f6', full_name: 'Ernest Podhajski', role: 'agent', role_label: 'Koordynator', avatar_url: null, bio: 'Koordynuje pracę zespołu i dba o sprawną obsługę transakcji od pierwszego kontaktu po finalizację umowy.', specialization: 'Koordynacja transakcji' },
    { id: 'f7', full_name: 'Dagmara Kotarba', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Ekspertka rynku nadmorskiego — specjalizuje się w nieruchomościach premium i apartamentach inwestycyjnych.', specialization: 'Nieruchomości premium' },
    { id: 'f8', full_name: 'Julia Semak', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Zajmuje się obsługą klientów szukających mieszkań i domów. Szybka, komunikatywna i zawsze pomocna.', specialization: 'Mieszkania i domy' },
    { id: 'f9', full_name: 'Sara Kida', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Młody i dynamiczny agent z pasją do rynku nieruchomości. Specjalizuje się w obsłudze klientów indywidualnych.', specialization: 'Obsługa klientów indywidualnych' },
  ]
  const displayMembers = members.length > 0 ? members : FALLBACK_MEMBERS
  const maxSlide = Math.max(0, displayMembers.length - perView)

  function scrollToIndex(i: number) {
    const el = scrollerRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(maxSlide, i))
    const card = el.children[0] as HTMLElement | undefined
    if (!card) return
    const cardWidth = card.getBoundingClientRect().width + 20 // + gap (gap-5 = 20px)
    el.scrollTo({ left: clamped * cardWidth, behavior: 'smooth' })
  }

  function handleScroll() {
    const el = scrollerRef.current
    if (!el || !el.children[0]) return
    const cardWidth = (el.children[0] as HTMLElement).getBoundingClientRect().width + 20
    if (cardWidth <= 0) return
    setCur(Math.round(el.scrollLeft / cardWidth))
  }

  // Auto-przewijanie co 3 sekundy
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCur(c => {
        const next = c >= maxSlide ? 0 : c + 1
        scrollToIndex(next)
        return next
      })
    }, 3000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [maxSlide, displayMembers.length, perView])

  // Zatrzymaj na hover
  function pauseAuto() { if (timerRef.current) clearInterval(timerRef.current) }
  function resumeAuto() {
    timerRef.current = setInterval(() => {
      setCur(c => {
        const next = c >= maxSlide ? 0 : c + 1
        scrollToIndex(next)
        return next
      })
    }, 3000)
  }
  return (
    <section id="zespol" className="section section-alt">
      <style jsx>{`
        .team-scroller::-webkit-scrollbar { display: none; }
        .team-scroller { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div className="container">
        <div className="text-center mb-10">
          <div className="tag bg-blue/8 text-blue mb-3">Nasz zespół</div>
          <h2 className="heading text-[30px] text-navy mb-2.5">Eksperci, którym możesz zaufać</h2>
          <p className="text-slate-500 text-[14px] max-w-lg mx-auto">
            Każdy klient ma przydzielonego opiekuna prowadzącego przez całą transakcję.
          </p>
        </div>

        <div ref={scrollerRef} onScroll={handleScroll} onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}
          className="team-scroller flex gap-5"
          style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
            {displayMembers.map((m, idx) => {
              const b = BADGE_STYLE[m.role] ?? BADGE_STYLE.agent
              const grad = AVATAR_GRADIENT[idx % AVATAR_GRADIENT.length]
              return (
                <ScrollReveal key={m.id} delay={(idx % perView) * 110} style={{ flexShrink: 0, scrollSnapAlign: 'start' as const, width: `calc(${100 / perView}% - ${(perView - 1) * 20 / perView}px)` }}>
                <Link href={m.offer_count ? `/oferty?agent_id=${m.id}` : '/oferty'}
                  style={{ textDecoration: 'none', display: 'block' }}>
              <div className="bg-white rounded-2xl border border-slate-200 p-7 text-center hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer h-full">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      {m.avatar_url ? (
                        <Image src={m.avatar_url} alt={m.full_name} fill
                          className="rounded-full object-cover shadow-md" sizes="128px" />
                      ) : (
                        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center shadow-md`}>
                          <span className="font-mont font-black text-[40px] text-white">
                            {m.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      )}
                      {(m.offer_count ?? 0) > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full bg-orange-500 border-4 border-white shadow-md flex flex-col items-center justify-center leading-none">
                          <span className="text-white font-black text-[15px]">{m.offer_count}</span>
                          <span className="text-white font-bold text-[7px] tracking-wide">OFERT</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[15px] font-bold text-slate-900 mb-1">{m.full_name}</div>
                    <div className="text-[12px] text-slate-500 mb-2 leading-[1.5]">{m.role_label}</div>
                    {m.specialization && (
                      <div className="text-[11px] text-slate-400 mb-3">{m.specialization}</div>
                    )}
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-md ${b.bg} ${b.text}`}>
                      {b.label}
                    </span>
                  </div>
                </Link>
                </ScrollReveal>
              )
            })}
        </div>

        {displayMembers.length > perView && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => scrollToIndex(cur - 1)} disabled={cur === 0} aria-label="Poprzedni"
              className="w-9 h-9 rounded-full border-[1.5px] border-slate-200 flex items-center justify-center hover:border-blue hover:text-blue transition-all disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <div key={i} onClick={() => scrollToIndex(i)} role="button"
                  style={{
                    display: 'inline-block',
                    width: i === cur ? 22 : 8,
                    height: 8,
                    borderRadius: i === cur ? 4 : 50,
                    background: i === cur ? '#1a4fa0' : '#d1d5db',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    flexShrink: 0,
                    transition: 'width .25s, background .25s',
                  }} />
              ))}
            </div>
            <button onClick={() => scrollToIndex(cur + 1)} disabled={cur === maxSlide} aria-label="Następny"
              className="w-9 h-9 rounded-full border-[1.5px] border-slate-200 flex items-center justify-center hover:border-blue hover:text-blue transition-all disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}