"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TeamMember } from '@/types'

const BADGE_LABEL: Record<string, string> = { manager: 'Management', agent: 'Agent', superadmin: 'Admin' }
interface Props { members: TeamMember[] }

export default function Team({ members }: Props) {
  // NAPRAWA (Daniel 31.07, prewencyjnie po tym samym błędzie w karuzeli
  // ofert): ten sam mechanizm co tam - natywne przewijanie (scroll-snap)
  // zamiast recznie liczonego w JS transform: translateX. Eliminuje cala
  // klase bledow (puste kolumny, "zablokowany" pasek) u zrodla.
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [perView, setPerView] = useState(4.3)
  useEffect(() => {
    const update = () => setPerView(window.innerWidth <= 700 ? 1.5 : window.innerWidth < 1024 ? 2.3 : 4.3)
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
  const maxSlide = Math.max(0, Math.ceil(displayMembers.length - perView))

  function scrollToIndex(i: number) {
    const el = scrollerRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(maxSlide, i))
    const card = el.children[0] as HTMLElement | undefined
    if (!card) return
    const cardWidth = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 20)
    el.scrollTo({ left: clamped * cardWidth, behavior: 'smooth' })
  }

  function handleScroll() {
    const el = scrollerRef.current
    if (!el || !el.children[0]) return
    const cardWidth = (el.children[0] as HTMLElement).getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 20)
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
      <div className="container">
        <h2 className="heading text-[30px] text-navy mb-2.5" style={{ fontSize: 'clamp(25px, 3.4vw, 30px)' }}>Eksperci, którym możesz zaufać</h2>
        <p style={{ color: '#5a6680', fontSize: 15 }}>
          Każdy klient ma przydzielonego opiekuna prowadzącego przez całą transakcję.
        </p>

        {/* Karuzela zespołu (makieta M3): okrągłe zdjęcia 1:1, wszyscy z API w kolejności ze źródła, przewijanie natywne (scroll-snap) */}
        <div ref={scrollerRef} onScroll={handleScroll} onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}
          className="m3-team" role="region" aria-label="Zespół InvestRent" tabIndex={0}>
          {displayMembers.map(m => (
            <Link key={m.id} href={m.offer_count ? `/oferty?agent_id=${m.id}` : '/oferty'} className="m3-mem">
              <div className="m3-pic">
                {m.avatar_url ? (
                  <div className="img">
                    <Image src={m.avatar_url} alt={m.full_name} fill unoptimized
                      style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="128px" />
                  </div>
                ) : (
                  <div className="ini" aria-hidden="true">
                    {m.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                {(m.offer_count ?? 0) > 0 && (
                  <span className="m3-ofc" aria-label={`${m.offer_count} ofert`}>
                    {m.offer_count}
                    <small>OFERT</small>
                  </span>
                )}
              </div>
              <b>{m.full_name}</b>
              <span className="role">{m.role_label}</span>
              {m.specialization && <span className="role" style={{ marginTop: -6 }}>{m.specialization}</span>}
              <span className="bdg">{BADGE_LABEL[m.role] ?? 'Agent'}</span>
            </Link>
          ))}
        </div>

        {displayMembers.length > perView && (
          <div className="m3-car-nav">
            <button type="button" className="m3-car-b" onClick={() => scrollToIndex(cur - 1)} disabled={cur === 0} aria-label="Poprzedni">
              <ChevronLeft size={18} />
            </button>
            <div className="m3-car-dots">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button type="button" key={i} onClick={() => scrollToIndex(i)} aria-label={`Pokaż osoby od ${i + 1}`} aria-current={i === cur}>
                  <span />
                </button>
              ))}
            </div>
            <button type="button" className="m3-car-b" onClick={() => scrollToIndex(cur + 1)} disabled={cur === maxSlide} aria-label="Następny">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
