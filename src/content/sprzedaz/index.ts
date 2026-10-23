// Treści stron listingu sprzedaży (SEO, plan TOP Kołobrzeg poz. 1; specyfikacja: _wspolne_pliki/SEO_specyfikacja_strony_sprzedazy_i_miejscowosci_dla_Codexa_2026_10_12.md).
// Zasady: bez liczb cen z pamięci, bez obietnic i twierdzeń prawnych, Kołobrzeg opisany neutralnie-pozytywnie, bez nazw inwestycji deweloperskich.

export type SaleSection = { heading: string; paragraphs: string[]; bullets?: string[] }
export type SaleListingContent = {
  propertyType: 'mieszkanie' | 'dom' | 'dzialka'
  path: string
  title: string
  description: string
  h1: string
  lead: string
  sections: SaleSection[]
  faq: { q: string; a: string }[]
  breadcrumb: string
}

export const MIESZKANIA: SaleListingContent = {
  propertyType: 'mieszkanie',
  path: '/mieszkania-na-sprzedaz-kolobrzeg',
  title: 'Mieszkania na sprzedaż Kołobrzeg – oferty',
  description: 'Mieszkania na sprzedaż w Kołobrzegu i okolicach: aktualne oferty biura InvestRent, wskazówki przed zakupem i bezpłatna pomoc w wyborze.',
  h1: 'Mieszkania na sprzedaż w Kołobrzegu',
  breadcrumb: 'Mieszkania na sprzedaż',
  lead: 'Aktualne oferty mieszkań w Kołobrzegu i okolicach. Pomagamy znaleźć lokal, który pasuje do Twojego budżetu i sposobu korzystania, od apartamentu blisko plaży po mieszkanie na stałe.',
  sections: [
    {
      heading: 'Jak wygląda rynek mieszkań w Kołobrzegu',
      paragraphs: [
        'Kołobrzeg to miasto o dwóch rytmach: sezonowym i całorocznym. Część mieszkań kupowana jest z myślą o wypoczynku i wynajmie krótkoterminowym, część przez osoby, które chcą tu mieszkać na stałe. To wpływa na ofertę: w centrum i blisko morza przeważają niewielkie apartamenty, a w dzielnicach oddalonych od plaży częściej znajdziesz większe lokale rodzinne.',
        'Ceny zależą od lokalizacji, piętra, standardu i stanu technicznego, dlatego nie podajemy jednej „średniej”. Aktualne ceny ofertowe zobaczysz przy każdym ogłoszeniu, a rzetelne zestawienie cen ofertowych i transakcyjnych znajdziesz w naszym wpisie o tym, ile kosztuje mieszkanie w Kołobrzegu.',
      ],
    },
    {
      heading: 'Na co zwrócić uwagę przed zakupem',
      paragraphs: ['Przy wyborze mieszkania warto przejść przez krótką listę kontrolną:'],
      bullets: [
        'cel zakupu: mieszkanie na stałe, wypoczynek czy wynajem; od tego zależy lokalizacja i metraż,',
        'odległość od morza i komunikacji, a także hałas w sezonie,',
        'stan techniczny budynku i wspólnoty (fundusz remontowy, planowane prace),',
        'forma własności, księga wieczysta i ewentualne obciążenia,',
        'koszty utrzymania: czynsz administracyjny, ogrzewanie, opłaty sezonowe.',
      ],
    },
    {
      heading: 'Jak pracujemy z kupującymi',
      paragraphs: [
        'Dla osoby kupującej nasza pomoc w poszukiwaniu i negocjacjach jest bezpłatna. Poznajemy Twoje potrzeby, przedstawiamy dopasowane oferty, organizujemy oglądanie i towarzyszymy w formalnościach. Szczegóły znajdziesz na stronie o kupnie nieruchomości, a jeśli chcesz najpierw sprawdzić wartość własnego mieszkania, skorzystaj z kalkulatora wyceny.',
      ],
    },
  ],
  faq: [
    { q: 'Czy w ofertach są tylko mieszkania z samego Kołobrzegu?', a: 'Pokazujemy mieszkania z Kołobrzegu i okolicznych miejscowości nadmorskich. Lokalizację widać przy każdej ofercie, a listę można zawęzić filtrem.' },
    { q: 'Czy mogę obejrzeć mieszkanie, jeśli mieszkam daleko?', a: 'Tak. Umawiamy termin oglądania z wyprzedzeniem i dopasowujemy go do Twojego przyjazdu. Przed spotkaniem możemy przesłać dodatkowe informacje i zdjęcia.' },
    { q: 'Czy pomagacie w sprawach formalnych przy zakupie?', a: 'Towarzyszymy w kolejnych krokach transakcji i wskazujemy, jakie dokumenty warto sprawdzić. W kwestiach prawnych zalecamy konsultację z notariuszem lub prawnikiem.' },
    { q: 'Jak szybko dostanę odpowiedź po zgłoszeniu?', a: 'Odpowiadamy najpóźniej w ciągu 24 godzin od zgłoszenia.' },
  ],
}

