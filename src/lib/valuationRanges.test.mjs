// Uruchom: node --test src/lib/valuationRanges.test.mjs   (Node >= 22.6, natywne strip-types)
// Dwa zakresy w wyniku kalkulatora (range_core = wezszy, range_wide = szerszy), zgodnosc wsteczna z `range`.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { interpretResponse, formatRange } from './valuation.ts'
import { T } from '../app/wycena/texts.ts'

const base = { ok: true, mode: 'range', range: { low: 560000, high: 1050000 }, price_per_m2: { low: 10800, high: 20200 }, comparables: { min: 20, max: 49 }, quality: 'high', disclaimer: 'x', message: 'm' }
const two = { ...base, range_core: { low: 680000, high: 930000 }, range_wide: { low: 560000, high: 1050000 }, price_per_m2_core: { low: 13100, high: 17900 }, price_per_m2_wide: { low: 10800, high: 20200 }, label_core: 'a', label_wide: 'b' }

test('dwa zakresy: poprawna odpowiedz -> rangeCore/rangeWide i ceny za m2, range bez zmian', () => {
  const r = interpretResponse(200, two)
  assert.equal(r.kind, 'range')
  assert.deepEqual(r.rangeCore, { low: 680000, high: 930000 }); assert.deepEqual(r.rangeWide, { low: 560000, high: 1050000 })
  assert.deepEqual(r.pricePerM2Core, { low: 13100, high: 17900 }); assert.deepEqual(r.pricePerM2Wide, { low: 10800, high: 20200 })
  assert.deepEqual(r.range, { low: 560000, high: 1050000 })
})
test('stary backend (bez range_core/range_wide): pojedynczy range jak dotad, brak dwoch zakresow', () => {
  const r = interpretResponse(200, base)
  assert.equal(r.kind, 'range'); assert.equal(r.rangeCore, null); assert.equal(r.rangeWide, null); assert.deepEqual(r.range, base.range)
})
test('niespojne zakresy (wezszy poza szerszym) -> oba ignorowane, widok pokaze range', () => {
  const r = interpretResponse(200, { ...two, range_core: { low: 500000, high: 930000 } })
  assert.equal(r.kind, 'range'); assert.equal(r.rangeCore, null); assert.equal(r.rangeWide, null)
})
test('tylko jeden z zakresow lub bledne liczby -> ignorowane', () => {
  assert.equal(interpretResponse(200, { ...base, range_core: { low: 680000, high: 930000 } }).rangeCore, null)
  assert.equal(interpretResponse(200, { ...two, range_core: { low: 900000, high: 100 } }).rangeCore, null)
})
test('ceny za m2 dwoch zakresow tylko gdy obie poprawne', () => {
  const r = interpretResponse(200, { ...two, price_per_m2_wide: null })
  assert.ok(r.rangeCore); assert.equal(r.pricePerM2Core, null); assert.equal(r.pricePerM2Wide, null)
})
test('range niepoprawny -> no_numbers nawet gdy dwa zakresy poprawne (nigdy zgadywana liczba)', () => {
  assert.equal(interpretResponse(200, { ...two, range: { low: 5, high: 1 } }).kind, 'no_numbers')
})
test('teksty dwoch zakresow: miasto domowe z deklaracja pokrycia, inne miejscowosci bez liczb procentowych', () => {
  assert.ok(T.result.coreNote.includes('ok. połowa')); assert.ok(T.result.wideNote.includes('ok. 75%'))
  assert.ok(!/\d+\s?%|połowa/.test(T.result.coreNoteWider + T.result.wideNoteWider), 'poza miastem domowym bez deklaracji pokrycia')
  assert.equal(T.result.coreTitle, 'Najbardziej prawdopodobny przedział'); assert.equal(T.result.wideTitle, 'Szerszy przedział, w którym mieści się większość cen')
})
test('widok: dwa zakresy renderowane z texts.ts, fallback do pojedynczego range, brak pol backendu label_*', () => {
  const src = fs.readFileSync(new URL('../app/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  const jsx = src.split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
  const range = jsx.slice(jsx.indexOf("outcome.kind === 'range'"), jsx.indexOf("outcome.kind === 'no_numbers'"))
  for (const s of ['outcome.rangeCore && outcome.rangeWide', '{T.result.coreTitle}', '{T.result.wideTitle}', 'formatRange(outcome.rangeCore)', 'formatRange(outcome.rangeWide)', 'formatRange(outcome.range)', '{T.result.priceLabel}', '{T.disclaimerTop}']) assert.ok(range.includes(s), 'brak: ' + s)
  assert.ok(!/label_core|label_wide/.test(jsx), 'front pokazuje wlasne teksty, nie pola label_* backendu')
  assert.equal(formatRange({ low: 680000, high: 930000 }).includes('–'), true)
})
