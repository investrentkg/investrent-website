"use client"
import { useEffect, useMemo, useState } from 'react'
import ResultV4f from './ResultV4f'
import {
  CARD_CONDITIONS, CONDITION_LABELS, fmtAsOfDate, fmtPpm, fmtRange, isSmallTransactionSample,
  type CardCondition, type MarketCardFilters, type OffersView, type TransactionsView,
} from '@/lib/marketCard'
import { useMarketCard } from '@/lib/useMarketCard'
import { summarizeMarketCardV4 } from '@/lib/marketCardV4'
import { WYCENA_LAYOUT_V4_ACTIVE } from '@/lib/wycenaFlags'
import { MARKET_CARD_TEXTS as M } from './marketCardTexts'
import { WYCENA_V4_TEXTS as V4 } from './wycenaV4Texts'
import { WYCENA_V2_TEXTS as V2 } from './wycenaV2Texts'

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
          {isSmallTransactionSample(t.count) && <p role="status" style={{ ...hintStyle, color: '#92400e', fontWeight: 600 }}>{M.transactionsSmallSample(t.count)}</p>}
        </>
      ) : <p style={pStyle}>{M.noTransactions}</p>}
    </section>
  )
}

function V4MarketCard({ view, areaM2, condition, setCondition, busy }: { view: NonNullable<ReturnType<typeof useMarketCard>['view']>; areaM2: number | null; condition: CardCondition | null; setCondition: (value: CardCondition | null) => void; busy: boolean }) {
  const summary = summarizeMarketCardV4(view, areaM2)
  const offers = view.kind === 'card' ? view.offers : null
  const transactions = view.kind === 'card' ? view.transactions : null
  const offerCount = offers ? (offers.conditionCount ?? offers.count) : 0
  const txCount = transactions?.count ?? 0
  if (!summary.transactions && !summary.offers) return null
  const chips = <div className="wy-v4-market-chips" aria-label="Dwa zestawy cen">
    <span className="wy-v4-market-chip">{V4.transactions.title}</span>
    <span className="wy-v4-market-chip">{V4.offers.title}</span>
  </div>

  return (
    <section className="wy-v4-market" aria-label="Ceny w okolicy dla podobnego metrażu" aria-busy={busy}>
      <header className="wy-v4-market-heading">
        <p>Wycena orientacyjna</p>
        <h3>Ceny w Twojej okolicy</h3>
      </header>
      {chips}
      <div className="wy-v4-market-condition">
        <label htmlFor="wy-v4-mc-cond">{M.conditionLabel}</label>
        <select id="wy-v4-mc-cond" className="wy-field" value={condition ?? ''} onChange={e => setCondition((e.target.value || null) as CardCondition | null)}>
          <option value="">{M.conditionAll}</option>
          {CARD_CONDITIONS.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
        </select>
      </div>
      {offers?.condition !== undefined && <p className="wy-v4-market-filter-note">{M.conditionCounts(offerCount, offers.countAllStandards)}</p>}
      <div className="wy-v4-market-grid">
        <article className="wy-v4-market-card" aria-labelledby="wy-v4-transactions-title">
          <p className="wy-v4-market-source">{V4.transactions.source}</p>
          <h4 id="wy-v4-transactions-title">{V4.transactions.title}</h4>
          {summary.transactions ? <>
            <p className="wy-v4-market-area">{V4.amountLabel.transactions(summary.transactions.low, summary.transactions.high, areaM2!)}</p>
            <p className="wy-v4-market-count">Na podstawie {txCount} {V4.transactions.unit}</p>
          </> : <p className="wy-v4-market-empty">{V4.transactions.empty}</p>}
          {txCount >= 8 && txCount < 15 && <p className="wy-v4-market-small" role="status">{V4.transactions.smallSample(txCount)}</p>}
        </article>
        <article className="wy-v4-market-card" aria-labelledby="wy-v4-offers-title">
          <p className="wy-v4-market-source">{V4.offers.source}</p>
          <h4 id="wy-v4-offers-title">{V4.offers.title}</h4>
          {offers && <p className="wy-v4-market-place">{placeText(offers)}{offers.level === 'miasto' ? ` — ${V4.cityFallback}` : ''}</p>}
          {summary.offers ? <>
            <p className="wy-v4-market-area">{V4.amountLabel.offers(summary.offers.low, summary.offers.high, areaM2!)}</p>
            <p className="wy-v4-market-count">Na podstawie {offerCount} {V4.offers.unit}</p>
          </> : <p className="wy-v4-market-empty">{V4.offers.empty}</p>}
          {offerCount >= 8 && offerCount < 15 && <p className="wy-v4-market-small" role="status">{V4.offers.smallSample(offerCount)}</p>}
          <p className="wy-v4-market-disclaimer">{V4.offersDisclaimer}</p>
        </article>
      </div>
      <p className="wy-v4-market-note">{V4.separateValues} {V4.noForecasts}</p>
      <p className="wy-v4-market-source-note">Dane transakcyjne pochodzą z rejestru cen transakcyjnych. Ceny ofertowe pochodzą z ogłoszeń portali.</p>
    </section>
  )
}

/** wynik_v2 (makieta 3): dwa rownorzedne bloki obok siebie, oferty i sprzedane, bez laczenia i usredniania; filtr stanu dotyczy tylko ofert. */
function V2MarketCard({ view, areaM2, condition, setCondition, busy }: { view: NonNullable<ReturnType<typeof useMarketCard>['view']>; areaM2: number | null; condition: CardCondition | null; setCondition: (value: CardCondition | null) => void; busy: boolean }) {
  const summary = summarizeMarketCardV4(view, areaM2)
  const offers = view.kind === 'card' ? view.offers : null
  const transactions = view.kind === 'card' ? view.transactions : null
  const asOfDate = view.kind === 'card' ? fmtAsOfDate(view.asOfDate) : null
  const offerCount = offers ? (offers.conditionCount ?? offers.count) : 0
  const area = areaM2 && areaM2 > 0 ? areaM2 : null
  if (!area || (!summary.transactions && !summary.offers && !transactions)) return null
  return (
    <section className="wy-v2" aria-label="Ceny w okolicy dla podobnego metrażu" aria-busy={busy}>
      <p className="wy-v2-heading">{V2.heading(area)}</p>
      <div className="wy-v2-grid">
        <article className="wy-v2-box wy-v2-offers" aria-labelledby="wy-v2-offers-title">
          <h4 id="wy-v2-offers-title">{V2.offers.title}</h4>
          {summary.offers ? <>
            <p className="wy-v2-amount">{V2.offers.amount(summary.offers.low, summary.offers.high)}</p>
            <p className="wy-v2-desc">{V2.offers.desc(area, condition !== null)}</p>
            <p className="wy-v2-meta">{V2.offers.meta(offerCount, asOfDate)}</p>
          </> : <p className="wy-v2-desc">{V2.offers.empty}</p>}
        </article>
        <article className="wy-v2-box wy-v2-sold" aria-labelledby="wy-v2-sold-title">
          <h4 id="wy-v2-sold-title">{V2.sold.title}</h4>
          {summary.transactions && transactions ? <>
            <p className="wy-v2-amount">{V2.sold.amount(summary.transactions.low, summary.transactions.high)}</p>
            <p className="wy-v2-desc">{V2.sold.desc(area)}</p>
            <p className="wy-v2-meta">{V2.sold.meta(transactions.count, transactions.asOf)}</p>
          </> : <>
            <p className="wy-v2-amount wy-v2-amount-empty">{V2.sold.emptyTitle}</p>
            <p className="wy-v2-desc">{V2.sold.emptyBody}</p>
            {transactions && <p className="wy-v2-meta">{V2.sold.meta(transactions.count, transactions.asOf)}</p>}
          </>}
        </article>
      </div>
      {/* Zwinięte do jednej linii (cel: krótszy dystans wynik → numer); pełny tekst w DOM, rozwijany kliknięciem lub linkiem z zastrzeżenia */}
      <details className="wy-v2-diff" id="wy-v2-diff">
        <summary><strong>{V2.diff.title}</strong> <span className="wy-v2-diff-more">{V2.diff.more}</span></summary>
        <p>{V2.diff.body}</p>
        <p>{V2.diff.moreBody}</p>
      </details>
      <div className="wy-v2-condition">
        <label htmlFor="wy-v2-cond">{M.conditionLabel}</label>
        <select id="wy-v2-cond" className="wy-field" value={condition ?? ''} onChange={e => setCondition((e.target.value || null) as CardCondition | null)}>
          <option value="">{M.conditionAll}</option>
          {CARD_CONDITIONS.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
        </select>
      </div>
    </section>
  )
}

/** Wynik v4f (flaga NEXT_PUBLIC_WYCENA_RESULT_V4F): miasto i dzielnice z formularza, numer telefonu (slot) i „Wyceń inną” z rodzica. */
export type V4fOptions = { city: string; districts: readonly string[]; ctaSlot: React.ReactNode; onAgain: () => void }

export default function MarketCard({ token, areaM2 = null, onKind, v2 = false, filters, v4f }: { token: string | null; areaM2?: number | null; onKind?: (kind: 'card' | 'nodata' | 'none' | 'v4f' | null) => void; v2?: boolean; filters?: MarketCardFilters; v4f?: V4fOptions }) {
  // v4f: pokoje, pietro i dzielnica to stan lokalny (zmiana = jedno nowe zapytanie); startuja od wartosci z ekranu 1
  const [local, setLocal] = useState<{ rooms: string | null; floor: string | null; district: string | null }>({ rooms: filters?.rooms ?? null, floor: filters?.floor_group ?? null, district: null })
  const hookFilters = useMemo<MarketCardFilters | undefined>(() => v4f
    ? { ...(local.rooms ? { rooms: local.rooms as MarketCardFilters['rooms'] } : {}), ...(local.floor ? { floor_group: local.floor as MarketCardFilters['floor_group'] } : {}), ...(local.district ? { district: local.district } : {}) }
    : filters, [v4f, local.rooms, local.floor, local.district, filters])
  const { view, condition, setCondition, busy } = useMarketCard(token, hookFilters)
  const v4Data = v4f && view?.kind === 'card' ? view.v4 ?? null : null
  const kind = v4Data ? 'v4f' : (view?.kind ?? null)
  useEffect(() => { onKind?.(kind) }, [kind, onKind])
  // punkt odniesienia „96 ze 188”: liczba wpisow dla samych filtrow z wejscia (bez stanu i dzielnicy)
  const [baseCount, setBaseCount] = useState<number | null>(null)
  useEffect(() => {
    const o = v4Data?.offers
    if (o && o.status === 'ok' && !condition && !local.district) setBaseCount(o.requestedCount)
  }, [v4Data, condition, local.district])

  if (v4f && v4Data && areaM2 && areaM2 > 0) {
    const bandLabel = view?.kind === 'card' ? view.band : null
    return <ResultV4f v4={v4Data} areaM2={areaM2} city={v4f.city} bandLabel={bandLabel} busy={busy}
      filters={{ rooms: local.rooms, floor: local.floor, condition, district: local.district }}
      setFilters={next => {
        if ('condition' in next) setCondition((next.condition ?? null) as CardCondition | null)
        setLocal(cur => ({ rooms: 'rooms' in next ? next.rooms ?? null : cur.rooms, floor: 'floor' in next ? next.floor ?? null : cur.floor, district: 'district' in next ? next.district ?? null : cur.district }))
      }}
      baseCount={baseCount} districts={v4f.districts} ctaSlot={v4f.ctaSlot} onAgain={v4f.onAgain} />
  }
  if (!view) return <p style={hintStyle} role="status">{WYCENA_LAYOUT_V4_ACTIVE ? V4.loading : M.loading}</p>
  if (view.kind === 'nodata' && WYCENA_LAYOUT_V4_ACTIVE) return null
  if (view.kind === 'none' && condition === null) return null // blad/flaga CRM off: bez karty, formularz telefonu dziala dalej
  if (view.kind === 'nodata' && condition === null && !WYCENA_LAYOUT_V4_ACTIVE) return <p role="status" style={{ ...hintStyle, margin: '0 0 12px' }}>{M.noData}</p>
  if (WYCENA_LAYOUT_V4_ACTIVE && v2) return <V2MarketCard view={view} areaM2={areaM2} condition={condition} setCondition={setCondition} busy={busy} />
  if (WYCENA_LAYOUT_V4_ACTIVE) return <V4MarketCard view={view} areaM2={areaM2} condition={condition} setCondition={setCondition} busy={busy} />
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
