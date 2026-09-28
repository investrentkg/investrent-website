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
  assert.ok(n.startsWith('[Zgoda-kalkulator] kanał=telefon-wycena; czas=2026-09-26T10:00:00.000Z; wersja=wycena-2026-09-28-v13'))
  assert.ok(n.includes('Źródło: kalkulator wyceny (z wynikiem: tak)')); assert.ok(n.includes('Mieszkanie, Kołobrzeg (Podczele)')); assert.ok(n.includes('52,5 m²')); assert.ok(n.includes('utm_source=meta'))
  assert.ok(CONSENT_VERSION === 'wycena-2026-09-28-v13'); assert.match(CONSENT_VERSION, /^wycena-\d{4}-\d{2}-\d{2}-v\d+$/) // v13: nowa wersja zgody (teksty zgody i klauzuli zmienione 28.09), do dopisania w CALCULATOR_CONSENT_VERSIONS
  assert.ok(!/marketing|id_hash|sms/i.test(n))
})
test('notatka leada v11: z dlugim UTM miesci sie w limicie 500 znakow backendu, znacznik zgody nieuciety (backend obcina po 500)', () => {
  const longUtm = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k => k + '=' + 'x'.repeat(80)).join(' ')
  const n = buildLeadNotes({ ...ok, district: 'Radzikowo-Osiedle Nadmorskie' }, rangeOut, longUtm, { at: '2026-09-26T10:00:00.000Z' })
  assert.ok(n.length <= NOTES_MAX && NOTES_MAX < 500, 'dlugosc ' + n.length)
  assert.ok(n.startsWith('[Zgoda-kalkulator] kanał=telefon-wycena; czas=2026-09-26T10:00:00.000Z; wersja=wycena-2026-09-28-v13'))
  const clean = String(n).slice(0, 500).replace(/[<>]/g, '') // jak backend: clean(notes)
  assert.equal(clean, n)
})
test('zakres liczb v14 (zgodnie z intro): poza zakresem TYLKO dom/dzialka albo "Inna lokalizacja"/spoza slownika; mieszkanie w Kolobrzegu (kazda dzielnica, takze Srodmiescie i "Inna dzielnica") i w miejscowosci ze slownika = w zakresie', () => {
  assert.equal(isOutOfScope(ok), false)
  assert.equal(isOutOfScope({ ...ok, property_type: 'dom' }), true); assert.equal(isOutOfScope({ ...ok, property_type: 'dzialka' }), true)
  assert.equal(isOutOfScope({ ...ok, city: 'Koszalin' }), false, 'v14 (ZNACZENIE ZMIENIONE): mieszkanie w miejscowosci ze slownika = w zakresie (dawniej: kazda inna miejscowosc poza zakresem)')
  assert.equal(isOutOfScope({ ...ok, city: OTHER_CITY }), true); assert.equal(isOutOfScope({ ...ok, city: 'Jan Kowalski' }), true); assert.equal(isOutOfScope({ ...ok, city: 'Koszalin', property_type: 'dom' }), true)
  assert.equal(isOutOfScope({ ...ok, district: OTHER_DISTRICT }), false, 'v14: "Inna dzielnica" w Kolobrzegu = w zakresie (dawniej: poza zakresem)')
  assert.equal(isOutOfScope({ ...ok, district: 'Śródmieście' }), false); assert.equal(isOutOfScope({ ...ok, district: 'Stare Miasto' }), false)
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
  for (const w of ['marketing','SMS','STOP','skrót numeru','HMAC','3 lata','art. 17']) assert.ok(!all.toLowerCase().includes(w.toLowerCase()), 'zakazana fraza: ' + w)
  assert.equal(T.lead.consentMarketing, undefined); assert.equal(T.lead.consentMarketingOptional, undefined)
  const nb = x => x.split(String.fromCharCode(160)).join(' ') // v13: zgoda ma trzy drogi cofniecia (e-mail, telefon do biura, slowo do agenta); dawne asercje "tylko e-mail" odwrocone
  assert.ok(T.lead.consentCall.includes('wyłącznie w sprawie wyceny mojej nieruchomości')); assert.ok(nb(T.lead.consentCall).endsWith('Zgodę mogę cofnąć w każdej chwili: e-mailem (biuro@investrent.com.pl), telefonicznie (+48 731 554 341) lub mówiąc o tym agentowi podczas rozmowy.'))
  assert.ok(T.lead.consentCallRequired.includes('wymagana'))
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ')
  assert.ok(items.split(String.fromCharCode(160)).join(' ').includes('Dowód zgody na telefon w sprawie wyceny (wersja zgody, sposób jej złożenia, data i godzina), bez danych kontaktowych: przechowujemy do 3 lat od końca roku, w którym cofniesz zgodę albo zakończymy przetwarzanie Twoich danych z kalkulatora')) // v14 (Prawnik runda 2): dowod zgody 3 lata od konca roku cofniecia/zakonczenia (dawniej: usuwany razem ze zgloszeniem)
  assert.ok(nb(items).includes('Zgodę możesz cofnąć e-mailem (biuro@investrent.com.pl), telefonicznie (+48 731 554 341) albo mówiąc o tym agentowi podczas rozmowy; wystarczy powiedzieć, że nie chcesz, żebyśmy do Ciebie dzwonili. Po cofnięciu nie zadzwonimy do Ciebie w sprawie wyceny. Wnioski o pozostałe prawa wyślij na biuro@investrent.com.pl. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Podanie danych jest dobrowolne; bez numeru telefonu pokażemy wynik (jeśli liczymy go online), ale nie oddzwonimy.')) // v14: wnioski o pozostałe prawa tylko e-mailem (zgodnie z tekstem)
  assert.ok(items.includes('dowód zgody na telefon w sprawie wyceny, adres IP'))
  assert.ok(T.errors.rateLimited('2 h').includes('za około 2 h')); assert.ok(!all.includes('około 24'), 'v13: "do 24 godzin" (pamiec serwera, skrot IP) jest teraz w tekstach, wycofane zostaje tylko "okolo 24"')
  assert.ok(all.includes('Cloudflare: standardowe klauzule umowne UE zawarte w umowie dostawcy')); assert.ok(!all.includes('Cloudflare i Google (dla kont w naszej domenie)'))
  assert.ok(T.result.outOfScopeBody.includes('zadzwonimy tylko w tej sprawie')) // v14
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
  assert.equal(isOutOfScope({ ...ok, district: OTHER_DISTRICT }), false) // v14: w zakresie
})
test('teksty v11.2: okres z numerem (T-f: umowa przed pulapem, kontakt = rozmowa/wiadomosc, nieodebrane nie licza sie, ponowne zgloszenie nie odnawia), T-g, T-h, T-e', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const last = [...T.how.body, ...RA.how].slice(-3).join(' ').split(sp).join(' ')
  const iUmowa = items.indexOf('Jeśli dojdzie do umowy'), iPulap = items.indexOf('Usuniemy te dane najpóźniej 24 miesiące po zgłoszeniu, chyba że zachodzi wyjątek z punktu (3)')
  assert.ok(iUmowa >= 0 && iPulap >= 0, 'wyjatek umowy i pulap jako osobne punkty (T-t, v11.6)')
  assert.ok(items.includes('12 miesięcy po ostatnim kontakcie w sprawie wyceny (rozmowie lub wiadomości od Ciebie). Jeśli takiego kontaktu nie było, liczymy 12 miesięcy od zgłoszenia.')); assert.ok(!items.includes('kolejne zgłoszenie z tego numeru'), 'v13: szczegol dla prawnika (kolejne zgloszenie) wycofany z klauzuli')
  assert.ok(!/nieodebrane/i.test(items), 'v14: zdanie o nieodebranych probach wycofane (Krytyk)')
  assert.ok(items.includes('(wersja zgody, sposób jej złożenia, data i godzina), bez danych kontaktowych: przechowujemy do 3 lat od końca roku'))
  assert.ok(last.indexOf('Wyjątek: jeśli dojdzie do umowy albo poprosisz nas o rozmowę na temat sprzedaży lub wynajmu') > last.indexOf('najpóźniej po 24 miesiącach od zgłoszenia') && last.includes('dane przechowujemy dłużej, jak opisano w pełnej informacji o danych'), 'v14 (Prawnik A i D): wyjatek od 24 mies. domkniety w obu warstwach'); assert.ok(RA.how.length === 1, 'v13: warstwa krotka = jeden akapit')
  assert.ok(items.includes('zostanie anonimowa statystyka (typ nieruchomości, przedział powierzchni, miejscowość i dzielnica z listy, stan, widełki ceny, data)'))
  assert.ok(items.includes('Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu'))
  assert.equal(T.lead.titleRange, 'Chcesz omówić wynik z agentem?'); assert.ok(!/mapą|raport/i.test(T.lead.bodyRange)); assert.ok(T.lead.bodyRange.includes('oszacuje cenę, bezpłatnie i bez zobowiązań') && T.lead.bodyRange.startsWith('Zdjęcia, szczegóły stanu i standardu mieszkania')) // v14: jedna formula agenta
})
test('konfiguracja per biuro (SaaS): miasto domowe, slowniki i wylaczone dzielnice z konfiguracji; zrodlo i data przegladu listy dzielnic jawne', () => {
  assert.equal(CALCULATOR_CONFIG, INVESTRENT_CONFIG)
  assert.equal(isHomeCity('kolobrzeg'), true); assert.equal(isHomeCity('Koszalin'), false)
  assert.equal(isRestrictedDistrict('Śródmieście'), false); assert.equal(isRestrictedDistrict('Centrum'), false); assert.equal(isRestrictedDistrict('Podczele'), false) // 27.09: brak dzielnic wylaczonych (decyzja Daniela, lustro backendu #570)
  assert.ok(INVESTRENT_CONFIG.districtsSource.includes('portal_listings_archive')); assert.equal(INVESTRENT_CONFIG.districtsReviewedAt, '2026-09-26'); assert.ok(INVESTRENT_CONFIG.districtsSource.includes('decyzja Daniela, biuro'))
  assert.ok(!INVESTRENT_CONFIG.districts.includes('Dzielnica Uzdrowiskowa'), 'nazwy tylko z danych, nie z pamieci')
})
test('decyzja biura 26.09: Grzybowo/Bogucino/Budzistowo/Zieleniewo/Dzwirzyno to MIEJSCOWOSCI (nie dzielnice Kolobrzegu); brak widelek online (tylko wycena agenta)', () => {
  for (const c of ['Grzybowo', 'Bogucino', 'Budzistowo', 'Zieleniewo', 'Dźwirzyno']) {
    assert.equal(canonicalCity(c), c); assert.ok(INVESTRENT_CONFIG.cities.includes(c)); assert.equal(canonicalDistrict(c), null, c + ' nie jest dzielnica')
    assert.equal(isHomeCity(c), false); assert.equal(isOutOfScope({ ...ok, city: c, district: 'Inna dzielnica' }), false, 'v14: miejscowosc ze slownika = w zakresie (dawniej true)'); assert.equal(isOutOfScope({ ...ok, city: c, property_type: 'dom' }), true)
  }
  assert.equal(canonicalCity('dzwirzyno'), 'Dźwirzyno'); assert.equal(canonicalCity('Bogucin'), 'Bogucino')
  assert.ok(!INVESTRENT_CONFIG.districts.some(d => ['grzybowo', 'bogucino', 'budzistowo', 'zieleniewo', 'dzwirzyno'].includes(fold(d))))
})
test('Srodmiescie (od 27.09) i "Inna dzielnica" (v14) = w zakresie widelek online; dzielnica z listy tak', () => {
  assert.equal(isOutOfScope({ ...ok, district: 'Śródmieście' }), false); assert.equal(isOutOfScope({ ...ok, district: 'Inna dzielnica' }), false)
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
test('teksty v13: telefon biura jako droga cofniecia (numer = OFFICE_PHONE), Railway 30 dni jako "dzienniki techniczne", bez wycofanego "kolejne zgloszenie nie wydluza"', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const last = [...T.how.body, ...RA.how].slice(-3).join(' ').split(sp).join(' ')
  assert.ok(!items.includes('kolejne zgłoszenie z tego numeru') && !last.includes('kolejne zgłoszenie z tego numeru')) // v13: wycofane wg Prawnika (szczegol dla prawnika)
  assert.ok(!items.includes('ponowne zgłoszenie tego terminu nie odnawia'))
  assert.ok(items.includes('dostawca hostingu naszego serwera (Railway): dzienniki techniczne do 30 dni')); assert.ok(!items.includes('kilkudziesięciu dni'))
  // v13: ZNACZENIE ZMIENIONE: dawna asercja wymagala "tylko e-mail, bez telefonu biura"; teraz numer biura MUSI byc w zgodzie, skrocie i klauzuli i musi byc numerem z kodu strony
  const { OFFICE_PHONE } = await import('./valuation.ts'); const phone = OFFICE_PHONE.split(sp).join(' ')
  assert.equal(phone, '+48 731 554 341')
  for (const [nazwa, txt] of [['consentCall', T.lead.consentCall], ['Twoje prawa', T.lead.consentInfo.find(c => c.h === 'Twoje prawa.').t]]) assert.ok(txt.split(sp).join(' ').includes(`telefonicznie (${phone})`), 'numer biura w: ' + nazwa)
  assert.ok(T.lead.consentShort.includes('e-mailem, telefonicznie lub w rozmowie z agentem'), 'v14: skrot bez literalu numeru, ale z trzema drogami')
  assert.ok(items.includes('mówiąc o tym agentowi podczas rozmowy') && !items.includes('pisząc na biuro@investrent.com.pl'), 'v13: cofniecie trzema drogami, nie tylko e-mailem')
})
test('teksty v11.3 (DPA Railway 26.09): Railway w transferze wg umowy powierzenia (bez niepotwierdzonego mechanizmu), wyjatek 30 dni logow Railway od "okolo 24 godzin", brak zdan o Vercel/Brevo/Google/Anthropic jako zabezpieczonych', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  assert.ok(items.includes('Railway: umowa powierzenia; mechanizm przekazania (Data Privacy Framework albo standardowe klauzule umowne UE) wskażemy na wniosek')); assert.ok(!items.includes('26.09.2026'), 'v13: data umowy powierzenia usunieta z klauzuli (Krytyk pkt 11, Prawnik)')
  assert.ok(!items.includes('około 24 godzin') && !items.includes('krótkotrwale') && !how.includes('krótkotrwale') && items.includes('w pamięci serwera, do 24 godzin (limit zapytań); nie zapisujemy go w bazie danych') && !JSON.stringify(T).includes('w postaci skrótu')); assert.ok(items.includes('do 30 dni')); assert.ok(how.includes('dokładne miejsca i okresy podajemy w pełnej informacji o danych poniżej')) // v14: okresy IP tylko w pelnej informacji; decyzja Dyrektora: IP aplikacji BEZ "w postaci skrotu"; v13: "krotkotrwale" (nie okres) zastapione "do 24 godzin" (warunek publikacji: #505 na produkcji)
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
  // T-m (ZNACZENIE ZMIENIONE w v13): dawniej dluzszy okres (Railway 30 dni) PRZED 24 h w aplikacji; Prawnik (28.09) ustala kolejnosc baza -> pamiec serwera (24 h) -> Railway (30 dni) -> Vercel/Cloudflare, w klauzuli i w "Jak liczymy"
  assert.ok(items.indexOf('do 24 godzin') < items.indexOf('do 30 dni')); assert.ok(!how.includes('do 30 dni') && !how.includes('do 24 godzin'), 'v14: "Jak liczymy" bez okresow IP (prywatnosc krotko)')
  // T-l: bez "kopii dokumentu ... Data Privacy Framework", DPF nie jest dokumentem; kopia tylko dla SCC; Anthropic SCC, brak Vercel/Brevo jako zabezpieczonych
  assert.ok(!items.includes('Kopię dokumentu')); assert.ok(items.includes('jeśli to standardowe klauzule umowne, prześlemy ich kopię'))
  assert.ok(items.includes('Anthropic: zabezpieczenie wskazane w warunkach API dostawcy; szczegóły wskażemy na wniosek')); assert.ok(items.includes('wskażemy na wniosek;') && !items.includes('szczegóły na Twój wniosek'), 'v13: "na wniosek" ujednolicone dla Railway i Anthropic'); assert.ok(!/Anthropic[^;]*(umow[aeyię] powierzenia|DPA)/.test(items + T.how.body.join(' ')), 'v12: bez umowy/DPA z Anthropic')
  assert.ok(items.includes('Cloudflare: standardowe klauzule umowne UE zawarte w umowie dostawcy; korzysta on też z ram ochrony danych UE-USA (Data Privacy Framework), o ile jego certyfikacja jest w danym czasie aktywna; Google: Data Privacy Framework, a w razie jego braku standardowe klauzule umowne UE'))
  assert.ok(!items.includes('Vercel opiera się')); assert.ok(!items.includes('Supabase opiera się')); assert.ok(!items.includes('Brevo opiera się'))
  // T-o, T-n
  assert.ok(T.intro.includes('w Kołobrzegu i w wybranych miejscowościach regionu (lista w formularzu)')); assert.ok(!T.disclaimerMore.includes('z wyjątkiem Śródmieścia'))
  assert.ok(T.result.outOfScopeBody.includes('w Kołobrzegu i w wybranych miejscowościach regionu (lista w formularzu)'))
  assert.ok(!T.fields.district_hint.includes('Centrum') && T.fields.district_hint.includes('Inna dzielnica')) // 28.09: Srodmiescie/Centrum/Stare Miasto NIE sa juz wylaczone
  // doneBody bez obietnicy wyniku
  const { OFFICE_PHONE } = await import('./valuation.ts') // v14 (ZNACZENIE ZMIENIONE): doneBody z terminem oddzwonienia i numerem biura z jednego zrodla
  assert.equal(T.lead.doneBody, `Zwykle oddzwaniamy w ciągu 24\u00A0godzin, najczęściej szybciej. Wolisz zadzwonić do nas? Numer biura: ${OFFICE_PHONE}.`)
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
  assert.equal(T.fields.city_hint, 'Domyślnie Kołobrzeg; możesz zacząć pisać nazwę. Dzielnicę lub osiedle Kołobrzegu (np. Podczele) wybierzesz niżej, w polu „Dzielnica lub osiedle”. Grzybowo, Bogucino, Budzistowo, Zieleniewo i Dźwirzyno to osobne miejscowości: wybierz je tutaj. Jeśli Twojej miejscowości nie ma na liście, wybierz „Inna lokalizacja”: widełek online nie podamy, ale w województwie zachodniopomorskim cenę oszacuje agent, a poza nim sprawdzimy, czy możemy pomóc. Zostaw numer lub zadzwoń.')
  assert.ok(T.fields.district_hint.endsWith('jeśli Twojej nie ma na liście.'))
  assert.ok(T.metaDescription.length <= 160, 'metaDescription do 160 znakow'); assert.ok(!T.metaDescription.includes('Podaj kilka danych'))
  assert.ok(T.lead.consentCall.split(sp).join(' ').includes('Zgodę mogę cofnąć w każdej chwili: e-mailem (biuro@investrent.com.pl), telefonicznie (+48 731 554 341) lub mówiąc o tym agentowi podczas rozmowy.'))
  assert.ok(items.includes('Jeśli dojdzie do umowy albo poprosisz nas o rozmowę na temat sprzedaży lub wynajmu Twojej nieruchomości z pomocą naszego biura, dane z kalkulatora dołączamy do Twojej sprawy w biurze. Przechowujemy je wtedy: przy umowie tak długo, jak trwa umowa i jak wymagają tego przepisy; przy samej rozmowie na temat sprzedaży lub wynajmu do 12 miesięcy po ostatniej takiej rozmowie.')); assert.ok(how.includes('Wyjątek: jeśli dojdzie do umowy albo poprosisz nas o rozmowę na temat sprzedaży lub wynajmu Twojej nieruchomości z pomocą naszego biura, dane przechowujemy dłużej, jak opisano w pełnej informacji o danych.'))
  assert.ok(!/współpracy/.test(JSON.stringify(T)), 'v14 (akceptacja Prawnika 28.09): "rozmowy o wspolpracy" zastapione "rozmowa o sprzedazy lub wynajmie Twojej nieruchomosci z pomocą naszego biura"'); assert.ok(!/przez nasze biuro/.test(JSON.stringify(T)), 'v14: "z pomocą naszego biura" (nie "przez" - biuro posredniczy, nie sprzedaje)')
  assert.ok(!/nie pozwalaj\S* nam Cię zidentyfikować/.test(items + how)); assert.ok(items.includes('zapisujemy bez danych kontaktowych i bez adresu IP'))
  const all = JSON.stringify(T)
  assert.ok(!/przygotujemy wycenę|przygotuje ją agent|przygotuje wycenę Twojej/.test(all), 'obietnica "przygotuje" tylko tam, gdzie skrypt ja gwarantuje')
})

