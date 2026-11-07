// Treść opisowa strony /wynajem (08.10.2026, SEO; zgoda Daniela, cel: ok. 331 → 800+ słów dla fraz „wynajem mieszkań Kołobrzeg",
// „mieszkania na wynajem Kołobrzeg", „wynajem długoterminowy/sezonowy"). ZASADY: tylko fakty prawdziwe i już publicznie opisane na stronie;
// bez liczb cen i bez obietnic; zdania o kosztach dosłownie wg Prawnika (legalFooter.ts w CRM, 08.10.2026). Przed wdrożeniem: Krytyk + Prawnik + Daniel.

export interface ContentSection { heading: string; paragraphs?: string[]; bullets?: string[] }

export const OWNER_HEADING = 'Jesteś właścicielem mieszkania?'

export const RENTAL_INTRO: ContentSection[] = [
  {
    heading: 'Wynajem mieszkania w Kołobrzegu – długoterminowy i sezonowy',
    paragraphs: [
      'Kołobrzeg to uzdrowisko i port, ale także miasto, w którym ludzie na stałe mieszkają, uczą się i pracują. Dlatego rynek wynajmu dzieli się tu na dwa osobne światy. Wynajem sezonowy, czyli wakacyjny, to krótkie pobyty turystów i kuracjuszy, zwykle z wyższymi stawkami latem. Wynajem długoterminowy to umowa na dłuższy okres, dla osób szukających stałego miejsca do życia: pracowników, rodzin i osób przeprowadzających się nad morze.',
      'Na tej stronie publikujemy oferty wynajmu długoterminowego: mieszkania, apartamenty i lokale w Kołobrzegu i okolicach. Jeśli szukasz noclegu na wakacje albo wynajmu krótkoterminowego, skontaktuj się z nami bezpośrednio – sprawdzimy dostępne możliwości.',
    ],
  },
  {
    heading: 'Mieszkania na wynajem w Kołobrzegu – co znajdziesz w ofercie',
    paragraphs: [
      'Szukasz kawalerki, mieszkania dwu- lub trzypokojowego albo większego lokalu dla rodziny? Przeglądaj listę powyżej i zawężaj ją filtrami: typem nieruchomości i lokalizacją. W opisach naszych ofert podajemy m.in. metraż, liczbę pokoi i piętro, a każda oferta przechodzi przez nasz zespół przed publikacją. Status dostępności aktualizujemy, żeby nie tracić Twojego czasu na nieaktualne ogłoszenia.',
      'Nie wszystkie nieruchomości trafiają od razu na stronę. Jeśli nie widzisz tu odpowiedniego mieszkania, zadzwoń lub napisz – zapytamy o aktualne możliwości.',
    ],
  },
  {
    heading: 'Dla kogo jest wynajem długoterminowy w Kołobrzegu',
    paragraphs: [
      'To rozwiązanie dla osób, które chcą mieszkać w Kołobrzegu przez dłuższy czas, a nie tylko w sezonie: pracujących w mieście i okolicy, rodzin szukających mieszkania blisko szkoły czy przedszkola oraz tych, którzy przeprowadzają się nad morze i wolą najpierw wynająć, zanim zdecydują o zakupie. Stała umowa na dłuższy okres daje większą przewidywalność kosztów niż krótkie pobyty.',
    ],
  },
  {
    heading: 'Gdzie szukać mieszkania do wynajęcia – dzielnice i okolice',
    bullets: [
      'Centrum i okolice morza – blisko deptaka, sklepów, restauracji i komunikacji miejskiej.',
      'Osiedla mieszkaniowe, np. Radzikowo – zabudowa mieszkaniowa w oddaleniu od centrum, w pobliżu szkół i przedszkoli.',
      'Okoliczne miejscowości, np. Dźwirzyno, Grzybowo, Ustronie Morskie – nadmorskie miejscowości w pobliżu Kołobrzegu.',
    ],
  },
  {
    heading: 'Na co zwrócić uwagę przed podpisaniem umowy najmu',
    paragraphs: ['Wiele nieporozumień przy wynajmie bierze się z niedopowiedzeń, a nie ze złej woli. Przed podpisaniem umowy warto ustalić:'],
    bullets: [
      'co dokładnie wchodzi w czynsz najmu, a co rozliczasz osobno (media, czynsz administracyjny, internet) – dzięki temu wiesz, ile naprawdę będziesz płacić co miesiąc,',
      'wysokość kaucji, na jakich zasadach jest zwracana i co może zostać z niej potrącone,',
      'okres najmu oraz sposób i terminy wypowiedzenia umowy,',
      'wyposażenie i stan mieszkania – najlepiej spisać go w protokole zdawczo-odbiorczym razem ze stanem liczników, żeby przy zakończeniu najmu nikt nie spierał się o stan początkowy,',
      'kto odpowiada za drobne naprawy i jak zgłaszać usterki.',
    ],
  },
  {
    heading: 'Jak wygląda wynajem przez biuro – krok po kroku i zakres naszej pomocy',
    paragraphs: [
      'Wynajem przez biuro to coś więcej niż pokazanie mieszkania. Towarzyszymy w całym procesie, od pierwszego kontaktu po przekazanie kluczy (zakres zależy od oferty). Zakres naszej pomocy obejmuje:',
    ],
    bullets: [
      'pomoc w wyborze oferty i informację o kosztach przed umówieniem prezentacji,',
      'prezentację mieszkania i odpowiedzi na pytania o lokal, okolicę i opłaty,',
      'sprawdzenie stanu prawnego nieruchomości, zanim dojdzie do podpisania umowy,',
      'pomoc w przygotowaniu i zabezpieczeniu umowy najmu – zwykle rekomendujemy najem okazjonalny, chyba że strony wyraźnie zdecydują inaczej,',
      'udział w spisaniu protokołu zdawczo-odbiorczego ze stanem liczników oraz pomoc w przepisaniu liczników i uporządkowaniu spraw z mediami.',
    ],
  },
  {
    heading: 'Ile kosztuje wynajem przez biuro i od czego zależy zakres usługi',
    paragraphs: [
      'W większości ofert wynagrodzenie od Najemcy wynosi równowartość jednego miesięcznego czynszu netto, powiększonego o należny podatek VAT. Niektóre oferty są bez prowizji dla najemcy – informacja o tym jest przy konkretnej ofercie. O kosztach informujemy przed umówieniem prezentacji, żeby nie było niespodzianek.',
      'Stawka obowiązuje na dzień publikacji strony i może ulec zmianie; ostateczne warunki wynagrodzenia określa umowa pośrednictwa.',
      'Szczegółowy zakres pomocy zależy od konkretnej oferty i ustaleń zawartych w umowie pośrednictwa. Warunki najmu są ustalane z właścicielem mieszkania, a biuro działa jako pośrednik, nie strona umowy najmu.',
    ],
  },
  {
    heading: OWNER_HEADING,
    paragraphs: ['Jeśli chcesz wynająć własną nieruchomość w Kołobrzegu lub okolicach, zobacz naszą usługę zarządzania najmem – od znalezienia najemcy po bieżącą obsługę.'],
  },
]
