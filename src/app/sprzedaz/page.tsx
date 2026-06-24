import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import { DollarSign, Camera, Globe, FileCheck, Key, CheckCircle, ArrowRight, FileText, Building, Users, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sprzedaż nieruchomości Kołobrzeg | InvestRent',
  description: 'Sprzedaj nieruchomość w Kołobrzegu szybko i za dobrą cenę. Bezpłatna wycena, pełna obsługa — od wyceny po dokumentację po-sprzedażową.',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

const SERVICES = [
  { icon: DollarSign, title: 'Bezpłatna wycena',         desc: 'Dokładna analiza rynku i wycena Twojej nieruchomości bez zobowiązań. W ciągu 24h.', color: '#1a4fa0' },
  { icon: Camera,     title: 'Profesjonalne zdjęcia',    desc: 'Sesja zdjęciowa przez profesjonalnego fotografa. Opcjonalnie wirtualny spacer 360°.', color: '#1a4fa0' },
  { icon: Globe,      title: 'Ekspozycja na portalach',  desc: 'Otodom, OLX, Gratka, Morizon. Twoja oferta dotrze do tysięcy kupujących jednocześnie.', color: '#1a4fa0' },
  { icon: FileCheck,  title: 'Weryfikacja dokumentów',   desc: 'Sprawdzamy stan prawny, pomagamy skompletować wszystkie dokumenty potrzebne do sprzedaży.', color: '#1a4fa0' },
  { icon: DollarSign, title: 'Negocjacje i akt notarialny', desc: 'Reprezentujemy Twoje interesy podczas negocjacji. Towarzyszymy u notariusza do ostatniego podpisu.', color: '#1a4fa0' },
  { icon: Key,        title: 'Stały kontakt i raportowanie', desc: 'Cotygodniowe raporty o postępach. Zawsze wiesz ile osób oglądało ofertę i jakie były opinie.', color: '#1a4fa0' },
]

const POST_SALE = [
  { icon: FileText,  title: 'Przepisanie własności',     desc: 'Pomagamy w przepisaniu nieruchomości na nowego właściciela — kompletujemy dokumenty i towarzyszymy u notariusza.' },
  { icon: Building,  title: 'Wspólnota mieszkaniowa',    desc: 'Zgłaszamy zmianę właściciela do wspólnoty lub spółdzielni. Przejmujemy korespondencję z zarządcą.' },
  { icon: Users,     title: 'Przekazanie mediów',        desc: 'Pomagamy w przepisaniu liczników (prąd, gaz, woda) na nowego właściciela. Bez kolejek i telefonów.' },
  { icon: Shield,    title: 'Ubezpieczenie nieruchomości', desc: 'Pomoc w wyborze i zawarciu ubezpieczenia dla kupującego. Ochrona od pierwszego dnia po zakupie.' },
]

export default async function SprzedazPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #92400e, #d97706)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '2px solid rgba(255,255,255,.1)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', border: '2px solid rgba(255,255,255,.07)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Sprzedaż' }]} light={true} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 44, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.08, marginBottom: 18 }}>
              Sprzedaj swoją nieruchomość<br />szybko i za dobrą cenę
            </h1>
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 16, maxWidth: 540, lineHeight: 1.8, marginBottom: 32 }}>
              Zajmujemy się wszystkim — od bezpłatnej wyceny, przez profesjonalne zdjęcia i ekspozycję na portalach, aż po dokumentację po-sprzedażową. Ty czekasz na klucze i pieniądze.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <a href="#kontakt-sprzedaz" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#92400e', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.15)' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {[
                { val: '500+', label: 'Sprzedanych nieruchomości', sub: 'w Kołobrzegu i okolicach' },
                { val: '45 dni', label: 'Średni czas sprzedaży', sub: 'przy rynku: 90+ dni' },
                { val: '4.9/5', label: 'Ocena klientów', sub: '127 opinii Google' },
                { val: '0 zł', label: 'Wycena nieruchomości', sub: 'bezpłatnie, bez zobowiązań' },
              ].map((s, i) => (
                <div key={s.label} style={{ textAlign: 'center', padding: '20px 16px', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 16 }}>Dlaczego my</div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', marginBottom: 20, lineHeight: 1.2 }}>
                  Wiemy jak sprzedać nieruchomość<br />nad Bałtykiem
                </h2>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 20 }}>
                  Rynek nieruchomości w Kołobrzegu rządzi się swoimi prawami. Znamy każdą lokalizację, każdy typ nieruchomości i każdego kupującego, który szuka mieszkania nad morzem.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 11 }}>
                  {[
                    '500+ zrealizowanych transakcji w Kołobrzegu i okolicach',
                    'Cena transakcyjna wyższa o średnio 8% od ceny wywoławczej',
                    'Pełna obsługa prawna i notarialna w cenie usługi',
                    'Ekspozycja na wszystkich głównych portalach jednocześnie',
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
              <div>
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" alt="Sprzedaż nieruchomości Kołobrzeg"
                  style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 18, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,.12)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Co robimy */}
        <div style={{ background: 'white', padding: '56px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 12 }}>Pełna obsługa</div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', letterSpacing: '-.5px' }}>Co robimy za Ciebie</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8, maxWidth: 500, margin: '8px auto 0' }}>Od pierwszego kontaktu po klucze — i jeszcze długo po zamknięciu transakcji</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
              {SERVICES.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={s.title} style={{ background: '#f8fafc', borderRadius: 14, padding: '24px', border: '1px solid #e5e7eb', transition: 'all .2s' }}
                    onMouseEnter={(e: any) => { e.currentTarget.style.background='white'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.08)' }}
                    onMouseLeave={(e: any) => { e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.boxShadow='none' }}>
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
                Nie kończymy pracy po podpisaniu aktu notarialnego. Pomagamy w całej dokumentacji i formalnościach po transakcji — tak żebyś mógł spokojnie cieszyć się sprzedażą.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {POST_SALE.map(p => {
                const Icon = p.icon
                return (
                  <div key={p.title} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 14, padding: '24px', border: '1px solid rgba(255,255,255,.12)', backdropFilter: 'blur(10px)' }}>
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

        <div id="kontakt-sprzedaz">
          <Contact office={office} />
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
