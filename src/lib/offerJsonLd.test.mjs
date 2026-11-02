// Uruchom: node --test src/lib/offerJsonLd.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { OFFER_SELLER, OFFER_IMAGES_MAX, offerImages, offerDateModified } from './offerJsonLd.ts'

test('offerImages: kolejność zachowana, puste i duplikaty pominięte', () => {
  const offer = { offer_photos: [{ url: 'a' }, { url: '' }, { url: null }, { url: 'b' }, { url: 'a' }, {}] }
  assert.deepEqual(offerImages(offer), ['a', 'b'])
})

test('offerImages: limit i brak zdjęć', () => {
  const many = { offer_photos: Array.from({ length: 25 }, (_, i) => ({ url: `u${i}` })) }
  assert.equal(offerImages(many).length, OFFER_IMAGES_MAX)
  assert.equal(offerImages(many)[0], 'u0')
  assert.deepEqual(offerImages({}), [])
  assert.deepEqual(offerImages({ offer_photos: null }), [])
})

test('offerDateModified: poprawna data, niepoprawna, wcześniejsza niż created_at', () => {
  assert.equal(offerDateModified({ created_at: '2026-10-28T10:30:04+00:00', updated_at: '2026-10-30T11:43:55+00:00' }), '2026-10-30T11:43:55+00:00')
  assert.equal(offerDateModified({ updated_at: '2026-10-30T11:43:55+00:00' }), '2026-10-30T11:43:55+00:00')
  assert.equal(offerDateModified({ updated_at: 'nie-data' }), undefined)
  assert.equal(offerDateModified({}), undefined)
  assert.equal(offerDateModified({ created_at: '2026-10-30T00:00:00Z', updated_at: '2026-10-01T00:00:00Z' }), undefined)
})

test('seller: stały, bez danych kontaktowych i bez adresu', () => {
  assert.equal(OFFER_SELLER['@type'], 'RealEstateAgent')
  assert.equal(OFFER_SELLER.url, 'https://www.investrent.com.pl')
  assert.deepEqual(Object.keys(OFFER_SELLER).sort(), ['@type', 'name', 'url'])
})