test('teksty v11.6: cel [2] dla wspolpracy, Cenogram, Vercel w DPF, T-t (punkty), h1 bez "bezplatna", "czy" w outOfScopeBody, how.body bez powtorzenia', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts'); const RA = { items: RETENTION_A_ITEMS, how: RETENTION_A_HOW }
  const sp = String.fromCharCode(160)
  const items = [...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...RA.items].join(' ').split(sp).join(' ')
  const how = [...T.how.body, ...RA.how].join(' ').split(sp).join(' ')
  assert.ok(items.includes('rozmowa o sprzedaży lub wynajmie Twojej nieruchomości z pomocą naszego biura, jeśli poprosisz o taką rozmowę — działania na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO);') && items.includes('umowa, jeśli do niej dojdzie — wykonanie umowy (art. 6 ust. 1 lit. b RODO) oraz obowiązki prawne wynikające z przepisów, np. podatkowych (art. 6 ust. 1 lit. c RODO);'), 'v14: cel [2] rozbity na dwa punkty (rozmowa / umowa)')
  assert.ok(items.includes('oraz dane rynkowe: Cenogram (Polska); do obu trafiają wyłącznie dane nieruchomości')); assert.ok(how.includes('Anthropic) i dostawcy danych rynkowych (Cenogram)'))
  assert.ok(items.includes('Vercel (hosting strony): Data Privacy Framework oraz umowa powierzenia przetwarzania danych;'))
  assert.equal(T.h1, 'Orientacyjna wycena mieszkania w Kołobrzegu online'); assert.ok(!/bezpłatn/i.test(T.h1))
  assert.ok(T.result.outOfScopeBody.includes('cenę oszacuje agent, bezpłatnie i bez zobowiązań') && T.result.outOfScopeBody.includes('sprawdzimy, czy możemy pomóc'), 'v14: region = agent szacuje cene; poza wojewodztwem = sprawdzimy, czy mozemy pomoc')
  assert.ok(!how.includes('bez danych kontaktowych i adresu IP; nie zawierają'))
  assert.equal(T.how.body.filter(b => b.startsWith('Adres IP')).length, 1)
  for (const k of ['Adres IP, dostawca hostingu naszego serwera (Railway)', 'Adres IP, nasza aplikacja', 'Adres IP, dostawcy hostingu strony (Vercel)', 'Zapytanie bez numeru telefonu', 'Zapytanie z numerem telefonu', 'Jeśli dojdzie do umowy albo poprosisz nas o rozmowę na temat sprzedaży lub wynajmu']) assert.ok(items.includes(k), k)
  assert.ok(!T.result.comparables(20, 49).includes('okolicy')) // v14: how.body pkt 1 celowo "z Twojej okolicy" (decyzja Krytyka), wynik liczy porownania "z Twojej miejscowosci"
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
  assert.ok(items.includes('ostatnim kontakcie w sprawie wyceny (rozmowie lub wiadomości od Ciebie)') && how.includes('Po 12 miesiącach od ostatniego kontaktu w sprawie wyceny')) // v14: "kontakt w sprawie wyceny" zamiast "rozmowa telefoniczna lub osobista"
  assert.ok(items.includes('Po cofnięciu nie zadzwonimy do Ciebie w sprawie wyceny.') && !items.includes('najpóźniej w ciągu miesiąca') && !items.includes('usuniemy Twoje dane z naszego systemu'))
  assert.ok(items.includes('przy samej rozmowie na temat sprzedaży lub wynajmu do 12 miesięcy po ostatniej takiej rozmowie') && how.includes('poprosisz nas o rozmowę na temat sprzedaży lub wynajmu'), 'v14: bez zdania o odnawianiu okresu')
})

