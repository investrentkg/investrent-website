"use client"
import { useState, useEffect, useCallback } from 'react'
import LiveNumber from '@/components/LiveNumber'
import ScrollReveal from '@/components/ScrollReveal'

const DEFAULT_RATE = 7.5  // fallback gdy API niedostępne

export default function MortgageCalcSection() {
  const [amount,   setAmount]   = useState(400000)
  const [years,    setYears]    = useState(25)
  const [own,      setOwn]      = useState(20)        // wkład własny %
  const [rate,     setRate]     = useState(DEFAULT_RATE)
  const [baseRate, setBaseRate] = useState<number | null>(null)
  const [rateSource, setRateSource] = useState('domyślna')

  // Pobierz stopę referencyjną NBP
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.investrent.com.pl'}/api/public/nbp-rate`)
      .then(r => r.json())
      .then(data => {
        const val = data?.rate ?? null
        if (val && typeof val === 'number') {
          setBaseRate(val)
          setRate(parseFloat((val + 2.3).toFixed(2)))
          setRateSource(`NBP ${val.toFixed(2)}% + marża 2,3%`)
        }
      })
      .catch(() => {
        // Fallback — NBP API niedostępne
        setBaseRate(null)
        setRateSource('orientacyjna 2026')
      })
  }, [])

  // Oblicz ratę — anuitetowa
  const loanAmount = amount * (1 - own / 100)
  const monthlyRate = rate / 100 / 12
  const months = years * 12
  const monthly = months > 0 && monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : loanAmount / months
  const totalCost = monthly * months
  const totalInterest = totalCost - loanAmount

  const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL')

  return (
    <section id="kalkulator" style={{ padding: 'clamp(40px, 6vw, 64px) 0', background: '#f1f4f9' }}>
      <div className="container">
        <ScrollReveal>
        {/* Nagłówek */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="tag" style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0', marginBottom: 12 }}>
            Kalkulator kredytowy
          </div>
          <h2 className="heading" style={{ fontSize: 'clamp(24px,4vw,32px)', color: '#0d2a5c', marginBottom: 12 }}>
            Sprawdź swoją orientacyjną ratę kredytu
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 520, margin: '0 auto' }}>
            Kalkulator uwzględnia aktualną stopę referencyjną NBP. Wynik ma charakter wyłącznie orientacyjny
            i nie stanowi oferty kredytowej banku.
          </p>
          {rateSource && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12,
              color: baseRate ? '#10b981' : '#9ca3af', background: baseRate ? '#f0fdf4' : '#f9fafb',
              border: `1px solid ${baseRate ? '#bbf7d0' : '#e5e7eb'}`, borderRadius: 20, padding: '4px 12px' }}>
              {baseRate ? `✓ Dane aktualne z NBP — ${rateSource}` : '⚠ Dane orientacyjne — wartości domyślne, zmień je, aby zobaczyć swoją ratę'}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)', gap: 32, alignItems: 'start' }}
          className="calc-grid">
          {/* Suwaki */}
          <div style={{ background: '#f8fafc', borderRadius: 20, padding: 32 }}>
            {[
              { label: 'Wartość nieruchomości', val: amount, set: setAmount, min: 100000, max: 2000000, step: 10000, fmt: (v: number) => `${fmt(v)} zł` },
              { label: `Wkład własny (${own}%)`, val: own, set: setOwn, min: 10, max: 50, step: 5, fmt: (v: number) => `${fmt(amount * v / 100)} zł` },
              { label: 'Okres kredytowania', val: years, set: setYears, min: 5, max: 35, step: 1, fmt: (v: number) => `${v} lat` },
              { label: `Oprocentowanie`, val: rate, set: setRate, min: 3, max: 15, step: 0.1, fmt: (v: number) => `${v.toFixed(1)}%` },
            ].map(sl => (
              <div key={sl.label} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{sl.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1a4fa0' }}>{sl.fmt(sl.val)}</span>
                </div>
                <input type="range" aria-label={sl.label} min={sl.min} max={sl.max} step={sl.step}
                  value={sl.val} onChange={e => sl.set(parseFloat(e.target.value))}
                  style={{ width: '100%', height: 44, accentColor: '#1a4fa0', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5a6680', marginTop: 2 }}>
                  <span>{sl.fmt(sl.min)}</span><span>{sl.fmt(sl.max)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Wynik */}
          <div>
            <div style={{ background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', borderRadius: 20, padding: 28, color: 'white', marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 13, opacity: .8, marginBottom: 6 }}>Szacowana miesięczna rata</div>
              <div style={{ fontSize: 'clamp(32px,6vw,48px)', fontWeight: 900, letterSpacing: -1, marginBottom: 4 }}>
                <LiveNumber value={monthly} /> <span style={{ fontSize: 22, fontWeight: 400 }}>zł</span>
              </div>
              <div style={{ fontSize: 12, opacity: .7 }}>anuitet · {rate.toFixed(1)}% rocznie</div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              {[
                { label: 'Kwota kredytu', v: loanAmount },
                { label: 'Łączne odsetki', v: totalInterest },
                { label: 'Całkowity koszt', v: totalCost },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0',
                  borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>
                  <span style={{ color: '#6b7280' }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: '#0d2a5c' }}><LiveNumber value={r.v} /> zł</span>
                </div>
              ))}
            </div>

            {/* CTA kredyt */}
            <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0d2a5c', marginBottom: 6 }}>
                🏦 Potrzebujesz kredytu? Konsultacja gratis.
              </div>
              <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                Sprawdzamy oferty wielu banków i wybieramy najkorzystniejszą na dzień zgłoszenia.
                Konsultacja oraz cały proces kredytowy są dla naszych klientów w 100% bezpłatne.
              </p>
              {/* Makieta M3: jedna ścieżka kontaktu - bez drugiego pola na numer, przejście do pełnego formularza */}
              <a href="#kontakt" className="cta-pulse"
                style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, background: '#f5a623', color: '#0d2a5c', borderRadius: 10,
                  padding: '12px 22px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                Przejdź do formularza kontaktu
              </a>
            </div>

            <p style={{ fontSize: 11, color: '#5a6680', textAlign: 'center' as const, marginTop: 12, lineHeight: 1.5 }}>
              * Kalkulator ma charakter wyłącznie informacyjny. Rzeczywiste warunki kredytu zależą od decyzji
              banku, Twojej zdolności kredytowej i aktualnej oferty. Wynik nie stanowi oferty w rozumieniu
              Kodeksu Cywilnego.
            </p>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
