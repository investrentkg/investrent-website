"use client"
import { useEffect, useRef, useState } from 'react'
import {
  CARD_CONDITIONS, CONDITION_LABELS, fetchMarketCard, fmtAsOfDate, fmtPpm, fmtRange, trackCardShown,
  type CardCondition, type MarketCardView, type OffersView, type TransactionsView,
} from '@/lib/marketCard'
import { MARKET_CARD_TEXTS as M } from './marketCardTexts'

// Karta rynku pod wynikiem (flaga NEXT_PUBLIC_WYCENA_MARKET_CARD + gotowy tekst zgody): DWIE wartosci osobno, bez mediany lacznej.
// Gdy API nie ma danych / blad: karta sie nie renderuje (blok telefonu dziala dalej bez niej).
const boxStyle: React.CSSProperties = { border: '1px solid #d6dde8', borderRadius: 12, padding: '12px 14px', marginBottom: 10, background: '#fff' }
const hStyle: React.CSSProperties = { margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#0d2a5c' }
const pStyle: React.CSSProperties = { margin: '2px 0', fontSize: 15, color: '#374151', lineHeight: 1.5 }
const hintStyle: React.CSSProperties = { fontSize: 13, color: '#475569', marginTop: 4 }

function placeText(o: OffersView): string {
  return o.level === 'ulica' ? M.place.ulica : o.level === 'dzielnica' ? M.place.dzielnica(o.place) : M.place.miasto(o.place)
}

export function OffersBox({ o, band, asOfDate }: { o: OffersView | null; band: string | null; asOfDate: string | null }) {
  const date = fmtAsOfDate(asOfDate)
  return (
    <section style={boxStyle} aria-labelledby="wy-mc-offers">
      <h4 id="wy-mc-offers" style={hStyle}>{M.offersTitle}{date ? <span style={{ fontWeight: 400, fontSize: 13, color: '#475569' }}> · {date}</span> : null}</h4>
      {o ? (
        <>
          <p style={hintStyle}>{[placeText(o), band].filter(Boolean).join(' · ')}</p>
          <p style={pStyle}>{M.offersCount(o.count)}</p>
          {o.median != null && <p style={pStyle}>{M.offersMedian}: <strong>{fmtPpm(o.median)}</strong></p>}
          {fmtRange(o.p25, o.p75) && <p style={pStyle}>{M.offersRange}: <strong>{fmtRange(o.p25, o.p75)}</strong></p>}
          {o.condition && <p style={hintStyle}>{M.conditionCounts(o.conditionCount ?? o.count, o.countAllStandards)}</p>}
          {o.smallSample && <p role="status" style={{ ...hintStyle, color: '#92400e', fontWeight: 600 }}>{M.smallSample(o.conditionCount ?? o.count)}</p>}
        </>
      ) : <p style={pStyle}>{M.noOffers}</p>}
    </section>
  )
}

export function TransactionsBox({ t }: { t: TransactionsView | null }) {
  return (
    <section style={boxStyle} aria-labelledby="wy-mc-tx">
      <h4 id="wy-mc-tx" style={hStyle}>{M.transactionsTitle}{t ? <span style={{ fontWeight: 400, fontSize: 13, color: '#475569' }}> · {M.transactionsAsOf(t.asOf)}</span> : null}</h4>
      {t ? (
        <>
          <p style={pStyle}>{M.transactionsCount(t.count)}</p>
          <p style={pStyle}>{M.transactionsMedian}: <strong>{fmtPpm(t.median)}</strong></p>
          {fmtRange(t.p25, t.p75) && <p style={pStyle}>{M.transactionsRange}: <strong>{fmtRange(t.p25, t.p75)}</strong></p>}
          <p style={hintStyle}>{M.transactionsNote}</p>
        </>
      ) : <p style={pStyle}>{M.noTransactions}</p>}
    </section>
  )
}

export default function MarketCard({ token }: { token: string | null }) {
  const [view, setView] = useState<MarketCardView | null>(null)
  const [condition, setCondition] = useState<CardCondition | null>(null)
  const [busy, setBusy] = useState(false)
  const tracked = useRef(false)
  const seq = useRef(0)

  useEffect(() => {
    if (!token) { setView({ kind: 'none' }); return }
    const my = ++seq.current
    setBusy(true)
    void fetchMarketCard(token, condition).then(v => {
      if (my !== seq.current) return
      setView(v); setBusy(false)
      if (v.kind === 'card' && !tracked.current) { tracked.current = true; trackCardShown() }
    })
  }, [token, condition])

  if (!view) return <p style={hintStyle} role="status">{M.loading}</p>
  if (view.kind === 'none' && condition === null) return null // blad/flaga CRM off: bez karty, formularz telefonu dziala dalej
  if (view.kind === 'nodata' && condition === null) return <p role="status" style={{ ...hintStyle, margin: '0 0 12px' }}>{M.noData}</p>
  const card = view.kind === 'card' ? view : { asOfDate: null, band: null, offers: null, transactions: null }
  return (
    <div aria-busy={busy} style={{ margin: '0 0 12px' }}>
      <OffersBox o={card.offers} band={card.band} asOfDate={card.asOfDate} />
      <div style={{ margin: '0 0 10px' }}>
        <label htmlFor="wy-mc-cond" style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0d2a5c', marginBottom: 6 }}>{M.conditionLabel}</label>
        <select id="wy-mc-cond" className="wy-field" value={condition ?? ''} onChange={e => setCondition((e.target.value || null) as CardCondition | null)}>
          <option value="">{M.conditionAll}</option>
          {CARD_CONDITIONS.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
        </select>
      </div>
      <TransactionsBox t={card.transactions} />
      <p style={hintStyle}>{M.separateNote}</p>
    </div>
  )
}