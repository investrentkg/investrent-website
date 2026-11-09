import test from 'node:test'
import assert from 'node:assert/strict'
import { truncateAtWord } from './truncateAtWord.ts'

test('krotki tekst bez zmian', () => {
  assert.equal(truncateAtWord('Krotki tekst.', 240), 'Krotki tekst.')
  assert.equal(truncateAtWord('a'.repeat(240), 240), 'a'.repeat(240))
})

test('ciecie na granicy slowa, nie w polowie', () => {
  const t = 'Doceniam Wasza zyczliwosc, podejscie i pelen profesjonalizm w kazdej sprawie'
  const out = truncateAtWord(t, 60)
  assert.ok(out.endsWith('…'))
  const body = out.slice(0, -1)
  assert.ok(t.startsWith(body))
  assert.ok(/\s/.test(t.charAt(body.length)), 'za ucieciem musi byc spacja (pelne slowo)')
})

test('bez wiszacej kropki i interpunkcji przed wielokropkiem', () => {
  const out = truncateAtWord('Caly proces przebiegl sprawnie. Polecam wszystkim bardzo goraco', 33)
  assert.equal(out, 'Caly proces przebiegl sprawnie…')
  assert.ok(!out.includes('.…'))
})

test('spacja tuz za limitem zachowuje ostatnie slowo', () => {
  assert.equal(truncateAtWord('Ala ma kota i psa', 11), 'Ala ma kota…')
})

test('jedno dlugie slowo bez spacji ciete twardo', () => {
  assert.equal(truncateAtWord('x'.repeat(300), 100), 'x'.repeat(100) + '…')
})
