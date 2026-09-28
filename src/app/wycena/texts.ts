import { OFFICE_PHONE } from '../../lib/valuation.ts' // numer biura z jednego zrodla (v14: bez literalow w tekstach zgody/wyniku)

// Teksty publiczne kalkulatora wyceny (/wycena) w jednym miejscu.
// v14 (28.09.2026): teksty FINAL po 5 rundach Krytyka (_wspolne_pliki\kalkulator_v14_teksty_FINAL_do_wklejenia_2026_09_28.md), oparte na rekomendacji Prawnika; CONSENT_VERSION nadal v13 (nic nie wdrozone).
// STATUS: po recenzji Krytyka (25.09.2026), zrodlo:
// _wspolne_pliki\kalkulator_wyceny_teksty_po_recenzji_krytyka.md.
// Elementy oznaczone "PRAWNIK: przed wlaczeniem" sa wersja ROBOCZA - blokuja wydanie
// do zatwierdzenia przez prawnika (patrz lista blokerow w opisie PR #21).
// Brak superlatyw i obietnic. Twarde spacje ( ) w liczbach i numerze telefonu.

// v13 (28.09.2026, rekomendacja prawna _wspolne_pliki\kalkulator_v12_rekomendacja_prawna_2026_09_28.md): okresy przechowywania = WARIANT A (12/24 mies.) wyswietlany.
// Wariant B ("nie dluzej, niz to konieczne") zostaje w kodzie tylko jako awaryjny odwrot, ale jest niezgodny z art. 13 ust. 2 lit. a RODO - nie wracac do niego bez prawnika.
// WARUNEK WDROZENIA: ta flaga = true wchodzi RAZEM z RETENTION_CALCULATOR_ACTIVE=true w /rodo (oba miejsca naraz), nowa wersja zgody w Railway PRZED frontem, job retencji "calculator" po dry-runie.
export const RETENTION_VARIANT_A = true
export const RETENTION_A_ITEMS = [
  'Zapytanie bez numeru telefonu: dane nieruchomości i wynik zapisujemy bez danych kontaktowych i bez adresu IP. Po 12\u00A0miesiącach usuwamy szczegółowy opis wyceny, zostaje anonimowa statystyka (typ nieruchomości, przedział powierzchni, miejscowość i dzielnica z listy, stan, widełki ceny, data).',
  'Zapytanie z numerem telefonu: usuwamy z naszego systemu Twoje imię, numer i dane kontaktowe 12\u00A0miesięcy po ostatnim kontakcie w sprawie wyceny (Twojej rozmowie lub wiadomości), a jeśli go nie było, 12\u00A0miesięcy po zgłoszeniu. Nie później niż 24\u00A0miesiące po zgłoszeniu, chyba że zachodzi wyjątek z punktu (3).',
  'Jeśli dojdzie do umowy albo poprosisz nas o rozmowę o sprzedaży lub wynajmie Twojej nieruchomości z pomocą naszego biura, dane z kalkulatora dołączamy do Twojej sprawy w biurze. Przechowujemy je wtedy: przy umowie tak długo, jak trwa umowa i jak wymagają tego przepisy; przy samej rozmowie o sprzedaży lub wynajmie do 12\u00A0miesięcy po ostatniej takiej rozmowie.',
  'Dowód zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas): usuwamy razem ze zgłoszeniem.',
] as const
export const RETENTION_B_ITEMS = [
  'zapytania z kalkulatora: nie dłużej, niż to konieczne do obsługi Twojej wyceny.',
] as const
export const RETENTION_A_HOW = [
  'Zapytanie bez numeru usuwamy po 12\u00A0miesiącach (zostaje anonimowa statystyka). Zapytanie z numerem usuwamy 12\u00A0miesięcy po ostatnim kontakcie w sprawie wyceny, a najpóźniej 24\u00A0miesiące po zgłoszeniu; wyjątek: umowa albo rozmowa o sprzedaży lub wynajmie Twojej nieruchomości z pomocą naszego biura, o którą poprosisz; wtedy dane przechowujemy dłużej, jak opisano wyżej. Zgodę na telefon możesz cofnąć e-mailem, telefonicznie lub w rozmowie z agentem.',
] as const
export const RETENTION_B_HOW = [
  'Jak długo: zapytania z kalkulatora przechowujemy nie dłużej, niż to konieczne do obsługi wyceny. Zgodę na telefon w sprawie wyceny możesz cofnąć e-mailem, telefonicznie lub w rozmowie z agentem. Szczegóły: polityka prywatności (RODO).',
] as const

