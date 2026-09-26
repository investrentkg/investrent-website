// Uruchom: node --test src/lib/valuation.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validateForm, buildPayload, interpretResponse, requestEstimate, buildLeadNotes,
  isValidPhone, readUtm, EMPTY_FORM, fieldApplies, isOutOfScope, submittedTooFast, buildConsentMarker, formatRetryAfter,  CONSENT_VERSION, NOTES_MAX,
} from './valuation.ts'
import { OTHER_CITY, OTHER_DISTRICT, canonicalCity, canonicalDistrict, INVESTRENT_CONFIG, CALCULATOR_CONFIG, isHomeCity, isRestrictedDistrict, fold } from './localities.ts'
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
  assert.ok(n.startsWith('[Zgoda-kalkulator] kanał=telefon-wycena; czas=2026-09-26T10:00:00.000Z; wersja=wycena-2026-09-27-v12'))
  assert.ok(n.includes('Źródło: kalkulator wyceny (z wynikiem: tak)')); assert.ok(n.includes('Mieszkanie, Kołobrzeg (Podczele)')); assert.ok(n.includes('52,5 m²')); assert.ok(n.includes('utm_source=meta'))
  assert.ok(CONSENT_VERSION === 'wycena-2026-09-27-v12')
  assert.ok(!/marketing|id_hash|sms/i.test(n))
})
test('notatka leada v11: z dlugim UTM miesci sie w limicie 500 znakow backendu, znacznik zgody nieuciety (backend obcina po 500)', () => {
  const longUtm = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k => k + '=' + 'x'.repeat(80)).join(' ')
  const n = buildLeadNotes({ ...ok, district: 'Radzikowo-Osiedle Nadmorskie' }, rangeOut, longUtm, { at: '2026-09-26T10:00:00.000Z' })
  assert.ok(n.length <= NOTES_MAX && NOTES_MAX < 500, 'dlugosc ' + n.length)
  assert.ok(n.startsWith('[Zgoda-kalkulator] kanał=telefon-wycena; czas=2026-09-26T10:00:00.000Z; wersja=wycena-2026-09-27-v12'))
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
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  assert.equal(T.result.comparables(20, 49), 'Do szacunku wykorzystaliśmy co najmniej 20 porównywalnych nieruchomości z Twojej miejscowości.')
  assert.equal(T.result.comparables(50, 50), 'Do szacunku wykorzystaliśmy co najmniej 50 porównywalnych nieruchomości z Twojej miejscowości.')
})
test('komunikat limitu: czas ponowienia z retry_after_seconds backendu (okno 1 h albo 24 h)', () => {
  assert.equal(formatRetryAfter(30), 'minutę'); assert.equal(formatRetryAfter(1800), '30 min')
  assert.equal(formatRetryAfter(7200), '2 h'); assert.equal(formatRetryAfter(200000), '24 h')
  assert.equal(formatRetryAfter(null), '24 h')
})
test('teksty: brak realnego numeru w komunikatach i jedno okreslenie zgody na telefon', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const all = JSON.stringify(T)
  assert.ok(!all.includes('600 100 200')); assert.ok(!all.includes('zgodę na kontakt'))
  assert.ok(T.errors.rateLimited('2 h').includes('za około 2 h'))
})
test('teksty v11: zadnego marketingu, skrotu numeru ani "3 lat" w tekstach publicznych; jedna zgoda na telefon w sprawie wyceny', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const all = JSON.stringify(T)
  for (const w of ['marketing','SMS','STOP','skrót','HMAC','3 lata','3 lat','art. 17']) assert.ok(!all.toLowerCase().includes(w.toLowerCase()), 'zakazana fraza: ' + w)
  assert.equal(T.lead.consentMarketing, undefined); assert.equal(T.lead.consentMarketingOptional, undefined)
  assert.ok(T.lead.consentCall.includes('wyłącznie w sprawie wyceny mojej nieruchomości')); assert.ok(!T.lead.consentCall.includes('mówiąc o tym podczas rozmowy') && !T.lead.consentCall.includes('dzwoniąc do biura')); assert.ok(T.lead.consentCall.endsWith('pisząc na biuro@investrent.com.pl.'))
  assert.ok(T.lead.consentCallRequired.includes('wymagana'))
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ')
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas): wygasa razem ze zgłoszeniem'))
  assert.ok(items.includes('Zgodę na telefon w sprawie wyceny możesz cofnąć, pisząc na biuro@investrent.com.pl. Po cofnięciu nie zadzwonimy do Ciebie w sprawie wyceny. Wnioski o pozostałe prawa wyślij na biuro@investrent.com.pl.'))
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny, adres IP'))
  assert.ok(T.errors.rateLimited('2 h').includes('za około 2 h')); assert.ok(!all.includes('do 24'))
  assert.ok(all.includes('Cloudflare: standardowe klauzule umowne UE zawarte w umowie dostawcy')); assert.ok(!all.includes('Cloudflare i Google (dla kont w naszej domenie)'))
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
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const last = [...T.how.body, ...RA.how].slice(-3).join(' ').split(sp).join(' ')
  const iUmowa = items.indexOf('jeśli dojdzie do umowy'), iPulap = items.indexOf('najpóźniej: 24 miesiące po pierwszym zgłoszeniu')
  assert.ok(iUmowa >= 0 && iPulap >= 0, 'wyjatek umowy i pulap jako osobne punkty (T-t, v11.6)')
  assert.ok(items.includes('ostatniej rozmowie z Tobą (telefonicznej lub osobistej) lub Twojej wiadomości w sprawie wyceny')); assert.ok(items.includes('tych 24 miesięcy nie wydłuża'))
  assert.ok(items.includes('nieodebrane próby kontaktu z naszej strony tych okresów nie wydłużają'))
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas): wygasa razem ze zgłoszeniem.'))
  assert.ok(last.indexOf('Wyjątki: umowa') > last.indexOf('najpóźniej 24 miesiące')); assert.ok(last.includes('Nieodebrane próby kontaktu z naszej strony okresów nie wydłużają'))
  assert.ok(items.includes('przedział powierzchni co 10 m², miejscowość i dzielnica z listy'))
  assert.ok(items.includes('Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu'))
  assert.equal(T.lead.titleRange, 'Chcesz omówić wynik z agentem?'); assert.ok(!/mapą|raport/i.test(T.lead.bodyRange)); assert.ok(T.lead.bodyRange.includes('sprawdzi, czy może przygotować wycenę indywidualną'))
})
test('konfiguracja per biuro (SaaS): miasto domowe, slowniki i wylaczone dzielnice z konfiguracji; zrodlo i data przegladu listy dzielnic jawne', () => {
  assert.equal(CALCULATOR_CONFIG, INVESTRENT_CONFIG)
  assert.equal(isHomeCity('kolobrzeg'), true); assert.equal(isHomeCity('Koszalin'), false)
  assert.equal(isRestrictedDistrict('Śródmieście'), true); assert.equal(isRestrictedDistrict('Centrum'), true); assert.equal(isRestrictedDistrict('Podczele'), false)
  assert.ok(INVESTRENT_CONFIG.districtsSource.includes('portal_listings_archive')); assert.equal(INVESTRENT_CONFIG.districtsReviewedAt, '2026-09-26'); assert.ok(INVESTRENT_CONFIG.districtsSource.includes('decyzja Daniela, biuro'))
  assert.ok(!INVESTRENT_CONFIG.districts.includes('Dzielnica Uzdrowiskowa'), 'nazwy tylko z danych, nie z pamieci')
})
test('decyzja biura 26.09: Grzybowo/Bogucino/Budzistowo/Zieleniewo/Dzwirzyno to MIEJSCOWOSCI (nie dzielnice Kolobrzegu); brak widelek online (tylko wycena agenta)', () => {
  for (const c of ['Grzybowo', 'Bogucino', 'Budzistowo', 'Zieleniewo', 'Dźwirzyno']) {
    assert.equal(canonicalCity(c), c); assert.ok(INVESTRENT_CONFIG.cities.includes(c)); assert.equal(canonicalDistrict(c), null, c + ' nie jest dzielnica')
    assert.equal(isHomeCity(c), false); assert.equal(isOutOfScope({ ...ok, city: c, district: 'Inna dzielnica' }), true)
  }
  assert.equal(canonicalCity('dzwirzyno'), 'Dźwirzyno'); assert.equal(canonicalCity('Bogucin'), 'Bogucino')
  assert.ok(!INVESTRENT_CONFIG.districts.some(d => ['grzybowo', 'bogucino', 'budzistowo', 'zieleniewo', 'dzwirzyno'].includes(fold(d))))
})
test('Srodmiescie i "Inna dzielnica" nie daja widelek online (tylko wycena agenta); dzielnica z listy poza Srodmiesciem tak', () => {
  assert.equal(isOutOfScope({ ...ok, district: 'Śródmieście' }), true); assert.equal(isOutOfScope({ ...ok, district: 'Inna dzielnica' }), true)
  assert.equal(isOutOfScope({ ...ok, district: 'Zachodnia' }), false)
})
test('test kontraktowy slownikow front/backend: front == wspolny plik slowniki_kalkulatora_2026_09_26.json (kontrakt sekcja 13.11)', t => {
  const url = new URL('../../../../_wspolne_pliki/slowniki_kalkulatora_2026_09_26.json', import.meta.url)
  if (!fs.existsSync(url)) { t.skip('brak wspolnego pliku slownikow (uruchamiane poza repozytorium projektu)'); return }
  const shared = JSON.parse(fs.readFileSync(url, 'utf8'))
  for (const k of ['homeCity', 'cities', 'districts', 'restrictedDistrictPatterns', 'otherCity', 'otherDistrict', 'districtsSource', 'districtsReviewedAt', 'cityAliases']) {
    assert.deepEqual(shared[k], INVESTRENT_CONFIG[k], 'rozjazd slownika front/plik wspolny: ' + k)
  }
})
test('teksty v11.3: T-i (kolejne zgloszenie nie wydluza 24 mies.), T-j (logi dostawcow bez liczb), telefon biura jako droga cofniecia', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const last = [...T.how.body, ...RA.how].slice(-3).join(' ').split(sp).join(' ')
  assert.ok(items.includes('kolejne zgłoszenie z tego numeru tych 24 miesięcy nie wydłuża')); assert.ok(last.includes('kolejne zgłoszenie z tego numeru tych 24 miesięcy nie wydłuża'))
  assert.ok(!items.includes('ponowne zgłoszenie tego terminu nie odnawia'))
  assert.ok(items.includes('dostawca hostingu naszego serwera (Railway): może przechowywać dzienniki żądań, w tym Twój adres IP, do 30 dni')); assert.ok(!items.includes('kilkudziesięciu dni'))
  assert.ok(!items.includes('dzwoniąc do biura') && !items.includes('731 554 341'), 'v12: cofniecie tylko e-mailem, bez telefonu biura w klauzuli')
})
test('teksty v11.3 (DPA Railway 26.09): Railway w transferze wg umowy powierzenia (bez niepotwierdzonego mechanizmu), wyjatek 30 dni logow Railway od "okolo 24 godzin", brak zdan o Vercel/Brevo/Google/Anthropic jako zabezpieczonych', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  assert.ok(items.includes('Railway: umowa powierzenia z 26.09.2026; mechanizm przekazania (Data Privacy Framework albo standardowe klauzule umowne UE) wskażemy na wniosek'))
  assert.ok(!items.includes('około 24 godzin') && items.includes('krótkotrwale, dla limitu zapytań')); assert.ok(items.includes('do 30 dni')); assert.ok(how.includes('do 30 dni'))
  assert.ok(!items.includes('Vercel opiera się')); assert.ok(!items.includes('standardowych klauzulach umownych zatwierdzonych'))
  assert.ok(items.includes('Google: Data Privacy Framework, a w razie jego braku standardowe klauzule umowne UE'))
})
test('teksty v11.3 (Brevo ustalone): Sendinblue SAS (Francja) jako procesor wg umowy w regulaminie, bez mechanizmu transferu do USA dla Brevo', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  assert.ok(items.includes('Brevo (Sendinblue SAS, Francja; imię, numer telefonu i treść zgłoszenia), na podstawie umowy powierzenia będącej częścią regulaminu usługi'))
  assert.ok(!items.includes('Brevo opiera się')); assert.ok(!items.includes('Brevo i Google'))
})

