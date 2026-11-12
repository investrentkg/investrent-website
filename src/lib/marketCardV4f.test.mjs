import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  parseV4Raw, buildResultModel, totalFromPerM2, criteriaLabel, criteriaPlain, droppedKeys, entriesText, trendScale, periodLabel, fmtChange, fmtTys,
} from './marketCardV4f.ts'
import { interpretMarketCard, fetchMarketCard } from './marketCard.ts'
import { WYCENA_RESULT_V4F_TEXTS as R } from '../app/(pl)/wycena/wycenaResultV4fTexts.ts'

const crit = (o = {}) => ({ rooms: null, floor: null, condition: null, district: null, ...o })
const group = (count, median, p25, p75, criteria = crit()) => ({ criteria, count, median_price_per_m2: median, range: { p25, p75 } })
const txOk = (count = 116, trend) => ({ status: 'ok', section: { available: true, count, median_price_per_m2: 13100, range: { p25: 11800, p75: 14300 }, as_of: '10.2026', note: 'x' }, ...(trend ? { trend } : {}) })
const offersOk = (o = {}) => ({ status: 'ok', requested: crit({ rooms: '2', floor: '1_3' }), requested_count: 188, min_sample: 15, main: group(188, 15200, 14000, 16400, crit({ rooms: '2', floor: '1_3' })), wider: null, small_sample: false, ...o })
const trendOk = () => ({ status: 'ok', change_pct: 3.1, as_of: '2026-10-29', periods: [
  { from: '2025-11-01', to: '2026-01-31', count: 24, median_price_per_m2: 12700 }, { from: '2026-02-01', to: '2026-04-30', count: 31, median_price_per_m2: 12900 },
  { from: '2026-05-01', to: '2026-07-31', count: 33, median_price_per_m2: 13300 }, { from: '2026-08-01', to: '2026-10-29', count: 28, median_price_per_m2: 13100 }] })

test('parseV4Raw: poprawna odpowiedz -> model; niespojne -> null (karta dotychczasowa)', () => {
  const v = parseV4Raw({ offers: offersOk(), transactions: txOk(116, trendOk()) })
  assert.equal(v.transactions.status, 'ok'); assert.equal(v.transactions.trend.status, 'ok'); assert.equal(v.offers.main.count, 188)
  assert.equal(parseV4Raw(null), null); assert.equal(parseV4Raw({}), null)
  assert.equal(parseV4Raw({ offers: { status: 'ok', main: null }, transactions: { status: 'brak' } }), null) // ok bez grupy glownej
  assert.equal(parseV4Raw({ offers: null, transactions: { status: 'nieznany' } }), null)
  assert.equal(parseV4Raw({ offers: null, transactions: { status: 'ok', section: { available: false } } }), null)
})

test('prog 15 (po stronie backendu): front pokazuje za_malo / brak bez ceny; N=14 i N=15', () => {
  const m14 = buildResultModel(parseV4Raw({ offers: offersOk({ status: 'za_malo', requested_count: 14, main: null, wider: group(27, 15000, 13000, 17000, crit({ rooms: '2' })) }), transactions: { status: 'za_malo', count: 14, as_of: '10.2026' } }), 45)
  assert.equal(m14.tx.kind, 'za_malo'); assert.equal(m14.offers.kind, 'za_malo'); assert.equal(m14.answer, null)
  assert.equal(m14.offers.requestedCount, 14); assert.deepEqual(m14.offers.dropped, ['floor']) // requested rooms+floor, wider tylko rooms
  const m15 = buildResultModel(parseV4Raw({ offers: offersOk({ requested_count: 15, main: group(15, 15000, 13000, 17000, crit({ rooms: '2', floor: '1_3' })) }), transactions: txOk(15) }), 45)
  assert.equal(m15.tx.kind, 'ok'); assert.equal(m15.offers.kind, 'ok')
})

