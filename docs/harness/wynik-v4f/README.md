# Wynik kalkulatora v4f — zgodność z makietą (11.11.2026)

Makieta: `_wspolne_pliki\MAKIETA_KALKULATOR_WYNIK_11_11\zrodlo_makiety_v4f.html` (+ `M_v4f_*` PNG), zatwierdzona przez Daniela 11.11.
Zrzuty z implementacji: `W_v4f_<390|1440>_<stan>.png` (prawdziwy komponent `ResultV4f` z danymi syntetycznymi, nie zrzuty makiety).
Zestawienie makieta | implementacja: `POROWNANIE_<390|1440>_<stan>.png` (makieta po lewej, implementacja po prawej; 1440 pomniejszone do 50%).
Liczby w zrzutach są PRZYKŁADOWE (te same co w makiecie). Pola formularza numeru to istniejący `LeadPanel` (nie jest częścią tego PR; w zrzutach jest ramka-zaślepka).

Stany sprawdzone obrazem makiety obok obrazu implementacji: nowy, szczegóły, rozwinięte (trend + zawężanie + skąd liczby), zawężony, za mało (kafel i szersza grupa), brak trendu, bez filtrów, zmiana pokoi — każdy w 390 i 1440 px.
NIE sprawdzone obrazem: stany `blad` i `wyslane` (to formularz numeru: istniejący `LeadPanel` v2, bez zmian).

| # | Element makiety | Wynik | Uwaga |
|---|---|---|---|
| 1 | Eyebrow „Wycena orientacyjna · mieszkanie 45 m², Kołobrzeg” | PASS | miasto i metraż z formularza |
| 2 | Zdanie-odpowiedź „Połowę mieszkań … sprzedano za 531–644 tys. zł.” | PASS | z p25–p75 × metraż; brak, gdy transakcji za mało |
| 3 | Kafel „Ceny transakcyjne”: zakres, „Typowa cena”, „na podstawie N transakcji” | PASS | |
| 4 | Data przy transakcjach „do 29.10.2026” | RÓŻNICA | API zwraca miesiąc (MM.RRRR): „do 10.2026” |
| 5 | Kafel „Ceny ofertowe”: „Dla 2 pokoi, piętro 1–3 · połowa ofert”, N wpisów z portali | PASS | „wpisów z portali” wg decyzji Dyrektora 11.11 |
| 6 | Plakietki „Zawężono” / „Za mało danych” | PASS | |
| 7 | Stan „za mało”: ostrzeżenie, „Szersza grupa: …”, zakres i typowa cena szerszej grupy | PASS | treść kryteriów z backendu (kolejność porzucania: dzielnica, stan, piętro, pokoje) |
| 8 | Wniosek + zdanie o negocjacji | PASS | zdanie tylko gdy mediana ofert > mediana transakcji (uwaga Prawnika) |
| 9 | „Szczegóły liczb (średnia, cena za m²)” | RÓŻNICA | brak „średniej”: backend PR1 jej nie zwraca; są typowa i połowa cen za m² |
| 10 | Blok „Zostaw numer telefonu” (telefon, pora, zgoda, przycisk) | POZA ZAKRESEM | istniejący `LeadPanel` v2; tekst formularza w makiecie oznaczony „nie wdrażać” (Prawnik/Daniel) |
| 11 | Wykres trendu, wartości przy punktach, opis liczby transakcji, zmiana procentowa | PASS | oś wyliczana z danych (nie wpisana na sztywno), tekstowa alternatywa w tabeli |
| 12 | Etykiety okresów „IV kw. 25 …” | RÓŻNICA | okresy 3-miesięczne liczone wstecz od najnowszej transakcji (reguła Dyrektora), nie kwartały kalendarzowe: etykieta „do 01.26”, pełny zakres w tekście |
| 13 | Brak wykresu: zdanie dlaczego | PASS | |
| 14 | „Zawęź wynik”: chipy Pokoje/Piętro (rozwijane), Stan, Dzielnica | PASS | układ i zachowanie jak w makiecie |
| 15 | Etykiety stanu „Dobry / Po remoncie”, dzielnice „Centrum / Podczele / Budzistowo” | RÓŻNICA | stan: słownik backendu (do remontu, do zamieszkania, deweloperski, do wykończenia); dzielnice: lista z konfiguracji strony |
| 16 | Chip pominięty (przerywana ramka, „pominięty: za mało wpisów”) | PASS | `aria-disabled`, tekst w nazwie przycisku; różnica: bez przekreślenia nazwy |
| 17 | Region „na żywo” z N po każdej zmianie, „Wyczyść stan i dzielnicę” / „Wyczyść filtry” | PASS | `aria-live="polite"`, „96 ze 188” z liczby bazowej |
| 18 | „Skąd te liczby?” | RÓŻNICA | pominięte „z rynku wtórnego” (backend tego nie gwarantuje) |
| 19 | Zastrzeżenie + „Dlaczego cena sprzedaży może być inna” + „Wyceń inną nieruchomość” | PASS | link otwiera „Skąd te liczby?” i przenosi fokus |
| 20 | Nagłówek strony „Ceny w Twojej okolicy” | PASS | h1 przy wyniku v4f; kicker z makiety zastępuje okruszki strony |
| 21 | Zaokrąglanie do 5 tys. zł przy N<30 | NOWE | z notatek v4; krótka informacja pod wnioskiem (tekst do akceptacji) |

## Dostępność (test akceptacyjny przed włączeniem flagi)
- Kontrast: zmierzony skryptem na renderowanych stanach „zmień” i „za mało”, 87 elementów tekstowych, najniższy 7,05:1 (wymóg 4,5:1; duży tekst 3:1). Wykres: tekst `#3a4356`/`#1f2937` na białym (> 9:1).
- Cele dotyku: chipy i nagłówki akordeonów 48 px.
- ARIA: akordeony `aria-expanded`/`aria-controls`/region; chipy `aria-pressed`; rozwijane „Pokoje/Piętro” `aria-expanded`; wykres `role="img"` z listą wartości + ukryta tabela (okres, typowa cena, liczba transakcji); N i komunikaty w `aria-live="polite"`.
- Klawiatura: wszystko to `button`; widoczny fokus (3 px).
- Baner cookies na niskim ekranie (390×560): zajmuje ok. 41% wysokości, przyciski mieszczą się bez przewijania w poziomie; wynik v4f nie ma przyklejonych elementów (sticky wyłączony), więc nic się nie nakłada. Do ręcznego sprawdzenia przez Dyrektora: czytnik ekranu (NVDA/VoiceOver) — nie testowano.
