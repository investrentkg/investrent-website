// Uruchom: node --test src/lib/offerIndexing.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isIndexableOfferStatus,
  GONE_OFFER_ROBOTS,
  offerAvailability,
  offerLastModified,
  sitemapOfferEntries,
} from './offerIndexing.ts'

const BASE = 'https://www.investrent.com.pl'

test('indeksowalne są tylko opublikowana i zarezerwowana', () => {
  assert.equal(isIndexableOfferStatus('opublikowana'), true)
  assert.equal(isIndexableOfferStatus('zarezerwowana'), true)
  for (const s of ['sprzedana', 'wynajeta', 'wygasla', 'szkic', 'zatwierdzona', '', null, undefined, 5]) {
    assert.equal(isIndexableOfferStatus(s), false, String(s))
  }
})

test('strona oferty niedostępnej: noindex, follow', () => {
  assert.deepEqual(GONE_OFFER_ROBOTS, { index: false, follow: true })
})

test('dostępność w danych strukturalnych: zarezerwowana = LimitedAvailability, reszta InStock', () => {
  assert.equal(offerAvailability('zarezerwowana'), 'https://schema.org/LimitedAvailability')
  assert.equal(offerAvailability('opublikowana'), 'https://schema.org/InStock')
})

test('sitemapa: sprzedane i wygasłe odpadają, zarezerwowana zostaje', () => {
  const entries = sitemapOfferEntries(
    [
      { id: '1', slug: 'a', status: 'opublikowana', created_at: '2026-10-01T10:00:00Z' },
      { id: '2', slug: 'b', status: 'sprzedana', created_at: '2026-09-01T10:00:00Z' },
      { id: '3', slug: 'c', status: 'zarezerwowana', created_at: '2026-09-02T10:00:00Z' },
      { id: '4', slug: 'd', status: 'wygasla', created_at: '2026-09-03T10:00:00Z' },
      { id: '5', slug: 'e', created_at: '2026-09-04T10:00:00Z' },
    ],
    BASE,
  )
  assert.deepEqual(entries.map(e => e.url), [`${BASE}/oferty/a`, `${BASE}/oferty/c`])
})

test('sitemapa: slug, a bez slugu id', () => {
  const [a, b] = sitemapOfferEntries(
    [
      { id: 'uuid-1', slug: 'mieszkanie-x', status: 'opublikowana' },
      { id: 'uuid-2', slug: null, status: 'opublikowana' },
    ],
    BASE,
  )
  assert.equal(a.url, `${BASE}/oferty/mieszkanie-x`)
  assert.equal(b.url, `${BASE}/oferty/uuid-2`)
})

test('lastModified: updated_at ma pierwszeństwo, potem created_at, błędna data pomijana', () => {
  assert.equal(
    offerLastModified({ id: '1', created_at: '2026-09-01T00:00:00Z', updated_at: '2026-10-20T00:00:00Z' }).toISOString(),
    '2026-10-20T00:00:00.000Z',
  )
  assert.equal(offerLastModified({ id: '1', created_at: '2026-09-01T00:00:00Z' }).toISOString(), '2026-09-01T00:00:00.000Z')
  assert.equal(offerLastModified({ id: '1', created_at: '2026-09-01T00:00:00Z', updated_at: 'nie-data' }).toISOString(), '2026-09-01T00:00:00.000Z')
  assert.equal(offerLastModified({ id: '1', created_at: null, updated_at: null }), undefined)
  const [e] = sitemapOfferEntries([{ id: '1', slug: 'a', status: 'opublikowana' }], BASE)
  assert.equal('lastModified' in e, false)
})
