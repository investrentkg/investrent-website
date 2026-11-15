// Uruchomienie: node --test src/lib/googleAdsGuard.test.mjs (Node >= 22.6, natywne strip-types) albo `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { isGoogleAdsRequestUrl, GOOGLE_ADS_GUARD_SNIPPET, GOOGLE_ADS_PING_GUARD_ENABLED } from './googleAdsGuard.ts'

test('adresy reklamowe Google rozpoznane; GA4/GTM/zasoby własne nie', () => {
  for (const u of [
    'https://pagead2.googlesyndication.com/ccm/collect?tid=AW-16876191240&gcs=G101&npa=1',
    'https://www.googleadservices.com/pagead/conversion/16876191240/',
    'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1/',
    'https://stats.g.doubleclick.net/g/collect',
    'https://www.google.com/ccm/collect?tid=AW-1',
    'https://www.google.pl/pagead/1p-user-list/1',
    '//pagead2.googlesyndication.com/ccm/collect',
  ]) assert.equal(isGoogleAdsRequestUrl(u), true, u)
  for (const u of [
    'https://region1.google-analytics.com/g/collect?tid=G-N7XC7DMYQ3',
    'https://www.google-analytics.com/g/collect',
    'https://www.googletagmanager.com/gtag/js?id=G-N7XC7DMYQ3',
    'https://www.google.com/maps/embed',
    'https://www.google.com/recaptcha/api.js',
    'https://www.investrent.com.pl/wycena',
    '/api/leads', 'nie-url', '', null, undefined, 42,
    'https://evilgooglesyndication.com/x', 'https://googlesyndication.com.evil.pl/x',
  ]) assert.equal(isGoogleAdsRequestUrl(u), false, String(u))
  assert.equal(isGoogleAdsRequestUrl({ url: 'https://pagead2.googlesyndication.com/ccm/collect' }), true) // obiekt Request
})

test('straznik domyslnie wlaczony (flaga off wylacza)', () => {
  assert.equal(GOOGLE_ADS_PING_GUARD_ENABLED, true)
})

function makeEnv() {
  const log = []
  class El { constructor(tag) { this.tagName = tag; this._src = ''; this.attrs = {} } setAttribute(n, v) { this.attrs[n] = v; log.push(['setAttribute', this.tagName, n, v]) } }
  const mk = (tag) => { const C = class extends El { constructor() { super(tag) } }; Object.defineProperty(C.prototype, 'src', { configurable: true, enumerable: true, get() { return this._src }, set(v) { this._src = v; log.push(['src', tag, v]) } }); return C }
  const HTMLImageElement = mk('IMG'), HTMLScriptElement = mk('SCRIPT'), HTMLIFrameElement = mk('IFRAME')
  class HTMLLinkElement extends El { constructor() { super('LINK') } get href() { return this._h } set href(v) { this._h = v; log.push(['href', 'LINK', v]) } }
  class XMLHttpRequest { open(m, u) { log.push(['xhr.open', u]) } send() { log.push(['xhr.send']) } }
  const navigator = { sendBeacon(u) { log.push(['beacon', u]); return true } }
  const window = { fetch: (i) => { log.push(['fetch', typeof i === 'string' ? i : i.url]); return Promise.resolve({ status: 200 }) } }
  const ctx = { window, navigator, location: { href: 'https://www.investrent.com.pl/wycena' }, URL, RegExp, Response: class { constructor(b, o) { this.status = o && o.status } }, Promise, Object, String,
    HTMLImageElement, HTMLScriptElement, HTMLIFrameElement, HTMLLinkElement, XMLHttpRequest, Element: El }
  ctx.globalThis = ctx
  ctx.window.window = window
  vm.createContext(ctx)
  vm.runInContext(GOOGLE_ADS_GUARD_SNIPPET, ctx)
  return { ctx, log, window, navigator, HTMLImageElement, HTMLScriptElement, XMLHttpRequest, El }
}

test('straznik: bez zgody Reklamowe blokuje beacon/fetch/XHR/img/script/setAttribute do hostow reklamowych, GA4 przepuszcza', async () => {
  const e = makeEnv()
  const ADS = 'https://pagead2.googlesyndication.com/ccm/collect?tid=AW-16876191240&gcs=G101&npa=1'
  const GA = 'https://region1.google-analytics.com/g/collect?tid=G-N7XC7DMYQ3'
  assert.equal(e.navigator.sendBeacon(ADS), true)
  e.navigator.sendBeacon(GA)
  assert.deepEqual(e.log.filter(l => l[0] === 'beacon').map(l => l[1]), [GA])
  const r = await e.window.fetch(ADS); assert.equal(r.status, 204)
  await e.window.fetch(GA)
  assert.deepEqual(e.log.filter(l => l[0] === 'fetch').map(l => l[1]), [GA])
  const x = new e.XMLHttpRequest(); x.open('POST', ADS); x.send()
  const y = new e.XMLHttpRequest(); y.open('POST', GA); y.send()
  assert.deepEqual(e.log.filter(l => l[0] === 'xhr.open').map(l => l[1]), [ADS, GA]) // open wolany (zapamietuje blokade)...
  assert.equal(e.log.filter(l => l[0] === 'xhr.send').length, 1) // ...ale send tylko dla GA4
  const img = new e.HTMLImageElement(); img.src = ADS; assert.equal(img.src, '')
  img.src = GA; assert.equal(img.src, GA)
  const sc = new e.HTMLScriptElement(); sc.src = 'https://www.googleadservices.com/pagead/conversion_async.js'; assert.equal(sc.src, '')
  const sa = new e.HTMLImageElement(); sa.setAttribute('src', ADS); assert.equal(sa.attrs.src, undefined)
  sa.setAttribute('src', GA); assert.equal(sa.attrs.src, GA)
})

test('straznik: po zgodzie (window.__irAdsAllowed = true) przepuszcza; wycofanie blokuje znowu; idempotentny', async () => {
  const e = makeEnv()
  const ADS = 'https://pagead2.googlesyndication.com/ccm/collect?tid=AW-1'
  e.window.__irAdsAllowed = true
  e.navigator.sendBeacon(ADS); await e.window.fetch(ADS)
  const img = new e.HTMLImageElement(); img.src = ADS; assert.equal(img.src, ADS)
  assert.equal(e.log.filter(l => l[0] === 'beacon' || l[0] === 'fetch').length, 2)
  e.window.__irAdsAllowed = false
  e.navigator.sendBeacon(ADS)
  assert.equal(e.log.filter(l => l[0] === 'beacon').length, 1)
  vm.runInContext(GOOGLE_ADS_GUARD_SNIPPET, e.ctx) // drugi raz: bez podwojnego owijania
  e.navigator.sendBeacon(ADS)
  assert.equal(e.log.filter(l => l[0] === 'beacon').length, 1)
})
