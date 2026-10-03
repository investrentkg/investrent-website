// Uruchom: node --test src/lib/schemaRating.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { getVerifiedRating, shouldEmitAggregateRating, RATING_MAX_AGE_DAYS } from './schemaRating.ts'
import { buildOfficeSchema, OFFICE_GEO } from './officeSchema.ts'

const NOW = new Date('2026-10-03T12:00:00Z')
const daysAgo = (d) => new Date(NOW.getTime() - d * 86400000).toISOString()
const good = { ok: true, rating: 4.9, total: 73, reviews: [] }

test('prog swiezosci to 14 dni', () => assert.equal(RATING_MAX_AGE_DAYS, 14))

test('dane ok, bez updated_at i stale (backend jeszcze ich nie wysyla) -> emitujemy', () => {
  assert.deepEqual(getVerifiedRating(good, NOW), { rating: 4.9, total: 73 })
  assert.equal(shouldEmitAggregateRating(good, NOW), true)
})
test('null / undefined / nie-obiekt (API zawiodlo) -> brak', () => {
  for (const v of [null, undefined, 'x', 42, []]) assert.equal(getVerifiedRating(v, NOW), null)
})
test('ok:false lub brak ok -> brak', () => {
  assert.equal(getVerifiedRating({ ...good, ok: false }, NOW), null)
  assert.equal(getVerifiedRating({ rating: 4.9, total: 73 }, NOW), null)
})
test('stale:true -> brak; stale:false -> ok', () => {
  assert.equal(getVerifiedRating({ ...good, stale: true }, NOW), null)
  assert.deepEqual(getVerifiedRating({ ...good, stale: false }, NOW), { rating: 4.9, total: 73 })
})
test('updated_at: swieze ok, dokladnie 14 dni ok, 14 dni + 1 min brak, 26 dni brak', () => {
  assert.notEqual(getVerifiedRating({ ...good, updated_at: daysAgo(1) }, NOW), null)
  assert.notEqual(getVerifiedRating({ ...good, updated_at: daysAgo(14) }, NOW), null)
  assert.equal(getVerifiedRating({ ...good, updated_at: new Date(NOW.getTime() - 14 * 86400000 - 60000).toISOString() }, NOW), null)
  assert.equal(getVerifiedRating({ ...good, updated_at: '2026-09-07T15:11:36.279Z' }, NOW), null) // realna wartosc z API w dniu zmiany
})
test('updated_at nieczytelne -> brak; null -> traktowane jak brak pola', () => {
  assert.equal(getVerifiedRating({ ...good, updated_at: 'wczoraj' }, NOW), null)
  assert.equal(getVerifiedRating({ ...good, updated_at: 12345 }, NOW), null)
  assert.notEqual(getVerifiedRating({ ...good, updated_at: null }, NOW), null)
})
test('rating/total zero, ujemne, poza zakresem, nie-liczby -> brak (przypadek 17.07: ok:true z zerami)', () => {
  for (const bad of [
    { rating: 0, total: 73 }, { rating: 4.9, total: 0 }, { rating: 0, total: 0 },
    { rating: 5.1, total: 73 }, { rating: -1, total: 73 }, { rating: 4.9, total: 73.5 },
    { rating: 'abc', total: 73 }, { rating: 4.9, total: null }, { rating: undefined, total: undefined }, { rating: NaN, total: 73 },
  ]) assert.equal(getVerifiedRating({ ok: true, ...bad }, NOW), null, JSON.stringify(bad))
})
test('liczby jako stringi z API sa konwertowane na liczby', () => {
  assert.deepEqual(getVerifiedRating({ ok: true, rating: '4.9', total: '73' }, NOW), { rating: 4.9, total: 73 })
})
test('domyslne now dziala (bez drugiego argumentu)', () => {
  assert.notEqual(getVerifiedRating({ ...good, updated_at: new Date().toISOString() }), null)
})

// ---- wyrenderowany JSON-LD (ta sama funkcja, ktorej uzywa komponent JsonLd) ----
const office = { name: 'InvestRent Nieruchomości', logo_url: null, address: 'Ratuszowa 12/1 lok.3, 78-100 Kołobrzeg', phone: '731554341', email: 'biuro@investrent.com.pl', website: null, working_hours: null, facebook_url: 'https://www.facebook.com/profile.php?id=61578147880836', instagram_url: 'https://www.instagram.com/invest.rent/' }

test('JSON-LD z wiarygodna ocena: aggregateRating jako LICZBY, zgodne z obiektem zrodlowym', () => {
  const rating = getVerifiedRating(good, NOW)
  const s = buildOfficeSchema(office, rating)
  assert.deepEqual(s.aggregateRating, { '@type': 'AggregateRating', ratingValue: 4.9, reviewCount: 73 })
  assert.equal(typeof s.aggregateRating.ratingValue, 'number')
  assert.equal(typeof s.aggregateRating.reviewCount, 'number')
})
test('JSON-LD bez wiarygodnej oceny: brak klucza aggregateRating (a nie 0 / 55)', () => {
  for (const r of [null, undefined, getVerifiedRating({ ...good, stale: true }, NOW)]) {
    const s = buildOfficeSchema(office, r)
    assert.equal('aggregateRating' in s, false)
    assert.ok(!JSON.stringify(s).includes('aggregateRating'))
  }
})
test('geo: wspolrzedne biura z 5 miejscami po przecinku (OSM)', () => {
  const s = buildOfficeSchema(office, null)
  assert.deepEqual(s.geo, { '@type': 'GeoCoordinates', latitude: 54.17705, longitude: 15.57682 })
  assert.deepEqual(OFFICE_GEO, { latitude: 54.17705, longitude: 15.57682 })
  for (const v of [s.geo.latitude, s.geo.longitude]) assert.ok(String(v).split('.')[1].length >= 5)
})
test('NAP: telefon w E.164 (CRM trzyma surowe cyfry), fallback gdy brak biura', () => {
  assert.equal(buildOfficeSchema(office, null).telephone, '+48731554341')
  assert.equal(buildOfficeSchema({ ...office, phone: '+48 731 554 341' }, null).telephone, '+48731554341')
  assert.equal(buildOfficeSchema(null, null).telephone, '+48731554341')
  assert.equal(buildOfficeSchema(null, null).email, 'biuro@investrent.com.pl')
})
test('pozostale dane strukturalne bez zmian (adres, godziny, sameAs, areaServed, @id)', () => {
  const s = buildOfficeSchema(office, null)
  assert.equal(s['@type'], 'RealEstateAgent')
  assert.equal(s['@id'], 'https://www.investrent.com.pl/#biuro')
  assert.deepEqual(s.address, { '@type': 'PostalAddress', streetAddress: 'ul. Ratuszowa 12/1 lok. 3', addressLocality: 'Kołobrzeg', postalCode: '78-100', addressRegion: 'Zachodniopomorskie', addressCountry: 'PL' })
  assert.equal(s.openingHoursSpecification.length, 2)
  assert.equal(s.areaServed.length, 5)
  assert.deepEqual(s.sameAs, [office.facebook_url, office.instagram_url])
  assert.equal('sameAs' in buildOfficeSchema({ ...office, facebook_url: null, instagram_url: null }, null), false)
})
