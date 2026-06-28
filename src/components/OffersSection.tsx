"use client"
import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { MapPin, LayoutGrid, Ruler, Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Offer, PaginatedOffers } from '@/types'


const TABS = [
  { key: 'new',       label: 'Najnowsze' },
  { key: 'promo',     label: 'W promocji' },
  { key: 'exclusive', label: 'Na wyłączność' },
] as const

function priceLabel(p: number | null) {
  if (!p) return 'Cena na zapytanie'
  return p.toLocaleString('pl-PL') + ' zł'
}

function getBadge(offer: Offer, tab: string) {
  if (offer.exclusivity) return { label: 'NA WYŁĄCZNOŚCI', color: '#1a4fa0' }
  if (offer.no_rent_fee)  return { label: 'BEZ PROWIZJI',   color: '#10b981' }
  if (tab === 'promo')    return { label: 'W PROMOCJI',      color: '#10b981' }
  return null
}

function OfferCard({ offer, tab }: { offer: Offer; tab: string }) {
  const badge = getBadge(offer, tab)
  return (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', flexShrink: 0, width: 'calc(33.333% - 15px)', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 14px 32px rgba(0,0,0,.1)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; (e.currentTarget as HTMLElement).style.boxShadow='' }}>
      <div style={{ height: 220, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
        {offer.main_photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={offer.main_photo} alt={offer.title ?? 'Oferta'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
            onMouseEnter={e => (e.currentTarget.style.transform='scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform='')} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', fontSize: 48 }}>🏠</div>
        )}
        {badge && (
          <span style={{ position: 'absolute', top: 11, left: 11, background: badge.color, color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 5, letterSpacing: '.3px' }}>
            {badge.label}
          </span>
        )}
        <span style={{ position: 'absolute', top: 11, right: 11, background: 'rgba(255,255,255,.9)', color: '#6b7280', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 5 }}>
          {offer.ref_number}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{offer.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 12, marginBottom: 11 }}>
          <MapPin size={12} /> {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          {offer.rooms_count && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><LayoutGrid size={12} /> {offer.rooms_count} pok.</span>}
          {offer.area && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><Ruler size={12} /> {offer.area} m²</span>}
          {offer.floor !== null && offer.floor !== undefined && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><Layers size={12} /> {offer.floor} p.</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 20, color: '#1a4fa0' }}>{priceLabel(offer.price)}</span>
          {offer.price_per_m2 && <span style={{ fontSize: 11, color: '#9ca3af' }}>{offer.price_per_m2.toLocaleString('pl-PL')} zł/m²</span>}
        </div>
      </div>
    </div>
  )
}

export default function OffersSection({ initialOffers }: { initialOffers: PaginatedOffers | null }) {
  const hasRealOffers = (initialOffers?.data?.length ?? 0) > 0
  const [cols, setCols] = useState(3)
  useEffect(() => { const u = () => setCols(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3); u(); window.addEventListener('resize', u); return () => window.removeEventListener('resize', u) }, [])
  const [tab, setTab]       = useState<'new' | 'promo' | 'exclusive'>('new')
  const [offers, setOffers] = useState<Offer[]>(hasRealOffers ? initialOffers!.data : [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (offers.length === 0) {
      setLoading(true)
      fetch(`${API}/api/public/offers?limit=6&page=1`)
        .then(r => r.json())
        .then(d => { if (d.data?.length > 0) setOffers(d.data) })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [])
  const [cur, setCur]       = useState(0)
  const [usingSamples, setUsingSamples] = useState(!hasRealOffers)

  const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
  const perView = 3
  const maxSlide = Math.max(0, offers.length - perView)

  const fetchOffers = useCallback(async (newTab: typeof tab) => {
    setLoading(true); setCur(0)
    try {
      const res = await fetch(`${API}/api/public/offers?tab=${newTab}&limit=9`)
      const data = await res.json()
      if (data.data?.length > 0) {
        setOffers(data.data)
        setUsingSamples(false)
      } else {
        // Filtruj przykładowe oferty po tabie
        if (newTab === 'exclusive') setOffers([])
        else if (newTab === 'promo') setOffers([])
        else setOffers([])
        setUsingSamples(true)
      }
    } catch {
      setOffers([])
      setUsingSamples(true)
    } finally { setLoading(false) }
  }, [API])

  function switchTab(t: typeof tab) { setTab(t); fetchOffers(t) }

  return (
    <section id="oferty" style={{ padding: '56px 0', background: '#f8fafc' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 8 }}>
              Nieruchomości
            </div>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 26, color: '#0d2a5c', letterSpacing: '-.4px' }}>Nasze oferty</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => switchTab(t.key)}
                  style={{ padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '1.5px solid', transition: 'all .2s', background: tab === t.key ? '#1a4fa0' : 'transparent', color: tab === t.key ? 'white' : '#6b7280', borderColor: tab === t.key ? '#1a4fa0' : '#e5e7eb' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <a href="#kontakt" style={{ fontSize: 13, fontWeight: 700, color: '#1a4fa0', border: '1.5px solid #1a4fa0', padding: '8px 18px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
              Wszystkie <ArrowRight size={14} />
            </a>
          </div>
        </div>



        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>Ładowanie ofert…</div>
        ) : (
          <>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 22, transition: 'transform .5s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${cur * (100 / perView + 2)}%)` }}>
                {offers.map(o => <OfferCard key={o.id} offer={o} tab={tab} />)}
              </div>
            </div>
            {offers.length > perView && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                <button onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cur === 0 ? .3 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                <div style={{ display: 'flex', gap: 7 }}>
                  {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                    <button key={i} onClick={() => setCur(i)}
                      style={{ width: i === cur ? 22 : 8, height: 8, borderRadius: i === cur ? 4 : '50%', background: i === cur ? '#1a4fa0' : '#e5e7eb', border: 'none', cursor: 'pointer', transition: 'all .25s' }} />
                  ))}
                </div>
                <button onClick={() => setCur(c => Math.min(maxSlide, c + 1))} disabled={cur === maxSlide}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cur === maxSlide ? .3 : 1 }}>
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