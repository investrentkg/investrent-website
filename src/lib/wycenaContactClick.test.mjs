import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { sendFunnelStep, deviceFromWidth, isContactClickPath } from './funnel.ts'
import { whatsappTextFor, WHATSAPP_TEXT_V2 } from './wycenaWhatsapp.ts'

const capture = () => { const c = { body: null }; return { c, fetchImpl: async (_u, o) => { c.body = JSON.parse(o.body); return {} } } }

test('device: progi szerokosci, nieznana szerokosc = null', () => {
  assert.equal(deviceFromWidth(390), 'mobile')
  assert.equal(deviceFromWidth(767), 'mobile')
  assert.equal(deviceFromWidth(768), 'tablet')
  assert.equal(deviceFromWidth(1023), 'tablet')
  assert.equal(deviceFromWidth(1440), 'desktop')
  for (const bad of [0, -1, NaN, undefined, null, '1200']) assert.equal(deviceFromWidth(bad), null)
})

test('flaga device OFF: body bez pola device; ON: dokladnie jedna z trzech wartosci', () => {
  const a = capture()
  assert.equal(sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: a.fetchImpl, deviceEnabled: false, width: 390 }), true)
  assert.equal('device' in a.c.body, false)
  const b = capture()
  sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: b.fetchImpl, deviceEnabled: true, width: 390 })
  assert.equal(b.c.body.device, 'mobile')
  const c = capture()
  sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: c.fetchImpl, deviceEnabled: true })
  assert.equal('device' in c.c.body, false) // brak window w node = pole pomijane
})

test('contact_click: krok z reason tel|whatsapp, UTM z bialej listy, bez numeru i adresu', () => {
  const a = capture()
  sendFunnelStep('contact_click', { reason: 'whatsapp' }, { enabled: true, search: '?utm_source=meta&utm_campaign=k1&gclid=ABC', fetchImpl: a.fetchImpl, deviceEnabled: false })
  assert.deepEqual(a.c.body, { step: 'contact_click', utm_source: 'meta', utm_campaign: 'k1', reason: 'whatsapp' })
  const off = sendFunnelStep('contact_click', { reason: 'tel' }, { enabled: false })
  assert.equal(off, false)
})

test('contact_click liczony tylko na /wycena i /sprzedaj-z-investrent', () => {
  for (const p of ['/wycena', '/wycena/', '/sprzedaj-z-investrent', '/wycena/de']) assert.equal(isContactClickPath(p), true, p)
  for (const p of ['/', '/kontakt', '/oferty/x', '/wycenarka', '', null, undefined]) assert.equal(isContactClickPath(p), false, String(p))
})

test('tekst WhatsApp: flaga OFF = dotychczasowy, ON = zatwierdzony 19.11; zawiera rdzen rozpoznawany przez CRM', () => {
  assert.equal(whatsappTextFor(false, 'stary'), 'stary')
  assert.equal(whatsappTextFor(true, 'stary'), WHATSAPP_TEXT_V2)
  assert.equal(WHATSAPP_TEXT_V2, 'Dzień dobry, piszę w sprawie wyceny z kalkulatora InvestRent. Chcę ją omówić.')
  assert.match(WHATSAPP_TEXT_V2.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(), /kalkulator\w*\s+investrent/)
})

test('flagi domyslnie OFF i tracker podpiety pod flage + sciezki', () => {
  const flags = fs.readFileSync(new URL('./wycenaFlags.ts', import.meta.url), 'utf8')
  for (const f of ['NEXT_PUBLIC_WYCENA_FUNNEL_DEVICE', 'NEXT_PUBLIC_WYCENA_CONTACT_CLICK', 'NEXT_PUBLIC_WYCENA_WA_TEXT_V2']) assert.ok(flags.includes(`process.env.${f} === 'on'`), f)
  const tracker = fs.readFileSync(new URL('../components/TelClickTracker.tsx', import.meta.url), 'utf8')
  assert.ok(tracker.includes("sendFunnelStep('contact_click'") && tracker.includes('isContactClickPath(pathname)') && tracker.includes('WYCENA_CONTACT_CLICK_ON'))
})
