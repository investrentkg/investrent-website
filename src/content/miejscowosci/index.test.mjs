// Uruchom: node --test src/content/miejscowosci/index.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { LOCALITIES, isLocalityVisible } from './index.ts'

test('szkic hidden: niewidoczny na produkcji, widoczny w podglądzie', () => {
  const hidden = LOCALITIES.filter(l => l.status === 'hidden')
  assert.ok(hidden.length >= 1, 'oczekiwany szkic Trzebiatowa')
  const prev = process.env.VERCEL_ENV
  try {
    process.env.VERCEL_ENV = 'production'
    for (const l of hidden) assert.equal(isLocalityVisible(l), false, l.slug)
    process.env.VERCEL_ENV = 'preview'
    for (const l of hidden) assert.equal(isLocalityVisible(l), true, l.slug)
  } finally {
    if (prev === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prev
  }
})

test('draft i approved są widoczne zawsze', () => {
  const prev = process.env.VERCEL_ENV
  try {
    process.env.VERCEL_ENV = 'production'
    for (const l of LOCALITIES.filter(x => x.status !== 'hidden')) assert.equal(isLocalityVisible(l), true, l.slug)
  } finally {
    if (prev === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prev
  }
})

test('szkic Trzebiatowa: bez nazw inwestycji i bez liczb o transakcjach/czasie sprzedaży', () => {
  const t = LOCALITIES.find(l => l.slug === 'trzebiatow')
  assert.ok(t)
  assert.equal(t.status, 'hidden')
  const txt = JSON.stringify([t.summary, t.sections, t.faq])
  assert.ok(!/sprzedaliśmy|sprzedano|dni na rynku|klientów/i.test(txt))
})
