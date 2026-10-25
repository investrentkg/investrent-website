import type { Metadata } from 'next'
import SaleListingPage from '@/components/SaleListingPage'
import { MIESZKANIA } from '@/content/sprzedaz'
import { buildPageMeta } from '@/lib/buildPageMeta'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: MIESZKANIA.title + ' | InvestRent' },
  description: MIESZKANIA.description,
  alternates: { canonical: 'https://www.investrent.com.pl' + MIESZKANIA.path },
  ...buildPageMeta({ title: MIESZKANIA.title + ' | InvestRent', description: MIESZKANIA.description, path: MIESZKANIA.path }),
}

export default function Page() {
  return <SaleListingPage c={MIESZKANIA} />
}
