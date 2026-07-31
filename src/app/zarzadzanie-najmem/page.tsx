import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import { Shield, Users, TrendingUp, Wrench, FileCheck, CheckCircle, Phone, Key } from 'lucide-react'
import type { Metadata } from 'next'

// NAPRAWA (audyt SEO/tresci, Daniel 30.07.2026): ta podstrona istniala na
// starej stronie (investrent.com.pl/zarzadzanie-najmem) i opisuje realna,
// aktywnie oferowana usluge firmy - na nowej stronie brakowalo jej calkowicie
// (nie bylo linku ani strony). Tresc oparta 1:1 na tym co juz bylo opublikowane
// na starej stronie, przelozona na styl wizualny nowego projektu.

export const metadata: Metadata = {
  title: 'Zarządzanie najmem Kołobrzeg',
  description: 'Zarządzanie najmem nieruchomości w Kołobrzegu i okolicach nadmorskich — od znalezienia najemcy po bieżącą obsługę i rozliczenia. Stabilny dochód, zero formalności po Twojej stronie.',
}

const FALLBACK_OFFICE = {
  name: 'InvestRent', logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341', email: 'biuro@investrent.com.pl',
  website: null, working_hours: null,
}

const SERVICES = [
  { icon: Users,     title: 'Znalezienie najemcy',   desc: 'Profesjonalna promocja nieruchomości, prezentacja lokalu i weryfikacja potencjalnych lokatorów — certyfikat najemcy w oparciu o rejestry dłużników, dochody i referencje.' },
  { icon: FileCheck, title: 'Obsługa umów najmu',    desc: 'Sporządzanie i negocjowanie umów, monitorowanie terminów płatności, przedłużanie i rozwiązywanie umów. Możliwość najmu okazjonalnego z naszym adresem zabezpieczającym.' },
  { icon: TrendingUp,title: 'Zarządzanie finansami', desc: 'Pobieranie czynszu i opłat, windykacja zaległych płatności, bieżący dostęp do informacji finansowych przez Panel Właściciela.' },
  { icon: Wrench,    title: 'Utrzymanie nieruchomości', desc: 'Regularne przeglądy techniczne, szybka organizacja napraw i konserwacji, zgłaszanie usterek przez Panel Najemcy i Właściciela.' },
]

const BENEFITS = [
  'Kompleksowa obsługa wynajmu — od znalezienia najemcy po bieżące zarządzanie',
  'Przejrzyste umowy sporządzone przez specjalistów prawa nieruchomości',
  'Ubezpieczenie OC najemcy oraz możliwość zabezpieczenia do 3 miesięcy czynszu',
  'Certyfikat Najemcy — nowy standard weryfikacji najemców w Polsce',
  'Możliwość zapewnienia adresu do najmu okazjonalnego',
  'Stały dostęp do informacji o płatnościach przez dedykowany panel właściciela',
]

export default async function ZarzadzanieNajmemPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <Nav office={office} />
      <main>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.08)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Zarządzanie najmem' }]} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(255,255,255,.15)', color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 18 }}>
              <Key size={12} /> Kołobrzeg i wybrzeże — spokój i maksymalizacja dochodów
            </div>
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 44, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.08, marginBottom: 18 }}>
              Zarządzanie najmem<br />w Kołobrzegu
            </h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 580, lineHeight: 1.8, marginBottom: 32 }}>
              Kompleksowa usługa dla właścicieli mieszkań i apartamentów wakacyjnych w Kołobrzegu i okolicach nadmorskich. Cieszysz się stabilnym dochodem z najmu, minimalizując ryzyko i oszczędzając czas — my na miejscu przejmujemy wszystkie obowiązki związane z wynajmem.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <a href="#kontakt-najem" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#0d2a5c', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none' }}>
                <Phone size={16} /> Powierz nam swoją nieruchomość
              </a>
              <a href="tel:+48731554341" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.15)', color: 'white', fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 12, textDecoration: 'none' }}>
                +48 731 554 341
              </a>
            </div>
          </div>
        </div>

        {/* Zakres usług */}
        <div style={{ background: '#f8fafc', padding: '64px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 12 }}>Zakres naszych usług</div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 10 }}>Przejmujemy wszystkie obowiązki</h2>
              <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>Ty zbierasz dochód z najmu, my zajmujemy się resztą.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {SERVICES.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.title} style={{ background: 'white', borderRadius: 16, padding: 26, border: '1px solid #e5e7eb' }}>
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Icon size={22} color="white" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16, color: '#0d2a5c', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Korzyści */}
        <div style={{ background: 'white', padding: '56px 0' }}>
          <div className="container" style={{ maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Shield size={24} color="#1a4fa0" />
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 26, color: '#0d2a5c' }}>Bezpieczeństwo i wygoda</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {BENEFITS.map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14.5, color: '#374151' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="kontakt-najem"><Contact office={office} /></div>
      </main>
      <Footer office={office} />
      <FloatingWA />
      <SocialSidebar office={office} />
    </>
  )
}
