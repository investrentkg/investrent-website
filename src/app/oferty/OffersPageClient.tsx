"use client"
import { useState, useCallback } from 'react'
import { Search, MapPin, LayoutGrid, Ruler, Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Offer } from '@/types'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'

const SAMPLE: Offer[] = [
  { id: 's1', ref_number: 'IVST-MS-155', title: 'Mieszkanie na sprzedaż', property_type: 'mieszkanie', transaction_type: 'sprzedaz', market_type: 'wtorny', price: 410000, price_per_m2: 7884, area: 52, rooms_count: 2, floor: 3, floors_total: 5, address_city: 'Kołobrzeg', address_district: 'os. Pomorskie', address_street: null, is_exclusive: true, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-01', main_photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&fit=crop&h=340', photo_count: 5 },
  { id: 's2', ref_number: 'IVST-AP-089', title: 'Apartament nad morzem', property_type: 'mieszkanie', transaction_type: 'sprzedaz', market_type: 'pierwotny', price: 549000, price_per_m2: 14447, area: 38, rooms_count: 2, floor: 4, floors_total: 6, address_city: 'Dźwirzyno', address_district: 'przy plaży', address_street: null, is_exclusive: false, no_rent_fee: true, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-02', main_photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&fit=crop&h=340', photo_count: 8 },
  { id: 's3', ref_number: 'IVST-DM-012', title: 'Dom wolnostojący', property_type: 'dom', transaction_type: 'sprzedaz', market_type: 'wtorny', price: 1190000, price_per_m2: 8500, area: 140, rooms_count: 5, floor: 0, floors_total: 2, address_city: 'Mielno', address_district: null, address_street: null, is_exclusive: false, no_rent_fee: false, is_swap: false, has_garden: true, status: 'opublikowana', created_at: '2026-01-03', main_photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&fit=crop&h=340', photo_count: 12 },
  { id: 's4', ref_number: 'IVST-MT-067', title: 'Mieszkanie z tarasem', property_type: 'mieszkanie', transaction_type: 'sprzedaz', market_type: 'wtorny', price: 620000, price_per_m2: 9117, area: 68, rooms_count: 3, floor: 5, floors_total: 7, address_city: 'Kołobrzeg', address_district: 'centrum', address_street: null, is_exclusive: true, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-04', main_photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80&fit=crop&h=340', photo_count: 6 },
  { id: 's5', ref_number: 'IVST-KW-034', title: 'Kawalerka inwestycyjna', property_type: 'mieszkanie', transaction_type: 'sprzedaz', market_type: 'wtorny', price: 189000, price_per_m2: 6750, area: 28, rooms_count: 1, floor: 2, floors_total: 4, address_city: 'Kołobrzeg', address_district: 'os. Lęborska', address_street: null, is_exclusive: false, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-05', main_photo: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80&fit=crop&h=340', photo_count: 4 },
  { id: 's6', ref_number: 'IVST-DZ-098', title: 'Działka budowlana', property_type: 'dzialka', transaction_type: 'sprzedaz', market_type: 'wtorny', price: 165000, price_per_m2: 206, area: 800, rooms_count: null, floor: null, floors_total: null, address_city: 'Kołobrzeg', address_district: 'Podczele', address_street: null, is_exclusive: false, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-06', main_photo: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80&fit=crop&h=340', photo_count: 3 },
  { id: 's7', ref_number: 'IVST-WY-011', title: 'Mieszkanie do wynajęcia', property_type: 'mieszkanie', transaction_type: 'wynajem', market_type: 'wtorny', price: 3200, price_per_m2: null, area: 55, rooms_count: 2, floor: 2, floors_total: 4, address_city: 'Kołobrzeg', address_district: 'ul. Kościuszki', address_street: null, is_exclusive: false, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-07', main_photo: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80&fit=crop&h=340', photo_count: 7 },
  { id: 's8', ref_number: 'IVST-AP-102', title: 'Apartament inwestycyjny', property_type: 'mieszkanie', transaction_type: 'sprzedaz', market_type: 'pierwotny', price: 720000, price_per_m2: 16000, area: 45, rooms_count: 2, floor: 8, floors_total: 10, address_city: 'Kołobrzeg', address_district: 'Uzdrowiskowa', address_street: null, is_exclusive: true, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-08', main_photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80&fit=crop&h=340', photo_count: 9 },
  { id: 's9', ref_number: 'IVST-LK-044', title: 'Lokal użytkowy', property_type: 'lokal', transaction_type: 'wynajem', market_type: 'wtorny', price: 5500, price_per_m2: null, area: 110, rooms_count: null, floor: 0, floors_total: 3, address_city: 'Kołobrzeg', address_district: 'centrum', address_street: null, is_exclusive: false, no_rent_fee: false, is_swap: false, has_garden: false, status: 'opublikowana', created_at: '2026-01-09', main_photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop&h=340', photo_count: 5 },
]

const PROPERTY_TYPES = [
  { value: '', label: 'Wszystkie typy' },
  { value: 'mieszkanie', label: 'Mieszkania' },
  { value: 'dom', label: 'Domy' },
  { value: 'dzialka', label: 'Działki' },
  { value: 'lokal', label: 'Lokale użytkowe' },
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

function getBadge(o: Offer) {
  if (o.is_exclusive) return { label: 'NA WYŁĄCZNOŚCI', bg: '#1a4fa0' }
  if (o.no_rent_fee)  return { label: 'BEZ PROWIZJI', bg: '#10b981' }
  if (o.status === 'zarezerwowana') return { label: 'ZAREZERWOWANA', bg: '#f59e0b' }
  return null
}

function OfferCard({ offer }: { offer: Offer }) {
  const badge = getBadge(offer)
  return (
    <Link href={`/oferty/${offer.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 14px 32px rgba(0,0,0,.1)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '' }}>
        <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#f0f4ff' }}>
          {offer.main_photo
            ? <img src={offer.main_photo} alt={offer.title ?? 'Oferta'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🏠</div>
          }
          {badge && <span style={{ position: 'absolute', top: 12, left: 12, background: badge.bg, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>{badge.label}</span>}
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,.9)', color: '#6b7280', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 5 }}>{offer.ref_number}</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 5 }}>{offer.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 12, marginBottom: 12 }}>
            <MapPin size={13} /> {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 12, flexWrap: 'wrap' as const }}>
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

function filterSamples(samples: Offer[], type: string, trans: string) {
  return samples.filter(o =>
    (!type || o.property_type === type) &&
    (!trans || o.transaction_type === trans)
  )
}

export default function OffersPageClient({ initialOffers, initialTotal, defaultType = '', defaultTransaction = '' }: {
  initialOffers: Offer[]; initialTotal: number; defaultType?: string; defaultTransaction?: string
}) {
  const hasReal = initialOffers.length > 0
  const [propType, setPropType] = useState(defaultType)
  const [transType, setTransType] = useState(defaultTransaction)
  const [offers, setOffers] = useState<Offer[]>(hasReal ? initialOffers : filterSamples(SAMPLE, defaultType, defaultTransaction))
  const [total, setTotal] = useState(hasReal ? initialTotal : filterSamples(SAMPLE, defaultType, defaultTransaction).length)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const LIMIT = 9

  const doSearch = useCallback(async (pt: string, tt: string, p: number) => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ limit: String(LIMIT), page: String(p) })
      if (pt) q.set('property_type', pt)
      if (tt) q.set('transaction_type', tt)
      const res = await fetch(`${API}/api/public/offers?${q}`)
      const data = await res.json()
      if ((data.data?.length ?? 0) > 0) {
        setOffers(data.data)
        setTotal(data.pagination?.total ?? 0)
      } else {
        const filtered = filterSamples(SAMPLE, pt, tt)
        setOffers(filtered)
        setTotal(filtered.length)
      }
    } catch {
      const filtered = filterSamples(SAMPLE, pt, tt)
      setOffers(filtered)
      setTotal(filtered.length)
    } finally { setLoading(false) }
  }, [])

  function search() {
    setPage(1)
    doSearch(propType, transType, 1)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div style={{ background: '#f8fafc', minHeight: '60vh' }}>
      {/* Pasek filtrów */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0', position: 'sticky', top: 76, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <select value={transType} onChange={e => setTransType(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
              {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={propType} onChange={e => setPropType(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button onClick={search}
              style={{ background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 9, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Search size={14} /> Szukaj
            </button>
            <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 13 }}>
              {loading ? 'Wyszukiwanie…' : `Znaleziono: ${total} ${total === 1 ? 'oferta' : total < 5 ? 'oferty' : 'ofert'}`}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 56 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontSize: 16 }}>Wyszukiwanie ofert…</div>
        ) : offers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Brak ofert spełniających kryteria</div>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>Zmień filtry lub skontaktuj się z nami — znajdziemy coś specjalnie dla Ciebie</p>
            <a href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a4fa0', color: 'white', fontWeight: 700, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>Skontaktuj się z nami</a>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginBottom: 36 }}>
              {offers.map(o => <OfferCard key={o.id} offer={o} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <button onClick={() => { setPage(p => p - 1); doSearch(propType, transType, page - 1) }} disabled={page === 1}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? .4 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => { setPage(p); doSearch(propType, transType, p) }}
                    style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid', borderColor: p === page ? '#1a4fa0' : '#e5e7eb', background: p === page ? '#1a4fa0' : 'white', color: p === page ? 'white' : '#374151', fontWeight: p === page ? 700 : 400, cursor: 'pointer', fontSize: 14 }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => { setPage(p => p + 1); doSearch(propType, transType, page + 1) }} disabled={page === totalPages}
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
