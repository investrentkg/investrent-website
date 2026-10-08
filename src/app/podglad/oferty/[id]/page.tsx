// Podgląd roboczej, niezatwierdzonej oferty (link z tokenem: /oferty/<id>?preview=<token>, który middleware.ts
// przepisuje tutaj bez zmiany adresu w przeglądarce). ZAWSZE dynamicznie (token w searchParams, brak cache),
// noindex ustawia buildOfferMetadata przy niepustym tokenie. Bez tokenu strona nie istnieje (404).
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildOfferMetadata, renderOfferPage } from '@/app/oferty/[id]/offerPageImpl'

export async function generateMetadata({ params, searchParams }: { params: { id: string }; searchParams: { preview?: string } }): Promise<Metadata> {
  const previewToken = searchParams?.preview
  if (!previewToken) return { title: 'Podgląd oferty', robots: { index: false, follow: false } }
  return buildOfferMetadata(params, previewToken)
}

export default async function OfferPreviewPage({ params, searchParams }: { params: { id: string }; searchParams: { preview?: string } }) {
  const previewToken = searchParams?.preview
  if (!previewToken) notFound()
  return renderOfferPage(params, previewToken)
}
