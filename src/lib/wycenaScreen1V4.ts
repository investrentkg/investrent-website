// Ekran 1 kalkulatora v4 (makieta E1i, zatwierdzona przez Daniela 11.11.2026): metraż, miejscowość oraz opcjonalnie pokoje i piętro (chipy).
// Czysta logika, bez React i bez I/O. Ramię testu A/B: 'a' = 2 pola (metraż + miejscowość), 'b' = 4 pola (+ pokoje, piętro).
// Pokoje i piętro zawężają WYŁĄCZNIE kafel ofertowy (karta rynku), nie wycenę z silnika i nie kafel transakcyjny.

export type RoomsChoice = '1' | '2' | '3' | '4_plus' | 'unknown'
export type FloorChoice = 'parter' | '1_3' | '4_plus' | 'unknown'
export type Screen1Arm = 'a' | 'b'

export const ROOMS_CHOICES: readonly { value: RoomsChoice; label: string }[] = [
  { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4_plus', label: '4+' }, { value: 'unknown', label: 'Nie wiem' },
]
export const FLOOR_CHOICES: readonly { value: FloorChoice; label: string }[] = [
  { value: 'parter', label: 'Parter' }, { value: '1_3', label: '1–3' }, { value: '4_plus', label: '4+' }, { value: 'unknown', label: 'Nie wiem' },
]

/** Wartość startowa obu pól: „Nie wiem” (nie blokuje i nie zawęża). */
export const DEFAULT_ROOMS: RoomsChoice = 'unknown'
export const DEFAULT_FLOOR: FloorChoice = 'unknown'

/** Pole `rooms` dla silnika wyceny (/estimate): liczba całkowita albo pusty tekst. „4+” = 4, „Nie wiem” = brak. Piętro do /estimate NIE jest wysyłane (grupa nie ma jednej wartości). */
export function roomsForEstimate(c: RoomsChoice): string {
  return c === '1' || c === '2' || c === '3' ? c : c === '4_plus' ? '4' : ''
}

/** Filtry dla karty rynku (POST /api/public/valuation/market-card); „Nie wiem” = brak pola, backend nie zawęża. */
export type CardV4Filters = { rooms?: '1' | '2' | '3' | '4_plus'; floor_group?: 'parter' | '1_3' | '4_plus' }
export function cardFilters(rooms: RoomsChoice, floor: FloorChoice): CardV4Filters {
  const out: CardV4Filters = {}
  if (rooms !== 'unknown') out.rooms = rooms
  if (floor !== 'unknown') out.floor_group = floor
  return out
}
export const hasCardFilters = (f: CardV4Filters): boolean => !!f.rooms || !!f.floor_group

/** Losowanie ramienia: bez identyfikatora i bez cookie, wynik trzymany tylko w pamięci strony. `rand` wstrzykiwane w testach. */
export function pickScreen1Arm(mode: 'on' | 'ab' | 'off', rand: () => number = Math.random): Screen1Arm | null {
  if (mode === 'off') return null
  if (mode === 'on') return 'b'
  return rand() < 0.5 ? 'a' : 'b'
}

/** Kod wariantu do licznika lejka (krótki kod, bez danych osobowych). */
export const screen1Variant = (arm: Screen1Arm): string => (arm === 'b' ? 'ekran1_4pola' : 'ekran1_2pola')
