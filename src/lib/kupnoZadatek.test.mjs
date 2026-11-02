import test from 'node:test'
import assert from 'node:assert/strict'
import { ZADATEK_ITEMS, ZADATEK_OUTRO, ZADATEK_HEADING, ZADATEK_CTA_HREF, zadatekIntro } from './kupnoZadatek.ts'

test('wstęp liczy punkty listy (4 i 3 po usunięciu wariantu)', () => {
  assert.equal(zadatekIntro(), 'Przed wpłatą zadatku sprawdź cztery rzeczy.')
  assert.equal(zadatekIntro(ZADATEK_ITEMS.filter(i => i.id !== 'lokal-zamieszkany')), 'Przed wpłatą zadatku sprawdź trzy rzeczy.')
})

test('punkty mają unikalne id, a wariant bez "kto mieszka" istnieje', () => {
  const ids = ZADATEK_ITEMS.map(i => i.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(ids.includes('lokal-zamieszkany'))
})

test('tekst bez obietnic, cen i nazw inwestycji', () => {
  const all = [ZADATEK_HEADING, ZADATEK_OUTRO, ...ZADATEK_ITEMS.flatMap(i => [i.title, i.desc])].join(' ')
  assert.doesNotMatch(all, /gwarant|zawsze|na pewno|bezpiecznie|zł|\d/i)
  assert.doesNotMatch(all, /Państw/)
})

test('CTA to wewnętrzny link', () => {
  assert.match(ZADATEK_CTA_HREF, /^\/[a-z-]+$/)
})
