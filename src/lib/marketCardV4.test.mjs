import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeMarketCardV4 } from './marketCardV4.ts'

const card = {
  kind: 'card',
  asOfDate: '2026-10-28',
  band: '45-55 m2',
  transactions: { count: 10, median: 12000, p25: 10000, p75: 14000, asOf: '10.2026', note: '' },
  offers: { level: 'miasto', place: 'Gdynia', count: 18, median: 13000, p25: 11000, p75: 15000, smallSample: false },
}

test('V4 przelicza osobno kwartyle transakcji i ofert na wybrany metraż', () => {
  assert.deepEqual(summarizeMarketCardV4(card, 45), {
    kind: 'card',
    transactions: { low: 450000, high: 630000, count: 10 },
    offers: { low: 495000, high: 675000, count: 18 },
  })
})

test('V4 nie wylicza kwot bez metrażu ani przy niepełnych kwartylach', () => {
  assert.deepEqual(summarizeMarketCardV4(card, null), { kind: 'card', transactions: null, offers: null })
  assert.equal(summarizeMarketCardV4({ ...card, offers: { ...card.offers, p75: null } }, 45).offers, null)
})

test('V4 fail-closed dla pustej próby, błędnych zakresów i nierozpoznanej karty', () => {
  assert.equal(summarizeMarketCardV4({ ...card, transactions: { ...card.transactions, p25: 15000 } }, 45).transactions, null)
  assert.deepEqual(summarizeMarketCardV4({ kind: 'nodata' }, 45), { kind: 'nodata', transactions: null, offers: null })
  assert.deepEqual(summarizeMarketCardV4({ kind: 'none' }, 45), { kind: 'none', transactions: null, offers: null })
})
