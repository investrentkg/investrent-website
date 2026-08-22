"use client"
import { useState, useEffect } from 'react'
import { Calculator, Phone, CheckCircle2 } from 'lucide-react'
import { submitLead } from '@/lib/api'

// NAPRAWA (audyt webmasterski, Daniel 30.07.2026): ten mini-kalkulator mial
// wczesniej sztywne oprocentowanie 7.5% i wlasny, inny tag zrodla leada
// ('kalkulator_oferta') - odkryte przy przegladzie MortgageCalcSection.tsx
// (pelny kalkulator na stronie glownej), ktory JUZ pobiera zywa stope
// referencyjna NBP i JUZ uzywa tagu 'kredyt'. Ujednolicone pod ten sam,
// lepszy standard - wszystkie leady kredytowe ze strony maja teraz spojny
// tag zrodla (source='kredyt'), niezaleznie czy pochodza z glownego
// kalkulatora czy z tego mini-widgetu na karcie oferty.

function formatPLN(n: number) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n)
}

const OWN_CONTRIBUTION_PCT = 20
const FALLBACK_RATE_PCT = 7.5

export default function MortgageMiniCalculator({ price, refNumber, offerId }: { price: number; refNumber?: string; offerId: string }) {
  const [years, setYears] = useState(25)
  const [rate, setRate] = useState(FALLBACK_RATE_PCT)
  const [rateIsLive, setRateIsLive] = useState(false)
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'}/api/public/nbp-rate`)
      .then(r => r.json())
      .then(data => {
        if (data?.rate && typeof data.rate === 'number') {
          setRate(parseFloat((data.rate + 2.3).toFixed(2)))
          setRateIsLive(true)
        }
      })
      .catch(() => {})
  }, [])

  const loan = price * (1 - OWN_CONTRIBUTION_PCT / 100)
  const r = rate / 100 / 12
  const n = years * 12
  const monthly = r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await submitLead({
        phone: phone.trim(),
        source: 'kredyt',
        client_type: 'buyer',
        notes: `Kalkulator raty przy ofercie ${refNumber || offerId}: cena ${formatPLN(price)}, okres ${years} lat, orientacyjna rata ${formatPLN(monthly)}/mies. (zał. ${OWN_CONTRIBUTION_PCT}% wkładu własnego, ${rate.toFixed(1)}% oprocentowania${rateIsLive ? ' — stopa NBP+marża' : ' — wartość orientacyjna'}). Klient prosi o kontakt ws. kredytu.`,
      })
      if (res?.error) { setError(res.error); return }
      setSent(true)
    } catch {
      setError('Nie udało się wysłać — spróbuj zadzwonić bezpośrednio.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 20, marginTop: 14, textAlign: 'center' as const }}>
        <CheckCircle2 size={26} color="#16a34a" style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#166534' }}>Dziękujemy! Oddzwonimy w sprawie kredytu.</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 14, padding: 18, marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Calculator size={17} color="#1a4fa0" />
        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0d2a5c' }}>Sprawdź ratę dla tej nieruchomości</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 11.5, color: '#6b7280' }}>Okres kredytu: <strong style={{ color: '#374151' }}>{years} lat</strong></span>
      </div>
      <input type="range" min={10} max={35} step={1} value={years} aria-label="Okres kredytu w latach"
        onChange={e => setYears(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 14, accentColor: '#1a4fa0' }} />

      <div style={{ background: 'white', borderRadius: 10, padding: '14px 16px', textAlign: 'center' as const, marginBottom: 4 }}>
        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Orientacyjna rata miesięczna</div>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#0d2a5c' }}>{formatPLN(monthly)}</div>
      </div>
      <div style={{ fontSize: 10.5, color: '#9ca3af', textAlign: 'center' as const, marginBottom: 14 }}>
        Przy {OWN_CONTRIBUTION_PCT}% wkładu własnego i oprocentowaniu {rate.toFixed(1)}% ({rateIsLive ? 'stopa NBP + marża' : 'wartość orientacyjna'}) — nie stanowi oferty kredytowej
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6 }}>
        <input type="tel" required placeholder="Twój numer telefonu" aria-label="Numer telefonu" value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }} />
        <button type="submit" disabled={sending}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const, opacity: sending ? 0.6 : 1 }}>
          <Phone size={13} /> Oddzwonimy
        </button>
      </form>
      {error && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 6 }}>{error}</div>}

      <a href="/kalkulator" style={{ display: 'block', textAlign: 'center' as const, fontSize: 11, color: '#1a4fa0', marginTop: 10, textDecoration: 'none' }}>
        Chcesz policzyć dokładniej? Otwórz pełny kalkulator →
      </a>
    </div>
  )
}
