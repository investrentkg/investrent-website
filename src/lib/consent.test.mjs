// Uruchomienie: node --test src/lib/consent.test.mjs (Node >= 22.6, natywne strip-types) albo `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CONSENT_STORAGE_KEY, CONSENT_VERSION, CONSENT_MAX_AGE_MS, REJECT_ALL, ACCEPT_ALL,
  makeConsent, parseConsent, serializeConsent, readStoredConsent, writeStoredConsent, googleConsentArgs,
  gaCookieNames, metaCookieNames, marketingAvailable,
} from './consent.ts'
import { CONSENT_COPY, localeOfPath } from './consentCopy.ts'

const NOW = Date.UTC(2026, 9, 3, 12, 0, 0)

test('domyślnie analityka i marketing wyłączone; REJECT_ALL/ACCEPT_ALL', () => {
  assert.deepEqual(REJECT_ALL, { analytics: false, marketing: false })
  assert.deepEqual(ACCEPT_ALL, { analytics: true, marketing: true })
  assert.deepEqual(makeConsent(REJECT_ALL, NOW), { v: CONSENT_VERSION, analytics: false, marketing: false, ts: NOW })
})

test('parseConsent: poprawny zapis wraca, śmieci/brak/inna wersja => null (trzeba zapytać)', () => {
  const s = makeConsent({ analytics: true, marketing: false }, NOW)
  assert.deepEqual(parseConsent(serializeConsent(s), NOW + 1000), s)
  for (const bad of [null, undefined, '', 'nie-json', '123', 'null', '{}', '[]', JSON.stringify({ ...s, v: 99 }),
    JSON.stringify({ ...s, analytics: 'tak' }), JSON.stringify({ ...s, marketing: 1 }), JSON.stringify({ ...s, ts: 'x' }), JSON.stringify({ ...s, ts: null })]) {
    assert.equal(parseConsent(bad, NOW), null, String(bad))
  }
})

test('parseConsent: wygasa po 12 mies. (ponowne pytanie) i odrzuca datę z przyszłości', () => {
  const s = makeConsent(ACCEPT_ALL, NOW)
  assert.ok(parseConsent(serializeConsent(s), NOW + CONSENT_MAX_AGE_MS - 1))
  assert.equal(parseConsent(serializeConsent(s), NOW + CONSENT_MAX_AGE_MS + 1), null)
  assert.equal(parseConsent(serializeConsent({ ...s, ts: NOW + 3 * 86400000 }), NOW), null) // zepsuty zegar / manipulacja
  assert.ok(parseConsent(serializeConsent({ ...s, ts: NOW + 3600000 }), NOW)) // niewielki rozjazd zegara OK
})

test('odczyt/zapis storage: round-trip; brak storage i wyjątki nie przerywają (wybór tylko na czas wizyty)', () => {
  const mem = new Map()
  const st = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) }
  assert.equal(readStoredConsent(st, NOW), null)
  const s = makeConsent({ analytics: true, marketing: true }, NOW)
  assert.equal(writeStoredConsent(st, s), true)
  assert.ok(mem.has(CONSENT_STORAGE_KEY))
  assert.deepEqual(readStoredConsent(st, NOW), s)
  assert.equal(writeStoredConsent(null, s), false)
  assert.equal(readStoredConsent(null, NOW), null)
  const boom = { getItem() { throw new Error('SecurityError') }, setItem() { throw new Error('QuotaExceeded') } }
  assert.equal(readStoredConsent(boom, NOW), null)
  assert.equal(writeStoredConsent(boom, s), false)
})

test('Consent Mode v2: tylko analytics_storage zależy od zgody; sygnały reklamowe Google zawsze denied; null = wszystko denied', () => {
  assert.deepEqual(googleConsentArgs(null), { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  assert.equal(googleConsentArgs(makeConsent({ analytics: true, marketing: false }, NOW)).analytics_storage, 'granted')
  const all = googleConsentArgs(makeConsent(ACCEPT_ALL, NOW))
  assert.equal(all.analytics_storage, 'granted')
  assert.equal(all.ad_storage, 'denied')
  assert.equal(all.ad_user_data, 'denied')
  assert.equal(all.ad_personalization, 'denied')
  assert.equal(googleConsentArgs(makeConsent({ analytics: false, marketing: true }, NOW)).analytics_storage, 'denied')
})

test('nazwy cookies do usunięcia po wycofaniu zgody (GA: _ga, _ga_<ID>, _gid, _gat*; Meta: _fbp, _fbc), cudzych nie ruszamy', () => {
  const cookies = '_ga=GA1.1.1; _ga_LNKDWSF098=GS1; _gid=x; _gat_gtag_G_X=1; _fbp=fb.1; _fbc=fb.2; ir_consent=abc; sessionid=1; _gaxx=2'
  assert.deepEqual(gaCookieNames(cookies), ['_ga', '_ga_LNKDWSF098', '_gid', '_gat_gtag_G_X'])
  assert.deepEqual(metaCookieNames(cookies), ['_fbp', '_fbc'])
  assert.deepEqual(gaCookieNames(''), [])
  assert.deepEqual(metaCookieNames(undefined), [])
})

test('kategoria marketing tylko gdy jest wdrożony piksel (poprawny numeric id)', () => {
  assert.equal(marketingAvailable(undefined), false)
  assert.equal(marketingAvailable(''), false)
  assert.equal(marketingAvailable('abc'), false)
  assert.equal(marketingAvailable('123'), false)
  assert.equal(marketingAvailable('1234567890123456'), true)
})

test('język po ścieżce: /de i /de/... = niemiecki, reszta (także /dekoracje) polski; komplet tekstów PL i DE', () => {
  assert.equal(localeOfPath('/de'), 'de')
  assert.equal(localeOfPath('/de/datenschutz'), 'de')
  assert.equal(localeOfPath('/dekoracje'), 'pl')
  assert.equal(localeOfPath('/rodo'), 'pl')
  assert.equal(localeOfPath(null), 'pl')
  for (const loc of ['pl', 'de']) {
    const c = CONSENT_COPY[loc]
    for (const k of ['title', 'intro', 'introAnalyticsOnly', 'rejectAll', 'customize', 'acceptAll', 'save', 'settingsTitle', 'footerButton', 'withdraw']) assert.ok(c[k] && c[k].length > 3, `${loc}.${k}`)
    for (const k of ['necessary', 'analytics', 'marketing']) { assert.ok(c[k].name); assert.ok(c[k].desc.length > 20) }
    assert.ok(c.necessary.alwaysActive)
    assert.ok(!/reklam|Werbung/.test(c.introAnalyticsOnly), 'wariant bez marketingu nie wspomina o reklamach')
  }
  assert.equal(CONSENT_COPY.pl.privacyHref, '/rodo')
  assert.equal(CONSENT_COPY.de.privacyHref, '/de/datenschutz')
})
