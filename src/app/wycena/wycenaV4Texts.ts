// Teksty UI kalkulatora v4. Osobny moduł pozwala zachować bieżące copy przy fladze OFF.
export const WYCENA_V4_TEXTS = {
  transactions: {
    title: 'Ceny transakcyjne',
    source: 'Rejestr cen transakcyjnych',
    unit: 'transakcji',
    middle: 'Środkowe 50% transakcji',
    empty: 'Za mało danych o cenach transakcyjnych dla tego segmentu.',
    smallSample: (count: number) => `Mała próba: ${count} transakcji. Przedział ma charakter orientacyjny.`,
  },
  offers: {
    title: 'Ceny ofertowe',
    source: 'Ogłoszenia z portali',
    unit: 'ofert',
    middle: 'Środkowe 50% ofert',
    empty: 'Za mało danych o cenach ofertowych dla tego segmentu.',
    smallSample: (count: number) => `Mała próba: ${count} ofert. Przedział ma charakter orientacyjny.`,
  },
  amountFor: (areaM2: number) => `dla ${areaM2} m²`,
  separateValues: 'To dwie różne wartości, nie uśredniamy ich.',
  noForecasts: 'Nie podajemy prognoz cen.',
  offersDisclaimer: 'To ceny, o jakie proszą sprzedający, nie ceny sprzedaży.',
  cityFallback: 'Gdy w dzielnicy jest za mało danych, pokazujemy ceny z całego miasta.',
  noData: 'Nie mamy wystarczających danych dla tego segmentu. Spróbuj zmienić stan mieszkania.',
  loading: 'Ładowanie danych rynkowych…',
} as const
