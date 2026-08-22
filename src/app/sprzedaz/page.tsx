import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import { getOffice } from '@/lib/api'
import { DollarSign, Camera, Globe, FileCheck, Key, CheckCircle, ArrowRight, FileText, Building, Users, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sprzedaż nieruchomości Kołobrzeg',
  description: 'Sprzedaj nieruchomość w Kołobrzegu szybko i za dobrą cenę. Bezpłatna wycena, pełna obsługa po-sprzedażowa.',
  // NAPRAWA (audyt SEO 31.07.2026, punkt 3): brak kanonicznego URL na calej stronie.
  alternates: { canonical: 'https://www.investrent.com.pl/sprzedaz' },
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

const SERVICES = [
  { icon: DollarSign, title: 'Bezpłatna wycena',            desc: 'Dokładna analiza rynku i wycena Twojej nieruchomości bez zobowiązań. W ciągu 24h.' },
  { icon: Camera,     title: 'Profesjonalne zdjęcia',        desc: 'Sesja zdjęciowa przez profesjonalnego fotografa. Opcjonalnie wirtualny spacer 360°.' },
  { icon: Globe,      title: 'Widoczność oferty',            desc: 'Twoja nieruchomość zostanie zaprezentowana w wielu kanałach, aby dotrzeć do jak największej liczby potencjalnych kupujących.' },
  { icon: FileCheck,  title: 'Weryfikacja dokumentów',       desc: 'Sprawdzamy stan prawny, pomagamy skompletować wszystkie dokumenty potrzebne do sprzedaży.' },
  { icon: DollarSign, title: 'Negocjacje i akt notarialny',  desc: 'Reprezentujemy Twoje interesy podczas negocjacji. Towarzyszymy u notariusza do ostatniego podpisu.' },
  { icon: Key,        title: 'Stały kontakt i raportowanie', desc: 'Okresowe raporty o postępach — z aktualną wyceną na tle rynku i naszymi rekomendacjami dalszych działań.' },
]

const POST_SALE = [
  { icon: FileText, title: 'Przepisanie własności',       desc: 'Pomagamy w przepisaniu nieruchomości na nowego właściciela — kompletujemy dokumenty i towarzyszymy u notariusza.' },
  { icon: Building, title: 'Wspólnota mieszkaniowa',      desc: 'Zgłaszamy zmianę właściciela do wspólnoty lub spółdzielni. Przejmujemy korespondencję z zarządcą.' },
  { icon: Users,    title: 'Przekazanie mediów',          desc: 'Pomagamy w przepisaniu liczników (prąd, gaz, woda) na nowego właściciela. Bez kolejek i telefonów.' },
  { icon: Shield,   title: 'Ubezpieczenie nieruchomości', desc: 'Pomoc w wyborze i zawarciu ubezpieczenia dla kupującego. Ochrona od pierwszego dnia po zakupie.' },
]

const FAQ = [
  { q: 'Ile kosztuje wycena nieruchomości?', a: 'Bezpłatna wycena nie kosztuje nic i nie zobowiązuje do niczego. Analizujemy realne, aktualne transakcje z Twojej okolicy, nie tylko ceny ofertowe konkurencji, żeby dać Ci wycenę opartą na faktach rynkowych.' },
  { q: 'Ile trwa sprzedaż nieruchomości?', a: 'To zależy od lokalizacji, ceny i stanu nieruchomości, ale nasz średni czas sprzedaży to około 45 dni — znacznie krócej niż średnia rynkowa w Kołobrzegu (90+ dni). Wynika to głównie z realistycznej wyceny na starcie i szerokiej widoczności oferty.' },
  { q: 'Ile kosztuje prowizja za sprzedaż?', a: 'Pracujemy w modelu 3% prowizji netto, płatnej po skutecznej sprzedaży — nie pobieramy żadnych opłat z góry ani za samą wycenę czy sesję zdjęciową.' },
  { q: 'Co jeśli moja nieruchomość ma jakieś prawne komplikacje (hipoteka, brak księgi wieczystej, sprawa spadkowa)?', a: 'To akurat nasza specjalność — zobacz stronę Trudne nieruchomości. Weryfikujemy stan prawny na starcie i pomagamy uporządkować formalności, zanim zaczniemy szukać kupującego.', linkLabel: 'Trudne nieruchomości', linkHref: '/trudne-nieruchomosci' },
  { q: 'Czy muszę być obecny przy prezentacjach nieruchomości?', a: 'Nie musisz — możemy prowadzić prezentacje samodzielnie, informując Cię na bieżąco o zainteresowaniu i feedbacku od oglądających. Wielu naszych klientów sprzedaje nieruchomość, mieszkając w innym mieście.' },
]

export default async function SprzedazPage() {
  const [officeData, reviewsData, contentData] = await Promise.all([
    getOffice(),
    fetch('https://investrent-crm-production.up.railway.app/api/public/google-reviews')
      .then(r => r.json()).catch(() => null),
    fetch('https://investrent-crm-production.up.railway.app/api/public/content/sprzedaz')
      .then(r => r.json()).catch(() => null),
  ])
  const office = officeData ?? FALLBACK_OFFICE
  const googleTotal: number = reviewsData?.total ?? 55
  const cms: Record<string, string> = contentData?.blocks || {}

  return (
    <>
      <Nav office={office} />
      <main>
        <style>{`
          .srv-card { background: #f8fafc; border-radius: 14px; padding: 24px; border: 1px solid #e5e7eb; transition: background .2s, box-shadow .2s; }
          .srv-card:hover { background: white; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
        `}</style>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #92400e, #d97706)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '2px solid rgba(255,255,255,.1)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Sprzedaż' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 44, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.08, marginBottom: 18 }}>
              {cms.intro_heading ? cms.intro_heading : <>Sprzedaj swoją nieruchomość<br />szybko i za dobrą cenę</>}
            </h1>
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 16, maxWidth: 540, lineHeight: 1.8, marginBottom: 32 }}>
              {cms.intro_paragraph || 'Zajmujemy się wszystkim — od bezpłatnej wyceny, przez profesjonalne zdjęcia i ekspozycję na portalach, aż po dokumentację po-sprzedażową.'}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <a href="#kontakt-sprzedaz" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#92400e', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
                Chcę bezpłatną wycenę <ArrowRight size={17} />
              </a>
              <a href="tel:+48731554341" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.2)', color: 'white', fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 12, textDecoration: 'none' }}>
                +48 731 554 341
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'white', padding: '32px 0', borderBottom: '1px solid #e5e7eb' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              {[
                { val: '150+',   label: 'Zrealizowanych transakcji', sub: 'w Kołobrzegu i okolicach' },
                { val: '45 dni', label: 'Średni czas sprzedaży',     sub: 'przy rynku: 90+ dni' },
                { val: '4.9/5',  label: 'Ocena klientów',            sub: `${googleTotal} opinii Google` },
                { val: '0 zł',   label: 'Wycena nieruchomości',      sub: 'bezpłatnie, bez zobowiązań' },
              ].map((s, i) => (
                <div key={s.label} style={{ textAlign: 'center' as const, padding: '20px 16px', minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 34, color: '#0d2a5c', marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dlaczego my */}
        <div style={{ background: '#f8fafc', padding: '56px 0' }}>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', marginBottom: 20, lineHeight: 1.2 }}>
                  Wiemy jak sprzedać nieruchomość nad Bałtykiem
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 11 }}>
                  {[
                    '150+ transakcji w Kołobrzegu i okolicach',
                    'Cena transakcyjna wyższa o średnio 8% od ceny wywoławczej',
                    'Pełna obsługa prawna i notarialna w cenie usługi',
                    'Ekspozycja na głównych portalach i nie tylko',
                    'Fotografik, wirtualny spacer 360°, home staging',
                    'Obsługa po-sprzedażowa — dokumentacja, przepisanie',
                  ].map(w => (
                    <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontSize: 14, color: '#374151' }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '150+',   label: 'Transakcji' },
                  { val: '45 dni', label: 'Średni czas' },
                  { val: '4.9/5',  label: 'Ocena' },
                  { val: '0 zł',   label: 'Wycena' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '24px 20px', textAlign: 'center' as const, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 32, color: '#0d2a5c', marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Co robimy */}
        <div style={{ background: 'white', padding: '56px 0' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', marginBottom: 10, textAlign: 'center' as const }}>Co robimy za Ciebie</h2>
            <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center' as const, marginBottom: 36 }}>Od pierwszego kontaktu po klucze — i jeszcze długo po zamknięciu transakcji</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {SERVICES.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="srv-card">
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Icon size={22} color="white" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 16, color: '#0d2a5c', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.75 }}>{s.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Obsługa po-sprzedażowa */}
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1e3a5f)', padding: '56px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(245,166,35,.2)', border: '1px solid rgba(245,166,35,.35)', color: '#f5a623', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 12 }}>
                Unikalna usługa
              </div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: 'white', letterSpacing: '-.5px', marginBottom: 10 }}>
                Obsługa po-sprzedażowa
              </h2>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>
                Nie kończymy pracy po podpisaniu aktu notarialnego. Pomagamy w całej dokumentacji i formalnościach po transakcji.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
              {POST_SALE.map(p => {
                const Icon = p.icon
                return (
                  <div key={p.title} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 14, padding: '24px', border: '1px solid rgba(255,255,255,.12)' }}>
                    <div style={{ width: 46, height: 46, background: 'rgba(245,166,35,.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Icon size={22} color="#f5a623" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 8 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.75 }}>{p.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FAQ (Daniel 03.08, sugestia SEO) */}
        <div style={{ padding: '56px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', textAlign: 'center' as const, marginBottom: 40 }}>Najczęściej zadawane pytania</h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {FAQ.map(f => (
                <div key={f.q} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75 }}>
                    {(f as any).linkHref ? (
                      <>
                        {f.a.split((f as any).linkLabel)[0]}
                        <Link href={(f as any).linkHref} style={{ color: '#92400e', fontWeight: 700, textDecoration: 'underline' }}>{(f as any).linkLabel}</Link>
                        {f.a.split((f as any).linkLabel)[1]}
                      </>
                    ) : f.a}
                  </p>
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

        <div id="kontakt-sprzedaz"><Contact office={office} /></div>
      </main>
      <Footer office={office} />
      <FloatingWA />

      <SocialSidebar office={office} />
    </>
  )
}
