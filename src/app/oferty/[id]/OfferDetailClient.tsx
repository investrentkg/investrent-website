"use client"
import { useState } from 'react'
import { MapPin, LayoutGrid, Ruler, Layers, Phone, Mail, ChevronLeft, ChevronRight, Award, Shield, Clock, ArrowLeft } from 'lucide-react'
import { submitLead } from '@/lib/api'
import Link from 'next/link'

interface OfferDetail {
  id: string; ref_number: string; title: string | null
  property_type: string; transaction_type: string; market_type: string
  price: number | null; price_per_m2: number | null; area: number | null
  rooms_count: number | null; floor: number | null; floors_total: number | null
  bathrooms_count: number | null; build_year: number | null; condition: string | null
  description: string | null; address_city: string; address_district: string | null
  address_street: string | null; is_exclusive: boolean; no_rent_fee: boolean
  status: string; created_at: string
  offer_photos: Array<{ id: string; url: string; is_main: boolean; sort_order: number }>
  agent: { full_name: string; avatar_url: string | null } | null
}

function Gallery({ photos }: { photos: OfferDetail['offer_photos'] }) {
  const [active, setActive] = useState(0)
  if (!photos.length) return (
    <div style={{ height: 420, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, fontSize: 64 }}>🏠</div>
  )
  return (
    <div>
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[active].url} alt="Zdjęcie oferty"
          style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
        {photos.length > 1 && (
          <>
            <button onClick={() => setActive(a => Math.max(0, a - 1))}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.45)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setActive(a => Math.min(photos.length - 1, a + 1))}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.45)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <ChevronRight size={20} />
            </button>
            <span style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,.55)', color: 'white', fontSize: 12, padding: '4px 10px', borderRadius: 6 }}>
              {active + 1} / {photos.length}
            </span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' as const, paddingBottom: 4 }}>
          {photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={p.url} alt=""
              onClick={() => setActive(i)}
              style={{ width: 90, height: 62, objectFit: 'cover', borderRadius: 8, flexShrink: 0, cursor: 'pointer', border: i === active ? '2px solid #1a4fa0' : '2px solid transparent', opacity: i === active ? 1 : .7, transition: 'all .2s' }} />
          ))}
        </div>
      )}
    </div>
  )
}

function ContactForm({ refNumber }: { refNumber: string }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit() {
    if (!form.phone && !form.email) { alert('Podaj telefon lub email'); return }
    setStatus('loading')
    const res = await submitLead({ full_name: form.name, phone: form.phone, email: form.email, notes: `Zapytanie o ofertę ${refNumber}${form.notes ? ': ' + form.notes : ''}`, source: 'offer_detail', client_type: 'buyer' })
    setStatus(res?.ok ? 'ok' : 'error')
  }

  if (status === 'ok') return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '28px', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
      <div style={{ fontWeight: 700, color: '#065f46', fontSize: 17 }}>Zapytanie wysłane!</div>
      <div style={{ color: '#047857', fontSize: 13, marginTop: 5 }}>Skontaktujemy się do 60 minut</div>
    </div>
  )
  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '24px' }}>
      <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#0d2a5c', marginBottom: 16 }}>Zapytaj o ofertę</h3>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        <input type="text" placeholder="Imię i nazwisko" value={form.name} onChange={set('name')}
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input type="tel" placeholder="+48 telefon" value={form.phone} onChange={set('phone')}
            style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none' }} />
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')}
            style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none' }} />
        </div>
        <textarea placeholder="Dodatkowe pytania (opcjonalnie)" value={form.notes} onChange={set('notes')} rows={3}
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', resize: 'none' as const }} />
        <button onClick={submit} disabled={status === 'loading'}
          style={{ background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {status === 'loading' ? 'Wysyłanie…' : '📩 Wyślij zapytanie — odpiszemy do 60 min'}
        </button>
        {status === 'error' && <p style={{ color: '#dc2626', fontSize: 12, textAlign: 'center' as const }}>Błąd — spróbuj ponownie</p>}
        <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center' as const }}>Dane chronione zgodnie z RODO · Bez zobowiązań</p>
      </div>
    </div>
  )
}

