// Uruchom: node --test src/lib/responseTime.test.mjs
// Obietnica czasu reakcji (decyzja Daniela 18.10.2026): 24 godziny, bez „60 minut”.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { RESPONSE_FULL, RESPONSE_SHORT, RESPONSE_BADGE, RESPONSE_SENTENCE, CHAT_RESPONSE_NOTE } from './responseTime.ts'

test('stale obietnicy 24 h', () => {
  assert.equal(RESPONSE_FULL, 'jak najszybciej, nie później niż w ciągu 24 godzin')
  assert.equal(RESPONSE_SHORT, 'najpóźniej w ciągu 24 godzin')
  assert.equal(RESPONSE_BADGE, 'do 24 godz.')
  assert.equal(RESPONSE_SENTENCE, 'Skontaktujemy się jak najszybciej, nie później niż w ciągu 24 godzin.')
})

test('meta stron <= 160 znakow i bez starych fraz', () => {
  const files = ['../app/layout.tsx', '../app/kontakt/page.tsx', '../app/kupno/page.tsx']
  for (const f of files) {
    const src = readFileSync(new URL(f, import.meta.url), 'utf8')
    for (const m of src.matchAll(/description:\s*'([^']*)'/g)) assert.ok(m[1].length <= 160, `${f}: ${m[1].length} zn.`)
    assert.ok(!/60 ?min|w dni robocze i w weekendy|tego samego dnia|gwarantowan/i.test(src), f)
  }
})

test('komunikat czatu dosłownie (wariant A) i użyty w widgecie', () => {
  assert.equal(CHAT_RESPONSE_NOTE, 'Najczęściej odpisujemy do 15 minut. Czasem może to potrwać dłużej, ale nie później niż w ciągu 24 godzin.')
  const w = readFileSync(new URL('../components/ChatWidget.tsx', import.meta.url), 'utf8')
  assert.ok(!/w kilka minut/i.test(w))
  assert.equal((w.match(/\{CHAT_RESPONSE_NOTE\}/g) || []).length, 2)
})