"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TeamMember } from '@/types'

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
  const [cur, setCur] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-przewijanie co 3 sekundy
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCur(c => c >= maxSlide ? 0 : c + 1)
    }, 3000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [maxSlide])

  // Zatrzymaj na hover
  function pauseAuto() { if (timerRef.current) clearInterval(timerRef.current) }
  function resumeAuto() {
    timerRef.current = setInterval(() => {
      setCur(c => c >= maxSlide ? 0 : c + 1)
    }, 3000)
  }
  const perView = 3

  const FALLBACK_MEMBERS: TeamMember[] = [
    { id: 'f1', full_name: 'Daniel Kamiński', role: 'manager', role_label: 'Manager', avatar_url: null, bio: 'Założyciel i właściciel InvestRent. Wieloletni specjalista rynku nieruchomości nadmorskich — Kołobrzeg i okolice.', specialization: 'Zarządzanie i inwestycje' },
    { id: 'f2', full_name: 'Marta Semak', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Doświadczona agentka specjalizująca się w sprzedaży mieszkań i apartamentów. Znana z zaangażowania i skuteczności.', specialization: 'Sprzedaż mieszkań' },
    { id: 'f3', full_name: 'Tomasz Rybiński', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Specjalista od nieruchomości komercyjnych i inwestycyjnych. Bogate doświadczenie w obsłudze wymagających klientów.', specialization: 'Nieruchomości inwestycyjne' },
    { id: 'f4', full_name: 'Ernest Podhajski', role: 'agent', role_label: 'Koordynator', avatar_url: null, bio: 'Koordynuje pracę zespołu i dba o sprawną obsługę transakcji od pierwszego kontaktu po finalizację umowy.', specialization: 'Koordynacja transakcji' },
    { id: 'f5', full_name: 'Dagmara Kotarba', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Ekspertka rynku nadmorskiego — specjalizuje się w nieruchomościach premium i apartamentach inwestycyjnych.', specialization: 'Nieruchomości premium' },
    { id: 'f6', full_name: 'Julia Semak', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Zajmuje się obsługą klientów szukających mieszkań i domów. Szybka, komunikatywna i zawsze pomocna.', specialization: 'Mieszkania i domy' },
    { id: 'f7', full_name: 'Sara Kida', role: 'agent', role_label: 'Agent nieruchomości', avatar_url: null, bio: 'Młody i dynamiczny agent z pasją do rynku nieruchomości. Specjalizuje się w obsłudze klientów indywidualnych.', specialization: 'Obsługa klientów indywidualnych' },
  ]
  const displayMembers = members.length > 0 ? members : FALLBACK_MEMBERS
  const maxSlide = Math.max(0, displayMembers.length - perView)

  return (
    <section id="zespol" className="section section-alt">
      <div className="container">
        <div className="text-center mb-10">
          <div className="tag bg-blue/8 text-blue mb-3">Nasz zespół</div>
          <h2 className="heading text-[30px] text-navy mb-2.5">Eksperci, którym możesz zaufać</h2>
          <p className="text-slate-500 text-[14px] max-w-lg mx-auto">
            Każdy klient ma przydzielonego opiekuna prowadzącego przez całą transakcję.
          </p>
        </div>

        <div className="overflow-hidden">
          <div className="flex gap-5 transition-transform duration-500"
            style={{ transform: `translateX(-${cur * (100 / perView + 20 / displayMembers.length)}%)` }}>
            {displayMembers.map((m, idx) => {
              const b = BADGE_STYLE[m.role] ?? BADGE_STYLE.agent
              const grad = AVATAR_GRADIENT[idx % AVATAR_GRADIENT.length]
              return (
                <div key={m.id}
                  className="bg-white rounded-2xl border border-slate-200 p-7 text-center hover:-translate-y-0.5 transition-all flex-shrink-0"
                  style={{ width: `calc(${100 / perView}% - ${(perView - 1) * 20 / perView}px)` }}>
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {m.avatar_url ? (
                      <Image src={m.avatar_url} alt={m.full_name} fill
                        className="rounded-full object-cover shadow-md" sizes="80px" />
                    ) : (
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center shadow-md`}>
                        <span className="font-mont font-black text-[26px] text-white">
                          {m.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[15px] font-bold text-slate-900 mb-1">{m.full_name}</div>
                  <div className="text-[12px] text-slate-500 mb-3 leading-[1.5]">{m.role_label}</div>
                  {m.specialization && (
                    <div className="text-[11px] text-slate-400 mb-3">{m.specialization}</div>
                  )}
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-md ${b.bg} ${b.text}`}>
                    {b.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {displayMembers.length > perView && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0}
              className="w-9 h-9 rounded-full border-[1.5px] border-slate-200 flex items-center justify-center hover:border-blue hover:text-blue transition-all disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button key={i} onClick={() => setCur(i)}
                  className={`carousel-dot ${i === cur ? 'active' : ''}`} />
              ))}
            </div>
            <button onClick={() => setCur(c => Math.min(maxSlide, c + 1))} disabled={cur === maxSlide}
              className="w-9 h-9 rounded-full border-[1.5px] border-slate-200 flex items-center justify-center hover:border-blue hover:text-blue transition-all disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
