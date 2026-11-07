// Uruchom: node --test src/lib/offerDescription.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOfferDescription, normalizeForCompare, blocksToText } from './offerDescription.ts'

const same = (raw) => assert.equal(normalizeForCompare(blocksToText(parseOfferDescription(raw))), normalizeForCompare(raw))

test('naglowek WIELKIMI LITERAMI, lista, akapity, lead', () => {
  const raw = 'Przytulne mieszkanie w centrum.\n\nUDOGODNIENIA\n* balkon\n• winda\n- piwnica\n\nZapraszamy na prezentacje.'
  const b = parseOfferDescription(raw)
  assert.deepEqual(b.map(x => x.type), ['lead', 'heading', 'list', 'paragraph'])
  assert.deepEqual(b[2].items, ['balkon', 'winda', 'piwnica'])
  same(raw)
})

test('opis AI jednym ciagiem z " * " srodliniowymi', () => {
  const raw = 'Mieszkanie 42 m². Sprzęty AGD: * zmywarka, * piekarnik, * lodówka'
  const b = parseOfferDescription(raw)
  const list = b.find(x => x.type === 'list')
  assert.deepEqual(list.items, ['zmywarka,', 'piekarnik,', 'lodówka'])
  same(raw)
})

test('krotki srodtytul przed gwiazdka: "Najwazniejsze informacje * Powierzchnia..."', () => {
  const b = parseOfferDescription('Najważniejsze informacje * Powierzchnia 42 m² * Piętro 2')
  assert.equal(b[0].type, 'heading')
  assert.equal(b[1].type, 'list')
  assert.equal(b[1].items.length, 2)
})

test('gwiazdka w liczbach/jednostkach nie dzieli', () => {
  const raw = 'Wymiar 2 * 3 m oraz 5*6 m.'
  const b = parseOfferDescription(raw)
  assert.deepEqual(b.map(x => x.type), ['lead'])
  assert.equal(b[0].text, raw)
})

test('zwykly tekst bez struktury = jeden lead, tresc identyczna', () => {
  const raw = 'Jedno zdanie. Drugie zdanie.'
  assert.deepEqual(parseOfferDescription(raw), [{ type: 'lead', text: raw }])
})

test('nigdy nie gubi tresci; brak h1/h2 w typach', () => {
  const raw = 'LOKALIZACJA\nBlisko morza (200 m).\nWYPOSAŻENIE:\n* szafa\n* łóżko\nCena do negocjacji.'
  same(raw)
  for (const b of parseOfferDescription(raw)) assert.ok(['lead', 'heading', 'paragraph', 'list'].includes(b.type))
})

test('pusty opis', () => {
  assert.deepEqual(parseOfferDescription(''), [])
})

test('samodzielna krotka linia bez kropki miedzy pustymi liniami = srodtytul', () => {
  const raw = 'Tytul oferty | 42 m²\n\nWnętrze, które zachwyca i zapewnia komfort\n\nPrzemyślany układ pomieszczeń.\n\n* salon\n* sypialnia'
  const b = parseOfferDescription(raw)
  assert.deepEqual(b.map(x => x.type), ['lead', 'heading', 'paragraph', 'list'])
  same(raw)
})
