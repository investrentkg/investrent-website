import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  // NAPRAWA (audyt SEO, Daniel 30.07.2026): metadataBase wymagane przez Next.js
  // do poprawnego rozwiazywania wzglednych URL-i obrazow OG - bez tego byly
  // ostrzezenia budu i obrazek podgladu mogl nie dzialac poprawnie na niektorych
  // platformach (np. WhatsApp).
  metadataBase: new URL('https://www.investrent.com.pl'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  title: {
    // NAPRAWA (audyt SEO, Daniel 30.07.2026): poprzedni tytul mial 75 znakow -
    // Google obcina wyswietlanie tytulu w wynikach wyszukiwania powyzej ok.
    // 60 znakow (doklada "..."), co wyglada nieprofesjonalnie i traci ostatnie,
    // czesto najmocniejsze slowa kluczowe. Skrocone do 61 znakow, zachowujac
    // najsilniejsze frazy (nazwa+lokalizacja+3 glowne intencje wyszukiwania).
    default: 'InvestRent Nieruchomości Kołobrzeg | Kupno, Sprzedaż, Wynajem',
    template: '%s | InvestRent Nieruchomości',
  },
  description: 'Biuro nieruchomości Kołobrzeg. Kupno, sprzedaż i wynajem mieszkań nad Bałtykiem. Odpowiadamy do 60 minut. Bezpłatna wycena nieruchomości.',
  keywords: ['nieruchomości Kołobrzeg', 'mieszkania Kołobrzeg', 'kupno sprzedaż wynajem', 'biuro nieruchomości', 'apartamenty Bałtyk'],
  authors: [{ name: 'InvestRent Nieruchomości' }],
  openGraph: {
    title: 'InvestRent Nieruchomości — Kołobrzeg',
    description: 'Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem. Odpowiadamy do 60 minut.',
    type: 'website',
    locale: 'pl_PL',
    url: 'https://www.investrent.com.pl',
    siteName: 'InvestRent Nieruchomości',
    // NAPRAWA: brakowalo obrazu podgladu - bez tego udostepnienie linku na
    // Facebooku/WhatsApp/Messengerze pokazywalo pusty/domyslny podglad.
    images: [{ url: '/hero.jpg', width: 1920, height: 1080, alt: 'InvestRent Nieruchomości Kołobrzeg' }],
  },
  // NAPRAWA: brakowala karta Twitter/X - bez tego udostepnienie na X tez
  // pokazywalo pusty podglad zamiast zdjecia+opisu.
  twitter: {
    card: 'summary_large_image',
    title: 'InvestRent Nieruchomości — Kołobrzeg',
    description: 'Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem. Odpowiadamy do 60 minut.',
    images: ['/hero.jpg'],
  },
  robots: { index: true, follow: true },
}

// NAPRAWA (audyt webmasterski, Daniel 30.07.2026): usunieto stad drugi,
// KONKURUJACY zestaw danych strukturalnych JSON-LD (RealEstateAgent), ktory
// sam dodalem wczesniej NIE sprawdzajac, ze strona glowna (page.tsx, komponent
// JsonLd) juz ma wlasny, LEPSZY zestaw - dynamiczny, z prawdziwym zywym
// ratingiem Google (aggregateRating) zamiast statycznych danych. Dwa
// sprzeczne skrypty JSON-LD RealEstateAgent na tej samej stronie to realny
// blad SEO (Google nie wie ktoremu ufac). Zostaje TYLKO wersja z page.tsx -
// patrz tez poprawka bledengo URL (Railway zamiast prawdziwej domeny) tam.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOWE (31.07.2026, przygotowanie pod Google Search Console/Analytics,
  // Daniel: "chce sie polaczyc z narzedziami Google"): skrypt Google
  // Analytics (GA4) jest tu juz w pelni przygotowany, ale CELOWO nieaktywny
  // dopoki nie zostanie dodana prawdziwa zmienna srodowiskowa w Vercel
  // (NEXT_PUBLIC_GA_MEASUREMENT_ID) - to znaczy ze po zalozeniu wlasciwosci
  // GA4 przez Daniela, wystarczy wkleic numer pomiaru w panelu Vercel,
  // BEZ zadnej kolejnej zmiany w kodzie i bez ponownego wdrazania przez nas.
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="pl" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <div className="page-wrap">
          {children}
        </div>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
