// Treść huba „Nadmorskie miejscowości pod Kołobrzegiem" i 4 podstron miejscowości (15.10.2026).
// Źródła faktów i daty: SEO_hub_nadmorskie_miejscowosci_tekst_DO_DANIELA_2026_10_15.md (_wspolne_pliki), sekcja „Skąd te dane".
// ZASADY: Kołobrzeg nigdy nie jest negatywnym punktem odniesienia; bez nazw inwestycji deweloperskich; bez czasu sprzedaży
// i liczb o transakcjach/klientach; ceny tylko „ofertowe z naszej bazy" (kod pokazuje je wyłącznie przy próbie >= 3).
// Treść jest w danych (nie w komponentach): w produkcie SaaS każde biuro ma własny zestaw (docelowo z CRM).

import type { RcnSample } from '@/lib/localityOffers'

export type LocalityStatus = 'draft' | 'approved'

export interface LocalityContent {
  slug: string
  name: string
  /** Nazwy w polu address_city (kanoniczna + aliasy). */
  cityNames: string[]
  gmina: string
  /** Dojazd samochodem do centrum Kołobrzegu (OSM/OSRM, 15.10.2026). */
  distanceKm: string
  driveMin: string
  /** Liczba mieszkańców z NSP 2021 (GUS), tekst; null = niepotwierdzone, nie pokazujemy. */
  residents: string | null
  bus: string
  school: string | null
  /** Ceny transakcyjne z RCN (do 01.2026); null = brak danych. */
  rcn: RcnSample | null
  /** Podstrona jest indeksowalna i w sitemap TYLKO przy 'approved'. */
  status: LocalityStatus
  /** Akapit w sekcji miejscowości na hubie i na podstronie. */
  summary: string
}

export const BEACH_RANGE = 'od ok. 100 m do ok. 1 km (zależnie od oferty)'

export const LOCALITIES: LocalityContent[] = [
  {
    slug: 'grzybowo',
    name: 'Grzybowo',
    cityNames: ['Grzybowo'],
    gmina: 'Kołobrzeg',
    distanceKm: 'ok. 8 km',
    driveMin: 'ok. 13 min',
    residents: null,
    bus: 'Express Bus, PKS',
    school: null,
    // RCN (Cenogram), lokale mieszkalne, wolny rynek, obręb Grzybowo, 2024-10-04..2025-12-19: 49 transakcji, mediana 12 578 zł/m2
    rcn: { n: 49, medianPerM2: 12578, period: '10.2024–12.2025' },
    status: 'draft',
    summary:
      'Grzybowo to wieś tuż za miastem — ok. 8 km i ok. 13 minut autem od centrum Kołobrzegu, w gminie Kołobrzeg. Przez miejscowość kursują autobusy Express Bus i PKS. To aktywny rynek nowych apartamentów: w Rejestrze Cen Nieruchomości od października 2024 do grudnia 2025 jest 49 transakcji lokali mieszkalnych na wolnym rynku, w większości z rynku pierwotnego, o średniej powierzchni ok. 54 m². Działamy tu szeroko: od apartamentów, przez pensjonaty, po budynki do wykończenia. Przykłady z naszej oferty to obiekty inwestycyjne; jedna z ofert znajduje się ok. 900 m od morza.',
  },
  {
    slug: 'sianozety',
    name: 'Sianożęty',
    cityNames: ['Sianożęty', 'Sianozety'],
    gmina: 'Ustronie Morskie',
    distanceKm: 'ok. 13 km',
    driveMin: 'ok. 16 min',
    residents: 'ok. 720',
    bus: 'linia Ustronie – Kołobrzeg',
    school: 'w Ustroniu Morskim',
    // RCN, obręb Sianożęty od 2024-10-01: 3 transakcje -> brak mediany
    rcn: { n: 3, medianPerM2: null, period: 'od 10.2024' },
    status: 'draft',
    summary:
      'Sianożęty to niewielka miejscowość w gminie Ustronie Morskie, ok. 13 km od centrum Kołobrzegu (ok. 16 minut autem), sąsiadująca z Ustroniem Morskim. Mieszka tu ok. 720 osób, a od 1998 roku ich liczba wzrosła o blisko 60%. Dominuje zabudowa apartamentowa, hotele i pensjonaty. Najbliższa szkoła podstawowa jest w Ustroniu Morskim; przynależność do obwodu potwierdza gmina.',
  },
  {
    slug: 'ustronie-morskie',
    name: 'Ustronie Morskie',
    cityNames: ['Ustronie Morskie'],
    gmina: 'Ustronie Morskie',
    distanceKm: 'ok. 14 km',
    driveMin: 'ok. 17 min',
    residents: 'ok. 2,4 tys.',
    bus: 'linia Ustronie – Kołobrzeg',
    school: 'w miejscowości',
    // RCN, poziom GMINY Ustronie Morskie (obejmuje Sianożęty), 2025-01-16..2026-01-22: 158 transakcji, mediana 12 462 zł/m2
    rcn: { n: 158, medianPerM2: 12462, period: '01.2025–01.2026', level: 'gmina' },
    status: 'draft',
    summary:
      'Ustronie Morskie leży ok. 14 km od centrum Kołobrzegu — samochodem ok. 17 minut. Wieś liczy ok. 2,4 tys. mieszkańców, a w sezonie liczba osób na miejscu wyraźnie rośnie. Zabudowa to przede wszystkim apartamenty, hotele i pensjonaty. Do Kołobrzegu jeździ autobus przez Sianożęty, Bagicz i Podczele; w miejscowości działa szkoła podstawowa, są sklepy i gabinety lekarza rodzinnego, a liceum jest w Kołobrzegu.',
  },
  {
    slug: 'dzwirzyno',
    name: 'Dźwirzyno',
    cityNames: ['Dźwirzyno', 'Dzwirzyno'],
    gmina: 'Kołobrzeg',
    distanceKm: 'ok. 14 km',
    driveMin: 'ok. 22 min',
    residents: 'ok. 660',
    bus: 'Express Bus, PKS',
    school: 'w miejscowości',
    // RCN, obręb Dźwirzyno od 2024-10-01: 7 transakcji -> brak mediany (próba < 10)
    rcn: { n: 7, medianPerM2: null, period: 'od 10.2024' },
    status: 'draft',
    summary:
      'Dźwirzyno leży w gminie Kołobrzeg, ok. 14 km od centrum miasta (ok. 22 minuty autem), między morzem a jeziorem Resko Przymorskie. Stałych mieszkańców jest ok. 660, a latem miejscowość żyje turystyką. Do Kołobrzegu kursują autobusy Express Bus i PKS; w miejscowości są szkoła podstawowa i sklepy. W ofercie bywa apartament w kameralnym kompleksie, kilka minut spacerem od plaży.',
  },
]

