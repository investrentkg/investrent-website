// Strona "Nieruchomosci komercyjne" (hub). Tresc zatwierdzona wg HUB_komercyjne_szkic_v5 (07.11.2026), fakty od Daniela
// (FAKTY_komercyjne_zatwierdzone_07_11.md): sprzedaz dzialek/hal/magazynow/lokali/obiektow, szukanie obiektu dla inwestora,
// WZ/MPZP. BEZ wynajmu komercyjnych, bez liczb, bez adresow.
// UNIWERSALNE DLA CRM (DealBase): nazwa biura i region NIE sa wpisane w tresci, tylko w konfiguracji biura (CommercialConfig).
// Zmienne: biuro = nazwa; biuro_dop = forma zdaniowa ("biura InvestRent"); region = np. "wojewodztwo zachodniopomorskie";
// region_w = z przyimkiem ("w wojewodztwie zachodniopomorskim").
export type CommercialConfig = { biuro: string; biuro_dop: string; region: string; region_w: string }

// Konfiguracja tego biura (docelowo z tabeli biura/tenanta; do tego czasu stala jednego biura).
export const COMMERCIAL_CONFIG: CommercialConfig = {
  biuro: 'InvestRent',
  biuro_dop: 'biura InvestRent',
  region: 'województwo zachodniopomorskie',
  region_w: 'w województwie zachodniopomorskim',
}

export const COMMERCIAL_PATH = '/nieruchomosci-komercyjne'

export type CommercialContent = {
  title: string
  description: string
  h1: string
  lead: string
  typesHeading: string
  types: string[]
  helpHeading: string
  help: Array<{ label: string; text: string }>
  basisHeading: string
  basis: string[]
  offersHeading: string
  emptyOffers: string
  startHeading: string
  start: string
  faqHeading: string
  faq: Array<{ q: string; a: string }>
  disclaimer: string
  ctaLead: string
  ctaLabel: string
}

