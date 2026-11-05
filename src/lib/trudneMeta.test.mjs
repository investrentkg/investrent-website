// Uruchom: node --test src/lib/trudneMeta.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { TRUDNE_TITLE, TRUDNE_DESCRIPTION, TRUDNE_TITLE_SUFFIX_LEN } from './trudneMeta.ts'

test('title z marką z szablonu mieści się w ~62 znakach i zaczyna od frazy', () => {
  assert.ok(TRUDNE_TITLE.length + TRUDNE_TITLE_SUFFIX_LEN <= 62, `za długi: ${TRUDNE_TITLE.length + TRUDNE_TITLE_SUFFIX_LEN}`)
  assert.match(TRUDNE_TITLE, /^Trudne nieruchomości/)
  assert.match(TRUDNE_TITLE, /Kołobrzeg/)
})

test('description 120-160 znaków, bez obietnic i bez zwrotu "Państwo"', () => {
  assert.ok(TRUDNE_DESCRIPTION.length >= 120 && TRUDNE_DESCRIPTION.length <= 160, `długość ${TRUDNE_DESCRIPTION.length}`)
  assert.doesNotMatch(TRUDNE_DESCRIPTION, /gwarant|skup|najtaniej|szybk|idealn|\d+\s?%/i)
  assert.doesNotMatch(TRUDNE_DESCRIPTION, /Państw/)
})

test('strona /trudne-nieruchomosci używa stałych (title, description, buildPageMeta)', () => {
  const src = fs.readFileSync(new URL('../app/trudne-nieruchomosci/page.tsx', import.meta.url), 'utf8')
  assert.match(src, /title: TRUDNE_TITLE/)
  assert.match(src, /description: TRUDNE_DESCRIPTION/)
  assert.match(src, /buildPageMeta\(\{ title: TRUDNE_TITLE, description: TRUDNE_DESCRIPTION/)
})
