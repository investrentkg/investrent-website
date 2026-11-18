// Uruchom: node --test src/lib/gclidDisclosure.test.mjs
// Warunek Prawnika 13.11: zdanie o gclid w polityce (PL i DE) oraz sama wysylka gclid wchodza TYLKO za flaga NEXT_PUBLIC_GCLID_DISCLOSURE
// (ten sam moment co GCLID_FULL_CAPTURE_ENABLED w CRM), a nie z bumpem zgody v5.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = p => readFileSync(new URL(p, import.meta.url), 'utf8')

test('consent.ts: flaga GCLID_DISCLOSURE_ENABLED domyslnie OFF (tylko "on" wlacza)', () => {
  const s = read('./consent.ts')
  assert.match(s, /GCLID_DISCLOSURE_ENABLED: boolean = process\.env\.NEXT_PUBLIC_GCLID_DISCLOSURE === 'on'/)
})

test('polityka PL: zdanie o gclid tylko za flaga (zdanie nie jest w tekscie bezwarunkowo)', () => {
  const s = read('../app/(pl)/rodo/page.tsx')
  assert.match(s, /\{GCLID_DISCLOSURE \? ' Po wycofaniu zgody „Reklamowe” nasza strona usuwa[^']*\(gclid, gbraid lub wbraid\)[^']*90 dniach[^']*nie później niż w terminie miesiąca[^']*' : ' Po wycofaniu zgody pliki cookie są usuwane natychmiast\.'\}/)
  assert.equal((s.match(/\(gclid, gbraid lub wbraid\)/g) ?? []).length, 1)
  assert.match(s, /ir_gclid, ir_gclid_type/)
})

test('polityka DE: zdanie o gclid tylko za flaga', () => {
  const s = read('../app/(de)/de/datenschutz/page.tsx')
  assert.match(s, /\{GCLID_DISCLOSURE \? ' Nach Widerruf der Einwilligung „Werbung“ löscht unsere Website[^']*\(gclid, gbraid oder wbraid\)[^']*Erfolgsmessung unserer Werbung[^']*90 Tage[^']*innerhalb eines Monats[^']*' : ' Nach Widerruf der Einwilligung werden die Cookies sofort gelöscht\.'\}/)
  assert.equal((s.match(/\(gclid, gbraid oder wbraid\)/g) ?? []).length, 1)
  assert.match(s, /ir_gclid, ir_gclid_type/)
})

test('wysylka gclid: hasGoogleAdsConsent wymaga flagi v5 ORAZ flagi ujawnienia ORAZ zgody Reklamowe', () => {
  const s = read('./consentStore.ts')
  assert.match(s, /hasGoogleAdsConsent\(\): boolean \{ return GOOGLE_ADS_CONSENT_ENABLED && GCLID_DISCLOSURE_ENABLED && adsAllowed\(getConsent\(\)\) \}/)
})

test('wycofanie zgody Reklamowe kasuje tez localStorage _gcl_ls (gclid trzymany przez tag Google), test 0.4 14.11', async () => {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync(new URL('./consentStore.ts', import.meta.url), 'utf8')
  assert.match(src, /if \(clearMeta\) \{ try \{ window\.localStorage\.removeItem\('_gcl_ls'\)/)
})