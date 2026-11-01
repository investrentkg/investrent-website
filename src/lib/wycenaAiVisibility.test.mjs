import test from 'node:test'
import assert from 'node:assert/strict'
import { showAiEstimate } from './wycenaAiVisibility.ts'

test('ocena AI ukryta tylko przy nodata (brak danych w rejestrach)', () => {
  assert.equal(showAiEstimate('nodata'), false)
})
test('ocena AI widoczna przy karcie, bledzie karty i w trakcie ladowania', () => {
  assert.equal(showAiEstimate('card'), true)
  assert.equal(showAiEstimate('none'), true)
  assert.equal(showAiEstimate(null), true)
})
