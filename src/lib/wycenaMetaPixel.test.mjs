import test from 'node:test'
import assert from 'node:assert/strict'
import { trackConsentedWycenaLead, createWycenaMetaEventId, buildWycenaMetaTracking, requestMetaConsentReceipt, pixelConsentAction } from './wycenaMetaPixel.ts'

const eventId = 'wyc_1234567890abcdef'
const receipt = 'v1.' + 'a'.repeat(20) + '.' + 'B'.repeat(43)

test('Meta Pixel Lead is not called without feature flag or marketing consent', () => {
  let calls = 0
  for (const [enabled, marketingConsent, pixelAvailable] of [[false, true, true], [true, false, true], [true, true, false]]) {
    assert.equal(trackConsentedWycenaLead({ enabled, marketingConsent, pixelAvailable, eventId, track: () => calls++ }), false)
  }
  assert.equal(calls, 0)
})

test('consented successful lead emits one event with an event id and no lead fields', () => {
  const events = []
  assert.equal(trackConsentedWycenaLead({ enabled: true, marketingConsent: true, pixelAvailable: true, eventId, track: (...args) => events.push(args) }), true)
  assert.deepEqual(events, [['Lead', { eventID: eventId }]])
})

test('invalid event id fails closed and a Pixel exception does not escape', () => {
  assert.equal(trackConsentedWycenaLead({ enabled: true, marketingConsent: true, pixelAvailable: true, eventId: 'bad id', track: () => assert.fail() }), false)
  assert.equal(trackConsentedWycenaLead({ enabled: true, marketingConsent: true, pixelAvailable: true, eventId, track: () => { throw new Error('blocked') } }), false)
})

test('tracking payload is absent without consent/flag and does not read Meta cookies', () => {
  let reads = 0
  for (const input of [
    { enabled: false, marketingConsent: true },
    { enabled: true, marketingConsent: false },
  ]) {
    assert.equal(buildWycenaMetaTracking({ ...input, eventId, consentReceipt: receipt, readCookie: () => { reads++; return '_fbp=x' }, search: '?fbclid=y' }), undefined)
  }
  assert.equal(reads, 0)
})

test('tracking payload uses allowlisted consented attribution and browser identifiers only', () => {
  const payload = buildWycenaMetaTracking({
    enabled: true, marketingConsent: true, eventId, consentReceipt: receipt,
    readCookie: () => '_fbp=fb.1.123.abc; _fbc=fb.1.124.def; unrelated=secret',
    search: '?fbclid=click123&email=person%40example.test',
    attribution: { utm_source: 'meta', utm_campaign: 'wycena', fbclid_present: true, phone: '600100200' },
  })
  assert.deepEqual(payload, { event_id: eventId, consent_receipt: receipt, fbp: 'fb.1.123.abc', fbc: 'fb.1.124.def', fbclid: 'click123', utm: { utm_source: 'meta', utm_campaign: 'wycena' } })
  assert.ok(!JSON.stringify(payload).includes('600100200'))
  assert.ok(!JSON.stringify(payload).includes('person'))
})

test('event ids are valid and fail closed when secure randomness is unavailable', () => {
  assert.equal(createWycenaMetaEventId(() => '12345678-1234-1234-1234-123456789abc'), 'wyc_12345678-1234-1234-1234-123456789abc')
  assert.equal(createWycenaMetaEventId(() => { throw new Error('unavailable') }), null)
})

// Zaakceptowane ryzyko "zawyzone zdarzenia": marketing_consent/source w publicznym requestcie deklaruje wywolujacy
// (rekomendacja Dyrektora, do potwierdzenia przez Daniela). Zabezpieczenie: metadane CAPI nie niosa PII.
test('tracking metadata has only whitelisted keys and no phone/email (accepted risk: inflated events)', () => {
  const payload = buildWycenaMetaTracking({
    enabled: true, marketingConsent: true, eventId, consentReceipt: receipt,
    readCookie: () => '_fbp=fb.1.123.abc; _fbc=fb.1.124.def',
    search: '?fbclid=a%40b.pl',
    attribution: { utm_source: 'meta', utm_medium: 'cpc', utm_campaign: 'c', utm_content: 'x', utm_term: 'y', email: 'a@b.pl', phone: '600100200', name: 'Jan', source: 'forged' },
  })
  const allowedTop = new Set(['event_id', 'consent_receipt', 'fbp', 'fbc', 'fbclid', 'utm'])
  const allowedUtm = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'])
  for (const key of Object.keys(payload)) assert.ok(allowedTop.has(key), `niedozwolony klucz: ${key}`)
  for (const key of Object.keys(payload.utm)) assert.ok(allowedUtm.has(key), `niedozwolony klucz utm: ${key}`)
  assert.equal(payload.fbclid, undefined)
  const json = JSON.stringify(payload)
  assert.ok(!/600100200|a@b\.pl|a%40b|Jan|forged/.test(json))
})

