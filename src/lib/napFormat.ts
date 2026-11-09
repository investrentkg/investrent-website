// Formatowanie widocznego tekstu NAP w stopce (tylko wyswietlanie; href tel: i JSON-LD
// zostaja bez zmian). Dane z API biura bywaja zapisane bez spacji ("731554341", "lok.3").

/** Telefon PL do wyswietlenia: "+48 731 554 341". Nierozpoznany format zwracany bez zmian. */
export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const nat = digits.length === 11 && digits.startsWith('48') ? digits.slice(2)
    : digits.length === 13 && digits.startsWith('0048') ? digits.slice(4)
    : digits.length === 9 ? digits : null
  if (!nat) return raw
  return `+48 ${nat.slice(0, 3)} ${nat.slice(3, 6)} ${nat.slice(6)}`
}

/** Ulica z numerem do wyswietlenia: "ul. Ratuszowa 12/1 lok. 3" (prefiks "ul." i spacja po "lok."). */
export function formatStreetDisplay(raw: string): string {
  const s = raw.trim().replace(/\b(lok|m|lokal)\.\s*(?=\d)/gi, (_m, p: string) => (p.toLowerCase() === 'lokal' ? 'lokal ' : p.toLowerCase() === 'm' ? 'm. ' : 'lok. '))
  if (/^(ul\.|al\.|pl\.|os\.|aleja|plac|ulica)\s/i.test(s)) return s
  return `ul. ${s}`
}
