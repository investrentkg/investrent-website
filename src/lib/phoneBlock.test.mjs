import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { sendPhoneRequest, utmObject } from './phoneBlockSubmit.ts'
import { scrollDeltaAboveBanner } from './wycenaFlags.ts'
import { sendFunnelStep, utmFromSearch, safeUtmValue, FUNNEL_URL } from './funnel.ts'
import { interpretResponse, buildLeadRequest, EMPTY_FORM, isValidPhone, normalizePhoneForSend } from './valuation.ts'

const base = { phone: '512 345 678', valuationToken: 'tok.abc', consentVersion: 'wycena-2026-10-15-v1', values: { ...EMPTY_FORM, city: 'Kołobrzeg', property_type: 'mieszkanie', area_m2: '50' }, outcome: null, utm: 'utm_source=meta utm_campaign=kol', turnstileToken: null, honeypot: '' }
const okRes = (body = { ok: true }, status = 200) => ({ ok: status < 300, status, json: async () => body })

test('flagi bloku telefonu, callbacku i licznika sa DOMYSLNIE wylaczone (merge nie zmienia produkcji)', async () => {
  const f = await import('./wycenaFlags.ts')
  assert.equal(f.PHONE_BLOCK_ON, false); assert.equal(f.CALLBACK_ON, false); assert.equal(f.FUNNEL_ON, false)
})

test('teksty bloku: prawne DOSLOWNIE wg zatwierdzenia Daniela 15.10 (bez zmian w slowach), wersja wycena-RRRR-MM-DD-vN, brak terminu oddzwonienia i SMS, brak checkboxa', async () => {
  const m = await import('../app/wycena/phoneBlockTexts.ts')
  assert.match(m.PHONE_BLOCK_CONSENT_VERSION, m.PHONE_BLOCK_VERSION_FORMAT)
  assert.equal(m.PHONE_BLOCK_CONSENT_VERSION, 'wycena-2026-10-15-v1')
  const L = m.PHONE_BLOCK_LEGAL
  assert.equal(L.label, 'Twój numer telefonu')
  assert.equal(L.submit, 'Poproś o bezpłatny telefon od agenta')
  assert.equal(L.clickNotice, 'Klikając, prosisz o kontakt telefoniczny w sprawie dokładniejszej wyceny tej nieruchomości. To nie jest zgoda na przesyłanie ofert marketingowych.')
  assert.equal(L.clauseBeforeLink + L.clauseLinkLabel + L.clauseAfterLink,
    'Administratorem danych jest InvestRent sp. z o.o. (ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg). Numeru telefonu użyjemy wyłącznie do jednorazowego kontaktu w sprawie dokładniejszej wyceny tej nieruchomości. Dane przechowujemy maksymalnie 12 miesięcy od ostatniego kontaktu, chyba że zostaniemy poproszeni o dalszą współpracę. Pełne informacje: Polityka prywatności.')
  assert.equal(L.clauseLinkHref, '/rodo')
  assert.equal(L.notAppraisal, 'To nie jest operat szacunkowy rzeczoznawcy majątkowego.')
  const all = Object.values(m.PHONE_BLOCK_TEXTS).join(' ')
  assert.ok(!/(dzi[sś]\b|jutro|godzin|minut|w ci[aą]gu|natychmiast|szybko|\d+\s*(min|h)\b)/i.test(all), 'bez obietnicy terminu oddzwonienia')
  assert.ok(!/gwarant|SMS/i.test(all))
  assert.ok(m.PHONE_BLOCK_TEXTS.title.includes('Bezpłatna'))
  assert.ok(!/DO AKCEPTACJI/.test(fs.readFileSync(new URL('../app/wycena/phoneBlockTexts.ts', import.meta.url), 'utf8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n')))
})
test('adapter: callback (flaga on + valuation_token) -> POST z tokenem, telefonem, zgoda {checked, version} i utm', async () => {
  const calls = []
  const r = await sendPhoneRequest(base, { callbackEnabled: true, callbackUrl: 'https://api.test/cb', fetchImpl: async (u, i) => { calls.push([u, JSON.parse(i.body)]); return okRes() }, submitLeadFallback: async () => { throw new Error('nie wolno') } })
  assert.deepEqual(r, { ok: true, via: 'callback' })
  assert.equal(calls.length, 1)
  const [url, body] = calls[0]
  assert.equal(url, 'https://api.test/cb')
  assert.deepEqual(body, { valuation_token: 'tok.abc', phone: '512 345 678', consent: { checked: true, version: 'wycena-2026-10-15-v1' }, utm: { utm_source: 'meta', utm_campaign: 'kol' }, hp_field: '' })
})
test('adapter: flaga off albo brak tokenu = tryb awaryjny (jeden lead), callback nie jest wolany', async () => {
  let fetches = 0, leads = 0
  const deps = (cb) => ({ callbackEnabled: cb, callbackUrl: 'x', fetchImpl: async () => { fetches++; return okRes() }, submitLeadFallback: async () => { leads++; return { ok: true } } })
  assert.deepEqual(await sendPhoneRequest(base, deps(false)), { ok: true, via: 'lead' })
  assert.deepEqual(await sendPhoneRequest({ ...base, valuationToken: null }, deps(true)), { ok: true, via: 'lead' })
  assert.equal(fetches, 0); assert.equal(leads, 2)
})
test('adapter: blad sieci / HTTP 500 callbacku -> awaryjnie jeden lead; porazka leada -> ok:false z powodem', async () => {
  let leads = 0
  const mk = (fetchImpl, lead = async () => { leads++; return { ok: true } }) => ({ callbackEnabled: true, callbackUrl: 'x', fetchImpl, submitLeadFallback: lead })
  assert.deepEqual(await sendPhoneRequest(base, mk(async () => { throw new Error('net') })), { ok: true, via: 'lead' })
  assert.deepEqual(await sendPhoneRequest(base, mk(async () => okRes({}, 500))), { ok: true, via: 'lead' })
  assert.equal(leads, 2)
  assert.deepEqual(await sendPhoneRequest(base, mk(async () => okRes({}, 500), async () => ({ ok: false, reason: 'timeout' }))), { ok: false, reason: 'timeout' })
})
test('utmObject: rozbiera readUtm na pary', () => {
  assert.deepEqual(utmObject('utm_source=meta utm_campaign=kol'), { utm_source: 'meta', utm_campaign: 'kol' })
  assert.deepEqual(utmObject(''), {})
})

