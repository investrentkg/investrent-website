import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { getOffice } from '@/lib/api'

export default async function PageLayout({ children }: { children: React.ReactNode }) {
  const office = await getOffice()
  const fallback = {
    name: 'InvestRent Nieruchomości',
    logo_url: '/logo.png',
    address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
    phone: '+48 731 554 341',
    email: 'biuro@investrent.com.pl',
    website: null,
    working_hours: null,
  }
  const off = office ?? fallback
  return (
    <>
      <Nav office={off} />
      <main>{children}</main>
      <Footer office={off} />
      <FloatingWA />
    </>
  )
}
