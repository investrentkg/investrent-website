import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8')
const comp = read('../components/CurrentOffersLinks.tsx')
const sprzedaz = read('../app/(pl)/sprzedaz/page.tsx')
const blog = read('../app/(pl)/blog/[slug]/page.tsx')

test('/sprzedaz i szablon bloga renderuja CurrentOffersLinks', () => {
  for (const src of [sprzedaz, blog]) {
    assert.match(src, /import CurrentOffersLinks from '@\/components\/CurrentOffersLinks'/)
    assert.match(src, /<CurrentOffersLinks \/>/)
  }
})
test('komponent nie zawiera metadata, H1 ani JSON-LD', () => {
  assert.ok(!/metadata|generateMetadata|<h1|application\/ld\+json|canonical/i.test(comp))
})
test('komponent: zwykle linki <a href>, kategorie, blok pusty przy braku ofert, H2 "Aktualne oferty"', () => {
  assert.match(comp, /<a href=\{`\/oferty\//)
  assert.match(comp, /\/mieszkania-na-sprzedaz-kolobrzeg/)
  assert.match(comp, /\/domy-na-sprzedaz-kolobrzeg/)
  assert.match(comp, />Aktualne oferty<\/h2>/)
  assert.match(comp, /if \(!offers\.length\) return null/)
  assert.match(comp, /catch/)
  assert.ok(!/'use client'|"use client"/.test(comp), 'komponent serwerowy')
})
