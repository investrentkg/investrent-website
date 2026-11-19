// Tekst wiadomosci WhatsApp z kalkulatora /wycena. Nowy tekst zatwierdzil Daniel 19.11.2026; CRM rozpoznaje zrodlo po rdzeniu "kalkulatora InvestRent"
// (bez wielkosci liter i ogonkow), wiec zmiana tekstu nie gubi leadow. Flaga OFF = dotychczasowy tekst z texts.ts.
export const WHATSAPP_TEXT_V2 = 'Dzień dobry, piszę w sprawie wyceny z kalkulatora InvestRent. Chcę ją omówić.'
export function whatsappTextFor(v2On: boolean, legacy: string): string {
  return v2On ? WHATSAPP_TEXT_V2 : legacy
}
