"use client"
import type { CSSProperties } from 'react'
import { CONSENT_OPEN_EVENT } from '@/lib/consent'
import { CONSENT_COPY, type ConsentLocale } from '@/lib/consentCopy'

// Przycisk "Ustawienia cookies" (stopka, polityka prywatności): otwiera panel zgód - wycofanie/zmiana zgody w każdej chwili.
export default function CookieSettingsButton({ locale = 'pl', style }: { locale?: ConsentLocale; style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', textDecoration: 'underline', color: 'inherit', ...style }}
    >
      {CONSENT_COPY[locale].footerButton}
    </button>
  )
}