test('teksty v13: wstep krotki (zakres tez we wstepie od 28.09), okresy WARIANT A wlaczony (B tylko awaryjnie), streszczenie zgody na wierzchu z trzema drogami cofniecia', async () => {
  const { T, RETENTION_VARIANT_A, RETENTION_A_ITEMS, RETENTION_A_HOW, RETENTION_B_ITEMS, RETENTION_B_HOW } = await import('../app/wycena/texts.ts')
  const sp = String.fromCharCode(160)
  assert.ok(T.intro.split(/[.?] /).length <= 5, 'wstep: max 5 zdan (28.09: zakres wrocil do wstepu wg Krytyka pkt 1)'); assert.ok(T.intro.includes('sztucznej inteligencji'))
  assert.ok(T.disclaimerMore.startsWith('Poza Kołobrzegiem widełki są szersze')); assert.ok(T.result.scopeNoteWider.startsWith('Dla Twojej miejscowości widełki są szersze'))
  assert.equal(RETENTION_VARIANT_A, true) // v13: ZNACZENIE ZMIENIONE (dawniej false = wariant B); wariant B jest niezgodny z art. 13 ust. 2 lit. a RODO (Prawnik 28.09)
  const items = T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]).join(' ').split(sp).join(' ')
  assert.ok(!items.includes(RETENTION_B_ITEMS[0])); assert.ok(items.includes('12 miesięcy') && items.includes('24 miesiące'), 'wariant A z konkretnymi okresami')
  for (const it of RETENTION_A_ITEMS) assert.ok(items.includes(it.split(sp).join(' ')), 'punkt A w klauzuli')
  assert.ok(RETENTION_A_ITEMS.length === 4)
  const how = T.how.body.join(' ').split(sp).join(' ')
  assert.ok(!how.includes('nie dłużej, niż to konieczne')); assert.ok(how.includes('Zapytanie bez numeru usuniemy po 12 miesiącach') && how.includes('najpóźniej po 24 miesiącach od zgłoszenia'))
  assert.equal(T.how.body.length, 7, 'v14: "Jak liczymy" = 7 punktow (7 = retencja)'); assert.equal(T.how.body[6], RETENTION_A_HOW[0])
  assert.equal((how.match(/Jak długo/g) ?? []).length, 0, 'v14: brak dubletu naglowka "Jak dlugo" w Jak liczymy')
  assert.ok(RETENTION_B_HOW[0].includes('cofnąć e-mailem, telefonicznie lub w rozmowie z agentem') && !RETENTION_B_HOW[0].includes('pisząc na'), 'wariant B (awaryjny) tez z trzema drogami cofniecia')
  assert.equal((how.match(/możesz cofnąć e-mailem, telefonicznie lub w rozmowie z agentem/g) ?? []).length, 1, 'v14: zdanie o cofnieciu raz (brak dubletu)')
  // consentShort: ZNACZENIE ZMIENIONE (dawniej < 300 znakow i "wylacznie do telefonu"); teraz opisuje realne przetwarzanie (CRM + e-mail do pracownikow), cele dodatkowe tylko na prosbe i 3 drogi cofniecia
  const cs = T.lead.consentShort.split(sp).join(' ')
  assert.ok(cs.length < 700 && cs.includes('Zgodę cofniesz w każdej chwili: e-mailem, telefonicznie lub w rozmowie z agentem.'))
  assert.ok(!cs.includes('wyłącznie do telefonu') && cs.includes('przekazujemy pracownikom biura, żeby agent mógł do Ciebie zadzwonić') && !cs.includes('powiadomieni') && cs.includes('Rozmowa o sprzedaży lub wynajmie to osobna sprawa: zadzwonimy w niej (albo w innej sprawie) tylko wtedy, gdy o to poprosisz'), 'v14 (akceptacja Prawnika C) + wariant A maila (Dyrektor): numer nie idzie e-mailem, wiec bez wtracenia o powiadomieniu e-mail')
  // IP: rozdzielone na trzy miejsca (baza / pamiec serwera / logi dostawcow)
  assert.ok(how.includes('Adres IP to numer identyfikujący Twoje połączenie z internetem. Nie zapisujemy go w naszej bazie razem z wyceną ani z Twoimi danymi kontaktowymi.'))
  assert.ok(how.includes('Imię trafia też e-mailem do pracowników biura, razem z odnośnikiem do zgłoszenia w naszym systemie; numeru w e-mailu nie ma.') && !how.includes('Imię i numer trafiają też e-mailem'), 'wariant A maila managerow (Dyrektor 28.09): tylko imie + link')
  assert.ok(!JSON.stringify(T).includes('26.09.2026'))
  assert.ok(!/nie dzwonimy|w ciągu miesiąca|około 24|bez numeru telefonu, z odn/.test(JSON.stringify(T)), 'v12: brak wycofanych zdan')
})
test('lead z /wycena v12: source=wycena_lp, honeypot hp_field pusty, token Turnstile obecny (gdy wydany), bez zgody marketingowej', async () => {
  const { buildLeadRequest, CALCULATOR_LEAD_SOURCE } = await import('./valuation.ts')
  assert.equal(CALCULATOR_LEAD_SOURCE, 'wycena_lp')
  const r = buildLeadRequest({ name: ' ', phone: ' 731 554 341 ', values: ok, outcome: rangeOut, utm: '', turnstileToken: 'tok123' })
  assert.equal(r.source, 'wycena_lp'); assert.equal(r.hp_field, ''); assert.equal(r.turnstile_token, 'tok123')
  assert.equal(r.full_name, 'Właściciel'); assert.equal(r.phone, '731 554 341'); assert.equal(r.client_type, 'seller')
  assert.ok(r.notes.includes('kanał=telefon-wycena') && r.notes.includes('wersja=wycena-2026-09-28-v13')); assert.ok(!/marketing/i.test(JSON.stringify(r)))
  assert.equal('turnstile_token' in buildLeadRequest({ name: '', phone: '731554341', values: ok, outcome: null, utm: '' }), false)
  const fs2 = fs.readFileSync(new URL('../components/WycenaModal.tsx', import.meta.url), 'utf8')
  assert.ok(fs2.includes("source: 'wycena_modal'") && !fs2.includes('wycena_lp'), 'okienko Zamow rozmowe zostaje wycena_modal')
})
test('teksty v14: numer biura w tekstach = OFFICE_PHONE (jedno zrodlo), doneBody i outOfScopeBody z numerem bez dubletu, scopeNoteWider i floor_hint, bledy z dzwonieniem', async () => {
  const { T } = await import('../app/wycena/texts.ts'); const { OFFICE_PHONE } = await import('./valuation.ts')
  const sp = String.fromCharCode(160); const norm = x => x.split(sp).join(' ')
  const all = norm(JSON.stringify(T)); const phone = norm(OFFICE_PHONE)
  const nums = all.match(/\+48 \d{3} \d{3} \d{3}/g) ?? []
  assert.ok(nums.length >= 4 && nums.every(n => n === phone), 'kazdy numer w tekstach = OFFICE_PHONE: ' + nums.join(', '))
  assert.equal(norm(T.lead.doneBody).split(phone).length - 1, 1); assert.equal(norm(T.result.outOfScopeBody).split(phone).length - 1, 1)
  assert.equal(T.fields.floor_hint, 'Parter wpisz jako 0, a poziom poniżej parteru (suterenę) jako -1.')
  assert.equal(T.errors.disabled, 'Kalkulator jest chwilowo niedostępny. Zostaw numer poniżej lub zadzwoń:')
  assert.ok(T.errors.rateLimited('2 h').startsWith('Z tej sieci wykonano już maksymalną liczbę wycen. Spróbuj ponownie za około 2 h.') && T.errors.rateLimited('2 h').endsWith('zadzwonić:'))
  assert.ok(T.errors.invalid.endsWith('zadzwoń:') && T.errors.leadFail.endsWith('zadzwoń:'))
  assert.equal(T.lead.phoneHint, 'Podaj 9 cyfr (numer polski) albo numer zaczynający się od + i kierunkowego kraju, np. +49.')
  assert.equal(T.lead.errConsent, 'Zaznacz zgodę na telefon w sprawie wyceny. Bez niej nie możemy do Ciebie zadzwonić.')
  assert.equal(T.how.moreSummary, 'Więcej: co zapisujemy i jak długo')
})
test('walidacja v14: komunikat braku dzielnicy wg tabeli', () => {
  assert.equal(validateForm({ ...ok, district: '' }).district, 'Wybierz dzielnicę lub osiedle z listy. Jeśli nie ma na niej Twojej, wybierz „Inna dzielnica”.')
})
test('teksty v14 (runda 5 Krytyka): etykiety wyniku bez "Orientacyjny", scopeNote i disclaimerFallback bez dublowania disclaimerTop, brak zdania "mają charakter orientacyjny"', async () => {
  const { T } = await import('../app/wycena/texts.ts')
  assert.equal(T.result.priceLabel, 'Zakres ceny'); assert.equal(T.result.perM2Label, 'Cena za m²')
  assert.ok(T.result.scopeNote.includes('oraz kilku ogólnych danych z formularza. Nie widzimy zdjęć ani szczegółów stanu i standardu mieszkania') && !/operat/.test(T.result.scopeNote), 'zdanie o operacie zostaje tylko w disclaimerTop')
  assert.equal(T.result.disclaimerFallback, 'Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.')
  assert.ok(!T.how.body.join(' ').includes('mają charakter orientacyjny')); assert.ok(T.how.body[1].startsWith('Widełki są zaokrąglone. Nie zastępują'))
  assert.equal(T.disclaimerTop, 'Wynik jest orientacyjny, nie jest operatem szacunkowym rzeczoznawcy majątkowego ani ofertą. Liczymy go automatycznie z użyciem sztucznej inteligencji.') // v14 P6: dwa zdania, z "ani oferta" i informacja o AI
})
test('panel wyniku v14: front NIE renderuje pol backendu outcome.message / outcome.disclaimer (tylko teksty z texts.ts); disclaimerTop zawsze przy wyniku; scopeNoteWider warunkowo; "Wyceń inną" jako link', () => {
  const src = fs.readFileSync(new URL('../app/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  const jsx = src.split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
  assert.ok(!/outcome\.(message|disclaimer)\b/.test(jsx), 'v14: pola backendu ignorowane w widoku')
  const range = jsx.slice(jsx.indexOf("outcome.kind === 'range'"), jsx.indexOf("outcome.kind === 'no_numbers'"))
  assert.ok(range.includes('{T.disclaimerTop}') && range.includes('{T.result.disclaimerFallback}') && range.includes('{T.result.scopeNote}'))
  assert.ok(range.includes('{wider && ') && range.includes('{T.result.scopeNoteWider}'))
  assert.ok(!jsx.includes('wy-btn-secondary'), 'v14: "Wyceń inną nieruchomość" = wtorny link tekstowy, nie rownorzedny przycisk')
  assert.equal(jsx.split('className="wy-linkbtn" style={{ marginTop: 8, marginLeft: -6 }}').length - 1, 3)
})
test('teksty v14 (runda 6): odeslanie do "Twoje prawa" NIE wchodzi bez F.1, sekcja F nie wklejona, zdanie nad polem zgody w opisie wersji, "Twoje prawa" bez "w tej sprawie"', async () => {
  const { T, RETENTION_A_ITEMS, RETENTION_A_HOW } = await import('../app/wycena/texts.ts')
  const sp = String.fromCharCode(160); const norm = x => x.split(sp).join(' ')
  const clause = norm([...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...T.how.body].join(' '))
  assert.ok(!clause.includes('stosujemy zasady z części'), 'wraca razem z F.1 (lista "nie dzwonimy")')
  assert.ok(!/lista osób, do których nie dzwonimy|do 3 lat od cofnięcia zgody|w ciągu 30 dni od cofnięcia/.test(clause + JSON.stringify(T)), 'sekcja F NIE wklejona')
  assert.ok(norm(T.lead.consentInfo.find(c => c.h === 'Twoje prawa.').t).includes('że nie chcesz, żebyśmy do Ciebie dzwonili. Po cofnięciu nie zadzwonimy do Ciebie w sprawie wyceny.'))
  assert.ok(norm(RETENTION_A_ITEMS[1]).includes('Po upływie tego terminu usuniemy Twoje imię, numer telefonu, adres e-mail i notatki oraz treść zgłoszenia; zostanie wyłącznie anonimowa statystyka') && norm(RETENTION_A_HOW[0]).includes('usuniemy Twoje imię, numer telefonu, adres e-mail i notatki oraz treść zgłoszenia'), 'jednakowe zdanie o usuwaniu w ITEMS (2) i HOW')
  assert.equal(RETENTION_A_ITEMS.length, 4)
  const doc = fs.readFileSync(new URL('./valuation.ts', import.meta.url), 'utf8') + fs.readFileSync(new URL('../app/wycena/texts.ts', import.meta.url), 'utf8')
  assert.ok(doc.includes('lead.bodyRange') && doc.includes('lead.bodyFallback') && doc.includes('P8'), 'zdania nad polem zgody wspoldefiniuja zakres zgody (wersja v13)')
  assert.ok(T.lead.bodyRange.startsWith('Zdjęcia, szczegóły stanu i standardu mieszkania') && T.lead.consentCallRequired.includes('wymagana'))
})
test('teksty v14 (runda 7): przelacznik RETENTION_JOB_ACTIVE (czas zdan o usuwaniu), domyslnie false = czas przyszly; true = czas terazniejszy; oba warianty rozni tylko czas', async () => {
  const m = await import('../app/wycena/texts.ts'); const { T } = m
  const sp = String.fromCharCode(160); const norm = x => x.split(sp).join(' ')
  assert.equal(m.RETENTION_JOB_ACTIVE, false, 'domyslnie false: nic nie jest obiecane jako juz dzialajace (art. 13 RODO)')
  assert.equal(m.RETENTION_VARIANT_A, true, 'przelacznik okresow A/B bez zmian')
  assert.deepEqual(m.RETENTION_A_ITEMS, m.RETENTION_A_ITEMS_PLANNED); assert.deepEqual(m.RETENTION_A_HOW, m.RETENTION_A_HOW_PLANNED)
  // wariant przyszly (false): w klauzuli i w Jak liczymy nie ma "usuwamy" ani "zostaje"
  const planned = norm([...m.RETENTION_A_ITEMS_PLANNED, ...m.RETENTION_A_HOW_PLANNED].join(' '))
  assert.ok(!/usuwamy|Usuwamy|zostaje/.test(planned), 'brak czasu terazniejszego o usuwaniu w wariancie przyszlym')
  const clause = norm([...T.lead.consentInfo.flatMap(c => [c.t, ...(c.items ?? [])]), ...T.how.body].join(' '))
  assert.ok(!/usuwamy|Usuwamy|zostaje/.test(clause), 'brak "usuwamy"/"zostaje" w calej klauzuli i w Jak liczymy (false)')
  assert.ok(clause.includes('usuniemy szczegółowy opis wyceny, zostanie anonimowa statystyka') && clause.includes('Usuniemy te dane najpóźniej 24 miesiące po zgłoszeniu') && clause.includes('Zapytanie bez numeru usuniemy po 12 miesiącach (zostanie anonimowa statystyka)'))
  // wariant true = brzmienie terazniejsze; rozni sie od przyszlego WYLACZNIE czasem
  const tense = x => x.replace(/usuniemy/g, 'usuwamy').replace(/Usuniemy/g, 'Usuwamy').replace(/zostanie/g, 'zostaje')
  assert.deepEqual(m.RETENTION_A_ITEMS_PLANNED.map(tense), [...m.RETENTION_A_ITEMS_ACTIVE]); assert.deepEqual(m.RETENTION_A_HOW_PLANNED.map(tense), [...m.RETENTION_A_HOW_ACTIVE])
  const active = norm([...m.RETENTION_A_ITEMS_ACTIVE, ...m.RETENTION_A_HOW_ACTIVE].join(' '))
  assert.ok(active.includes('Po 12 miesiącach usuwamy szczegółowy opis wyceny, zostaje anonimowa statystyka') && active.includes('Usuwamy te dane najpóźniej 24 miesiące po zgłoszeniu') && active.includes('Zapytanie bez numeru usuwamy po 12 miesiącach (zostaje anonimowa statystyka)') && !/usuniemy|zostanie/.test(active))
  // przechowywanie bez zmian w obu wariantach
  for (const k of ['czekamy 12 miesięcy po ostatnim kontakcie', 'Przechowujemy je wtedy: przy umowie', 'przechowujemy do 3 lat od końca roku']) assert.ok(planned.includes(k) && active.includes(k), k)
  assert.equal(m.RETENTION_A_ITEMS_ACTIVE.length, 4); assert.equal(m.RETENTION_A_ITEMS_PLANNED.length, 4)
})

