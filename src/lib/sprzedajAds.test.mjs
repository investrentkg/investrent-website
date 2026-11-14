// Uruchom: node --test src/lib/sprzedajAds.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { sprzedajLeadAds, adsConsentMarker } from './sprzedajAds.ts'
import { GCLID_STORAGE_KEY } from './gclid.ts'

function memStorage(initial = {}) {
  const m = new Map(Object.entries(initial))
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)) } }
}
const G = 'TEST1234567890'
const NOW = new Date('2026-11-14T10:00:00.000Z')
const BASE = 'Kanał: Google Ads, strona /sprzedaj-z-investrent (prośba o telefon)'

test('znacznik ma format zgodny z parserem CRM', () => {
  assert.equal(adsConsentMarker(NOW), '[Zgoda-reklamowe] czas=2026-11-14T10:00:00.000Z; kanał=sprzedaj; wersja=5')
})
test('zgoda Reklamowe + gclid: gclid w atrybucji (UTM zachowane) i znacznik w notes', () => {
  const r = sprzedajLeadAds({ adsOk: true, notes: BASE, attribution: { utm_source: 'google' }, now: NOW, storage: memStorage({ [GCLID_STORAGE_KEY]: G }) })
  assert.deepEqual(r.attribution, { utm_source: 'google', gclid: G })
  assert.equal(r.notes, `${BASE}\n${adsConsentMarker(NOW)}`)
})
test('brak atrybucji (null) + gclid: sama atrybucja z gclid', () => {
  const r = sprzedajLeadAds({ adsOk: true, notes: BASE, attribution: null, now: NOW, storage: memStorage({ [GCLID_STORAGE_KEY]: G }) })
  assert.deepEqual(r.attribution, { gclid: G })
})
test('brak zgody Reklamowe: notes bez znacznika, brak klucza attribution (nawet gdy gclid w storage)', () => {
  const r = sprzedajLeadAds({ adsOk: false, notes: BASE, attribution: { utm_source: 'google' }, now: NOW, storage: memStorage({ [GCLID_STORAGE_KEY]: G }) })
  assert.deepEqual(r, { notes: BASE })
  assert.ok(!('attribution' in r))
})
test('zgoda, ale brak gclid albo zly ksztalt: bez znacznika i bez gclid', () => {
  assert.deepEqual(sprzedajLeadAds({ adsOk: true, notes: BASE, attribution: null, storage: memStorage() }), { notes: BASE })
  assert.deepEqual(sprzedajLeadAds({ adsOk: true, notes: BASE, attribution: null, storage: memStorage({ [GCLID_STORAGE_KEY]: 'x y' }) }), { notes: BASE })
})
test('storage niedostepny: nie rzuca', () => {
  const broken = { getItem() { throw new Error('SecurityError') }, setItem() {} }
  assert.deepEqual(sprzedajLeadAds({ adsOk: true, notes: BASE, attribution: null, storage: broken }), { notes: BASE })
})