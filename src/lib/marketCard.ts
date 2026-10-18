// Karta rynku kalkulatora /wycena (S2): klient POST /api/public/valuation/market-card (CRM #1163) i model widoku.
// DWIE WARTOSCI OSOBNO (ceny ofertowe, ceny transakcyjne), bez mediany lacznej, bez twierdzen o trendzie rynku.
// Brak danych (available:false), blad sieci, flaga CRM off (404) = brak karty (model 'none'), nigdy zmyslone liczby.
import { sendFunnelStep } from './funnel.ts'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
export const MARKET_CARD_URL = `${API}/api/public/valuation/market-card`
export const MARKET_CARD_MIN_SAMPLE = 8

export const CARD_CONDITIONS = ['do_remontu', 'do_zamieszkania', 'deweloperski', 'do_wykonczenia'] as const
export type CardCondition = (typeof CARD_CONDITIONS)[number]

export type OffersView = {
  level: 'ulica' | 'dzielnica' | 'miasto'; place: string | null; count: number
  median: number | null; p25: number | null; p75: number | null
  condition?: CardCondition; conditionCount?: number; countAllStandards?: number; smallSample: boolean
}
export type TransactionsView = { count: number; median: number; p25: number | null; p75: number | null; asOf: string; note: string }
export type MarketCardView =
  | { kind: 'none' }                                    // blad / flaga CRM off / odpowiedz niespojna: bez karty i bez komunikatu
  | { kind: 'nodata' }                                  // API odpowiedzialo, ale obie sekcje bez wystarczajacych danych: uczciwy komunikat, bez karty
  | { kind: 'card'; asOfDate: string | null; band: string | null; offers: OffersView | null; transactions: TransactionsView | null }

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null)
const isCond = (v: unknown): v is CardCondition => typeof v === 'string' && (CARD_CONDITIONS as readonly string[]).includes(v)

/** Zamienia odpowiedz API na model widoku; wszystko niespojne = 'none' lub pusta sekcja (fail-closed, bez zgadywania). */
export function interpretMarketCard(status: number, body: unknown): MarketCardView {
  if (status !== 200 || !body || typeof body !== 'object') return { kind: 'none' }
  const b = body as Record<string, any>
  if (b.ok !== true) return { kind: 'none' }
  let offers: OffersView | null = null
  const o = b.offers
  if (o && o.available === true && (o.level === 'ulica' || o.level === 'dzielnica' || o.level === 'miasto')) {
    const count = num(o.count)
    if (count != null && count > 0 && num(o.median_price_per_m2) != null) {
      offers = {
        level: o.level, place: str(o.place), count, median: num(o.median_price_per_m2), p25: num(o.range?.p25), p75: num(o.range?.p75),
        ...(isCond(o.condition) ? { condition: o.condition, conditionCount: num(o.condition_count) ?? count, countAllStandards: num(o.count_all_standards) ?? undefined } : {}),
        smallSample: o.warning === 'mala_proba' || (isCond(o.condition) && (num(o.condition_count) ?? count) < MARKET_CARD_MIN_SAMPLE),
      }
    }
  }
  let transactions: TransactionsView | null = null
  const t = b.transactions
  if (t && t.available === true && num(t.count) != null && num(t.median_price_per_m2) != null && /^\d{2}\.\d{4}$/.test(String(t.as_of))) {
    transactions = {
      count: t.count, median: t.median_price_per_m2, p25: num(t.range?.p25), p75: num(t.range?.p75), asOf: t.as_of,
      note: str(t.note) ?? 'wszystkie standardy, rejestr nie zawiera stanu',
    }
  }
  if (!offers && !transactions) return { kind: 'nodata' }
  return { kind: 'card', asOfDate: str(b.as_of_date), band: str(b.band?.label), offers, transactions }
}

export type MarketCardDeps = { fetchImpl?: typeof fetch; url?: string; timeoutMs?: number }

/** Pobiera karte; nigdy nie rzuca (blad = 'none'). condition = filtr stanu TYLKO dla cen ofertowych. */
export async function fetchMarketCard(token: string, condition: CardCondition | null, deps: MarketCardDeps = {}): Promise<MarketCardView> {
  try {
    const f = deps.fetchImpl ?? fetch
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer = ctrl ? setTimeout(() => ctrl.abort(), deps.timeoutMs ?? 8000) : null
    try {
      const res = await f(deps.url ?? MARKET_CARD_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valuation_token: token, ...(condition ? { condition } : {}) }),
        ...(ctrl ? { signal: ctrl.signal } : {}),
      })
      let body: unknown = null
      try { body = await res.json() } catch { /* pusta odpowiedz */ }
      return interpretMarketCard(res.status, body)
    } finally { if (timer) clearTimeout(timer) }
  } catch { return { kind: 'none' } }
}

/** Licznik lejka: karta wyswietlona (wariant 'market_card' kroku consent_screen; nowy krok wymagalby zmiany CHECK po stronie CRM). */
export function trackCardShown(): boolean { return sendFunnelStep('consent_screen', { variant: 'market_card' }) }

// ── formatowanie (PL) ──
export const fmtPln = (n: number): string => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}\u00a0zł`
export const fmtPpm = (n: number): string => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}\u00a0zł/m²`
export const fmtRange = (lo: number | null, hi: number | null): string | null => (lo != null && hi != null ? `${fmtPpm(lo)} – ${fmtPpm(hi)}` : null)
export const fmtAsOfDate = (iso: string | null): string | null => {
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null
  return m ? `${m[3]}.${m[2]}.${m[1]}` : null
}

export const CONDITION_LABELS: Record<CardCondition, string> = {
  do_remontu: 'do remontu', do_zamieszkania: 'do zamieszkania', deweloperski: 'deweloperski', do_wykonczenia: 'do wykończenia',
}

// ── okno kontaktu ──
export const CONTACT_WINDOWS = ['rano', 'poludnie', 'wieczor'] as const
export type ContactWindow = (typeof CONTACT_WINDOWS)[number]
export const CONTACT_WINDOW_LABELS: Record<ContactWindow, string> = { rano: 'Rano', poludnie: 'W południe', wieczor: 'Wieczorem' }