import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { trackContactEvent, trackPhoneLinkClick, PHONE_DEDUPE_MS } from './track.ts'

function withGtag(fn) {
  const calls = []
  globalThis.window = { gtag: (...a) => calls.push(a) }
  try { fn(calls) } finally { delete globalThis.window }
  return calls
}

test('klik w tel: bez wlasnego onClick = jedno zdarzenie phone_click z placement tel_<sciezka>', () => {
  const calls = withGtag(() => {
    assert.equal(trackPhoneLinkClick('tel_/kontakt', 1_000_000), true)
  })
  assert.deepEqual(calls, [['event', 'phone_click', { placement: 'tel_/kontakt' }]])
})

test('klik z wlasnym onClick (trackContactEvent) i globalny nasluch w oknie dedupe = JEDNO zdarzenie, nie dwa', () => {
  const calls = withGtag(() => {
    trackContactEvent('phone_click', 'wycena_cta', 2_000_000)
    assert.equal(trackPhoneLinkClick('tel_/wycena', 2_000_000 + 5), false)
  })
  assert.equal(calls.length, 1)
  assert.equal(calls[0][2].placement, 'wycena_cta')
})

test('po oknie dedupe kolejny klik liczy sie osobno; inne zdarzenia (whatsapp_click) nie wplywaja na dedupe', () => {
  const calls = withGtag(() => {
    trackContactEvent('phone_click', 'a', 3_000_000)
    assert.equal(trackPhoneLinkClick('tel_/', 3_000_000 + PHONE_DEDUPE_MS + 1), true)
    trackContactEvent('whatsapp_click', 'b', 4_000_000)
    assert.equal(trackPhoneLinkClick('tel_/', 4_000_000 + PHONE_DEDUPE_MS + 1), true)
  })
  assert.equal(calls.length, 4)
})

test('bez gtag (brak zgody na analityke) nic nie rzuca; nasluch w layoucie, bez numeru w zdarzeniu', () => {
  assert.doesNotThrow(() => trackPhoneLinkClick('tel_/', 9_000_000))
  const layout = fs.readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')
  assert.ok(layout.includes('<TelClickTracker />'))
  const comp = fs.readFileSync(new URL('../components/TelClickTracker.tsx', import.meta.url), 'utf8')
  assert.ok(!/731|href\b.*getAttribute/.test(comp.replace(/\/\/.*$/gm, '')), 'komponent nie czyta ani nie wysyla numeru')
})
