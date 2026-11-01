// Opcjonalne pole "Skąd o nas wiesz?" w formularzach kontaktowych.
// Dobrowolna odpowiedź użytkownika (nie dane z przeglądarki), więc nie wymaga zgody Marketingowej
// i idzie jako osobne pole `heard_from` (poza `attribution`). Lista zamknięta, uzgodniona z CRM:
// wartość spoza listy backend ignoruje (reszta zgłoszenia przechodzi normalnie).
export const HEARD_FROM_OPTIONS = [
  { value: 'google', label: 'Wyszukiwarka Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'polecenie', label: 'Polecenie znajomych' },
  { value: 'olx_otodom', label: 'OLX lub Otodom' },
  { value: 'tablica_baner', label: 'Tablica lub baner' },
  { value: 'inne', label: 'Inne' },
] as const

export type HeardFrom = (typeof HEARD_FROM_OPTIONS)[number]['value']

// Zwraca wartość z listy albo undefined (brak wyboru / nieznana wartość = pole pomijane w żądaniu).
export function normalizeHeardFrom(raw: unknown): HeardFrom | undefined {
  return HEARD_FROM_OPTIONS.find(o => o.value === raw)?.value
}
