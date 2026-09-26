// Slowniki lokalizacji dla kalkulatora wyceny (v11.2, 26.09.2026): pola miejscowosc i dzielnica NIE sa wolnym tekstem.
// Powod (recenzja Krytyka): wolny tekst trafia do promptu AI i do statystyki zostajacej po 12 mies.; wpisane imie/adres
// moglyby przeniesc dane osobowe wbrew klauzuli. Wartosc spoza slownika = "Inna lokalizacja" / "Inna dzielnica".
//
// Zrodlo miejscowosci: backend/src/lib/localities.ts (WESTERN_POMERANIA_LOCALITIES, origin/main 26.09.2026), bez duplikatow.
// Zrodlo dzielnic: dzielnice/osiedla Kolobrzegu wystepujace w ogloszeniach (portal_listings_archive, odczyt 26.09.2026) i uzywane
// w backtescie; LISTA DO UZUPELNIENIA PRZEZ BIURO (nie jest wyczerpujaca; brak na liscie = "Inna dzielnica").

export const OTHER_CITY = 'Inna lokalizacja'
export const OTHER_DISTRICT = 'Inna dzielnica'

export const CITY_LIST: string[] = [
  'Kołobrzeg',
  'Szczecin', 'Koszalin', 'Świnoujście', 'Stargard', 'Police', 'Goleniów', 'Gryfice', 'Białogard',
  'Darłowo', 'Wałcz', 'Szczecinek', 'Choszczno', 'Myślibórz', 'Pyrzyce', 'Barlinek', 'Gryfino', 'Nowogard',
  'Trzebiatów', 'Międzyzdroje', 'Wolin', 'Kamień Pomorski', 'Dziwnów', 'Świdwin', 'Połczyn-Zdrój', 'Drawsko Pomorskie',
  'Złocieniec', 'Czaplinek', 'Łobez', 'Resko', 'Chojna', 'Dębno', 'Sławno', 'Sianów', 'Mielno', 'Karlino',
  'Ustronie Morskie', 'Sarbinowo', 'Dźwirzyno', 'Grzybowo', 'Zieleniewo', 'Podczele', 'Bogucino', 'Budzistowo',
  'Rewal', 'Pobierowo', 'Niechorze', 'Pogorzelica', 'Mrzeżyno', 'Łukęcin', 'Międzywodzie', 'Unieście',
  'Darłówko', 'Jarosławiec', 'Ustka', 'Dąbki', 'Kołczewo', 'Rusinowo', 'Mielenko', 'Kukinia',
  'Kobylanka', 'Bezrzecze', 'Mierzyn', 'Skolwin', 'Dobra Szczecińska', 'Kołbaskowo',
]

export const KOLOBRZEG_DISTRICTS: string[] = [
  'Śródmieście', 'Centrum', 'Stare Miasto', 'Podczele', 'Radzikowo', 'Zachodnia', 'Dzielnica Uzdrowiskowa',
]

export const fold = (t: string): string =>
  t.trim().toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').split(/\s+/).join(' ')

function canonical(list: string[], extra: string, value: string): string | null {
  const f = fold(value)
  if (!f) return null
  if (f === fold(extra)) return extra
  return list.find(x => fold(x) === f) ?? null
}
/** Nazwa z diakrytykami ze slownika albo OTHER_CITY; null = spoza slownika. */
export const canonicalCity = (v: string): string | null => canonical(CITY_LIST, OTHER_CITY, v)
/** Nazwa dzielnicy ze slownika albo OTHER_DISTRICT; null = spoza slownika. */
export const canonicalDistrict = (v: string): string | null => canonical(KOLOBRZEG_DISTRICTS, OTHER_DISTRICT, v)
