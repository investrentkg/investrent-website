// JEDNO miejsce konfiguracji tresci zgody karty rynku /wycena (flaga NEXT_PUBLIC_WYCENA_MARKET_CARD).
// TEKST K1 ZATWIERDZONY DOSLOWNIE przez Daniela (18.10.2026). NIE ZMIENIAC brzmienia, interpunkcji ani wielkosci liter bez nowej akceptacji;
// kazda zmiana tekstu = nowy CONSENT_VERSION (nowy dowod zgody) i wpis tej wersji w CRM (env CALCULATOR_CONSENT_VERSIONS, jesli ustawiona).
// Pod checkboxem renderowane sa istniejace teksty PHONE_BLOCK_LEGAL (phoneBlockTexts.ts): klauzula informacyjna i dopisek "To nie jest operat...".
// Zabezpieczenia: (1) karta nie renderuje sie bez gotowego tekstu nawet przy fladze ON (marketCardActive),
// (2) test (src/lib/marketCard.test.mjs) i skrypt prebuild (scripts/check-market-card-consent.mjs) PADAJA, gdy flaga jest ON, a tekst to placeholder/pusty.

export const CONSENT_PLACEHOLDER = 'TEKST_ZGODY_DO_UZUPELNIENIA'

/** Tresc checkboxa zgody (renderowana doslownie). null/placeholder = brak zatwierdzonego tekstu. */
export const CONSENT_TEXT: string | null = 'Chcę, aby agent InvestRent skontaktował się ze mną telefonicznie w sprawie dokładniejszej wyceny tej nieruchomości. To nie jest zgoda na przesyłanie ofert marketingowych.'

/** Wersja tresci zgody wysylana do CRM (format wycena-RRRR-MM-DD-vN). Podbic razem z CONSENT_TEXT; CRM musi miec te wersje na liscie dozwolonych. */
export const CONSENT_VERSION = 'wycena-2026-10-18-v2'

export function consentTextReady(text: string | null | undefined): text is string {
  if (typeof text !== 'string') return false
  const t = text.trim()
  return t.length >= 20 && !t.includes(CONSENT_PLACEHOLDER)
}

/** Karta rynku jest aktywna dopiero, gdy flaga jest ON ORAZ tekst zgody jest gotowy (flaga nie dziala bez tekstu). */
export function marketCardActive(flagOn: boolean, text: string | null | undefined = CONSENT_TEXT): boolean {
  return flagOn && consentTextReady(text)
}
