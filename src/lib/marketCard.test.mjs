import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { interpretMarketCard, fetchMarketCard, fmtPpm, fmtRange, fmtAsOfDate, MARKET_CARD_URL, CONTACT_WINDOWS } from './marketCard.ts'
import { CONSENT_TEXT, CONSENT_VERSION, CONSENT_PLACEHOLDER, consentTextReady, marketCardActive } from './wycenaConsentText.ts'
import { sendPhoneRequest } from './phoneBlockSubmit.ts'
import { PHONE_BLOCK_VERSION_FORMAT } from '../app/wycena/phoneBlockTexts.ts'

const okBody = {
  ok: true, as_of_date: '2026-10-18', band: { key: '50_70', label: '50-70 m²' },
  offers: { available: true, level: 'dzielnica', place: 'Podczele', count: 120, median_price_per_m2: 12300, range: { p25: 11000, p75: 13800 } },
  transactions: { available: true, count: 41, median_price_per_m2: 11500, range: { p25: 10200, p75: 12900 }, as_of: '08.2026', note: 'wszystkie standardy, rejestr nie zawiera stanu' },
}

// TEKST K1 zatwierdzony DOSLOWNIE przez Daniela (18.10.2026): kopia w tescie celowo, zeby kazda zmiana w pliku zrodlowym wymagala swiadomej zmiany tutaj.
const APPROVED_CONSENT_TEXT = 'Chcę, aby agent InvestRent skontaktował się ze mną telefonicznie w sprawie dokładniejszej wyceny tej nieruchomości. To nie jest zgoda na przesyłanie ofert marketingowych.'

test('flaga OFF (domyslnie): karta i checkbox nieaktywne mimo gotowego tekstu zgody', async () => {
  const f = await import('./wycenaFlags.ts')
  const on = process.env.NEXT_PUBLIC_WYCENA_MARKET_CARD === 'on' // przy fladze ON w srodowisku testu oczekujemy aktywnej karty (tekst jest gotowy)
  assert.equal(f.MARKET_CARD_FLAG, on); assert.equal(f.MARKET_CARD_ACTIVE, on)
  assert.equal(consentTextReady(CONSENT_TEXT), true)
  assert.equal(marketCardActive(false), false) // flaga OFF = nic sie nie zmienia, nawet z gotowym tekstem
  assert.match(CONSENT_VERSION, PHONE_BLOCK_VERSION_FORMAT)
})

test('tekst zgody K1 DOSLOWNIE jak zatwierdzony, wersja wycena-2026-10-18-v2 (ta sama co na liscie w CRM)', () => {
  assert.equal(CONSENT_TEXT, APPROVED_CONSENT_TEXT)
  assert.equal(CONSENT_VERSION, 'wycena-2026-10-18-v2')
  assert.ok(!/inwestor|zagranicz/i.test(CONSENT_TEXT), 'dopisek o inwestorach zagranicznych NIE wchodzi do zgody')
})

test('placeholder / pusty tekst zgody blokuje aktywacje nawet przy fladze ON; gotowy tekst + flaga = aktywna', () => {
  for (const bad of [null, undefined, '', '   ', 'krotki', CONSENT_PLACEHOLDER, `x ${CONSENT_PLACEHOLDER} y y y y y y y`]) {
    assert.equal(consentTextReady(bad), false, String(bad))
    assert.equal(marketCardActive(true, bad ?? null), false) // undefined = domyslny parametr (CONSENT_TEXT), wiec jawnie null
  }
  const real = 'Przykładowy dłuższy tekst zgody do testu.'
  assert.equal(marketCardActive(true, real), true)
  assert.equal(marketCardActive(false, real), false)
})

test('BLOKADA: flaga ON w srodowisku testu/builda wymaga gotowego tekstu zgody (CONSENT_TEXT)', () => {
  if (process.env.NEXT_PUBLIC_WYCENA_MARKET_CARD === 'on') {
    assert.ok(consentTextReady(CONSENT_TEXT), 'NEXT_PUBLIC_WYCENA_MARKET_CARD=on, a CONSENT_TEXT to placeholder/pusty: uzupelnij zatwierdzony tekst (src/lib/wycenaConsentText.ts)')
  }
})

