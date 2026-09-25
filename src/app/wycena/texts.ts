// Teksty publiczne kalkulatora wyceny (/wycena) w jednym miejscu.
// STATUS: DO RECENZJI (Krytyk + prawnik dla zgody RODO) - lustro w
// _wspolne_pliki\kalkulator_wyceny_teksty_do_recenzji_krytyka.md.
// Po recenzji zmieniamy tylko ten plik. Brak superlatyw i obietnic.

export const T = {
  metaTitle: 'Wycena mieszkania Kołobrzeg — sprawdź orientacyjną cenę online',
  metaDescription:
    'Ile jest warte moje mieszkanie w Kołobrzegu? Podaj kilka danych i zobacz orientacyjne widełki ceny oraz cenę za m². To szacunek, nie operat rzeczoznawcy. Bez podawania numeru telefonu.',
  h1: 'Wycena mieszkania w Kołobrzegu online',
  intro: 'Ile jest warte Twoje mieszkanie, dom lub działka? Podaj kilka danych, a pokażemy orientacyjne widełki ceny. Nie musisz zostawiać numeru telefonu.',
  disclaimerTop: 'To szacunek orientacyjny, nie operat rzeczoznawcy majątkowego.',

  formTitle: 'Dane nieruchomości',
  requiredNote: 'Pola oznaczone gwiazdką (*) są wymagane. Pozostałe są opcjonalne, ale pomagają zawęzić widełki.',
  fields: {
    property_type: 'Rodzaj nieruchomości',
    property_type_placeholder: 'Wybierz…',
    city: 'Miejscowość',
    city_hint: 'Domyślnie Kołobrzeg. Możesz wpisać inną miejscowość.',
    district: 'Dzielnica lub osiedle (opcjonalnie)',
    district_hint: 'Np. Podczele, Radzikowo, Uzdrowisko.',
    area_m2: 'Powierzchnia (m²)',
    rooms: 'Liczba pokoi (opcjonalnie)',
    floor: 'Piętro (opcjonalnie)',
    floor_hint: 'Parter to 0.',
    condition: 'Stan (opcjonalnie)',
    condition_placeholder: 'Nie wybrano',
  },
  submit: 'Pokaż orientacyjną wycenę',
  submitting: 'Liczymy… (do kilkudziesięciu sekund)',
  formErrorSummary: 'Popraw zaznaczone pola i spróbuj ponownie.',

  result: {
    title: 'Orientacyjne widełki ceny',
    priceLabel: 'Szacowana cena',
    perM2Label: 'Cena za m²',
    comparables: (min: number, max: number) =>
      `Szacunek uwzględnia od ${min} do ${max} porównywalnych nieruchomości z okolicy.`,
    qualityLabel: 'Wiarygodność szacunku',
    disclaimerFallback:
      'Wycena orientacyjna, nie operat rzeczoznawcy. Rzeczywista cena zależy m.in. od stanu technicznego, widoku, standardu wykończenia i sytuacji na rynku.',
    noNumbersTitle: 'Nie podajemy liczby na podstawie tak niewielu danych',
    noNumbersBody:
      'Dla tej nieruchomości mamy za mało porównań, żeby uczciwie podać cenę. Zostaw numer — przygotujemy wycenę indywidualnie.',
    again: 'Wyceń inną nieruchomość',
  },

  lead: {
    titleRange: 'Chcesz dokładniejszy raport z porównaniami i mapą?',
    bodyRange: 'Zostaw numer telefonu — oddzwoni agent, omówi z Tobą wynik i przygotuje szczegółową wycenę. Bez zobowiązań.',
    titleFallback: 'Zostaw numer — przygotujemy wycenę indywidualnie',
    bodyFallback: 'Agent oddzwoni i omówi Twoją nieruchomość. Bez zobowiązań.',
    name: 'Imię (opcjonalnie)',
    phone: 'Numer telefonu',
    phoneHint: 'Np. 731 554 341',
    consent:
      'Wyrażam zgodę na kontakt telefoniczny ze strony Investrent sp. z o.o. (Kołobrzeg, ul. Ratuszowa 12/1 lok. 3) w celu przekazania raportu z wyceny i omówienia sprzedaży lub wynajmu mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili.',
    consentInfoPrefix: 'Informacje o przetwarzaniu danych znajdziesz w ',
    consentInfoLink: 'Polityce prywatności (RODO)',
    consentInfoSuffix: '.',
    submit: 'Poproszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Podaj poprawny numer telefonu (9 cyfr lub w formacie międzynarodowym).',
    errConsent: 'Aby zostawić numer, zaznacz zgodę na kontakt.',
    doneTitle: 'Dziękujemy, przekazaliśmy Twoje dane',
    doneBody: 'Agent skontaktuje się z Tobą telefonicznie w godzinach pracy biura.',
  },

  errors: {
    disabled: (phone: string) =>
      `Kalkulator jest chwilowo niedostępny. Zostaw numer poniżej albo zadzwoń: ${phone}. Wycenimy nieruchomość indywidualnie.`,
    rateLimited: (phone: string, minutes: number | null) =>
      `Wykonano już kilka wycen z tego urządzenia${minutes ? `. Spróbuj ponownie za około ${minutes} min` : '. Spróbuj ponownie później'}. Możesz też zostawić numer poniżej lub zadzwonić: ${phone}.`,
    network: (phone: string) =>
      `Nie udało się połączyć z kalkulatorem. Sprawdź połączenie i spróbuj ponownie, zostaw numer poniżej lub zadzwoń: ${phone}.`,
    server: (phone: string) =>
      `Kalkulator nie odpowiedział poprawnie. Spróbuj ponownie za chwilę, zostaw numer poniżej lub zadzwoń: ${phone}.`,
    invalid: 'Serwer odrzucił część danych. Sprawdź formularz i spróbuj ponownie.',
    leadFail: (phone: string) => `Nie udało się wysłać — spróbuj ponownie lub zadzwoń: ${phone}`,
  },

  how: {
    title: 'Jak liczymy szacunek',
    body: [
      'Porównujemy Twoje dane z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z okolicy. Ceny ofertowe bywają wyższe niż faktycznie zapłacone.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do banku lub sądu).',
      'Wprowadzone dane nieruchomości służą wyłącznie do obliczenia szacunku. Numer telefonu podajesz dopiero po zobaczeniu wyniku i tylko wtedy, gdy chcesz, żeby agent się skontaktował.',
    ],
  },
} as const
