"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MapPin, LayoutGrid, Ruler, Layers, Phone, ChevronLeft, ChevronRight, Award, Shield, Clock, ArrowLeft, X, Expand } from 'lucide-react'
import { submitLead } from '@/lib/api'
import { formatPhoneDisplay } from '@/lib/phone'
import MortgageMiniCalculator from '@/components/MortgageMiniCalculator'
import Link from 'next/link'

interface OfferDetail {
  id: string
  ref_number: string
  title: string | null
  property_type: string
  transaction_type: string
  market_type: string
  price: number | null
  price_per_m2: number | null
  area: number | null
  rooms_count: number | null
  floor: number | null
  floors_total: number | null
  bathrooms_count: number | null
  build_year: number | null
  condition: string | null
  description: string | null
  address_city: string
  address_district: string | null
  address_street: string | null
  address_lat: number | null
  address_lng: number | null
  exclusivity: boolean
  no_rent_fee?: boolean
  admin_fee?: number | null
  status: string
  created_at: string
  offer_photos: Array<{ id: string; url: string; is_main: boolean; sort_order: number }>
  agent: { full_name: string; avatar_url: string | null; phone: string | null } | null
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({ photos, start, onClose, label }: { photos: OfferDetail['offer_photos'], start: number, onClose: () => void, label: string }) {
  const [cur, setCur] = useState(start)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCur(c => Math.min(photos.length - 1, c + 1))
      if (e.key === 'ArrowLeft')  setCur(c => Math.max(0, c - 1))
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose, photos.length])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.95)', display: 'flex', flexDirection: 'column' as const }}>
      {/* Pasek górny */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', flexShrink: 0 }}>
        <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 13 }}>{cur + 1} / {photos.length}</span>
        <button onClick={onClose} aria-label="Zamknij podgląd" style={{ background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
          <X size={20} />
        </button>
      </div>
      {/* Główne zdjęcie */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 60px' }}>
        <Image src={photos[cur].url} alt={`${label} — zdjęcie ${cur + 1} z ${photos.length}`}
          fill sizes="100vw" style={{ objectFit: 'contain' }} />
        {photos.length > 1 && (
          <>
            <button onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0} aria-label="Poprzednie zdjęcie"
              style={{ position: 'absolute', left: 10, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cur === 0 ? 'default' : 'pointer', color: 'white', opacity: cur === 0 ? .3 : 1 }}>
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => setCur(c => Math.min(photos.length - 1, c + 1))} disabled={cur === photos.length - 1} aria-label="Następne zdjęcie"
              style={{ position: 'absolute', right: 10, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cur === photos.length - 1 ? 'default' : 'pointer', color: 'white', opacity: cur === photos.length - 1 ? .3 : 1 }}>
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
      {/* Miniatury */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto' as const, flexShrink: 0 }}>
        {photos.map((p, i) => (
          <Image key={i} src={p.url} alt={`${label} — miniatura ${i + 1}`} onClick={() => setCur(i)}
            width={64} height={46} sizes="64px"
            style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 6, flexShrink: 0, cursor: 'pointer', opacity: i === cur ? 1 : .5, border: i === cur ? '2px solid white' : '2px solid transparent', transition: 'all .15s' }} />
        ))}
      </div>
    </div>
  )
}

