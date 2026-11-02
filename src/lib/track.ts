// Zdarzenia GA4 launchera kontaktu (whatsapp_click, chat_open, phone_click).
// Ten sam mechanizm co trackLeadSuccess (window.gtag ładowane w layout.tsx) - bez nowych
// skryptów i bez danych osobowych. Gdy GA nie jest załadowane (adblock, brak ID) - no-op.
export type ContactEvent = 'whatsapp_click' | 'chat_open' | 'phone_click'

// Okno deduplikacji: klik w link tel: z wlasnym onClick (ChatWidget, /wycena) i jednoczesny globalny nasluch (TelClickTracker) to jedno zdarzenie.
export const PHONE_DEDUPE_MS = 800
let lastPhoneClickAt = -Infinity
let lastWhatsappClickAt = -Infinity

export function trackContactEvent(name: ContactEvent, placement = 'launcher', now: number = Date.now()): void {
  try {
    if (name === 'phone_click') lastPhoneClickAt = now
    if (name === 'whatsapp_click') lastWhatsappClickAt = now
    const w = typeof window !== 'undefined' ? (window as unknown as { gtag?: (...a: unknown[]) => void }) : undefined
    if (w && typeof w.gtag === 'function') {
      w.gtag('event', name, { placement })
    }
  } catch {
    // analityka nigdy nie może zepsuć strony
  }
}

/** Globalny nasluch linkow tel: (TelClickTracker): pomija klik, ktory wlasny onClick juz policzyl w oknie PHONE_DEDUPE_MS. Zwraca true, gdy zdarzenie wyslano. */
export function trackPhoneLinkClick(placement: string, now: number = Date.now()): boolean {
  if (now - lastPhoneClickAt < PHONE_DEDUPE_MS) return false
  trackContactEvent('phone_click', placement, now)
  return true
}

/** Globalny nasluch linkow WhatsApp (TelClickTracker): ta sama zasada dedupe co dla tel:. Zwraca true, gdy zdarzenie wyslano. */
export function trackWhatsappLinkClick(placement: string, now: number = Date.now()): boolean {
  if (now - lastWhatsappClickAt < PHONE_DEDUPE_MS) return false
  trackContactEvent('whatsapp_click', placement, now)
  return true
}
