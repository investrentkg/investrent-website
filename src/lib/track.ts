// Zdarzenia GA4 launchera kontaktu (whatsapp_click, chat_open, phone_click).
// Ten sam mechanizm co trackLeadSuccess (window.gtag ładowane w layout.tsx) - bez nowych
// skryptów i bez danych osobowych. Gdy GA nie jest załadowane (adblock, brak ID) - no-op.
export type ContactEvent = 'whatsapp_click' | 'chat_open' | 'phone_click'

export function trackContactEvent(name: ContactEvent, placement = 'launcher'): void {
  try {
    const w = typeof window !== 'undefined' ? (window as unknown as { gtag?: (...a: unknown[]) => void }) : undefined
    if (w && typeof w.gtag === 'function') {
      w.gtag('event', name, { placement })
    }
  } catch {
    // analityka nigdy nie może zepsuć strony
  }
}
