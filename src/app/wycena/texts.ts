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
  intro: 'Ile jest warte Twoje mieszkanie w Kołobrzegu? Podaj kilka danych, a od razu pokażemy orientacyjne widełki ceny i ceny za m². Liczy je sztuczna inteligencja na podstawie danych rynkowych. To szacunek, a nie operat szacunkowy ani wycena rzeczoznawcy. Widełki podajemy dla mieszkań w Kołobrzegu, z wyjątkiem Śródmieścia. W pozostałych przypadkach (dom, działka, inna miejscowość) agent sprawdzi, czy może przygotować wycenę. Numeru telefonu podawać nie musisz.',
  introOff: 'Kalkulator online jest chwilowo niedostępny. Zostaw numer telefonu — agent przygotuje wycenę Twojej nieruchomości indywidualnie i zadzwoni. Bez zobowiązań.',
  callInstead: 'Wolisz, żebyśmy zadzwonili?',
  callInsteadLink: 'Zostaw sam numer',
  disclaimerTop: 'Wynik jest orientacyjny — to nie operat szacunkowy rzeczoznawcy majątkowego.',

  formTitle: 'Dane nieruchomości',
  requiredNote: 'Pola z gwiazdką (*) są wymagane. Dla mieszkania w Kołobrzegu wymagana jest także dzielnica lub osiedle. Pozostałe pola możesz pominąć, ale pomagają zawęzić widełki.',
  fields: {
    property_type: 'Rodzaj nieruchomości',
    property_type_placeholder: 'Wybierz…',
    city: 'Miejscowość',
    city_hint: 'Domyślnie Kołobrzeg. Dla innych miejscowości agent skontaktuje się z Tobą, jeśli wycena będzie możliwa.',
    district: 'Dzielnica lub osiedle',
    district_hint: 'Bez dzielnicy nie policzymy widełek dla mieszkania w Kołobrzegu. Na przykład: Podczele, Radzikowo. Dla Śródmieścia widełek nie podajemy — wycenę przygotuje agent.',
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
    priceLabel: 'Orientacyjny zakres ceny',
    perM2Label: 'Orientacyjna cena za m²',
    comparables: (min: number, max: number) =>
      `Do szacunku wykorzystaliśmy od ${min} do ${max} porównywalnych nieruchomości z okolicy.`,
    scopeNote: 'Orientacyjny zakres liczony przez sztuczną inteligencję na podstawie danych rynkowych (ceny transakcyjne i ofertowe). To nie jest operat szacunkowy ani wycena rzeczoznawcy. Cena, za którą faktycznie sprzedasz mieszkanie, może się od niego wyraźnie różnić.',
    disclaimerFallback:
      'To wycena orientacyjna, a nie operat szacunkowy rzeczoznawcy majątkowego. Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.',
    // Poza zakresem liczb online (dom, działka, inna miejscowość, Śródmieście) - to reguła, nie brak danych.
    outOfScopeTitle: 'Widełek dla tej nieruchomości nie podajemy online',
    outOfScopeBody:
      'Widełki online liczymy tylko dla mieszkań w Kołobrzegu, poza Śródmieściem. Dla domów, działek i Śródmieścia wycenę przygotowuje agent indywidualnie, a dla innych miejscowości agent sprawdzi, czy może pomóc. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na kontakt — zadzwonimy tylko w sprawie Twojej wyceny.',
    // W zakresie, ale silnik nie ma dość porównań.
    noNumbersTitle: 'Nie mamy dość danych, żeby podać widełki',
    noNumbersBody:
      'Dla tej nieruchomości mamy za mało porównywalnych danych rynkowych, żeby rzetelnie wyznaczyć widełki. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na kontakt — agent przygotuje wycenę indywidualnie.',
    again: 'Wyceń inną nieruchomość',
  },

  lead: {
    titleRange: 'Chcesz szczegółową analizę z porównaniami i mapą?',
    bodyRange: 'Zostaw numer telefonu i zaznacz zgodę na kontakt — agent zadzwoni, omówi z Tobą wynik i przygotuje szczegółowy raport. Bez zobowiązań.',
    titleFallback: 'Zostaw numer, a przygotujemy wycenę indywidualnie',
    bodyFallback: 'Agent zadzwoni i omówi z Tobą Twoją nieruchomość. Bez zobowiązań.',
    name: 'Imię (opcjonalnie)',
    phone: 'Numer telefonu',
    phoneHint: 'Na przykład: 600 100 200',
    // Teksty zgód i klauzuli = wersja CONSENT_VERSION (lib/valuation.ts). Zmiana JAKIEGOKOLWIEK z tych tekstów = nowy numer wersji.
    // Zatwierdzenie treści: Krytyk + przegląd AI (kancelaria nieangażowana wg decyzji Daniela 25.09; ryzyko przyjęte świadomie).
    // Dwa OSOBNE pola, oba NIEZAZNACZONE domyślnie: (1) wymagana do oddzwonienia, (2) dobrowolna (marketing tel./SMS), nie warunkuje wyniku.
    consentCallRequired: '(wymagana, jeśli podajesz numer telefonu)',
    consentCall:
      'Zgadzam się, aby Investrent sp. z o.o. zadzwoniła do mnie pod podany numer wyłącznie w sprawie wyceny mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl.',
    consentMarketingOptional: '(dobrowolna)',
    consentMarketing:
      'Chcę otrzymywać od Investrent sp. z o.o. informacje o ofertach i usługach telefonicznie i SMS-em. Nie wpływa to na wynik wyceny ani na oddzwonienie w jej sprawie. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl.',
    // Klauzula informacyjna (art. 13 RODO): pełne dane administratora wg odpisu KRS (api-krs.ms.gov.pl, 25.09.2026).
    consentInfo: [
      { h: 'Kto jest administratorem Twoich danych.', t: 'Administratorem jest Investrent spółka z ograniczoną odpowiedzialnością (Investrent sp. z o.o.), ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, KRS 0001069797, NIP 671 185 85 59. Kontakt: biuro@investrent.com.pl.' },
      { h: 'Po co i na jakiej podstawie.', t: 'Dane nieruchomości z formularza wykorzystujemy do obliczenia szacunku. Jeśli podasz numer telefonu i zaznaczysz pierwszą zgodę, zadzwonimy w sprawie wyceny (podstawa: Twoja zgoda, art. 6 ust. 1 lit. a RODO). Jeśli zaznaczysz drugą, dobrowolną zgodę, będziemy przekazywać Ci informacje o ofertach i usługach telefonicznie i SMS-em (podstawa: Twoja zgoda). Dowód udzielonych zgód przechowujemy, aby wykazać ich udzielenie i bronić się przed roszczeniami (art. 6 ust. 1 lit. f oraz art. 7 ust. 1 RODO). Dla bezpieczeństwa i ograniczenia liczby zapytań krótkotrwale przetwarzamy adres IP (art. 6 ust. 1 lit. f RODO).' },
      { h: 'Sztuczna inteligencja.', t: 'Szacunek jest liczony automatycznie przez sztuczną inteligencję na podstawie danych rynkowych. Do dostawcy AI przekazujemy wyłącznie dane nieruchomości, bez Twoich danych kontaktowych. Wynik nie jest decyzją wiążącą i nie jest operatem szacunkowym.' },
      { h: 'Komu przekazujemy dane.', t: 'Dostawcom usług IT: hostingu i bazy danych (Vercel, Railway, Supabase), dostawcy usługi AI (Anthropic) oraz dostawcy ochrony formularza (Cloudflare Turnstile). Część z nich ma siedzibę w USA; przekazanie opiera się na Data Privacy Framework lub standardowych klauzulach umownych.' },
      { h: 'Jak długo.', t: 'Zapytania i dane kontaktowe przechowujemy do 12 miesięcy od ostatniego kontaktu z Tobą (wiadomości lub rozmowy w sprawie wyceny). Dowód zgód przechowujemy 3 lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie. Dane z rozmów prowadzących do umowy przechowujemy tak długo, jak wymagają tego przepisy.' },
      { h: 'Twoje prawa.', t: 'Możesz żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, możesz też wnieść sprzeciw oraz w każdej chwili cofnąć zgodę (cofnięcie nie wpływa na zgodność z prawem tego, co zrobiliśmy wcześniej). Napisz na biuro@investrent.com.pl. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Podanie danych jest dobrowolne; bez numeru telefonu pokażemy wynik, ale nie oddzwonimy.' },
    ],
    consentInfoMore: 'Szczegóły znajdziesz w ',
    consentInfoLink: 'polityce prywatności (RODO)',
    consentInfoSuffix: '.',
    optionalLabel: '(opcjonalnie)',
    submit: 'Proszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Wpisz numer telefonu: 9 cyfr albo z kierunkowym kraju, np. +48 600 100 200.',
    errConsent: 'Zaznacz zgodę na telefon w sprawie wyceny — bez niej nie możemy do Ciebie zadzwonić. Druga zgoda jest opcjonalna.',
    doneTitle: 'Dziękujemy, otrzymaliśmy Twój numer',
    doneBody: 'Agent zadzwoni do Ciebie w godzinach pracy biura.',
  },

  // Komunikaty konczace sie na "zadzwon:" - numer biura dopisuje komponent jako link tel:.
  errors: {
    disabled: 'Kalkulator jest chwilowo niedostępny. Możemy przygotować wycenę indywidualnie — zostaw numer poniżej lub zadzwoń:',
    rateLimited: 'Wykonano już kilka wycen w krótkim czasie. Spróbuj ponownie za około godzinę. Możesz też zostawić numer poniżej lub zadzwonić:',
    network: 'Nie udało się połączyć z kalkulatorem. Spróbuj ponownie za chwilę, a jeśli problem się powtórzy, sprawdź połączenie z internetem. Możesz też zostawić numer poniżej lub zadzwonić:',
    server: 'Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę. Możesz też zostawić numer poniżej lub zadzwonić:',
    turnstilePending: 'Weryfikacja antyspamowa jeszcze się ładuje. Poczekaj chwilę i spróbuj ponownie.',
    invalid: 'Nie udało się przetworzyć części danych. Sprawdź wartości w formularzu i spróbuj ponownie. Jeśli to nie pomoże, zadzwoń:',
    // Zbyt szybkie wysłanie formularza (próg czasowy) - neutralny komunikat, bez ujawniania mechanizmu.
    tryAgain: 'Nie udało się wysłać zapytania. Spróbuj ponownie za chwilę.',
    leadFail: 'Nie udało się wysłać numeru. Spróbuj ponownie lub zadzwoń:',
  },

  how: {
    title: 'Jak liczymy szacunek',
    body: [
      'Porównujemy dane Twojej nieruchomości z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z okolicy. Szacunek wylicza automatycznie system (z pomocą AI), bez oględzin. Ceny ofertowe bywają wyższe od faktycznie zapłaconych.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do kredytu, sądu lub urzędu).',
      // PRAWNIK: przed włączeniem — akapit zgodny ze stanem faktycznym (dane trafiają do CRM po zostawieniu numeru; IP dla limitów i Turnstile).
      'Dane nieruchomości wpisane do kalkulatora przekazujemy do obliczenia szacunku dostawcy AI (bez Twoich danych kontaktowych). Dla ochrony przed nadużyciami i limitów zapytań krótko przechowujemy adres IP, a formularz chroni Cloudflare Turnstile. Numer telefonu podajesz tylko wtedy, gdy chcesz, żeby zadzwonił do Ciebie agent — wtedy zapisujemy w naszym systemie CRM Twoje imię, numer, dane nieruchomości i wynik szacunku oraz datę, treść i wersję udzielonych zgód. Zapytania z kalkulatora i dane kontaktowe przechowujemy do 12 miesięcy od ostatniego kontaktu z Tobą, a dowód zgód przez 3 lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie. Zgodę możesz cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl. Szczegóły: polityka prywatności (RODO).',
    ],
  },
} as const
