// NOWA STRONA (21.09.2026, wspólna inicjatywa SEO + Rozwój Produktu, zielone
// światło Daniela). Cel: fraza "nieruchomości kołobrzeg" (informacyjna/hub,
// 1305 impresji/16dni, pozycja 8,4 wg GSC) — CELOWO NIE "biuro nieruchomości
// kołobrzeg" (ta fraza jest już przypisana do strony głównej, ustalone z
// Marketingiem 12.09 — nie duplikować, żeby uniknąć kanibalizacji). Struktura
// i konwencje 1:1 ze wzorca src/app/wynajem/page.tsx (ten sam zespół
// komponentów, ten sam sposób pobierania danych z CRM).
export const revalidate = 3600

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import OffersPageClient from '@/app/oferty/OffersPageClient'
import { getPublicOffers, getOffice, getPageContent } from '@/lib/api'
import { MapPin, TrendingUp, Home, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nieruchomości Kołobrzeg — rynek, dzielnice, oferty',
  description: 'Kupno, sprzedaż i wynajem nieruchomości w Kołobrzegu: przegląd dzielnic, aktualne oferty i praktyczne informacje o lokalnym rynku nad Bałtykiem.',
  alternates: { canonical: 'https://www.investrent.com.pl/kolobrzeg' },
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

// Dzielnice/lokalizacje Kołobrzegu — realne, nie zmyślone. Opis celowo
// jakościowy (charakter, typowa zabudowa), bez wymyślonych liczb cena/m² —
// patrz zasada "realne dane przed benchmarkami" w pamięci projektowej:
// konkretne ceny mają wynikać z faktycznych ofert/wyceny, nie ze zgadywania.
const DISTRICTS = [
  { name: 'Śródmieście i Uzdrowisko', desc: 'Historyczne centrum i pas nadmorski z deptakiem, molo i parkiem zdrojowym — najwyższe zainteresowanie wynajmem sezonowym i apartamentami wakacyjnymi.' },
  { name: 'Podczele', desc: 'Spokojna dzielnica mieszkaniowa po wschodniej stronie miasta, głównie zabudowa wielorodzinna z ostatnich dekad — popularna wśród rodzin szukających mieszkania na stałe.' },
  { name: 'Radzikowo', desc: 'Nowsza część miasta z rozwijającą się infrastrukturą, więcej nowego budownictwa deweloperskiego niż w centrum.' },
  { name: 'Ogrody i Zieleniewo', desc: 'Bardziej kameralne, częściowo jeszcze w budowie osiedla na obrzeżach miasta — atrakcyjne dla kupujących szukających spokoju przy zachowaniu bliskości do centrum.' },
  { name: 'Grzybowo', desc: 'Sąsiadująca z Kołobrzegiem nadmorska miejscowość, osobna gmina, ale w praktyce jeden rynek nieruchomości — duży wybór apartamentowców pod wynajem wakacyjny.' },
]

const FAQ = [
  { q: 'Jak wygląda rynek nieruchomości w Kołobrzegu w porównaniu z innymi miastami nad Bałtykiem?', a: 'Kołobrzeg to jeden z największych ośrodków uzdrowiskowych polskiego wybrzeża, co przekłada się na silny, całoroczny popyt zarówno na zakup, jak i wynajem — szczególnie w pasie nadmorskim i Uzdrowisku. Dokładną wycenę konkretnej nieruchomości zawsze warto oprzeć o realne, aktualne oferty, nie ogólne uśrednienia.' },
  { q: 'Czym różnią się agencje nieruchomości w Kołobrzegu — na co zwrócić uwagę przy wyborze?', a: 'Warto sprawdzić, czy biuro faktycznie weryfikuje stan prawny nieruchomości przed publikacją oferty, jak długo działa lokalnie i czy transparentnie przedstawia koszty pośrednictwa przed podpisaniem umowy. Więcej o tym piszemy w naszym przewodniku „Jak wybrać biuro nieruchomości w Kołobrzegu".' },
  { q: 'Czy warto korzystać z doradztwa przy zakupie nieruchomości w Kołobrzegu?', a: 'Przy zakupie nieruchomości nad morzem (szczególnie starszej zabudowy albo gruntów w pasie nadmorskim) pojawiają się specyficzne ryzyka prawne i lokalizacyjne, których nie widać na pierwszy rzut oka. Nasz zespół pomaga to sprawdzić przed podpisaniem czegokolwiek — opisaliśmy to szczegółowo w artykule o doradztwie przy zakupie i sprzedaży.' },
  { q: 'Które dzielnice Kołobrzegu są najlepsze pod wynajem, a które pod mieszkanie na stałe?', a: 'Śródmieście i pas nadmorski dominują pod wynajem sezonowy/wakacyjny, natomiast Podczele, Radzikowo czy Ogrody to typowe wybory dla osób szukających mieszkania do stałego zamieszkania — spokojniejsze, z niższym ruchem turystycznym.' },
]

export default async function KolobrzegPage() {
  const [data, officeData, contentData] = await Promise.all([
    getPublicOffers({ limit: 6 }),
    getOffice(),
    getPageContent('kolobrzeg'),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  const cms: Record<string, string> = contentData?.blocks || {}

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Nieruchomości Kołobrzeg' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              {cms.intro_heading ? cms.intro_heading : <>Nieruchomości Kołobrzeg<br />— rynek, dzielnice, oferty</>}
            </h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 560, lineHeight: 1.8, marginBottom: 28 }}>
              {cms.intro_paragraph || 'Kupno, sprzedaż i wynajem mieszkań, domów i działek w Kołobrzegu i okolicach. Poznaj dzielnice miasta, sprawdź aktualne oferty i dowiedz się, na co zwrócić uwagę na lokalnym rynku nad Bałtykiem.'}
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
              {[{ icon: MapPin, text: '5 dzielnic i okolic' }, { icon: Home, text: 'Aktualne oferty' }, { icon: TrendingUp, text: 'Lokalna wiedza rynkowa' }].map(b => {
                const Icon = b.icon; return (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={16} color="rgba(255,255,255,.9)" />
                    <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 14 }}>{b.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Przegląd dzielnic */}
        <div style={{ padding: '56px 0', background: 'white' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', marginBottom: 8 }}>Dzielnice i okolice Kołobrzegu</h2>
            <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 680, lineHeight: 1.7, marginBottom: 32 }}>
              Każda część miasta ma inny charakter — poniżej krótki przegląd, który pomoże zawęzić poszukiwania, zanim przejdziesz do konkretnych ofert.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {DISTRICTS.map(d => (
                <div key={d.name} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 14, padding: '22px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 16, color: '#0d2a5c', marginBottom: 8 }}>{d.name}</h3>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dlaczego InvestRent + CTA do strony głównej */}
        <div style={{ background: '#f8fafc', padding: '48px 0' }}>
          <div className="container" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: 560 }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 24, color: '#0d2a5c', marginBottom: 10 }}>Dlaczego warto działać z lokalnym biurem</h2>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75 }}>
                Znamy Kołobrzeg od lat — nie tylko ceny, ale i realne uwarunkowania konkretnych działek, budynków i dzielnic, których nie widać w samym ogłoszeniu. Sprawdź, jak pracujemy i jaką ofertę mamy dziś dla Ciebie.
              </p>
            </div>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 700, fontSize: 14, background: '#f5a623', padding: '13px 26px', borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
              Poznaj InvestRent <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Aktualne oferty */}
        <div style={{ background: '#f8fafc', padding: '32px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 24, color: '#0d2a5c' }}>Aktualne oferty w Kołobrzegu</h2>
              <a href="/oferty" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1a4fa0', fontWeight: 700, fontSize: 13, border: '1.5px solid #1a4fa0', padding: '8px 18px', borderRadius: 9, textDecoration: 'none' }}>
                Wszystkie <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
        <OffersPageClient initialOffers={data?.data ?? []} initialTotal={data?.pagination?.total ?? 0} />

        {/* Poczytaj więcej — linkowanie wewnętrzne do bloga (SEO, 21.09) */}
        <div style={{ padding: '48px 0', background: 'white' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', marginBottom: 20 }}>Poczytaj więcej o rynku w Kołobrzegu</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { href: '/blog/nieruchomosci-koobrzeg-co-warto-wiedziec-przed-zakupem-sprzedaza-lub-wynajmem-na', title: 'Nieruchomości Kołobrzeg — co warto wiedzieć przed zakupem, sprzedażą lub wynajmem' },
                { href: '/blog/doradztwo-przy-zakupie-i-sprzedazy-nieruchomosci-w-kolobrzegu-na-czym-realnie-polega-ryzyko', title: 'Doradztwo przy zakupie i sprzedaży nieruchomości — na czym realnie polega ryzyko' },
                { href: '/blog/jak-wybrac-biuro-nieruchomosci-w-koobrzegu-praktyczny-przewodnik-przed-podpisani', title: 'Jak wybrać biuro nieruchomości w Kołobrzegu? Praktyczny przewodnik' },
              ].map(post => (
                <a key={post.href} href={post.href} style={{ display: 'block', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 12, padding: '18px 20px', textDecoration: 'none', color: '#0d2a5c', fontSize: 13.5, fontWeight: 600, lineHeight: 1.6 }}>
                  {post.title} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ padding: '56px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', textAlign: 'center' as const, marginBottom: 40 }}>Najczęściej zadawane pytania</h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {FAQ.map(f => (
                <div key={f.q} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }).replace(/</g, '\\u003c') }} />
      </main>
      <Footer office={office} />
      <SocialSidebar office={office} />
    </>
  )
}
