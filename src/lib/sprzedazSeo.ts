// SEO krok 2 (18.10.2026): teksty dla /sprzedaz i strony glownej w jednym miejscu,
// zeby test (sprzedazSeo.test.mjs) pilnowal zakazow (kraj, liczby, "bezplatnie").
// Teksty A i B zaakceptowane przez Daniela DOSLOWNIE - nie zmieniac bez jego zgody.
export const SPRZEDAZ_TITLE = 'Sprzedaż mieszkania w Kołobrzegu | InvestRent'
export const SPRZEDAZ_H1 = 'Sprzedaż mieszkania w Kołobrzegu'
export const SPRZEDAZ_META_DESCRIPTION =
  'Sprzedaj mieszkanie w Kołobrzegu z biurem InvestRent: orientacyjna wycena, prezentacja i promocja oferty.'

export const FOREIGN_H2 = 'Wybrane oferty promujemy także na rynkach zagranicznych'
// Tekst B (/sprzedaz)
export const FOREIGN_TEXT_B =
  'Promujemy oferty także na rynkach zagranicznych, w naszych kanałach marketingowych i przez partnera, który ma dostęp do inwestorów z różnych krajów. Nie dotyczy to każdej oferty. Czy Twoja się do tego nadaje, omówimy przy ustalaniu strategii sprzedaży.'

export const VALUATION_CTA_LABEL = 'Sprawdź orientacyjny przedział ceny'

// FAQ dopisane do istniejacej listy na /sprzedaz (tekst Marketingu 18.10)
export const NEW_FAQ: { q: string; a: string }[] = [
  {
    q: 'Czy oferty promujecie za granicą?',
    a: 'Wybrane oferty promujemy także na rynkach zagranicznych: w naszych kanałach marketingowych i przez partnera, który ma dostęp do inwestorów z różnych krajów. Nie dotyczy to każdej oferty. Czy Twoja się do tego nadaje, omówimy przy ustalaniu strategii sprzedaży.',
  },
  {
    q: 'Jak sprawdzić orientacyjną cenę mojego mieszkania?',
    a: 'Skorzystaj z kalkulatora wyceny na naszej stronie. Wynik jest orientacyjny i nie zastępuje wyceny na podstawie oględzin. Jeśli chcesz, agent InvestRent omówi go z Tobą.',
  },
  {
    q: 'Czy każda oferta trafia do inwestorów zagranicznych?',
    a: 'Nie. To zależy od oferty. Dlatego przy ustalaniu strategii sprzedaży omawiamy z Tobą, czy i jak ją przedstawić.',
  },
]

// Tekst A (strona glowna)
export const HOME_TEXT_A =
  'Wybrane oferty promujemy także na rynkach zagranicznych: własnymi kanałami marketingowymi i przez partnera z dostępem do inwestorów z różnych krajów.'
