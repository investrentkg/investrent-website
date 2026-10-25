# SEO PR-4 — weryfikacja lokalna

## Dane i zakres

Podgląd używa publicznej, statycznej treści strony niemieckiej. Nie korzysta z rekordów CRM ani danych klientów. Build mógł pobrać dane ofert do pozostałych tras; API w buildzie zwróciło HTTP 429 i strona użyła istniejącego fallbacku.

## Sprawdzenie

1. Uruchom `npm ci`, `npm run build`, a następnie `npm start`.
2. Otwórz `http://localhost:3000/de`; żądanie powinno zakończyć się przekierowaniem 301 do `/de/immobilien-kolberg`.
3. W źródle strony docelowej sprawdź `<html lang="de">` oraz `hreflang` dla `de`, `pl` i `x-default`. W pasku nawigacji sprawdź przełącznik `PL`; na polskich stronach przełącza na `DE`.
4. Sitemap `/sitemap.xml` zawiera alternatywy językowe dla stron z odpowiednikiem PL/DE.

Zrzuty z lokalnego builda: [desktop](de-desktop.png), [mobile](de-mobile.png). Są obok testu tras [seoLocaleRoutes.test.mjs](../../src/lib/seoLocaleRoutes.test.mjs).

## Cofnięcie

Revert PR usuwa grupy routingu, osobny niemiecki root layout, wpis przekierowania i hreflang. Adresy PL i DE pozostają bez zmian; po cofnięciu `/de` wraca do dotychczasowego zachowania.
