// NAPRAWA TRESCI (Weronika, feedback 01.08): numery telefonow pobierane
// dynamicznie z CRM (office.phone, offer.agent.phone) sa w bazie
// przechowywane jako surowe cyfry bez spacji (np. "731554341") - w
// przeciwienstwie do statycznych wartosci zapasowych w kodzie, ktore juz
// byly poprawnie sformatowane. Stad na produkcji (gdy dane z CRM faktycznie
// sie zaladuja, co jest normalnym przypadkiem) numery wygladaly jako
// "zlepione cyfry" zamiast czytelnego "731 554 341".
//
// Formatuje POLSKI numer komorkowy (9 cyfr, z opcjonalnym prefiksem +48) do
// czytelnej postaci "731 554 341" (lub "+48 731 554 341" jesli prefiks byl
// obecny). Nie rusza numerow w innym formacie (np. juz zawierajacych
// spacje) - bezpieczne do wielokrotnego wywolania na tej samej wartosci.
export function formatPhoneDisplay(raw: string | null | undefined): string {
  if (!raw) return ''
  const trimmed = raw.trim()
  const hasPrefix = trimmed.startsWith('+48')
  const digits = trimmed.replace(/[^\d]/g, '').replace(/^48/, '')
  if (digits.length !== 9) return trimmed // nietypowy format - nie zgaduj, zwroc bez zmian
  const grouped = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`
  return hasPrefix ? `+48 ${grouped}` : grouped
}

// Do uzycia w atrybutach href="tel:..." - tam WLASNIE chcemy cyfry bez spacji,
// to inny, celowo odwrotny przypadek uzycia niz formatPhoneDisplay powyzej.
export function formatPhoneHref(raw: string | null | undefined): string {
  if (!raw) return ''
  const digits = raw.replace(/[^\d]/g, '')
  return digits.startsWith('48') ? `+${digits}` : `+48${digits}`
}
