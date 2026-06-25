"use client"
import React, { useState } from 'react'
import { Search, Handshake, Clock, Star, Award, Phone, CheckCircle } from 'lucide-react'
import HeroWidget from '@/components/HeroWidget'
import type { PublicStats } from '@/types'

interface HeroProps { stats: PublicStats | null; googleRating?: number; googleTotal?: number }

export default function Hero({ stats, googleRating = 4.8, googleTotal = 55 }: HeroProps) {
  const s = stats ?? { active_offers: 0, completed_transactions: 500, team_size: 6 }

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => { const check = () => setIsDesktop(window.innerWidth >= 1024); check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check) }, [])
  const [tab, setTab]         = useState<'search'|'sell'>('search')
  const [propType, setPropType]   = useState('')
  const [transType, setTransType] = useState('')
  const [city, setCity]           = useState('')
  const [sellName, setSellName]   = useState('')
  const [sellPhone, setSellPhone] = useState('')
  const [sellStatus, setSellStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  function handleSearch() {
    const p = new URLSearchParams()
    if (propType)  p.set('property_type',   propType)
    if (transType) p.set('transaction_type', transType)
    if (city)      p.set('city', city)
    window.location.href = `/oferty${p.toString() ? '?' + p.toString() : ''}`
  }

  async function handleSell() {
    if (!sellPhone) return
    setSellStatus('loading')
    const res = await submitLead({
      full_name: sellName || 'Sprzedający',
      phone: sellPhone,
      source: 'hero_sell',
      client_type: 'seller',
      notes: 'Zgłoszenie ze strony głównej — chcę sprzedać',
    })
    setSellStatus(res?.ok ? 'ok' : 'error')
  }

  const inputCls = "w-full px-4 py-3 rounded-xl text-[13px] text-slate-700 border-0 outline-none"
  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,.95)', fontSize: 13, color: '#374151', width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none', outline: 'none', pointerEvents: 'all', position: 'relative', zIndex: 20, cursor: 'pointer' }

  return (
    <section className="relative flex items-center"
      style={{ minHeight: '620px', padding: '90px 0 96px' }}>

      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.jpg)', backgroundPosition: 'center 35%' }} />
        <div className="absolute inset-0" style={{background: `
          linear-gradient(to right, rgba(13,42,92,.93) 0%, rgba(13,42,92,.85) 30%,
            rgba(26,79,160,.65) 52%, rgba(26,79,160,.32) 68%,
            rgba(13,42,92,.10) 85%, rgba(13,42,92,.04) 100%),
          linear-gradient(to bottom, rgba(13,42,92,.68) 0%, rgba(13,42,92,.10) 16%,
            transparent 36%, transparent 74%, rgba(9,30,64,.40) 88%, rgba(9,30,64,.70) 100%)`}} />
      </div>

      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-16 items-center">
          {/* Lewa kolumna */}
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
              <a href="/oferty" className="btn-gold text-[14px] font-bold">
                <Search size={17} /> Szukam nieruchomości
              </a>
              <a href="/sprzedaz"
                className="inline-flex items-center gap-2 bg-white/12 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl border border-white/28 hover:bg-white/18 transition-all">
                Chcę sprzedać
              </a>
            </div>
            <div className="flex gap-7 pt-5 border-t border-white/15 flex-wrap">
              {[
                { icon: <Handshake size={20} />, val: `${s.completed_transactions}+`, label: 'transakcji' },
                { icon: <Clock size={20} />,     val: 'do 60 min',  label: 'odpowiedź' },
                { icon: <Star size={20} />,      val: `${googleRating}/5`,  label: 'ocena klientów' },
                { icon: <Award size={20} />,     val: 'Bezpłatna',  label: 'wycena' },
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

                    {/* Widget — JS visibility zamiast Tailwind (Tailwind responsive nie działa w prod) */}
          <div style={{ display: isDesktop ? 'block' : 'none' }}>
            <HeroWidget />
          </div>
        </div>
      </div>
    </section>