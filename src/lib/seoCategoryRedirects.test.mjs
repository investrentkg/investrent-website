import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const config = require('../../next.config.js')

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
