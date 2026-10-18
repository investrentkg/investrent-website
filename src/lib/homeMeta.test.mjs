// Uruchom: node --test src/lib/homeMeta.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { HOME_TITLE, HOME_DESCRIPTION, pickHomeMeta } from './homeMeta.ts'

test('title strony glownej dokladnie wg zatwierdzonego tekstu', () => {
  assert.equal(HOME_TITLE, 'Nieruchomości Kołobrzeg | Biuro nieruchomości InvestRent')
})

test('description strony glownej dokladnie wg zatwierdzonego tekstu', () => {
  assert.equal(
    HOME_DESCRIPTION,
    'Biuro nieruchomości w Kołobrzegu: mieszkania na sprzedaż i wynajem, orientacyjna wycena online, obsługa sprzedaży i zakupu. Zadzwoń lub napisz.',
  )
})

test('stare wartosci z CRM ustepuja nowym; inna wlasna wartosc z CRM wygrywa', () => {
  const old = pickHomeMeta(
    'Biuro Nieruchomości Kołobrzeg | Invest Rent',
    'Invest Rent – biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem mieszkań, domów i działek. Sprawdź aktualne oferty i skontaktuj się z naszym agentem.',
  )
  assert.equal(old.title, HOME_TITLE)
  assert.equal(old.ownTitle, null)
  assert.equal(old.description, HOME_DESCRIPTION)
  assert.equal(pickHomeMeta(null, null).title, HOME_TITLE)
  const own = pickHomeMeta('Moj tytul', 'Moj opis')
  assert.equal(own.title, 'Moj tytul')
  assert.equal(own.description, 'Moj opis')
})

test('description <= 160 znakow, a stare 60-minutowe i poprzednie wartosci z CRM ustepuja', () => {
  assert.ok(HOME_DESCRIPTION.length <= 160)
  assert.ok(!HOME_DESCRIPTION.includes('60'))
  const old60 = 'Biuro nieruchomości w Kołobrzegu i okolicach: sprzedaż, kupno i wynajem mieszkań oraz domów. Bezpłatna wycena, odpowiedź do 60 minut.'
  assert.equal(pickHomeMeta(null, old60).description, HOME_DESCRIPTION)
})