export const HUB = {
  path: '/nadmorskie-miejscowosci-kolobrzeg',
  title: 'Nadmorskie miejscowości pod Kołobrzegiem — porównanie',
  description:
    'Ustronie Morskie, Sianożęty, Dźwirzyno i Grzybowo: dojazd do Kołobrzegu, plaża, komunikacja, szkoły i oferty nieruchomości w jednym porównaniu.',
  h1: 'Nadmorskie miejscowości pod Kołobrzegiem — porównanie dla kupujących',
  intro:
    'Kołobrzeg jest największym i najlepiej rozwiniętym rynkiem nieruchomości na tym odcinku wybrzeża: ma pełną infrastrukturę i najszerszą ofertę, także w naszym katalogu. Wokół miasta leżą mniejsze miejscowości o innym charakterze — spokojniejsze, bardziej zielone, o mniejszej skali i innym typie zabudowy. Dla części kupujących to dobre uzupełnienie rynku kołobrzeskiego, a nie jego zamiennik. Poniżej porównujemy cztery z nich — Ustronie Morskie, Sianożęty, Dźwirzyno i Grzybowo — na podstawie faktów, które sprawdzamy w pracy: dojazd, komunikacja, szkoły, plaża i aktualna oferta.',
  tableNote:
    'Ceny ofertowe pochodzą z naszej bazy ofert (nie są cenami transakcyjnymi ani poziomem całego rynku); zakres pokazujemy tylko przy co najmniej 3 ofertach. Ceny transakcyjne pochodzą z Rejestru Cen Nieruchomości (RCN; dane do stycznia 2026 — rejestr publikuje z opóźnieniem) i dotyczą lokali mieszkalnych na wolnym rynku; medianę podajemy tylko przy próbie co najmniej 10 transakcji. Wartości z różnych miejscowości nie są wprost porównywalne: różnią się strukturą (nowe apartamenty i rynek wtórny, powierzchnia lokali).',
  buyersHeading: 'Kto kupuje w tych miejscowościach',
  buyers:
    'Kupują osoby z całej Polski, a także Niemcy. Mają różne potrzeby: inną skalę miejscowości, inny typ zabudowy, inną okolicę. Przy wyborze najczęściej liczą się dwie rzeczy: odległość od morza i odległość od Kołobrzegu.',
  differentHeading: 'Co wyróżnia te miejscowości',
  different:
    'Są to miejscowości o innym charakterze niż miasto: mniejsza skala, więcej zieleni i natury, spokojniejsza okolica. Jest też uczciwa uwaga: życie koncentruje się w nich głównie w sezonie, a poza sezonem jest tu wyraźnie ciszej — mieszkają stali mieszkańcy, ale ruch jest mniejszy. Dla jednych to zaleta, dla innych powód, by wybrać inną lokalizację; każda miejscowość znajduje swojego odbiorcę.',
  dailyHeading: 'Dojazd i codzienność',
  daily:
    'Do każdej z tych miejscowości dojeżdża się z Kołobrzegu samochodem w kilkanaście minut, kursują też autobusy; rozkłady sprawdzaj u przewoźników. Sklepy są w każdej z nich, a liceum jest w Kołobrzegu. Transakcje odbywają się przez cały rok, w zależności od tego, czego kto szuka.',
  faq: [
    { q: 'Która miejscowość jest najbliżej Kołobrzegu?', a: 'Grzybowo: ok. 8 km, ok. 13 minut samochodem.' },
    { q: 'Czy da się tu mieszkać przez cały rok?', a: 'Tak, są stali mieszkańcy; poza sezonem jest wyraźnie ciszej.' },
    { q: 'Ile jest do plaży?', a: 'Zależy od oferty: od ok. 100 m do ok. 1 km.' },
    {
      q: 'Czym te miejscowości różnią się od Kołobrzegu?',
      a: 'Charakterem, skalą i typem zabudowy: są mniejsze i bardziej zielone, a zabudowa to głównie apartamenty, hotele i pensjonaty (Grzybowo — również domy i obiekty inwestycyjne). Kołobrzeg ma pełną infrastrukturę i największą ofertę.',
    },
    { q: 'Skąd wiecie, jaka jest oferta?', a: 'Aktualne oferty widać w katalogu; jeśli nie ma tam odpowiedniej, zapytaj w biurze o propozycje.' },
  ],
  cta: 'Napisz lub zadzwoń do biura — powiemy, jakie propozycje mamy aktualnie w tych miejscowościach i w Kołobrzegu.',
}

export function getLocality(slug: string): LocalityContent | undefined {
  return LOCALITIES.find(l => l.slug === slug)
}
