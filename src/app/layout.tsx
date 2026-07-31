import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
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
    default: 'InvestRent Nieruchomości Kołobrzeg | Kupno, Sprzedaż, Wynajem nad Bałtykiem',
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

// NAPRAWA: dane strukturalne JSON-LD (schema.org RealEstateAgent) - brakowalo
// calkowicie. To co pozwala Google pokazac biuro jako firme lokalna w wynikach
// (adres/telefon/godziny wprost w wyszukiwarce), istotne dla SEO lokalnego
// biura nieruchomosci.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'InvestRent Nieruchomości',
  image: 'https://www.investrent.com.pl/logo.png',
  url: 'https://www.investrent.com.pl',
  telephone: '+48731554341',
  email: 'biuro@investrent.com.pl',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ul. Ratuszowa 12/1 lok. 3',
    addressLocality: 'Kołobrzeg',
    postalCode: '78-100',
    addressCountry: 'PL',
  },
  areaServed: { '@type': 'City', name: 'Kołobrzeg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <div className="page-wrap">
          {children}
        </div>
      </body>
    </html>
  )
}
