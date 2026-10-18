// Uruchom: node --test src/lib/sprzedazSeo.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SPRZEDAZ_TITLE, SPRZEDAZ_H1, SPRZEDAZ_META_DESCRIPTION, FOREIGN_H2, FOREIGN_TEXT_B, VALUATION_CTA_LABEL, NEW_FAQ, HOME_TEXT_A,
} from './sprzedazSeo.ts'

const ALL = [SPRZEDAZ_TITLE, SPRZEDAZ_H1, SPRZEDAZ_META_DESCRIPTION, FOREIGN_H2, FOREIGN_TEXT_B, VALUATION_CTA_LABEL, HOME_TEXT_A,
  ...NEW_FAQ.flatMap(f => [f.q, f.a])]

test('meta description /sprzedaz ma ok. 105 znakow i nie wspomina o zagranicy', () => {
  assert.ok(SPRZEDAZ_META_DESCRIPTION.length >= 95 && SPRZEDAZ_META_DESCRIPTION.length <= 115, String(SPRZEDAZ_META_DESCRIPTION.length))
  assert.ok(!/zagrani|inwestor/i.test(SPRZEDAZ_META_DESCRIPTION))
})
test('H1 zgodny z fraza glowna', () => {
  assert.equal(SPRZEDAZ_H1, 'Sprzedaż mieszkania w Kołobrzegu')
})
test('tekst B i FAQ maja zastrzezenie, ze nie dotyczy kazdej oferty', () => {
  assert.ok(FOREIGN_TEXT_B.includes('Nie dotyczy to każdej oferty.'))
  assert.ok(NEW_FAQ[0].a.includes('Nie dotyczy to każdej oferty.'))
  assert.equal(NEW_FAQ.length, 3)
})
test('zakazy: bez bezplatnie, bez cyfr, bez nazw krajow', () => {
  for (const t of ALL) {
    assert.ok(!/bezp[łl]atn/i.test(t), t)
    assert.ok(!/\d/.test(t), t)
    assert.ok(!/niemc|niemie|\bDE\b|german|szwajc|austri|dani[ai]|holand|szwed/i.test(t), t)
  }
})
