import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | InvestRent Nieruchomości Kołobrzeg',
  description: 'Skontaktuj się z biurem nieruchomości InvestRent w Kołobrzegu. Odpowiadamy do 60 minut. Tel: +48 731 554 341',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

export default async function KontaktPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Kontakt' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 38, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>
              Skontaktuj się z nami
            </h1>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>Odpowiadamy do 60 minut — w dni robocze i w weekendy</p>
          </div>
        </div>
        <Contact office={office} />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