export default function OfferDetailClient({ offer }: { offer: OfferDetail }) {
  const details = [
    offer.area && { label: 'Powierzchnia', val: `${offer.area} m²` },
    offer.rooms_count && { label: 'Liczba pokoi', val: `${offer.rooms_count}` },
    offer.floor !== null && offer.floor !== undefined && { label: 'Piętro', val: `${offer.floor}${offer.floors_total ? ' / ' + offer.floors_total : ''}` },
    offer.bathrooms_count && { label: 'Łazienki', val: `${offer.bathrooms_count}` },
    offer.build_year && { label: 'Rok budowy', val: `${offer.build_year}` },
    offer.condition && { label: 'Stan', val: offer.condition },
    offer.market_type && { label: 'Rynek', val: offer.market_type === 'pierwotny' ? 'Pierwotny' : 'Wtórny' },
    { label: 'Nr oferty', val: offer.ref_number },
  ].filter(Boolean) as Array<{ label: string; val: string }>

  const priceLabel = offer.price ? offer.price.toLocaleString('pl-PL') + ' zł' + (offer.transaction_type === 'wynajem' ? '/mies.' : '') : 'Cena na zapytanie'

  return (
    <div style={{ background: '#f8fafc', minHeight: '70vh', padding: '32px 0 64px' }}>
      <div className="container">
        <Link href="/oferty" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1a4fa0', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}>
          <ArrowLeft size={15} /> Wróć do ofert
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          {/* Left */}
          <div>
            {offer.is_exclusive && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a4fa0', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 6, marginBottom: 12, letterSpacing: '.5px' }}>
                <Award size={13} /> NA WYŁĄCZNOŚCI
              </div>
            )}
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 8 }}>
              {offer.title ?? `${offer.property_type} · ${offer.address_city}`}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
              <MapPin size={15} />
              {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}{offer.address_street ? `, ${offer.address_street}` : ''}
            </div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 34, color: '#1a4fa0', marginBottom: 24 }}>
              {priceLabel}
              {offer.price_per_m2 && <span style={{ fontSize: 15, fontWeight: 400, color: '#9ca3af', marginLeft: 10 }}>{offer.price_per_m2.toLocaleString('pl-PL')} zł/m²</span>}
            </div>

            <Gallery photos={offer.offer_photos ?? []} />

            {/* Details table */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '24px', marginTop: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#0d2a5c', marginBottom: 18 }}>Szczegóły nieruchomości</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: i % 2 === 0 ? '#f8fafc' : 'white', borderRadius: i === 0 ? '8px 8px 0 0' : i === details.length - 1 ? '0 0 8px 8px' : 0 }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{d.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{d.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {offer.description && (
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '24px', marginTop: 16 }}>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#0d2a5c', marginBottom: 14 }}>Opis</h2>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' as const }}>{offer.description}</div>
              </div>
            )}

            {/* Map placeholder */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, marginTop: 16, overflow: 'hidden' }}>
              <div style={{ height: 260, background: '#f0f4ff', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9ca3af' }}>
                <MapPin size={36} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>Lokalizacja na mapie</div>
                <div style={{ fontSize: 12 }}>{offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}</div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ position: 'sticky', top: 100 }}>
            {/* Agent card */}
            {offer.agent && (
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 800, fontSize: 18 }}>
                  {offer.agent.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={offer.agent.avatar_url} alt={offer.agent.full_name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : offer.agent.full_name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{offer.agent.full_name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Agent nieruchomości</div>
                  <a href="tel:+48731554341" style={{ fontSize: 13, color: '#1a4fa0', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Phone size={13} /> +48 731 554 341
                  </a>
                </div>
              </div>
            )}

            <ContactForm refNumber={offer.ref_number} />

            {/* Trust badges */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {[
                { icon: Shield, text: 'Bezpieczna transakcja', sub: 'Weryfikujemy stan prawny' },
                { icon: Clock, text: 'Odpowiadamy do 60 min', sub: 'Szybki kontakt gwarantowany' },
                { icon: Award, text: 'Doświadczeni eksperci', sub: 'Kołobrzeg i okolice' },
              ].map(b => {
                const Icon = b.icon
                return (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
                    <Icon size={18} color="#1a4fa0" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{b.text}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{b.sub}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
