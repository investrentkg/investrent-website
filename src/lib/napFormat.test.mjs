import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { formatPhoneDisplay, formatStreetDisplay } from './napFormat.ts'

test('telefon: rozne zapisy -> +48 731 554 341', () => {
  for (const r of ['731554341', '+48731554341', '+48 731 554 341', '48731554341', '731 554 341', '0048731554341', '+48-731-554-341'])
    assert.equal(formatPhoneDisplay(r), '+48 731 554 341', r)
})
test('telefon: nierozpoznany format bez zmian', () => {
  assert.equal(formatPhoneDisplay('12 345'), '12 345')
})
test('adres: prefiks ul. i spacja po lok.', () => {
  assert.equal(formatStreetDisplay('Ratuszowa 12/1 lok.3'), 'ul. Ratuszowa 12/1 lok. 3')
  assert.equal(formatStreetDisplay('ul. Ratuszowa 12/1 lok. 3'), 'ul. Ratuszowa 12/1 lok. 3')
  assert.equal(formatStreetDisplay('ul. Ratuszowa 12/1 lok.3'), 'ul. Ratuszowa 12/1 lok. 3')
})
test('stopka: href tel: nadal z surowego numeru, format tylko w tekscie', () => {
  const src = fs.readFileSync(new URL('../components/Footer.tsx', import.meta.url), 'utf8')
  assert.ok(src.includes("const telHref = 'tel:' + phone.replace("))
  assert.ok(src.includes('<a href={telHref}>{formatPhoneDisplay(phone)}</a>'))
})
