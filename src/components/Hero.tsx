"use client"
import { Search, Home, Handshake, Clock, Star, Award } from 'lucide-react'
import type { PublicStats } from '@/types'

interface HeroProps { stats: PublicStats | null }

export default function Hero({ stats }: HeroProps) {
  const s = stats ?? { active_offers: 0, completed_transactions: 500, team_size: 6 }

  return (
    <section className="relative overflow-hidden flex items-center"
      style={{ minHeight: '620px', padding: '90px 0 96px' }}>

      {/* Background photo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.jpg)', backgroundPosition: 'center 35%' }} />
        {/* Gradient fog overlay */}
        <div className="absolute inset-0" style={{background: `
          linear-gradient(to right, rgba(13,42,92,.93) 0%, rgba(13,42,92,.85) 30%,
            rgba(26,79,160,.65) 52%, rgba(26,79,160,.32) 68%,
            rgba(13,42,92,.10) 85%, rgba(13,42,92,.04) 100%),
          linear-gradient(to bottom, rgba(13,42,92,.68) 0%, rgba(13,42,92,.10) 16%,
            transparent 36%, transparent 74%, rgba(9,30,64,.40) 88%, rgba(9,30,64,.70) 100%)`}} />
      </div>

      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-16 items-center">
          <div>
            <div className="tag bg-gold/20 border border-gold/35 text-gold mb-5">
              <Award size={14} /> Kołobrzeg i okolice
            </div>
            <h1 className="heading text-[50px] text-white leading-[1.08] mb-5">
              Twoje wymarzone<br />
              <span className="text-gold">nieruchomości</span><br />
              nad Bałtykiem
            </h1>
            <p className="text-white/70 text-[15px] leading-[1.8] max-w-[480px] mb-8">
              Pomagamy kupować, sprzedawać i wynajmować nieruchomości w Kołobrzegu i okolicach.
              Bezpiecznie, skutecznie i bez stresu — od pierwszego kontaktu po klucze.
            </p>
            <div className="flex gap-3 mb-8 flex-wrap">
              <a href="#oferty" className="btn-gold text-[14px] font-bold">
                <Search size={17} /> Szukam nieruchomości
              </a>
              <a href="#kontakt"
                className="inline-flex items-center gap-2 bg-white/12 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl border border-white/28 hover:bg-white/18 transition-all">
                Chcę sprzedać
              </a>
            </div>
            <div className="flex gap-7 pt-5 border-t border-white/15 flex-wrap">
              {[
                { icon: <Handshake size={20} />, val: `${s.completed_transactions}+`, label: 'transakcji' },
                { icon: <Clock size={20} />,     val: 'do 60 min',       label: 'odpowiedź' },
                { icon: <Star size={20} />,      val: '4.9/5',           label: 'ocena klientów' },
                { icon: <Award size={20} />,val: 'Bezpłatna',       label: 'wycena' },
              ].map(st => (
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

          {/* Search widget */}
          <div className="hidden lg:block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-7">
            <div className="flex bg-black/25 rounded-xl p-1 mb-5">
              <button className="flex-1 bg-white text-blue text-[13px] font-semibold rounded-[10px] py-2.5 flex items-center justify-center gap-1.5">
                <Search size={13} /> Szukam
              </button>
              <button className="flex-1 text-white/50 text-[13px] font-medium py-2.5 flex items-center justify-center gap-1.5">
                Chcę sprzedać
              </button>
            </div>
            {['Mieszkanie', 'Kupno'].map(v => (
              <div key={v} className="flex justify-between items-center bg-white/95 rounded-xl px-4 py-3 mb-2.5 text-[13px] text-slate-700 cursor-pointer">
                {v} <span className="text-slate-400">▾</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-white/95 rounded-xl px-4 py-3 mb-2.5 text-[13px] text-slate-400">
              Lokalizacja — np. Kołobrzeg, Mielno…
            </div>
            <a href="#oferty" className="btn-gold w-full justify-center text-[14px]">
              <Search size={16} /> Szukaj ofert
            </a>
            <p className="text-white/40 text-[11px] text-center mt-2">lub zadzwoń — oddzwonimy do 60 min</p>
          </div>
        </div>
      </div>
    </section>
  )
}
