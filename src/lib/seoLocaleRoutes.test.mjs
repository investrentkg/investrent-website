import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('Polish and German route groups declare matching root document languages', async () => {
  const [plLayout, deLayout] = await Promise.all([
    read('../app/(pl)/layout.tsx'),
    read('../app/(de)/layout.tsx'),
  ])

  assert.match(plLayout, /<html lang="pl"/)
  assert.match(deLayout, /<html lang="de"/)
})

test('German entry route redirects permanently and sitemap declares localized alternates', async () => {
  const [config, sitemap] = await Promise.all([
    read('../../next.config.js'),
    read('../app/(pl)/sitemap.ts'),
  ])

  assert.match(config, /source: '\/de', destination: '\/de\/immobilien-kolberg', statusCode: 301/)
  assert.match(sitemap, /'x-default': BASE_URL/)
  assert.match(sitemap, /alternates: LANGUAGE_ALTERNATES\[p\.path\]/)
})
