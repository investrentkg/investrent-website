"use client"
import { useState } from 'react'
import { Calculator, TrendingDown, Banknote, Calendar, Info } from 'lucide-react'

function formatPLN(n: number) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n)
}

export default function KalkulatorClient() {
  const [price, setPrice] = useState(450000)
  const [own,   setOwn]   = useState(20)
  const [years, setYears] = useState(25)
  const [rate,  setRate]  = useState(7.5)

  const loan     = price * (1 - own / 100)
  const r        = rate / 100 / 12
  const n        = years * 12
  const monthly  = r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n
  const total    = monthly * n
  const interest = total - loan

  const sliders = [
    { label: 'Cena nieruchomości', value: price, set: setPrice, min: 100000, max: 3000000, step: 10000, fmt: (v: number) => formatPLN(v) },
    { label: 'Wkład własny',       value: own,   set: setOwn,   min: 10,     max: 80,      step: 1,     fmt: (v: number) => `${v}%` },
    { label: 'Okres kredytu',      value: years, set: setYears, min: 5,      max: 35,      step: 1,     fmt: (v: number) => `${v} lat` },
    { label: 'Oprocentowanie',     value: rate,  set: setRate,  min: 1,      max: 15,      step: 0.1,   fmt: (v: number) => `${v.toFixed(1)}%` },
  ]

  const results = [
    { icon: <Banknote size={20}/>,    label: 'Kwota kredytu',          val: formatPLN(loan),     color: '#1a4fa0' },
    { icon: <TrendingDown size={20}/>,label: 'Wkład własny',           val: `${formatPLN(price * own / 100)} (${own}%)`, color: '#10b981' },
    { icon: <Calendar size={20}/>,    label: 'Całkowity koszt kredytu', val: formatPLN(total),    color: '#f59e0b' },
    { icon: <Calculator size={20}/>,  label: 'Łączne odsetki',         val: formatPLN(interest), color: '#ef4444' },
  ]

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ background: 'linear-gradient(135deg,#0d2a5c 0%,#1a4fa0 100%)', padding: '56px 0 48px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={24} color="white" />
            </div>
            <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0, fontFamily: 'var(--font-montserrat)' }}>
              Kalkulator kredytowy
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: 0 }}>
            Oblicz szacunkową ratę kredytu hipotecznego i sprawdź zdolność kredytową
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d2a5c', marginBottom: 28, fontFamily: 'var(--font-montserrat)' }}>
              Parametry kredytu
            </h2>
            {sliders.map(sl => (
              <div key={sl.label} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{sl.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#0d2a5c' }}>{sl.fmt(sl.value)}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value} aria-label={sl.label}
                  onChange={e => sl.set(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#1a4fa0', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: '#cbd5e1' }}>{sl.fmt(sl.min)}</span>
                  <span style={{ fontSize: 11, color: '#cbd5e1' }}>{sl.fmt(sl.max)}</span>
                </div>
              </div>
            ))}
            <div style={{ background: '#eff6ff', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10 }}>
              <Info size={16} color="#1a4fa0" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#3b82f6', margin: 0, lineHeight: 1.6 }}>
                Kalkulator ma charakter informacyjny. Dokładne warunki zależą od banku i historii kredytowej.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg,#0d2a5c,#1a4fa0)', borderRadius: 20, padding: 32, color: 'white', textAlign: 'center' as const }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginBottom: 8 }}>Szacunkowa rata miesięczna</div>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: 'var(--font-montserrat)', lineHeight: 1, marginBottom: 4 }}>
                {formatPLN(monthly)}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>przy oprocentowaniu {rate.toFixed(1)}%</div>
            </div>
            {results.map(item => (
              <div key={item.label} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0d2a5c' }}>{item.val}</div>
                </div>
              </div>
            ))}
            <a href="/kontakt" style={{ background: '#f5a623', color: 'white', borderRadius: 14, padding: '16px', textAlign: 'center' as const, textDecoration: 'none', fontWeight: 700, fontSize: 15, display: 'block' }}>
              Zapytaj o kredyt — doradzimy bezpłatnie →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
