// Uruchom: node --test src/lib/valuation.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validateForm, buildPayload, interpretResponse, requestEstimate, buildLeadNotes,
  isValidPhone, readUtm, EMPTY_FORM, fieldApplies,
} from './valuation.ts'

const ok = { ...EMPTY_FORM, property_type: 'mieszkanie', area_m2: '52,5', rooms: '3', floor: '2', condition: 'dobry' }
const json = (body, status = 200) => async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

test('walidacja: pusty formularz -> brak typu i powierzchni, miasto domyslnie Kolobrzeg', () => {
  const e = validateForm(EMPTY_FORM)
  assert.ok(e.property_type); assert.ok(e.area_m2); assert.equal(e.city, undefined)
})
test('walidacja: poprawny formularz bez bledow', () => assert.deepEqual(validateForm(ok), {}))
test('walidacja: metraz poza zakresem i pietro niecalkowite', () => {
  assert.ok(validateForm({ ...ok, area_m2: '5' }).area_m2)
  assert.ok(validateForm({ ...ok, area_m2: '2500' }).area_m2)
  assert.ok(validateForm({ ...ok, floor: '2.5' }).floor)
  assert.equal(validateForm({ ...ok, property_type: 'dzialka', area_m2: '2500', rooms: 'x' }).area_m2, undefined)
})
test('payload: liczby, honeypot pusty, dzialka bez pokoi/pietra/stanu', () => {
  const p = buildPayload(ok)
  assert.equal(p.area_m2, 52.5); assert.equal(p.rooms, 3); assert.equal(p.floor, 2); assert.equal(p.website, '')
  const d = buildPayload({ ...ok, property_type: 'dzialka' })
  assert.equal(d.rooms, undefined); assert.equal(d.floor, undefined); assert.equal(d.condition, undefined)
  assert.equal(fieldApplies('dom', 'floor'), false)
})
test('payload: turnstile_token dolaczany tylko gdy jest', () => {
  assert.equal(buildPayload(ok, '', 'tok').turnstile_token, 'tok'); assert.equal('turnstile_token' in buildPayload(ok), false)
})
test('odpowiedz: range', () => {
  const r = interpretResponse(200, { ok: true, mode: 'range', range: { low: 400000, high: 480000 }, price_per_m2: { low: 8000, high: 9500 }, comparables: { min: 10, max: 19 }, quality: 'srednia', disclaimer: 'x', message: 'm' })
  assert.equal(r.kind, 'range'); assert.equal(r.range.low, 400000); assert.equal(r.pricePerM2.high, 9500)
})
test('odpowiedz: range z blednymi widelkami -> no_numbers (nigdy zgadywana liczba)', () => {
  assert.equal(interpretResponse(200, { ok: true, mode: 'range', range: { low: 500, high: 100 } }).kind, 'no_numbers')
  assert.equal(interpretResponse(200, { ok: true, mode: 'range' }).kind, 'no_numbers')
})
test('odpowiedz: no_numbers, 429, 503, 400, smieci', () => {
  assert.equal(interpretResponse(200, { ok: true, mode: 'no_numbers', message: 'a' }).kind, 'no_numbers')
  const rl = interpretResponse(429, { ok: false, error: 'rate_limited', retry_after_seconds: 3600 })
  assert.equal(rl.kind, 'rate_limited'); assert.equal(rl.retryAfterSeconds, 3600)
  assert.equal(interpretResponse(503, { ok: false, error: 'disabled' }).kind, 'disabled')
  assert.equal(interpretResponse(400, { error: 'bad' }).kind, 'invalid')
  assert.equal(interpretResponse(200, { ok: true, mode: 'cos' }).kind, 'error')
  assert.equal(interpretResponse(500, {}).kind, 'error')
})
test('requestEstimate: siec, HTML 502, 503 bez JSON, sukces', async () => {
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: async () => { throw new TypeError('x') } })).reason, 'network')
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: async () => new Response('<html>', { status: 502 }) })).reason, 'http')
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: async () => new Response('', { status: 503 }) })).kind, 'disabled')
  const r = await requestEstimate('http://x', buildPayload(ok), { fetchImpl: json({ ok: true, mode: 'no_numbers' }) })
  assert.equal(r.kind, 'no_numbers')
})
test('requestEstimate: timeout -> error timeout', async () => {
  const hang = (_u, init) => new Promise((_, rej) => init.signal.addEventListener('abort', () => rej(new Error('abort'))))
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: hang, timeoutMs: 20 })).reason, 'timeout')
})
test('telefon i UTM', () => {
  assert.ok(isValidPhone('731 554 341')); assert.ok(isValidPhone('+48731554341')); assert.ok(!isValidPhone('12345'))
  assert.equal(readUtm('?utm_source=meta&utm_campaign=wycena&x=1'), 'utm_source=meta utm_campaign=wycena')
})
test('notatka leada: dane, wynik, zgoda, UTM', () => {
  const n = buildLeadNotes(ok, { kind: 'range', range: { low: 400000, high: 480000 }, pricePerM2: null, comparables: null, quality: null, disclaimer: null, message: null }, 'utm_source=meta', 'TRESC ZGODY')
  assert.match(n, /Źródło: kalkulator wyceny \(z wynikiem: tak\)/); assert.match(n, /Mieszkanie, Kołobrzeg/); assert.match(n, /52,5 m²/); assert.match(n, /Zgoda na kontakt telefoniczny: TAK/); assert.match(n, /TRESC ZGODY/); assert.match(n, /utm_source=meta/)
})
