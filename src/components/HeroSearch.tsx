"use client"
import { useState } from 'react'
import SuccessBadge from '@/components/SuccessBadge'
import { submitLead } from '@/lib/api'
import { CALCULATOR_CONFIG } from '@/lib/localities'
import PrivacyNote from '@/components/PrivacyNote'

// Zakładki "Szukam" / "Chcę sprzedać" + pasek wyszukiwarki w hero (makieta M3). Zastępuje dawny HeroWidget
// (karta tylko na desktopie): ta sama logika - szukanie przekierowuje na /oferty z filtrami, "Chcę sprzedać"
// wysyła lead (source hero_sell). Teraz działa też na telefonie (makieta mobile 390).
export default function HeroSearch() {
  const [tab, setTab] = useState<'search' | 'sell'>('search')
  const [propType, setPropType] = useState('mieszkanie')
  const [transType, setTransType] = useState('sprzedaz')
  const [city, setCity] = useState(CALCULATOR_CONFIG.homeCity)
  const [sellName, setSellName] = useState('')
  const [sellPhone, setSellPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  function go(e?: React.FormEvent) {
    e?.preventDefault()
    const p = new URLSearchParams()
    if (propType) p.set('property_type', propType)
    if (transType) p.set('transaction_type', transType)
    if (city.trim()) p.set('city', city.trim())
    window.location.href = `/oferty${p.toString() ? '?' + p : ''}`
  }

  async function sell(e?: React.FormEvent) {
    e?.preventDefault()
    if (!sellPhone.trim()) return
    setStatus('loading')
    const r = await submitLead({ full_name: sellName || 'Sprzedający', phone: sellPhone, source: 'hero_sell', client_type: 'seller', notes: 'Chcę sprzedać — strona główna' })
    setStatus(r?.ok ? 'ok' : 'error')
  }

  return (
    <div>
      <div className="m3-modes" role="tablist" aria-label="Szukam albo chcę sprzedać">
        <button type="button" role="tab" id="hs-tab-search" aria-selected={tab === 'search'} aria-controls="hs-panel" onClick={() => setTab('search')}>Szukam</button>
        <button type="button" role="tab" id="hs-tab-sell" aria-selected={tab === 'sell'} aria-controls="hs-panel" onClick={() => setTab('sell')}>Chcę sprzedać</button>
      </div>

      {tab === 'search' ? (
        <form className="m3-search" id="hs-panel" role="tabpanel" aria-labelledby="hs-tab-search" onSubmit={go}>
          <div className="m3-fld">
            <label htmlFor="hs-type">Typ nieruchomości</label>
            <select id="hs-type" value={propType} onChange={e => setPropType(e.target.value)}>
              <option value="">Wszystkie typy</option>
              <option value="mieszkanie">Mieszkanie</option>
              <option value="dom">Dom</option>
              <option value="dzialka">Działka</option>
              <option value="lokal">Lokal użytkowy</option>
              <option value="inwestycja">Inwestycja</option>
            </select>
          </div>
          <div className="m3-fld">
            <label htmlFor="hs-trans">Kupno i wynajem</label>
            <select id="hs-trans" value={transType} onChange={e => setTransType(e.target.value)}>
              <option value="">Kupno i wynajem</option>
              <option value="sprzedaz">Na sprzedaż</option>
              <option value="wynajem">Do wynajęcia</option>
            </select>
          </div>
          <div className="m3-fld">
            <label htmlFor="hs-city">Lokalizacja</label>
            <select id="hs-city" value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Wszystkie miejscowości</option>
              {CALCULATOR_CONFIG.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="m3-search-btn">Szukam ofert</button>
        </form>
      ) : (
        <form className="m3-search" id="hs-panel" role="tabpanel" aria-labelledby="hs-tab-sell" onSubmit={sell} style={{ flexWrap: 'wrap' }}>
          {status === 'ok' ? (
            <div style={{ width: '100%', padding: '14px 8px' }}>
              <SuccessBadge text="Wysłano! Oddzwonimy najpóźniej w ciągu 24 godzin" style={{ color: '#047857', fontWeight: 700, fontSize: 15 }} />
            </div>
          ) : (
            <>
              <div className="m3-fld">
                <label htmlFor="hs-name">Imię i nazwisko (opcjonalnie)</label>
                <input id="hs-name" type="text" placeholder="Imię i nazwisko" value={sellName} onChange={e => setSellName(e.target.value)} autoComplete="name" />
              </div>
              <div className="m3-fld">
                <label htmlFor="hs-phone">Numer telefonu (wymagane)</label>
                <input id="hs-phone" type="tel" placeholder="+48 …" value={sellPhone} onChange={e => setSellPhone(e.target.value)} autoComplete="tel" />
              </div>
              <button type="submit" className="m3-search-btn" disabled={!sellPhone.trim() || status === 'loading'}>
                {status === 'loading' ? 'Wysyłanie…' : 'Chcę bezpłatną wycenę'}
              </button>
              {status === 'error' && <p role="alert" style={{ color: '#b91c1c', fontSize: 13, width: '100%', margin: '0 6px' }}>Błąd — spróbuj ponownie</p>}
              <PrivacyNote color="#5a6680" size={11} style={{ textAlign: 'left', width: '100%', margin: '2px 6px 0' }} />
            </>
          )}
        </form>
      )}
    </div>
  )
}
