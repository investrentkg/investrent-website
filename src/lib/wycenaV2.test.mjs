import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { WYCENA_V2_TEXTS as V2 } from '../app/(pl)/wycena/wycenaV2Texts.ts'

// wynik_v2: opinia Prawnika 09.11 i decyzje Daniela: bez nazwy dostawcy i skrotu RCN w UI, "bez uwzglednienia stanu", zastrzezenie na stale.
const allText = JSON.stringify(V2) + ['title', 'desc', 'meta'].map(() => '').join('')

test('teksty v2: zero nazwy dostawcy i skrotu RCN, zero slowa "Cenogram"', () => {
  const sample = [V2.offers.desc(50, false), V2.sold.desc(50), V2.sold.meta(66, '10.2026'), V2.offers.meta(212, '09.11.2026'), V2.diff.body, V2.diff.moreBody, V2.disclaimer, V2.sold.emptyBody, allText].join(' ')
  assert.doesNotMatch(sample, /cenogram|RCN/i)
})

test('"bez uwzględnienia stanu" jest w opisie sprzedanych oraz ofert bez filtra stanu', () => {
  assert.match(V2.sold.desc(50), /bez uwzględnienia stanu/)
  assert.match(V2.offers.desc(50, false), /bez uwzględnienia stanu/)
  assert.doesNotMatch(V2.offers.desc(50, true), /bez uwzględnienia stanu/) // przy wybranym stanie oferty sa filtrowane
})

test('oferta = prosza, sprzedane = faktycznie zaplacili; ramka mowi o starszych zasobach i slabszych stanach; nie uśredniamy', () => {
  assert.match(V2.offers.desc(50, false), /proszą/)
  assert.match(V2.sold.desc(50), /faktycznie zapłacili/)
  assert.match(V2.diff.body, /starsze mieszkania i słabsze stany/)
  assert.match(V2.diff.body, /nie uśredniamy/)
  assert.match(V2.diff.moreBody, /symbolicznej/)
})

test('liczba porównań z poprawną polską odmianą', () => {
  assert.match(V2.sold.meta(1, '10.2026'), /1 transakcja/)
  assert.match(V2.sold.meta(3, '10.2026'), /3 transakcje/)
  assert.match(V2.sold.meta(12, '10.2026'), /12 transakcji/)
  assert.match(V2.sold.meta(66, '10.2026'), /66 transakcji/)
  assert.match(V2.offers.meta(212, null), /212 ogłoszeń/)
  assert.match(V2.offers.meta(3, null), /3 ogłoszenia/)
})

test('za mało danych: tytuł i wyjaśnienie progu 8', () => {
  assert.equal(V2.sold.emptyTitle, 'Za mało danych')
  assert.match(V2.sold.emptyBody, /mniej niż 8/)
})

test('zastrzeżenie: automatycznie, nie operat, nie oferta ceny', () => {
  assert.match(V2.disclaimer, /automatycznie/)
  assert.match(V2.disclaimer, /nie jest operatem rzeczoznawcy ani ofertą ceny|nie jest operat rzeczoznawcy ani oferta ceny/)
})

test('flagi: wynik_v2 domyślnie OFF i tylko z układem v4; WycenaClient nie wysyła zmiany bez flagi', async () => {
  const flags = await readFile(new URL('./wycenaFlags.ts', import.meta.url), 'utf8')
  assert.match(flags, /WYCENA_RESULT_V2_ELIGIBLE: boolean = WYCENA_RESULT_V2_MODE !== 'off' && WYCENA_LAYOUT_V4_ACTIVE/)
  assert.match(flags, /NEXT_PUBLIC_WYCENA_RESULT_V2 === 'on'/)
  const client = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.match(client, /variant: v2Arm === 'v2' \? 'wynik_v2' : 'wynik_v1'/)
  assert.match(client, /showAi=\{!v2Active && showAiEstimate\(cardKind\)\}/)
})
