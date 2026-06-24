import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Breadcrumb from '@/components/Breadcrumb'
import OfferDetailClient from './OfferDetailClient'
import { getPublicOffer, getOffice } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const offer = await getPublicOffer(params.id) as any
  if (!offer) return { title: 'Oferta | InvestRent' }
  return {
    title: `${offer.title ?? 'Oferta'} | InvestRent Kolobrzeg`,
    description: `${offer.property_type} w ${offer.address_city}. ${offer.price ? offer.price.toLocaleString('pl-PL') + ' zl' : 'Cena na zapytanie'}`,
  }
}

export default async function OfferPage({ params }: { params: { id: string } }) {
  const [offer, officeData] = await Promise.all([
    getPublicOffer(params.id),
    getOffice(),
  ]) as any[]
  if (!offer) notFound()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '24px 0 20px' }}>
          <div className="container">
            <Breadcrumb crumbs={[{ label: 'Strona glowna', href: '/' }, { label: 'Oferty', href: '/oferty' }, { label: offer.title ?? offer.ref_number }]} />
          </div>
        </div>
        <OfferDetailClient offer={offer} />
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
