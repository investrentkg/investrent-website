import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InvestRent Nieruchomości Kołobrzeg – Sprzedaż i Wynajem',
  description: 'Biuro nieruchomości InvestRent w Kołobrzegu. Profesjonalna pomoc przy sprzedaży, zakupie i wynajmie nieruchomości nad morzem. Zaufany partner w obrocie nieruchomościami.',
  keywords: 'nieruchomości Kołobrzeg, mieszkania Kołobrzeg, domy Kołobrzeg, sprzedaż nieruchomości, wynajem Kołobrzeg, biuro nieruchomości',
  openGraph: {
    title: 'InvestRent Nieruchomości Kołobrzeg',
    description: 'Twój zaufany partner w obrocie nieruchomościami nad Bałtykiem',
    url: 'https://investrent.com.pl',
    siteName: 'InvestRent',
    locale: 'pl_PL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
