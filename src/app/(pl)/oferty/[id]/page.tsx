// ISR (08.10.2026): strona oferty nie czyta `searchParams` (to wymuszało renderowanie dynamiczne przy KAŻDYM
// żądaniu: Cache-Control private/no-store, X-Vercel-Cache MISS). Link podglądu (?preview=...) obsługuje
// middleware.ts, który przepisuje go na /podglad/oferty/[id]. Treść: ./offerPageImpl.tsx.
//
// NAPRAWA (audyt SEO 31.07.2026, punkt 4): jak na stronie glownej, ale
// krotsze okno odswiezania (60s zamiast 300s) - cena/dostepnosc pojedynczej
// oferty moze sie zmienic bardziej "pilnie" niz ogolna lista na stronie
// glownej, wiec balans przechyla sie bardziej w strone swiezosci danych.
export const revalidate = 60

import type { Metadata } from 'next'
import { buildOfferMetadata, renderOfferPage } from './offerPageImpl'

// Pusta lista: żadna oferta nie jest budowana z góry (bez zapytań do API w czasie buildu), ale trasa
// przechodzi w tryb ISR - pierwsze wejście renderuje się na żądanie, kolejne idą z cache.
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return buildOfferMetadata(params)
}

export default async function OfferPage({ params }: { params: { id: string } }) {
  return renderOfferPage(params)
}
