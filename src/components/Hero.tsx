"use client"
import { useState } from 'react'
import { Search, Handshake, Clock, Star, Award, Phone, CheckCircle } from 'lucide-react'
import { submitLead } from '@/lib/api'
import type { PublicStats } from '@/types'

const SEL_STYLE = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
  background: 'rgba(255,255,255,.95)', fontSize: 13, color: '#374151',
  cursor: 'pointer', outline: 'none', appearance: 'none' as const,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%236b7280\' d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
}
const INP_STYLE = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
  background: 'rgba(255,255,255,.95)', fontSize: 13, color: '#374151',
  outline: 'none',
}

interface HeroProps { stats: PublicStats | null }

export default function Hero({ stats }: HeroProps) {
  const s = stats ?? { active_offers: 0, completed_transactions: 500, team_size: 6 }

  const [tab, setTab] = useState<'search'|'sell'>('search')

  // Zakładka Szukam
  const [propType, setPropType]   = useState('')
  const [transType, setTransType] = useState('')
  const [city, setCity]           = useState('')

  // Zakładka Sprzedaj
  const [sellName, setSellName]   = useState('')
  const [sellPhone, setSellPhone] = useState('')
  const [sellStatus, setSellStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  function handleSearch() {
    const params = new URLSearchParams()
    if (propType)  params.set('property_type', propType)
    if (transType) params.set('transaction_type', transType)
    if (city)      params.set('city', city)
    window.location.href = `/oferty${params.toString() ? '?' + params.toString() : ''}`
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

  return (
    <section className="relative overflow-hidden flex items-center"
      style={{ minHeight: '620px', padding: '90px 0 96px' }}>

      <div className="absolute inset-0 overflow-hidden">
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
                { icon: <Clock size={20} />,     val: 'do 60 min',       label: 'odpowiedź' },
                { icon: <Star size={20} />,      val: '4.9/5',           label: 'ocena klientów' },
                { icon: <Award size={20} />,     val: 'Bezpłatna',       label: 'wycena' },
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

          {/* ── Widget wyszukiwania / sprzedaży ── */}
          <div className="hidden lg:block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-7">
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,.25)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
              {(['search', 'sell'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{
                    flex: 1, borderRadius: 10, padding: '10px 8px', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, transition: 'all .2s',
                    background: tab === t ? 'white' : 'transparent',
                    color: tab === t ? '#1a4fa0' : 'rgba(255,255,255,.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  {t === 'search' ? <><Search size={13} /> Szukam</> : <>🏠 Chcę sprzedać</>}
                </button>
              ))}
            </div>

            {/* TAB: Szukam */}
            {tab === 'search' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                <select value={propType} onChange={e => setPropType(e.target.value)} style={SEL_STYLE}>
                  <option value="">Typ nieruchomości</option>
                  <option value="mieszkanie">Mieszkanie</option>
                  <option value="dom">Dom</option>
                  <option value="dzialka">Działka</option>
                  <option value="lokal">Lokal użytkowy</option>
                  <option value="inwestycja">Inwestycja</option>
                </select>
                <select value={transType} onChange={e => setTransType(e.target.value)} style={SEL_STYLE}>
                  <option value="">Kupno i wynajem</option>
                  <option value="sprzedaz">Na sprzedaż</option>
                  <option value="wynajem">Do wynajęcia</option>
                </select>
                <input
                  placeholder="Lokalizacja — np. Kołobrzeg, Mielno…"
                  value={city} onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  style={INP_STYLE}
                />
                <button onClick={handleSearch}
                  style={{ background: '#f5a623', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                  <Search size={16} /> Szukaj ofert
                </button>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, textAlign: 'center' as const }}>
                  lub zadzwoń — <a href="tel:+48731554341" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 600 }}>+48 731 554 341</a>
                </p>
              </div>
            )}

            {/* TAB: Chcę sprzedać */}
            {tab === 'sell' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {sellStatus === 'ok' ? (
                  <div style={{ textAlign: 'center' as const, padding: '24px 0' }}>
                    <CheckCircle size={44} color="#10b981" style={{ margin: '0 auto 12px' }} />
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Wysłano!</div>
                    <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>Oddzwonimy do 60 minut</div>
                  </div>
                ) : (
                  <>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>
                      Zostaw numer — nasz ekspert oddzwoni i bezpłatnie wyceni Twoją nieruchomość.
                    </p>
                    <input
                      placeholder="Imię i nazwisko"
                      value={sellName} onChange={e => setSellName(e.target.value)}
                      style={INP_STYLE}
                    />
                    <input
                      placeholder="+48 numer telefonu *"
                      value={sellPhone} onChange={e => setSellPhone(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSell()}
                      style={{ ...INP_STYLE, border: sellStatus === 'error' ? '1.5px solid #ef4444' : 'none' }}
                    />
                    <button onClick={handleSell} disabled={sellStatus === 'loading' || !sellPhone}
                      style={{ background: sellPhone ? '#f5a623' : 'rgba(245,166,35,.4)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: sellPhone ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', transition: 'background .2s' }}>
                      <Phone size={15} />
                      {sellStatus === 'loading' ? 'Wysyłanie…' : 'Chcę bezpłatną wycenę'}
                    </button>
                    {sellStatus === 'error' && <p style={{ color: '#fca5a5', fontSize: 12, textAlign: 'center' as const }}>Błąd — spróbuj ponownie</p>}
                    <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 10, textAlign: 'center' as const }}>Dane chronione zgodnie z RODO · Bez zobowiązań</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
