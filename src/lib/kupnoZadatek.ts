// Blok "Co sprawdzić przed zadatkiem" na /kupno (DRAFT, tekst od Marketingu z 2.11.2026).
// Tekst czeka na akceptację Ernesta/Daniela (D75) i weryfikację merytoryczną działów III/IV przez agenta.
// Forma ogólna (treść strony, nie wiadomość do osoby), bez obietnic i bez nazw inwestycji.
// Stałe w .ts, bo test (node --test) nie importuje .tsx.

export const ZADATEK_HEADING = 'Co sprawdzić przed zadatkiem'

export type ZadatekItem = { id: string; title: string; desc: string }

// Wariant bez punktu "kto mieszka w lokalu" (do oceny Daniela): usunąć jeden obiekt o id 'lokal-zamieszkany'.
export const ZADATEK_ITEMS: ZadatekItem[] = [
  { id: 'dzial-iii', title: 'Dział III księgi wieczystej', desc: 'Zawiera ograniczone prawa rzeczowe i roszczenia, m.in. służebności. Przeczytaj jego treść.' },
  { id: 'dzial-iv', title: 'Dział IV księgi wieczystej', desc: 'Zawiera hipoteki. Sprawdź, czy są wpisane.' },
  { id: 'lokal-zamieszkany', title: 'Kto mieszka w lokalu', desc: 'Ustal, czy mieszkanie jest zamieszkane i przez kogo.' },
  { id: 'koszty-miesieczne', title: 'Koszty miesięczne', desc: 'Czynsz do wspólnoty lub spółdzielni, fundusz remontowy i opłaty za media.' },
]

export const ZADATEK_OUTRO = 'Weryfikujemy księgę wieczystą, ewentualne obciążenia i zgodność stanu prawnego.'
export const ZADATEK_CTA_LABEL = 'Napisz lub zadzwoń do biura'
export const ZADATEK_CTA_HREF = '/kontakt'

/** Wstęp liczy punkty, więc po usunięciu któregoś nie rozjedzie się z listą. */
export function zadatekIntro(items: ZadatekItem[] = ZADATEK_ITEMS): string {
  const words: Record<number, string> = { 1: 'jedną rzecz', 2: 'dwie rzeczy', 3: 'trzy rzeczy', 4: 'cztery rzeczy', 5: 'pięć rzeczy' }
  return `Przed wpłatą zadatku sprawdź ${words[items.length] ?? `${items.length} rzeczy`}.`
}
