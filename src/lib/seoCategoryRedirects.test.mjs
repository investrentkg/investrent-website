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

test('stare adresy ofert Virgo z prefiksem typu trafiają na kategorię tego typu, przed katch-all na /oferty', async () => {
  const redirects = await config.redirects()
  // Uproszczone dopasowanie wzorców "…:slug/:id(\d+)" (te same wzorce co w next.config.js, bez path-to-regexp).
  const matches = (source, path) => {
    if (!source.includes(':slug/:id(\\d+)')) return false
    const prefix = source.slice(0, source.indexOf(':slug')).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp('^' + prefix + '[^/]+/\\d+$').test(path)
  }
  const firstMatch = path => redirects.findIndex(item => matches(item.source, path))
  const cases = [
    ['/mieszkania-na-sprzedaz-419000zl-29m2-kolobrzeg-gw/7139368', '/mieszkania-na-sprzedaz-kolobrzeg'],
    ['/domy-na-sprzedaz-660000zl-200m2-goscino-gw-wartkowo/6912627', '/domy-na-sprzedaz-kolobrzeg'],
    ['/dzialki-na-sprzedaz-79000zl-470m2-kolobrzeg-gw-niekanin/7112188', '/dzialki-na-sprzedaz-kolobrzeg'],
    ['/lokale-na-sprzedaz-990000zl-39m2-kolobrzeg-gw/7150766', '/oferty?property_type=lokal'],
    ['/hale-na-sprzedaz-1390000zl-4000m2-gryfice/7150775', '/oferty?property_type=magazyn'],
    ['/obiekty-na-sprzedaz-1190000zl-2984m2-trzebiatow-gw/7150774', '/oferty'],
  ]
  for (const [path, destination] of cases) {
    const redirect = redirects[firstMatch(path)]
    assert.ok(redirect, `brak reguły dla ${path}`)
    assert.equal(redirect.destination, destination, path)
    assert.equal(redirect.permanent, true)
  }
  assert.equal(firstMatch('/mieszkania-na-sprzedaz-kolobrzeg'), -1, 'sama kategoria nie jest przekierowywana')
  assert.equal(firstMatch('/oferty/mieszkania/kolobrzeg'), -1)
})