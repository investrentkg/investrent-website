// prebuild: flaga NEXT_PUBLIC_WYCENA_MARKET_CARD=on NIE moze isc na produkcje bez zatwierdzonego tekstu zgody (src/lib/wycenaConsentText.ts).
import fs from 'node:fs'
if (process.env.NEXT_PUBLIC_WYCENA_MARKET_CARD === 'on') {
  const src = fs.readFileSync(new URL('../src/lib/wycenaConsentText.ts', import.meta.url), 'utf8')
  const m = /export const CONSENT_TEXT: string \| null =\s*(null|'([^']*)'|"([^"]*)"|`([^`]*)`)/.exec(src)
  const val = m && m[1] !== 'null' ? (m[2] ?? m[3] ?? m[4] ?? '') : ''
  if (val.trim().length < 20 || val.includes('TEKST_ZGODY_DO_UZUPELNIENIA')) {
    console.error('BLAD: NEXT_PUBLIC_WYCENA_MARKET_CARD=on, ale CONSENT_TEXT w src/lib/wycenaConsentText.ts jest pusty lub placeholderem. Wylacz flage albo uzupelnij zatwierdzony tekst zgody.')
    process.exit(1)
  }
}