export function buildCommercialContent(c: CommercialConfig): CommercialContent {
  return {
    title: `Hale, magazyny i działki inwestycyjne na sprzedaż | ${c.biuro}`,
    description: `Pośredniczymy w sprzedaży działek, hal, magazynów i lokali ${c.region_w}. Szukamy obiektów dla inwestorów i sprawdzamy plan miejscowy.`,
    h1: `Nieruchomości komercyjne i inwestycyjne ${c.region_w}`,
    lead: `Pośredniczymy w sprzedaży działek, hal, magazynów, lokali usługowych i obiektów inwestycyjnych ${c.region_w}. Pomagamy też inwestorom znaleźć obiekt oraz sprawdzić, co wynika z miejscowego planu zagospodarowania przestrzennego (MPZP) lub warunków zabudowy (WZ).`,
    typesHeading: 'Nieruchomości komercyjne, w których sprzedaży pośredniczymy',
    types: [
      'Działki budowlane, inwestycyjne i rolne.',
      'Hale i magazyny na sprzedaż.',
      'Lokale usługowe, handlowe i biura.',
      'Obiekty inwestycyjne i specjalne.',
    ],
    helpHeading: 'Jak możemy pomóc',
    help: [
      { label: 'Sprzedaż', text: 'jeśli masz działkę, halę, magazyn, lokal lub inną nieruchomość komercyjną na sprzedaż, możemy pośredniczyć w jej sprzedaży.' },
      { label: 'Szukanie obiektu', text: `jeśli jesteś inwestorem, opisz nam, czego szukasz (typ, wielkość, lokalizacja, cel), a pomożemy Ci znaleźć obiekt ${c.region_w}.` },
      { label: 'Plan miejscowy i warunki zabudowy (sprawy WZ i MPZP)', text: 'pomagamy sprawdzić zapisy planu miejscowego lub warunków zabudowy i ocenić, co z nich wynika dla Twojej nieruchomości.' },
    ],
    basisHeading: 'Na czym się opieramy',
    basis: [
      'baza inwestorów i kupujących,',
      'kontakty z biurami nieruchomości specjalizującymi się w obiektach komercyjnych (dobry przepływ informacji),',
      'analizy rynku i wstępna wycena (nie operat szacunkowy),',
      'doświadczenie w sprawach WZ i MPZP.',
    ],
    offersHeading: 'Obiekty w ofercie',
    emptyOffers: 'Aktualnie nie mamy ofert tego typu. Opisz, czego szukasz.',
    startHeading: 'Jak zaczynamy',
    start: 'Wynagrodzenie biura wynika z umowy. Na początek opisz nam nieruchomość albo to, czego szukasz.',
    faqHeading: 'Najczęściej zadawane pytania',
    faq: [
      { q: 'Czy pomożecie sprawdzić, co można zbudować na działce?', a: 'Pomagamy sprawdzić zapisy miejscowego planu zagospodarowania przestrzennego albo warunków zabudowy i ocenić, co z nich wynika dla działki. Plan miejscowy uchwala rada gminy, a decyzję o warunkach zabudowy wydaje urząd gminy.' },
      { q: 'Czy zrobicie wstępną wycenę mojej nieruchomości?', a: 'Tak, przygotowujemy wstępną wycenę na podstawie analiz rynku. To nie jest operat szacunkowy.' },
      { q: 'Czy pośredniczycie w sprzedaży działek rolnych?', a: 'Tak, działki rolne należą do obiektów, w których sprzedaży pośredniczymy. Obrót nieruchomościami rolnymi podlega ograniczeniom wynikającym z przepisów o obrocie ziemią rolną, więc zakres omawiamy przy konkretnej działce.' },
      { q: 'Szukam obiektu pod inwestycję. Jak mogę zacząć?', a: `Opisz, czego szukasz: typ obiektu, wielkość, lokalizację i cel. Na tej podstawie pomożemy Ci znaleźć obiekt ${c.region_w}.` },
      { q: 'Czy macie dostęp do klientów z zagranicy?', a: 'Tak, mamy dostęp także do klientów z zagranicy.' },
    ],
    disclaimer: 'Informacje na tej stronie mają charakter ogólny i nie są poradą prawną ani inwestycyjną. W sprawach umowy i planu miejscowego skonsultuj się z prawnikiem.',
    ctaLead: 'Masz obiekt do sprzedaży albo szukasz inwestycji?',
    ctaLabel: `Napisz lub zadzwoń do ${c.biuro_dop}`,
  }
}

// Typy ofert pokazywane w sekcji "Obiekty w ofercie" (TYLKO sprzedaz; wynajem komercyjnych wykluczony decyzja Daniela 07.11).
export const COMMERCIAL_OFFER_TYPES = ['magazyn', 'lokal', 'dzialka', 'biuro'] as const

// Mapowanie typow API na filtry huba (jawne; zatwierdzone po ocenie recenzenta faktow v5):
//  - dzialka -> chip "Działki"; magazyn -> "Hale i magazyny"; lokal -> "Lokale";
//  - biuro -> "Lokale" (osobnego chipa "Biura" nie ma; w CRM 0 ofert typu biuro, karta biura nosi etykiete "Lokal");
//  - "obiekty inwestycyjne i specjalne" nie maja osobnego typu w danych (wpadaja do lokal albo inwestycja) -> widoczne tylko w "Wszystkie".
export const COMMERCIAL_FILTER_CHIPS = [
  { label: 'Działki', type: 'dzialka' },
  { label: 'Hale i magazyny', type: 'magazyn' },
  { label: 'Lokale', type: 'lokal' },
] as const
export const COMMERCIAL_TYPE_LABEL: Record<string, string> = { dzialka: 'Działka', lokal: 'Lokal', magazyn: 'Hala / magazyn', biuro: 'Lokal' }
