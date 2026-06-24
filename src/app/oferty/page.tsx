import { getPublicOffers } from '@/lib/api'
import PageLayout from '@/components/PageLayout'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from './OffersPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oferty nieruchomości Kołobrzeg | InvestRent',
  description: 'Przeglądaj oferty mieszkań, domów i działek na sprzedaż i wynajem w Kołobrzegu i okolicach.',
}

export default async function OffersPage({ searchParams }: { searchParams: { [k: string]: string } }) {
  const transaction_type = searchParams.transaction_type ?? ''
  const property_type = searchParams.property_type ?? ''

  const data = await getPublicOffers({ limit: 9, ...(property_type && { property_type }), ...(transaction_type && { transaction_type }) })

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Oferty' }]} />
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 36, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>
            {transaction_type === 'wynajem' ? 'Nieruchomości do wynajęcia' : transaction_type === 'sprzedaz' ? 'Nieruchomości na sprzedaż' : 'Wszystkie oferty'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>
            Kołobrzeg, Mielno, Dźwirzyno i okolice Bałtyku
          </p>
        </div>
      </div>
      <OffersPageClient
        initialOffers={data?.data ?? []}
        initialTotal={data?.pagination?.total ?? 0}
        defaultType={property_type}
        defaultTransaction={transaction_type}
      />
    </PageLayout>
  )
}
