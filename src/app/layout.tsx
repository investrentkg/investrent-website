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
  title: 'InvestRent Nieruchomości Kołobrzeg | Kupno, Sprzedaż, Wynajem nad Bałtykiem',
  description: 'Biuro nieruchomości Kołobrzeg. Kupno, sprzedaż i wynajem mieszkań nad Bałtykiem. Odpowiadamy do 60 minut. Bezpłatna wycena nieruchomości.',
  keywords: ['nieruchomości Kołobrzeg', 'mieszkania Kołobrzeg', 'kupno sprzedaż wynajem', 'biuro nieruchomości', 'apartamenty Bałtyk'],
  authors: [{ name: 'InvestRent Nieruchomości' }],
  openGraph: {
    title: 'InvestRent Nieruchomości — Kołobrzeg',
    description: 'Kupno, sprzedaż i wynajem nieruchomości nad Bałtykiem. Odpowiadamy do 60 minut.',
    type: 'website',
    locale: 'pl_PL',
    url: 'https://www.investrent.com.pl',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <div className="page-wrap">
          {children}
        </div>
      </body>
    </html>
  )
}
