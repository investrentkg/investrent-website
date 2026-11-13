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
  assert.match(s, /\{GCLID_DISCLOSURE && ' Jeśli zgoda „Reklamowe” została udzielona, identyfikator kliknięcia reklamy Google \(gclid\)[^']*90 dniach[^']*'\}/)
  assert.equal((s.match(/\(gclid\)/g) ?? []).length, 1)
})

test('polityka DE: zdanie o gclid tylko za flaga', () => {
  const s = read('../app/(de)/de/datenschutz/page.tsx')
  assert.match(s, /\{GCLID_DISCLOSURE && ' Haben Sie in „Werbung“ eingewilligt, kann die Google-Klick-Kennung \(gclid\)[^']*90 Tagen[^']*'\}/)
  assert.equal((s.match(/\(gclid\)/g) ?? []).length, 1)
})

test('wysylka gclid: hasGoogleAdsConsent wymaga flagi v5 ORAZ flagi ujawnienia ORAZ zgody Reklamowe', () => {
  const s = read('./consentStore.ts')
  assert.match(s, /hasGoogleAdsConsent\(\): boolean \{ return GOOGLE_ADS_CONSENT_ENABLED && GCLID_DISCLOSURE_ENABLED && adsAllowed\(getConsent\(\)\) \}/)
})
