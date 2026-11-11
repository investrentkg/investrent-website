// Uruchom: node --test src/lib/kupujLanding.test.mjs
// Test na poziomie zrodla: strona /kupuj-z-investrent (Ads) jest noindex, poza sitemapa i wysyla poprawny payload leada.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const dir = new URL('../app/(pl)/kupuj-z-investrent/', import.meta.url)
const page = readFileSync(new URL('page.tsx', dir), 'utf8')
const client = readFileSync(new URL('KupujPage.tsx', dir), 'utf8')
const sitemap = readFileSync(new URL('../app/(pl)/sitemap.ts', import.meta.url), 'utf8')

test('strona jest noindex/nofollow z kanonicznym adresem', () => {
  assert.match(page, /index:\s*false/)
  assert.match(page, /follow:\s*false/)
  assert.match(page, /canonical:\s*'https:\/\/www\.investrent\.com\.pl\/kupuj-z-investrent'/)
})
test('strony nie ma w sitemapie', () => {
  assert.ok(!sitemap.includes('kupuj-z-investrent'))
})
test('payload leada: source ads_kupno, client_type buyer, znacznik kanalu, preferred_city', () => {
  assert.match(client, /SOURCE\s*=\s*'ads_kupno'/)
  assert.match(client, /client_type:\s*'buyer'/)
  assert.match(client, /source:\s*SOURCE/)
  assert.match(client, /preferred_city/)
  assert.match(client, /Kanał: Google Ads, strona \/kupuj-z-investrent/)
})
test('zakazy tresci: bez "bezplatnie" i bez "agent InvestRent"', () => {
  assert.ok(!/bezp[łl]atn/i.test(client))
  assert.ok(!/agent InvestRent/i.test(client))
})
