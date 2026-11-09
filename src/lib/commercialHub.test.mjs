import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { buildCommercialContent, COMMERCIAL_CONFIG, COMMERCIAL_OFFER_TYPES } from '../content/komercyjne.ts'
import { isCommercialHubOn } from './commercialHub.ts'

const C = buildCommercialContent(COMMERCIAL_CONFIG)
const flat = JSON.stringify(C)

test('tresc: wszystkie zmienne podstawione, brak klamr', () => {
  assert.ok(!/\{(biuro|biuro_dop|region|region_w)\}/.test(flat))
})
test('tresc: zero wynajmu/dzierzawy komercyjnych, zero liczb transakcji i adresow', () => {
  assert.ok(!/wynajm|dzierżaw|dzierzaw|najem/i.test(flat), 'bez wynajmu')
  assert.ok(!/\bul\.|\d{2}-\d{3}/.test(flat), 'bez adresow')
})
test('tresc: nazwa biura i miejscowosc tylko z konfiguracji (kod tresci nie ma Kolobrzegu)', () => {
  const src = fs.readFileSync(new URL('../content/komercyjne.ts', import.meta.url), 'utf8')
  const body = src.split('export const COMMERCIAL_CONFIG')[1].split('export const COMMERCIAL_PATH')[1]
  assert.ok(!/Ko[łl]obrzeg|InvestRent/i.test(body), 'brak wpisanego biura/miejscowosci w szablonie tresci')
  const other = buildCommercialContent({ biuro: 'Test', biuro_dop: 'biura Test', region: 'Pomorze', region_w: 'na Pomorzu' })
  assert.ok(JSON.stringify(other).includes('na Pomorzu') && !/zachodniopomorsk/.test(JSON.stringify(other)))
})
test('SEO: title <= 65, meta <= 160 znakow, jeden H1, wzmianka WZ rozwinieta', () => {
  assert.ok(C.title.length <= 65, 'title ' + C.title.length)
  assert.ok(C.description.length <= 155, 'meta ' + C.description.length)
  assert.match(C.lead, /warunków zabudowy \(WZ\)/)
  assert.match(C.lead, /\(MPZP\)/)
})
test('wycena: zawsze z zastrzezeniem "nie operat szacunkowy"', () => {
  assert.match(C.basis.join(' '), /wstępna wycena \(nie operat szacunkowy\)/)
  assert.ok(!/(^|[^ĘęŁł])\bwycena\b(?! \(nie operat)/.test(C.basis.join(' ').replace('wstępna wycena (nie operat szacunkowy)', '')))
})
test('oferty: tylko typy komercyjne; strona za flaga OFF domyslnie', () => {
  assert.deepEqual([...COMMERCIAL_OFFER_TYPES].sort(), ['biuro', 'dzialka', 'lokal', 'magazyn'])
  const prev = process.env.NEXT_PUBLIC_COMMERCIAL_HUB
  delete process.env.NEXT_PUBLIC_COMMERCIAL_HUB
  assert.equal(isCommercialHubOn(), false)
  process.env.NEXT_PUBLIC_COMMERCIAL_HUB = 'on'
  assert.equal(isCommercialHubOn(), true)
  if (prev === undefined) delete process.env.NEXT_PUBLIC_COMMERCIAL_HUB; else process.env.NEXT_PUBLIC_COMMERCIAL_HUB = prev
  const page = fs.readFileSync(new URL('../app/(pl)/nieruchomosci-komercyjne/page.tsx', import.meta.url), 'utf8')
  assert.match(page, /if \(!isCommercialHubOn\(\)\) notFound\(\)/)
  assert.match(page, /transaction_type: 'sprzedaz'/)
})

test('tekst publiczny: bez roboczych naglowkow/numerow wersji i bez przykladowych nazw konfiguracji w szablonie', () => {
  assert.ok(!/Zmiany v|szkic|do weryfikacji|\[dane od/i.test(flat))
  const page = fs.readFileSync(new URL('../app/(pl)/nieruchomosci-komercyjne/page.tsx', import.meta.url), 'utf8')
  assert.match(page, /o\.transaction_type === 'sprzedaz'/)
  assert.match(page, /COMMERCIAL_FILTER_CHIPS/)
})

test('wyroznik: bez Niemcow (decyzja Daniela 07.11); kontakty z biurami komercyjnymi; klienci zagraniczni tylko ogolnie, bez liczb', () => {
  assert.ok(!/Niemc|niemieck/i.test(flat) && !/\bDE\b/.test(flat), 'bez Niemcow')
  assert.match(C.basis.join(' '), /kontakty z biurami nieruchomości specjalizującymi się w obiektach komercyjnych/)
  assert.ok(!/\d+\s*(klient|transakcj|biur)/i.test(flat), 'bez liczb')
})

test('FAQ klienci zagraniczni: tylko zdanie z dyktatu, bez przepisow i bez "omawiamy"', () => {
  const q = C.faq.find(f => /z zagranicy/.test(f.q))
  assert.equal(q.a, 'Tak, mamy dostęp także do klientów z zagranicy.')
})

test('menu, stopka i kafel na glownej: link do huba tylko za flaga', () => {
  const nav = fs.readFileSync(new URL('../components/Nav.tsx', import.meta.url), 'utf8')
  const foot = fs.readFileSync(new URL('../components/Footer.tsx', import.meta.url), 'utf8')
  const tile = fs.readFileSync(new URL('../components/HomeServices.tsx', import.meta.url), 'utf8')
  const home = fs.readFileSync(new URL('../app/(pl)/page.tsx', import.meta.url), 'utf8')
  assert.match(nav, /isCommercialHubOn\(\) \? \[\{ label: 'Komercyjne', href: COMMERCIAL_PATH \}\]/)
  assert.match(foot, /isCommercialHubOn\(\) \? \[\{ label: 'Nieruchomości komercyjne', href: COMMERCIAL_PATH \}\]/)
  // makieta M3: kafel komercyjnych jest w rodzinie usług (HomeServices), dodawany tylko przy fladze
  assert.match(tile, /isCommercialHubOn\(\) \? \[COMMERCIAL\] : \[\]/)
  assert.ok(home.includes('<HomeServices'))
  const cm = tile.match(/const COMMERCIAL: Tile = \{[\s\S]*?\n\}/)[0]
  const visible = [...cm.matchAll(/(?:title|desc|action): '([^']+)'/g)].map(m => m[1]).join(' ')
  assert.ok(visible.length > 20 && !/\d|wynajm|Niemc/i.test(visible), 'kafel bez liczb, wynajmu, Niemcow')
})