test('/estimate: valuation_token zapisywany przy range i no_numbers; brak pola = brak klucza (testy deepEqual nietkniete)', () => {
  const range = interpretResponse(200, { ok: true, mode: 'range', range: { low: 400000, high: 500000 }, valuation_token: 'abc.def' })
  assert.equal(range.valuationToken, 'abc.def')
  const noTok = interpretResponse(200, { ok: true, mode: 'range', range: { low: 400000, high: 500000 } })
  assert.ok(!('valuationToken' in noTok))
  assert.equal(interpretResponse(200, { ok: true, mode: 'no_numbers', valuation_token: 't' }).valuationToken, 't')
  assert.ok(!('valuationToken' in interpretResponse(200, { ok: true, mode: 'no_numbers' })))
})
test('lead awaryjny: klucze bez zmian; wersja zgody w znaczniku mozna nadpisac (domyslnie CONSENT_VERSION)', () => {
  const vals = { ...EMPTY_FORM, city: 'Kołobrzeg', property_type: 'mieszkanie', area_m2: '50' }
  const a = buildLeadRequest({ name: '', phone: '512345678', values: vals, outcome: null, utm: '', turnstileToken: 't', honeypot: '' })
  assert.deepEqual(Object.keys(a).sort(), ['client_type', 'full_name', 'hp_field', 'notes', 'phone', 'preferred_city', 'source', 'turnstile_token'])
  assert.ok(a.notes.includes('wersja=wycena-2026-09-28-v13'))
  const b = buildLeadRequest({ name: '', phone: '512345678', values: vals, outcome: null, utm: '', consentVersion: 'wycena-2026-10-15-v1' })
  assert.ok(b.notes.includes('wersja=wycena-2026-10-15-v1'))
})

test('licznik lejka: wylaczony = nic; wlaczony = JEDYNY transport fetch keepalive (credentials omit), bez danych osobowych; sendBeacon nigdy nie jest uzywany', async () => {
  let sent = 0
  assert.equal(sendFunnelStep('entry', {}, { enabled: false, fetchImpl: () => { sent++; return Promise.resolve({}) } }), false)
  assert.equal(sent, 0)
  let beaconCalls = 0
  Object.defineProperty(globalThis, 'navigator', { value: { sendBeacon: () => { beaconCalls++; return true } }, configurable: true })
  let captured = null
  const fetchImpl = (u, i) => { captured = { u, i }; return Promise.resolve({}) }
  assert.equal(sendFunnelStep('entry', {}, { enabled: true, search: '?utm_source=meta&utm_campaign=kol&phone=512345678&fbclid=x', fetchImpl }), true)
  assert.equal(captured.u, FUNNEL_URL)
  assert.ok(FUNNEL_URL.endsWith('/api/public/valuation/funnel-step'))
  assert.equal(captured.i.keepalive, true); assert.equal(captured.i.credentials, 'omit'); assert.equal(captured.i.method, 'POST')
  assert.deepEqual(JSON.parse(captured.i.body), { step: 'entry', utm_source: 'meta', utm_campaign: 'kol' })
  assert.ok(!/512345678|fbclid/.test(captured.i.body), 'bez telefonu i fbclid')
  sendFunnelStep('reject', { variant: 'phone_block', reason: 'rate_limited' }, { enabled: true, search: '', fetchImpl })
  assert.deepEqual(JSON.parse(captured.i.body), { step: 'reject', variant: 'phone_block', reason: 'rate_limited' })
  // brak fetch: NIE ma zapasu w postaci sendBeacon
  const g = globalThis.fetch; globalThis.fetch = undefined
  try { assert.equal(sendFunnelStep('submit', {}, { enabled: true, search: '' }), false) } finally { globalThis.fetch = g }
  assert.equal(beaconCalls, 0, 'sendBeacon nie jest uzywany')
  assert.ok(!/sendBeacon/.test(fs.readFileSync(new URL('./funnel.ts', import.meta.url), 'utf8').split('\n').filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('*') && !l.trim().startsWith('/*')).join('\n')))
  // wyjatek transportu nie wychodzi na zewnatrz
  assert.equal(sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: () => { throw new Error('boom') } }), false)
  assert.doesNotThrow(() => sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: () => Promise.reject(new Error('x')) }))
})

