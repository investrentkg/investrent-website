import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import KalkulatorClient from './KalkulatorClient'
import { getOffice } from '@/lib/api'

export const metadata = {
  title: 'Kalkulator kredytowy',
  description: 'Oblicz ratę kredytu hipotecznego i sprawdź zdolność kredytową',
  // NAPRAWA (audyt SEO 31.07.2026, punkt 3): brak kanonicznego URL na calej stronie.
  alternates: { canonical: 'https://www.investrent.com.pl/kalkulator' },
}

export default async function KalkulatorPage() {
  const office = await getOffice().catch(() => null)
  return (
    <>
      <Nav office={office} />
      <KalkulatorClient />
      <Footer office={office} />
    </>
  )
}
