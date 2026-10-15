// Uruchom: node --test src/lib/localityOffers.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { foldCity, summarizeCity, formatThousands, formatOffersCount, formatPriceCell, MIN_SAMPLE_FOR_PRICE, formatRcnCell, MIN_SAMPLE_FOR_RCN_MEDIAN } from './localityOffers.ts'

const o = (city, p) => ({ address_city: city, price_per_m2: p })

test('foldCity: ogonki, wielkość liter, spacje', () => {
  assert.equal(foldCity('  Sianożęty '), 'sianozety')
  assert.equal(foldCity('DŹWIRZYNO'), 'dzwirzyno')
  assert.equal(foldCity('Ustronie  Morskie'), 'ustronie morskie')
  assert.equal(foldCity(null), '')
})

test('summarizeCity: przy próbie < 3 tylko liczba ofert, bez cen', () => {
  const s = summarizeCity([o('Grzybowo', 4852), o('Grzybowo', 6715), o('Kołobrzeg', 13000)], ['Grzybowo'])
  assert.equal(s.count, 2)
  assert.equal(s.price, null)
  assert.equal(MIN_SAMPLE_FOR_PRICE, 3)
})

test('summarizeCity: przy 3 ofertach zakres i mediana; aliasy liczą się razem', () => {
  const s = summarizeCity([o('Sianożęty', 18900), o('sianozety', 20400), o('Sianożęty', 23400), o('Dźwirzyno', 20349)], ['Sianożęty'])
  assert.equal(s.count, 3)
  assert.deepEqual(s.price, { min: 18900, max: 23400, median: 20400, n: 3 })
})

test('summarizeCity: oferty bez ceny za m² nie wchodzą do próby (ale liczą się w count)', () => {
  const s = summarizeCity([o('Sianożęty', 18900), o('Sianożęty', null), o('Sianożęty', 0), o('Sianożęty', 21000)], ['Sianożęty'])
  assert.equal(s.count, 4)
  assert.equal(s.price, null)
})

test('formatowanie: tysiące, liczebniki, komórka ceny', () => {
  assert.equal(formatThousands(18900), '18,9')
  assert.equal(formatThousands(23400), '23,4')
  assert.equal(formatOffersCount(0), 'zapytaj w biurze')
  assert.equal(formatOffersCount(1), '1 oferta')
  assert.equal(formatOffersCount(3), '3 oferty')
  assert.equal(formatOffersCount(5), '5 ofert')
  assert.equal(formatOffersCount(12), '12 ofert')
  assert.equal(formatPriceCell({ count: 0, price: null }), '—')
  assert.equal(formatPriceCell({ count: 2, price: null }), 'zbyt mało ofert do zakresu')
  assert.equal(formatPriceCell({ count: 3, price: { min: 18900, max: 23400, median: 20400, n: 3 } }), 'od ok. 18,9 do 23,4 tys. zł/m², mediana ok. 20,4 (3 oferty)')
})

test('RCN: mediana tylko przy próbie >= 10; poziom gminy opisany; brak próby nazwany wprost', () => {
  assert.equal(MIN_SAMPLE_FOR_RCN_MEDIAN, 10)
  assert.equal(formatRcnCell(null), '—')
  assert.equal(formatRcnCell({ n: 3, medianPerM2: null, period: 'od 10.2024' }), 'brak wystarczającej próby (3 transakcje)')
  assert.equal(formatRcnCell({ n: 7, medianPerM2: 18500, period: 'od 10.2024' }), 'brak wystarczającej próby (7 transakcji)')
  assert.equal(formatRcnCell({ n: 49, medianPerM2: 12578, period: '10.2024–12.2025' }), 'mediana ok. 12,6 tys. zł/m² (49 transakcji, 10.2024–12.2025)')
  assert.equal(formatRcnCell({ n: 158, medianPerM2: 12462, period: '01.2025–01.2026', level: 'gmina' }), 'gmina: mediana ok. 12,5 tys. zł/m² (158 transakcji, 01.2025–01.2026)')
})