test('licznik lejka: UTM tylko biala lista kluczy i wartosci [a-z0-9_-] (po zlowercase) max 40; inaczej POMIJAMY pole (bez obcinania)', () => {
  const ok = utmFromSearch('?utm_source=Meta&utm_medium=cpc&utm_campaign=Kol-04_2026&utm_content=ad1&utm_term=mieszkanie&foo=bar&phone=512345678')
  assert.deepEqual(ok, { utm_source: 'meta', utm_medium: 'cpc', utm_campaign: 'kol-04_2026', utm_content: 'ad1', utm_term: 'mieszkanie' })
  const bad = {
    email: 'jan.kowalski@example.com', phone: '512 345 678', phoneDigits: '512345678', spaces: 'kampania jesien', polish: 'wycena-kołobrzeg',
    dot: 'a.b', plus: 'a+b', long: 'a'.repeat(41), slash: 'a/b', empty: '',
  }
  for (const [k, v] of Object.entries(bad)) {
    assert.equal(safeUtmValue(v), v === '512345678' ? '512345678' : null, k) // same cyfry sa poprawnym tokenem [a-z0-9] (nie rozpoznajemy "to telefon"), reszta odrzucona
    const q = new URLSearchParams({ utm_source: v }).toString()
    const out = utmFromSearch('?' + q)
    if (safeUtmValue(v)) assert.deepEqual(out, { utm_source: safeUtmValue(v) }); else assert.deepEqual(out, {}, 'pole pominiete: ' + k)
  }
  assert.equal(safeUtmValue('a'.repeat(40)), 'a'.repeat(40))
  assert.equal(safeUtmValue('a'.repeat(41)), null, 'za dlugie = pominiete, nie obciete')
  assert.equal(safeUtmValue('ABC'), 'abc')
  assert.deepEqual(utmFromSearch('?utm_source=' + 'x'.repeat(100)), {})
  assert.deepEqual(utmFromSearch('?utm_source=jan%40example.com&utm_campaign=ok'), { utm_campaign: 'ok' })
})

test('walidacja numeru: krajowe 9 cyfr, miedzynarodowe z + i z 00 (spacje/myslniki/nawiasy), niepoprawne odrzucone; 00 normalizowane do + przy wysylce', () => {
  const good = ['512 345 678', '512-345-678', '(512) 345 678', '512345678', '+48 512 345 678', '+48512345678', '+49 171 1234567', '0048 512 345 678', '0049 171 1234567', '0048512345678', '+420 777 123 456']
  const bad = ['', '12345', '1234567', '+48', '+0 512345678', 'abc', '512 345 67a', '00', '0049', '+4912', '++48512345678', '0000 512 345 678', '512 345 678 90 12 34 56 78']
  for (const g of good) assert.ok(isValidPhone(g), 'powinien byc poprawny: ' + g)
  for (const b of bad) assert.ok(!isValidPhone(b), 'powinien byc odrzucony: ' + b)
  // dotychczasowa wyrozumialosc: 8-15 cyfr BEZ + (np. 49 171 1234567) nadal przyjmowane - nie zawezamy, zeby nie tracic zgloszen; komunikat prosi o + lub 00
  for (const lenient of ['49 171 1234567', '51234567']) assert.ok(isValidPhone(lenient), 'wyrozumialosc: ' + lenient)
  assert.equal(normalizePhoneForSend(' 0048 512 345 678 '), '+48512345678')
  assert.equal(normalizePhoneForSend('0049 171 1234567'), '+491711234567')
  assert.equal(normalizePhoneForSend('+48 512 345 678'), '+48 512 345 678')
  assert.equal(normalizePhoneForSend(' 512 345 678 '), '512 345 678')
  const r = buildLeadRequest({ name: '', phone: '0048 512 345 678', values: { ...EMPTY_FORM, city: 'Kołobrzeg' }, outcome: null, utm: '' })
  assert.equal(r.phone, '+48512345678')
})

