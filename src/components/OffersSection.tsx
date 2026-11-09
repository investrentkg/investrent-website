"use client"
import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, LayoutGrid, Ruler, Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Offer, PaginatedOffers } from '@/types'


const TABS = [
  { key: 'new',       label: 'Najnowsze' },
  { key: 'promo',     label: 'Promocje' },
  { key: 'exclusive', label: 'Wyłączności' },
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

export function OfferCard({ offer, tab }: { offer: Offer; tab: string }) {
  const badge = getBadge(offer, tab)
  return (
    <a href={`/oferty/${offer.slug || offer.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s', height: '100%' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 14px 32px rgba(0,0,0,.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; (e.currentTarget as HTMLElement).style.boxShadow='' }}>
        <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
          {offer.main_photo ? (
            // NAPRAWA (22.08, audyt PageSpeed): zwykly <img> omijal calkowicie
            // wbudowana optymalizacje Next.js/Vercel (kompresja, WebP,
            // responsywne rozmiary) niezaleznie od ustawien next.config.js -
            // to byla GLOWNA przyczyna 7+ MB ciezaru strony i LCP 9,2s na
            // telefonie. next/image z "fill" dopasowuje sie do rodzica
            // (position: relative, wysokosc 200px ustawiona wyzej).
            // NAPRAWA cz.2 (25.08, Daniel: "zeby telefony nie wypadaly z
            // ogladania strony bo cos sie za dlugo laduje") - uzywamy
            // main_photo_thumb (480px) zamiast main_photo (1600px). Ta
            // karta ma ~300-400px szerokosci - pelen 1600px byl ok. 16x
            // wiecej pikseli niz potrzeba, bez korzysci automatycznego
            // dopasowania przez Vercel (celowo wylaczone przez unoptimized
            // powyzej, ze wzgledu na limit).
            <Image src={offer.main_photo_thumb || offer.main_photo} alt={offer.title ?? 'Oferta'}
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              loading="lazy" unoptimized
              style={{ objectFit: 'cover', transition: 'transform .4s' }}
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
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {offer.address_city}{offer.area ? ` · ${offer.area} m²` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 12, marginBottom: 10 }}>
            <MapPin size={12} /> {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' as const }}>
            {offer.rooms_count && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><LayoutGrid size={12} /> {offer.rooms_count} pok.</span>}
            {offer.area && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><Ruler size={12} /> {offer.area} m²</span>}
          </div>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#1a4fa0' }}>{priceLabel(offer.price)}</span>
          {offer.price_per_m2 && <div style={{ fontSize: 11, color: '#5a6680', whiteSpace: 'nowrap' }}>{offer.price_per_m2.toLocaleString('pl-PL')} zł/m²</div>}
        </div>
      </div>
    </a>
  )
}

const TYPE_LABEL: Record<string, string> = { mieszkanie: 'Mieszkanie', dom: 'Dom', dzialka: 'Działka', lokal: 'Lokal', biuro: 'Biuro', magazyn: 'Magazyn', garaz: 'Garaż', inwestycja: 'Inwestycja' }

// Karta oferty na stronie głównej wg makiety M3 (tylko wygląd; dane i link jak w OfferCard).
function HomeOfferCard({ offer, tab }: { offer: Offer; tab: string }) {
  const badge = getBadge(offer, tab)
  const fmtArea = offer.area ? offer.area.toLocaleString('pl-PL') : null
  const type = TYPE_LABEL[offer.property_type] ?? ''
  return (
    <a href={`/oferty/${offer.slug || offer.id}`} className="m3-oc">
      <div className="ph">
        {offer.main_photo ? (
          <Image src={offer.main_photo_thumb || offer.main_photo} alt={offer.title ?? 'Oferta'}
            fill sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 400px"
            loading="lazy" unoptimized style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', fontSize: 48 }} aria-hidden="true">🏠</div>
        )}
        {badge && <span className="tag" style={badge.color === '#10b981' ? { background: '#047857' } : undefined}>{badge.label}</span>}
      </div>
      <div className="ob">
        <div className="pr">{priceLabel(offer.price)}</div>
        <div className="pm">{offer.price_per_m2 ? `${offer.price_per_m2.toLocaleString('pl-PL')} zł/m²` : ''}{offer.price_per_m2 && fmtArea ? ' · ' : ''}{fmtArea ? `${fmtArea} m²` : ''}</div>
        <div className="lc"><MapPin size={16} aria-hidden="true" />{offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}</div>
        <div className="tt">{type}{offer.rooms_count ? `, ${offer.rooms_count} pok.` : ''}{offer.ref_number ? ` · ${offer.ref_number}` : ''}</div>
      </div>
    </a>
  )
}

export default function OffersSection({ initialOffers }: { initialOffers: PaginatedOffers | null }) {
  const hasRealOffers = (initialOffers?.data?.length ?? 0) > 0
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
  const [usingSamples, setUsingSamples] = useState(!hasRealOffers)

  const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.investrent.com.pl'

  // NAPRAWA (Daniel 31.07, drugie podejście po zrzutach z telefonu -
  // "dalej jest do dupy"): poprzednia wersja liczyła przesunięcie karuzeli
  // ręcznie w JS (transform: translateX z procentami) - matematyka NIGDY
  // dokładnie nie pasowała do faktycznej, wyrenderowanej szerokości karty,
  // co dawało puste kolumny i chaotyczne przeskoki na mobile. Zamiast
  // kolejnej próby poprawienia wzoru - CAŁKOWICIE INNE podejście: natywne
  // przewijanie przeglądarki (scroll-snap). Przeglądarka sama dba o to,
  // żeby zatrzymać się dokładnie na granicy karty, niezależnie od tego jak
  // szeroka faktycznie jest - eliminuje tę całą klasę błędów u źródła.
  // Karuzela ofert (decyzja Daniela 09.11): SSR renderuje CALY tor (wszystkie karty w HTML,
  // zwykle <a href>), a JS steruje wylacznie przewijaniem natywnego scroll-snap.
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const [atEnd, setAtEnd] = useState(false)
  const [perView, setPerView] = useState(1) // ile kart miesci sie w widoku (po hydratacji); SSR: 1 = kropka na kazda oferte
  const count = offers.length
  const dotCount = Math.max(1, count - perView + 1)

  useEffect(() => {
    const measure = () => {
      const el = scrollerRef.current
      const first = el?.children[0] as HTMLElement | undefined
      if (!el || !first || first.offsetWidth === 0) return
      setPerView(Math.max(1, Math.round((el.clientWidth - 8) / first.offsetWidth)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [offers.length, loading])

  function smooth(): ScrollBehavior {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  }

  function scrollToIndex(i: number) {
    const el = scrollerRef.current
    if (!el) return
    const card = el.children[Math.max(0, Math.min(count - 1, i))] as HTMLElement | undefined
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: smooth() })
  }

  function page(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (el.clientWidth + gap), behavior: smooth() })
  }

  // Pozycja z realnego scrolla (nie z liczonej recznie wartosci).
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || el.children.length === 0) return
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    setAtEnd(end)
    let best = 0, bestD = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const d = Math.abs((el.children[i] as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft)
      if (d < bestD) { bestD = d; best = i }
    }
    setCur(best)
  }, [])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') { e.preventDefault(); page(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); page(-1) }
  }

  const fetchOffers = useCallback(async (newTab: typeof tab) => {
    setLoading(true); setCur(0); setAtEnd(false)
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0
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
    <section id="oferty" className="m3-offers">
      <div className="container">
        <div className="m3-sechead">
          <div>
            <h2 className="m3-h2">Nasze oferty</h2>
            <p className="lead">Aktualne nieruchomości w Kołobrzegu i okolicach</p>
          </div>
          <div className="m3-tabs">
            {TABS.map(t => (
              <button key={t.key} type="button" onClick={() => switchTab(t.key)} aria-pressed={tab === t.key} className={tab === t.key ? 'on' : ''}>
                {t.label}
              </button>
            ))}
            <Link href="/oferty" className="more">Wszystkie →</Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>Ładowanie ofert…</div>
        ) : (
          <>
            <div className="m3-ocar" role="region" aria-roledescription="karuzela" aria-label="Oferty nieruchomości" onKeyDown={onKeyDown}>
              <div className="m3-ocar-track" ref={scrollerRef} onScroll={handleScroll} role="group" aria-label="Lista ofert">
                {offers.map((o, i) => (
                  <div className="m3-ocar-slide" key={o.id} role="group" aria-roledescription="slajd" aria-label={`Oferta ${i + 1} z ${count}`}>
                    <HomeOfferCard offer={o} tab={tab} />
                  </div>
                ))}
              </div>
              {count > 1 && (
                <div className="m3-ocar-ctl">
                  <button type="button" className="m3-ocar-arrow" onClick={() => cur > 0 && page(-1)} aria-disabled={cur === 0} aria-label="Poprzednie oferty">
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <div className={`m3-ocar-dots${dotCount > 6 ? ' many' : ''}`}>
                    {offers.slice(0, dotCount).map((o, i) => (
                      <button key={o.id} type="button" className="m3-ocar-dot" onClick={() => scrollToIndex(i)}
                        aria-label={`Oferta ${i + 1} z ${count}`} aria-current={i === cur ? 'true' : undefined}><span /></button>
                    ))}
                  </div>
                  <button type="button" className="m3-ocar-arrow" onClick={() => !atEnd && page(1)} aria-disabled={atEnd} aria-label="Następne oferty">
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {/* NAPRAWA TRESCI (Weronika, feedback 01.08): brakowalo tego
            komunikatu - czesc ofert (np. na wylacznosc bez zgody klienta na
            publikacje, lub inne powody biznesowe) celowo nie trafia na
            strone, wiec warto to wprost zakomunikowac zamiast zostawiac
            odwiedzajacego z wrazeniem "to widocznie caly nasz katalog". */}
        <p style={{ textAlign: 'center', fontSize: 14, color: '#3d4963', marginTop: 30 }}>
          Nie wszystkie nieruchomości trafiają od razu na stronę.{' '}
          <a href="#kontakt" style={{ color: '#9a5b00', fontWeight: 800, textDecoration: 'none' }}>
            Skontaktuj się z nami aby poznać naszą pełną ofertę.
          </a>
        </p>
      </div>
    </section>
  )
}