import test from 'node:test'
import assert from 'node:assert/strict'
import { buildPageMeta } from './seoPageMeta.mjs'

test('buildPageMeta sets page-specific canonical, Open Graph, and Twitter URLs', () => {
  const meta = buildPageMeta({ title: 'Mieszkania na wynajem', description: 'Aktualne oferty najmu.' }, '/wynajem')

  assert.equal(meta.alternates.canonical, 'https://www.investrent.com.pl/wynajem')
  assert.equal(meta.openGraph.url, meta.alternates.canonical)
  assert.equal(meta.openGraph.title, 'Mieszkania na wynajem')
  assert.equal(meta.openGraph.description, 'Aktualne oferty najmu.')
  assert.equal(meta.openGraph.siteName, 'InvestRent Nieruchomości')
  assert.equal(meta.twitter.card, 'summary_large_image')
  assert.equal(meta.twitter.title, 'Mieszkania na wynajem')
  assert.equal(meta.twitter.images[0], 'https://www.investrent.com.pl/hero.jpg')
})

test('buildPageMeta resolves locality paths and custom social images on the site origin', () => {
  const robots = { index: false, follow: true }
  const meta = buildPageMeta({ title: { absolute: 'Nieruchomości Grzybowo' }, description: 'Informacje o rynku w Grzybowie.', robots }, '/nadmorskie-miejscowosci-kolobrzeg/grzybowo', { image: '/og/locality.jpg' })

  assert.equal(meta.openGraph.url, 'https://www.investrent.com.pl/nadmorskie-miejscowosci-kolobrzeg/grzybowo')
  assert.equal(meta.robots, robots)
  assert.deepEqual(meta.openGraph.images, [{
    url: 'https://www.investrent.com.pl/og/locality.jpg',
    width: 1920,
    height: 1080,
    alt: 'Nieruchomości Grzybowo',
  }])
  assert.deepEqual(meta.twitter.images, ['https://www.investrent.com.pl/og/locality.jpg'])
})
