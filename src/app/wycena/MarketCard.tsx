"use client"
import {
  CARD_CONDITIONS, CONDITION_LABELS, fmtAsOfDate, fmtPpm, fmtRange, isSmallTransactionSample,
  type CardCondition, type OffersView, type TransactionsView,
} from '@/lib/marketCard'
import { useMarketCard } from '@/lib/useMarketCard'
import { summarizeMarketCardV4 } from '@/lib/marketCardV4'
import { WYCENA_LAYOUT_V4_ACTIVE } from '@/lib/wycenaFlags'
import { MARKET_CARD_TEXTS as M } from './marketCardTexts'
import { WYCENA_V4_TEXTS as V4 } from './wycenaV4Texts'

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

export default function MarketCard({ token, areaM2 = null }: { token: string | null; areaM2?: number | null }) {
  const { view, condition, setCondition, busy } = useMarketCard(token)

  if (!view) return <p style={hintStyle} role="status">{WYCENA_LAYOUT_V4_ACTIVE ? V4.loading : M.loading}</p>
  if (view.kind === 'nodata' && WYCENA_LAYOUT_V4_ACTIVE) return null
  if (view.kind === 'none' && condition === null) return null // blad/flaga CRM off: bez karty, formularz telefonu dziala dalej
  if (view.kind === 'nodata' && condition === null && !WYCENA_LAYOUT_V4_ACTIVE) return <p role="status" style={{ ...hintStyle, margin: '0 0 12px' }}>{M.noData}</p>
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