test('bez paragonu zgody (brak, zly format, deklaracja boolean) nie powstaje meta_tracking i cookies Meta nie sa czytane', () => {
  let reads = 0
  for (const consentReceipt of [null, undefined, '', 'garbage', true, 'v1.abc.def', 'v1.' + 'a'.repeat(20) + '.' + 'B'.repeat(42)]) {
    assert.equal(buildWycenaMetaTracking({ enabled: true, marketingConsent: true, eventId, consentReceipt, readCookie: () => { reads++; return '_fbp=x' }, search: '' }), undefined)
  }
  assert.equal(reads, 0)
})

test('payload z paragonem nie niesie deklaratywnego marketing_consent', () => {
  const payload = buildWycenaMetaTracking({ enabled: true, marketingConsent: true, eventId, consentReceipt: receipt, readCookie: () => '', search: '' })
  assert.deepEqual(payload, { event_id: eventId, consent_receipt: receipt })
  assert.ok(!('marketing_consent' in payload))
})

const okFetch = (body, init = {}) => async (url, opts) => { okFetch.calls.push({ url, opts }); return { ok: true, json: async () => body, ...init } }
okFetch.calls = []

test('paragon: wysyla event_id, zgode i token Turnstile pod wskazany adres, zwraca receipt', async () => {
  okFetch.calls = []
  const got = await requestMetaConsentReceipt({ enabled: true, marketingConsent: true, eventId, url: 'https://x.test/api/public/valuation/meta-consent-receipt', turnstileToken: 'ts-1', fetchImpl: okFetch({ ok: true, receipt }) })
  assert.equal(got, receipt)
  assert.equal(okFetch.calls.length, 1)
  assert.equal(okFetch.calls[0].url, 'https://x.test/api/public/valuation/meta-consent-receipt')
  assert.deepEqual(JSON.parse(okFetch.calls[0].opts.body), { event_id: eventId, marketing_consent: true, turnstileToken: 'ts-1' })
})

test('paragon fail closed: brak flagi/zgody/event_id = zero zapytan; blad sieci, HTTP != 200, ok != true, zly receipt = null', async () => {
  okFetch.calls = []
  const base = { enabled: true, marketingConsent: true, eventId, url: 'https://x.test/r', fetchImpl: okFetch({ ok: true, receipt }) }
  for (const patch of [{ enabled: false }, { marketingConsent: false }, { eventId: null }, { eventId: 'bad id' }]) assert.equal(await requestMetaConsentReceipt({ ...base, ...patch }), null)
  assert.equal(okFetch.calls.length, 0)
  assert.equal(await requestMetaConsentReceipt({ ...base, fetchImpl: async () => { throw new Error('offline') } }), null)
  assert.equal(await requestMetaConsentReceipt({ ...base, fetchImpl: okFetch({ ok: true, receipt }, { ok: false, status: 400 }) }), null)
  assert.equal(await requestMetaConsentReceipt({ ...base, fetchImpl: okFetch({ ok: false, receipt }) }), null)
  assert.equal(await requestMetaConsentReceipt({ ...base, fetchImpl: okFetch({ ok: true, receipt: 'nope' }) }), null)
  assert.equal(await requestMetaConsentReceipt({ ...base, fetchImpl: async () => ({ ok: true, json: async () => { throw new Error('html') } }) }), null)
})

test('bez paragonu przegladarkowy Lead nie jest odpalany (eventId z braku paragonu = undefined)', () => {
  const tracking = buildWycenaMetaTracking({ enabled: true, marketingConsent: true, eventId, consentReceipt: null, readCookie: () => '', search: '' })
  let calls = 0
  assert.equal(trackConsentedWycenaLead({ enabled: true, marketingConsent: true, pixelAvailable: true, eventId: tracking?.event_id ?? '', track: () => calls++ }), false)
  assert.equal(calls, 0)
})

test('wycofanie zgody Marketing = revoke Pixela (nie grant), przy wylaczonej fladze/braku ID nic', () => {
  assert.equal(pixelConsentAction({ enabled: true, pixelId: '123', marketingConsent: true }), 'grant')
  assert.equal(pixelConsentAction({ enabled: true, pixelId: '123', marketingConsent: false }), 'revoke')
  assert.equal(pixelConsentAction({ enabled: false, pixelId: '123', marketingConsent: true }), 'none')
  assert.equal(pixelConsentAction({ enabled: true, pixelId: '', marketingConsent: true }), 'none')
})