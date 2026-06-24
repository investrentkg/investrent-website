import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from './OffersPageClient'
import { getPublicOffers, getOffice } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oferty nieruchomosci Kolobrzeg | InvestRent',
  description: 'Przegladaj oferty mieszkan, domow i dzialek na sprzedaz i wynajem w Kolob rzegu i okolicach.',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

export default async function OffersPage({ searchParams }: { searchParams: { [k: string]: string } }) {
  const transaction_type = searchParams?.transaction_type ?? ''
  const property_type = searchParams?.property_type ?? ''
  const [data, officeData] = await Promise.all([
    getPublicOffers({ limit: 9, ...(property_type && { property_type }), ...(transaction_type && { transaction_type }) }),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  const title = transaction_type === 'wynajem' ? 'Nieruchomosci do wynajecia' : transaction_type === 'sprzedaz' ? 'Nieruchomosci na sprzedaz' : 'Wszystkie oferty'

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona glowna', href: '/' }, { label: 'Oferty' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 36, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>{title}</h1>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>Kolobrzeg, Mielno, Dzwirzyno i okolice Baltyku</p>
          </div>
        </div>
        <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} defaultType={property_type} defaultTransaction={transaction_type} />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
