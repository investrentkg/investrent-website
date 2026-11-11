import type { Metadata } from 'next'
import KupujPage from './KupujPage'

// Strona docelowa reklam Google Ads (kupno). noindex,nofollow, poza sitemap, bez menu.
// Teksty zatwierdzone w makiecie M_k5 (Krytyk/Marketing/Prawnik; Daniel 11.11.2026).
export const metadata: Metadata = {
  title: { absolute: 'Kupno mieszkania lub domu w Kołobrzegu | InvestRent' },
  description: 'Kupno mieszkania lub domu w Kołobrzegu. Zadzwoń lub zostaw numer, oddzwonimy w ciągu 24 godzin.',
  alternates: { canonical: 'https://www.investrent.com.pl/kupuj-z-investrent' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <KupujPage />
}