// ── Galeria ───────────────────────────────────────────────────
function Gallery({ photos, label }: { photos: OfferDetail['offer_photos'], label: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  if (!photos.length) return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: 56 }}>🏠</div>
  )

  return (
    <>
      {lightbox && <Lightbox photos={photos} start={active} onClose={() => setLightbox(false)} label={label} />}
      <div style={{ width: '100%', maxWidth: '100%' }}>
        {/* Główne zdjęcie */}
        <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', marginBottom: 8, background: '#111', cursor: 'pointer' }}
          onTouchStart={e => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={e => { const d = touchStart - e.changedTouches[0].clientX; if (Math.abs(d) > 50) d > 0 ? setActive(a => Math.min(photos.length-1, a+1)) : setActive(a => Math.max(0, a-1)) }}>
          <Image src={photos[active].url} alt={`${label} — zdjęcie ${active + 1} z ${photos.length}`} onClick={() => setLightbox(true)}
            fill sizes="(max-width: 768px) 100vw, 600px" priority
            style={{ objectFit: 'cover', cursor: 'pointer' }} />
          {/* Overlay przycisk fullscreen */}
          <button onClick={() => setLightbox(true)}
            style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, color: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
            <Expand size={14} /> Powiększ
          </button>
          {photos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setActive(a => Math.max(0, a-1)) }} disabled={active === 0} aria-label="Poprzednie zdjęcie"
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: active === 0 ? 'default' : 'pointer', color: 'white', opacity: active === 0 ? .3 : 1 }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={e => { e.stopPropagation(); setActive(a => Math.min(photos.length-1, a+1)) }} disabled={active === photos.length-1} aria-label="Następne zdjęcie"
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: active === photos.length-1 ? 'default' : 'pointer', color: 'white', opacity: active === photos.length-1 ? .3 : 1 }}>
                <ChevronRight size={18} />
              </button>
              <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,.6)', color: 'white', fontSize: 11, padding: '3px 9px', borderRadius: 5, fontWeight: 600 }}>
                {active + 1} / {photos.length}
              </span>
            </>
          )}
        </div>
        {/* Miniatury */}
        {photos.length > 1 && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto' as const, paddingBottom: 6, WebkitOverflowScrolling: 'touch' as any }}>
            {photos.map((p, i) => (
              <Image key={i} src={p.url} alt={`${label} — miniatura ${i + 1}`} onClick={() => setActive(i)}
                width={76} height={56} sizes="76px"
                style={{ width: 76, height: 56, objectFit: 'cover', borderRadius: 7, flexShrink: 0, cursor: 'pointer', border: i === active ? '2.5px solid #1a4fa0' : '2.5px solid transparent', opacity: i === active ? 1 : .6, transition: 'all .15s' }} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── Formularz kontaktowy ──────────────────────────────────────
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
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '28px', textAlign: 'center' as const }}>
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
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        <input type="tel" placeholder="+48 telefon *" value={form.phone} onChange={set('phone')}
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        <input type="email" placeholder="Email" value={form.email} onChange={set('email')}
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        <textarea placeholder="Dodatkowe pytania (opcjonalnie)" value={form.notes} onChange={set('notes')} rows={3}
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', resize: 'none' as const, fontFamily: 'inherit' }} />
        <button onClick={submit} disabled={status === 'loading'}
          style={{ background: 'linear-gradient(135deg,#1a4fa0,#0d2a5c)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {status === 'loading' ? 'Wysyłanie…' : '📩 Wyślij zapytanie — odpiszemy do 60 min'}
        </button>
        {status === 'error' && <p style={{ color: '#dc2626', fontSize: 12, textAlign: 'center' as const }}>Błąd — spróbuj ponownie</p>}
        <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center' as const }}>Dane chronione zgodnie z RODO · Bez zobowiązań</p>
      </div>
    </div>
  )
}

// ── Główny komponent ──────────────────────────────────────────
export default function OfferDetailClient({ offer }: { offer: OfferDetail }) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // NAPRAWA (audyt SEO 31.07.2026, punkt 2): zdjecia mialy puste alt="" -
  // zero szansy na ruch z wyszukiwania obrazow Google, i zero kontekstowego
  // sygnalu o czym jest strona. Budujemy opisowa etykiete raz, na podstawie
  // prawdziwych danych oferty (nie wymyslonej tresci).
  const photoLabel = offer.title
    ?? `${offer.property_type === 'mieszkanie' ? 'Mieszkanie' : offer.property_type === 'dom' ? 'Dom' : 'Nieruchomość'} ${offer.transaction_type === 'wynajem' ? 'na wynajem' : 'na sprzedaż'}, ${offer.address_city}`

  // NAPRAWA TRESCI (Weronika, feedback 01.08, ze zrzutem ekranu): dzialka
  // (IVST-GS-54) pokazywala "Lazienki: 1" i "Stan: do_zamieszkania" - pola
  // ktore dla samego gruntu nie maja zadnego sensu. Przyczyna: warunki
  // ponizej sprawdzaly WYLACZNIE czy wartosc istnieje w bazie, bez
  // sprawdzania czy dany typ nieruchomosci w ogole POWINIEN miec to pole
  // (np. jesli w bazie zostala domyslna/pozostawiona wartosc z szablonu).
  const isLand = offer.property_type === 'dzialka'
  const details = [
    offer.area        && { label: 'Powierzchnia',   val: `${offer.area} m²` },
    !isLand && offer.rooms_count && { label: 'Liczba pokoi',   val: `${offer.rooms_count}` },
    !isLand && offer.floor !== null && offer.floor !== undefined && { label: 'Piętro', val: `${offer.floor}${offer.floors_total ? ' / ' + offer.floors_total : ''}` },
    !isLand && offer.bathrooms_count && { label: 'Łazienki',   val: `${offer.bathrooms_count}` },
    !isLand && offer.build_year  && { label: 'Rok budowy',     val: `${offer.build_year}` },
    !isLand && offer.condition   && { label: 'Stan',           val: offer.condition },
    offer.market_type && { label: 'Rynek',          val: offer.market_type === 'pierwotny' ? 'Pierwotny' : 'Wtórny' },
    // NAPRAWA (05.08, Daniel: "czynsz ma się wyeksportować wszędzie gdzie
    // trzeba, ma być widoczne w ofertach na stronie") - admin_fee bylo w
    // bazie i w CRM od dawna, ale nigdy nie trafialo tutaj. no_rent_fee
    // bylo zadeklarowane w interfejsie OfferDetail ale nigdzie faktycznie
    // nie uzyte (martwe pole) - teraz oba pokazane, wzajemnie sie wykluczajace.
    offer.no_rent_fee && { label: 'Czynsz', val: 'Bezczynszowe' },
    !offer.no_rent_fee && offer.admin_fee && { label: 'Czynsz administracyjny', val: `${offer.admin_fee.toLocaleString('pl-PL')} zł` },
    { label: 'Nr oferty', val: offer.ref_number },
  ].filter(Boolean) as Array<{ label: string; val: string }>

  const priceLabel = offer.price
    ? offer.price.toLocaleString('pl-PL') + ' zł' + (offer.transaction_type === 'wynajem' ? '/mies.' : '')
    : 'Cena na zapytanie'

  const mapQuery = encodeURIComponent(
    [offer.address_street, offer.address_city].filter(Boolean).join(', ') || offer.address_city
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '70vh', padding: '24px 0 64px' }}>
      <div className="container" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <Link href="/oferty" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1a4fa0', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}>
          <ArrowLeft size={15} /> Wróć do ofert
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 360px' : '1fr', gap: 24, alignItems: 'start' }}>

          {/* ── Lewa kolumna ── */}
          <div style={{ minWidth: 0, maxWidth: '100%' }}>
            {offer.exclusivity && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a4fa0', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 6, marginBottom: 12, letterSpacing: '.5px' }}>
                <Award size={13} /> NA WYŁĄCZNOŚCI
              </div>
            )}
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: isDesktop ? 28 : 22, color: '#0d2a5c', marginBottom: 8, lineHeight: 1.2 }}>
              {offer.title ?? `${offer.property_type} · ${offer.address_city}`}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 14, marginBottom: 10 }}>
              <MapPin size={14} />
              {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}{offer.address_street ? `, ${offer.address_street}` : ''}
            </div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: isDesktop ? 32 : 26, color: '#1a4fa0', marginBottom: 20 }}>
              {priceLabel}
              {offer.price_per_m2 && <span style={{ fontSize: 14, fontWeight: 400, color: '#9ca3af', marginLeft: 10 }}>{offer.price_per_m2.toLocaleString('pl-PL')} zł/m²</span>}
            </div>

            <Gallery photos={offer.offer_photos ?? []} label={photoLabel} />

            {/* Szczegóły */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px', marginTop: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 17, color: '#0d2a5c', marginBottom: 14 }}>Szczegóły nieruchomości</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {details.map((d, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: i % 2 === 0 ? '#f8fafc' : 'white', borderRadius: i === 0 ? '8px 8px 0 0' : i === details.length - 1 ? '0 0 8px 8px' : 0, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', textAlign: 'right' as const }}>{d.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opis */}
            {offer.description && !offer.description.startsWith('Oferta zaimportowana') && (
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px', marginTop: 14 }}>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 17, color: '#0d2a5c', marginBottom: 12 }}>Opis</h2>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' as const }}>{offer.description}</div>
              </div>
            )}

            {/* Mapa */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, marginTop: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 17, color: '#0d2a5c', margin: 0 }}>Lokalizacja</h2>
              </div>
              <iframe
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed&hl=pl&z=15`}
                width="100%"
                height="280"
                style={{ border: 'none', display: 'block' }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {/* ── Prawa kolumna (sidebar) ── */}
          <div style={{ position: isDesktop ? 'sticky' : 'static', top: 100 }}>
            {offer.agent && (
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#1a4fa0,#0d2a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 800, fontSize: 18, overflow: 'hidden' }}>
                  {offer.agent.avatar_url
                    ? <Image src={offer.agent.avatar_url} alt={offer.agent.full_name} width={50} height={50} sizes="50px" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                    : offer.agent.full_name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{offer.agent.full_name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Agent nieruchomości</div>
                  <a href={`tel:${(offer.agent.phone || '+48731554341').replace(/\s/g,'')}`}
                    style={{ fontSize: 13, color: '#1a4fa0', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Phone size={13} /> {formatPhoneDisplay(offer.agent.phone) || '+48 731 554 341'}
                  </a>
                </div>
              </div>
            )}

            <ContactForm refNumber={offer.ref_number} />

            {/* NOWA FUNKCJA (Daniel 30.07.2026): mini kalkulator raty, tylko
                dla ofert sprzedaży (kredyt hipoteczny nie dotyczy najmu) i
                tylko gdy oferta ma cenę. */}
            {offer.transaction_type === 'sprzedaz' && offer.price && (
              <MortgageMiniCalculator price={offer.price} refNumber={offer.ref_number} offerId={offer.id} />
            )}

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {[
                { icon: Shield, text: 'Bezpieczna transakcja', sub: 'Weryfikujemy stan prawny' },
                { icon: Clock,  text: 'Odpowiadamy do 60 min', sub: 'Szybki kontakt gwarantowany' },
                { icon: Award,  text: 'Doświadczeni eksperci',  sub: 'Kołobrzeg i okolice' },
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