test('prebuild: flaga ON + zatwierdzony tekst = exit 0; flaga OFF = exit 0; flaga ON + placeholder (kopia drzewa) = exit 1', () => {
  const run = (env, script = 'scripts/check-market-card-consent.mjs') => spawnSync(process.execPath, [script], { env: { ...process.env, ...env }, encoding: 'utf8' })
  assert.equal(run({ NEXT_PUBLIC_WYCENA_MARKET_CARD: 'on' }).status, 0)
  assert.equal(run({ NEXT_PUBLIC_WYCENA_MARKET_CARD: '' }).status, 0)
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wy-consent-'))
  try {
    fs.mkdirSync(path.join(tmp, 'scripts')); fs.mkdirSync(path.join(tmp, 'src', 'lib'), { recursive: true })
    fs.copyFileSync('scripts/check-market-card-consent.mjs', path.join(tmp, 'scripts', 'check-market-card-consent.mjs'))
    fs.writeFileSync(path.join(tmp, 'src', 'lib', 'wycenaConsentText.ts'), "export const CONSENT_TEXT: string | null = null\n")
    assert.equal(run({ NEXT_PUBLIC_WYCENA_MARKET_CARD: 'on' }, path.join(tmp, 'scripts', 'check-market-card-consent.mjs')).status, 1)
    fs.writeFileSync(path.join(tmp, 'src', 'lib', 'wycenaConsentText.ts'), "export const CONSENT_TEXT: string | null = 'TEKST_ZGODY_DO_UZUPELNIENIA'\n")
    assert.equal(run({ NEXT_PUBLIC_WYCENA_MARKET_CARD: 'on' }, path.join(tmp, 'scripts', 'check-market-card-consent.mjs')).status, 1)
  } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
})

test('karta: dwie wartosci OSOBNO (oferty i transakcje), bez mediany lacznej', () => {
  const v = interpretMarketCard(200, okBody)
  assert.equal(v.kind, 'card')
  assert.equal(v.offers.count, 120); assert.equal(v.offers.median, 12300); assert.equal(v.offers.level, 'dzielnica')
  assert.equal(v.transactions.asOf, '08.2026'); assert.equal(v.transactions.median, 11500); assert.equal(v.transactions.count, 41)
  assert.ok(!('median' in v), 'brak mediany laczonej na poziomie karty')
})

test('brak danych: obie sekcje unavailable = nodata (komunikat bez karty); blad/404/niespojne = none', () => {
  const none = { ok: true, offers: { available: false, reason: 'brak_danych' }, transactions: { available: false, reason: 'brak_danych_transakcyjnych' } }
  assert.deepEqual(interpretMarketCard(200, none), { kind: 'nodata' })
  assert.deepEqual(interpretMarketCard(404, { ok: false, enabled: false }), { kind: 'none' })
  assert.deepEqual(interpretMarketCard(503, { ok: false }), { kind: 'none' })
  assert.deepEqual(interpretMarketCard(200, null), { kind: 'none' })
})

test('jedna sekcja dostepna: druga null (uczciwy brak), nic nie jest zmyslane', () => {
  const v = interpretMarketCard(200, { ...okBody, transactions: { available: false, reason: 'brak_danych_transakcyjnych' } })
  assert.equal(v.kind, 'card'); assert.equal(v.transactions, null); assert.ok(v.offers)
})

test('filtr stanu (tylko oferty): liczba ofert w stanie i ostrzezenie "mala proba" gdy <8', () => {
  const small = interpretMarketCard(200, { ...okBody, offers: { ...okBody.offers, condition: 'do_remontu', condition_count: 5, count_all_standards: 120, count: 5, warning: 'mala_proba' } })
  assert.equal(small.offers.smallSample, true); assert.equal(small.offers.conditionCount, 5); assert.equal(small.offers.countAllStandards, 120)
  const enough = interpretMarketCard(200, { ...okBody, offers: { ...okBody.offers, condition: 'do_zamieszkania', condition_count: 30, count_all_standards: 120, count: 30 } })
  assert.equal(enough.offers.smallSample, false)
  // ostrzezenie wyliczane tez bez flagi z API
  const noFlag = interpretMarketCard(200, { ...okBody, offers: { ...okBody.offers, condition: 'deweloperski', condition_count: 7, count: 7 } })
  assert.equal(noFlag.offers.smallSample, true)
  // transakcje nie zalezą od filtra
  assert.equal(small.transactions.median, 11500)
})

test('fetchMarketCard: wysyla token i opcjonalny condition; blad sieci = none (nie rzuca)', async () => {
  const calls = []
  const f = async (u, i) => { calls.push([u, JSON.parse(i.body)]); return { status: 200, json: async () => okBody } }
  const v = await fetchMarketCard('tok', 'do_remontu', { fetchImpl: f })
  assert.equal(v.kind, 'card'); assert.equal(calls[0][0], MARKET_CARD_URL)
  assert.deepEqual(calls[0][1], { valuation_token: 'tok', condition: 'do_remontu' })
  await fetchMarketCard('tok', null, { fetchImpl: f }); assert.deepEqual(calls[1][1], { valuation_token: 'tok' })
  assert.deepEqual(await fetchMarketCard('tok', null, { fetchImpl: async () => { throw new Error('net') } }), { kind: 'none' })
})

test('formatowanie PL', () => {
  assert.equal(fmtPpm(12300), '12\u00a0300\u00a0zł/m²')
  assert.equal(fmtRange(11000, 13800), '11\u00a0000\u00a0zł/m² – 13\u00a0800\u00a0zł/m²')
  assert.equal(fmtRange(null, 1), null)
  assert.equal(fmtAsOfDate('2026-10-18'), '18.10.2026')
})

