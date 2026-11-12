"use client"
import { useEffect, useId, useState, type ReactNode } from 'react'
import {
  CONDITION_CHIPS, DROPPED_LABEL, asOfLabel, buildResultModel, criteriaLabel, criteriaPlain, periodEnd, droppedKeys, DROPPED_GEN, entriesText, floorEntry, fmtChange, fmtNum, fmtZl, periodLabel, roomsEntry,
  transactionsText, trendScale, type Band, type V4Criteria, type V4Raw, type V4Trend,
} from '@/lib/marketCardV4f'
import { WYCENA_RESULT_V4F_TEXTS as R } from './wycenaResultV4fTexts'

// Wynik kalkulatora v4f (makieta v4f, Daniel 11.11.2026). Czysto prezentacyjny: dane i stan filtrow dostarcza MarketCard (jedno zapytanie do API na zmiane filtra).
// Kolejnosc wg makiety: eyebrow, zdanie-odpowiedz, dwa kafle, wniosek, szczegoly liczb, numer telefonu (slot), trend i zawezanie, skad liczby, zastrzezenie.

export type FilterState = { rooms: string | null; floor: string | null; condition: string | null; district: string | null }
export type V4fProps = {
  v4: V4Raw; areaM2: number; city: string; bandLabel: string | null; busy: boolean
  filters: FilterState; setFilters: (next: Partial<FilterState>) => void
  /** Liczba wpisow dla samych filtrow z wejscia (bez stanu i dzielnicy): punkt odniesienia „96 z 188”. */
  baseCount: number | null
  districts: readonly string[]
  ctaSlot: ReactNode; onAgain: () => void
  /** Tylko do podgladu/zrzutow i testow: stan poczatkowy rozwiniec. */
  initialOpen?: { details?: boolean; narrow?: boolean; basis?: boolean; changing?: 'rooms' | 'floor' }
}

const areaText = (a: number): string => String(Math.round(a * 10) / 10).replace('.', ',')

