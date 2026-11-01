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
  ai: {
    title: 'Orientacyjna ocena modelu AI',
    body: 'Automatyczna ocena modelu AI. Nie jest ceną transakcyjną ani ofertową.',
  },
  /** Nagłówek i treść zatwierdził Daniel 01.11 (wariant A); wcześniej oznaczone DO AKCEPTACJI — publikacja po scaleniu i decyzji o fladze; widoczne wyłącznie po NEXT_PUBLIC_WYCENA_NOTICE_V4=on. */
  notice: {
    title: 'Wycenimy dokładniej po rozmowie',
    body: 'Kalkulator nie widzi stanu ani standardu Twojej nieruchomości. Zostaw kontakt, a agent powie, ile może być warta, po krótkiej rozmowie.',
    submit: 'Zostaw numer',
    /** Zatwierdzone przez Daniela 01.11 (forma Ty): blok kontaktu, gdy rejestry nie maja danych dla nieruchomosci (karta rynku: nodata). */
    noData: {
      title: 'W rejestrach nie mamy wystarczająco danych dla tej nieruchomości.',
      body: 'To nie przeszkadza: nasz doradca może ją wycenić na podstawie rozmowy. Zostaw numer telefonu, a odezwiemy się.',
    },
    firstName: 'Imię',
    lastName: 'Nazwisko (opcjonalnie)',
    timeLabel: 'Kiedy najwygodniej zadzwonić? (opcjonalnie)',
    timeOptions: [
      { value: '9-12', label: '9–12' },
      { value: '12-15', label: '12–15' },
      { value: '15-18', label: '15–18' },
    ],
    timeNote: (value: string) => `Preferowany przedział rozmowy: ${value} (niewiążący).`,
  },
} as const
