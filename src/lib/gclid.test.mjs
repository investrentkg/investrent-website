// Uruchom: node --test src/lib/gclid.test.mjs   (Node >= 22.6, natywne strip-types)
// Pelna wartosc gclid do CRM TYLKO przy zgodzie "Reklamowe" v5 (decyzja Daniela 13.11).
import test from 'node:test'
import assert from 'node:assert/strict'
import { GCLID_STORAGE_KEY, parseGclidValue, captureGclid, readGclid, attributionWithGclid } from './gclid.ts'
import { buildLeadRequest } from './valuation.ts'

function memStorage(initial = {}) {
  const m = new Map(Object.entries(initial))
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)) }, _m: m }
}
const brokenStorage = { getItem() { throw new Error('SecurityError') }, setItem() { throw new Error('QuotaExceeded') } }
const G = 'TEST1234567890'
const values = { property_type: 'mieszkanie', city: 'Kołobrzeg', district: '', area_m2: '50', rooms: '2', floor: '', condition: '' }

test('parseGclidValue: poprawny ksztalt, zachowana wielkosc liter', () => {
  assert.equal(parseGclidValue('?gclid=' + G), G)
  assert.equal(parseGclidValue('?utm_source=google&gclid=Cj0KCQ_abc-DEF123'), 'Cj0KCQ_abc-DEF123')
})

test('parseGclidValue: zly ksztalt / brak -> null', () => {
  assert.equal(parseGclidValue(''), null)
  assert.equal(parseGclidValue('?gclid=krotki'), null)
  assert.equal(parseGclidValue('?gclid=' + 'a'.repeat(129)), null)
  assert.equal(parseGclidValue('?gclid=abc%20def%3Cscript%3E123'), null)
})

test('zgoda ON: gclid zapisany i odczytany', () => {
  const s = memStorage()
  assert.equal(captureGclid('?gclid=' + G, true, s), G)
  assert.equal(s._m.get(GCLID_STORAGE_KEY), G)
  assert.equal(readGclid(true, s), G)
})

test('zgoda OFF: nic nie zapisuje', () => {
  const s = memStorage()
  assert.equal(captureGclid('?gclid=' + G, false, s), null)
  assert.equal(s._m.size, 0)
})

test('zgoda OFF: nie odczytuje nawet gdy wartosc zostala w storage (wycofanie zgody)', () => {
  const s = memStorage({ [GCLID_STORAGE_KEY]: G })
  assert.equal(readGclid(false, s), null)
})

test('odczyt: zepsuta wartosc w storage jest odrzucana', () => {
  assert.equal(readGclid(true, memStorage({ [GCLID_STORAGE_KEY]: 'zly znak!' })), null)
})

test('storage niedostepny: nie rzuca', () => {
  assert.equal(captureGclid('?gclid=' + G, true, brokenStorage), G)
  assert.equal(readGclid(true, brokenStorage), null)
})

test('attributionWithGclid: zgoda ON dokleja wartosc, zachowuje UTM', () => {
  const s = memStorage({ [GCLID_STORAGE_KEY]: G })
  assert.deepEqual(attributionWithGclid({ utm_source: 'google' }, true, s), { utm_source: 'google', gclid: G })
  assert.deepEqual(attributionWithGclid(null, true, s), { gclid: G })
})

test('attributionWithGclid: zgoda OFF -> atrybucja bez zmian, brak gclid', () => {
  const s = memStorage({ [GCLID_STORAGE_KEY]: G })
  const a = { utm_source: 'google', gclid_present: true }
  assert.equal(attributionWithGclid(a, false, s), a)
  assert.equal(attributionWithGclid(null, false, s), null)
})

test('lead request: zgoda ON -> attribution.gclid w zadaniu; OFF -> brak', () => {
  const s = memStorage({ [GCLID_STORAGE_KEY]: G })
  const base = { name: 'Jan', phone: '600100200', values, outcome: null, utm: '' }
  const on = buildLeadRequest({ ...base, attribution: attributionWithGclid(null, true, s) })
  assert.equal(on.attribution.gclid, G)
  const off = buildLeadRequest({ ...base, attribution: attributionWithGclid(null, false, s) })
  assert.ok(!('attribution' in off))
  assert.ok(!JSON.stringify(off).includes(G))
})
