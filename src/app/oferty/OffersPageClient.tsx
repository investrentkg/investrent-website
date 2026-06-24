"use client"
import { useState, useCallback } from 'react'
import { Search, MapPin, LayoutGrid, Ruler, Layers, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Offer } from '@/types'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'

const PROPERTY_TYPES = [
  { value: '', label: 'Wszystkie typy' },
  { value: 'mieszkanie', label: 'Mieszkania' },
  { value: 'dom', label: 'Domy' },
  { value: 'dzialka', label: 'Działki' },
  { value: 'lokal', label: 'Lokale' },
  { value: 'inwestycja', label: 'Inwestycje' },
]
const TRANSACTION_TYPES = [
  { value: '', label: 'Kupno i wynajem' },
  { value: 'sprzedaz', label: 'Na sprzedaż' },
  { value: 'wynajem', label: 'Do wynajęcia' },
]

function priceLabel(p: number | null, t: string) {
  if (!p) return 'Cena na zapytanie'
  return p.toLocaleString('pl-PL') + ' zł' + (t === 'wynajem' ? '/mies.' : '')
}

function OfferCard({ offer }: { offer: Offer }) {
  const badge = offer.is_exclusive ? { label: 'NA WYŁĄCZNOŚCI', bg: '#1a4fa0' }
    : offer.no_rent_fee ? { label: 'BEZ PROWIZJI', bg: '#10b981' }
    : offer.status === 'zarezerwowana' ? { label: 'ZAREZERWOWANA', bg: '#f59e0b' }
    : null

  return (
    <Link href={`/oferty/${offer.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', transition: 'transform .2s, box-shadow .2s', cursor: 'pointer' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 14px 32px rgba(0,0,0,.1)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow='' }}>
        <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
          {offer.main_photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={offer.main_photo} alt={offer.title ?? 'Oferta'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#cbd5e1' }}>🏠</div>
          )}
          {badge && <span style={{ position: 'absolute', top: 12, left: 12, background: badge.bg, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>{badge.label}</span>}
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,.9)', color: '#6b7280', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 5 }}>{offer.ref_number}</span>
          {offer.photo_count > 1 && <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,.5)', color: 'white', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>📷 {offer.photo_count}</span>}
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 5 }}>{offer.title ?? `${offer.property_type} · ${offer.transaction_type}`}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 12, marginBottom: 12 }}>
            <MapPin size={13} />{offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' as const }}>
            {offer.rooms_count && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><LayoutGrid size={13} />{offer.rooms_count} pok.</span>}
            {offer.area && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><Ruler size={13} />{offer.area} m²</span>}
            {offer.floor !== null && offer.floor !== undefined && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><Layers size={13} />{offer.floor} p.</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 20, color: '#1a4fa0' }}>{priceLabel(offer.price, offer.transaction_type)}</span>
            {offer.price_per_m2 && <span style={{ fontSize: 11, color: '#9ca3af' }}>{offer.price_per_m2.toLocaleString('pl-PL')} zł/m²</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function OffersPageClient({ initialOffers, initialTotal, defaultType, defaultTransaction }: {
  initialOffers: Offer[]; initialTotal: number; defaultType?: string; defaultTransaction?: string
}) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const LIMIT = 9

  const [filters, setFilters] = useState({
    property_type: defaultType ?? '',
    transaction_type: defaultTransaction ?? '',
    city: '',
    min_price: '',
    max_price: '',
  })

  const fetch_offers = useCallback(async (f: typeof filters, p: number) => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ limit: String(LIMIT), page: String(p) })
      if (f.property_type)   q.set('property_type',   f.property_type)
      if (f.transaction_type) q.set('transaction_type', f.transaction_type)
      const res = await fetch(`${API}/api/public/offers?${q}`)
      const data = await res.json()
      setOffers(data.data ?? [])
      setTotal(data.pagination?.total ?? 0)
    } finally { setLoading(false) }
  }, [])

  function applyFilters() {
    setPage(1)
    fetch_offers(filters, 1)
    setShowFilters(false)
  }

  function changePage(p: number) {
    setPage(p)
    fetch_offers(filters, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div style={{ background: '#f8fafc', minHeight: '60vh' }}>
      {/* Filters bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0', position: 'sticky', top: 76, zIndex: 50 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <select value={filters.transaction_type} onChange={e => setFilters(f => ({ ...f, transaction_type: e.target.value }))}
              style={{ padding: '9px 14px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer' }}>
              {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={filters.property_type} onChange={e => setFilters(f => ({ ...f, property_type: e.target.value }))}
              style={{ padding: '9px 14px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer' }}>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button onClick={applyFilters}
              style={{ background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 9, padding: '9px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Search size={14} /> Szukaj
            </button>
            <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 13 }}>
              {loading ? 'Ładowanie…' : `${total} ${total === 1 ? 'oferta' : 'ofert'}`}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontSize: 15 }}>Ładowanie ofert…</div>
        ) : offers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Brak ofert spełniających kryteria</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Zmień filtry lub <a href="/kontakt" style={{ color: '#1a4fa0' }}>skontaktuj się z nami</a></div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginBottom: 32 }}>
              {offers.map(o => <OfferCard key={o.id} offer={o} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <button onClick={() => changePage(page - 1)} disabled={page === 1}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? .4 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => changePage(p)}
                    style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid', borderColor: p === page ? '#1a4fa0' : '#e5e7eb', background: p === page ? '#1a4fa0' : 'white', color: p === page ? 'white' : '#374151', fontWeight: p === page ? 700 : 400, cursor: 'pointer', fontSize: 14 }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? .4 : 1 }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
