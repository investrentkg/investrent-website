import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { sendPhoneRequest, utmObject } from './phoneBlockSubmit.ts'
import { sendFunnelStep, utmFromSearch, FUNNEL_URL } from './funnel.ts'
import { interpretResponse, buildLeadRequest, EMPTY_FORM } from './valuation.ts'

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
test('adapter: callback przekazuje wspólny event_id i metadane wyłącznie z Marketing consent', async () => {
  let captured
  const metaTracking = { event_id: 'wyc_1234567890abcdef', marketing_consent: true, fbp: 'fb.1.123.abc', utm: { utm_source: 'meta' } }
  await sendPhoneRequest({ ...base, metaTracking }, { callbackEnabled: true, callbackUrl: 'https://api.test/cb', fetchImpl: async (_u, i) => { captured = JSON.parse(i.body); return okRes() }, submitLeadFallback: async () => assert.fail('nie powinien być fallback') })
  assert.deepEqual(captured.meta_tracking, metaTracking)
  assert.ok(!JSON.stringify(captured.meta_tracking).includes(base.phone))
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

test('licznik lejka: wylaczony = nic; wlaczony = fetch keepalive (credentials omit) z JSON {step, utm_source, utm_campaign, variant, reason} bez danych osobowych; fallback sendBeacon; nie rzuca', async () => {
  let sent = 0
  assert.equal(sendFunnelStep('entry', {}, { enabled: false, fetchImpl: () => { sent++; return Promise.resolve({}) } }), false)
  assert.equal(sent, 0)
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
  // brak fetch -> sendBeacon
  const g = globalThis.fetch; globalThis.fetch = undefined
  let blobText = null
  try {
    assert.equal(sendFunnelStep('submit', {}, { enabled: true, search: '', beacon: (u, b) => { blobText = b; return true } }), true)
    assert.equal(JSON.parse(await blobText.text()).step, 'submit')
  } finally { globalThis.fetch = g }
  // wyjatek transportu nie wychodzi na zewnatrz
  assert.equal(sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: () => { throw new Error('boom') } }), false)
  assert.doesNotThrow(() => sendFunnelStep('entry', {}, { enabled: true, search: '', fetchImpl: () => Promise.reject(new Error('x')) }))
  assert.deepEqual(utmFromSearch('?utm_source=' + 'x'.repeat(100)), { utm_source: 'x'.repeat(64) })
})
test('strona: blok telefonu tylko za flaga, pod przedzialem (leadSlot przed noty zakresu), osobna karta kontaktu pomijana tylko gdy blok aktywny; teksty zgod nietkniete', () => {
  const src = fs.readFileSync(new URL('../app/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.ok(src.includes("PHONE_BLOCK_ON && outcome?.kind === 'range'"))
  assert.ok(src.includes('{leadSlot ?? <ResultCta'))
  const range = src.slice(src.indexOf("if (outcome.kind === 'range')"), src.indexOf("if (outcome.kind === 'no_numbers')"))
  assert.ok(range.indexOf('{leadSlot ??') > range.indexOf('formatRange(outcome.rangeWide)') && range.indexOf('{leadSlot ??') < range.indexOf('{T.result.scopeNote}'), 'blok miedzy przedzialami a notami')
  const block = fs.readFileSync(new URL('../app/wycena/PhoneBlock.tsx', import.meta.url), 'utf8')
  // bez checkboxa w trybie podstawowym (opinia Prawnika 15.10); checkbox istnieje WYLACZNIE w galezi karty rynku (flaga MARKET_CARD + gotowy tekst zgody)
  assert.ok((block.match(/type="checkbox"/g) ?? []).length <= 1 && (!block.includes('type="checkbox"') || block.indexOf('type="checkbox"') > block.indexOf('{mc && (')), 'checkbox tylko w galezi mc')
  assert.ok(block.includes('{L.clickNotice}') && block.includes('{L.clauseBeforeLink}') && block.includes('{L.notAppraisal}'))
  assert.ok(block.includes('CALLBACK_ON') && block.includes('sendPhoneRequest'))
})
