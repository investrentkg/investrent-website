// Title i description strony /trudne-nieruchomosci (DRAFT do decyzji, wdrożenie nie przed 12.11.2026, D83).
// Powód: strona stoi na poz. 7,5 dla frazy "trudne nieruchomości", a CTR to 0,4% przy 223 wyświetleniach (GSC 1.08-31.10.2026).
// Title bez marki: szablon layout.tsx dokleja " | InvestRent Nieruchomości", razem do ~60 znaków.
// Bez obietnic: tylko tematy opisane na stronie (spadek, hipoteka, współwłasność, licytacja), bez "skupu", ceny i czasu sprzedaży.
// Stałe w .ts, bo test (node --test) nie importuje .tsx.

export const TRUDNE_TITLE = 'Trudne nieruchomości w Kołobrzegu'
export const TRUDNE_DESCRIPTION =
  'Nieruchomość ze spadkiem, hipoteką, współwłasnością lub licytacją komorniczą w Kołobrzegu? Opisujemy opcje i pomagamy uporządkować sprawę.'

export const TRUDNE_TITLE_SUFFIX_LEN = ' | InvestRent Nieruchomości'.length
