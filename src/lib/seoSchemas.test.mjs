import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBreadcrumbJsonLd, buildCollectionJsonLd, buildServiceJsonLd } from './seoSchemas.ts'

test('BreadcrumbList ma kolejne pozycje i pełne URL-e', () => {
  const schema = buildBreadcrumbJsonLd([{ name: 'Strona główna', path: '/' }, { name: 'Oferty', path: '/oferty' }])
  assert.equal(schema['@type'], 'BreadcrumbList')
  assert.equal(schema.itemListElement[1].position, 2)
  assert.equal(schema.itemListElement[1].item, 'https://www.investrent.com.pl/oferty')
})

test('CollectionPage wskazuje listę publicznych pozycji i zachowuje liczbę wyników', () => {
  const schema = buildCollectionJsonLd({ name: 'Oferty', description: 'Lista ofert', path: '/oferty', totalItems: 24, items: [{ name: 'Mieszkanie', path: '/oferty/test-1', image: 'https://example.test/photo.jpg' }] })
  assert.equal(schema['@graph'][0]['@type'], 'CollectionPage')
  assert.equal(schema['@graph'][0].mainEntity['@id'], 'https://www.investrent.com.pl/oferty#item-list')
  assert.equal(schema['@graph'][1]['@type'], 'ItemList')
  assert.equal(schema['@graph'][1].numberOfItems, 24)
  assert.equal(schema['@graph'][1].itemListElement[0].image, 'https://example.test/photo.jpg')
})

test('Service opisuje podanego usługodawcę i obszar', () => {
  const schema = buildServiceJsonLd({ name: 'Sprzedaż', description: 'Obsługa sprzedaży.', provider: 'Biuro testowe', areaServed: 'Miasto testowe', path: '/sprzedaz' })
  assert.equal(schema['@type'], 'Service')
  assert.equal(schema.provider.name, 'Biuro testowe')
  assert.equal(schema.areaServed.name, 'Miasto testowe')
  assert.equal(schema.url, 'https://www.investrent.com.pl/sprzedaz')
})