test('teksty v11.4: T-m (Railway 30 dni pierwsze), T-l (bez kopii DPF, bez Vercel/Brevo), T-o/T-n, doneBody, Anthropic SCC, Podczele tylko jako dzielnica', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const { CITY_LIST, canonicalCity } = await import('./localities.ts')
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  // T-m: dluzszy okres (Railway do 30 dni) przed 24 h w aplikacji, w klauzuli i w "Jak liczymy"
  assert.ok(items.indexOf('do 30 dni') < items.indexOf('krótkotrwale')); assert.ok(how.indexOf('do 30 dni') < how.indexOf('krótkotrwale'))
  // T-l: bez "kopii dokumentu ... Data Privacy Framework", DPF nie jest dokumentem; kopia tylko dla SCC; Anthropic SCC, brak Vercel/Brevo jako zabezpieczonych
  assert.ok(!items.includes('Kopię dokumentu')); assert.ok(items.includes('jeśli to standardowe klauzule umowne, prześlemy ich kopię'))
  assert.ok(items.includes('Anthropic: zabezpieczenie wskazane w warunkach API dostawcy; szczegóły na Twój wniosek (biuro@investrent.com.pl)')); assert.ok(!/Anthropic[^;]*(umow[aeyię] powierzenia|DPA)/.test(items + T.how.body.join(' ')), 'v12: bez umowy/DPA z Anthropic')
  assert.ok(items.includes('Cloudflare: standardowe klauzule umowne UE zawarte w umowie dostawcy; korzysta on też z ram ochrony danych UE-USA (Data Privacy Framework), o ile jego certyfikacja jest w danym czasie aktywna; Google: Data Privacy Framework, a w razie jego braku standardowe klauzule umowne UE'))
  assert.ok(!items.includes('Vercel opiera się')); assert.ok(!items.includes('Supabase opiera się')); assert.ok(!items.includes('Brevo opiera się'))
  // T-o, T-n
  assert.ok(T.disclaimerMore.includes('wybranych dzielnicach Kołobrzegu (lista w formularzu)')); assert.ok(!T.disclaimerMore.includes('z wyjątkiem Śródmieścia'))
  assert.ok(T.result.outOfScopeBody.includes('wybranych dzielnicach Kołobrzegu (lista w formularzu)'))
  assert.ok(T.fields.district_hint.includes('także pozycji „Centrum” i „Stare Miasto”'))
  // doneBody bez obietnicy wyniku
  assert.equal(T.lead.doneBody, 'Agent skontaktuje się z Tobą telefonicznie w godzinach pracy biura.')
  // Podczele: dzielnica Kolobrzegu, nie osobna miejscowosc
  assert.ok(!CITY_LIST.includes('Podczele')); assert.equal(canonicalCity('Podczele'), null)
})

