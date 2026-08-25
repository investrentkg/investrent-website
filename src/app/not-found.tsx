// NOWE (14.08.2026, audyt Centrum Marketingowego CRM: oferta juz sprzedana
// mial 100% bounce rate i 0s czasu na stronie, dwa dni z rzedu). Backend
// (public.ts) i strona pojedynczej oferty (oferty/[id]/page.tsx) juz
// poprawnie wywoluja notFound() gdy oferta zniknela (sprzedana/usunieta) -
// ale Next.js bez tego pliku pokazuje wlasny, generyczny "404 - This page
// could not be found", bez marki, bez nawigacji, bez zadnej zachety do
// dalszego przegladania. Kazdy kto trafi na stary link do juz sprzedanej
// oferty (co bedzie sie zdarzac regularnie - oferty sie sprzedaja, linki
// zostaja w Google/social media/starych wiadomosciach) dostawal pusta
// strone bez wyjscia poza "wstecz" w przegladarce - stad zerowy czas i
// 100% odrzucen. Ta strona zamienia strate w szanse: przyjazny komunikat +
// aktualne, dostepne oferty do przegladania od razu.
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { getPublicOffers, getOffice } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, LayoutGrid, Ruler } from 'lucide-react'

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

function priceLabel(p: number | null, t: string) {
  if (!p) return 'Cena na zapytanie'
  return p.toLocaleString('pl-PL') + ' zł' + (t === 'wynajem' ? '/mies.' : '')
}

export default async function NotFound() {
  const [offersData, officeData] = await Promise.all([
    getPublicOffers({ limit: 3 }),
    getOffice(),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  const offers = offersData?.data ?? []

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px', textAlign: 'center' }}>
          <div className="container">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: 'white', letterSpacing: '-1px', marginBottom: 10 }}>
              Ta oferta nie jest już dostępna
            </h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Nieruchomość, której szukasz, została już sprzedana, wynajęta albo usunięta z oferty. Zobacz, co mamy aktualnie dostępne.
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 0 56px' }}>
          {offers.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 20, color: '#111827', marginBottom: 20, textAlign: 'center' }}>
                Aktualne oferty
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
                {offers.map((offer: any) => (
                  <Link key={offer.id} href={`/oferty/${offer.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                      <div style={{ height: 180, overflow: 'hidden', background: '#f0f4ff', position: 'relative' }}>
                        {offer.main_photo
                          ? <Image src={offer.main_photo_thumb || offer.main_photo} alt={offer.title ?? 'Oferta'} fill unoptimized
                              sizes="(max-width: 768px) 100vw, 300px" loading="lazy" style={{ objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🏠</div>}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 12, marginBottom: 10 }}>
                          <MapPin size={13} /> {offer.address_city}{offer.address_district ? `, ${offer.address_district}` : ''}
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' as const }}>
                          {offer.rooms_count && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><LayoutGrid size={13} />{offer.rooms_count} pok.</span>}
                          {offer.area && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><Ruler size={13} />{offer.area} m²</span>}
                        </div>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#1a4fa0' }}>{priceLabel(offer.price, offer.transaction_type)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link href="/oferty" style={{ display: 'inline-flex', alignItems: 'center', background: '#1a4fa0', color: 'white', fontWeight: 700, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 14, marginRight: 12 }}>
              Zobacz wszystkie oferty
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', background: 'white', color: '#1a4fa0', border: '1.5px solid #1a4fa0', fontWeight: 700, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
              Strona główna
            </Link>
          </div>
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
