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
    // PRAWNIK: przed włączeniem — wersja v1 do zatwierdzenia przez kancelarię (plik de_zgody_per_kanal...pkt 2).
    // Dwa OSOBNE pola: (1) obowiązkowe — telefon w sprawie wyceny, (2) opcjonalne, niezaznaczone — marketing tel./SMS (art. 398 PKE).
    consentCall:
      'Zgadzam się, aby Investrent sp. z o.o. z siedzibą w Kołobrzegu, ul. Ratuszowa\u00A012/1\u00A0lok.\u00A03, 78-100 Kołobrzeg, zadzwoniła do mnie pod podany numer telefonu w sprawie wyceny mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub dzwoniąc pod +48\u00A0731\u00A0554\u00A0341; cofnięcie nie wpływa na zgodność z prawem kontaktu sprzed jego cofnięcia.',
    consentMarketing:
      'Wyrażam zgodę na kontakt telefoniczny i SMS w celu przedstawienia mi oferty pośrednictwa w sprzedaży lub wynajmie mojej nieruchomości oraz innych ofert Investrent sp. z o.o. (marketing bezpośredni, art.\u00A0398 Prawa komunikacji elektronicznej). Zgoda jest dobrowolna, niezaznaczona domyślnie i niewymagana do skorzystania z kalkulatora ani do oddzwonienia w sprawie wyceny. Mogę ją cofnąć w każdej chwili w sposób podany wyżej.',
    optionalLabel: '(opcjonalnie)',
    // PRAWNIK: przed włączeniem — klauzula informacyjna; KRS/NIP zweryfikowane w api-krs.ms.gov.pl 25.09.2026; okresy 12 mies./3 lata wg decyzji Daniela i /rodo — do zatwierdzenia przez prawnika.
    consentInfoPrefix:
      'Administratorem Twoich danych (numer telefonu, imię, dane nieruchomości i wynik szacunku) jest Investrent sp. z o.o. z siedzibą w Kołobrzegu, ul. Ratuszowa\u00A012/1\u00A0lok.\u00A03, 78-100 Kołobrzeg (KRS 0001069797, NIP 671 185 85 59), e-mail: biuro@investrent.com.pl. Dane przetwarzamy: (1) aby zadzwonić w sprawie wyceny na Twoje żądanie (art.\u00A06 ust.\u00A01 lit.\u00A0b RODO), (2) w celach marketingowych tylko po zaznaczeniu zgody opcjonalnej (art.\u00A06 ust.\u00A01 lit.\u00A0a RODO), (3) dla bezpieczeństwa i limitów zapytań, w tym adres IP (art.\u00A06 ust.\u00A01 lit.\u00A0f RODO). Zapytania z kalkulatora i dane kontaktowe przechowujemy nie dłużej niż 12 miesięcy od ostatniego kontaktu, a dowód udzielonych zgód – 3 lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie; dane z rozmów prowadzących do umowy tak długo, jak wymagają tego przepisy. Odbiorcy: dostawcy hostingu i CRM (Vercel, Railway, Supabase), dostawca AI, który otrzymuje wyłącznie dane nieruchomości bez danych kontaktowych (Anthropic), oraz ochrona formularza (Cloudflare Turnstile); część z nich w USA na podstawie DPF lub standardowych klauzul umownych. Masz prawo dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu (w tym w każdej chwili wobec marketingu bezpośredniego) oraz skargi do Prezesa UODO. Z praw możesz skorzystać, pisząc na biuro@investrent.com.pl. Podanie danych jest dobrowolne, ale niezbędne do zadzwonienia w sprawie wyceny. Szczegóły znajdziesz w ',
    consentInfoLink: 'polityce prywatności (RODO)',
    consentInfoSuffix: '.',
    submit: 'Proszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Wpisz numer telefonu: 9 cyfr albo z kierunkowym kraju, np. +48 600 100 200.',
    errConsent: 'Zaznacz zgodę na telefon w sprawie wyceny – bez niej nie możemy do Ciebie zadzwonić. Druga zgoda jest opcjonalna.',
    doneTitle: 'Dziękujemy, otrzymaliśmy Twój numer',
    doneBody: 'Agent zadzwoni do Ciebie w godzinach pracy biura.',
  },

  // Komunikaty konczace sie na "zadzwon:" - numer biura dopisuje komponent jako link tel:.
  errors: {
    disabled: 'Kalkulator jest chwilowo niedostępny. Możemy wycenić nieruchomość indywidualnie – zostaw numer poniżej lub zadzwoń:',
    rateLimited: 'Wykonano już kilka wycen w krótkim czasie. Spróbuj ponownie za około godzinę. Możesz też zostawić numer poniżej lub zadzwonić:',
    network: 'Nie udało się połączyć z kalkulatorem. Spróbuj ponownie za chwilę, a jeśli problem się powtórzy, sprawdź połączenie z internetem. Możesz też zostawić numer poniżej lub zadzwonić:',
    server: 'Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę. Możesz też zostawić numer poniżej lub zadzwonić:',
    turnstilePending: 'Weryfikacja antyspamowa jeszcze się ładuje. Poczekaj chwilę i spróbuj ponownie.',
    invalid: 'Nie udało się przetworzyć części danych. Sprawdź wartości w formularzu i spróbuj ponownie. Jeśli to nie pomoże, zadzwoń:',
    leadFail: 'Nie udało się wysłać numeru. Spróbuj ponownie lub zadzwoń:',
  },

  how: {
    title: 'Jak liczymy szacunek',
    body: [
      'Porównujemy dane Twojej nieruchomości z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z okolicy. Szacunek wylicza automatycznie system (z pomocą AI), bez oględzin. Ceny ofertowe bywają wyższe od faktycznie zapłaconych.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do kredytu, sądu lub urzędu).',
      // PRAWNIK: przed włączeniem — akapit zgodny ze stanem faktycznym (dane trafiają do CRM po zostawieniu numeru; IP dla limitów i Turnstile).
      'Dane nieruchomości wpisane do kalkulatora przekazujemy do obliczenia szacunku dostawcy AI (bez Twoich danych kontaktowych). Dla ochrony przed nadużyciami i limitów zapytań krótko przechowujemy adres IP, a formularz chroni Cloudflare Turnstile. Numer telefonu podajesz tylko wtedy, gdy chcesz, żeby zadzwonił do Ciebie agent – wtedy zapisujemy w naszym systemie CRM Twoje imię, numer, dane nieruchomości i wynik szacunku oraz datę, treść i wersję udzielonych zgód. Zapytania z kalkulatora i dane kontaktowe przechowujemy nie dłużej niż 12 miesięcy od ostatniego kontaktu, a dowód zgód 3 lata. Prawa dotyczące danych (w tym cofnięcie zgody) zrealizujemy po wiadomości na biuro@investrent.com.pl. Szczegóły: polityka prywatności (RODO).',
    ],
  },
} as const
