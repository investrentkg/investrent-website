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
    'Ile jest warte mieszkanie w Kołobrzegu? Widełki ceny online dla wybranych osiedli, w innych przypadkach agent sprawdzi, czy może przygotować wycenę.',
  metaDescriptionOff:
    'Wycena mieszkania w Kołobrzegu: zostaw numer telefonu, a agent InvestRent sprawdzi, czy może przygotować wycenę, i zadzwoni. Bez zobowiązań.',
  h1: 'Orientacyjna wycena mieszkania w Kołobrzegu online',
  h1Off: 'Wycena mieszkania w Kołobrzegu — zajmie się nią agent',
  intro: 'Ile jest warte Twoje mieszkanie w Kołobrzegu? Podaj kilka danych, a od razu pokażemy orientacyjne widełki ceny i ceny za m². Liczymy je automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych. To szacunek, a nie operat szacunkowy ani wycena rzeczoznawcy. Widełki podajemy dla mieszkań w wybranych dzielnicach Kołobrzegu (lista w formularzu). W pozostałych przypadkach (dom, działka, Śródmieście, inna dzielnica lub miejscowość) agent sprawdzi, czy może przygotować wycenę. Numeru telefonu podawać nie musisz.',
  introOff: 'Kalkulator online jest chwilowo niedostępny. Zostaw numer telefonu — agent sprawdzi, czy może przygotować wycenę Twojej nieruchomości, i zadzwoni. Bez zobowiązań.',
  callInstead: 'Wolisz, żebyśmy zadzwonili?',
  callInsteadLink: 'Zostaw numer telefonu',
  disclaimerTop: 'Wynik jest orientacyjny — to nie operat szacunkowy rzeczoznawcy majątkowego.',

  formTitle: 'Dane nieruchomości',
  requiredNote: 'Pola z gwiazdką (*) są wymagane. Dla mieszkania w Kołobrzegu wymagana jest także dzielnica lub osiedle. Pozostałe pola możesz pominąć, ale pomagają zawęzić widełki.',
  fields: {
    property_type: 'Rodzaj nieruchomości',
    property_type_placeholder: 'Wybierz…',
    city: 'Miejscowość',
    city_hint: 'Domyślnie Kołobrzeg; możesz zacząć pisać nazwę. Osiedla Kołobrzegu (np. Podczele) wskażesz niżej, w polu „Dzielnica lub osiedle”. Dla innej miejscowości wybierz „Inna lokalizacja”.',
    district: 'Dzielnica lub osiedle',
    district_placeholder: 'Wybierz z listy…',
    district_hint: 'Dla mieszkania w Kołobrzegu wybierz dzielnicę lub osiedle z listy. Dla Śródmieścia (także pozycji „Centrum” i „Stare Miasto”) oraz dla „Inna dzielnica” widełek online nie podajemy — agent sprawdzi, czy może przygotować wycenę.',
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
      `Do szacunku wykorzystaliśmy co najmniej ${min} ${min === 1 ? 'porównywalnej nieruchomości' : 'porównywalnych nieruchomości'} z Twojej miejscowości.`,
    scopeNote: 'Orientacyjny zakres liczony automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych (m.in. cen ofertowych z ogłoszeń i cen transakcyjnych). To nie jest operat szacunkowy ani wycena rzeczoznawcy. Cena, za którą faktycznie sprzedasz mieszkanie, może się od niego wyraźnie różnić.',
    disclaimerFallback:
      'To wycena orientacyjna, a nie operat szacunkowy rzeczoznawcy majątkowego. Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.',
    // Poza zakresem liczb online (dom, działka, inna miejscowość, Śródmieście) - to reguła, nie brak danych.
    outOfScopeTitle: 'Widełek dla tej nieruchomości nie podajemy online',
    outOfScopeBody:
      'Widełki online liczymy tylko dla mieszkań w wybranych dzielnicach Kołobrzegu (lista w formularzu). W pozostałych przypadkach (domy, działki, Śródmieście, inne dzielnice i miejscowości) agent sprawdzi, czy może przygotować wycenę. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny — zadzwonimy tylko w sprawie Twojej wyceny.',
    // W zakresie, ale silnik nie ma dość porównań.
    noNumbersTitle: 'Nie mamy dość danych, żeby podać widełki',
    noNumbersBody:
      'Dla tej nieruchomości mamy za mało porównywalnych danych rynkowych, żeby rzetelnie wyznaczyć widełki. Jeśli chcesz, zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny — agent sprawdzi, czy może przygotować wycenę indywidualnie.',
    again: 'Wyceń inną nieruchomość',
  },

  lead: {
    titleRange: 'Chcesz omówić wynik z agentem?',
    bodyRange: 'Zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny — agent zadzwoni, omówi z Tobą wynik i sprawdzi, czy może przygotować wycenę indywidualną. Bez zobowiązań.',
    titleFallback: 'Zostaw numer, a agent sprawdzi, czy może przygotować wycenę',
    bodyFallback: 'Zaznacz zgodę na telefon w sprawie wyceny, a agent zadzwoni i omówi z Tobą Twoją nieruchomość. Bez zobowiązań.',
    name: 'Imię (opcjonalnie)',
    phone: 'Numer telefonu',
    phoneHint: 'Podaj 9 cyfr (numer polski) albo pełny numer z kierunkowym kraju, zaczynający się od +.',
    // Teksty zgód i klauzuli = wersja CONSENT_VERSION (lib/valuation.ts). Zmiana JAKIEGOKOLWIEK z tych tekstów = nowy numer wersji.
    // Zatwierdzenie treści: Krytyk + przegląd AI (kancelaria nieangażowana wg decyzji Daniela 25.09; ryzyko przyjęte świadomie).
    // v11 (decyzja Daniela 26.09.2026): kalkulator startuje BEZ zgody marketingowej. Jedna zgoda: na oddzwonienie w sprawie wyceny
    // (NIEZAZNACZONA domyślnie, wymagana przy podanym numerze). Marketing = osobny, późniejszy krok (v12) po gotowym mechanizmie (#507).
    // Bez skrótu numeru (id_hash) i bez klucza HMAC w ścieżce kalkulatora; dowód zgody = wersja, kanał, czas, wygasa ze zgłoszeniem po 12 mies.
    consentCallRequired: '(wymagana, jeśli podajesz numer telefonu)',
    consentCall:
      'Zgadzam się, aby spółka INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ (biuro nieruchomości InvestRent) zadzwoniła do mnie pod podany numer wyłącznie w sprawie wyceny mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl, dzwoniąc do biura lub mówiąc o tym podczas rozmowy.',
    // Klauzula informacyjna (art. 13 RODO): pełne dane administratora wg odpisu KRS (api-krs.ms.gov.pl, 25.09.2026).
    // Fakty (kod backendu origin/main 26.09.2026): IP w limiterze w pamięci procesu jako skrót HMAC z solą procesu (okno 24 h; sprzątanie co 10 min, #505),
    // bez zapisu w bazie; ai_valuations bez kontaktu i IP; odbiorcy danych leada: Brevo (mail do managerów), kalendarz Google (zadanie z imieniem i numerem).
    // WARUNEK PUBLIKACJI (zdanie o IP "około 24 godzin"): #505 potwierdzone na produkcji i brak IP w logach aplikacji (kod origin/main 26.09.2026: req.ip tylko jako klucz limitera (skrót HMAC) i remoteip do Turnstile; brak logowania IP; osobno leadLimit express-rate-limit trzyma IP w pamięci do 1 h).
    // WARUNKI PUBLIKACJI: (1) backend dowodu zgody na oddzwonienie + test na żywo; (2) kasowanie dowodu z leadem po 12 mies. (dziś job zostawia zredagowaną
    // notatkę [Zgoda-kalkulator]); (3) potwierdzenia dostawców (tabela_dostawcow_kalkulator_2026_09_25.md); (4) polityki #22 i wersja DE.
    consentInfo: [
      { h: 'Kto jest administratorem Twoich danych.', t: 'Administratorem jest INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, ul. Ratuszowa\u00A012/1\u00A0lok.\u00A03, 78-100 Kołobrzeg, KRS\u00A00001069797, NIP\u00A0671\u00A0185\u00A085\u00A059. Działamy pod marką InvestRent. Kontakt: biuro@investrent.com.pl.' },
      { h: 'Po co i na jakiej podstawie.', t: 'Wykorzystujemy Twoje dane w tych celach:', items: [
        'obliczenie i pokazanie szacunku — wykonanie Twojego żądania (art.\u00A06 ust.\u00A01 lit.\u00A0b RODO);',
        'rozmowy o współpracy, o które sam(a) poprosisz, oraz umowa — działania na Twoje żądanie przed zawarciem umowy i wykonanie umowy (art.\u00A06 ust.\u00A01 lit.\u00A0b RODO) oraz obowiązki prawne wynikające z przepisów, np. podatkowych (art.\u00A06 ust.\u00A01 lit.\u00A0c RODO);',
        'telefon w sprawie wyceny — Twoja zgoda (art.\u00A06 ust.\u00A01 lit.\u00A0a RODO), jeśli podasz numer i zaznaczysz zgodę na telefon w sprawie wyceny;',
        'dowód udzielonej zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas), aby wykazać jej udzielenie i bronić się przed roszczeniami — nasz prawnie uzasadniony interes (art.\u00A06 ust.\u00A01 lit.\u00A0f oraz art.\u00A07 ust.\u00A01 RODO);',
        'lista osób, do których nie dzwonimy: jeśli cofniesz zgodę na telefon albo poinformujesz nas, że numer podała inna osoba, zachowamy sam numer telefonu (wraz z datą i powodem) na tej liście, wyłącznie po to, żeby nie zadzwonić do Ciebie ponownie — nasz prawnie uzasadniony interes (art.\u00A06 ust.\u00A01 lit.\u00A0f RODO);',
        'bezpieczeństwo formularza i ograniczenie liczby zapytań (adres IP) — nasz prawnie uzasadniony interes (art.\u00A06 ust.\u00A01 lit.\u00A0f RODO).',
      ] },
      { h: 'Sztuczna inteligencja.', t: 'Szacunek liczymy automatycznie z użyciem sztucznej inteligencji na podstawie danych rynkowych. Do dostawcy AI (Anthropic) i do dostawcy danych rynkowych (Cenogram, rejestr cen transakcyjnych) przekazujemy wyłącznie dane nieruchomości, bez Twoich danych kontaktowych i adresu IP. Wynik nie jest decyzją wiążącą i nie jest operatem szacunkowym. Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, które wywoływałyby skutki prawne lub podobnie na Ciebie wpływały.' },
      { h: 'Komu przekazujemy dane.', t: 'Przekazujemy dane dostawcom usług IT:', items: [
        'hosting strony: Vercel (adres IP, informacje o żądaniu);',
        'hosting serwera: Railway;',
        'baza danych: Supabase;',
        'sztuczna inteligencja: Anthropic, oraz dane rynkowe: Cenogram (Polska); do obu trafiają wyłącznie dane nieruchomości, bez Twoich danych kontaktowych i adresu IP;',
        'ochrona formularza: Cloudflare Turnstile (adres IP, informacje o przeglądarce);',
        'poczta e-mail, którą powiadamiamy pracowników biura o zgłoszeniu: Brevo (Sendinblue SAS, Francja; imię, numer telefonu i treść zgłoszenia), na podstawie umowy powierzenia będącej częścią regulaminu usługi;',
        'kalendarz Google pracowników biura, jeśli mają go połączonego z naszym systemem (zadanie oddzwonienia z imieniem, bez numeru telefonu, z odnośnikiem do karty w naszym systemie).',
      ] },
      { h: 'Zabezpieczenia przy przekazaniu poza EOG.', t: 'Część dostawców ma siedzibę w USA lub może przetwarzać dane poza Europejskim Obszarem Gospodarczym. Na Twój wniosek (biuro@investrent.com.pl) wskażemy zabezpieczenie zastosowane wobec danego dostawcy oraz, jeśli to standardowe klauzule umowne, prześlemy ich kopię. Zabezpieczenia:', items: [
        'Cloudflare i Google (dla kont w naszej domenie): Data Privacy Framework (ramy ochrony danych UE-USA), a w razie jego braku standardowe klauzule umowne UE zawarte w umowie powierzenia dostawcy;',
        'Vercel (hosting strony): Data Privacy Framework oraz umowa powierzenia przetwarzania danych;',
        'Railway: umowa powierzenia z 26.09.2026; mechanizm przekazania (Data Privacy Framework albo standardowe klauzule umowne UE) wskażemy na wniosek;',
        'Anthropic: standardowe klauzule umowne UE w umowie powierzenia;',
        'Supabase (baza danych): dane przechowywane w regionie UE (Irlandia); umowa powierzenia zawiera standardowe klauzule umowne UE.',
      ] },
      { h: 'Jak długo.', t: 'Okresy przechowywania:', items: [
        'adres IP, dostawca hostingu naszego serwera (Railway): może przechowywać dzienniki żądań, w tym Twój adres IP, do 30\u00A0dni;',
        'adres IP, nasza aplikacja: w pamięci serwera około 24\u00A0godzin (okno limitu zapytań), nie zapisujemy go w bazie danych;',
        'adres IP, dostawcy hostingu strony (Vercel) i ochrony formularza (Cloudflare): w swoich logach technicznych według własnych zasad i okresów;',
        'zapytanie bez numeru telefonu: dane nieruchomości i wynik zapisujemy bez danych kontaktowych i adresu IP; po 12\u00A0miesiącach od dnia zapytania usuwamy szczegółowy opis wyceny, a zostaje statystyka (typ, przedział powierzchni co 10\u00A0m², miejscowość i dzielnica z listy, stan, widełki ceny, data), która nie zawiera Twoich danych kontaktowych ani adresu IP;',
        'zapytanie z numerem telefonu, zwykle: usuwamy je 12\u00A0miesięcy po ostatniej rozmowie z Tobą (telefonicznej lub osobistej) lub Twojej wiadomości w sprawie wyceny;',
        'zapytanie z numerem telefonu, najpóźniej: 24\u00A0miesiące po pierwszym zgłoszeniu z tego numeru (kolejne zgłoszenie z tego numeru tych 24\u00A0miesięcy nie wydłuża); jeśli do rozmowy lub wiadomości nie doszło, 12\u00A0miesięcy od zgłoszenia;',
        'zapytanie z numerem telefonu, wyjątki: jeśli dojdzie do umowy, dane związane z umową przechowujemy tak długo, jak wymagają tego przepisy; jeśli sam(a) poprosisz o rozmowy o współpracy, Twój numer i dane z tych rozmów przechowujemy najdłużej 12\u00A0miesięcy od ostatniej takiej rozmowy (każda kolejna taka rozmowa odnawia te 12\u00A0miesięcy);',
        'nieodebrane próby kontaktu z naszej strony tych okresów nie wydłużają;',
        'dowód zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas): wygasa razem ze zgłoszeniem;',
        'numer na liście osób, do których nie dzwonimy: 3\u00A0lata albo do zgłoszenia sprzeciwu; usuniemy go z tej listy także na Twoją prośbę wysłaną e-mailem na biuro@investrent.com.pl.',
      ] },
      { h: 'Twoje prawa.', t: 'Możesz żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia oraz w każdej chwili cofnąć zgodę na telefon w sprawie wyceny (cofnięcie nie wpływa na zgodność z prawem tego, co zrobiliśmy wcześniej). Po cofnięciu zgody nie zadzwonimy do Ciebie w sprawie wyceny i niezwłocznie, najpóźniej w ciągu miesiąca, usuniemy Twoje dane z naszego systemu; zachowamy tylko sam numer telefonu na liście osób, do których nie dzwonimy, oraz dane potrzebne z innego powodu, np. z powodu umowy. Zgodę możesz cofnąć e-mailem (biuro@investrent.com.pl), dzwoniąc do biura (+48\u00A0731\u00A0554\u00A0341) albo w rozmowie z pracownikiem biura. Wnioski o pozostałe prawa wyślij na biuro@investrent.com.pl lub powiedz o nich podczas rozmowy. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Podanie danych jest dobrowolne; bez numeru telefonu pokażemy wynik, ale nie oddzwonimy.' },
      { h: 'Prawo sprzeciwu.', highlight: true, t: 'Masz prawo w każdej chwili wnieść sprzeciw wobec przetwarzania Twoich danych opartego na naszym prawnie uzasadnionym interesie (dowód zgody na telefon w sprawie wyceny, adres IP; art.\u00A06 ust.\u00A01 lit.\u00A0f RODO), z przyczyn związanych z Twoją szczególną sytuacją (art.\u00A021 RODO). Napisz na biuro@investrent.com.pl lub powiedz o tym podczas rozmowy.' },
    ],
    consentInfoMore: 'Szczegóły znajdziesz w ',
    consentInfoLink: 'polityce prywatności (RODO)',
    consentInfoSuffix: '.',
    optionalLabel: '(opcjonalnie)',
    submit: 'Proszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Wpisz numer telefonu: 9 cyfr (numer polski) albo pełny numer z kierunkowym kraju, zaczynający się od +.',
    errConsent: 'Zaznacz zgodę na telefon w sprawie wyceny — bez niej nie możemy do Ciebie zadzwonić.',
    doneTitle: 'Dziękujemy, otrzymaliśmy Twój numer',
    doneBody: 'Agent skontaktuje się z Tobą telefonicznie w godzinach pracy biura.',
  },

  // Komunikaty konczace sie na "zadzwon:" - numer biura dopisuje komponent jako link tel:.
  errors: {
    disabled: 'Kalkulator jest chwilowo niedostępny. Agent sprawdzi, czy może przygotować wycenę indywidualnie — zostaw numer poniżej lub zadzwoń:',
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
      'Porównujemy dane Twojej nieruchomości z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z Twojej miejscowości. Szacunek liczymy automatycznie z użyciem sztucznej inteligencji, bez oględzin. Ceny ofertowe bywają wyższe od faktycznie zapłaconych.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do kredytu, sądu lub urzędu).',
      'Co trafia do usług zewnętrznych: dane nieruchomości wpisane w kalkulatorze trafiają wyłącznie do dostawcy sztucznej inteligencji (Anthropic) i dostawcy danych rynkowych (Cenogram), bez Twoich danych kontaktowych i adresu IP.',
      'Co zapisujemy bez numeru: jeśli nie zostawisz numeru telefonu, zapisujemy dane nieruchomości i wynik bez danych kontaktowych i adresu IP.',
      'Adres IP: dostawca hostingu naszego serwera (Railway) może przechowywać dzienniki żądań, w tym adres IP, do 30\u00A0dni; w samej naszej aplikacji trzymamy go w pamięci serwera około 24\u00A0godzin, dla limitu zapytań (formularz chroni Cloudflare Turnstile); pozostali dostawcy (hosting strony, ochrona formularza) przetwarzają go w swoich logach według własnych zasad.',
      'Co zapisujemy z numerem: jeśli zostawisz numer telefonu, zapisujemy w naszym systemie CRM Twoje imię, numer, dane nieruchomości i wynik oraz dowód udzielonej zgody na telefon w sprawie wyceny: wersję zgody, kanał i czas.',
      'Jak długo, zapytanie bez numeru telefonu: 12\u00A0miesięcy od dnia zapytania, potem zostaje sama statystyka.',
      'Jak długo, zapytanie z numerem telefonu: zwykle usuwamy je 12\u00A0miesięcy po ostatniej rozmowie z Tobą (telefonicznej lub osobistej) lub Twojej wiadomości w sprawie wyceny; najpóźniej 24\u00A0miesiące po pierwszym zgłoszeniu z tego numeru (kolejne zgłoszenie z tego numeru tych 24\u00A0miesięcy nie wydłuża); bez rozmowy lub wiadomości 12\u00A0miesięcy od zgłoszenia. Wyjątki: umowa (tak długo, jak wymagają przepisy) albo rozmowy o współpracy, o które sam(a) poprosisz (Twój numer i dane z tych rozmów najdłużej 12\u00A0miesięcy od ostatniej takiej rozmowy; każda kolejna taka rozmowa odnawia te 12\u00A0miesięcy). Nieodebrane próby kontaktu z naszej strony okresów nie wydłużają.',
      'Razem ze zgłoszeniem wygasa dowód zgody na telefon w sprawie wyceny. Zgodę na telefon w sprawie wyceny możesz cofnąć w każdej chwili, pisząc na biuro@investrent.com.pl, dzwoniąc do biura lub mówiąc o tym podczas rozmowy. Szczegóły: polityka prywatności (RODO).',
    ],

  },
} as const