test('komunikat i placeholder numeru zgodne z walidacja (9 cyfr, + albo 00)', async () => {
  const m = await import('../app/wycena/phoneBlockTexts.ts')
  const { T } = await import('../app/wycena/texts.ts')
  for (const s of [m.PHONE_BLOCK_TEXTS.phoneHint, m.PHONE_BLOCK_TEXTS.errPhone, T.lead.phoneHint, T.lead.errPhone]) {
    assert.ok(/9 cyfr/.test(s) && /\+/.test(s) && /00/.test(s), s)
  }
  assert.ok(isValidPhone('512 345 678') && isValidPhone('+49 171 1234567'), 'przyklady z placeholdera sa poprawne')
  assert.ok(m.PHONE_BLOCK_TEXTS.phonePlaceholder.includes('512 345 678') && m.PHONE_BLOCK_TEXTS.phonePlaceholder.includes('+49'))
})

test('cele dotyku >= 44 px: CSS pola, przycisku, linkow tekstowych/inline i etykiety ma jawne min-height/padding; blok uzywa tych klas', () => {
  const css = fs.readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
  const rule = (sel) => { const m = css.match(new RegExp(sel.replace(/[.]/g, '\\.') + '\\s*\\{([^}]*)\\}')); assert.ok(m, 'brak reguly ' + sel); return m[1] }
  const minH = (body) => Number((body.match(/min-height:\s*(\d+)px/) || [])[1] || 0)
  for (const sel of ['.wy-field', '.wy-btn', '.wy-linkbtn', '.wy-textlink', '.wy-consent-label', '.wy-inline-link']) assert.ok(minH(rule(sel)) >= 44, sel + ' min-height >= 44')
  const sticky = css.match(/\.wy-sticky \.wy-btn\s*\{([^}]*)\}/)[1]; assert.ok(minH(sticky) >= 44)
  assert.ok(/\.wy-details\s*>\s*summary\s*\{[^}]*min-height:\s*44px/.test(css), 'summary klauzuli >= 44')
  const block = fs.readFileSync(new URL('../app/wycena/PhoneBlock.tsx', import.meta.url), 'utf8')
  assert.ok(block.includes('className="wy-field"') && block.includes('className="wy-btn"') && block.includes('className="wy-inline-link"') && block.includes('className="wy-textlink"'))
})
test('strona: blok telefonu tylko za flaga, pod przedzialem (leadSlot przed noty zakresu), osobna karta kontaktu pomijana tylko gdy blok aktywny; teksty zgod nietkniete', () => {
  const src = fs.readFileSync(new URL('../app/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.ok(src.includes("PHONE_BLOCK_ON && outcome?.kind === 'range'"))
  assert.ok(src.includes('{leadSlot ?? <ResultCta'))
  const range = src.slice(src.indexOf("if (outcome.kind === 'range')"), src.indexOf("if (outcome.kind === 'no_numbers')"))
  assert.ok(range.indexOf('{leadSlot ??') > range.indexOf('formatRange(outcome.rangeWide)') && range.indexOf('{leadSlot ??') < range.indexOf('{T.result.scopeNote}'), 'blok miedzy przedzialami a notami')
  const block = fs.readFileSync(new URL('../app/wycena/PhoneBlock.tsx', import.meta.url), 'utf8')
  assert.ok(!/type="checkbox"/.test(block), 'bez checkboxa: jawne dzialanie = klikniecie przycisku (opinia Prawnika 15.10)')
  assert.ok(block.includes('{L.clickNotice}') && block.includes('{L.clauseBeforeLink}') && block.includes('{L.notAppraisal}'))
  assert.ok(block.includes('CALLBACK_ON') && block.includes('sendPhoneRequest'))
})

test('fokus pola nad banerem cookies: przewiniecie tylko, gdy dol pola jest pod banerem (z marginesem 24 px)', () => {
  assert.equal(scrollDeltaAboveBanner(675, 812, 275), 675 - (812 - 275 - 24)) // pole pod banerem
  assert.equal(scrollDeltaAboveBanner(400, 812, 275), 0) // nad banerem
  assert.equal(scrollDeltaAboveBanner(675, 812, 0), 0) // brak banera
  assert.equal(scrollDeltaAboveBanner(520, 812, 275), 7) // tuz pod marginesem
  assert.equal(scrollDeltaAboveBanner(500, 812, Number.NaN), 0)
})
