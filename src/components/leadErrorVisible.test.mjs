// Uruchom: node --test src/components/leadErrorVisible.test.mjs
// Test na poziomie zrodla: nieudana wysylka leada z czatu i kalkulatora kredytowego pokazuje komunikat z numerem biura
// (wczesniej: kalkulator na stronie glownej nie pokazywal nic, czat tylko czerwona ramke).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8')

for (const [file, state] of [['MortgageCalcSection.tsx', 'leadStatus'], ['ChatWidget.tsx', 'status']]) {
  test(`${file}: blad wysylki pokazuje LEAD_ERROR_MESSAGE jako alert`, () => {
    const src = read(`./${file}`)
    assert.match(src, /import \{ LEAD_ERROR_MESSAGE \} from '@\/lib\/leadSubmit'/)
    assert.match(src, new RegExp(`\\{${state} === 'error'[^\\n]*role="alert"[^\\n]*\\{LEAD_ERROR_MESSAGE\\}`))
  })
}
