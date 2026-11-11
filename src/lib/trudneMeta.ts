// Title i description strony /trudne-nieruchomosci (zatwierdzone przez Daniela 09.11.2026, wdrożenie 12.11; Krytyk + Prawnik + recenzent faktów).
// Powód: strona stoi na poz. 7,5 dla frazy "trudne nieruchomości", a CTR to 0,4% przy 223 wyświetleniach (GSC 1.08-31.10.2026).
// Title bez marki: szablon layout.tsx dokleja " | InvestRent Nieruchomości", razem do ~60 znaków.
// Bez obietnic: tylko tematy opisane na stronie (spadek, hipoteka, współwłasność, licytacja), bez "skupu", ceny i czasu sprzedaży.
// Stałe w .ts, bo test (node --test) nie importuje .tsx.

export const TRUDNE_TITLE = 'Trudne nieruchomości: spadek, hipoteka'
export const TRUDNE_DESCRIPTION =
  'Spadek, hipoteka, współwłasność lub licytacja komornicza w Kołobrzegu? Omawiamy możliwe rozwiązania i pomagamy uporządkować sprawę nieruchomości.'

export const TRUDNE_TITLE_SUFFIX_LEN = ' | InvestRent Nieruchomości'.length
