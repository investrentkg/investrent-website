// Flagi funkcji /wycena (Next.js inlinuje WYLACZNIE literalne odwolania process.env.NEXT_PUBLIC_*, dlatego kazda flaga ma wlasny odczyt).
// Wszystkie DOMYSLNIE WYLACZONE: merge nie zmienia produkcji. Wlaczenie = ustawienie zmiennej na "on" w Vercel + redeploy.

/** Blok "Bezplatna, dokladniejsza wycena od agenta" bezposrednio pod wynikiem (zamiast osobnej karty kontaktu pod spodem). */
export const PHONE_BLOCK_ON: boolean = process.env.NEXT_PUBLIC_WYCENA_PHONE_BLOCK === 'on'
/** Wysylka numeru z bloku przez POST /api/public/valuation/callback (valuation_token z /estimate). Bez flagi: dotychczasowy POST /api/public/leads. */
export const CALLBACK_ON: boolean = process.env.NEXT_PUBLIC_WYCENA_CALLBACK === 'on'
/** Wywolania licznika lejka (POST /api/public/valuation/funnel-step, CRM #1066). Wlaczamy po migracji i fladze CRM PUBLIC_FUNNEL_STEPS_ENABLED. */
export const FUNNEL_ON: boolean = process.env.NEXT_PUBLIC_WYCENA_FUNNEL === 'on'
/**
 * Baner cookies (fixed, na dole) nie moze zaslaniac fokusowanego pola: ile px przewinac, zeby dol pola byl nad banerem (0 = nic nie trzeba).
 * Samo scroll-padding nie wystarcza, gdy pole jest juz w obrebie ekranu (przegladarka go nie przewija).
 */
export function scrollDeltaAboveBanner(fieldBottomPx: number, viewportHeightPx: number, bannerHeightPx: number, marginPx = 24): number {
  if (!(bannerHeightPx > 0)) return 0
  const barTop = viewportHeightPx - bannerHeightPx
  const over = fieldBottomPx - (barTop - marginPx)
  return over > 0 ? Math.ceil(over) : 0
}