test('teksty v11.5: T-l2 (lista, Supabase UE), T-r, T-q, T-s, consentCall 3 drogi, wyjatek rozmowy o wspolpracy, kalendarz bez numeru, "sprawdzi"', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  assert.ok(items.includes('Supabase (baza danych): dane przechowywane w regionie UE (Irlandia); umowa powierzenia zawiera standardowe klauzule umowne UE'))
  assert.ok(items.includes('Vercel (hosting strony): Data Privacy Framework oraz umowa powierzenia przetwarzania danych;')); assert.ok(!/Vercel[^.;]*(SCC|klauzul)/.test(items))
  assert.ok(items.includes('zadanie oddzwonienia z imieniem i odnośnikiem do karty w naszym systemie')); assert.ok(!items.includes('bez numeru telefonu, z odnośnikiem'))
  assert.ok(!items.includes('zadanie oddzwonienia z imieniem i numerem'))
  assert.equal(T.fields.city_hint, 'Domyślnie Kołobrzeg; możesz zacząć pisać nazwę. Osiedla Kołobrzegu (np. Podczele) wskażesz niżej, w polu „Dzielnica lub osiedle”. Grzybowo, Bogucino, Budzistowo, Zieleniewo i Dźwirzyno to osobne miejscowości — wybierz je tutaj (widełek online dla nich nie podajemy, agent sprawdzi, czy może przygotować wycenę). Dla innej miejscowości wybierz „Inna lokalizacja”.')
  assert.ok(T.fields.district_hint.endsWith('agent sprawdzi, czy może przygotować wycenę.'))
  assert.ok(T.metaDescription.length <= 160, 'metaDescription do 160 znakow'); assert.ok(!T.metaDescription.includes('Podaj kilka danych'))
  assert.ok(T.lead.consentCall.includes('Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl.'))
  assert.ok(items.includes('jeśli sam(a) poprosisz o rozmowy o współpracy, Twój numer i dane z tych rozmów przechowujemy najdłużej 12 miesięcy od ostatniej takiej rozmowy')); assert.ok(how.includes('rozmowy o współpracy, o które sam(a) poprosisz (Twój numer i dane z tych rozmów najdłużej 12 miesięcy od ostatniej takiej rozmowy; każda kolejna taka rozmowa odnawia te 12 miesięcy)'))
  assert.ok(!/nie pozwalaj\S* nam Cię zidentyfikować/.test(items + how)); assert.ok(items.includes('nie zawiera Twoich danych kontaktowych ani adresu IP'))
  const all = JSON.stringify(T)
  assert.ok(!/przygotujemy wycenę|przygotuje ją agent|przygotuje wycenę Twojej/.test(all), 'obietnica "przygotuje" tylko tam, gdzie skrypt ja gwarantuje')
})

