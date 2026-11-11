// Wynik kalkulatora v4f (makieta v4f zatwierdzona przez Daniela 11.11.2026): model widoku z odpowiedzi POST /api/public/valuation/market-card
// (pole `v4`, backend PR1/PR2 CRM, flagi PUBLIC_MARKET_CARD_V4_ENABLED / PUBLIC_MARKET_CARD_TREND_ENABLED, domyslnie OFF).
// Czysta logika bez React i I/O. Jedna zasada progow: backend zwraca status ok / za_malo / brak (prog 15 wpisow); front tylko przelicza ceny za m² na kwoty.
// Pokoje, pietro, stan i dzielnica zawezaja WYLACZNIE ceny ofertowe; transakcje (rejestr) licza sie wg metrazu.

export type V4Criteria = { rooms: string | null; floor: string | null; condition: string | null; district: string | null }
export type V4Group = { criteria: V4Criteria; count: number; median: number | null; p25: number | null; p75: number | null }
export type V4Offers = {
  status: 'ok' | 'za_malo' | 'brak'
  requested: V4Criteria; requestedCount: number; minSample: number
  main: V4Group | null; wider: V4Group | null; smallSample: boolean
}
export type V4TrendPeriod = { from: string; to: string; count: number; median: number }
export type V4Trend =
  | { status: 'ok'; periods: V4TrendPeriod[]; changePct: number; asOf: string }
  | { status: 'za_malo'; counts: number[]; minPerPeriod: number }
  | { status: 'brak' }
export type V4Transactions =
  | { status: 'ok'; count: number; median: number; p25: number | null; p75: number | null; asOf: string; trend: V4Trend | null }
  | { status: 'za_malo'; count: number; asOf: string | null }
  | { status: 'brak' }
export type V4Raw = { offers: V4Offers | null; transactions: V4Transactions }

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null)
const obj = (v: unknown): Record<string, any> | null => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, any>) : null)

function parseCriteria(v: unknown): V4Criteria {
  const o = obj(v) ?? {}
  return { rooms: str(o.rooms), floor: str(o.floor), condition: str(o.condition), district: str(o.district) }
}
function parseGroup(v: unknown): V4Group | null {
  const o = obj(v)
  const count = o ? num(o.count) : null
  if (!o || count == null) return null
  return { criteria: parseCriteria(o.criteria), count, median: num(o.median_price_per_m2), p25: num(obj(o.range)?.p25), p75: num(obj(o.range)?.p75) }
}
function parseTrend(v: unknown): V4Trend | null {
  const o = obj(v)
  if (!o) return null
  if (o.status === 'brak') return { status: 'brak' }
  if (o.status === 'za_malo' && Array.isArray(o.counts) && o.counts.every((c: unknown) => typeof c === 'number')) {
    return { status: 'za_malo', counts: o.counts as number[], minPerPeriod: num(o.min_per_period) ?? 15 }
  }
  if (o.status === 'ok' && Array.isArray(o.periods) && o.periods.length >= 2 && num(o.change_pct) != null && str(o.as_of)) {
    const periods: V4TrendPeriod[] = []
    for (const p of o.periods) {
      const po = obj(p)
      if (!po || !str(po.from) || !str(po.to) || num(po.count) == null || num(po.median_price_per_m2) == null) return null
      periods.push({ from: po.from, to: po.to, count: po.count, median: po.median_price_per_m2 })
    }
    return { status: 'ok', periods, changePct: o.change_pct as number, asOf: o.as_of as string }
  }
  return null
}

/** Odpowiedz API -> model; cokolwiek niespojnego = null (front pokazuje wtedy dotychczasowa karte, nigdy zmyslone liczby). */
export function parseV4Raw(raw: unknown): V4Raw | null {
  const v = obj(raw)
  if (!v) return null
  const t = obj(v.transactions)
  if (!t) return null
  let transactions: V4Transactions
  if (t.status === 'ok') {
    const s = obj(t.section)
    const count = s ? num(s.count) : null
    const median = s ? num(s.median_price_per_m2) : null
    if (!s || s.available !== true || count == null || median == null) return null
    transactions = { status: 'ok', count, median, p25: num(obj(s.range)?.p25), p75: num(obj(s.range)?.p75), asOf: str(s.as_of) ?? '', trend: parseTrend(t.trend) }
  } else if (t.status === 'za_malo') transactions = { status: 'za_malo', count: num(t.count) ?? 0, asOf: str(t.as_of) }
  else if (t.status === 'brak') transactions = { status: 'brak' }
  else return null
  let offers: V4Offers | null = null
  const o = obj(v.offers)
  if (o && (o.status === 'ok' || o.status === 'za_malo' || o.status === 'brak')) {
    offers = {
      status: o.status, requested: parseCriteria(o.requested), requestedCount: num(o.requested_count) ?? 0, minSample: num(o.min_sample) ?? 15,
      main: parseGroup(o.main), wider: parseGroup(o.wider), smallSample: o.small_sample === true,
    }
    if (offers.status === 'ok' && (!offers.main || offers.main.median == null)) return null
    if (offers.status === 'za_malo' && (!offers.wider || offers.wider.median == null)) return null
  } else if (o) return null
  return { offers, transactions }
}

