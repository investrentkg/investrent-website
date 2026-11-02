import type { Metadata } from 'next'
import SaleListingPage from '@/components/SaleListingPage'
import { DZIALKI } from '@/content/sprzedaz'
import { buildPageMeta } from '@/lib/buildPageMeta'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: DZIALKI.title + ' | InvestRent' },
  description: DZIALKI.description,
  alternates: { canonical: 'https://www.investrent.com.pl' + DZIALKI.path },
  ...buildPageMeta({ title: DZIALKI.title + ' | InvestRent', description: DZIALKI.description, path: DZIALKI.path }),
}

export default function Page() {
  return <SaleListingPage c={DZIALKI} />
}
