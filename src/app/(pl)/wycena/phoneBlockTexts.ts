// Teksty bloku telefonu pod wynikiem /wycena (flaga NEXT_PUBLIC_WYCENA_PHONE_BLOCK).
// ZATWIERDZONE DOSLOWNIE przez Daniela 15.10.2026 wg opinii Prawnika (_wspolne_pliki\Kalkulator_zgoda_telefon_Prawnik_2026_10_15.md, sekcje 1, 2 i pkt 4):
// etykieta pola, przycisk, zdanie obok pola, klauzula informacyjna i dopisek "nie jest operat". NIE ZMIENIAC BEZ NOWEJ AKCEPTACJI (zmiana tekstu = nowa wersja ponizej).
// Pozostale teksty bloku (title, exchange, done*, mobileIntroShort, callAlt) = teksty strony do oceny (Krytyk/Codex), nie tekst prawny.

// Wersja tekstu wysylana do CRM razem z numerem (dowod, co widzial uzytkownik). Format: wycena-RRRR-MM-DD-vN. Zmiana tekstow prawnych nizej = nowa wersja.
export const PHONE_BLOCK_CONSENT_VERSION = 'wycena-2026-10-15-v1'
export const PHONE_BLOCK_VERSION_FORMAT = /^wycena-\d{4}-\d{2}-\d{2}-v\d+$/

export const PHONE_BLOCK_LEGAL = {
  label: 'Twój numer telefonu',
  submit: 'Poproś o bezpłatny telefon od agenta',
  clickNotice: 'Klikając, prosisz o kontakt telefoniczny w sprawie dokładniejszej wyceny tej nieruchomości. To nie jest zgoda na przesyłanie ofert marketingowych.',
  // Klauzula informacyjna; link "Polityka prywatności" renderowany miedzy clauseBeforeLink a clauseAfterLink (zdanie konczy sie kropka po linku).
  clauseBeforeLink: 'Administratorem danych jest InvestRent sp. z o.o. (ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg). Numeru telefonu użyjemy wyłącznie do jednorazowego kontaktu w sprawie dokładniejszej wyceny tej nieruchomości. Dane przechowujemy maksymalnie 12 miesięcy od ostatniego kontaktu, chyba że zostaniemy poproszeni o dalszą współpracę. Pełne informacje: ',
  clauseLinkLabel: 'Polityka prywatności',
  clauseAfterLink: '.',
  clauseLinkHref: '/rodo',
  notAppraisal: 'To nie jest operat szacunkowy rzeczoznawcy majątkowego.',
} as const

export const PHONE_BLOCK_TEXTS = {
  title: 'Bezpłatna, dokładniejsza wycena od agenta',
  // Wymiana wartosci: co klient dostaje po kontakcie. Bez terminu oddzwonienia, bez obietnicy dokladnosci.
  exchange: 'Szeroki przedział widzisz powyżej bez żadnych warunków. Jeśli chcesz, agent doprecyzuje szacunek: poda węższy przedział oraz cenę za m² wraz z porównaniem. Bezpłatnie i bez zobowiązań.',
  phoneHint: 'Podaj 9 cyfr (numer polski) albo numer zaczynający się od + i kierunkowego kraju, np. +49.',
  sending: 'Wysyłamy…',
  errPhone: 'Wpisz numer telefonu: 9 cyfr (numer polski) albo numer zaczynający się od + i kierunkowego kraju.',
  // Potwierdzenie bez terminu oddzwonienia.
  doneTitle: 'Dziękujemy, zgłoszenie zapisane',
  doneBody: 'Agent skontaktuje się z Tobą telefonicznie w sprawie dokładniejszej wyceny.',
  callAlt: 'Wolisz zadzwonić sam?',
  mobileIntroShort: 'Szacunkowy przedział ceny mieszkania online, bez podawania telefonu. To nie jest operat rzeczoznawcy.',
} as const