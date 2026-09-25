// Teksty publiczne kalkulatora wyceny (/wycena) w jednym miejscu.
// STATUS: po recenzji Krytyka (25.09.2026), zrodlo:
// _wspolne_pliki\kalkulator_wyceny_teksty_po_recenzji_krytyka.md.
// Elementy oznaczone "PRAWNIK: przed wlaczeniem" sa wersja ROBOCZA - blokuja wydanie
// do zatwierdzenia przez prawnika (patrz lista blokerow w opisie PR #21).
// Brak superlatyw i obietnic. Twarde spacje ( ) w liczbach i numerze telefonu.

export const T = {
  // title bez doklejania marki: page.tsx uzywa title.absolute (layout ma szablon '%s | InvestRent Nieruchomości')
  metaTitle: 'Darmowa wycena mieszkania Kołobrzeg – orientacyjna cena',
  metaDescription:
    'Ile jest warte mieszkanie w Kołobrzegu? Podaj kilka danych i bezpłatnie sprawdź orientacyjne widełki ceny oraz cenę za m². Bez podawania numeru telefonu.',
  metaDescriptionOff:
    'Wycena mieszkania w Kołobrzegu: zostaw numer telefonu, a agent InvestRent przygotuje wycenę indywidualnie i zadzwoni. Bez zobowiązań.',
  h1: 'Bezpłatna wycena mieszkania w Kołobrzegu online',
  h1Off: 'Wycena mieszkania w Kołobrzegu — przygotuje ją agent',
  intro: 'Ile jest warte Twoje mieszkanie w Kołobrzegu? Podaj kilka danych, a pokażemy orientacyjne widełki ceny. Możesz też sprawdzić dom lub działkę. Nie musisz podawać numeru telefonu.',
  introOff: 'Kalkulator online jest chwilowo niedostępny. Zostaw numer telefonu — agent przygotuje wycenę Twojej nieruchomości indywidualnie i zadzwoni. Bez zobowiązań.',
  callInstead: 'Wolisz, żebyśmy zadzwonili?',
  callInsteadLink: 'Zostaw sam numer',
  disclaimerTop: 'Wynik jest orientacyjny – to nie operat szacunkowy rzeczoznawcy majątkowego.',

  formTitle: 'Dane nieruchomości',
  requiredNote: 'Pola z gwiazdką (*) są wymagane. Pozostałe możesz pominąć, ale pomagają zawęzić widełki.',
  fields: {
    property_type: 'Rodzaj nieruchomości',
    property_type_placeholder: 'Wybierz…',
    city: 'Miejscowość',
    city_hint: 'Domyślnie Kołobrzeg. Możesz wpisać inną miejscowość.',
    district: 'Dzielnica lub osiedle (opcjonalnie)',
    district_hint: 'Np. Podczele, Radzikowo, dzielnica uzdrowiskowa.',
    area_m2: 'Powierzchnia (m²)',
    rooms: 'Liczba pokoi (opcjonalnie)',
    floor: 'Piętro (opcjonalnie)',
    floor_hint: 'Parter to 0, suterena to -1.',
    condition: 'Stan nieruchomości (opcjonalnie)',
    condition_placeholder: 'Nie wybrano',
  },
  submit: 'Pokaż orientacyjną wycenę',
  submitting: 'Liczymy szacunek… To może potrwać do minuty.',
  formErrorSummary: 'Uzupełnij lub popraw zaznaczone pola.',

  result: {
    title: 'Orientacyjne widełki ceny',
    priceLabel: 'Szacowana cena',
    perM2Label: 'Cena za m²',
    comparables: (min: number, max: number) =>
      `Do szacunku wykorzystaliśmy od ${min} do ${max} porównywalnych nieruchomości z okolicy.`,
    qualityLabel: 'Pewność szacunku',
    disclaimerFallback:
      'To wycena orientacyjna, a nie operat szacunkowy rzeczoznawcy majątkowego. Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.',
    noNumbersTitle: 'Za mało danych, żeby podać widełki ceny',
    noNumbersBody:
      'W okolicy tej nieruchomości mamy za mało porównywalnych ofert i transakcji, żeby rzetelnie wyznaczyć widełki. Jeśli chcesz, zostaw numer telefonu – agent przygotuje wycenę indywidualnie.',
    again: 'Wyceń inną nieruchomość',
  },

  lead: {
    titleRange: 'Chcesz szczegółową analizę z porównaniami i mapą?',
    bodyRange: 'Zostaw numer telefonu – agent zadzwoni, omówi z Tobą wynik i przygotuje szczegółowy raport. Bez zobowiązań.',
    titleFallback: 'Zostaw numer, a przygotujemy wycenę indywidualnie',
    bodyFallback: 'Agent zadzwoni i omówi z Tobą Twoją nieruchomość. Bez zobowiązań.',
    name: 'Imię (opcjonalnie)',
    phone: 'Numer telefonu',
    phoneHint: 'Np. 600 100 200',
    // PRAWNIK: przed włączeniem — wersja robocza Krytyka; do uzupełnienia: adres z KRS + kod pocztowy,
    // e-mail do cofania zgody, decyzja: jedna zgoda czy dwa pola (art. 398 PKE).
    consent:
      'Wyrażam zgodę na kontakt telefoniczny ze strony Investrent sp. z o.o. z siedzibą w Kołobrzegu, [adres z KRS, kod pocztowy], w sprawie wyceny mojej nieruchomości, w tym na przedstawienie oferty pośrednictwa w jej sprzedaży lub wynajmie. Zgodę mogę w każdej chwili cofnąć, pisząc na [e-mail biura] lub dzwoniąc pod +48 731 554 341. Cofnięcie zgody nie wpływa na zgodność z prawem kontaktu sprzed jej cofnięcia.',
    // PRAWNIK: przed włączeniem — dane administratora, okres przechowywania, odbiorcy (hosting/CRM, Cloudflare Turnstile).
    consentInfoPrefix:
      'Administratorem Twoich danych (numer telefonu, imię, dane nieruchomości i wynik szacunku) jest Investrent sp. z o.o., [adres]. Przetwarzamy je, aby skontaktować się z Tobą w sprawie wyceny, przez [okres – do ustalenia]. Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia skargi do Prezesa UODO. Więcej informacji znajdziesz w ',
    consentInfoLink: 'polityce prywatności',
    consentInfoSuffix: '.',
    submit: 'Proszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Wpisz numer telefonu: 9 cyfr albo z kierunkowym kraju, np. +48 600 100 200.',
    errConsent: 'Zaznacz zgodę na kontakt telefoniczny – bez niej nie możemy do Ciebie zadzwonić.',
    doneTitle: 'Dziękujemy, otrzymaliśmy Twój numer',
    doneBody: 'Agent zadzwoni do Ciebie w godzinach pracy biura.',
  },

  // Komunikaty konczace sie na "zadzwon:" - numer biura dopisuje komponent jako link tel:.
  errors: {
    disabled: 'Kalkulator jest chwilowo niedostępny. Możemy wycenić nieruchomość indywidualnie – zostaw numer poniżej lub zadzwoń:',
    rateLimited: 'Wykonano już kilka wycen w krótkim czasie. Spróbuj ponownie za około godzinę. Możesz też zostawić numer poniżej lub zadzwonić:',
    network: 'Nie udało się połączyć z kalkulatorem. Spróbuj ponownie za chwilę, a jeśli problem się powtórzy, sprawdź połączenie z internetem. Możesz też zostawić numer poniżej lub zadzwonić:',
    server: 'Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę. Możesz też zostawić numer poniżej lub zadzwonić:',
    invalid: 'Nie udało się przetworzyć części danych. Sprawdź wartości w formularzu i spróbuj ponownie. Jeśli to nie pomoże, zadzwoń:',
    leadFail: 'Nie udało się wysłać numeru. Spróbuj ponownie lub zadzwoń:',
  },

  how: {
    title: 'Jak liczymy szacunek',
    body: [
      'Porównujemy dane Twojej nieruchomości z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z okolicy. Szacunek wylicza automatycznie system (z pomocą AI), bez oględzin. Ceny ofertowe bywają wyższe od faktycznie zapłaconych.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do kredytu, sądu lub urzędu).',
      // PRAWNIK: przed włączeniem — akapit o przetwarzaniu danych (poprzednie "wyłącznie" było nieprawdziwe).
      'Dane nieruchomości wpisane do kalkulatora służą do obliczenia szacunku. Numer telefonu podajesz tylko wtedy, gdy chcesz, żeby zadzwonił do Ciebie agent – wtedy przekażemy mu też dane nieruchomości i wynik szacunku.',
    ],
  },
} as const