test('teksty v11.6: cel [2] dla wspolpracy, Cenogram, Vercel w DPF, T-t (punkty), h1 bez "bezplatna", "czy" w outOfScopeBody, how.body bez powtorzenia', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  assert.ok(items.includes('rozmowy o współpracy, o które sam(a) poprosisz, oraz umowa — działania na Twoje żądanie przed zawarciem umowy i wykonanie umowy (art. 6 ust. 1 lit. b RODO)'))
  assert.ok(items.includes('oraz dane rynkowe: Cenogram (Polska); do obu trafiają wyłącznie dane nieruchomości')); assert.ok(how.includes('Anthropic) i dostawcy danych rynkowych (Cenogram)'))
  assert.ok(items.includes('Vercel (hosting strony): Data Privacy Framework oraz umowa powierzenia przetwarzania danych;'))
  assert.equal(T.h1, 'Orientacyjna wycena mieszkania w Kołobrzegu online'); assert.ok(!/bezpłatn/i.test(T.h1))
  assert.ok(T.result.outOfScopeBody.includes('agent sprawdzi, czy może przygotować wycenę.') && !T.result.outOfScopeBody.includes('czy i jak'))
  assert.ok(!how.includes('bez danych kontaktowych i adresu IP; nie zawierają'))
  assert.equal(T.how.body.filter(b => b.startsWith('Adres IP:')).length, 1)
  for (const k of ['adres IP, dostawca hostingu naszego serwera (Railway)', 'adres IP, nasza aplikacja', 'adres IP, dostawcy hostingu strony (Vercel)', 'zapytanie z numerem telefonu, zwykle', 'zapytanie z numerem telefonu, najpóźniej', 'zapytanie z numerem telefonu, wyjątki']) assert.ok(items.includes(k), k)
  assert.ok(!/okolicy/.test(JSON.stringify(T.how.body)) && !T.result.comparables(20, 49).includes('okolicy'))
})