test('kwoty: caly przedzial z cen za m² x metraz; zaokraglenie 1 tys., przy malej probie (<30) do 5 tys.', () => {
  assert.equal(totalFromPerM2(11800, 45, false), 531000)
  assert.equal(totalFromPerM2(14300, 45, false), 644000)
  assert.equal(totalFromPerM2(13111, 45, false), 590000)
  assert.equal(totalFromPerM2(13111, 45, true), 590000)
  assert.equal(totalFromPerM2(13200, 45, true), 595000)
  const m = buildResultModel(parseV4Raw({ offers: offersOk(), transactions: txOk(116) }), 45)
  assert.equal(m.answer, 'Połowę mieszkań o podobnym metrażu sprzedano za 531–644 tys. zł.')
  const small = buildResultModel(parseV4Raw({ offers: offersOk({ small_sample: true }), transactions: txOk(20) }), 45)
  assert.equal(small.tx.band.small, true); assert.equal(small.offers.band.small, true)
  assert.equal(small.tx.band.low % 5000, 0); assert.equal(small.offers.band.high % 5000, 0)
})

test('zdanie o negocjacji: tylko gdy mediana ofert > mediana transakcji (Prawnik 11.11)', () => {
  const higher = buildResultModel(parseV4Raw({ offers: offersOk(), transactions: txOk(116) }), 45)
  assert.equal(higher.negotiation, true)
  const lower = buildResultModel(parseV4Raw({ offers: offersOk({ main: group(188, 12000, 11000, 13000) }), transactions: txOk(116) }), 45)
  assert.equal(lower.negotiation, false)
  const none = buildResultModel(parseV4Raw({ offers: null, transactions: txOk(116) }), 45)
  assert.equal(none.negotiation, false); assert.equal(none.offers, null)
})

test('etykiety kryteriow: Nie wiem/Nie wiem = bez filtra; 1 pokoj + parter; szersza grupa', () => {
  assert.equal(criteriaLabel(crit()), 'Bez filtra pokoi, piętra, stanu i dzielnicy')
  assert.equal(criteriaLabel(crit({ rooms: '2', floor: '1_3' })), 'Dla 2 pokoi, piętro 1–3')
  assert.equal(criteriaLabel(crit({ rooms: '1', floor: 'parter' })), 'Dla 1 pokoju, parter')
  assert.equal(criteriaPlain(crit({ rooms: '3', floor: '4_plus' })), '3 pokoje, piętro 4+')
  assert.deepEqual(droppedKeys(crit({ rooms: '3', floor: '4_plus', condition: 'do_remontu' }), crit({ rooms: '3', floor: '4_plus' })), ['condition'])
  const m = buildResultModel(parseV4Raw({ offers: { status: 'za_malo', requested: crit({ rooms: '3', floor: '4_plus', condition: 'do_remontu' }), requested_count: 9, min_sample: 15, main: null, wider: group(27, 15000, 13600, 16600, crit({ rooms: '3', floor: '4_plus' })), small_sample: true }, transactions: { status: 'brak' } }), 45)
  assert.equal(m.offers.kind, 'za_malo'); assert.equal(m.offers.requestedCount, 9); assert.equal(m.offers.label, 'Dla 3 pokoi, piętro 4+, stan do remontu')
  assert.equal(R.offers.widerNoteDropped(['stanu']), 'Nie uwzględnia filtra stanu.')
  assert.equal(entriesText(188).replace(/ /g, ' '), '188 wpisów z portali'); assert.equal(entriesText(1).replace(/ /g, ' '), '1 wpisu z portali')
})

test('brak ofert nawet bez filtrow: kafel z liczba i progiem, bez ceny', () => {
  const m = buildResultModel(parseV4Raw({ offers: { status: 'brak', requested: crit(), requested_count: 6, min_sample: 15, main: null, wider: null, small_sample: false }, transactions: txOk(116) }), 45)
  assert.equal(m.offers.kind, 'brak'); assert.equal(m.offers.requestedCount, 6)
})

test('trend: skala od zaokraglonego minimum (nie od zera), etykiety okresow 3-mies., zmiana z przecinkiem', () => {
  const sc = trendScale([12700, 12900, 13300, 13100])
  assert.ok(sc.min > 0 && sc.min <= 12700 && sc.max >= 13300 && sc.ticks.length >= 3)
  assert.ok(sc.ticks[0] === sc.min && sc.ticks[sc.ticks.length - 1] === sc.max)
  assert.equal(periodLabel({ from: '2026-08-01', to: '2026-10-29' }), '08–10.2026')
  assert.equal(periodLabel({ from: '2025-11-01', to: '2026-01-31' }), '11.2025–01.2026')
  assert.equal(fmtChange(3.1), '+3,1%'); assert.equal(fmtChange(-2), '−2%'); assert.equal(fmtChange(0), '0%')
  assert.equal(fmtTys(531000), '531')
})

