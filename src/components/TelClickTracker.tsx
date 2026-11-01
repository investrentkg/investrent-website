'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPhoneLinkClick } from '@/lib/track'

// Liczy klikniecia w KAZDY link tel: na stronie jako zdarzenie GA4 phone_click (dotad liczone tylko w ChatWidget i w kalkulatorze /wycena).
// Jeden nasluch na dokumencie, bez zmiany tagu GA4 i bez nowych skryptow; gtag laduje sie dopiero po zgodzie na analityke, wiec bez zgody to no-op.
// Nic nie renderuje, nie zapisuje numeru ani adresu (placement = sciezka strony).
export default function TelClickTracker() {
  const pathname = usePathname()
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null
      const a = t && typeof t.closest === 'function' ? t.closest('a[href^="tel:"]') : null
      if (a) trackPhoneLinkClick(`tel_${pathname || '/'}`)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname])
  return null
}
