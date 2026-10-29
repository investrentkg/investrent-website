import test from 'node:test'
import assert from 'node:assert/strict'
import { trackConsentedWycenaLead, createWycenaMetaEventId, buildWycenaMetaTracking } from './wycenaMetaPixel.ts'

const eventId = 'wyc_1234567890abcdef'

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
    assert.equal(buildWycenaMetaTracking({ ...input, eventId, readCookie: () => { reads++; return '_fbp=x' }, search: '?fbclid=y' }), undefined)
  }
  assert.equal(reads, 0)
})

test('tracking payload uses allowlisted consented attribution and browser identifiers only', () => {
  const payload = buildWycenaMetaTracking({
    enabled: true, marketingConsent: true, eventId,
    readCookie: () => '_fbp=fb.1.123.abc; _fbc=fb.1.124.def; unrelated=secret',
    search: '?fbclid=click123&email=person%40example.test',
    attribution: { utm_source: 'meta', utm_campaign: 'wycena', fbclid_present: true, phone: '600100200' },
  })
  assert.deepEqual(payload, { event_id: eventId, marketing_consent: true, fbp: 'fb.1.123.abc', fbc: 'fb.1.124.def', fbclid: 'click123', utm: { utm_source: 'meta', utm_campaign: 'wycena' } })
  assert.ok(!JSON.stringify(payload).includes('600100200'))
  assert.ok(!JSON.stringify(payload).includes('person'))
})

test('event ids are valid and fail closed when secure randomness is unavailable', () => {
  assert.equal(createWycenaMetaEventId(() => '12345678-1234-1234-1234-123456789abc'), 'wyc_12345678-1234-1234-1234-123456789abc')
  assert.equal(createWycenaMetaEventId(() => { throw new Error('unavailable') }), null)
})
