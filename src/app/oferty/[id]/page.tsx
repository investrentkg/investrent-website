import { getPublicOffer } from '@/lib/api'
import PageLayout from '@/components/PageLayout'
import Breadcrumb from '@/components/Breadcrumb'
import OfferDetailClient from './OfferDetailClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const offer = await getPublicOffer(params.id)
  if (!offer) return { title: 'Oferta | InvestRent' }
  return {
    title: `${offer.title ?? 'Oferta'} | InvestRent Kołobrzeg`,
    description: `${offer.property_type} ${offer.transaction_type === 'sprzedaz' ? 'na sprzedaż' : 'do wynajęcia'} w ${offer.address_city}. ${offer.price ? offer.price.toLocaleString('pl-PL') + ' zł' : 'Cena na zapytanie'}`,
  }
}

export default async function OfferPage({ params }: { params: { id: string } }) {
  const offer = await getPublicOffer(params.id) as any
  if (!offer) notFound()

  const crumbs = [
    { label: 'Strona główna', href: '/' },
    { label: 'Oferty', href: '/oferty' },
    { label: offer.title ?? offer.ref_number },
  ]

  return (
    <PageLayout>
      <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '24px 0 20px' }}>
        <div className="container">
          <Breadcrumb crumbs={crumbs} />
        </div>
      </div>
      <OfferDetailClient offer={offer} />
    </PageLayout>
  )
}
