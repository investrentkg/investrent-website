// Zgodnosc danych strukturalnych (schema.org) z prawdziwymi, widocznymi danymi.
//
// ZMIANA (03.10.2026): wczesniej strony (/, /o-nas, /kontakt) podstawialy
// sztywne wartosci zapasowe (4.9 / 55), gdy API opinii zawiodlo albo oddalo
// zero - i te nieprawdziwe liczby trafialy do JSON-LD (aggregateRating) oraz
// do widocznego widgetu. Polityka Google wymaga, zeby dane strukturalne
// odzwierciedlaly to, co widzi uzytkownik, i byly prawdziwe.
//
// Ten plik jest JEDYNYM miejscem decydujacym, czy mamy wiarygodna ocene:
// ten sam obiekt ({ rating, total }) zasila i JSON-LD, i widoczny widget
// (Hero, Reviews), wiec nie moga sie rozjechac. Gdy brak wiarygodnych danych
// zwracamy null - JSON-LD pomija pole aggregateRating, a widget ukrywa liczby.
//
// Czysta funkcja bez zaleznosci (testy: node --test src/lib/schemaRating.test.mjs).

/** Po ilu dniach bez odswiezenia po stronie CRM uznajemy ocene za nieswieza. */
export const RATING_MAX_AGE_DAYS = 14

const DAY_MS = 24 * 60 * 60 * 1000

/** Odpowiedz /api/public/google-reviews (pola opcjonalne - czytamy defensywnie). */
export interface GoogleReviewsResponseLike {
  ok?: boolean
  rating?: number | string | null
  total?: number | string | null
  /** Flaga dodawana przez backend CRM, gdy dane pochodza z nieswiezego cache. */
  stale?: boolean
  /** ISO 8601 - kiedy CRM ostatnio z sukcesem odswiezyl opinie z Google. */
  updated_at?: string | null
}

/** Wiarygodna ocena: wspolne zrodlo dla JSON-LD i widocznego widgetu. */
export interface VerifiedRating {
  rating: number
  total: number
}

function toNumber(v: unknown): number {
  if (typeof v === 'number') return v
  if (typeof v === 'string' && v.trim() !== '') return Number(v)
  return NaN
}

/**
 * Zwraca { rating, total }, gdy odpowiedz API opinii jest wiarygodna, w
 * przeciwnym razie null. Wiarygodna = wszystkie warunki naraz:
 *  - odpowiedz istnieje i ma ok === true,
 *  - brak flagi stale === true (backend moze jej jeszcze nie wysylac - brak pola jest OK),
 *  - rating to liczba z przedzialu (0, 5], total to liczba calkowita >= 1
 *    (rating:0 / total:0 to znany przypadek "Google chwilowo bez danych"),
 *  - updated_at (jesli jest) jest poprawna data nie starsza niz 14 dni;
 *    nieczytelna data = nie da sie potwierdzic swiezosci = null.
 */
export function getVerifiedRating(data: unknown, now: Date | number = new Date()): VerifiedRating | null {
  if (!data || typeof data !== 'object') return null
  const d = data as GoogleReviewsResponseLike
  if (d.ok !== true) return null
  if (d.stale === true) return null

  const rating = toNumber(d.rating)
  const total = toNumber(d.total)
  if (!Number.isFinite(rating) || rating <= 0 || rating > 5) return null
  if (!Number.isInteger(total) || total < 1) return null

  if (d.updated_at !== undefined && d.updated_at !== null) {
    const updated = typeof d.updated_at === 'string' ? Date.parse(d.updated_at) : NaN
    if (!Number.isFinite(updated)) return null
    const nowMs = typeof now === 'number' ? now : now.getTime()
    if (nowMs - updated > RATING_MAX_AGE_DAYS * DAY_MS) return null
  }

  return { rating, total }
}

/** Czy emitowac aggregateRating w JSON-LD. */
export function shouldEmitAggregateRating(data: unknown, now: Date | number = new Date()): boolean {
  return getVerifiedRating(data, now) !== null
}
