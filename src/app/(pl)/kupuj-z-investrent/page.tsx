import type { Metadata } from 'next'
import KupujPage from './KupujPage'
import { getVerifiedRating } from '@/lib/schemaRating'

// Strona docelowa reklam Google Ads (kupno). noindex,nofollow, poza sitemap, bez menu.
// Teksty zatwierdzone w makiecie M_k5 (Krytyk/Marketing/Prawnik; Daniel 11.11.2026).
export const metadata: Metadata = {
  title: { absolute: 'Kupno mieszkania lub domu w Kołobrzegu | InvestRent' },
  description: 'Kupno mieszkania lub domu w Kołobrzegu. Zadzwoń lub zostaw numer, oddzwonimy w ciągu 24 godzin.',
  alternates: { canonical: 'https://www.investrent.com.pl/kupuj-z-investrent' },
  robots: { index: false, follow: false },
}

// Ocena i liczba opinii z jednego zrodla (API opinii Google, ten sam odczyt co JSON-LD na /kontakt); brak wiarygodnych danych = segment ukryty.
export const revalidate = 3600

export default async function Page() {
  const reviewsData = await fetch('https://api.investrent.com.pl/api/public/google-reviews', { next: { revalidate: 3600 } })
    .then(r => r.json()).catch(() => null)
  return <KupujPage rating={getVerifiedRating(reviewsData)} />
}
