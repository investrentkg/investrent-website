import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | InvestRent Nieruchomosci Kolobrzeg',
  description: 'Skontaktuj sie z biurem nieruchomosci InvestRent w Kolob rzegu. Odpowiadamy do 60 minut.',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

export default async function KontaktPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona glowna', href: '/' }, { label: 'Kontakt' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 38, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>Skontaktuj sie z nami</h1>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>Odpowiadamy do 60 minut</p>
          </div>
        </div>
        <Contact office={office} />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
