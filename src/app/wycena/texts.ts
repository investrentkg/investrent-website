// Teksty publiczne kalkulatora wyceny (/wycena) w jednym miejscu.
// STATUS: po recenzji Krytyka (25.09.2026), zrodlo:
// _wspolne_pliki\kalkulator_wyceny_teksty_po_recenzji_krytyka.md.
// Elementy oznaczone "PRAWNIK: przed wlaczeniem" sa wersja ROBOCZA - blokuja wydanie
// do zatwierdzenia przez prawnika (patrz lista blokerow w opisie PR #21).
// Brak superlatyw i obietnic. Twarde spacje ( ) w liczbach i numerze telefonu.

export const T = {
  // title bez doklejania marki: page.tsx uzywa title.absolute (layout ma szablon '%s | InvestRent Nieruchomości')
  metaTitle: 'Darmowa wycena mieszkania w Kołobrzegu — orientacyjna cena',
  metaDescription:
    'Ile jest warte mieszkanie w Kołobrzegu? Podaj kilka danych i sprawdź orientacyjne widełki ceny oraz cenę za m². Bez numeru telefonu.',
  metaDescriptionOff:
    'Wycena mieszkania w Kołobrzegu: zostaw numer telefonu, a agent InvestRent przygotuje wycenę indywidualnie i zadzwoni. Bez zobowiązań.',
  h1: 'Bezpłatna wycena mieszkania w Kołobrzegu online',
  h1Off: 'Wycena mieszkania w Kołobrzegu — przygotuje ją agent',
  intro: 'Ile jest warte Twoje mieszkanie w Kołobrzegu? Podaj kilka danych, a od razu pokażemy orientacyjne widełki ceny i ceny za m². Liczymy je automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych. To szacunek, a nie operat szacunkowy ani wycena rzeczoznawcy. Widełki podajemy dla mieszkań w Kołobrzegu, z wyjątkiem Śródmieścia. W pozostałych przypadkach (dom, działka, inna miejscowość) agent sprawdzi, czy może przygotować wycenę. Numeru telefonu podawać nie musisz.',
  introOff: 'Kalkulator online jest chwilowo niedostępny. Zostaw numer telefonu — agent przygotuje wycenę Twojej nieruchomości indywidualnie i zadzwoni. Bez zobowiązań.',
  callInstead: 'Wolisz, żebyśmy zadzwonili?',
  callInsteadLink: 'Zostaw numer telefonu',
  disclaimerTop: 'Wynik jest orientacyjny — to nie operat szacunkowy rzeczoznawcy majątkowego.',

  formTitle: 'Dane nieruchomości',
  requiredNote: 'Pola z gwiazdką (*) są wymagane. Dla mieszkania w Kołobrzegu wymagana jest także dzielnica lub osiedle. Pozostałe pola możesz pominąć, ale pomagają zawęzić widełki.',
  fields: {
    property_type: 'Rodzaj nieruchomości',
    property_type_placeholder: 'Wybierz…',
    city: 'Miejscowość',
    city_hint: 'Domyślnie Kołobrzeg. Jeśli wybierzesz inną miejscowość, po wysłaniu formularza możesz zostawić numer telefonu — agent sprawdzi, czy może przygotować wycenę.',
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
    // Backend: najwyższy przedział ma max == min i oznacza "min lub więcej" (comparablesBucket); nie pisać "od 50 do 50".
    comparables: (min: number, max: number) =>
      max <= min
        ? `Do szacunku wykorzystaliśmy co najmniej ${min} porównywalnych nieruchomości z okolicy.`
        : `Do szacunku wykorzystaliśmy od ${min} do ${max} porównywalnych nieruchomości z okolicy.`,
    scopeNote: 'Orientacyjny zakres liczony automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych (m.in. cen ofertowych z ogłoszeń i cen transakcyjnych). To nie jest operat szacunkowy ani wycena rzeczoznawcy. Cena, za którą faktycznie sprzedasz mieszkanie, może się od niego wyraźnie różnić.',
    disclaimerFallback:
      'To wycena orientacyjna, a nie operat szacunkowy rzeczoznawcy majątkowego. Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.',
    // Poza zakresem liczb online (dom, działka, inna miejscowość, Śródmieście) - to reguła, nie brak danych.
    outOfScopeTitle: 'Widełek dla tej nieruchomości nie podajemy online',
    outOfScopeBody:
      'Widełki online liczymy tylko dla mieszkań w Kołobrzegu, poza Śródmieściem. W pozostałych przypadkach (domy, działki, Śródmieście, inne miejscowości) agent sprawdzi, czy i jak może przygotować wycenę. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na kontakt — zadzwonimy tylko w sprawie Twojej wyceny.',
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
    phoneHint: 'Podaj 9 cyfr albo numer z kierunkowym kraju.',
    // Teksty zgód i klauzuli = wersja CONSENT_VERSION (lib/valuation.ts). Zmiana JAKIEGOKOLWIEK z tych tekstów = nowy numer wersji.
    // Zatwierdzenie treści: Krytyk + przegląd AI (kancelaria nieangażowana wg decyzji Daniela 25.09; ryzyko przyjęte świadomie).
    // Dwa OSOBNE pola, oba NIEZAZNACZONE domyślnie: (1) wymagana do oddzwonienia, (2) dobrowolna (marketing tel./SMS), nie warunkuje wyniku.
    consentCallRequired: '(wymagana, jeśli podajesz numer telefonu)',
    consentCall:
      'Zgadzam się, aby spółka INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ (biuro nieruchomości InvestRent) zadzwoniła do mnie pod podany numer wyłącznie w sprawie wyceny mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub mówiąc o tym podczas rozmowy.',
    consentMarketingOptional: '(dobrowolna)',
    consentMarketing:
      'Chcę otrzymywać od spółki INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ (biuro nieruchomości InvestRent) informacje o ofertach i usługach telefonicznie i SMS-em. Nie wpływa to na wynik wyceny ani na oddzwonienie w jej sprawie. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub mówiąc o tym podczas rozmowy.',
    // Klauzula informacyjna (art. 13 RODO): pełne dane administratora wg odpisu KRS (api-krs.ms.gov.pl, 25.09.2026).
    // Fakty techniczne (sprawdzone w kodzie backendu 25.09.2026): IP tylko w pamięci procesu (limiter, okno 24 h), bez zapisu w bazie;
    // ai_valuations (wycena publiczna) nie zawiera danych kontaktowych ani IP; job retencji (PR #496) po 12 mies. czyści teksty wyceny,
    // a dowód zgód zostaje w formie zredagowanej do 3 lat od końca roku zakończenia przetwarzania (wymaga poprawki zapisu znacznika, patrz plan).
    consentInfo: [
      { h: 'Kto jest administratorem Twoich danych.', t: 'Administratorem jest INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, ul. Ratuszowa\u00A012/1\u00A0lok.\u00A03, 78-100 Kołobrzeg, KRS\u00A00001069797, NIP\u00A0671\u00A0185\u00A085\u00A059. Działamy pod marką InvestRent. Kontakt: biuro@investrent.com.pl.' },
      { h: 'Po co i na jakiej podstawie.', t: 'Dane nieruchomości z formularza wykorzystujemy do obliczenia i pokazania Ci szacunku (podstawa: wykonanie Twojego żądania, art.\u00A06 ust.\u00A01 lit.\u00A0b RODO). Jeśli podasz numer telefonu i zaznaczysz pierwszą zgodę, zadzwonimy w sprawie wyceny (podstawa: Twoja zgoda, art.\u00A06 ust.\u00A01 lit.\u00A0a RODO). Jeśli zaznaczysz drugą, dobrowolną zgodę, będziemy przekazywać Ci informacje o ofertach i usługach telefonicznie i SMS-em (podstawa: Twoja zgoda). Dowód udzielonych zgód przechowujemy, aby wykazać ich udzielenie i bronić się przed roszczeniami (art.\u00A06 ust.\u00A01 lit.\u00A0f oraz art.\u00A07 ust.\u00A01 RODO). Dla bezpieczeństwa i ograniczenia liczby zapytań przetwarzamy adres IP przez 24\u00A0godziny (art.\u00A06 ust.\u00A01 lit.\u00A0f RODO).' },
      { h: 'Sztuczna inteligencja.', t: 'Szacunek liczymy automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych. Do dostawcy AI przekazujemy wyłącznie dane nieruchomości, bez Twoich danych kontaktowych i adresu IP. Wynik nie jest decyzją wiążącą i nie jest operatem szacunkowym.' },
      { h: 'Komu przekazujemy dane.', t: 'Dostawcom usług IT: hostingu i bazy danych (Vercel, Railway, Supabase), dostawcy usługi AI (Anthropic) oraz dostawcy ochrony formularza (Cloudflare Turnstile). Część z nich ma siedzibę w USA; przekazanie opiera się na Data Privacy Framework lub standardowych klauzulach umownych. Kopię zabezpieczeń możesz uzyskać, pisząc na biuro@investrent.com.pl.' },
      { h: 'Jak długo.', t: 'Adres IP przechowujemy wyłącznie w pamięci serwera przez 24\u00A0godziny (okno limitu zapytań); nie zapisujemy go w bazie danych. Jeśli nie zostawisz numeru telefonu, dane nieruchomości i wynik zapisujemy bez danych kontaktowych i nie łączymy ich z Tobą; po 12\u00A0miesiącach od dnia zapytania usuwamy opis wyniku, a w formie statystycznej zostają parametry nieruchomości (typ, powierzchnia, miejscowość, dzielnica, stan), widełki ceny i data. Jeśli zostawisz numer telefonu, zapytanie i dane kontaktowe przechowujemy do 12\u00A0miesięcy od ostatniego kontaktu z Tobą (wiadomości lub rozmowy w sprawie wyceny), a jeśli do kontaktu nie doszło, od dnia zapytania. Dowód zgód przechowujemy 3\u00A0lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie; po upływie 12\u00A0miesięcy zostaje on bez danych osobowych (wersja zgody, kanał i czas). Dane z rozmów prowadzących do umowy przechowujemy tak długo, jak wymagają tego przepisy.' },
      { h: 'Twoje prawa.', t: 'Możesz żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, możesz też wnieść sprzeciw oraz w każdej chwili cofnąć zgodę (cofnięcie nie wpływa na zgodność z prawem tego, co zrobiliśmy wcześniej). Wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie (dowód zgód, adres IP) przysługuje Ci sprzeciw z przyczyn związanych z Twoją szczególną sytuacją (art.\u00A021 RODO). Napisz na biuro@investrent.com.pl lub powiedz o tym podczas rozmowy. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Podanie danych jest dobrowolne; bez numeru telefonu pokażemy wynik, ale nie oddzwonimy.' },
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
      'Porównujemy dane Twojej nieruchomości z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z okolicy. Szacunek liczymy automatycznie z użyciem sztucznej inteligencji, bez oględzin. Ceny ofertowe bywają wyższe od faktycznie zapłaconych.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do kredytu, sądu lub urzędu).',
      'Co trafia do sztucznej inteligencji: wyłącznie dane nieruchomości wpisane w kalkulatorze, bez Twoich danych kontaktowych i adresu IP.',
      'Co zapisujemy: jeśli nie zostawisz numeru telefonu, dane nieruchomości i wynik zapisujemy bez danych kontaktowych i nie łączymy ich z Tobą, a adres IP trzymamy tylko w pamięci serwera przez 24\u00A0godziny, dla limitu zapytań (formularz chroni Cloudflare Turnstile). Jeśli zostawisz numer telefonu, zapisujemy w naszym systemie CRM Twoje imię, numer, dane nieruchomości i wynik oraz znacznik udzielonych zgód (wersja, kanał, czas).',
      'Jak długo: zapytanie i dane kontaktowe do 12\u00A0miesięcy od ostatniego kontaktu z Tobą (wiadomości lub rozmowy w sprawie wyceny), a jeśli do kontaktu nie doszło, od dnia zapytania. Dowód zgód, po usunięciu danych osobowych, 3\u00A0lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie. Zgodę możesz cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub mówiąc o tym podczas rozmowy. Szczegóły: polityka prywatności (RODO).',
    ],

  },
} as const