// ── liczby ──
/** Kwota calkowita z ceny za m²: zaokraglenie do 1 tys. zl, a przy malej probie (N < 30) do 5 tys. zl (decyzja v4: bez pozornej precyzji). */
export function totalFromPerM2(perM2: number, areaM2: number, small: boolean): number {
  const step = small ? 5000 : 1000
  return Math.round((perM2 * areaM2) / step) * step
}
export type Band = { low: number; high: number; typical: number; count: number; small: boolean }
function bandOf(g: { median: number | null; p25: number | null; p75: number | null; count: number }, areaM2: number, small: boolean): Band | null {
  if (!(areaM2 > 0) || g.median == null || g.p25 == null || g.p75 == null || g.p25 > g.p75) return null
  return { low: totalFromPerM2(g.p25, areaM2, small), high: totalFromPerM2(g.p75, areaM2, small), typical: totalFromPerM2(g.median, areaM2, small), count: g.count, small }
}
export const SMALL_SAMPLE = 30

const NBSP = ' '
export const fmtZl = (n: number): string => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)}${NBSP}zł`
export const fmtNum = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
export const fmtTys = (n: number): string => String(Math.round(n / 1000))
/** Dopelniacz po „na podstawie”: 1 wpisu, 188 wpisow (bez „po deduplikacji”: decyzja Dyrektora 11.11). */
export const entriesText = (n: number): string => `${fmtNum(n)}${NBSP}${n === 1 ? 'wpisu' : 'wpisów'} z portali`
export const transactionsText = (n: number): string => `${fmtNum(n)}${NBSP}transakcji`

/** Data rejestru: backend zwraca MM.RRRR; zostawiamy format miesiaca (rejestr nie podaje dnia). */
export const asOfLabel = (mmrrrr: string): string => (/^\d{2}\.\d{4}$/.test(mmrrrr) ? mmrrrr : '')

// ── etykiety kryteriow ──
const ROOMS_LABEL: Record<string, string> = { '1': '1 pokój', '2': '2 pokoje', '3': '3 pokoje', '4_plus': '4+ pokoi' }
const ROOMS_FOR: Record<string, string> = { '1': '1 pokoju', '2': '2 pokoi', '3': '3 pokoi', '4_plus': '4+ pokoi' }
const FLOOR_LABEL: Record<string, string> = { parter: 'parter', '1_3': 'piętro 1–3', '4_plus': 'piętro 4+' }
export const CONDITION_CHIPS: readonly { value: string; label: string }[] = [
  { value: 'do_remontu', label: 'Do remontu' }, { value: 'do_zamieszkania', label: 'Do zamieszkania' },
  { value: 'deweloperski', label: 'Deweloperski' }, { value: 'do_wykonczenia', label: 'Do wykończenia' },
]
const conditionLabel = (v: string | null): string | null => CONDITION_CHIPS.find(c => c.value === v)?.label.toLowerCase() ?? null

export const roomsEntry = (v: string | null): string | null => (v ? ROOMS_LABEL[v] ?? null : null)
export const floorEntry = (v: string | null): string | null => (v ? FLOOR_LABEL[v] ?? null : null)

/** „Dla 2 pokoi, piętro 1–3, stan do remontu, dzielnica Centrum” albo „Bez filtra pokoi i piętra”. */
export function criteriaLabel(c: V4Criteria): string {
  const parts: string[] = []
  if (c.rooms && ROOMS_FOR[c.rooms]) parts.push(`${ROOMS_FOR[c.rooms]}`)
  if (c.floor && FLOOR_LABEL[c.floor]) parts.push(FLOOR_LABEL[c.floor])
  const cond = conditionLabel(c.condition)
  if (cond) parts.push(`stan ${cond}`)
  if (c.district) parts.push(`dzielnica ${c.district}`)
  if (!parts.length) return 'Bez filtra pokoi, piętra, stanu i dzielnicy'
  const first = c.rooms ? `Dla ${parts[0]}` : `Dla: ${parts[0]}`
  return [first, ...parts.slice(1)].join(', ')
}
/** Bez przedimka „Dla”: „3 pokoje, piętro 4+, stan do remontu” (opis szerszej grupy). */
export function criteriaPlain(c: V4Criteria): string {
  const cond = conditionLabel(c.condition)
  const parts = [c.rooms ? ROOMS_LABEL[c.rooms] : null, c.floor ? FLOOR_LABEL[c.floor] : null, cond ? `stan ${cond}` : null, c.district ? `dzielnica ${c.district}` : null].filter(Boolean)
  return parts.length ? parts.join(', ') : 'bez filtrów'
}
export const droppedKeys = (requested: V4Criteria, kept: V4Criteria): (keyof V4Criteria)[] =>
  (['rooms', 'floor', 'condition', 'district'] as const).filter(k => requested[k] != null && kept[k] == null)
export const DROPPED_LABEL: Record<keyof V4Criteria, string> = { rooms: 'Pokoje', floor: 'Piętro', condition: 'Stan', district: 'Dzielnica' }
export const DROPPED_GEN: Record<keyof V4Criteria, string> = { rooms: 'pokoi', floor: 'piętra', condition: 'stanu', district: 'dzielnicy' }

// ── model wyniku ──
export type TxTile = { kind: 'ok'; band: Band; asOf: string } | { kind: 'za_malo'; count: number } | { kind: 'brak' }
export type OffersTile =
  | { kind: 'ok'; band: Band; label: string }
  | { kind: 'za_malo'; requestedCount: number; minSample: number; label: string; wider: Band; dropped: (keyof V4Criteria)[]; widerCriteria: V4Criteria }
  | { kind: 'brak'; requestedCount: number; minSample: number }
export type ResultModel = { tx: TxTile; offers: OffersTile | null; answer: string | null; negotiation: boolean }

export function buildResultModel(v4: V4Raw, areaM2: number): ResultModel {
  const t = v4.transactions
  let tx: TxTile = { kind: 'brak' }
  if (t.status === 'ok') {
    const band = bandOf({ median: t.median, p25: t.p25, p75: t.p75, count: t.count }, areaM2, t.count < SMALL_SAMPLE)
    tx = band ? { kind: 'ok', band, asOf: t.asOf } : { kind: 'brak' }
  } else if (t.status === 'za_malo') tx = { kind: 'za_malo', count: t.count }

  let offers: OffersTile | null = null
  const o = v4.offers
  if (o) {
    if (o.status === 'ok' && o.main) {
      const band = bandOf(o.main, areaM2, o.smallSample)
      offers = band ? { kind: 'ok', band, label: criteriaLabel(o.main.criteria) } : { kind: 'brak', requestedCount: o.requestedCount, minSample: o.minSample }
    } else if (o.status === 'za_malo' && o.wider) {
      const wider = bandOf(o.wider, areaM2, o.smallSample)
      offers = wider
        ? { kind: 'za_malo', requestedCount: o.requestedCount, minSample: o.minSample, label: criteriaLabel(o.requested), wider, dropped: droppedKeys(o.requested, o.wider.criteria), widerCriteria: o.wider.criteria }
        : { kind: 'brak', requestedCount: o.requestedCount, minSample: o.minSample }
    } else offers = { kind: 'brak', requestedCount: o.requestedCount, minSample: o.minSample }
  }

  const answer = tx.kind === 'ok' ? `Połowę mieszkań o podobnym metrażu sprzedano za ${fmtTys(tx.band.low)}–${fmtTys(tx.band.high)} tys. zł.` : null
  // Prawnik 11.11: zdanie o negocjacji ceny wywolawczej TYLKO gdy mediana ofert > mediana transakcji (dla tego samego zapytania)
  const negotiation = tx.kind === 'ok' && offers?.kind === 'ok' && offers.band.typical > tx.band.typical
  return { tx, offers, answer, negotiation }
}

// ── wykres trendu ──
export type ChartScale = { min: number; max: number; ticks: number[] }
/** Os zaczyna sie od zaokraglonego w dol minimum (nie od zera: tekst na ekranie to mowi), 3 linie siatki, krok 500 lub 1000 zl. */
export function trendScale(values: readonly number[]): ChartScale {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const step = hi - lo > 1500 ? 1000 : 500
  const min = Math.floor((lo - step * 0.25) / step) * step
  let max = Math.ceil((hi + step * 0.25) / step) * step
  if (max - min < 2 * step) max = min + 2 * step
  const ticks: number[] = []
  for (let v = min; v <= max; v += step) ticks.push(v)
  return { min, max, ticks: ticks.length > 5 ? [min, Math.round((min + max) / 2 / step) * step, max] : ticks }
}
/** Etykieta okresu 3-miesiecznego liczonego wstecz od najnowszej transakcji (nie kalendarzowy kwartal): „08–10.2026”. */
export function periodLabel(p: { from: string; to: string }): string {
  const f = /^(\d{4})-(\d{2})/.exec(p.from)
  const t = /^(\d{4})-(\d{2})/.exec(p.to)
  if (!f || !t) return ''
  return f[1] === t[1] ? `${f[2]}–${t[2]}.${t[1]}` : `${f[2]}.${f[1]}–${t[2]}.${t[1]}`
}
/** Krotka etykieta osi wykresu: miesiac konca okresu, np. „do 01.26” (pelny zakres w tekscie i tabeli). */
export function periodEnd(to: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(to)
  return m ? `do ${m[2]}.${m[1].slice(2)}` : ''
}
export const fmtChange = (pct: number): string => `${pct > 0 ? '+' : pct < 0 ? '−' : ''}${String(Math.abs(Math.round(pct * 10) / 10)).replace('.', ',')}%`
