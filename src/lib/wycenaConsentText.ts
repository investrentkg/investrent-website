// JEDNO miejsce konfiguracji tresci zgody karty rynku /wycena (flaga NEXT_PUBLIC_WYCENA_MARKET_CARD).
// TEKST K1 (zaakceptowany przez Daniela, z dopiskiem o inwestorach zagranicznych) NIE zostal dostarczony do repo: tu jest PLACEHOLDER.
// NIE WYMYSLAC tresci zgody. Po dostarczeniu tekstu: wpisac go DOSLOWNIE w CONSENT_TEXT i podbic CONSENT_VERSION (nowa wersja = nowy dowod zgody).
// Zabezpieczenia: (1) karta nie renderuje sie bez gotowego tekstu nawet przy fladze ON (marketCardActive),
// (2) test (src/lib/marketCard.test.mjs) i skrypt prebuild (scripts/check-market-card-consent.mjs) PADAJA, gdy flaga jest ON, a tekst to placeholder/pusty.

export const CONSENT_PLACEHOLDER = 'TEKST_ZGODY_DO_UZUPELNIENIA'

/** Tresc checkboxa zgody (renderowana doslownie). null/placeholder = brak zatwierdzonego tekstu. */
export const CONSENT_TEXT: string | null = null

/** Wersja tresci zgody wysylana do CRM (format wycena-RRRR-MM-DD-vN). Podbic razem z CONSENT_TEXT; CRM musi miec te wersje na liscie dozwolonych. */
export const CONSENT_VERSION = 'wycena-2026-10-18-v1'

export function consentTextReady(text: string | null | undefined): text is string {
  if (typeof text !== 'string') return false
  const t = text.trim()
  return t.length >= 20 && !t.includes(CONSENT_PLACEHOLDER)
}

/** Karta rynku jest aktywna dopiero, gdy flaga jest ON ORAZ tekst zgody jest gotowy (flaga nie dziala bez tekstu). */
export function marketCardActive(flagOn: boolean, text: string | null | undefined = CONSENT_TEXT): boolean {
  return flagOn && consentTextReady(text)
}