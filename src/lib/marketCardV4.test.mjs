import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
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

test('V4 ukrywa kwoty przy próbie mniejszej niż 8 i pokazuje obie niezależne wartości od progu', () => {
  const small = {
    ...card,
    transactions: { ...card.transactions, count: 7 },
    offers: { ...card.offers, count: 7 },
  }
  assert.deepEqual(summarizeMarketCardV4(small, 45), { kind: 'card', transactions: null, offers: null })
  const normal = summarizeMarketCardV4(card, 45)
  assert.equal(normal.transactions?.low, 450000)
  assert.equal(normal.offers?.low, 495000)
})

test('V4 używa liczby ofert po filtrze stanu przy ocenie próby', () => {
  const filtered = { ...card, offers: { ...card.offers, count: 18, condition: 'do_remontu', conditionCount: 6 } }
  assert.equal(summarizeMarketCardV4(filtered, 45).offers, null)
})

test('V4 widok zachowuje kolejność transakcyjne potem ofertowe i jest bramkowany flagą', async () => {
  const marketCard = await readFile(new URL('../app/wycena/MarketCard.tsx', import.meta.url), 'utf8')
  const client = await readFile(new URL('../app/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  const phoneBlock = await readFile(new URL('../app/wycena/PhoneBlock.tsx', import.meta.url), 'utf8')
  const v4Texts = await readFile(new URL('../app/wycena/wycenaV4Texts.ts', import.meta.url), 'utf8')
  assert.ok(marketCard.indexOf('wy-v4-transactions-title') < marketCard.indexOf('wy-v4-offers-title'))
  assert.match(marketCard, /WYCENA_LAYOUT_V4_ACTIVE\) return <V4MarketCard/)
  assert.match(client, /marketCardSlot=\{WYCENA_LAYOUT_V4_ACTIVE && outcome\.kind === 'range'/)
  assert.ok(client.indexOf('{marketCardSlot}') < client.indexOf('wy-v4-ai'))
  assert.ok(client.indexOf('wy-v4-ai') < client.indexOf('{leadSlot ??'))
  assert.match(client, /LeadPanel outcome=\{outcome\} values=\{submittedValues\} v4Contact/)
  assert.match(phoneBlock, /mc && !WYCENA_LAYOUT_V4_ACTIVE && <MarketCard/)
  assert.match(marketCard, /if \(!summary\.transactions && !summary\.offers\) return null/)
  assert.match(marketCard, /placeText\(offers\).*V4\.cityFallback/)
  assert.match(v4Texts, /To dwie różne wartości, nie uśredniamy ich\./)
  assert.match(v4Texts, /Nie podajemy prognoz cen\./)
})
