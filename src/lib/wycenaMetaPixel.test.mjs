import test from 'node:test'
import assert from 'node:assert/strict'
import { trackConsentedWycenaLead } from './wycenaMetaPixel.ts'

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
