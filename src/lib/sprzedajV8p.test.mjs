// Strona /sprzedaj-z-investrent wg makiety v8p (23.11.2026): linia pod CTA bez slowa "nieruchomosci", blok "Dlaczego" - adres przed "Ponad 150 transakcji", obie linie z pinezka. Test zrodlowy.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../app/(pl)/sprzedaj-z-investrent/SprzedajPage.tsx', import.meta.url), 'utf8')

test('linia pod przyciskiem: "Biuro w Kołobrzegu" (bez "nieruchomości")', () => {
  assert.ok(src.includes('<div className={s.tl}>Biuro w Kołobrzegu{rating'))
  assert.ok(!src.includes('Biuro nieruchomości w Kołobrzegu{rating'))
})

test('blok "Dlaczego InvestRent": adres przed "Ponad 150 transakcji", obie linie z pinezką', () => {
  const addr = src.indexOf('Biuro w Kołobrzegu: ul. Ratuszowa')
  const tx = src.indexOf('Ponad 150 zrealizowanych transakcji w historii biura.')
  assert.ok(addr > 0 && tx > addr, 'adres ma stać przed linią o transakcjach')
  assert.ok(src.includes('<p>{pin}<span>Ponad 150 zrealizowanych transakcji w historii biura.</span></p>'))
})