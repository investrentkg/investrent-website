// Uruchom: node --test src/lib/kupnoMeta.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { KUPNO_TITLE, KUPNO_DESCRIPTION, KUPNO_TITLE_SUFFIX_LEN } from './kupnoMeta.ts'

test('title z marką z szablonu mieści się w ~60 znakach i zaczyna od frazy', () => {
  assert.ok(KUPNO_TITLE.length + KUPNO_TITLE_SUFFIX_LEN <= 62, `za długi: ${KUPNO_TITLE.length + KUPNO_TITLE_SUFFIX_LEN}`)
  assert.match(KUPNO_TITLE, /^Kupno mieszkania/)
  assert.match(KUPNO_TITLE, /Kołobrzeg/)
})

test('description 120-160 znaków, bez obietnic ceny, gwarancji i zwrotu "Państwo"', () => {
  assert.ok(KUPNO_DESCRIPTION.length >= 120 && KUPNO_DESCRIPTION.length <= 160, `długość ${KUPNO_DESCRIPTION.length}`)
  assert.doesNotMatch(KUPNO_DESCRIPTION, /gwarant|najtaniej|idealn|zł|\d+\s?%/i)
  assert.doesNotMatch(KUPNO_DESCRIPTION, /Państw/)
})
