import test from 'node:test'
import assert from 'node:assert/strict'
import { buildPageMeta } from './buildPageMeta.ts'

test('buduje OG i Twitter metadata z kanonicznym URL konkretnej podstrony', () => {
  const meta = buildPageMeta({
    title: 'Wynajem mieszkań',
    description: 'Oferty wynajmu w Kołobrzegu.',
    path: '/wynajem',
  })

  assert.equal(meta.openGraph.url, 'https://www.investrent.com.pl/wynajem')
  assert.equal(meta.openGraph.title, 'Wynajem mieszkań')
  assert.equal(meta.twitter.title, 'Wynajem mieszkań')
  assert.equal(meta.openGraph.description, meta.twitter.description)
  assert.equal(meta.openGraph.images[0].url, '/hero.jpg')
})

test('obsługuje bezwzględny tytuł i slash końcowy w konfiguracji domeny', () => {
  const before = process.env.NEXT_PUBLIC_SITE_URL
  process.env.NEXT_PUBLIC_SITE_URL = 'https://example.test/'
  try {
    const meta = buildPageMeta({ title: { absolute: 'Nieruchomości' }, description: 'Opis', path: '/kolobrzeg' })
    assert.equal(meta.openGraph.url, 'https://example.test/kolobrzeg')
    assert.equal(meta.twitter.title, 'Nieruchomości')
  } finally {
    if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = before
  }
})
