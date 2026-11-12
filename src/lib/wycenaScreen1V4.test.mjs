import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { ROOMS_CHOICES, FLOOR_CHOICES, cardFilters, hasCardFilters, pickScreen1Arm, screen1Variant, DEFAULT_ROOMS, DEFAULT_FLOOR } from './wycenaScreen1V4.ts'
import { WYCENA_SCREEN1_V4_TEXTS as S1 } from '../app/(pl)/wycena/wycenaScreen1V4Texts.ts'
import { fetchMarketCard } from './marketCard.ts'

// Ekran 1 v4 (makieta E1i, 11.11.2026): pokoje 1/2/3/4+/Nie wiem, piętro Parter/1–3/4+/Nie wiem, domyślnie „Nie wiem”.
test('opcje chipów zgodne z makietą E1i', () => {
  assert.deepEqual(ROOMS_CHOICES.map(o => o.label), ['1', '2', '3', '4+', 'Nie wiem'])
  assert.deepEqual(FLOOR_CHOICES.map(o => o.label), ['Parter', '1–3', '4+', 'Nie wiem'])
  assert.equal(DEFAULT_ROOMS, 'unknown'); assert.equal(DEFAULT_FLOOR, 'unknown')
})

test('filtry karty: „Nie wiem” nie zawęża; wybór przekazuje rooms i floor_group', () => {
  assert.deepEqual(cardFilters('unknown', 'unknown'), {})
  assert.equal(hasCardFilters(cardFilters('unknown', 'unknown')), false)
  assert.deepEqual(cardFilters('2', '1_3'), { rooms: '2', floor_group: '1_3' })
  assert.deepEqual(cardFilters('4_plus', 'unknown'), { rooms: '4_plus' })
  assert.deepEqual(cardFilters('unknown', 'parter'), { floor_group: 'parter' })
})

test('ramię A/B: off = brak, on = zawsze B, ab = 50/50 po losowej liczbie (bez identyfikatora)', () => {
  assert.equal(pickScreen1Arm('off'), null)
  assert.equal(pickScreen1Arm('on', () => 0), 'b')
  assert.equal(pickScreen1Arm('ab', () => 0.49), 'a')
  assert.equal(pickScreen1Arm('ab', () => 0.5), 'b')
  assert.equal(screen1Variant('a'), 'ekran1_2pola'); assert.equal(screen1Variant('b'), 'ekran1_4pola')
  // wariant licznika po stronie CRM: [a-z0-9_.-], max 32 znaki, także po połączeniu z wariantem wyniku
  for (const v of [screen1Variant('a'), screen1Variant('b'), `${screen1Variant('b')}.phone_block`, `${screen1Variant('b')}.wynik_v2`]) assert.match(v, /^[a-z0-9_.-]{1,32}$/)
})

test('teksty ekranu 1: forma Ty, pokoje i piętro tylko dla cen ofertowych, wynik bez numeru, zastrzeżenie', () => {
  assert.match(S1.hint, /zawężają tylko ceny ofertowe/)
  assert.match(S1.noPhone, /bez podawania numeru telefonu/)
  assert.match(S1.fine, /nie jest operatem szacunkowym/)
  assert.doesNotMatch(JSON.stringify(S1), /bezpłatn|cenogram|RCN/i)
})

test('fetchMarketCard: filtry trafiają do body tylko gdy ustawione (bez zmiany dotychczasowego body)', async () => {
  const calls = []
  const f = async (_u, init) => { calls.push(JSON.parse(init.body)); return { status: 200, json: async () => ({}) } }
  await fetchMarketCard('tok', null, { fetchImpl: f })
  await fetchMarketCard('tok', 'do_remontu', { fetchImpl: f, filters: { rooms: '2', floor_group: 'parter' } })
  await fetchMarketCard('tok', null, { fetchImpl: f, filters: {} })
  assert.deepEqual(calls[0], { valuation_token: 'tok' })
  assert.deepEqual(calls[1], { valuation_token: 'tok', condition: 'do_remontu', rooms: '2', floor_group: 'parter' })
  assert.deepEqual(calls[2], { valuation_token: 'tok' })
})

test('WycenaClient: ekran 1 v4 tylko za flagą i aktywnym układem v4; piętro nie idzie do silnika; dzielnica opcjonalna', async () => {
  const src = await readFile(new URL('../app/(pl)/wycena/WycenaClient.tsx', import.meta.url), 'utf8')
  assert.match(src, /WYCENA_SCREEN1_V4_ELIGIBLE/)
  assert.match(src, /rooms: '', floor: ''/) // pokoje i piętro (chipy) nie idą do /estimate: kafel transakcji liczony wg metrażu
  assert.match(src, /delete errs\.district/)
  const flags = await readFile(new URL('./wycenaFlags.ts', import.meta.url), 'utf8')
  assert.match(flags, /WYCENA_SCREEN1_V4_ELIGIBLE: boolean = WYCENA_SCREEN1_V4_MODE !== 'off' && WYCENA_LAYOUT_V4_ACTIVE/)
  assert.match(flags, /process\.env\.NEXT_PUBLIC_WYCENA_SCREEN1_V4 === 'on'/)
})
