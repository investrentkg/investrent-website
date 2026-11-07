// Uruchom: node --test src/lib/deOffers.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { DE_OFFERS_MAX, selectDeOffers, dePrice, deArea, deOfferTitle, deOfferStatusLabel } from './deOffers.ts'

const base = { transaction_type: 'sprzedaz', property_type: 'mieszkanie', status: 'opublikowana', price: 500000, area: 50 }

test('wybór: tylko sprzedaż mieszkań i domów z ceną i metrażem, najnowsze pierwsze, limit', () => {
  const list = [
    { ...base, id: 'a', created_at: '2026-10-01T00:00:00Z' },
    { ...base, id: 'b', created_at: '2026-10-20T00:00:00Z' },
    { ...base, id: 'najem', transaction_type: 'wynajem' },
    { ...base, id: 'dzialka', property_type: 'dzialka' },
    { ...base, id: 'bezceny', price: null },
    { ...base, id: 'bezmetrazu', area: 0 },
    { ...base, id: 'sprzedana', status: 'sprzedana' },
    { ...base, id: 'dom', property_type: 'dom', created_at: '2026-10-10T00:00:00Z' },
  ]
  assert.deepEqual(selectDeOffers(list).map(o => o.id), ['b', 'dom', 'a'])
  const many = Array.from({ length: 12 }, (_, i) => ({ ...base, id: `x${i}`, created_at: `2026-10-${String(i + 1).padStart(2, '0')}T00:00:00Z` }))
  assert.equal(selectDeOffers(many).length, DE_OFFERS_MAX)
  assert.equal(selectDeOffers(many)[0].id, 'x11')
})

test('zarezerwowana zostaje i ma etykietę Reserviert', () => {
  assert.equal(selectDeOffers([{ ...base, id: 'r', status: 'zarezerwowana' }]).length, 1)
  assert.equal(deOfferStatusLabel('zarezerwowana'), 'Reserviert')
  assert.equal(deOfferStatusLabel('opublikowana'), null)
})

test('formaty: cena z kropką tysięcy, metraż z przecinkiem', () => {
  assert.equal(dePrice(770000).replace(/\s/g, ' '), '770.000 PLN')
  assert.equal(deArea(54.2), '54,2 m²')
  assert.equal(deArea(50), '50 m²')
})

test('tytuł: typ, metraż, pokoje, miasto z dzielnicą, bez ulicy', () => {
  const t = deOfferTitle({ id: '1', property_type: 'mieszkanie', area: 54.2, rooms_count: 3, address_city: 'Kołobrzeg', address_district: 'Zachód', address_street: 'Tajna 5' })
  assert.equal(t, 'Wohnung · 54,2 m² · 3 Zimmer · Kołobrzeg (Zachód)')
  assert.ok(!t.includes('Tajna'))
  assert.equal(deOfferTitle({ id: '2', property_type: 'dom', area: 120, address_city: 'Kołobrzeg' }), 'Haus · 120 m² · Kołobrzeg')
})
