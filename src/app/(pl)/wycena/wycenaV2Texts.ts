// Teksty ekranu wyniku wynik_v2 (flaga NEXT_PUBLIC_WYCENA_RESULT_V2). Zrodlo: makieta 3 (zaakceptowana przez Daniela 09.11.2026) i opinia Prawnika 09.11 (zielone swiatlo za flagami OFF).
// Zasady: forma Ty; NIE podajemy nazwy dostawcy danych ani skrotu RCN (decyzja Daniela 09.11), tylko "rejestr cen nieruchomosci"; oferty i sprzedaz NIE sa laczone ani usredniane.
// Prawnik: "bez uwzglednienia stanu" MUSI zostac w opisie kazdego przedzialu; zastrzezenie (poz. 20) na stale w ukladzie, takze gdy nie ma zadnej liczby.
const fmt = (n: number) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(n)
const range = (low: number, high: number) => `${fmt(low)} – ${fmt(high)} zł`

export const WYCENA_V2_TEXTS = {
  heading: (areaM2: number) => `Orientacyjne ceny · mieszkanie ${areaM2} m²`,
  offers: {
    title: 'Ceny ofert z ogłoszeń',
    desc: (areaM2: number, condition: boolean) =>
      `Tyle właściciele proszą za podobne mieszkania o metrażu ${areaM2} m² (środkowe ok. 50% ogłoszeń).${condition ? '' : ' Orientacyjnie, bez uwzględnienia stanu.'}`,
    meta: (n: number, date: string | null) => `Porównanie: ${n} ${n === 1 ? 'ogłoszenie' : (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? 'ogłoszenia' : 'ogłoszeń')} · dane z portali${date ? `, stan na ${date}` : ''}`,
    empty: 'Za mało danych o cenach ofert dla tego segmentu.',
    amount: range,
  },
  sold: {
    title: 'Ceny sprzedanych mieszkań',
    desc: (areaM2: number) =>
      `Tyle kupujący faktycznie zapłacili za podobne mieszkania o metrażu ${areaM2} m² (środkowe ok. 50% transakcji). Orientacyjnie, bez uwzględnienia stanu.`,
    meta: (n: number, asOf: string) => `Porównanie: ${n} ${n === 1 ? 'transakcja' : (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? 'transakcje' : 'transakcji')} · rejestr cen nieruchomości, najnowsze dane: ${asOf}`,
    emptyTitle: 'Za mało danych',
    emptyBody: 'Dla takich parametrów mamy w rejestrze mniej niż 8 podobnych transakcji, więc nie pokazujemy przedziału, żeby nie wprowadzać w błąd.',
    amount: range,
  },
  diff: {
    title: 'Czym się różnią?',
    body: 'Oferta to cena, o którą ktoś prosi w ogłoszeniu. Sprzedaż to cena, którą strony faktycznie uzgodniły u notariusza. Sprzedane obejmują też starsze mieszkania i słabsze stany, dlatego zwykle wychodzą niżej niż oferty. Liczymy je osobno i nie uśredniamy.',
    more: 'Skąd ta różnica',
    moreBody: 'Ogłoszenia obejmują też nowe i lepiej wykończone mieszkania, a rejestr także starsze i słabsze. Dane rejestru pojawiają się z opóźnieniem po akcie notarialnym. W rejestrze są też nietypowe transakcje (np. sprzedaż w rodzinie po cenie symbolicznej lub zamiana), których nie odfiltrowujemy w pełni.',
  },
  /** Poz. 20 paczki Prawnika (OK 09.11): na stale w ukladzie, rowniez gdy nie ma zadnej liczby. */
  disclaimer: 'Przedziały liczymy automatycznie na podstawie cen ofertowych z ogłoszeń oraz rejestru cen nieruchomości. To nie jest operat rzeczoznawcy ani oferta ceny.',
  disclaimerLink: 'Dlaczego cena sprzedaży może być inna',
  loading: 'Ładowanie danych rynkowych…',
  /** Opinia Prawnika 09.11 (poz. 4) i decyzja Daniela 10.11: link do pelnej klauzuli widoczny i klikalny PRZED zaznaczeniem zgody; nowy tag wersji, bo zmienia sie to, co uzytkownik WIDZI w chwili zgody (tresc zgody bez zmian). CRM: dopisac te wersje do CALCULATOR_CONSENT_VERSIONS (jesli ustawiona) PRZED wlaczeniem flagi. */
  consentVersion: 'wycena-2026-11-10-v1',
  consentLinkIntro: 'Zanim zaznaczysz zgodę:',
  consentLinkLabel: 'pełna informacja o danych',
} as const