test('teksty v11.7: [4] jako lista odbiorcow (T-u) + osobny punkt zabezpieczen; Cenogram (Polska); lit. c w [2]; DPF objasniony; Vercel z umowa powierzenia', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const secs = T.lead.consentInfo
  const odb = secs.find(c => c.h === 'Komu przekazujemy dane.'), zab = secs.find(c => c.h === 'Zabezpieczenia przy przekazaniu poza EOG.')
  assert.ok(odb && zab && odb.items.length === 7 && zab.items.length === 5)
  assert.ok(odb.items.some(i => i.startsWith('sztuczna inteligencja: Anthropic, oraz dane rynkowe: Cenogram (Polska)')))
  assert.ok(odb.t.length < 60, 'zdanie wprowadzajace krotkie')
  const cel = secs.find(c => c.h === 'Po co i na jakiej podstawie.').items.join(' ').split(sp).join(' ')
  assert.ok(cel.includes('obowiązki prawne wynikające z przepisów, np. podatkowych (art. 6 ust. 1 lit. c RODO)'))
  assert.ok(zab.items[0].includes('ram ochrony danych UE-USA')); assert.ok(zab.items[1] === 'Vercel (hosting strony): Data Privacy Framework oraz umowa powierzenia przetwarzania danych;')
  assert.ok(!zab.items.join(' ').includes('w zakresie, w jakim odbiorca jest certyfikowany'))
  assert.ok(!/Cenogram[^;]*(SCC|klauzul)/.test(zab.items.join(' ')), 'Cenogram (Polska) poza lista zabezpieczen transferu')
})