export const DOMY: SaleListingContent = {
  propertyType: 'dom',
  path: '/domy-na-sprzedaz-kolobrzeg',
  title: 'Domy na sprzedaż Kołobrzeg – oferty',
  description: 'Domy na sprzedaż w Kołobrzegu i okolicach nad Bałtykiem: aktualne oferty biura InvestRent, wskazówki przed zakupem i pomoc w wyborze.',
  h1: 'Domy na sprzedaż w Kołobrzegu',
  breadcrumb: 'Domy na sprzedaż',
  lead: 'Aktualne oferty domów w Kołobrzegu i okolicznych miejscowościach nad morzem. Pomagamy wybrać dom pod Twoje potrzeby: do stałego zamieszkania, na wypoczynek lub jako inwestycję.',
  sections: [
    {
      heading: 'Domy w Kołobrzegu i okolicy',
      paragraphs: [
        'W samym Kołobrzegu domów jest mniej niż mieszkań, dlatego warto brać pod uwagę także pobliskie miejscowości nad morzem. Bliskość plaży, charakter zabudowy i dojazd do miasta różnią się w zależności od miejsca, a to przekłada się na dopasowanie do stylu życia: od cichych osiedli po okolice z rozwiniętą infrastrukturą turystyczną.',
        'Wartość domu zależy od działki, powierzchni użytkowej, stanu technicznego i położenia, więc nie podajemy jednej „typowej” ceny. Aktualne ceny ofertowe widzisz przy ogłoszeniach, a ogólne zestawienie cen ofertowych i transakcyjnych znajdziesz w naszym wpisie o cenach nieruchomości w Kołobrzegu.',
      ],
    },
    {
      heading: 'Na co zwrócić uwagę przy zakupie domu',
      paragraphs: ['Dom to większa decyzja niż mieszkanie, dlatego sprawdź:'],
      bullets: [
        'stan prawny działki i budynku oraz przeznaczenie terenu w planie miejscowym,',
        'media: przyłącza, źródło ogrzewania, koszty eksploatacji,',
        'stan techniczny konstrukcji, dachu i instalacji,',
        'dostęp do drogi i sąsiedztwo (hałas, ruch turystyczny w sezonie),',
        'możliwości dalszej adaptacji lub rozbudowy.',
      ],
    },
    {
      heading: 'Jak możemy pomóc',
      paragraphs: [
        'Znamy lokalny rynek, przedstawiamy dopasowane oferty, umawiamy oglądanie i towarzyszymy w negocjacjach. Dla kupującego nasza pomoc jest bezpłatna. Jeśli dom ma stan prawny lub techniczny wymagający szczególnej uwagi, przeczytaj o nietypowych sprawach na stronie o trudnych nieruchomościach. Więcej o samym mieście znajdziesz na stronie o nieruchomościach w Kołobrzegu.',
      ],
    },
  ],
  faq: [
    { q: 'Czy w ofertach są tylko domy z Kołobrzegu?', a: 'Pokazujemy domy z Kołobrzegu i okolicznych miejscowości nadmorskich. Miejscowość widać przy każdej ofercie.' },
    { q: 'Czy dom z działką jest w jednej ofercie?', a: 'Zwykle tak, a opis oferty podaje powierzchnię działki i budynku. Szczegóły potwierdzamy przed oglądaniem.' },
    { q: 'Czy sprawdzacie stan prawny przed transakcją?', a: 'Zwracamy uwagę na dokumenty i księgę wieczystą oraz wskazujemy, co warto zweryfikować. W sprawach prawnych zalecamy konsultację z notariuszem lub prawnikiem.' },
    { q: 'Jak szybko dostanę odpowiedź po zgłoszeniu?', a: 'Odpowiadamy najpóźniej w ciągu 24 godzin od zgłoszenia.' },
  ],
}

