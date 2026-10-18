// Jedno źródło obietnicy czasu reakcji (decyzja Daniela 18.10.2026): „jak najszybciej,
// nie później niż w ciągu 24 godzin”. Wariant PEŁNY w komunikatach, SKRÓT w odznakach,
// przyciskach i meta. Bez „60 minut”, „tego samego dnia”, „gwarantowany”.
// Bez importów, żeby test (node --test) mógł wczytać plik.

// PEŁNE: końcówka zdania, do wstawienia po czasowniku (np. „Odpowiadamy ${RESPONSE_FULL}”).
export const RESPONSE_FULL = 'jak najszybciej, nie później niż w ciągu 24 godzin'

// SKRÓT: „najpóźniej w ciągu 24 godzin” (przyciski, meta, krótkie dopiski).
export const RESPONSE_SHORT = 'najpóźniej w ciągu 24 godzin'

// SKRÓT: odznaka / kafel liczbowy.
export const RESPONSE_BADGE = 'do 24 godz.'

// Gotowe pełne zdanie kontaktowe.
export const RESPONSE_SENTENCE = `Skontaktujemy się ${RESPONSE_FULL}.`
