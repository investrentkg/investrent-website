// Uruchom: node --test src/lib/offerDescription.test.mjs
// Port 1:1 testow RP (CRM: offerDescriptionBlocks.test.ts, PR #2266) z vitest na node:test. Zmieniac razem z CRM.
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseOfferDescription, shouldCollapseDescription } from './offerDescription.ts'
const expect = (a) => ({
  toEqual: (b) => assert.deepEqual(a, b),
  toBeNull: () => assert.equal(a, null),
  toBe: (b) => assert.equal(a, b),
  toContain: (s) => assert.ok(String(a).includes(s)),
})

const types = (t) => parseOfferDescription(t).map(b => b.type)

describe('parseOfferDescription', () => {
  it('pusty/null → brak bloków', () => {
    expect(parseOfferDescription('')).toEqual([])
    expect(parseOfferDescription(null)).toEqual([])
    expect(parseOfferDescription('  \n \n')).toEqual([])
  })
  it('pierwsza linia = lead, akapity rozdzielone pustą linią', () => {
    expect(parseOfferDescription('Tytuł | 42 m²\n\nPierwszy akapit.\n\nDrugi akapit.')).toEqual([
      { type: 'lead', text: 'Tytuł | 42 m²' }, { type: 'paragraph', text: 'Pierwszy akapit.' }, { type: 'paragraph', text: 'Drugi akapit.' },
    ])
  })
  it('linie z * • ✔ – tworzą jedną listę; końcowe przecinki/średniki usunięte, treść poza tym bez zmian', () => {
    const b = parseOfferDescription('Lead\n\nAGD:\n\n* zmywarka,\n* piekarnik,\n• pralka;\n✔ suszarka.')
    const list = b.find(x => x.type === 'list')
    expect(list.items).toEqual(['zmywarka', 'piekarnik', 'pralka', 'suszarka.'])
  })
  it('znaczniki śródliniowe: tekst przed znacznikiem zostaje akapitem, reszta listą', () => {
    const b = parseOfferDescription('Lead\n\nDo dyspozycji AGD: * zmywarka, * piekarnik, * pralka')
    expect(b[1]).toEqual({ type: 'paragraph', text: 'Do dyspozycji AGD:' })
    expect((b[2]).items).toEqual(['zmywarka', 'piekarnik', 'pralka'])
  })
  it('śródtytuł: krótka linia sama w akapicie bez znaku końca zdania; zdanie z kropką to akapit', () => {
    expect(types('Lead\n\nDodatkowe atuty nieruchomości\n\nWinda w budynku – wygoda codziennego użytkowania.')).toEqual(['lead', 'heading', 'paragraph'])
    expect(types('Lead\n\nLinia z dwukropkiem:\n\nCoś tu jest.')).toEqual(['lead', 'paragraph', 'paragraph'])
  })
  it('linia WIELKIMI LITERAMI to śródtytuł; długa linia nie', () => {
    expect(types('Lead\n\nCHARAKTERYSTYKA MIESZKANIA\n\ntekst.')).toEqual(['lead', 'heading', 'paragraph'])
    expect(types('Lead\n\n' + 'A'.repeat(90) + '\n\ntekst.')).toEqual(['lead', 'paragraph', 'paragraph'])
  })
  it('lista par „Klucz: wartość” dostaje kv; zwykła lista nie', () => {
    const b = parseOfferDescription('Lead\n\nNajważniejsze informacje\n\n* Piętro: 2 z 3\n* Rok budowy: 2020\n\n* salon\n* sypialnia')
    expect(b[2].kv).toEqual([['Piętro', '2 z 3'], ['Rok budowy', '2020']])
    expect(b[3].kv).toBeNull()
  })
  it('treść niezmieniona: konkatenacja tekstów zawiera wszystkie słowa wejścia (poza znacznikami)', () => {
    const src = 'Lead tu\n\nSekcja pierwsza\n\nAkapit ze słowami: alfa, beta.\n\n* punkt jeden\n* punkt dwa'
    const flat = parseOfferDescription(src).flatMap(b => b.type === 'list' ? b.items : [b.text]).join(' ')
    for (const w of ['Lead', 'Sekcja', 'alfa', 'beta', 'punkt', 'jeden', 'dwa']) expect(flat).toContain(w)
  })
  it('CRLF jak LF', () => {
    expect(parseOfferDescription('A\r\n\r\nB')).toEqual(parseOfferDescription('A\n\nB'))
  })
})

describe('zwijanie', () => {
  it('opisy krótsze niż 700 znaków bez zwijania', () => {
    expect(shouldCollapseDescription('x'.repeat(699))).toBe(false)
    expect(shouldCollapseDescription('x'.repeat(700))).toBe(true)
    expect(shouldCollapseDescription(null)).toBe(false)
  })
})

// Dopisane po tescie na zywych ofertach (Polanki INV-2026-100); zmiana do odzwierciedlenia w CRM.
describe('poprawki z testu na żywo (WWW)', () => {
  it('WIELKIE LITERY jako śródtytuł także gdy tekst zaczyna się w następnej linii', () => {
    expect(types('Lead\n\nAPARTAMENT - FUNKCJONALNOŚĆ I KOMFORT\nWnętrze zaprojektowane z myślą o przestrzeni.')).toEqual(['lead', 'heading', 'paragraph'])
  })
  it('wiersze cen/parametrów („Cena brutto: 950 000 zł”) to akapity, nie śródtytuły', () => {
    expect(types('Lead\n\nCena netto: 772 357,72 zł\n\nVAT 23%: 177 642,28 zł\n\nCena brutto: 950 000 zł\n\ntekst.')).toEqual(['lead', 'paragraph', 'paragraph', 'paragraph', 'paragraph'])
  })
})

describe('gwiazdka między cyframi (z CRM)', () => {
  it('„2 * 3” nie dzieli akapitu', () => {
    expect(types('Lead\n\nWymiar 2 * 3 m oraz taras.')).toEqual(['lead', 'paragraph'])
  })
})

describe('śródtytuł bez treści pod spodem (decyzja Daniela 07.11)', () => {
  it('nagłówek tuż przed kolejnym nagłówkiem i nagłówek na końcu to akapity', () => {
    expect(types('Lead\n\nSPOKOJNA LOKALIZACJA – KOŁOBRZEG\n\nOSIEDLE ZAMKNIĘTE\n\nMieszkanie na ładnym osiedlu.\n\nINVESTRENT – GWARANCJA TWOJEGO BEZPIECZEŃSTWA')).toEqual(['lead', 'paragraph', 'heading', 'paragraph', 'paragraph'])
  })
  it('nagłówek z treścią (akapit lub lista) zostaje nagłówkiem', () => {
    expect(types('Lead\n\nSEKCJA ABC\n\n* punkt jeden\n* punkt dwa')).toEqual(['lead', 'heading', 'list'])
  })
})
