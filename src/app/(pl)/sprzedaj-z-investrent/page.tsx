import type { Metadata } from 'next'
import SprzedajPage from './SprzedajPage'

// Strona docelowa reklam Google Ads (sprzedaz/wycena). ROBOCZA: noindex,nofollow, poza sitemap, bez menu.
// Teksty zatwierdzone w makiecie M_v8n (Krytyk/Marketing/niezalezny/Prawnik); wdrozenie dopiero po slowie Daniela.
export const metadata: Metadata = {
  title: { absolute: 'Sprzedaż mieszkania lub domu w Kołobrzegu | InvestRent' },
  description: 'Sprzedaż lub wycena nieruchomości w Kołobrzegu. Zadzwoń lub zostaw numer, oddzwonimy w ciągu 24 godzin.',
  alternates: { canonical: 'https://www.investrent.com.pl/sprzedaj-z-investrent' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <SprzedajPage />
}
