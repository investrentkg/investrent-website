// Uruchom: node --test src/lib/attribution.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ATTRIBUTION_STORAGE_KEY, captureAttribution, getAttribution, mergeAttribution,
  normalizeAttributionValue, parseAttribution, readStoredAttribution, withAttribution,
} from './attribution.ts'
import { postLead } from './leadSubmit.ts'
import { buildLeadRequest, buildPayload } from './valuation.ts'

function memStorage(initial = {}) {
  const m = new Map(Object.entries(initial))
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)) }, _m: m }
}
const brokenStorage = {
  getItem() { throw new Error('SecurityError') },
  setItem() { throw new Error('QuotaExceeded') },
}

test('normalizacja: male litery, trim, biala lista, max 64', () => {
  assert.equal(normalizeAttributionValue('  Facebook '), 'facebook')
  assert.equal(normalizeAttributionValue('wycena_ai.kolobrzeg-09'), 'wycena_ai.kolobrzeg-09')
  assert.equal(normalizeAttributionValue('a'.repeat(100)), 'a'.repeat(64))
  assert.equal(normalizeAttributionValue('zle znaki'), null)
  assert.equal(normalizeAttributionValue('http://x.pl'), null)
  assert.equal(normalizeAttributionValue('<b>x</b>'), null)
  assert.equal(normalizeAttributionValue('żółw'), null)
  assert.equal(normalizeAttributionValue(''), null)
  assert.equal(normalizeAttributionValue(123), null)
})

test('parsowanie: cztery pola utm, nieznane parametry ignorowane, zle wartosci odrzucane', () => {
  const a = parseAttribution('?utm_source=Facebook&utm_medium=paid&utm_campaign=c_1&utm_content=ad-7&utm_term=x&foo=bar')
  assert.deepEqual(a, { utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'c_1', utm_content: 'ad-7' })
  assert.deepEqual(parseAttribution('?utm_source=ok&utm_campaign=ze znaki'), { utm_source: 'ok' })
  assert.equal(parseAttribution('?utm_campaign=a+b'), null)
  assert.equal(parseAttribution(''), null)
  assert.equal(parseAttribution('?foo=1'), null)
})

test('fbclid: tylko flaga, nigdy wartosc', () => {
  const a = parseAttribution('?utm_source=facebook&fbclid=IwAR0SECRETVALUE')
  assert.deepEqual(a, { utm_source: 'facebook', fbclid_present: true })
  assert.ok(!JSON.stringify(a).includes('SECRET'))
  assert.deepEqual(parseAttribution('?fbclid=abc'), { fbclid_present: true })
  assert.equal(parseAttribution('?fbclid='), null)
})

test('pierwszenstwo: pierwsze dotkniecie wygrywa, rozne niepuste utm nadpisuja', () => {
  const s = memStorage()
  assert.deepEqual(captureAttribution('?utm_source=facebook&utm_campaign=a', s), { utm_source: 'facebook', utm_campaign: 'a' })
  // wejscie bez parametrow nie zmienia
  assert.deepEqual(captureAttribution('', s), { utm_source: 'facebook', utm_campaign: 'a' })
  assert.deepEqual(captureAttribution('?foo=1', s), { utm_source: 'facebook', utm_campaign: 'a' })
  // te same utm - bez zmian
  assert.deepEqual(captureAttribution('?utm_source=facebook&utm_campaign=a', s), { utm_source: 'facebook', utm_campaign: 'a' })
  // rozne niepuste utm - nadpisanie
  assert.deepEqual(captureAttribution('?utm_source=google&utm_campaign=b', s), { utm_source: 'google', utm_campaign: 'b' })
  assert.deepEqual(getAttribution(s), { utm_source: 'google', utm_campaign: 'b' })
})

test('sam fbclid nie nadpisuje utm, tylko ustawia flage', () => {
  assert.deepEqual(
    mergeAttribution({ utm_source: 'facebook' }, { fbclid_present: true }),
    { utm_source: 'facebook', fbclid_present: true },
  )
  assert.deepEqual(mergeAttribution(null, { fbclid_present: true }), { fbclid_present: true })
  assert.equal(mergeAttribution(null, null), null)
})

