// Uruchom: node --test src/components/pathChoice.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { PATH_CHOICE_LINKS } from '../lib/pathChoice.ts'

test('blok ścieżek: cztery równorzędne cele, sprzedający i kupujący obok siebie', () => {
  assert.deepEqual(PATH_CHOICE_LINKS.map(l => l.href), ['/sprzedaz', '/wycena', '/kupno', '/mieszkania-na-sprzedaz-kolobrzeg'])
  for (const l of PATH_CHOICE_LINKS) { assert.ok(l.title && l.desc) }
  const text = PATH_CHOICE_LINKS.map(l => l.title + ' ' + l.desc).join(' ')
  assert.ok(!/\d/.test(text), 'bez liczb, cen i obietnic')
})

test('blok jest na stronie głównej i na /oferty (poza widokiem agenta), nie zmienia metadanych', () => {
  const home = fs.readFileSync(new URL('../app/(pl)/page.tsx', import.meta.url), 'utf8')
  const oferty = fs.readFileSync(new URL('../app/(pl)/oferty/page.tsx', import.meta.url), 'utf8')
  assert.ok(home.includes('<PathChoice id="sciezki-home" />'))
  assert.ok(oferty.includes('{!agent_id && <PathChoice id="sciezki-oferty" />}'))
})