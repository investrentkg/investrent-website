import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import KalkulatorClient from './KalkulatorClient'
import { getOffice } from '@/lib/api'

export const metadata = {
  title: 'Kalkulator kredytowy | InvestRent',
  description: 'Oblicz ratę kredytu hipotecznego i sprawdź zdolność kredytową',
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
