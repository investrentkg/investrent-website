// Uruchom: node --test src/lib/relatedOffers.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { categoryLink, pickRelated } from './relatedOffers.ts'

test('kategoria: sprzedaż mieszkań/domów/działek na dedykowane strony, reszta na /oferty', () => {
  assert.equal(categoryLink({ property_type: 'mieszkanie', transaction_type: 'sprzedaz' }).href, '/mieszkania-na-sprzedaz-kolobrzeg')
  assert.equal(categoryLink({ property_type: 'dom', transaction_type: 'sprzedaz' }).href, '/domy-na-sprzedaz-kolobrzeg')
  assert.equal(categoryLink({ property_type: 'dzialka', transaction_type: 'sprzedaz' }).href, '/dzialki-na-sprzedaz-kolobrzeg')
  assert.equal(categoryLink({ property_type: 'mieszkanie', transaction_type: 'wynajem' }).href, '/oferty')
  assert.equal(categoryLink({ property_type: 'magazyn', transaction_type: 'sprzedaz' }).href, '/oferty')
  assert.equal(categoryLink({}).href, '/oferty')
})

test('podobne: bez bieżącej oferty, najpierw ta sama miejscowość, limit 3', () => {
  const cur = { id: 'a', slug: 'a-slug', address_city: 'Kołobrzeg' }
  const list = [
    { id: 'a', slug: 'a-slug', address_city: 'Kołobrzeg' },
    { id: 'b', slug: 'b', address_city: 'Trzebiatów' },
    { id: 'c', slug: 'c', address_city: 'kołobrzeg ' },
    { id: 'd', slug: 'd', address_city: 'Kołobrzeg' },
    { id: 'e', slug: 'e', address_city: 'Sianożęty' },
    { id: 'f', slug: 'f', address_city: 'Kołobrzeg' },
  ]
  assert.deepEqual(pickRelated(cur, list).map(o => o.id), ['c', 'd', 'f'])
  assert.deepEqual(pickRelated(cur, list, 5).map(o => o.id), ['c', 'd', 'f', 'b', 'e'])
})

test('podobne: bez miejscowości zachowuje kolejność z API; puste wejście daje pustą listę', () => {
  assert.deepEqual(pickRelated({ id: 'a' }, [{ id: 'a' }, { id: 'b' }, { id: 'c' }]).map(o => o.id), ['b', 'c'])
  assert.deepEqual(pickRelated({ id: 'a' }, []), [])
})