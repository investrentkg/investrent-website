"use client"
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, LayoutGrid, Ruler, StairsUp, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Offer, PaginatedOffers } from '@/types'

const TABS = [
  { key: 'new',       label: 'Najnowsze' },
  { key: 'promo',     label: 'W promocji' },
  { key: 'exclusive', label: 'Na wyłączność' },
] as const

const BADGE: Record<string, { label: string; color: string }> = {
  new:       { label: 'NOWE',           color: 'bg-gold' },
  promo:     { label: 'W PROMOCJI',     color: 'bg-green-500' },
  exclusive: { label: 'NA WYŁĄCZNOŚCI', color: 'bg-blue' },
}

function priceLabel(p: number | null) {
  if (!p) return 'Cena na zapytanie'
  return p.toLocaleString('pl-PL') + ' zł'
}

function OfferCard({ offer, tab }: { offer: Offer; tab: string }) {
  const badge = offer.is_exclusive
    ? { label: 'NA WYŁĄCZNOŚCI', color: 'bg-blue' }
    : offer.no_rent_fee
    ? { label: 'BEZ PROWIZJI', color: 'bg-green-500' }
    : BADGE[tab] ?? null

  return (
    <div className="offer-card flex-shrink-0" style={{ width: 'calc(33.333% - 15px)' }}>
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {offer.main_photo ? (
          <Image src={offer.main_photo} alt={offer.title ?? 'Oferta'} fill
            className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="400px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-5xl">🏠</div>
        )}
        {badge && (
          <span className={`absolute top-2.5 left-2.5 ${badge.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide`}>
            {badge.label}
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 bg-white/90 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
          {offer.ref_number}
        </span>
      </div>
      <div className="p-4">
        <div className="text-[13px] font-bold text-slate-900 mb-1">{offer.title ?? `${offer.property_type} na ${offer.transaction_type}`}</div>
        <div className="flex items-center gap-1 text-slate-500 text-[12px] mb-3">
          <MapPin size={12} /> {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}
        </div>
        <div className="flex gap-4 mb-3">
          {offer.rooms_count && <span className="flex items-center gap-1 text-[11px] text-slate-500"><LayoutGrid size={12} /> {offer.rooms_count} {offer.rooms_count === 1 ? 'pokój' : 'pokoje'}</span>}
          {offer.area && <span className="flex items-center gap-1 text-[11px] text-slate-500"><Ruler size={12} /> {offer.area} m²</span>}
          {offer.floor !== null && offer.floor !== undefined && <span className="flex items-center gap-1 text-[11px] text-slate-500"><StairsUp size={12} /> {offer.floor} p.</span>}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-mont font-black text-[20px] text-blue">{priceLabel(offer.price)}</span>
          {offer.price_per_m2 && <span className="text-[11px] text-slate-400">{offer.price_per_m2.toLocaleString('pl-PL')} zł/m²</span>}
        </div>
      </div>
    </div>
  )
}

interface Props {
  initialOffers: PaginatedOffers | null
}

export default function OffersSection({ initialOffers }: Props) {
  const [tab, setTab] = useState<'new' | 'promo' | 'exclusive'>('new')
  const [offers, setOffers] = useState<Offer[]>(initialOffers?.data ?? [])
  const [loading, setLoading] = useState(false)
  const [cur, setCur] = useState(0)

  const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
  const perView = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 3
  const maxSlide = Math.max(0, offers.length - perView)

  const fetchOffers = useCallback(async (newTab: typeof tab) => {
    setLoading(true)
    setCur(0)
    try {
      const res = await fetch(`${API}/api/public/offers?tab=${newTab}&limit=9`)
      const data = await res.json()
      setOffers(data.data ?? [])
    } finally {
      setLoading(false)
    }
  }, [API])

  function switchTab(t: typeof tab) {
    setTab(t)
    fetchOffers(t)
  }

  function go(n: number) {
    setCur(Math.max(0, Math.min(n, maxSlide)))
  }

  const cardW = 100 / perView  // percent

  return (
    <section id="oferty" className="section section-alt">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="tag bg-blue/8 text-blue mb-2">Nieruchomości</div>
            <h2 className="heading text-[26px] text-navy">Nasze oferty</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {TABS.map(t => (
                <button key={t.key}
                  onClick={() => switchTab(t.key)}
                  className={`px-4 py-1.5 rounded-lg text-[12px] font-bold border-[1.5px] transition-all ${
                    tab === t.key ? 'bg-blue text-white border-blue' : 'text-slate-500 border-slate-200 hover:border-blue hover:text-blue'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
            <a href="/oferty" className="btn-outline text-[13px] py-2 px-4">
              Wszystkie <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-slate-400">Ładowanie ofert…</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Brak ofert w tej kategorii</div>
        ) : (
          <>
            <div className="overflow-hidden">
              <div className="flex gap-5 transition-transform duration-500"
                style={{ transform: `translateX(-${cur * (cardW + (20 / offers.length))}%)` }}>
                {offers.map(o => <OfferCard key={o.id} offer={o} tab={tab} />)}
              </div>
            </div>
            {offers.length > perView && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => go(cur - 1)} disabled={cur === 0}
                  className="w-9 h-9 rounded-full border-[1.5px] border-slate-200 flex items-center justify-center hover:border-blue hover:text-blue transition-all disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                    <button key={i} onClick={() => go(i)}
                      className={`carousel-dot ${i === cur ? 'active' : ''}`} />
                  ))}
                </div>
                <button onClick={() => go(cur + 1)} disabled={cur === maxSlide}
                  className="w-9 h-9 rounded-full border-[1.5px] border-slate-200 flex items-center justify-center hover:border-blue hover:text-blue transition-all disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