test('okno kontaktu: wysylane jako contact_window tylko gdy wybrane; bez wyboru body bez zmian', async () => {
  const base = { phone: '512 345 678', valuationToken: 'tok.abc', consentVersion: CONSENT_VERSION, values: {}, outcome: null, utm: '', turnstileToken: null, honeypot: '' }
  const bodies = []
  const deps = { callbackEnabled: true, callbackUrl: 'x', fetchImpl: async (u, i) => { bodies.push(JSON.parse(i.body)); return { ok: true, status: 200, json: async () => ({ ok: true }) } }, submitLeadFallback: async () => ({ ok: true }) }
  await sendPhoneRequest({ ...base, contactWindow: 'rano' }, deps)
  await sendPhoneRequest(base, deps)
  assert.equal(bodies[0].contact_window, 'rano'); assert.ok(CONTACT_WINDOWS.includes(bodies[0].contact_window))
  assert.ok(!('contact_window' in bodies[1]))
  // wersja zgody K1 jedzie w tym samym payloadzie co okno kontaktu
  assert.deepEqual(bodies[0].consent, { checked: true, version: 'wycena-2026-10-18-v2' })
  assert.deepEqual(bodies[1].consent, { checked: true, version: 'wycena-2026-10-18-v2' })
})

test('teksty karty i bloku: bez "bezplatn", bez obietnic terminu, bez trendu; formy "Panstwo"', async () => {
  const m = await import('../app/wycena/marketCardTexts.ts')
  const flat = JSON.stringify(m.MARKET_CARD_TEXTS) + m.MARKET_CARD_TEXTS.smallSample(3) + m.MARKET_CARD_TEXTS.offersCount(5)
  assert.ok(!/bezp[łl]atn|gratis|za darmo|gwarant/i.test(flat), 'bez bezplatnie')
  assert.ok(!/(w ci[aą]gu|natychmiast|szybko|dzi[sś]\b|jutro|\d+\s*(min|h|godz))/i.test(flat), 'bez terminu oddzwonienia')
  assert.ok(!/trend|wzrost|spadek|rośnie|maleje|prognoz/i.test(flat), 'bez twierdzen o trendzie')
  assert.ok(!/\bTwoj|\bTwó|\bpodaj\b|\bwybierz\b/i.test(flat), 'forma Panstwo')
})

test('PhoneBlock: karta, okno i checkbox tylko pod MARKET_CARD_ACTIVE; tekst checkboxa z CONSENT_TEXT (jedno miejsce)', () => {
  const src = fs.readFileSync(new URL('../app/wycena/PhoneBlock.tsx', import.meta.url), 'utf8')
  assert.match(src, /const mc = MARKET_CARD_ACTIVE/)
  assert.match(src, /\{mc && <MarketCard/)
  assert.match(src, /\{mc && \(\s*<>/)
  assert.match(src, /\{CONSENT_TEXT\}/)
  assert.ok(!/TEKST_ZGODY_DO_UZUPELNIENIA/.test(src))
  // wersja K1 w obu sciezkach (callback i zapis awaryjny) pod mc; bez mc dotychczasowa PHONE_BLOCK_CONSENT_VERSION
  assert.equal((src.match(/consentVersion: mc \? CONSENT_VERSION : PHONE_BLOCK_CONSENT_VERSION/g) ?? []).length, 2)
})

test('PhoneBlock: pod checkboxem istniejaca klauzula PHONE_BLOCK_LEGAL (BEZ przepisywania) i dopisek "To nie jest operat"; checkbox przed klauzula', async () => {
  const src = fs.readFileSync(new URL('../app/wycena/PhoneBlock.tsx', import.meta.url), 'utf8')
  const iBox = src.indexOf('id="wy-consent" type="checkbox"')
  const iClause = src.indexOf('{L.clauseBeforeLink}')
  const iAppraisal = src.indexOf('{mc && <p style={{ ...hintStyle, margin: \'8px 0 0\' }}>{L.notAppraisal}</p>}')
  assert.ok(iBox > 0 && iClause > iBox, 'klauzula informacyjna pod checkboxem')
  assert.ok(iAppraisal > iClause, 'dopisek "To nie jest operat" pod klauzula (przy fladze ON)')
  assert.match(src, /\{!mc && <p[^>]*>\{L\.notAppraisal\}<\/p>\}/, 'przy fladze OFF dopisek zostaje w dotychczasowym miejscu')
  assert.match(src, /PHONE_BLOCK_LEGAL as L/)
  const t = await import('../app/wycena/phoneBlockTexts.ts')
  assert.equal(t.PHONE_BLOCK_LEGAL.notAppraisal, 'To nie jest operat szacunkowy rzeczoznawcy majątkowego.')
  assert.ok(t.PHONE_BLOCK_LEGAL.clauseBeforeLink.startsWith('Administratorem danych jest InvestRent sp. z o.o.'))
  assert.ok(!/Administratorem danych/.test(fs.readFileSync(new URL('./wycenaConsentText.ts', import.meta.url), 'utf8')), 'klauzula nie jest przepisana do pliku zgody')
})