export const T = {
  // title bez doklejania marki: page.tsx uzywa title.absolute (layout ma szablon '%s | InvestRent Nieruchomości')
  metaTitle: 'Wycena mieszkania w Kołobrzegu online: orientacyjna cena',
  metaDescription:
    'Ile jest warte mieszkanie w Kołobrzegu lub w okolicy? Widełki ceny online, bezpłatnie i bez podawania telefonu. Domy i działki wycenia agent.',
  metaDescriptionOff:
    'Wycena mieszkania w Kołobrzegu: zostaw numer telefonu, a agent InvestRent zadzwoni i oszacuje cenę.',
  h1: 'Orientacyjna wycena mieszkania w Kołobrzegu online',
  h1Off: 'Wycena mieszkania w Kołobrzegu z pomocą agenta',
  intro: 'Ile jest warte Twoje mieszkanie w Kołobrzegu lub okolicy? Podaj kilka danych, a po chwili pokażemy orientacyjne widełki ceny i ceny za m². Liczymy je automatycznie, z użyciem sztucznej inteligencji, na podstawie danych rynkowych, dla mieszkań w Kołobrzegu i w wybranych miejscowościach regionu (lista w formularzu). Numeru telefonu podawać nie musisz.',
  introOff: 'Kalkulator online jest chwilowo niedostępny. Zostaw numer telefonu, a agent zadzwoni i oszacuje cenę, bezpłatnie i bez zobowiązań.',
  callInstead: 'Wolisz, żebyśmy zadzwonili?',
  callInsteadLink: 'Zostaw numer telefonu',
  disclaimerTop: 'Wynik jest orientacyjny i nie jest operatem szacunkowym rzeczoznawcy majątkowego.',
  // 28.09.2026 (recenzja Krytyka 6/10, pkt 1-2): zakres jest tez we wstepie; zakres wg decyzji Daniela 27.09 (caly Kolobrzeg + wybrane miejscowosci, backend #570).
  disclaimerMore: 'Poza Kołobrzegiem widełki są szersze, bo mamy mniej porównywalnych danych. Domów, działek i miejscowości spoza listy nie liczymy online.',

  formTitle: 'Dane nieruchomości',
  requiredNote: 'Pola z gwiazdką (*) są wymagane. Dla mieszkania w Kołobrzegu wymagana jest także dzielnica lub osiedle. Pozostałe pola możesz pominąć, ale pomagają zawęzić widełki.',
  fields: {
    property_type: 'Rodzaj nieruchomości',
    property_type_placeholder: 'Wybierz…',
    city: 'Miejscowość',
    city_hint: 'Domyślnie Kołobrzeg; możesz zacząć pisać nazwę. Dzielnicę lub osiedle Kołobrzegu (np. Podczele) wybierzesz niżej, w polu „Dzielnica lub osiedle”. Grzybowo, Bogucino, Budzistowo, Zieleniewo i Dźwirzyno to osobne miejscowości: wybierz je tutaj. Jeśli Twojej miejscowości nie ma na liście, wybierz „Inna lokalizacja”: widełek online nie podamy, ale w województwie zachodniopomorskim cenę oszacuje agent, a poza nim sprawdzimy, czy możemy pomóc. Zostaw numer lub zadzwoń.',
    district: 'Dzielnica lub osiedle',
    district_placeholder: 'Wybierz z listy…',
    district_hint: 'Wybierz dzielnicę lub osiedle z listy albo „Inna dzielnica”, jeśli Twojej nie ma na liście.',
    area_m2: 'Powierzchnia (m²)',
    rooms: 'Liczba pokoi (opcjonalnie)',
    floor: 'Piętro (opcjonalnie)',
    floor_hint: 'Parter wpisz jako 0, a poziom poniżej parteru (suterenę) jako -1.',
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
    scopeNote: 'Widełki liczymy automatycznie z użyciem sztucznej inteligencji, na podstawie danych rynkowych (m.in. cen ofertowych z ogłoszeń i cen transakcyjnych). To nie jest operat szacunkowy ani wycena rzeczoznawcy. Cena, za którą faktycznie sprzedasz mieszkanie, może się od nich wyraźnie różnić.',
    // v14: dopisek tylko przy miejscowosci innej niz miasto domowe (WycenaClient)
    scopeNoteWider: 'Dla Twojej miejscowości widełki są szersze, bo mamy tam mniej porównywalnych danych.',
    disclaimerFallback:
      'Wynik jest orientacyjny i nie jest operatem szacunkowym. Cena, jaką uzyskasz, zależy m.in. od stanu technicznego, standardu wykończenia, widoku z okien i sytuacji na rynku.',
    // Poza zakresem liczb online (dom, działka, miejscowość spoza listy) - to reguła, nie brak danych.
    outOfScopeTitle: 'Dla tej nieruchomości nie liczymy widełek online',
    outOfScopeBody:
      `Widełki online liczymy dla mieszkań w Kołobrzegu i w wybranych miejscowościach regionu (lista w formularzu). Dla domów, działek i innych miejscowości w województwie zachodniopomorskim cenę oszacuje agent, bezpłatnie i bez zobowiązań: zostaw numer i zaznacz zgodę na telefon w sprawie wyceny, zadzwonimy tylko w tej sprawie. Jeśli nieruchomość jest poza tym województwem, napisz na biuro@investrent.com.pl lub zadzwoń pod ${OFFICE_PHONE}: sprawdzimy, czy możemy pomóc.`,
    // W zakresie, ale silnik nie ma dość porównań.
    noNumbersTitle: 'Nie mamy dość danych, żeby podać widełki',
    noNumbersBody:
      'Dla tej nieruchomości mamy za mało porównywalnych danych rynkowych, żeby rzetelnie wyznaczyć widełki. Zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny: agent zadzwoni i oszacuje cenę.',
    again: 'Wyceń inną nieruchomość',
  },

  lead: {
    titleRange: 'Chcesz omówić wynik z agentem?',
    bodyRange: 'Zostaw numer telefonu i zaznacz zgodę na telefon w sprawie wyceny. Agent zadzwoni, omówi z Tobą wynik i oszacuje cenę, bezpłatnie i bez zobowiązań.',
    titleFallback: 'Zostaw numer, a agent zadzwoni w sprawie wyceny',
    bodyFallback: 'Zaznacz zgodę na telefon w sprawie wyceny. Agent zadzwoni i powie, jak może pomóc: dla mieszkań, domów i działek w województwie zachodniopomorskim oszacuje cenę, bezpłatnie i bez zobowiązań. To nie jest operat.',
    name: 'Imię (opcjonalnie)',
    phone: 'Numer telefonu',
    phoneHint: 'Podaj 9 cyfr (numer polski) albo numer zaczynający się od + i kierunkowego kraju, np. +49.',
    // Teksty zgód i klauzuli = wersja CONSENT_VERSION (lib/valuation.ts). Zmiana JAKIEGOKOLWIEK z tych tekstów = nowy numer wersji.
    // Zatwierdzenie treści: Krytyk + przegląd AI (kancelaria nieangażowana wg decyzji Daniela 25.09; ryzyko przyjęte świadomie).
    // v11 (decyzja Daniela 26.09.2026): kalkulator startuje BEZ zgody marketingowej. Jedna zgoda: na oddzwonienie w sprawie wyceny
    // (NIEZAZNACZONA domyślnie, wymagana przy podanym numerze). Marketing = osobny, późniejszy krok (v12) po gotowym mechanizmie (#507).
    // v12 (27.09.2026, wg klauzula_kalkulator_T11_propozycja_2026_09_26.md): cofniecie zgody tylko e-mailem; Anthropic wg warunkow API dostawcy; bez listy "nie dzwonimy" i bez obietnicy usuniecia w miesiac; IP "krotkotrwale"; okresy: wariant B (domyslny), wariant A = RETENTION_VARIANT_A (wylaczony do wlaczenia joba retencji, razem z RETENTION_CALCULATOR_ACTIVE w polityce).
    // v13/v14 (28.09.2026, rekomendacja prawna + teksty FINAL): consentCall/consentShort, cofniecie zgody trzema drogami (e-mail, telefon do biura, slowo do agenta), retencja WARIANT A, IP rozdzielony na trzy miejsca (baza / pamiec serwera / logi dostawcow), bez daty umowy powierzenia Railway. Numer biura = OFFICE_PHONE (lib/valuation.ts).
    // Bez skrótu numeru (id_hash) i bez klucza HMAC w ścieżce kalkulatora; dowód zgody = wersja, kanał, czas, wygasa ze zgłoszeniem po 12 mies.
    consentCallRequired: '(wymagana, jeśli podajesz numer telefonu)',
    consentCall:
      `Zgadzam się, aby INVESTRENT sp. z o.o. (biuro nieruchomości InvestRent) zadzwoniła do mnie pod podany numer wyłącznie w sprawie wyceny mojej nieruchomości. Zgodę mogę cofnąć w każdej chwili: e-mailem (biuro@investrent.com.pl), telefonicznie (${OFFICE_PHONE}) lub mówiąc o tym agentowi podczas rozmowy.`,
    // Klauzula informacyjna (art. 13 RODO): pełne dane administratora wg odpisu KRS (api-krs.ms.gov.pl, 25.09.2026).
    // Fakty (kod backendu origin/main 26.09.2026): IP w limiterze w pamięci procesu jako skrót HMAC z solą procesu (okno 24 h; sprzątanie co 10 min, #505),
    // bez zapisu w bazie; ai_valuations bez kontaktu i IP; odbiorcy danych leada: Brevo (mail do managerów z imieniem i numerem), kalendarz Google (zadanie z samym imieniem i linkiem do karty; NUMER do kalendarza NIE trafia, googleEventPrivacy.ts, decyzja 25.09; nie dopisywać numeru do klauzuli).
    // WARUNEK PUBLIKACJI (zdanie o IP "około 24 godzin"): #505 potwierdzone na produkcji i brak IP w logach aplikacji (kod origin/main 26.09.2026: req.ip tylko jako klucz limitera (skrót HMAC) i remoteip do Turnstile; brak logowania IP; osobno leadLimit express-rate-limit trzyma IP w pamięci do 1 h).
    // WARUNKI PUBLIKACJI: (1) backend dowodu zgody na oddzwonienie + test na żywo; (2) kasowanie dowodu z leadem po 12 mies. (dziś job zostawia zredagowaną
    // notatkę [Zgoda-kalkulator]); (3) potwierdzenia dostawców (tabela_dostawcow_kalkulator_2026_09_25.md); (4) polityki #22 i wersja DE.
    consentInfo: [
      { h: 'Kto jest administratorem Twoich danych.', t: 'Administratorem jest INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, ul. Ratuszowa\u00A012/1\u00A0lok.\u00A03, 78-100 Kołobrzeg, KRS\u00A00001069797, NIP\u00A0671\u00A0185\u00A085\u00A059. Działamy pod marką InvestRent. Kontakt: biuro@investrent.com.pl.' },
      { h: 'Po co i na jakiej podstawie.', t: 'Wykorzystujemy Twoje dane w tych celach:', items: [
        'obliczenie i pokazanie szacunku — wykonanie Twojego żądania (art.\u00A06 ust.\u00A01 lit.\u00A0b RODO);',
        'rozmowa o sprzedaży lub wynajmie Twojej nieruchomości z pomocą naszego biura, o którą sam(a) poprosisz — działania na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO);',
        'umowa, jeśli do niej dojdzie — wykonanie umowy (art. 6 ust. 1 lit. b RODO) oraz obowiązki prawne wynikające z przepisów, np. podatkowych (art. 6 ust. 1 lit. c RODO);',
        'telefon w sprawie wyceny — Twoja zgoda (art.\u00A06 ust.\u00A01 lit.\u00A0a RODO), jeśli podasz numer i zaznaczysz zgodę na telefon w sprawie wyceny;',
        'dowód udzielonej zgody na telefon w sprawie wyceny (wersja zgody, kanał, czas), aby wykazać jej udzielenie i bronić się przed roszczeniami — nasz prawnie uzasadniony interes (art.\u00A06 ust.\u00A01 lit.\u00A0f oraz art.\u00A07 ust.\u00A01 RODO);',
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
        'kalendarz Google pracowników biura, jeśli mają go połączonego z naszym systemem (zadanie oddzwonienia z imieniem i odnośnikiem do karty w naszym systemie).',
      ] },
      { h: 'Zabezpieczenia przy przekazaniu poza EOG.', t: 'Część dostawców ma siedzibę w USA lub może przetwarzać dane poza Europejskim Obszarem Gospodarczym. Na Twój wniosek (biuro@investrent.com.pl) wskażemy zabezpieczenie zastosowane wobec danego dostawcy oraz, jeśli to standardowe klauzule umowne, prześlemy ich kopię. Zabezpieczenia:', items: [
        'Cloudflare: standardowe klauzule umowne UE zawarte w umowie dostawcy; korzysta on też z ram ochrony danych UE-USA (Data Privacy Framework), o ile jego certyfikacja jest w danym czasie aktywna; Google: Data Privacy Framework, a w razie jego braku standardowe klauzule umowne UE;',
        'Vercel (hosting strony): Data Privacy Framework oraz umowa powierzenia przetwarzania danych;',
        'Railway: umowa powierzenia; mechanizm przekazania (Data Privacy Framework albo standardowe klauzule umowne UE) wskażemy na wniosek;',
        'Anthropic: zabezpieczenie wskazane w warunkach API dostawcy; szczegóły wskażemy na wniosek;',
        'Supabase (baza danych): dane przechowywane w regionie UE (Irlandia); umowa powierzenia zawiera standardowe klauzule umowne UE.',
      ] },
      { h: 'Jak długo.', t: 'Okresy przechowywania:', items: [
        'Adres IP, nasza aplikacja: w pamięci serwera, do 24\u00A0godzin (limit zapytań); nie zapisujemy go w bazie danych.',
        'Adres IP, dostawca hostingu naszego serwera (Railway): dzienniki techniczne do 30\u00A0dni.',
        'Adres IP, dostawcy hostingu strony (Vercel) i ochrony formularza (Cloudflare): w ich logach technicznych według ich zasad i okresów.',
        ...(RETENTION_VARIANT_A ? RETENTION_A_ITEMS : RETENTION_B_ITEMS),
      ] },
      { h: 'Twoje prawa.', t: `Możesz żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia oraz w każdej chwili cofnąć zgodę na telefon w sprawie wyceny (cofnięcie nie wpływa na zgodność z prawem tego, co zrobiliśmy wcześniej). Zgodę możesz cofnąć e-mailem (biuro@investrent.com.pl), telefonicznie (${OFFICE_PHONE}) albo mówiąc o tym pracownikowi biura podczas rozmowy; wystarczy powiedzieć, że nie chcesz, żebyśmy dzwonili. Po cofnięciu nie zadzwonimy do Ciebie w sprawie wyceny. Wnioski o pozostałe prawa wyślij na biuro@investrent.com.pl. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Podanie danych jest dobrowolne; bez numeru telefonu pokażemy wynik (jeśli liczymy go online), ale nie oddzwonimy.` },
      { h: 'Prawo sprzeciwu.', highlight: true, t: 'Masz prawo w każdej chwili wnieść sprzeciw wobec przetwarzania Twoich danych opartego na naszym prawnie uzasadnionym interesie (dowód zgody na telefon w sprawie wyceny, adres IP; art.\u00A06 ust.\u00A01 lit.\u00A0f RODO), z przyczyn związanych z Twoją szczególną sytuacją (art.\u00A021 RODO). Napisz na biuro@investrent.com.pl lub powiedz o tym podczas rozmowy.' },
    ],
    // v12: krotkie streszczenie na wierzchu, pelna klauzula (consentInfo) w rozwijanym bloku
    consentShort: 'Administratorem jest INVESTRENT sp. z o.o. (InvestRent). Numer (i imię, jeśli je podasz) zapisujemy w naszym systemie i przekazujemy pracownikom biura, żeby agent mógł do Ciebie zadzwonić w sprawie wyceny. Rozmowa o sprzedaży lub wynajmie to osobna sprawa: numeru do niej (i do innych celów) użyjemy tylko na Twoją prośbę. Zgodę cofniesz w każdej chwili, także telefonicznie lub w rozmowie z agentem. Pełna informacja o danych jest poniżej.',
    consentInfoSummary: 'Pełna informacja o przetwarzaniu danych (art. 13 RODO)',
    consentInfoMore: 'Szczegóły znajdziesz w ',
    consentInfoLink: 'polityce prywatności (RODO)',
    consentInfoSuffix: '.',
    optionalLabel: '(opcjonalnie)',
    submit: 'Proszę o kontakt',
    submitting: 'Wysyłanie…',
    errPhone: 'Wpisz numer telefonu: 9 cyfr (numer polski) albo numer zaczynający się od + i kierunkowego kraju, np. +49.',
    errConsent: 'Zaznacz zgodę na telefon w sprawie wyceny. Bez niej nie możemy do Ciebie zadzwonić.',
    doneTitle: 'Dziękujemy, otrzymaliśmy Twój numer',
    doneBody: `Zwykle oddzwaniamy w ciągu 24\u00A0godzin, najczęściej szybciej. Wolisz zadzwonić do nas? Numer biura: ${OFFICE_PHONE}.`,
  },

  // Komunikaty konczace sie na "zadzwon:" - numer biura dopisuje komponent jako link tel:.
  errors: {
    disabled: 'Kalkulator jest chwilowo niedostępny. Zostaw numer poniżej lub zadzwoń:',
    // when = wynik formatRetryAfter(retry_after_seconds z backendu; okno 1 h dla luźnego limitu, 24 h dla limitu 3 wycen)
    rateLimited: (when: string) => `Z tej sieci wykonano już maksymalną liczbę wycen. Spróbuj ponownie za około ${when}. Możesz też zostawić numer poniżej lub zadzwonić:`,
    network: 'Nie udało się połączyć z kalkulatorem. Spróbuj ponownie za chwilę, a jeśli problem się powtórzy, sprawdź połączenie z internetem. Możesz też zostawić numer poniżej lub zadzwonić:',
    server: 'Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę. Możesz też zostawić numer poniżej lub zadzwonić:',
    turnstilePending: 'Weryfikacja antyspamowa jeszcze się ładuje. Poczekaj chwilę i spróbuj ponownie.',
    invalid: 'Któreś z pól ma nieprawidłową wartość. Sprawdź formularz i spróbuj ponownie. Jeśli to nie pomoże, zadzwoń:',
    // Zbyt szybkie wysłanie formularza (próg czasowy) - neutralny komunikat, bez ujawniania mechanizmu.
    tryAgain: 'Nie udało się wysłać zapytania. Spróbuj ponownie za chwilę.',
    leadFail: 'Nie udało się wysłać numeru. Spróbuj ponownie lub zadzwoń:',
  },

  how: {
    title: 'Jak liczymy szacunek',
    moreSummary: 'Więcej: co zapisujemy i jak długo',
    // v14 (28.09.2026, FINAL po rundzie 5 Krytyka): metoda osobno, prywatnosc krotko; punkt 7 = retencja (bez dubletu naglowka "Jak dlugo" i zdania o cofnieciu)
    body: [
      'Porównujemy dane Twojej nieruchomości z cenami transakcyjnymi i ofertowymi podobnych nieruchomości z Twojej okolicy. Szacunek liczymy automatycznie z użyciem sztucznej inteligencji, bez oględzin. Ceny ofertowe bywają wyższe od faktycznie zapłaconych. W mniejszych miejscowościach widełki są szersze, bo danych jest mniej.',
      'Widełki są zaokrąglone i mają charakter orientacyjny. Nie zastępują operatu szacunkowego sporządzanego przez rzeczoznawcę majątkowego (np. do kredytu, sądu lub urzędu). Szacunek z kalkulatora do niczego Cię nie zobowiązuje. Szacunek agenta to rozmowa o Twojej nieruchomości; on także nie jest operatem szacunkowym.',
      'Do dostawcy sztucznej inteligencji (Anthropic) i dostawcy danych rynkowych (Cenogram) trafiają wyłącznie dane nieruchomości, bez Twoich danych kontaktowych i adresu IP.',
      'Bez numeru: w naszej bazie zapisujemy dane nieruchomości i wynik, bez danych kontaktowych i bez adresu IP.',
      'Z numerem: zapisujemy w naszym systemie także Twoje imię, numer, dane nieruchomości i wynik oraz dowód zgody na telefon (wersja zgody, kanał, czas). Imię trafia też e-mailem do pracowników biura, razem z odnośnikiem do zgłoszenia w naszym systemie; numeru w e-mailu nie ma. Do kalendarza Google pracownika (jeśli ma połączony kalendarz firmowy) trafia tylko imię i odnośnik do zgłoszenia w naszym systemie, bez numeru.',
      'Adres IP to numer identyfikujący Twoje połączenie z internetem. Nie zapisujemy go w naszej bazie razem z wyceną ani z Twoimi danymi kontaktowymi. Przetwarzamy go tylko technicznie, żeby ograniczyć liczbę zapytań z jednego połączenia i chronić formularz: dokładne miejsca i okresy podajemy w pełnej informacji o danych poniżej.',
      ...(RETENTION_VARIANT_A ? RETENTION_A_HOW : RETENTION_B_HOW),
    ],

  },
} as const
