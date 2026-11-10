import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { WYCENA_V2_TEXTS as V2 } from '../app/(pl)/wycena/wycenaV2Texts.ts'

// wynik_v2: opinia Prawnika 09.11 i decyzje Daniela: bez nazwy dostawcy i skrotu RCN w UI, "bez uwzglednienia stanu", zastrzezenie na stale.
const allText = JSON.stringify(V2) + ['title', 'desc', 'meta'].map(() => '').join('')

test('teksty v2: zero nazwy dostawcy i skrotu RCN, zero slowa "Cenogram"', () => {
  const sample = [V2.offers.desc(50, false), V2.sold.desc(50), V2.sold.meta(66, '10.2026'), V2.offers.meta(212, '09.11.2026'), V2.diff.body, V2.diff.moreBody, V2.disclaimer, V2.sold.emptyBody, allText].join(' ')
  assert.doesNotMatch(sample, /cenogram|RCN/i)
})

test('"bez uwzględnienia stanu" jest w opisie sprzedanych oraz ofert bez filtra stanu', () => {
  assert.match(V2.sold.desc(50), /bez uwzględnienia stanu/)
  assert.match(V2.offers.desc(50, false), /bez uwzględnienia stanu/)
  assert.doesNotMatch(V2.offers.desc(50, true), /bez uwzględnienia stanu/) // przy wybranym stanie oferty sa filtrowane
})

test('oferta = prosza, sprzedane = faktycznie zaplacili; ramka mowi o starszych zasobach i slabszych stanach; nie uśredniamy', () => {
  assert.match(V2.offers.desc(50, false), /proszą/)
  assert.match(V2.sold.desc(50), /faktycznie zapłacili/)
  assert.match(V2.diff.body, /starsze mieszkania i słabsze stany/)
  assert.match(V2.diff.body, /nie uśredniamy/)
  assert.match(V2.diff.moreBody, /symbolicznej/)
})

test('liczba porównań z poprawną polską odmianą', () => {
  assert.match(V2.sold.meta(1, '10.2026'), /1 transakcja/)
  assert.match(V2.sold.meta(3, '10.2026'), /3 transakcje/)
  assert.match(V2.sold.meta(12, '10.2026'), /12 transakcji/)
  assert.match(V2.sold.meta(66, '10.2026'), /66 transakcji/)
  assert.match(V2.offers.meta(212, null), /212 ogłoszeń/)
  assert.match(V2.offers.meta(3, null), /3 ogłoszenia/)
})

test('za mało danych: tytuł i wyjaśnienie progu 8', () => {
  assert.equal(V2.sold.emptyTitle, 'Za mało danych')
  assert.match(V2.sold.emptyBody, /mniej niż 8/)
})

test('zastrzeżenie: automatycznie, nie operat, nie oferta ceny', () => {
  assert.match(V2.disclaimer, /automatycznie/)
  assert.match(V2.disclaimer, /nie jest operatem rzeczoznawcy ani ofertą ceny|nie jest operat rzeczoznawcy ani oferta ceny/)
})

test('flagi: wynik_v2 domyślnie OFF i tylko z układem v4; WycenaClient nie wysyła zmiany bez flagi', async () => {
  const flags = await readFile(new URL('./wycenaFlags.ts', import.meta.url), 'utf8')
  assert.match(flags, /WYCENA_RESULT_V2_ELIGIBLE: boolean = WYCENA_RESULT_V2_MODE !== 'off' && WYCENA_LAYOUT_V4_ACTIVE/)
  assert.match(flags, /NEXT_PUBLIC_WYCENA_RESULT_V2 === 'on'/)
  const client = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.match(client, /variant: v2Arm === 'v2' \? 'wynik_v2' : 'wynik_v1'/)
  assert.match(client, /showAi=\{!v2Active && showAiEstimate\(cardKind\)\}/)
})

test('zgoda v2: nowy tag wersji w formacie wycena-RRRR-MM-DD-vN, link do klauzuli przed checkboxem tylko w v2, tresc zgody bez zmian', async () => {
  assert.match(V2.consentVersion, /^wycena-\d{4}-\d{2}-\d{2}-v\d+$/)
  assert.notEqual(V2.consentVersion, 'wycena-2026-09-28-v13')
  const client = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.equal(V2.consentShort, 'Chcę, żeby agent zadzwonił w sprawie dokładniejszej wyceny tej nieruchomości. To nie jest zgoda na oferty marketingowe.')
  assert.equal(V2.consentVersion, 'wycena-2026-11-10-v2')
  // skrócona zgoda w v2: link "Pełna informacja o danych" jest W etykiecie zgody (widoczny i klikalny przed wysłaniem); poza v2 stara zgoda
  assert.match(client, /v2 \? <>\{V2\.consentShort\} <a className="wy-v2-consent-a" href="\/rodo"[^>]*>\{V2\.consentLinkLabel\}<\/a><\/> : <>\{T\.lead\.consentCall\}/)
  assert.match(client, /\{!v2 && <div id="wy-consent-hint"/)
  assert.match(client, /\.\.\.\(v2 \? \{ consentVersion: V2\.consentVersion \} : \{\}\)/)
  const texts = await readFile(new URL('../app/(pl)/wycena/texts.ts', import.meta.url), 'utf8')
  assert.match(texts, /consentCall/) // tresc zgody nadal z texts.ts, nietknieta
})

test('blok kontaktu v2: dopisek "Bezpłatnie i bez zobowiązań." tylko w v2, zatwierdzony tekst 01.11 nietknięty', async () => {
  assert.equal(V2.freeNote, 'Bezpłatnie i bez zobowiązań.')
  const client = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.match(client, /\(v2 \? V2\.noticeBody : V4\.notice\.body\)/)
  assert.match(V2.noticeBody, /Zostaw numer, a agent powie/)
  assert.match(V2.noticeBody, /Bezpłatnie i bez zobowiązań\.$/)
  assert.equal(V2.phonePlaceholder, 'np. 600 123 456')
  const v4 = await readFile(new URL('../app/(pl)/wycena/wycenaV4Texts.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(v4, /bez zobowiązań/)
})

test('blok numeru v2 (uproszczony): bez pol imie/nazwisko, pora jako chipy, przycisk zatwierdzony 15.10, bez sticky, naglowek po wyniku; stary uklad bez zmian', async () => {
  assert.equal(V2.submit, 'Poproś o bezpłatny telefon od agenta')
  assert.equal(V2.resultH1, 'Ile może być warte Twoje mieszkanie?')
  const client = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.match(client, /\{!\(v4Contact && v2\) && <Field id="wy-name"/)
  assert.match(client, /\{v4Contact && !v2 && <Field id="wy-surname"/)
  assert.match(client, /if \(v4Contact && !v2 && !name\.trim\(\)\)/)
  assert.match(client, /\{v4Contact && v2 && <div className="wy-v2-window"/)
  assert.match(client, /\{v4Contact && !v2 && <div style=\{\{ marginTop: 12 \}\}>/)
  assert.match(client, /const showSticky = !v2Active && available/)
  assert.match(client, /v4Contact \? \(v2 \? V2\.submit : V4\.notice\.submit\)/)
})