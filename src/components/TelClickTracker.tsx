'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPhoneLinkClick, trackWhatsappLinkClick } from '@/lib/track'
import { sendFunnelStep, isContactClickPath } from '@/lib/funnel'
import { FUNNEL_ON, WYCENA_CONTACT_CLICK_ON } from '@/lib/wycenaFlags'

// Liczy klikniecia w KAZDY link tel: na stronie jako zdarzenie GA4 phone_click (dotad liczone tylko w ChatWidget i w kalkulatorze /wycena),
// a od 02.11 tez w kazdy link WhatsApp (wa.me) jako whatsapp_click z placement wa_<sciezka> (dotad tylko ChatWidget i /wycena; kontakt, oferty i stopka byly nieliczone).
// Jeden nasluch na dokumencie, bez zmiany tagu GA4 i bez nowych skryptow; gtag laduje sie dopiero po zgodzie na analityke, wiec bez zgody to no-op.
// Nic nie renderuje, nie zapisuje numeru ani adresu (placement = sciezka strony).
export default function TelClickTracker() {
  const pathname = usePathname()
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (!t || typeof t.closest !== 'function') return
      const isTel = !!t.closest('a[href^="tel:"]')
      if (isTel) trackPhoneLinkClick(`tel_${pathname || '/'}`)
      else if (t.closest('a[href*="wa.me/"], a[href*="api.whatsapp.com/"]')) trackWhatsappLinkClick(`wa_${pathname || '/'}`)
      else return
      // Licznik lejka CRM (flaga NEXT_PUBLIC_WYCENA_CONTACT_CLICK, OFF): tylko strony kalkulatora i landingu reklam; reason = tel|whatsapp, bez numeru i adresu.
      if (isContactClickPath(pathname)) sendFunnelStep('contact_click', { reason: isTel ? 'tel' : 'whatsapp' }, { enabled: WYCENA_CONTACT_CLICK_ON && FUNNEL_ON })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname])
  return null
}
