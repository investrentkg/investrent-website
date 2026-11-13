import type { Metadata } from 'next'
import SprzedajPage from './SprzedajPage'
import { getVerifiedRating } from '@/lib/schemaRating'

// Strona docelowa reklam Google Ads (sprzedaz/wycena). ROBOCZA: noindex,nofollow, poza sitemap, bez menu.
// Teksty zatwierdzone w makiecie M_v8n (Krytyk/Marketing/niezalezny/Prawnik); wdrozenie dopiero po slowie Daniela.
export const metadata: Metadata = {
  title: { absolute: 'Sprzedaż mieszkania lub domu w Kołobrzegu | InvestRent' },
  description: 'Biuro nieruchomości w Kołobrzegu: sprzedaż lub wycena mieszkania i domu. Zadzwoń lub zostaw numer, oddzwonimy w ciągu 24 godzin.',
  alternates: { canonical: 'https://www.investrent.com.pl/sprzedaj-z-investrent' },
  robots: { index: false, follow: false },
}

// Ocena i liczba opinii z jednego zrodla (API opinii Google, ten sam odczyt co JSON-LD na /kontakt); brak wiarygodnych danych = segment ukryty.
export const revalidate = 3600

export default async function Page() {
  const reviewsData = await fetch('https://api.investrent.com.pl/api/public/google-reviews', { next: { revalidate: 3600 } })
    .then(r => r.json()).catch(() => null)
  return <SprzedajPage rating={getVerifiedRating(reviewsData)} />
}