test('brak storage / storage rzuca wyjatki: nic nie wybucha', () => {
  assert.doesNotThrow(() => captureAttribution('?utm_source=facebook', brokenStorage))
  assert.deepEqual(captureAttribution('?utm_source=facebook', brokenStorage), { utm_source: 'facebook' })
  assert.equal(readStoredAttribution(brokenStorage), null)
  assert.equal(getAttribution(brokenStorage), null)
  assert.equal(captureAttribution('?utm_source=facebook', null)?.utm_source, 'facebook')
  assert.equal(getAttribution(null), null)
  // w node nie ma window -> domyslny storage = null, bez wyjatku
  assert.equal(getAttribution(), null)
})

test('odczyt ze storage ponownie waliduje (reczna podmiana)', () => {
  const s = memStorage({ [ATTRIBUTION_STORAGE_KEY]: JSON.stringify({ utm_source: 'http://zly', utm_medium: 'PAID', fbclid_present: 'tak', x: 1 }) })
  assert.deepEqual(readStoredAttribution(s), { utm_medium: 'paid' })
  assert.equal(readStoredAttribution(memStorage({ [ATTRIBUTION_STORAGE_KEY]: '{zepsuty json' })), null)
})

test('withAttribution: dokleja tylko niepuste, bez zmiany ciala gdy brak', () => {
  const body = { phone: 'x', source: 'hero_sell' }
  assert.equal(withAttribution(body, null), body)
  assert.equal(withAttribution(body, {}), body)
  assert.deepEqual(withAttribution(body, { utm_source: 'facebook' }), { ...body, attribution: { utm_source: 'facebook' } })
  const own = { ...body, attribution: { utm_source: 'a' } }
  assert.equal(withAttribution(own, { utm_source: 'b' }), own)
})

const values = { property_type: 'mieszkanie', city: 'Kołobrzeg', district: '', area_m2: '50', rooms: '2', floor: '', condition: '' }

test('cialo zadania wyceny zawiera attribution tylko gdy istnieje', () => {
  const attr = { utm_source: 'facebook', utm_medium: 'test', utm_campaign: 'c', fbclid_present: true }
  assert.deepEqual(buildPayload(values, '', null, attr).attribution, attr)
  assert.ok(!('attribution' in buildPayload(values, '', null, null)))
  assert.ok(!('attribution' in buildPayload(values, '', null, {})))
  assert.ok(!('attribution' in buildPayload(values)))
})

test('cialo leada z kalkulatora zawiera attribution tylko gdy istnieje', () => {
  const base = { name: 'A', phone: '600000000', values, outcome: null, utm: '' }
  const attr = { utm_source: 'facebook', utm_medium: 'test' }
  assert.deepEqual(buildLeadRequest({ ...base, attribution: attr }).attribution, attr)
  assert.ok(!('attribution' in buildLeadRequest(base)))
  assert.ok(!('attribution' in buildLeadRequest({ ...base, attribution: null })))
})

test('end-to-end na poziomie wysylki: JSON body zadania ma attribution', async () => {
  let sent = null
  const fetchImpl = async (_u, init) => { sent = JSON.parse(init.body); return new Response('{"ok":true}', { status: 200 }) }
  const s = memStorage()
  captureAttribution('?utm_source=Facebook&utm_medium=test&fbclid=zzz', s)
  await postLead('http://x', withAttribution({ phone: '1', source: 'wycena_modal' }, getAttribution(s)), { fetchImpl })
  assert.deepEqual(sent.attribution, { utm_source: 'facebook', utm_medium: 'test', fbclid_present: true })
  await postLead('http://x', withAttribution({ phone: '1' }, getAttribution(memStorage())), { fetchImpl })
  assert.deepEqual(sent, { phone: '1' })
})
