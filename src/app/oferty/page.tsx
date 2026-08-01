export const dynamic = 'force-dynamic'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from './OffersPageClient'
import { getPublicOffers, getOffice } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oferty nieruchomości Kołobrzeg',
  description: 'Przeglądaj aktualne oferty mieszkań, domów i działek na sprzedaż i wynajem w Kołobrzegu i okolicach nadmorskich.',
  // NAPRAWA (audyt SEO 31.07.2026, punkt 3): brak kanonicznego URL na calej stronie.
  alternates: { canonical: 'https://www.investrent.com.pl/oferty' },
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

export default async function OffersPage({ searchParams }: { searchParams: { [k: string]: string } }) {
  const transaction_type = searchParams?.transaction_type ?? ''
  const property_type = searchParams?.property_type ?? ''
  const agent_id = searchParams?.agent_id ?? ''
  const [data, officeData] = await Promise.all([
    getPublicOffers({ limit: 9, ...(property_type && { property_type }), ...(transaction_type && { transaction_type }), ...(agent_id && { agent_id }) } as any),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  const title = transaction_type === 'wynajem' ? 'Nieruchomości do wynajecia' : transaction_type === 'sprzedaz' ? 'Nieruchomości na sprzedaz' : 'Wszystkie oferty'

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Oferty' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 36, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>{title}</h1>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>Kołobrzeg, Mielno, Dźwirzyno i okolice Bałtyku</p>
          </div>
        </div>
        <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} defaultType={property_type} defaultTransaction={transaction_type} agentId={agent_id} />
      </main>
      <Footer office={office} />
      <FloatingWA />

      <SocialSidebar office={office} />
    </>
  )
}
