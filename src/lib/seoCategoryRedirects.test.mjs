import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const config = require('../../next.config.js')

test('/opinia: stały 302 na formularz opinii Google (bez bramki), nie ma go w sitemapie', async () => {
  const redirects = await config.redirects()
  const r = redirects.find(item => item.source === '/opinia')
  assert.ok(r, 'brak reguły /opinia')
  assert.equal(r.statusCode, 302)
  assert.equal(r.permanent, undefined)
  assert.equal(r.destination, 'https://search.google.com/local/writereview?placeid=ChIJeeKGItkVAEcR9xa56dLOQ_M')
  assert.ok(!r.has, 'bez warunków: działa też z ?src=qr')
  const fs = await import('node:fs')
  const sitemap = fs.readFileSync(new URL('../app/sitemap.ts', import.meta.url), 'utf8')
  assert.ok(!/\/opinia\b/.test(sitemap), 'sitemap nie zawiera /opinia')
})

test('stare kategorie ofert przekierowują 301 na dedykowane strony sprzedaży', async () => {
  const redirects = await config.redirects()
  const expected = new Map([
    ['/oferty/mieszkania', '/mieszkania-na-sprzedaz-kolobrzeg'],
    ['/oferty/mieszkania/:path*', '/mieszkania-na-sprzedaz-kolobrzeg'],
    ['/oferty/domy', '/domy-na-sprzedaz-kolobrzeg'],
    ['/oferty/domy/:path*', '/domy-na-sprzedaz-kolobrzeg'],
    ['/oferty/dzialki', '/dzialki-na-sprzedaz-kolobrzeg'],
    ['/oferty/dzialki/:path*', '/dzialki-na-sprzedaz-kolobrzeg'],
  ])

  for (const [source, destination] of expected) {
    const redirect = redirects.find(item => item.source === source)
    assert.ok(redirect, `brak reguły ${source}`)
    assert.equal(redirect.destination, destination)
    assert.equal(redirect.permanent, true)
  }
})