export const DZIALKI: SaleListingContent = {
  propertyType: 'dzialka',
  path: '/dzialki-na-sprzedaz-kolobrzeg',
  title: 'Działki na sprzedaż Kołobrzeg i okolice – oferty',
  description: 'Działki na sprzedaż w Kołobrzegu i okolicznych miejscowościach nad Bałtykiem: aktualne oferty biura InvestRent i wskazówki przed zakupem.',
  h1: 'Działki na sprzedaż w Kołobrzegu i okolicy',
  breadcrumb: 'Działki na sprzedaż',
  lead: 'Aktualne oferty działek w Kołobrzegu i okolicznych miejscowościach nad morzem. Pomagamy wybrać działkę pod dom, inwestycję lub rekreację i zebrać informacje, które warto sprawdzić przed zakupem.',
  sections: [
    {
      heading: 'Działki w Kołobrzegu i okolicznych miejscowościach',
      paragraphs: [
        'Działki oferujemy w Kołobrzegu i w okolicznych miejscowościach nadmorskich oraz gminach sąsiednich; miejscowość widać przy każdej ofercie. Cena, możliwości zabudowy i odległość od morza różnią się zależnie od miejsca, więc nie podajemy jednej „średniej”. Aktualne ceny ofertowe widzisz przy każdym ogłoszeniu.',
        'Przy działkach wiele zależy od celu: inaczej wybiera się teren pod dom całoroczny, inaczej pod inwestycję lub działkę rekreacyjną. Zanim zawęzisz poszukiwania, warto określić, ile ma kosztować całość: zakup, przyłącza, prace przygotowawcze i budowa.',
      ],
    },
    {
      heading: 'Na co zwrócić uwagę przed zakupem działki',
      paragraphs: ['Przy każdej działce warto zebrać te same informacje:'],
      bullets: [
        'przeznaczenie terenu i zasady zabudowy (plan miejscowy albo decyzja o warunkach zabudowy w urzędzie gminy),',
        'dostęp do drogi publicznej i stan drogi dojazdowej,',
        'media: prąd, woda, kanalizacja, gaz; odległość do przyłączy i koszt ich doprowadzenia,',
        'kształt, ukształtowanie i warunki gruntowe,',
        'księga wieczysta, obciążenia i służebności,',
        'otoczenie: sąsiednia zabudowa, hałas, sezonowość ruchu.',
      ],
    },
    {
      heading: 'Jak możemy pomóc',
      paragraphs: [
        'Przedstawiamy dopasowane oferty, umawiamy oglądanie i towarzyszymy w negocjacjach. Dla kupującego nasza pomoc jest bezpłatna. W sprawach prawnych i formalnych dotyczących konkretnej działki zalecamy konsultację z notariuszem lub prawnikiem. Więcej o samym mieście znajdziesz na stronie o nieruchomościach w Kołobrzegu.',
      ],
    },
  ],
  faq: [
    { q: 'Czy w ofertach są tylko działki z Kołobrzegu?', a: 'Pokazujemy działki z Kołobrzegu i okolicznych miejscowości. Lokalizacja jest podana przy każdej ofercie.' },
    { q: 'Czy mogę zapytać o możliwość zabudowy konkretnej działki?', a: 'Tak, przekażemy dostępne informacje z oferty. Ostateczne ustalenia dotyczące zabudowy należy potwierdzić w urzędzie gminy.' },
    { q: 'Czy pomagacie w sprawach formalnych przy zakupie?', a: 'Towarzyszymy w kolejnych krokach transakcji i wskazujemy, jakie dokumenty warto sprawdzić. W kwestiach prawnych zalecamy konsultację z notariuszem lub prawnikiem.' },
    { q: 'Jak szybko dostanę odpowiedź po zgłoszeniu?', a: 'Odpowiadamy najpóźniej w ciągu 24 godzin od zgłoszenia.' },
  ],
}
