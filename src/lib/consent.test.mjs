// Uruchomienie: node --test src/lib/consent.test.mjs (Node >= 22.6, natywne strip-types) albo `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CONSENT_STORAGE_KEY, CONSENT_VERSION, CONSENT_MAX_AGE_MS, REJECT_ALL, ACCEPT_ALL,
  makeConsent, parseConsent, serializeConsent, readStoredConsent, writeStoredConsent, googleConsentArgs,
  gaCookieNames, metaCookieNames, ATTRIBUTION_SESSION_KEY,
  CONSENT_CHANGE_EVENT, analyticsAllowed, attributionAllowed, adsAllowed, ADS_AVAILABLE, applyChoice,
} from './consent.ts'
import { CONSENT_COPY, localeOfPath } from './consentCopy.ts'

const NOW = Date.UTC(2026, 9, 3, 12, 0, 0)

test('domyślnie wszystkie opcjonalne wyłączone; REJECT_ALL/ACCEPT_ALL; ads nigdy true do wdrożenia piksela (ADS_AVAILABLE=false)', () => {
  assert.deepEqual(REJECT_ALL, { analytics: false, attribution: false, ads: false })
  assert.deepEqual(ACCEPT_ALL, { analytics: true, attribution: true, ads: true })
  assert.deepEqual(makeConsent(REJECT_ALL, NOW), { v: CONSENT_VERSION, analytics: false, attribution: false, ads: false, ts: NOW })
  assert.equal(ADS_AVAILABLE, false)
  assert.equal(makeConsent(ACCEPT_ALL, NOW).ads, false, 'Accept all nie zapisuje zgody na niewdrożony Pixel/CAPI')
  assert.equal(makeConsent(ACCEPT_ALL, NOW).attribution, true)
})
test('parseConsent: poprawny zapis wraca, śmieci/brak/inna wersja => null (trzeba zapytać)', () => {
  const s = makeConsent({ analytics: true, attribution: false, ads: false }, NOW)
  assert.deepEqual(parseConsent(serializeConsent(s), NOW + 1000), s)
  for (const bad of [null, undefined, '', 'nie-json', '123', 'null', '{}', '[]', JSON.stringify({ ...s, v: 99 }),
    JSON.stringify({ ...s, analytics: 'tak' }), JSON.stringify({ ...s, attribution: 1 }), JSON.stringify({ ...s, ts: 'x' }), JSON.stringify({ ...s, ts: null })]) {
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
  const s = makeConsent({ analytics: true, attribution: true, ads: true }, NOW)
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
  assert.equal(googleConsentArgs(makeConsent({ analytics: true, attribution: false, ads: false }, NOW)).analytics_storage, 'granted')
  const all = googleConsentArgs(makeConsent(ACCEPT_ALL, NOW))
  assert.equal(all.analytics_storage, 'granted')
  assert.equal(all.ad_storage, 'denied')
  assert.equal(all.ad_user_data, 'denied')
  assert.equal(all.ad_personalization, 'denied')
  assert.equal(googleConsentArgs(makeConsent({ analytics: false, attribution: true, ads: false }, NOW)).analytics_storage, 'denied')
})

test('nazwy cookies do usunięcia po wycofaniu zgody (GA: _ga, _ga_<ID>, _gid, _gat*; Meta: _fbp, _fbc), cudzych nie ruszamy', () => {
  const cookies = '_ga=GA1.1.1; _ga_LNKDWSF098=GS1; _gid=x; _gat_gtag_G_X=1; _fbp=fb.1; _fbc=fb.2; ir_consent=abc; sessionid=1; _gaxx=2'
  assert.deepEqual(gaCookieNames(cookies), ['_ga', '_ga_LNKDWSF098', '_gid', '_gat_gtag_G_X'])
  assert.deepEqual(metaCookieNames(cookies), ['_fbp', '_fbc'])
  assert.deepEqual(gaCookieNames(''), [])
  assert.deepEqual(metaCookieNames(undefined), [])
})

test('wersja zgody 3: zapisy ze starą wersją (v1, v2) = brak zgody, ponowne pytanie; domyślnie oba marketingowe wyłączone', () => {
  assert.equal(CONSENT_VERSION, 3)
  for (const old of [JSON.stringify({ v: 1, analytics: true, marketing: true, ts: NOW }), JSON.stringify({ v: 2, analytics: true, marketing: true, ts: NOW }),
    JSON.stringify({ v: 2, analytics: true, attribution: true, ads: true, ts: NOW })]) {
    assert.equal(parseConsent(old, NOW + 1000), null)
    const s = readStoredConsent({ getItem: () => old, setItem() {} }, NOW + 1000)
    assert.equal(s, null)
    assert.equal(analyticsAllowed(s), false); assert.equal(attributionAllowed(s), false); assert.equal(adsAllowed(s), false)
  }
  assert.equal(attributionAllowed(makeConsent({ analytics: true, attribution: false, ads: false }, NOW)), false)
  assert.equal(adsAllowed(makeConsent({ analytics: true, attribution: false, ads: false }, NOW)), false)
  assert.ok(parseConsent(serializeConsent(makeConsent(ACCEPT_ALL, NOW)), NOW + 1000)) // v3 działa
})

test('rozłączność zgód: attribution (UTM) bez ads i odwrotnie; brak wyboru = oba false', () => {
  for (const s of [null, undefined]) { assert.equal(attributionAllowed(s), false); assert.equal(adsAllowed(s), false) }
  const utmOnly = { v: CONSENT_VERSION, analytics: false, attribution: true, ads: false, ts: NOW }
  assert.equal(attributionAllowed(utmOnly), true); assert.equal(adsAllowed(utmOnly), false)
  const adsOnly = { v: CONSENT_VERSION, analytics: false, attribution: false, ads: true, ts: NOW } // po wdrożeniu piksela
  assert.equal(attributionAllowed(adsOnly), false); assert.equal(adsAllowed(adsOnly), true)
  // parse zachowuje oba klucze niezależnie
  assert.deepEqual(parseConsent(serializeConsent(adsOnly), NOW + 1000), adsOnly)
  assert.equal(parseConsent(JSON.stringify({ v: 3, analytics: true, attribution: true, ts: NOW }), NOW), null, 'brak klucza ads = nieprawidłowy zapis')
})
test('wycofanie zgody marketingowej (attribution) => sprzątanie ir_attr; analityka, ads i pierwsze odrzucenie jej nie ruszają; wycofanie ads nie czyści UTM', () => {
  assert.equal(ATTRIBUTION_SESSION_KEY, 'ir_attr')
  assert.equal(applyChoice(null, REJECT_ALL, NOW).clearAttribution, false)
  const on = makeConsent(ACCEPT_ALL, NOW)
  assert.equal(applyChoice(on, REJECT_ALL, NOW + 1).clearAttribution, true)
  assert.equal(applyChoice(on, { analytics: true, attribution: false, ads: false }, NOW + 1).clearAttribution, true)
  assert.equal(applyChoice(on, { analytics: false, attribution: true, ads: false }, NOW + 1).clearAttribution, false)
  assert.equal(applyChoice(makeConsent({ analytics: true, attribution: false, ads: false }, NOW), REJECT_ALL, NOW + 1).clearAttribution, false)
  // wycofanie reklamowych (po wdrożeniu piksela) czyści cookies Meta, ale nie UTM; wycofanie UTM nie czyści Meta
  const both = { v: CONSENT_VERSION, analytics: false, attribution: true, ads: true, ts: NOW }
  const r1 = applyChoice(both, { analytics: false, attribution: true, ads: false }, NOW + 1)
  assert.deepEqual([r1.clearAttribution, r1.clearMeta], [false, true])
  const r2 = applyChoice(both, { analytics: false, attribution: false, ads: true }, NOW + 1)
  assert.equal(r2.clearAttribution, true) // (ads wymuszone na false do wdrożenia piksela, więc clearMeta tu nie sprawdzamy)
})

test('język po ścieżce: /de i /de/... = niemiecki, reszta (także /dekoracje) polski; komplet tekstów PL i DE', () => {
  assert.equal(localeOfPath('/de'), 'de')
  assert.equal(localeOfPath('/de/datenschutz'), 'de')
  assert.equal(localeOfPath('/dekoracje'), 'pl')
  assert.equal(localeOfPath('/rodo'), 'pl')
  assert.equal(localeOfPath(null), 'pl')
  for (const loc of ['pl', 'de']) {
    const c = CONSENT_COPY[loc]
    for (const k of ['title', 'intro', 'rejectAll', 'customize', 'acceptAll', 'save', 'settingsTitle', 'footerButton', 'withdraw']) assert.ok(c[k] && c[k].length > 3, `${loc}.${k}`)
    for (const k of ['necessary', 'analytics', 'marketing', 'ads']) { assert.ok(c[k].name); assert.ok(c[k].desc.length > 20) }
    assert.ok(c.necessary.alwaysActive)
    assert.ok(/reklam|Werbung/.test(c.intro), 'pierwsza warstwa informuje o pomiarze reklam')
    assert.ok(!/Meta|Pixel|CAPI/i.test(c.marketing.desc), 'opis Marketingowych (UTM, dane wewnętrzne) nie wspomina o Meta/Pixel')
    assert.ok(/Meta/.test(c.ads.name) && /Meta/.test(c.ads.desc) && c.ads.badge, 'Reklamowe = Meta, z plakietką planowane')
    assert.ok(!/(wykorzystujemy|nutzen wir|używamy Pixel)/i.test(c.ads.desc), 'ads.desc nie opisuje niewdrożonego Pixela jako faktu')
  }
  assert.ok(CONSENT_COPY.pl.marketing.desc.startsWith('pozwalają nam mierzyć skuteczność kampanii reklamowych, np. zapisując, z jakiej kampanii przyszedł użytkownik'))
  assert.equal(CONSENT_COPY.pl.privacyHref, '/rodo')
  assert.equal(CONSENT_COPY.de.privacyHref, '/de/datenschutz')
})


test('bramka: przed wyborem (null/undefined) NIC nie jest dozwolone - ani GA4, ani zapis UTM, ani Pixel', () => {
  for (const s of [null, undefined]) { assert.equal(analyticsAllowed(s), false); assert.equal(attributionAllowed(s), false); assert.equal(adsAllowed(s), false) }
  // uszkodzony/wygasły zapis => parseConsent daje null => nadal brak zgody
  assert.equal(analyticsAllowed(parseConsent('{"v":1,"analytics":true,"marketing":true,"ts":1}', NOW)), false)
  assert.equal(analyticsAllowed(parseConsent('nie-json', NOW)), false)
})

test('bramka: odrzucenie = brak ładowania; akceptacja analityki nie włącza marketingu i odwrotnie', () => {
  const rej = makeConsent(REJECT_ALL, NOW)
  assert.equal(analyticsAllowed(rej), false); assert.equal(attributionAllowed(rej), false); assert.equal(adsAllowed(rej), false)
  const an = makeConsent({ analytics: true, attribution: false, ads: false }, NOW)
  assert.equal(analyticsAllowed(an), true); assert.equal(attributionAllowed(an), false)
  const mk = makeConsent({ analytics: false, attribution: true, ads: false }, NOW)
  assert.equal(analyticsAllowed(mk), false); assert.equal(attributionAllowed(mk), true)
  assert.equal(googleConsentArgs(rej).analytics_storage, 'denied')
})

test('zmiana wyboru: wycofanie analityki => sprzątanie _ga*; pierwsze odrzucenie nic nie sprzątą; zmiana marketingu nie rusza GA', () => {
  const first = applyChoice(null, REJECT_ALL, NOW)
  assert.deepEqual([first.clearGa, first.clearMeta], [false, false])
  assert.equal(analyticsAllowed(first.next), false)
  const on = applyChoice(first.next, ACCEPT_ALL, NOW + 1)
  assert.deepEqual([on.clearGa, on.clearMeta], [false, false])
  assert.equal(analyticsAllowed(on.next), true)
  const off = applyChoice(on.next, REJECT_ALL, NOW + 2)
  assert.deepEqual([off.clearGa, off.clearMeta], [true, false]) // ads nigdy nie był włączony (ADS_AVAILABLE=false) - nie ma czego sprzątać
  assert.equal(analyticsAllowed(off.next), false)
  const onlyMk = applyChoice(on.next, { analytics: true, attribution: false, ads: false }, NOW + 3)
  assert.deepEqual([onlyMk.clearGa, onlyMk.clearMeta], [false, false]); assert.equal(onlyMk.clearAttribution, true)
  // zapis z nowym ts, trwały i odczytywalny po zmianie
  const mem = new Map(); const st = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) }
  writeStoredConsent(st, on.next); writeStoredConsent(st, off.next)
  assert.equal(analyticsAllowed(readStoredConsent(st, NOW + 5)), false)
})

test('zdarzenie zmiany zgody ma stałą nazwę (kontrakt dla website#42 / UTM)', () => {
  assert.equal(CONSENT_CHANGE_EVENT, 'ir-consent-change')
})