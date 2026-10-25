// Uruchom: node --test src/lib/responseTime.test.mjs
// Obietnica czasu reakcji (decyzja Daniela 18.10.2026): 24 godziny, bez „60 minut”.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { RESPONSE_FULL, RESPONSE_SHORT, RESPONSE_BADGE, RESPONSE_SENTENCE, CHAT_RESPONSE_NOTE } from './responseTime.ts'

test('stale obietnicy 24 h', () => {
  assert.equal(RESPONSE_FULL, 'jak najszybciej, nie później niż w ciągu 24 godzin')
  assert.equal(RESPONSE_SHORT, 'najpóźniej w ciągu 24 godzin')
  assert.equal(RESPONSE_BADGE, 'do 24 godz.')
  assert.equal(RESPONSE_SENTENCE, 'Skontaktujemy się jak najszybciej, nie później niż w ciągu 24 godzin.')
})

test('meta stron <= 160 znakow i bez starych fraz', () => {
  const files = ['../app/(pl)/layout.tsx', '../app/(pl)/kontakt/page.tsx', '../app/(pl)/kupno/page.tsx']
  for (const f of files) {
    const src = readFileSync(new URL(f, import.meta.url), 'utf8')
    for (const m of src.matchAll(/description:\s*'([^']*)'/g)) assert.ok(m[1].length <= 160, `${f}: ${m[1].length} zn.`)
    assert.ok(!/60 ?min|w dni robocze i w weekendy|tego samego dnia|gwarantowan/i.test(src), f)
  }
})

test('komunikat czatu dosłownie (wariant A) i użyty w widgecie', () => {
  assert.equal(CHAT_RESPONSE_NOTE, 'Najczęściej odpisujemy do 15 minut. Czasem może to potrwać dłużej, ale nie później niż w ciągu 24 godzin.')
  const w = readFileSync(new URL('../components/ChatWidget.tsx', import.meta.url), 'utf8')
  assert.ok(!/w kilka minut/i.test(w))
  assert.equal((w.match(/\{CHAT_RESPONSE_NOTE\}/g) || []).length, 2)
})
// Straznik: w serwowanych tekstach (src, public) nie wolno przywracac starych obietnic czasu.
// Jawna lista wyjatkow: rozpoznawanie starej wartosci z CRM (LEGACY_HOME_DESCRIPTIONS) i jego test.
// Komentarze (// i /* */) oraz pliki *.test.mjs sa pomijane.
test('brak starych obietnic czasu w calym src i public', async () => {
  const { readdirSync, statSync } = await import('node:fs')
  const { join, relative, sep } = await import('node:path')
  const root = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
  const EXCEPTIONS = new Set(['src/lib/homeMeta.ts'])
  const BAD = /jeszcze dzi[sś]|dzisiaj|tego samego dnia|60 ?min|w dni robocze i w weekendy|gwarantowan/i
  const EXT = /\.(tsx?|jsx?|mjs|json|md|html|txt|xml|webmanifest)$/
  const hits = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) { walk(full); continue }
      const rel = relative(root, full).split(sep).join('/')
      if (!EXT.test(name) || /\.test\.mjs$/.test(name) || EXCEPTIONS.has(rel)) continue
      const text = readFileSync(full, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
      text.split(/\r?\n/).forEach((line, i) => {
        const code = line.replace(/(^|\s)\/\/.*$/, '$1')
        if (BAD.test(code)) hits.push(`${rel}:${i + 1}`)
      })
    }
  }
  walk(join(root, 'src')); walk(join(root, 'public'))
  assert.deepEqual(hits, [])
})
