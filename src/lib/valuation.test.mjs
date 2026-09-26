// Uruchom: node --test src/lib/valuation.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validateForm, buildPayload, interpretResponse, requestEstimate, buildLeadNotes,
  isValidPhone, readUtm, EMPTY_FORM, fieldApplies, isOutOfScope, submittedTooFast, buildConsentMarker, formatRetryAfter,  CONSENT_VERSION, NOTES_MAX,
} from './valuation.ts'
import { OTHER_CITY, OTHER_DISTRICT, canonicalCity, canonicalDistrict, INVESTRENT_CONFIG, CALCULATOR_CONFIG, isHomeCity, isRestrictedDistrict } from './localities.ts'
import fs from 'node:fs'
const bp = buildPayload

const ok = { ...EMPTY_FORM, property_type: 'mieszkanie', district: 'Podczele', area_m2: '52,5', rooms: '3', floor: '2', condition: 'dobry' }
const json = (body, status = 200) => async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

test('walidacja: pusty formularz -> brak typu i powierzchni, miasto domyslnie Kolobrzeg', () => {
  const e = validateForm(EMPTY_FORM)
  assert.ok(e.property_type); assert.ok(e.area_m2); assert.equal(e.city, undefined)
})
test('walidacja: poprawny formularz bez bledow', () => assert.deepEqual(validateForm(ok), {}))
test('walidacja: metraz poza zakresem i pietro niecalkowite', () => {
  assert.ok(validateForm({ ...ok, area_m2: '5' }).area_m2)
  assert.ok(validateForm({ ...ok, area_m2: '2500' }).area_m2)
  assert.ok(validateForm({ ...ok, floor: '2.5' }).floor)
  assert.equal(validateForm({ ...ok, property_type: 'dzialka', area_m2: '2500', rooms: 'x' }).area_m2, undefined)
})
test('payload: liczby, honeypot pusty, dzialka bez pokoi/pietra/stanu', () => {
  const p = buildPayload(ok)
  assert.equal(p.area_m2, 52.5); assert.equal(p.rooms, 3); assert.equal(p.floor, 2); assert.equal(p.website, '')
  const d = buildPayload({ ...ok, property_type: 'dzialka' })
  assert.equal(d.rooms, undefined); assert.equal(d.floor, undefined); assert.equal(d.condition, undefined)
  assert.equal(fieldApplies('dom', 'floor'), false)
})
test('payload: turnstile_token dolaczany tylko gdy jest', () => {
  assert.equal(buildPayload(ok, '', 'tok').turnstile_token, 'tok'); assert.equal('turnstile_token' in buildPayload(ok), false)
})
test('odpowiedz: range', () => {
  const r = interpretResponse(200, { ok: true, mode: 'range', range: { low: 400000, high: 480000 }, price_per_m2: { low: 8000, high: 9500 }, comparables: { min: 10, max: 19 }, quality: 'srednia', disclaimer: 'x', message: 'm' })
  assert.equal(r.kind, 'range'); assert.equal(r.range.low, 400000); assert.equal(r.pricePerM2.high, 9500)
})
test('odpowiedz: range z blednymi widelkami -> no_numbers (nigdy zgadywana liczba)', () => {
  assert.equal(interpretResponse(200, { ok: true, mode: 'range', range: { low: 500, high: 100 } }).kind, 'no_numbers')
  assert.equal(interpretResponse(200, { ok: true, mode: 'range' }).kind, 'no_numbers')
})
test('odpowiedz: no_numbers, 429, 503, 400, smieci', () => {
  assert.equal(interpretResponse(200, { ok: true, mode: 'no_numbers', message: 'a' }).kind, 'no_numbers')
  const rl = interpretResponse(429, { ok: false, error: 'rate_limited', retry_after_seconds: 3600 })
  assert.equal(rl.kind, 'rate_limited'); assert.equal(rl.retryAfterSeconds, 3600)
  assert.equal(interpretResponse(503, { ok: false, error: 'disabled' }).kind, 'disabled')
  assert.equal(interpretResponse(400, { error: 'bad' }).kind, 'invalid')
  assert.equal(interpretResponse(200, { ok: true, mode: 'cos' }).kind, 'error')
  assert.equal(interpretResponse(500, {}).kind, 'error')
})
test('requestEstimate: siec, HTML 502, 503 bez JSON, sukces', async () => {
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: async () => { throw new TypeError('x') } })).reason, 'network')
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: async () => new Response('<html>', { status: 502 }) })).reason, 'http')
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: async () => new Response('', { status: 503 }) })).kind, 'disabled')
  const r = await requestEstimate('http://x', buildPayload(ok), { fetchImpl: json({ ok: true, mode: 'no_numbers' }) })
  assert.equal(r.kind, 'no_numbers')
})
test('requestEstimate: timeout -> error timeout', async () => {
  const hang = (_u, init) => new Promise((_, rej) => init.signal.addEventListener('abort', () => rej(new Error('abort'))))
  assert.equal((await requestEstimate('http://x', buildPayload(ok), { fetchImpl: hang, timeoutMs: 20 })).reason, 'timeout')
})
test('telefon i UTM', () => {
  assert.ok(isValidPhone('731 554 341')); assert.ok(isValidPhone('+48731554341')); assert.ok(!isValidPhone('12345'))
  assert.equal(readUtm('?utm_source=meta&utm_campaign=wycena&x=1'), 'utm_source=meta utm_campaign=wycena')
})
const rangeOut = { kind: 'range', range: { low: 400000, high: 480000 }, pricePerM2: null, comparables: null, quality: null, disclaimer: null, message: null }
test('notatka leada v11: dane, wynik, znacznik zgody (tylko telefon-wycena, bez id_hash i marketingu), UTM', () => {
  const n = buildLeadNotes(ok, rangeOut, 'utm_source=meta', { at: '2026-09-26T10:00:00.000Z' })
  assert.ok(n.startsWith('[Zgoda-kalkulator] kanał=telefon-wycena; czas=2026-09-26T10:00:00.000Z; wersja=wycena-2026-09-26-v11'))
  assert.ok(n.includes('Źródło: kalkulator wyceny (z wynikiem: tak)')); assert.ok(n.includes('Mieszkanie, Kołobrzeg (Podczele)')); assert.ok(n.includes('52,5 m²')); assert.ok(n.includes('utm_source=meta'))
  assert.ok(CONSENT_VERSION === 'wycena-2026-09-26-v11')
  assert.ok(!/marketing|id_hash|sms/i.test(n))
})
test('notatka leada v11: z dlugim UTM miesci sie w limicie 500 znakow backendu, znacznik zgody nieuciety (backend obcina po 500)', () => {
  const longUtm = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k => k + '=' + 'x'.repeat(80)).join(' ')
  const n = buildLeadNotes({ ...ok, district: 'Radzikowo-Osiedle Nadmorskie' }, rangeOut, longUtm, { at: '2026-09-26T10:00:00.000Z' })
  assert.ok(n.length <= NOTES_MAX && NOTES_MAX < 500, 'dlugosc ' + n.length)
  assert.ok(n.startsWith('[Zgoda-kalkulator] kanał=telefon-wycena; czas=2026-09-26T10:00:00.000Z; wersja=wycena-2026-09-26-v11'))
  const clean = String(n).slice(0, 500).replace(/[<>]/g, '') // jak backend: clean(notes)
  assert.equal(clean, n)
})
test('zakres liczb: dom, dzialka, inna miejscowosc, Srodmiescie = poza zakresem; mieszkanie Kolobrzeg z dzielnica = w zakresie', () => {
  assert.equal(isOutOfScope(ok), false)
  assert.equal(isOutOfScope({ ...ok, property_type: 'dom' }), true); assert.equal(isOutOfScope({ ...ok, property_type: 'dzialka' }), true)
  assert.equal(isOutOfScope({ ...ok, city: 'Koszalin' }), true)
  assert.equal(isOutOfScope({ ...ok, district: 'Śródmieście' }), true); assert.equal(isOutOfScope({ ...ok, district: 'Stare Miasto' }), true)
  assert.equal(isOutOfScope({ ...ok, city: 'kolobrzeg' }), false)
})
test('walidacja: mieszkanie w Kolobrzegu bez dzielnicy = blad z wyjasnieniem; dom i inne miasto bez dzielnicy OK', () => {
  assert.match(validateForm({ ...ok, district: '' }).district, /Wybierz dzielnicę lub osiedle z listy/)
  assert.equal(validateForm({ ...ok, property_type: 'dom', district: '' }).district, undefined)
  assert.equal(validateForm({ ...ok, city: 'Koszalin', district: '' }).district, undefined)
})
test('minimalny czas wypelnienia: < 3 s od zaladowania = za szybko', () => {
  assert.equal(submittedTooFast(1000, 2500), true); assert.equal(submittedTooFast(1000, 4000), false); assert.equal(submittedTooFast(1000, 4000, 5000), true)
})
test('znacznik zgody: pola kanał/czas/wersja czytelne dla redakcji retencji (kanał[:=], czas ISO, wersja), bez danych kontaktowych', () => {
  const m = buildConsentMarker({ at: '2026-09-26T10:00:00.000Z' })
  const field = key => new RegExp(String.raw`(?:^|[;\s])` + key + String.raw`[:=]\s*([^;]*)`, 'i').exec(m)?.[1]?.trim()
  assert.equal(field('kanał'), 'telefon-wycena'); assert.equal(field('czas'), '2026-09-26T10:00:00.000Z'); assert.equal(field('wersja'), CONSENT_VERSION)
  // jak w backendzie (consentNoteHasContactData): daty ISO (takze w numerze wersji) sa odejmowane przed liczeniem cyfr
  const withoutTime = m.replace(new RegExp(String.raw`\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z)?`, 'g'), '')
  assert.ok(!m.includes('@')); assert.ok((withoutTime.match(new RegExp(String.raw`\d`, 'g')) ?? []).length < 9)
})
test('teksty: liczba porownan (przedzial i "min lub wiecej" gdy max == min)', async () => {
  const { T } = await import('../app/wycena/texts.ts')
  assert.equal(T.result.comparables(20, 49), 'Do szacunku wykorzystaliśmy co najmniej 20 porównywalnych nieruchomości z okolicy.')
  assert.equal(T.result.comparables(50, 50), 'Do szacunku wykorzystaliśmy co najmniej 50 porównywalnych nieruchomości z okolicy.')
})
test('komunikat limitu: czas ponowienia z retry_after_seconds backendu (okno 1 h albo 24 h)', () => {
  assert.equal(formatRetryAfter(30), 'minutę'); assert.equal(formatRetryAfter(1800), '30 min')
  assert.equal(formatRetryAfter(7200), '2 h'); assert.equal(formatRetryAfter(200000), '24 h')
  assert.equal(formatRetryAfter(null), '24 h')
})
test('teksty: brak realnego numeru w komunikatach i jedno okreslenie zgody na telefon', async () => {
  const { T } = await import('../app/wycena/texts.ts')
  const all = JSON.stringify(T)
  assert.ok(!all.includes('600 100 200')); assert.ok(!all.includes('zgodę na kontakt'))
  assert.ok(T.errors.rateLimited('2 h').includes('za około 2 h'))
})
test('teksty v11: zadnego marketingu, skrotu numeru ani "3 lat" w tekstach publicznych; jedna zgoda na telefon w sprawie wyceny', async () => {
  const { T } = await import('../app/wycena/texts.ts')
  const all = JSON.stringify(T)
  for (const w of ['marketing','SMS','STOP','skrót','HMAC','3 lata','3 lat','art. 17']) assert.ok(!all.toLowerCase().includes(w.toLowerCase()), 'zakazana fraza: ' + w)
  assert.equal(T.lead.consentMarketing, undefined); assert.equal(T.lead.consentMarketingOptional, undefined)
  assert.ok(T.lead.consentCall.includes('wyłącznie w sprawie wyceny mojej nieruchomości')); assert.ok(T.lead.consentCall.includes('mówiąc o tym podczas rozmowy'))
  assert.ok(T.lead.consentCallRequired.includes('wymagana'))
  const items = T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]).join(' ')
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas): wygasa razem ze zgłoszeniem'))
  assert.ok(items.includes('Zgodę możesz cofnąć e-mailem (biuro@investrent.com.pl) albo w rozmowie z pracownikiem biura'))
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny, adres IP'))
  assert.ok(T.errors.rateLimited('2 h').includes('za około 2 h')); assert.ok(!all.includes('do 24'))
  assert.ok(all.includes('Przekazanie danych do Cloudflare i Google opiera się na Data Privacy Framework'))
  assert.ok(T.result.outOfScopeBody.endsWith('zadzwonimy tylko w sprawie Twojej wyceny.'))
})
test('miejscowosc i dzielnica: slowniki zamiast wolnego tekstu (v11.2); poza slownikiem blad albo "Inna ..."', () => {
  assert.equal(canonicalCity('kolobrzeg'), 'Kołobrzeg'); assert.equal(canonicalCity('KOSZALIN '), 'Koszalin'); assert.equal(canonicalCity('inna lokalizacja'), OTHER_CITY)
  assert.equal(canonicalCity('Jan Kowalski'), null); assert.equal(canonicalCity('ul. Morska 3'), null)
  assert.equal(canonicalDistrict('podczele'), 'Podczele'); assert.equal(canonicalDistrict('Mickiewicza 5'), null); assert.equal(canonicalDistrict('Inna dzielnica'), OTHER_DISTRICT)
  assert.ok(validateForm({ ...ok, city: 'Jan Kowalski' }).city)
  assert.ok(validateForm({ ...ok, district: 'Mickiewicza 5' }).district)
  assert.equal(validateForm({ ...ok, district: 'Podczele' }).district, undefined)
  assert.equal(validateForm({ ...ok, district: OTHER_DISTRICT }).district, undefined)
  assert.equal(validateForm({ ...ok, city: 'Koszalin', district: 'cokolwiek' }).district, undefined) // dzielnica dotyczy tylko Kolobrzegu
})
test('payload v11.2: nazwy kanoniczne ze slownika; "Inna dzielnica" i dzielnica poza Kolobrzegiem nie sa wysylane; isOutOfScope dla "Inna dzielnica"', () => {
  assert.equal(bp({ ...ok, city: 'kolobrzeg', district: 'podczele' }).district, 'Podczele')
  assert.equal(bp({ ...ok, district: OTHER_DISTRICT }).district, undefined)
  assert.equal(bp({ ...ok, city: 'Koszalin', district: 'Podczele' }).district, undefined)
  assert.equal(isOutOfScope({ ...ok, district: OTHER_DISTRICT }), true)
})
test('teksty v11.2: okres z numerem (T-f: umowa przed pulapem, kontakt = rozmowa/wiadomosc, nieodebrane nie licza sie, ponowne zgloszenie nie odnawia), T-g, T-h, T-e', async () => {
  const { T } = await import('../app/wycena/texts.ts')
  const sp = String.fromCharCode(160)
  const items = T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]).join(' ').split(sp).join(' ')
  const last = T.how.body[T.how.body.length - 1].split(sp).join(' ')
  const iUmowa = items.indexOf('jeśli dojdzie do umowy'), iPulap = items.indexOf('najpóźniej 24 miesiące po pierwszym zgłoszeniu')
  assert.ok(iUmowa >= 0 && iPulap > iUmowa, 'wyjatek umowy przed pulapem')
  assert.ok(items.includes('ostatniej rozmowie z Tobą lub Twojej wiadomości w sprawie wyceny')); assert.ok(items.includes('ponowne zgłoszenie tego terminu nie odnawia'))
  assert.ok(items.includes('Nieodebrane próby kontaktu z naszej strony tych okresów nie wydłużają'))
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas): wygasa razem ze zgłoszeniem.'))
  assert.ok(last.indexOf('jeśli dojdzie do umowy') < last.indexOf('najpóźniej 24 miesiące')); assert.ok(last.includes('nieodebrane próby kontaktu z naszej strony okresów nie wydłużają'))
  assert.ok(items.includes('przedział powierzchni co 10 m², miejscowość i dzielnica z listy'))
  assert.ok(items.includes('Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu'))
  assert.equal(T.lead.titleRange, 'Chcesz omówić wynik z agentem?'); assert.ok(!/mapą|raport/i.test(T.lead.bodyRange)); assert.ok(T.lead.bodyRange.includes('przygotuje wycenę indywidualną'))
})
test('konfiguracja per biuro (SaaS): miasto domowe, slowniki i wylaczone dzielnice z konfiguracji; zrodlo i data przegladu listy dzielnic jawne', () => {
  assert.equal(CALCULATOR_CONFIG, INVESTRENT_CONFIG)
  assert.equal(isHomeCity('kolobrzeg'), true); assert.equal(isHomeCity('Koszalin'), false)
  assert.equal(isRestrictedDistrict('Śródmieście'), true); assert.equal(isRestrictedDistrict('Centrum'), true); assert.equal(isRestrictedDistrict('Podczele'), false)
  assert.ok(INVESTRENT_CONFIG.districtsSource.includes('portal_listings_archive')); assert.equal(INVESTRENT_CONFIG.districtsReviewedAt, null)
  assert.ok(!INVESTRENT_CONFIG.districts.includes('Dzielnica Uzdrowiskowa'), 'nazwy tylko z danych, nie z pamieci')
})
test('Srodmiescie i "Inna dzielnica" nie daja widelek online (tylko wycena agenta); dzielnica z listy poza Srodmiesciem tak', () => {
  assert.equal(isOutOfScope({ ...ok, district: 'Śródmieście' }), true); assert.equal(isOutOfScope({ ...ok, district: 'Inna dzielnica' }), true)
  assert.equal(isOutOfScope({ ...ok, district: 'Zachodnia' }), false)
})
test('test kontraktowy slownikow front/backend: front == wspolny plik slowniki_kalkulatora_2026_09_26.json (kontrakt sekcja 13.11)', t => {
  const url = new URL('../../../../_wspolne_pliki/slowniki_kalkulatora_2026_09_26.json', import.meta.url)
  if (!fs.existsSync(url)) { t.skip('brak wspolnego pliku slownikow (uruchamiane poza repozytorium projektu)'); return }
  const shared = JSON.parse(fs.readFileSync(url, 'utf8'))
  for (const k of ['homeCity', 'cities', 'districts', 'restrictedDistrictPatterns', 'otherCity', 'otherDistrict', 'districtsSource', 'districtsReviewedAt']) {
    assert.deepEqual(shared[k], INVESTRENT_CONFIG[k], 'rozjazd slownika front/plik wspolny: ' + k)
  }
})
