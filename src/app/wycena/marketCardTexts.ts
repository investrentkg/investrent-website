// Teksty karty rynku i bloku "dokladniejszy wynik" (flaga NEXT_PUBLIC_WYCENA_MARKET_CARD).
// WERSJE FINALNE zatwierdzone przez Daniela 18.10.2026 (_wspolne_pliki\Kalkulator_karta_rynku_teksty_do_akceptacji_2026_10_18.md). NIE ZMIENIAC BEZ NOWEJ AKCEPTACJI.
// Zasady: forma bezposrednia ("Ty"), neutralnie i krotko; bez obietnic terminu oddzwonienia i liczb/wynikow, bez twierdzen o trendzie rynku.
// TRESC ZGODY NIE JEST TUTAJ: jedno miejsce to src/lib/wycenaConsentText.ts.

/** Polska odmiana: 1 oferta, 2-4 oferty (poza 12-14), pozostale ofert. */
export function offerWord(n: number): string {
  const m10 = n % 10
  const m100 = n % 100
  if (n === 1) return 'oferta'
  return m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14) ? 'oferty' : 'ofert'
}

export const MARKET_CARD_TEXTS = {
  blockTitle: 'Dokładniejszy wynik',
  blockIntro: 'Poniżej widzisz ceny ofert i ceny transakcyjne w okolicy. Agent może na tej podstawie doprecyzować szacunek.',
  offersTitle: 'Ceny ofert w okolicy',
  offersCount: (n: number) => `Liczba ofert (bez duplikatów): ${n}`,
  offersMedian: 'Mediana ceny za m² (wartość środkowa)',
  offersRange: 'Przedział, w którym mieści się środkowe 50% ofert',
  transactionsTitle: 'Ceny transakcyjne w okolicy',
  transactionsAsOf: (mmrrrr: string) => `dane na ${mmrrrr}`,
  transactionsCount: (n: number) => `Liczba transakcji: ${n}`,
  transactionsMedian: 'Mediana ceny za m² (wartość środkowa)',
  transactionsRange: 'Przedział, w którym mieści się środkowe 50% transakcji',
  transactionsNote: 'Dane obejmują mieszkania w każdym stanie, rejestr nie podaje stanu lokalu.',
  separateNote: 'Ceny ofert i ceny transakcyjne pokazujemy osobno: to różne dane i nie wyliczamy z nich jednej ceny.',
  noData: 'Nie mamy wystarczających danych rynkowych dla tej nieruchomości, żeby pokazać ceny ofert i ceny transakcyjne.',
  noOffers: 'Nie mamy wystarczających danych o cenach ofert dla tego segmentu.',
  noTransactions: 'Nie mamy wystarczających danych o cenach transakcyjnych dla tego segmentu.',
  conditionLabel: 'Stan mieszkania (filtruje tylko ceny ofert)',
  conditionAll: 'Wszystkie',
  smallSample: (n: number) => `Mała próba: w wybranym stanie jest ${n} ${offerWord(n)} (poniżej 8). Wynik jest orientacyjny.`,
  conditionCounts: (n: number, all: number | undefined) => (all != null ? `Ofert w wybranym stanie: ${n} (wszystkich: ${all}).` : `Ofert w wybranym stanie: ${n}.`),
  loading: 'Ładowanie danych rynkowych…',
  place: { ulica: 'Twoja ulica', dzielnica: (p: string | null) => (p ? `dzielnica ${p}` : 'Twoja dzielnica'), miasto: (p: string | null) => (p ? `miasto ${p}` : 'miasto') },
  contactIntro: 'Chcesz omówić wynik z agentem? Podaj numer telefonu i wybierz porę kontaktu.',
  windowLabel: 'Preferowana pora kontaktu',
  windowNone: 'Bez preferencji',
  submit: 'Poproś o kontakt',
  errConsent: 'Zaznacz zgodę, żeby wysłać numer.',
} as const
