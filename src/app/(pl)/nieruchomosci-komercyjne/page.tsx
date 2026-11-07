import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { serializeJsonLd } from '@/lib/jsonLd'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice, getPublicOffers } from '@/lib/api'
import { buildPageMeta } from '@/lib/buildPageMeta'
import { isCommercialHubOn } from '@/lib/commercialHub'
import { COMMERCIAL_CONFIG, COMMERCIAL_FILTER_CHIPS, COMMERCIAL_OFFER_TYPES, COMMERCIAL_PATH, COMMERCIAL_TYPE_LABEL, buildCommercialContent } from '@/content/komercyjne'

// Strona "Nieruchomosci komercyjne" za flaga NEXT_PUBLIC_COMMERCIAL_HUB (domyslnie OFF = 404, poza sitemap).
// Tresc i konfiguracja biura: src/content/komercyjne.ts (nic z nazwy biura/regionu nie jest wpisane tutaj).
export const revalidate = 120

const BASE = 'https://www.investrent.com.pl'
const C = buildCommercialContent(COMMERCIAL_CONFIG)
const FALLBACK_OFFICE = { name: 'InvestRent Nieruchomości', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }
const TYPE_LABEL = COMMERCIAL_TYPE_LABEL
const CHIPS = COMMERCIAL_FILTER_CHIPS
const money = (n: number | null | undefined) => (n ? `${Math.round(n).toLocaleString('pl-PL')} zł` : 'Cena do uzgodnienia')

export const metadata: Metadata = {
  title: { absolute: C.title },
  description: C.description,
  alternates: { canonical: BASE + COMMERCIAL_PATH },
  ...buildPageMeta({ title: { absolute: C.title }, description: C.description, path: COMMERCIAL_PATH }),
}

async function loadOffers() {
  const out: any[] = []
  for (const t of COMMERCIAL_OFFER_TYPES) {
    try {
      const res: any = await getPublicOffers({ limit: 12, transaction_type: 'sprzedaz', property_type: t } as any)
      out.push(...((res?.data ?? []) as any[]).filter(o => o.transaction_type === 'sprzedaz'))
    } catch { /* brak ofert jednego typu nie psuje strony */ }
  }
  return out.slice(0, 12)
}

export default async function CommercialHubPage() {
  if (!isCommercialHubOn()) notFound()
  const [offers, officeData] = await Promise.all([loadOffers(), getOffice()])
  const office = officeData ?? FALLBACK_OFFICE
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Nieruchomości komercyjne', item: BASE + COMMERCIAL_PATH },
    ] },
    ...(offers.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: offers.map((o, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}/oferty/${o.slug || o.id}` })) }] : []),
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ]
  const h2 = { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 26, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 18 } as const
  const p = { fontSize: 15, color: '#374151', lineHeight: 1.8 } as const
  return (
    <>
      <Nav office={office} />
      <main>
        <style>{`
          .kom-card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; display:block; text-decoration:none; transition:transform .2s, box-shadow .2s }
          .kom-card:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(0,0,0,.08) }
          .kom-chip { display:inline-block; padding:9px 18px; border-radius:22px; background:#fff; border:1.5px solid #dde2f2; color:#233a86; font-size:13px; font-weight:600; text-decoration:none }
          .kom-type { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:20px 22px; font-weight:700; color:#0d2a5c; font-size:15px; border-left:3px solid #c59a2e }
        `}</style>
        <div style={{ background: 'linear-gradient(135deg, #0f1a3a, #233a86)', padding: '56px 0 52px' }}>
          <div className="container" style={{ maxWidth: 1080 }}>
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Nieruchomości komercyjne' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(26px, 7vw, 40px)', color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16, maxWidth: 760, overflowWrap: 'break-word' }}>{C.h1}</h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 680, lineHeight: 1.8 }}>{C.lead}</p>
          </div>
        </div>

        <section style={{ padding: '56px 0 24px', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 1080 }}>
            <h2 style={h2}>{C.typesHeading}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {C.types.map(t => <div key={t} className="kom-type">{t}</div>)}
            </div>
          </div>
        </section>

        <section style={{ padding: '40px 0 24px', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 1080 }}><div style={{ maxWidth: 780 }}>
            <h2 style={h2}>{C.helpHeading}</h2>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'disc' }}>
              {C.help.map(h => <li key={h.label} style={p}><strong>{h.label}:</strong> {h.text}</li>)}
            </ul>
            <h2 style={{ ...h2, marginTop: 36 }}>{C.basisHeading}</h2>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'disc' }}>
              {C.basis.map(b => <li key={b} style={p}>{b}</li>)}
            </ul>
          </div></div>
        </section>

        <section style={{ padding: '48px 0', background: '#fff' }}>
          <div className="container" style={{ maxWidth: 1080 }}>
            <h2 style={h2}>{C.offersHeading}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              <a className="kom-chip" href="/oferty?transaction_type=sprzedaz">Wszystkie oferty</a>
              {CHIPS.map(ch => <a key={ch.type} className="kom-chip" href={`/oferty?transaction_type=sprzedaz&property_type=${ch.type}`}>{ch.label}</a>)}
            </div>
            {offers.length === 0 ? (
              <p style={p}>{C.emptyOffers.replace('Opisz, czego szukasz.', '')}<a href="/kontakt" style={{ color: '#1a4fa0', fontWeight: 600 }}>Opisz, czego szukasz.</a></p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {offers.map(o => (
                  <a key={o.id} href={`/oferty/${o.slug || o.id}`} className="kom-card">
                    <div style={{ height: 170, background: '#e5e9f5' }}>
                      {(o.main_photo_thumb || o.main_photo) && <img src={o.main_photo_thumb || o.main_photo} alt={o.title ?? TYPE_LABEL[o.property_type] ?? 'Oferta'} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{TYPE_LABEL[o.property_type] ?? 'Nieruchomość'} · sprzedaż{o.address_city ? ` · ${o.address_city}` : ''}{o.area ? ` · ${o.area} m²` : ''}</div>
                      <div style={{ fontWeight: 700, color: '#0d2a5c', fontSize: 15, lineHeight: 1.35, marginBottom: 8 }}>{o.title}</div>
                      <div style={{ fontWeight: 800, color: '#233a86', fontSize: 18 }}>{money(o.price)}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: '24px 0 40px', background: '#fff' }}>
          <div className="container" style={{ maxWidth: 1080 }}><div style={{ maxWidth: 780 }}>
            <h2 style={h2}>{C.startHeading}</h2>
            <p style={p}>{C.start}</p>
          </div></div>
        </section>

        <section style={{ padding: '56px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 1080 }}><div style={{ maxWidth: 780 }}>
            <h2 style={{ ...h2, marginBottom: 28 }}>{C.faqHeading}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {C.faq.map(f => (
                <div key={f.q} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75 }}>{f.a}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.7, marginTop: 24 }}>{C.disclaimer}</p>
          </div></div>
        </section>

        <section style={{ background: '#0f1a3a', padding: '52px 0', textAlign: 'center' }}>
          <div className="container">
            <p style={{ color: 'white', fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 24, marginBottom: 18 }}>{C.ctaLead}</p>
            <a href="/kontakt" style={{ display: 'inline-block', background: '#f5a524', color: '#0f1a3a', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none' }}>{C.ctaLabel}</a>
          </div>
        </section>
      </main>
      <Footer office={office} />
      <SocialSidebar office={office} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
    </>
  )
}