function Accordion({ title, open, onToggle, children, id }: { title: string; open: boolean; onToggle: () => void; children: ReactNode; id: string }) {
  return (
    <div className="wy-r4-acc">
      <button type="button" className="wy-r4-acc-h" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
        <span>{title}</span><span aria-hidden="true" className="wy-r4-chev">{open ? '▴' : '▾'}</span>
      </button>
      {open && <div className="wy-r4-acc-b" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`}>{children}</div>}
    </div>
  )
}

function Chip({ label, pressed, onClick, skipped, disclosure, expanded }: { label: string; pressed?: boolean; onClick?: () => void; skipped?: boolean; disclosure?: boolean; expanded?: boolean }) {
  return (
    <button type="button" className={`wy-r4-chip${pressed && !disclosure ? ' on' : ''}${skipped ? ' skip' : ''}${disclosure ? ' dflt' : ''}`}
      {...(disclosure ? { 'aria-expanded': !!expanded } : { 'aria-pressed': !!pressed })} aria-disabled={skipped ? true : undefined} onClick={skipped ? undefined : onClick}>
      {label}{disclosure && <span aria-hidden="true" style={{ marginLeft: 6 }}>{expanded ? '▴' : '▾'}</span>}{skipped && <small>{' '}{R.narrow.skipped}</small>}
    </button>
  )
}

function Tile({ title, badge, wide, low, children }: { title: string; badge?: string; wide?: boolean; low?: boolean; children: ReactNode }) {
  return (
    <article className={`wy-r4-tile${wide ? ' wide' : ''}${low ? ' low' : ''}`} aria-label={title}>
      <h3>{title}{badge && <span className="wy-r4-badge">{badge}</span>}</h3>
      {children}
    </article>
  )
}
const BandBlock = ({ band, labelText, typicalLabel, small }: { band: Band; labelText: string; typicalLabel: string; small?: boolean }) => (
  <>
    <div className="wy-r4-lab">{labelText}</div>
    <div className={`wy-r4-r${small ? ' small' : ''}`}>{fmtNum(band.low)} – {fmtNum(band.high)}<span>{' '}zł</span></div>
    <div className="wy-r4-typ"><span>{typicalLabel}</span><b>{fmtZl(band.typical)}</b></div>
  </>
)

/** Waski ekran (<640 px): wykres w ukladzie 340 x 140, zeby opisy miały czytelny rozmiar (jak w makiecie 390 px). */
function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(max-width: 639px)')
    const on = () => setNarrow(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

function TrendChart({ trend }: { trend: Extract<V4Trend, { status: 'ok' }> }) {
  const mob = useNarrow()
  const W = mob ? 340 : 760, H = mob ? 140 : 150, xl = mob ? 52 : 80, top = 20
  const values = trend.periods.map(p => p.median)
  const sc = trendScale(values)
  const y = (v: number) => H - 50 - ((v - sc.min) / (sc.max - sc.min)) * (H - 50 - top)
  const n = trend.periods.length
  const pad = mob ? 30 : 60 // desktop: zapas po prawej na opis „28 transakcji” ostatniego punktu
  const x = (i: number) => xl + pad + (i * (W - xl - 2 * pad)) / Math.max(1, n - 1)
  const labels = trend.periods.map(periodLabel)
  const short = trend.periods.map(p => periodEnd(p.to))
  const aria = R.trend.ariaLabel(trend.periods.map((p, i) => `${labels[i]}: ${fmtNum(p.median)} zł`).join(', '))
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H + 44}`} role="img" aria-label={aria} className="wy-r4-chart" focusable="false">
        <g fontSize="13" fill="#3a4356" fontFamily="inherit">
          {sc.ticks.map(t => (
            <g key={t}><line x1={xl} y1={y(t)} x2={W - 4} y2={y(t)} stroke="#cfd7e6" /><text x={0} y={y(t) + 4}>{fmtNum(t)}</text></g>
          ))}
          <polyline points={trend.periods.map((p, i) => `${x(i)},${y(p.median)}`).join(' ')} fill="none" stroke="#14306b" strokeWidth="3" />
          {trend.periods.map((p, i) => (
            <g key={p.to}>
              <circle cx={x(i)} cy={y(p.median)} r="5" fill="#14306b" />
              <text x={x(i)} y={y(p.median) - 12} textAnchor="middle" fontWeight="700" fill="#1f2937">{fmtNum(p.median)}</text>
              <text x={x(i)} y={H + 16} textAnchor="middle">{short[i]}</text>
              <text x={x(i)} y={H + 34} textAnchor="middle">{mob ? `(${p.count})` : `${p.count} transakcji`}</text>
            </g>
          ))}
        </g>
      </svg>
      <table className="wy-r4-sr">
        <caption>{R.trend.title}</caption>
        <thead><tr><th scope="col">{R.trend.tableHead.period}</th><th scope="col">{R.trend.tableHead.price}</th><th scope="col">{R.trend.tableHead.count}</th></tr></thead>
        <tbody>{trend.periods.map((p, i) => <tr key={p.to}><th scope="row">{labels[i]}</th><td>{fmtZl(p.median)}</td><td>{p.count}</td></tr>)}</tbody>
      </table>
    </>
  )
}

