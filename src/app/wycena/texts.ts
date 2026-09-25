// Teksty publiczne kalkulatora wyceny (/wycena) w jednym miejscu.
// STATUS: po recenzji Krytyka (25.09.2026), zrodlo:
// _wspolne_pliki\kalkulator_wyceny_teksty_po_recenzji_krytyka.md.
// Elementy oznaczone "PRAWNIK: przed wlaczeniem" sa wersja ROBOCZA - blokuja wydanie
// do zatwierdzenia przez prawnika (patrz lista blokerow w opisie PR #21).
// Brak superlatyw i obietnic. Twarde spacje ( ) w liczbach i numerze telefonu.

export const T = {
  // title bez doklejania marki: page.tsx uzywa title.absolute (layout ma szablon '%s | InvestRent Nieruchomości')
  metaTitle: 'Wycena mieszkania w Kołobrzegu online — orientacyjna cena',
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
    // Jedna forma: dolna granica przedziału z backendu (15/20/50), bez odmiany zakresów i bez pozornej precyzji.
    comparables: (min: number, _max: number) =>
      `Do szacunku wykorzystaliśmy co najmniej ${min} ${min === 1 ? 'porównywalnej nieruchomości' : 'porównywalnych nieruchomości'} z okolicy.`,
    scopeNote: 'Orientacyjny zakres liczony automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych (m.in. cen ofertowych z ogłoszeń i cen transakcyjnych). To nie jest operat szacunkowy ani wycena rzeczoznawcy. Cena, za którą faktycznie sprzedasz mieszkanie, może się od niego wyraźnie różnić.',
    disclaimerFallback:
      'To wycena orientacyjna, a nie operat szacunkowy rzeczoznawcy majątkowego. Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.',
    // Poza zakresem liczb online (dom, działka, inna miejscowość, Śródmieście) - to reguła, nie brak danych.
    outOfScopeTitle: 'Widełek dla tej nieruchomości nie podajemy online',
    outOfScopeBody:
      'Widełki online liczymy tylko dla mieszkań w Kołobrzegu, poza Śródmieściem. W pozostałych przypadkach (domy, działki, Śródmieście, inne miejscowości) agent sprawdzi, czy i jak może przygotować wycenę. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny — zadzwonimy tylko w sprawie Twojej wyceny.',
    // W zakresie, ale silnik nie ma dość porównań.
    noNumbersTitle: 'Nie mamy dość danych, żeby podać widełki',
    noNumbersBody:
      'Dla tej nieruchomości mamy za mało porównywalnych danych rynkowych, żeby rzetelnie wyznaczyć widełki. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny — agent przygotuje wycenę indywidualnie.',
    again: 'Wyceń inną nieruchomość',
  },

  lead: {
    titleRange: 'Chcesz szczegółową analizę z porównaniami i mapą?',
    bodyRange: 'Zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny — agent zadzwoni, omówi z Tobą wynik i przygotuje szczegółowy raport. Bez zobowiązań.',
    titleFallback: 'Zostaw numer, a przygotujemy wycenę indywidualnie',
    bodyFallback: 'Zaznacz zgodę na telefon w sprawie wyceny, a agent zadzwoni i omówi z Tobą Twoją nieruchomość. Bez zobowiązań.',
    name: 'Imię (opcjonalnie)',
    phone: 'Numer telefonu',
    phoneHint: 'Podaj 9 cyfr (numer polski) albo pełny numer z kierunkowym kraju, zaczynający się od +.',
    // Teksty zgód i klauzuli = wersja CONSENT_VERSION (lib/valuation.ts). Zmiana JAKIEGOKOLWIEK z tych tekstów = nowy numer wersji.
    // Zatwierdzenie treści: Krytyk + przegląd AI (kancelaria nieangażowana wg decyzji Daniela 25.09; ryzyko przyjęte świadomie).
    // Dwa OSOBNE pola, oba NIEZAZNACZONE domyślnie: (1) wymagana do oddzwonienia, (2) dobrowolna (marketing telefon+SMS, jedna zgoda), nie warunkuje wyniku.
    consentCallRequired: '(wymagana, jeśli podajesz numer telefonu)',
    consentCall:
      'Zgadzam się, aby spółka INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ (biuro nieruchomości InvestRent) zadzwoniła do mnie pod podany numer wyłącznie w sprawie wyceny mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub mówiąc o tym podczas rozmowy.',
    // Zgoda marketingowa: JEDNA, obejmuje dwa kanały naraz (telefon i SMS), jeden cel (oferty i usługi biura). Decyzja Daniela 25.09.2026
    // (ryzyko granularności przyjęte świadomie, patrz lia_kalkulator_wyceny_2026_09_25.md). Bez "STOP": bramka SMS nie istnieje w systemie.
    consentMarketingOptional: '(dobrowolna)',
    consentMarketing:
      'Chcę otrzymywać od spółki INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ (biuro nieruchomości InvestRent) informacje o ofertach nieruchomości i usługach biura w rozmowach telefonicznych oraz w wiadomościach SMS pod podany numer. Nie wpływa to na wynik wyceny ani na oddzwonienie w jej sprawie. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub mówiąc o tym podczas rozmowy.',
    // Klauzula informacyjna (art. 13 RODO): pełne dane administratora wg odpisu KRS (api-krs.ms.gov.pl, 25.09.2026).
    // Fakty (kod backendu origin/main 25.09.2026): IP w limiterze w pamięci procesu (okno 24 h; 30 zapytań/h to okno 1 h), bez zapisu w bazie;
    // ai_valuations bez kontaktu i IP; odbiorcy danych leada: Brevo (mail do managerów), kalendarz Google (zadanie z imieniem i numerem).
    // WARUNKI PUBLIKACJI (zdania prawdziwe dopiero po wdrożeniu): (1) dowód zgód z id_hash i osobna notatka (kontrakt_dowod_zgody_kalkulator_2026_09_25.md);
    // (2) sprzątanie mapy limitera IP (bez tego "do 24 godzin" jest nieprawdziwe); (3) potwierdzenia dostawców (tabela_dostawcow_kalkulator_2026_09_25.md).
    consentInfo: [
      { h: 'Kto jest administratorem Twoich danych.', t: 'Administratorem jest INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, ul. Ratuszowa\u00A012/1\u00A0lok.\u00A03, 78-100 Kołobrzeg, KRS\u00A00001069797, NIP\u00A0671\u00A0185\u00A085\u00A059. Działamy pod marką InvestRent. Kontakt: biuro@investrent.com.pl.' },
      { h: 'Po co i na jakiej podstawie.', t: 'Wykorzystujemy Twoje dane w tych celach:', items: [
        'obliczenie i pokazanie szacunku — wykonanie Twojego żądania (art.\u00A06 ust.\u00A01 lit.\u00A0b RODO);',
        'telefon w sprawie wyceny — Twoja zgoda (art.\u00A06 ust.\u00A01 lit.\u00A0a RODO), jeśli podasz numer i zaznaczysz zgodę na telefon w sprawie wyceny;',
        'informacje o ofertach nieruchomości i usługach biura w rozmowach telefonicznych i wiadomościach SMS — Twoja zgoda (art.\u00A06 ust.\u00A01 lit.\u00A0a RODO), jeśli zaznaczysz osobną, dobrowolną zgodę marketingową (jedna zgoda obejmuje oba kanały);',
        'dowód udzielonych zgód, aby wykazać ich udzielenie i bronić się przed roszczeniami — nasz prawnie uzasadniony interes (art.\u00A06 ust.\u00A01 lit.\u00A0f oraz art.\u00A07 ust.\u00A01 RODO);',
        'bezpieczeństwo formularza i ograniczenie liczby zapytań (adres IP) — nasz prawnie uzasadniony interes (art.\u00A06 ust.\u00A01 lit.\u00A0f RODO).',
      ] },
      { h: 'Sztuczna inteligencja.', t: 'Szacunek liczymy automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych. Do dostawcy AI przekazujemy wyłącznie dane nieruchomości, bez Twoich danych kontaktowych i adresu IP. Wynik nie jest decyzją wiążącą i nie jest operatem szacunkowym.' },
      { h: 'Komu przekazujemy dane.', t: 'Dostawcom usług IT: hostingu i bazy danych (Vercel, Railway, Supabase), usługi AI (Anthropic, wyłącznie dane nieruchomości), ochrony formularza (Cloudflare Turnstile, adres IP i informacje o przeglądarce), poczty e-mail, którą powiadamiamy pracowników biura o zgłoszeniu (Brevo, imię, numer telefonu i treść zgłoszenia), oraz kalendarza Google pracowników biura, jeśli mają go połączonego z naszym systemem (zadanie oddzwonienia z imieniem i numerem). Część dostawców ma siedzibę w USA. Przekazanie danych do Cloudflare i Google opiera się na Data Privacy Framework. Kopię zabezpieczeń możesz uzyskać, pisząc na biuro@investrent.com.pl.' },
      { h: 'Jak długo.', t: 'Okresy przechowywania:', items: [
        'adres IP: nasza aplikacja przechowuje go wyłącznie w pamięci serwera do 24\u00A0godzin (okno limitu zapytań) i nie zapisuje w bazie danych; adres IP przetwarzają też w swoich logach technicznych dostawcy: hostingu API (Railway), hostingu strony (Vercel) i ochrony formularza (Cloudflare), według własnych zasad (zwykle od kilku do kilkudziesięciu dni);',
        'zapytanie bez numeru telefonu: dane nieruchomości i wynik zapisujemy bez danych kontaktowych i adresu IP; po 12\u00A0miesiącach od dnia zapytania usuwamy szczegółowy opis wyceny, a zostaje statystyka (typ, powierzchnia, miejscowość, dzielnica, stan, widełki ceny, data), która nie pozwala nam Cię zidentyfikować;',
        'zapytanie z numerem telefonu: do 12\u00A0miesięcy od ostatniego kontaktu z Tobą (wiadomości lub rozmowy w sprawie wyceny), a jeśli do kontaktu nie doszło, od dnia zapytania; dane z rozmów prowadzących do umowy tak długo, jak wymagają tego przepisy;',
        'dowód zgód: 3\u00A0lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie danych zgłoszenia. Gdy usuwamy dane zgłoszenia (zob. wyżej), z dowodu zostają: wersja zgody, kanał, czas i skrót numeru telefonu. Skrót liczymy z użyciem tajnego klucza, który znamy tylko my; bez niego nie da się ze skrótu odczytać numeru, a z kluczem możemy go porównać z numerem tylko wtedy, gdy trzeba wykazać zgodę. To nadal dane osobowe, przetwarzane na podstawie naszego prawnie uzasadnionego interesu (art.\u00A06 ust.\u00A01 lit.\u00A0f RODO), aby móc wykazać zgodę i bronić się przed roszczeniami.',
      ] },
      { h: 'Twoje prawa.', t: 'Możesz żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia oraz w każdej chwili cofnąć zgodę (cofnięcie nie wpływa na zgodność z prawem tego, co zrobiliśmy wcześniej). Żądanie usunięcia danych nie obejmuje dowodu zgód opisanego wyżej, który zachowujemy do obrony przed roszczeniami (art.\u00A017 ust.\u00A03 lit.\u00A0e RODO); możesz jednak wnieść sprzeciw, jak niżej. Napisz na biuro@investrent.com.pl lub powiedz o tym podczas rozmowy. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Podanie danych jest dobrowolne; bez numeru telefonu pokażemy wynik, ale nie oddzwonimy.' },
      { h: 'Prawo sprzeciwu.', highlight: true, t: 'Masz prawo w każdej chwili wnieść sprzeciw wobec przetwarzania Twoich danych opartego na naszym prawnie uzasadnionym interesie (dowód zgód, adres IP; art.\u00A06 ust.\u00A01 lit.\u00A0f RODO), z przyczyn związanych z Twoją szczególną sytuacją (art.\u00A021 RODO). Sprzeciw wobec przetwarzania do celów marketingu bezpośredniego możesz wnieść w każdej chwili, bez podawania przyczyny (zgodę marketingową możesz też po prostu cofnąć). Napisz na biuro@investrent.com.pl lub powiedz o tym podczas rozmowy.' },
    ],
    consentInfoMore: 'Szczegóły znajdziesz w ',
    consentInfoLink: 'polityce prywatności (RODO)',
    consentInfoSuffix: '.',
    optionalLabel: '(opcjonalnie)',
    submit: 'Proszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Wpisz numer telefonu: 9 cyfr (numer polski) albo pełny numer z kierunkowym kraju, zaczynający się od +.',
    errConsent: 'Zaznacz zgodę na telefon w sprawie wyceny — bez niej nie możemy do Ciebie zadzwonić. Pozostałe zgody są dobrowolne.',
    doneTitle: 'Dziękujemy, otrzymaliśmy Twój numer',
    doneBody: 'Agent zadzwoni do Ciebie w godzinach pracy biura.',
  },

  // Komunikaty konczace sie na "zadzwon:" - numer biura dopisuje komponent jako link tel:.
  errors: {
    disabled: 'Kalkulator jest chwilowo niedostępny. Możemy przygotować wycenę indywidualnie — zostaw numer poniżej lub zadzwoń:',
    // when = wynik formatRetryAfter(retry_after_seconds z backendu; okno 1 h dla luźnego limitu, 24 h dla limitu 3 wycen)
    rateLimited: (when: string) => `Z tego połączenia wykonano już maksymalną liczbę wycen. Spróbuj ponownie za około ${when}. Możesz też zostawić numer poniżej lub zadzwonić:`,
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
      'Co zapisujemy: jeśli nie zostawisz numeru telefonu, dane nieruchomości i wynik zapisujemy bez danych kontaktowych i adresu IP; nie pozwalają nam Cię zidentyfikować. Adres IP trzymamy w pamięci serwera do 24\u00A0godzin, dla limitu zapytań (formularz chroni Cloudflare Turnstile). Jeśli zostawisz numer telefonu, zapisujemy w naszym systemie CRM Twoje imię, numer, dane nieruchomości i wynik oraz dowód udzielonych zgód: wersję zgody, kanał, czas i skrót numeru telefonu (kod, z którego bez naszego tajnego klucza nie da się odczytać numeru).',
      'Jak długo: zapytanie bez numeru telefonu 12\u00A0miesięcy od dnia zapytania (potem zostaje sama statystyka); zapytanie z numerem do 12\u00A0miesięcy od ostatniego kontaktu z Tobą (wiadomości lub rozmowy w sprawie wyceny), a jeśli do kontaktu nie doszło, od dnia zapytania. Dowód zgód przechowujemy 3\u00A0lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie. Po usunięciu danych zgłoszenia zostaje z niego wersja zgody, kanał, czas i skrót numeru telefonu. Zgodę możesz cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl lub mówiąc o tym podczas rozmowy. Szczegóły: polityka prywatności (RODO).',
    ],

  },
} as const
