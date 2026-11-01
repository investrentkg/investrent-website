import test from 'node:test'
import assert from 'node:assert/strict'
import { WYCENA_V4_TEXTS as V4 } from '../app/wycena/wycenaV4Texts.ts'

// Poz. 8 opinii Prawnika 30.10: kwota, słowo „podobne" i metraż w jednym zdaniu, z podpisem „środkowe 50%".
const norm = s => s.replace(/ | /g, ' ')

test('kwota transakcyjna: zdanie jak w opinii Prawnika', () => {
  assert.equal(norm(V4.amountLabel.transactions(531000, 644000, 45)), '531 000 – 644 000 zł za podobne mieszkania o metrażu 45 m² (środkowe 50% transakcji) — orientacyjnie, bez uwzględnienia stanu.')
})

test('kwota ofertowa: ten sam wzorzec, podpis „ofert"', () => {
  const s = norm(V4.amountLabel.offers(500000, 600000, 52))
  assert.match(s, /za podobne mieszkania o metrażu 52 m² \(środkowe 50% ofert\)/)
  assert.match(s, /bez uwzględnienia stanu\.$/)
})