test('teksty v11.8 (decyzje Daniela 26.09): T-k lista nie dzwonimy, T-c2 rozmowa telefoniczna lub osobista, usuniecie danych po cofnieciu, odnawianie wyjatku wspolpracy', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  assert.ok(!items.includes('lista osób, do których nie dzwonimy') && !items.includes('nie dzwonimy:'), 'v12: lista "nie dzwonimy" wycofana z klauzuli do potwierdzenia wdrozenia')
  assert.ok(!items.includes('3 lata') && !items.includes('numer na liście'))
  assert.ok(items.includes('(telefonicznej lub osobistej)') && how.includes('(telefonicznej lub osobistej)'))
  assert.ok(items.includes('Po cofnięciu nie zadzwonimy do Ciebie w sprawie wyceny.') && !items.includes('najpóźniej w ciągu miesiąca') && !items.includes('usuniemy Twoje dane z naszego systemu'))
  assert.ok(items.includes('każda kolejna taka rozmowa odnawia te 12 miesięcy') && how.includes('każda kolejna taka rozmowa odnawia te 12 miesięcy'))
})

test('teksty v12: wstep do 3 zdan (disclaimery pod przyciskiem), okresy wariant B domyslnie (A jako wylaczona flaga), krotkie streszczenie zgody na wierzchu', async () => {
  const { T, RETENTION_VARIANT_A, RETENTION_A_ITEMS, RETENTION_B_ITEMS } = await import('../app/wycena/texts.ts')
  assert.ok(T.intro.split(/[.?] /).length <= 3, 'wstep: max 3 zdania'); assert.ok(T.intro.includes('sztucznej inteligencji'))
  assert.ok(T.disclaimerMore.startsWith('To szacunek, a nie operat szacunkowy'))
  assert.equal(RETENTION_VARIANT_A, false)
  const items = T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]).join(' ')
  assert.ok(items.includes(RETENTION_B_ITEMS[0])); assert.ok(!items.includes('12 miesięcy') && !items.includes('24 miesiące'), 'wariant B bez konkretnych okresow')
  assert.ok(RETENTION_A_ITEMS.length === 6)
  assert.ok(T.how.body.join(' ').includes('nie dłużej, niż to konieczne')); assert.ok(!T.how.body.join(' ').includes('24 miesiące'))
  assert.ok(T.lead.consentShort.length < 300 && T.lead.consentShort.includes('biuro@investrent.com.pl'))
  assert.ok(!/nie dzwonimy|w ciągu miesiąca|około 24|bez numeru telefonu, z odn/.test(JSON.stringify(T)), 'v12: brak wycofanych zdan')
})
test('lead z /wycena v12: source=wycena_lp, honeypot hp_field pusty, token Turnstile obecny (gdy wydany), bez zgody marketingowej', async () => {
  const { buildLeadRequest, CALCULATOR_LEAD_SOURCE } = await import('./valuation.ts')
  assert.equal(CALCULATOR_LEAD_SOURCE, 'wycena_lp')
  const r = buildLeadRequest({ name: ' ', phone: ' 731 554 341 ', values: ok, outcome: rangeOut, utm: '', turnstileToken: 'tok123' })
  assert.equal(r.source, 'wycena_lp'); assert.equal(r.hp_field, ''); assert.equal(r.turnstile_token, 'tok123')
  assert.equal(r.full_name, 'Właściciel'); assert.equal(r.phone, '731 554 341'); assert.equal(r.client_type, 'seller')
  assert.ok(r.notes.includes('kanał=telefon-wycena') && r.notes.includes('wersja=wycena-2026-09-27-v12')); assert.ok(!/marketing/i.test(JSON.stringify(r)))
  assert.equal('turnstile_token' in buildLeadRequest({ name: '', phone: '731554341', values: ok, outcome: null, utm: '' }), false)
  const fs2 = fs.readFileSync(new URL('../components/WycenaModal.tsx', import.meta.url), 'utf8')
  assert.ok(fs2.includes("source: 'wycena_modal'") && !fs2.includes('wycena_lp'), 'okienko Zamow rozmowe zostaje wycena_modal')
})
