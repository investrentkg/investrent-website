// Teksty UI kalkulatora v4. Osobny moduł pozwala zachować bieżące copy przy fladze OFF.
const fmtAmount = (n: number) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(n)
function amountLabelText(low: number, high: number, areaM2: number, basis: 'transakcji' | 'ofert'): string {
  return `${fmtAmount(low)} – ${fmtAmount(high)} zł za podobne mieszkania o metrażu ${areaM2} m² (środkowe 50% ${basis}) — orientacyjnie, bez uwzględnienia stanu.`
}

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
  /** Poz. 8 opinii Prawnika 30.10 (zaakceptowane przez Daniela): kwota, słowo „podobne" i metraż w jednym zdaniu. */
  amountLabel: {
    transactions: (low: number, high: number, areaM2: number) => amountLabelText(low, high, areaM2, 'transakcji'),
    offers: (low: number, high: number, areaM2: number) => amountLabelText(low, high, areaM2, 'ofert'),
  },
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
  /** DO AKCEPTACJI PRAWNIK/DANIEL — nie publikować; widoczne wyłącznie po NEXT_PUBLIC_WYCENA_NOTICE_V4=on. */
  notice: {
    title: 'Nie widzimy Twojej nieruchomości',
    body: 'Zostaw numer, jeśli chcesz porozmawiać o swojej nieruchomości. Oddzwonimy.',
    submit: 'Zostaw numer',
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
