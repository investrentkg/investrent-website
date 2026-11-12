import { marketCardActive } from './wycenaConsentText.ts'
// Flagi funkcji /wycena (Next.js inlinuje WYLACZNIE literalne odwolania process.env.NEXT_PUBLIC_*, dlatego kazda flaga ma wlasny odczyt).
// Wszystkie DOMYSLNIE WYLACZONE: merge nie zmienia produkcji. Wlaczenie = ustawienie zmiennej na "on" w Vercel + redeploy.

/** Blok "Bezplatna, dokladniejsza wycena od agenta" bezposrednio pod wynikiem (zamiast osobnej karty kontaktu pod spodem). */
export const PHONE_BLOCK_ON: boolean = process.env.NEXT_PUBLIC_WYCENA_PHONE_BLOCK === 'on'
/** Wysylka numeru z bloku przez POST /api/public/valuation/callback (valuation_token z /estimate). Bez flagi: dotychczasowy POST /api/public/leads. */
export const CALLBACK_ON: boolean = process.env.NEXT_PUBLIC_WYCENA_CALLBACK === 'on'
/** Wywolania licznika lejka (POST /api/public/valuation/funnel-step, CRM #1066). Wlaczamy po migracji i fladze CRM PUBLIC_FUNNEL_STEPS_ENABLED. */
export const FUNNEL_ON: boolean = process.env.NEXT_PUBLIC_WYCENA_FUNNEL === 'on'
/** Meta Lead measurement. OFF by default; requires approved consent/rodo copy and server env before enabling. */
export const WYCENA_META_TRACKING_ON: boolean = process.env.NEXT_PUBLIC_META_PIXEL_ENABLED === 'on'

/** Karta rynku (ceny ofert + ceny transakcyjne) i okno kontaktu w bloku telefonu (S2). Dziala WYLACZNIE razem z gotowym tekstem zgody (wycenaConsentText.ts). */
export const MARKET_CARD_FLAG: boolean = process.env.NEXT_PUBLIC_WYCENA_MARKET_CARD === 'on'
/** Flaga ON ORAZ gotowy tekst zgody; bez tekstu karta i checkbox sie nie pojawiaja nawet przy fladze ON. */
export const MARKET_CARD_ACTIVE: boolean = marketCardActive(MARKET_CARD_FLAG)

/** Układ kalkulatora v4; pozostaje nieaktywny bez jednoczesnego włączenia karty rynku. */
export const WYCENA_LAYOUT_V4_FLAG: boolean = process.env.NEXT_PUBLIC_WYCENA_LAYOUT_V4 === 'on'
/** Blok kontaktu v4 musi być zaakceptowany razem z nową kwotą; domyślnie OFF do akceptacji tekstu przez Prawnika i Daniela. */
export const WYCENA_NOTICE_V4_FLAG: boolean = process.env.NEXT_PUBLIC_WYCENA_NOTICE_V4 === 'on'
export const WYCENA_LAYOUT_V4_ACTIVE: boolean = WYCENA_LAYOUT_V4_FLAG && MARKET_CARD_ACTIVE && WYCENA_NOTICE_V4_FLAG

/** wynik_v2 (makieta 3, 09.11.2026): dwa osobne bloki cen (oferty / sprzedane), ramka roznicy, stale zastrzezenie. Wartosci: "on" = dla wszystkich, "ab" = test A/B 50/50 losowany przy wejsciu na strone (bez cookies i storage). Dziala WYLACZNIE razem z aktywnym ukladem v4. */
export const WYCENA_RESULT_V2_MODE: 'on' | 'ab' | 'off' = process.env.NEXT_PUBLIC_WYCENA_RESULT_V2 === 'on' ? 'on' : process.env.NEXT_PUBLIC_WYCENA_RESULT_V2 === 'ab' ? 'ab' : 'off'
export const WYCENA_RESULT_V2_ELIGIBLE: boolean = WYCENA_RESULT_V2_MODE !== 'off' && WYCENA_LAYOUT_V4_ACTIVE

/** Ekran 1 v4 (makieta E1i, 11.11.2026): "on" = wariant B (4 pola: metraz, miejscowosc, pokoje, pietro) dla wszystkich; "ab" = test A (2 pola) / B (4 pola) 50/50 losowany przy wejsciu (pamiec strony, bez cookies i storage). Dziala WYLACZNIE razem z aktywnym ukladem v4. */
export const WYCENA_SCREEN1_V4_MODE: 'on' | 'ab' | 'off' = process.env.NEXT_PUBLIC_WYCENA_SCREEN1_V4 === 'on' ? 'on' : process.env.NEXT_PUBLIC_WYCENA_SCREEN1_V4 === 'ab' ? 'ab' : 'off'
export const WYCENA_SCREEN1_V4_ELIGIBLE: boolean = WYCENA_SCREEN1_V4_MODE !== 'off' && WYCENA_LAYOUT_V4_ACTIVE