export default function ResultV4f(p: V4fProps) {
  const uid = useId().replace(/:/g, '')
  const [openDetails, setOpenDetails] = useState(!!p.initialOpen?.details)
  const [openNarrow, setOpenNarrow] = useState(!!p.initialOpen?.narrow)
  const [openBasis, setOpenBasis] = useState(!!p.initialOpen?.basis)
  const [changing, setChanging] = useState<'rooms' | 'floor' | null>(p.initialOpen?.changing ?? null)
  const model = buildResultModel(p.v4, p.areaM2)
  const { tx, offers } = model
  const o = p.v4.offers
  const t = p.v4.transactions
  const trend = t.status === 'ok' ? t.trend : null
  const area = areaText(p.areaM2)
  const narrowedSecondary = !!(p.filters.condition || p.filters.district)
  const small = (tx.kind === 'ok' && tx.band.small) || (offers?.kind === 'ok' && offers.band.small) || (offers?.kind === 'za_malo' && offers.wider.small)

  // komunikat w regionie aria-live (jedno miejsce; aktualizacja N po kazdej zmianie)
  let live: string
  const entryLabel = [roomsEntry(p.filters.rooms), floorEntry(p.filters.floor)].filter(Boolean).join(' i ')
  if (p.busy) live = R.narrow.liveBusy
  else if (changing) {
    const cur = changing === 'rooms' ? roomsEntry(p.filters.rooms) : floorEntry(p.filters.floor)
    const count = o?.status === 'ok' && o.main ? entriesText(o.main.count) : o ? entriesText(o.requestedCount) : ''
    live = R.narrow.liveChanging(`${changing === 'rooms' ? 'pokoje' : 'piętro'}${cur ? `: ${cur.toLowerCase()}` : ''}`, count)
  } else if (offers?.kind === 'za_malo' && o) {
    const dropped = droppedKeys(o.requested, offers.widerCriteria).map(k => `${DROPPED_LABEL[k].toLowerCase()} „${labelOf(k, o.requested)}”`).join(', ')
    live = R.narrow.liveTooFew(dropped, criteriaPlain(offers.widerCriteria), entriesText(offers.wider.count))
  } else if (offers?.kind === 'ok' && o?.main) {
    if (narrowedSecondary) {
      const what = [p.filters.condition ? `stan ${CONDITION_CHIPS.find(c => c.value === p.filters.condition)?.label.toLowerCase()}` : null, p.filters.district ? `dzielnica ${p.filters.district}` : null].filter(Boolean).join(', ')
      live = R.narrow.liveNarrowed(what, fmtZl(offers.band.low).replace(/\s*zł$/, ''), fmtZl(offers.band.high), entriesText(o.main.count), p.baseCount != null ? ` ze ${fmtNum(p.baseCount)}` : '')
    } else live = entryLabel ? R.narrow.liveEntry(entryLabel, entriesText(o.main.count)) : R.narrow.liveEntryNone(entriesText(o.main.count))
  } else live = o ? R.offers.none(o.requestedCount, o.minSample) : ''

  const setF = (next: Partial<FilterState>) => { setChanging(null); p.setFilters(next) }
  const clearSecondary = () => p.setFilters({ condition: null, district: null })
  const clearAll = () => p.setFilters({ rooms: null, floor: null, condition: null, district: null })
  const skippedKeys = offers?.kind === 'za_malo' ? offers.dropped : []

  return (
    <div className="wy-r4" aria-busy={p.busy}>
      <div className="wy-r4-eyebrow">{R.eyebrow(area, p.city)}</div>
      {model.answer && <p className="wy-r4-ans">{model.answer}</p>}

      <div className="wy-r4-tiles">
        <Tile title={R.tx.title}>
          {tx.kind === 'ok' ? (<>
            <BandBlock band={tx.band} labelText={R.tx.half} typicalLabel={R.tx.typical} />
            <div className="wy-r4-base">{R.tx.base(transactionsText(tx.band.count), asOfLabel(tx.asOf))}</div>
          </>) : tx.kind === 'za_malo' ? <p className="wy-r4-warn">{R.tx.tooFew(tx.count, 15)}</p> : <p className="wy-r4-warn">{R.tx.none}</p>}
        </Tile>
        {offers && (offers.kind === 'ok' ? (
          <Tile title={R.offers.title} wide badge={narrowedSecondary ? R.offers.badgeNarrowed : undefined}>
            <BandBlock band={offers.band} labelText={`${offers.label} · ${R.offers.half}`} typicalLabel={R.offers.typical} />
            <div className="wy-r4-base">{R.offers.base(entriesText(offers.band.count))}</div>
          </Tile>
        ) : offers.kind === 'za_malo' ? (
          <Tile title={R.offers.title} low badge={R.offers.badgeTooFew}>
            <p className="wy-r4-warn">{R.offers.tooFew(offers.label, offers.requestedCount, offers.minSample)}</p>
            <div className="wy-r4-lab wy-r4-wider"><b>{R.offers.widerTitle(criteriaPlain(offers.widerCriteria), offers.dropped.length ? R.offers.widerNoteDropped(offers.dropped.map(k => DROPPED_GEN[k])) : '')}</b></div>
            <div className="wy-r4-r small muted">{fmtNum(offers.wider.low)} – {fmtNum(offers.wider.high)}<span>{' '}zł</span></div>
            <div className="wy-r4-typ"><span>{R.offers.typical}</span><b>{fmtZl(offers.wider.typical)}</b></div>
            <div className="wy-r4-base">{R.offers.base(entriesText(offers.wider.count))}</div>
          </Tile>
        ) : (
          <Tile title={R.offers.title} low badge={R.offers.badgeTooFew}><p className="wy-r4-warn">{R.offers.none(offers.requestedCount, offers.minSample)}</p></Tile>
        ))}
      </div>
      <p className="wy-r4-concl">{R.concl}{model.negotiation ? R.conclNegotiation : ''}</p>
      {small && <p className="wy-r4-note">{R.rounding}</p>}

      {(t.status === 'ok' || offers?.kind === 'ok') && (
        <Accordion id={`${uid}-det`} title={openDetails ? R.details.titleOpen : R.details.title} open={openDetails} onToggle={() => setOpenDetails(v => !v)}>
          <div className="wy-r4-cols">
            {t.status === 'ok' && <div><b>{R.details.tx}</b><br />{R.details.line(fmtZl(t.median), fmtZl(t.p25 ?? 0), fmtZl(t.p75 ?? 0))}</div>}
            {offers?.kind === 'ok' && o?.main && o.main.p25 != null && o.main.p75 != null && o.main.median != null && <div><b>{R.details.offers} ({offers.label.replace(/^Dla:? /, 'dla ')})</b><br />{R.details.line(fmtZl(o.main.median), fmtZl(o.main.p25), fmtZl(o.main.p75))}</div>}
          </div>
          <p className="wy-r4-muted">{R.details.glossary}</p>
        </Accordion>
      )}

      {p.ctaSlot}

      <Accordion id={`${uid}-nar`} title={R.narrow.accTitle} open={openNarrow} onToggle={() => setOpenNarrow(v => !v)}>
        {trend?.status === 'ok' ? (
          <div className="wy-r4-blk">
            <h3>{R.trend.title}</h3>
            <p className="wy-r4-sub">{R.trend.sub(15)}</p>
            <TrendChart trend={trend} />
            <div className="wy-r4-chg">{R.trend.change(periodLabel(trend.periods[0]), periodLabel(trend.periods[trend.periods.length - 1]), fmtChange(trend.changePct), fmtNum(trend.periods[0].median), fmtZl(trend.periods[trend.periods.length - 1].median))}</div>
          </div>
        ) : trend ? (
          <div className="wy-r4-blk"><h3>{R.trend.title}</h3><p className="wy-r4-sub">{R.trend.none}</p></div>
        ) : null}

        <div className="wy-r4-narrow">
          <h2>{R.narrow.title}</h2>
          <p className="wy-r4-sub">{entryLabel ? R.narrow.sub : R.narrow.subNone}</p>
          <div className="wy-r4-row">
            <Chip disclosure expanded={changing === 'rooms'} label={`${R.narrow.rooms}: ${roomsEntry(p.filters.rooms)?.replace(/ (pokój|pokoje|pokoi)$/, '') ?? R.narrow.unknown}`} onClick={() => setChanging(c => (c === 'rooms' ? null : 'rooms'))} />
            <Chip disclosure expanded={changing === 'floor'} label={`${R.narrow.floor}: ${floorEntry(p.filters.floor)?.replace(/^piętro /, '') ?? R.narrow.unknown}`} onClick={() => setChanging(c => (c === 'floor' ? null : 'floor'))} />
          </div>
          {changing === 'rooms' && (
            <div className="wy-r4-grp" role="group" aria-label={R.narrow.rooms}><div className="wy-r4-row">
              {R.narrow.roomsOptions.map(opt => <Chip key={opt.l} label={opt.l} pressed={(p.filters.rooms ?? '') === opt.v} onClick={() => setF({ rooms: opt.v || null })} />)}
            </div></div>
          )}
          {changing === 'floor' && (
            <div className="wy-r4-grp" role="group" aria-label={R.narrow.floor}><div className="wy-r4-row">
              {R.narrow.floorOptions.map(opt => <Chip key={opt.l} label={opt.l} pressed={(p.filters.floor ?? '') === opt.v} onClick={() => setF({ floor: opt.v || null })} />)}
            </div></div>
          )}
          <div className="wy-r4-grp" role="group" aria-labelledby={`${uid}-cond`}>
            <b id={`${uid}-cond`}>{R.narrow.condition} <i>{R.narrow.conditionNote}</i></b>
            <div className="wy-r4-row">
              <Chip label={R.narrow.conditionAny} pressed={!p.filters.condition} onClick={() => setF({ condition: null })} />
              {CONDITION_CHIPS.map(c => {
                const skipped = skippedKeys.includes('condition') && o?.requested.condition === c.value
                return <Chip key={c.value} label={c.label} pressed={p.filters.condition === c.value} skipped={skipped} onClick={() => setF({ condition: c.value })} />
              })}
            </div>
          </div>
          {p.districts.length > 0 && (
            <div className="wy-r4-grp" role="group" aria-labelledby={`${uid}-dist`}>
              <b id={`${uid}-dist`}>{R.narrow.district} <i>{R.narrow.districtNote}</i></b>
              <div className="wy-r4-row">
                <Chip label={R.narrow.districtAny} pressed={!p.filters.district} onClick={() => setF({ district: null })} />
                {p.districts.map(d => {
                  const skipped = skippedKeys.includes('district') && o?.requested.district === d
                  return <Chip key={d} label={d} pressed={p.filters.district === d} skipped={skipped} onClick={() => setF({ district: d })} />
                })}
              </div>
            </div>
          )}
          <div className="wy-r4-live" aria-live="polite" role="status">
            {live}
            {!p.busy && narrowedSecondary && <button type="button" className="wy-r4-link" onClick={offers?.kind === 'za_malo' ? clearAll : clearSecondary}>{offers?.kind === 'za_malo' ? R.narrow.clearAll : R.narrow.clearSecondary}</button>}
          </div>
        </div>
      </Accordion>

      <Accordion id={`${uid}-bas`} title={R.basis.title} open={openBasis} onToggle={() => setOpenBasis(v => !v)}>
        {R.basis.body(p.bandLabel, p.city)}
      </Accordion>

      <div className="wy-r4-legal">
        {R.legal}{' '}
        <button type="button" className="wy-r4-link" onClick={() => { setOpenBasis(true); setTimeout(() => document.getElementById(`${uid}-bas-btn`)?.focus(), 0) }}>{R.legalLink}</button>
        <button type="button" className="wy-r4-again" onClick={p.onAgain}>{R.again}</button>
      </div>
    </div>
  )
}

function labelOf(k: keyof V4Criteria, requested: V4Criteria): string {
  if (k === 'condition') return CONDITION_CHIPS.find(c => c.value === requested.condition)?.label.toLowerCase() ?? ''
  if (k === 'rooms') return roomsEntry(requested.rooms) ?? ''
  if (k === 'floor') return floorEntry(requested.floor) ?? ''
  return requested.district ?? ''
}
