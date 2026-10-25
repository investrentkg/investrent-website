import type { Metadata } from 'next'
import SaleListingPage from '@/components/SaleListingPage'
import { DOMY } from '@/content/sprzedaz'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: DOMY.title + ' | InvestRent' },
  description: DOMY.description,
  alternates: { canonical: 'https://www.investrent.com.pl' + DOMY.path },
}

export default function Page() {
  return <SaleListingPage c={DOMY} />
}
