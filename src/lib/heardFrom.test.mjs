// Uruchom: node --test src/lib/heardFrom.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { HEARD_FROM_OPTIONS, normalizeHeardFrom } from './heardFrom.ts'

test('lista zamknięta zgodna z kontraktem CRM (małe litery, dokładnie te wartości)', () => {
  assert.deepEqual(HEARD_FROM_OPTIONS.map(o => o.value), ['google', 'facebook', 'instagram', 'polecenie', 'olx_otodom', 'tablica_baner', 'inne'])
})

test('normalizacja: wartość z listy przechodzi, reszta i brak wyboru dają undefined', () => {
  assert.equal(normalizeHeardFrom('google'), 'google')
  assert.equal(normalizeHeardFrom('tablica_baner'), 'tablica_baner')
  assert.equal(normalizeHeardFrom(''), undefined)
  assert.equal(normalizeHeardFrom('Google'), undefined)
  assert.equal(normalizeHeardFrom('<b>x</b>'), undefined)
  assert.equal(normalizeHeardFrom(undefined), undefined)
})

test('brak wyboru: pole nie trafia do JSON-a żądania (undefined jest pomijane)', () => {
  const body = JSON.parse(JSON.stringify({ full_name: 'A', source: 'contact_form', heard_from: normalizeHeardFrom('') }))
  assert.equal('heard_from' in body, false)
  const withValue = JSON.parse(JSON.stringify({ heard_from: normalizeHeardFrom('facebook') }))
  assert.equal(withValue.heard_from, 'facebook')
})