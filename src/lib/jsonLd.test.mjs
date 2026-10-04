// Uruchom: node --test src/lib/jsonLd.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { serializeJsonLd } from './jsonLd.ts'
import { buildOfficeSchema, OFFICE_GEO } from './officeSchema.ts'

test('escapuje "<" i "</script>" w polach (XSS przez dane z CMS)', () => {
  const evil = '</script><script>alert(1)</script><!--'
  const out = serializeJsonLd({ '@type': 'Article', headline: evil, a: ['<b>x</b>'] })
  assert.ok(!out.includes('<'), out)
  assert.ok(!out.toLowerCase().includes('</script'))
  // po sparsowaniu wartosc jest NIEZMIENIONA (to poprawny JSON)
  assert.deepEqual(JSON.parse(out), { '@type': 'Article', headline: evil, a: ['<b>x</b>'] })
})
test('escapuje separatory linii U+2028 / U+2029', () => {
  const s = 'a' + String.fromCharCode(0x2028) + 'b' + String.fromCharCode(0x2029) + 'c'
  const out = serializeJsonLd({ s })
  assert.ok(!out.includes(String.fromCharCode(0x2028)) && !out.includes(String.fromCharCode(0x2029)))
  assert.equal(JSON.parse(out).s, s)
})
test('zwykle dane bez zmian wzgledem JSON.stringify', () => {
  const o = { a: 1, b: 'zażółć gęślą', c: [true, null] }
  assert.equal(serializeJsonLd(o), JSON.stringify(o))
})
test('schemat biura przechodzi przez helper z poprawnym geo i telefonem', () => {
  const s = JSON.parse(serializeJsonLd(buildOfficeSchema({ name: 'X</script>', logo_url: null, address: null, phone: '731554341', email: null, website: null, working_hours: null }, null)))
  assert.deepEqual(s.geo, { '@type': 'GeoCoordinates', ...OFFICE_GEO })
  assert.equal(s.telephone, '+48731554341')
  assert.equal(s.name, 'X</script>')
})

// Straznik: zaden skrypt ld+json w src/ nie moze omijac helpera ani miec starych stalych biura.
import fs from 'node:fs'
import path from 'node:path'
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : /\.(tsx?|mjs)$/.test(e.name) ? [path.join(dir, e.name)] : [])
}
test('kazdy <script type="application/ld+json"> w src/ uzywa serializeJsonLd; brak starych geo', () => {
  for (const f of walk('src').filter(f => !f.endsWith('.test.mjs'))) {
    const src = fs.readFileSync(f, 'utf8')
    for (const line of src.split(/\r?\n/).filter(l => !l.trim().startsWith('//') && l.includes('<script type="application/ld+json"'))) {
      assert.ok(line.includes('serializeJsonLd'), `${f}: ${line.trim().slice(0, 100)}`)
    }
    assert.ok(f.endsWith('officeSchema.ts') || !/54\.1764|15\.5830/.test(src), `${f}: stare wspolrzedne biura`)
  }
})