test('interpretMarketCard: pole v4 tylko gdy poprawne; bez niego widok jak dotad (bez klucza v4)', () => {
  const v1 = { ok: true, as_of_date: '2026-11-11', band: { label: '35–55 m²' }, offers: { available: true, level: 'miasto', place: 'Kołobrzeg', count: 20, median_price_per_m2: 15000, range: { p25: 14000, p75: 16000 } }, transactions: { available: true, count: 30, median_price_per_m2: 13000, range: { p25: 12000, p75: 14000 }, as_of: '10.2026', note: 'x' } }
  const without = interpretMarketCard(200, v1)
  assert.equal(without.kind, 'card'); assert.equal('v4' in without, false)
  const withV4 = interpretMarketCard(200, { ...v1, v4: { offers: offersOk(), transactions: txOk() } })
  assert.equal(withV4.v4.offers.status, 'ok')
  assert.equal('v4' in interpretMarketCard(200, { ...v1, v4: { transactions: { status: 'zly' } } }), false)
})

test('fetchMarketCard: dzielnica trafia do body tylko gdy ustawiona', async () => {
  const calls = []
  const f = async (_u, init) => { calls.push(JSON.parse(init.body)); return { status: 200, json: async () => ({}) } }
  await fetchMarketCard('tok', null, { fetchImpl: f, filters: { rooms: '2', district: 'Centrum' } })
  await fetchMarketCard('tok', null, { fetchImpl: f, filters: { rooms: '2' } })
  assert.deepEqual(calls[0], { valuation_token: 'tok', rooms: '2', district: 'Centrum' })
  assert.deepEqual(calls[1], { valuation_token: 'tok', rooms: '2' })
})

test('teksty v4f: forma Ty, bez dostawcy danych, bez „po deduplikacji”, bez prognoz', () => {
  const all = JSON.stringify(R) + R.tx.tooFew(3, 15) + R.narrow.liveEntry('x', 'y')
  assert.doesNotMatch(all, /cenogram|RCN|po deduplikacji|bezpłatn/i)
  assert.match(R.legal, /Nie podajemy prognoz cen/); assert.match(R.legal, /nie jest operatem szacunkowym/)
  assert.match(R.trend.sub(15), /opis przeszłości, nie prognoza/)
  assert.match(R.concl, /Nie uśredniamy ich z transakcjami/)
})

test('wdrozenie: wynik v4f tylko za flaga NEXT_PUBLIC_WYCENA_RESULT_V4F i ukladem v4; bez v4 w odpowiedzi dotychczasowa karta; a11y', async () => {
  const flags = await readFile(new URL('./wycenaFlags.ts', import.meta.url), 'utf8')
  assert.match(flags, /process\.env\.NEXT_PUBLIC_WYCENA_RESULT_V4F === 'on'/)
  assert.match(flags, /WYCENA_RESULT_V4F_ELIGIBLE: boolean = WYCENA_RESULT_V4F_FLAG && WYCENA_LAYOUT_V4_ACTIVE/)
  const mc = await readFile(new URL('../app/(pl)/wycena/MarketCard.tsx', import.meta.url), 'utf8')
  assert.match(mc, /if \(v4f && v4Data && areaM2 && areaM2 > 0\)/)
  const res = await readFile(new URL('../app/(pl)/wycena/ResultV4f.tsx', import.meta.url), 'utf8')
  assert.match(res, /aria-expanded/); assert.match(res, /aria-pressed/); assert.match(res, /aria-live="polite"/); assert.match(res, /role="img"/)
  assert.match(res, /<table className="wy-r4-sr">/) // tekstowa alternatywa wykresu
  const client = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.match(client, /WYCENA_RESULT_V4F_ELIGIBLE \? \{ city/)
})
