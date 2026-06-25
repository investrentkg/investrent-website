"use client"
import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Phone, CheckCircle } from 'lucide-react'
import { submitLead } from '@/lib/api'

const PROP_TYPES = [
  { value: '', label: 'Typ nieruchomości' },
  { value: 'mieszkanie', label: 'Mieszkanie' },
  { value: 'dom', label: 'Dom' },
  { value: 'dzialka', label: 'Działka' },
  { value: 'lokal', label: 'Lokal użytkowy' },
  { value: 'inwestycja', label: 'Inwestycja' },
]
const TRANS_TYPES = [
  { value: '', label: 'Kupno i wynajem' },
  { value: 'sprzedaz', label: 'Na sprzedaż' },
  { value: 'wynajem', label: 'Do wynajęcia' },
]

function Dropdown({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const selected = options.find(o => o.value === value) ?? options[0]

  function toggle() {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect())
    setOpen(o => !o)
  }

  useEffect(() => {
    if (!open) return
    function close() { setOpen(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={e => { e.stopPropagation(); toggle() }}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 10,
          border: 'none', background: 'rgba(255,255,255,.95)',
          fontSize: 13, color: '#374151', cursor: 'pointer',
          textAlign: 'left' as const, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          outline: 'none', fontFamily: 'inherit',
        }}>
        <span style={{ color: value ? '#111827' : '#9ca3af' }}>{selected.label}</span>
        <ChevronDown size={14} color="#9ca3af"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
      </button>

      {open && rect && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 99999,
            background: 'white',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,.18)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}>
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false) }}
              style={{
                display: 'block', width: '100%', padding: '10px 14px',
                textAlign: 'left' as const, border: 'none', cursor: 'pointer',
                fontSize: 13, fontFamily: 'inherit',
                background: o.value === value ? '#eff6ff' : 'white',
                color: o.value === value ? '#1a4fa0' : '#374151',
                fontWeight: o.value === value ? 700 : 400,
              }}
              onMouseEnter={e => { if (o.value !== value) (e.target as HTMLElement).style.background = '#f8fafc' }}
              onMouseLeave={e => { if (o.value !== value) (e.target as HTMLElement).style.background = 'white' }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default function HeroWidget() {
  const [tab, setTab]             = useState<'search'|'sell'>('search')
  const [propType, setPropType]   = useState('')
  const [transType, setTransType] = useState('')
  const [city, setCity]           = useState('')
  const [sellName, setSellName]   = useState('')
  const [sellPhone, setSellPhone] = useState('')
  const [status, setStatus]       = useState<'idle'|'loading'|'ok'|'error'>('idle')

  function go() {
    const p = new URLSearchParams()
    if (propType)  p.set('property_type', propType)
    if (transType) p.set('transaction_type', transType)
    if (city)      p.set('city', city)
    window.location.href = `/oferty${p.toString() ? '?' + p : ''}`
  }

  async function sell() {
    if (!sellPhone) return
    setStatus('loading')
    const r = await submitLead({
      full_name: sellName || 'Sprzedający',
      phone: sellPhone,
      source: 'hero_sell',
      client_type: 'seller',
      notes: 'Chcę sprzedać — strona główna',
    })
    setStatus(r?.ok ? 'ok' : 'error')
  }

  const inp: React.CSSProperties = {
    padding: '11px 14px', borderRadius: 10, border: 'none',
    background: 'rgba(255,255,255,.95)', fontSize: 13,
    color: '#374151', outline: 'none', width: '100%', fontFamily: 'inherit',
  }

  return (
    <div style={{ background: 'rgba(10,25,60,.9)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 18, padding: 28 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,.3)', borderRadius: 12, padding: 4, marginBottom: 18, gap: 4 }}>
        {(['search', 'sell'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{
              flex: 1, borderRadius: 9, padding: '10px', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all .2s',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#1a4fa0' : 'rgba(255,255,255,.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            {t === 'search' ? <><Search size={13}/> Szukam</> : <>🏠 Chcę sprzedać</>}
          </button>
        ))}
      </div>

      {/* Szukam */}
      {tab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          <Dropdown value={propType} onChange={setPropType} options={PROP_TYPES} />
          <Dropdown value={transType} onChange={setTransType} options={TRANS_TYPES} />
          <input
            type="text"
            placeholder="Lokalizacja — np. Kołobrzeg, Mielno…"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
            style={inp}
          />
          <button type="button" onClick={go}
            style={{ background: '#f5a623', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', fontFamily: 'inherit' }}>
            <Search size={16}/> Szukaj ofert
          </button>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, textAlign: 'center' as const, margin: 0 }}>
            lub zadzwoń — <a href="tel:+48731554341" style={{ color: 'rgba(255,255,255,.65)', textDecoration: 'none', fontWeight: 600 }}>+48 731 554 341</a>
          </p>
        </div>
      )}

      {/* Chcę sprzedać */}
      {tab === 'sell' && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {status === 'ok' ? (
            <div style={{ textAlign: 'center' as const, padding: '28px 0' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 12px' }}/>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Wysłano!</div>
              <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>Oddzwonimy do 60 minut</div>
            </div>
          ) : (
            <>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.65, margin: '0 0 4px' }}>
                Zostaw numer — ekspert bezpłatnie wyceni Twoją nieruchomość.
              </p>
              <input type="text" placeholder="Imię i nazwisko (opcjonalnie)"
                value={sellName} onChange={e => setSellName(e.target.value)} style={inp} />
              <input type="tel" placeholder="+48 numer telefonu *"
                value={sellPhone} onChange={e => setSellPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sell()}
                style={{ ...inp, border: status === 'error' ? '1.5px solid #ef4444' : 'none' }} />
              <button type="button" onClick={sell} disabled={!sellPhone || status === 'loading'}
                style={{ background: sellPhone ? '#f5a623' : 'rgba(245,166,35,.4)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: sellPhone ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', fontFamily: 'inherit' }}>
                <Phone size={15}/> {status === 'loading' ? 'Wysyłanie…' : 'Chcę bezpłatną wycenę'}
              </button>
              {status === 'error' && <p style={{ color: '#fca5a5', fontSize: 12, textAlign: 'center' as const, margin: 0 }}>Błąd — spróbuj ponownie</p>}
              <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 10, textAlign: 'center' as const, margin: 0 }}>Dane chronione zgodnie z RODO · Bez zobowiązań</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
