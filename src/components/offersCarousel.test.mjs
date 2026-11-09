import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { transform } from 'sucrase'

// Renderuje OffersSection po stronie serwera (jak SSR Next.js) i sprawdza HTML karuzeli ofert.
const require = createRequire(import.meta.url)
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const srcPath = new URL('./OffersSection.tsx', import.meta.url)
const code = transform(fs.readFileSync(srcPath, 'utf8'), { transforms: ['typescript', 'jsx', 'imports'] }).code
const stubs = {
  'next/image': { __esModule: true, default: (p) => React.createElement('img', { src: p.src, alt: p.alt }) },
  'next/link': { __esModule: true, default: (p) => React.createElement('a', { href: p.href }, p.children) },
}
const mod = { exports: {} }
new Function('React', 'require', 'module', 'exports', code)(React, (n) => stubs[n] ?? require(n), mod, mod.exports)
const OffersSection = mod.exports.default

const offers = Array.from({ length: 6 }, (_, i) => ({
  id: 'id' + i, slug: 'oferta-' + i, title: 'Oferta ' + i, price: 500000 + i, price_per_m2: 10000, area: 50, rooms_count: 2,
  property_type: 'mieszkanie', address_city: 'Kołobrzeg', address_district: 'Centrum', ref_number: 'INV-' + i,
  main_photo: null, main_photo_thumb: null, exclusivity: i === 0, no_rent_fee: false,
}))
const html = renderToStaticMarkup(React.createElement(OffersSection, { initialOffers: { data: offers } }))

test('SSR: wszystkie 6 linkow ofert jako zwykle <a href> w kolejnosci', () => {
  const hrefs = [...html.matchAll(/<a href="(\/oferty\/[^"]+)"/g)].map((m) => m[1])
  assert.deepEqual(hrefs, offers.map((o) => '/oferty/' + o.slug))
})
test('SSR: role/aria karuzeli, przyciski i kropki', () => {
  assert.match(html, /role="region"[^>]*aria-roledescription="karuzela"|aria-roledescription="karuzela"[^>]*role="region"/)
  assert.match(html, /aria-label="Oferty nieruchomości"/)
  assert.match(html, /aria-label="Poprzednie oferty"/)
  assert.match(html, /aria-label="Następne oferty"/)
  for (let n = 1; n <= 6; n++) assert.ok(html.includes(`aria-label="Oferta ${n} z 6"`), 'kropka ' + n)
  assert.equal((html.match(/aria-current="true"/g) || []).length, 1)
})
test('SSR: brak ukrywania kart, plakietka wylacznosci zachowana, cena za m2', () => {
  assert.ok(!/\shidden[=\s>]|display:\s*none|content-visibility/.test(html), 'brak hidden/display:none')
  assert.ok(html.includes('NA WYŁĄCZNOŚCI'))
  assert.ok(html.includes('zł/m²'))
})
test('CSS: karty 4-6 nie sa ukrywane, tor ma overflow-x i scroll-snap, obszar dotyku 44 px', () => {
  const css = fs.readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
  assert.ok(!/\.m3-ogrid\s*>\s*:nth-child\(n\+4\)/.test(css))
  assert.match(css, /\.m3-ocar-track\s*\{[^}]*overflow-x:\s*auto[^}]*scroll-snap-type/)
  assert.match(css, /\.m3-ocar-arrow\s*\{[^}]*width:\s*44px;\s*height:\s*44px/)
  assert.match(css, /\.m3-ocar-dot\s*\{[^}]*width:\s*44px;\s*height:\s*44px/)
  assert.match(css, /prefers-reduced-motion/)
})
