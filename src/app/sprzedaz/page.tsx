import PageLayout from '@/components/PageLayout'
import Breadcrumb from '@/components/Breadcrumb'
import Contact from '@/components/Contact'
import { getOffice } from '@/lib/api'
import { DollarSign, Camera, Globe, BarChart3, FileCheck, Key, CheckCircle, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sprzedaż nieruchomości Kołobrzeg | InvestRent',
  description: 'Sprzedaj nieruchomość w Kołobrzegu szybko i za dobrą cenę. Bezpłatna wycena, profesjonalna ekspozycja, pełna obsługa do aktu notarialnego.',
}

const SERVICES = [
  { icon: BarChart3, title: 'Bezpłatna wycena',          desc: 'Dokładna analiza rynku i wycena Twojej nieruchomości bez żadnych zobowiązań. W ciągu 24h.' },
  { icon: Camera,    title: 'Profesjonalne zdjęcia',      desc: 'Sesja zdjęciowa przez profesjonalnego fotografa. Opcjonalnie wirtualny spacer 360°.' },
  { icon: Globe,     title: 'Ekspozycja na portalach',   desc: 'Otodom, OLX, Gratka, Morizon i inne portale. Twoja oferta dotrze do tysięcy kupujących.' },
  { icon: FileCheck, title: 'Weryfikacja dokumentów',    desc: 'Sprawdzamy stan prawny, pomagamy skompletować wszystkie dokumenty potrzebne do sprzedaży.' },
  { icon: DollarSign,title: 'Negocjacje i finalizacja',  desc: 'Reprezentujemy Twoje interesy podczas negocjacji. Towarzyszymy u notariusza.' },
  { icon: Key,       title: 'Stały kontakt',              desc: 'Raportujemy postępy co tydzień. Zawsze wiesz co się dzieje z Twoją ofertą.' },
]

const WHY = [
  '500+ zrealizowanych transakcji w Kołobrzegu i okolicach',
  'Średni czas sprzedaży: 45 dni (rynek: 90+ dni)',
  'Cena transakcyjna wyższa o 8% od średniej rynkowej',
  'Pełna obsługa prawna i notarialna w cenie',
  'Ekspozycja na wszystkich głównych portalach',
  'Fotografik, wirtualny spacer, home staging',
]

export default async function SprzedazPage() {
  const office = await getOffice()
  const fallback = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }
  const off = office ?? fallback

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.08)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Sprzedaż' }]} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(255,255,255,.2)', color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 18 }}>
            <DollarSign size={12} /> Sprzedaż nieruchomości
          </div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
            Sprzedaj swoją nieruchomość<br />szybko i za dobrą cenę
          </h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 540, lineHeight: 1.8, marginBottom: 32 }}>
            Zajmujemy się wszystkim — od bezpłatnej wyceny, przez profesjonalne zdjęcia i ekspozycję na portalach, aż po akt notarialny. Ty czekasz na klucze i pieniądze.
          </p>
          <a href="#kontakt-sprzedaz" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#d97706', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            Chcę bezpłatną wycenę <ArrowRight size={17} />
          </a>
        </div>
      </div>

      {/* Why us */}
      <div style={{ background: 'white', padding: '56px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(26,79,160,.08)', color: '#1a4fa0', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 14 }}>Dlaczego my</div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 20, lineHeight: 1.2 }}>Wiemy jak sprzedać nieruchomość nad Bałtykiem</h2>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
                Rynek nieruchomości w Kołobrzegu rządzi się swoimi prawami. Apartamenty turystyczne, mieszkania dla rodzin, działki pod zabudowę — każdy typ wymaga innego podejścia. Mamy 500+ transakcji za sobą.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {WHY.map(w => (
                  <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={17} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: '#374151' }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[{ val: '500+', label: 'Transakcji' }, { val: '45 dni', label: 'Średni czas sprzedaży' }, { val: '4.9/5', label: 'Ocena klientów' }, { val: '0 zł', label: 'Bezpłatna wycena' }].map(s => (
                <div key={s.label} style={{ background: '#f8fafc', borderRadius: 14, padding: '24px 20px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 32, color: '#0d2a5c', marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={{ background: '#f8fafc', padding: '56px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', letterSpacing: '-.5px' }}>Co robimy za Ciebie</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>Pełna obsługa od pierwszego kontaktu po akt notarialny</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SERVICES.map(s => {
              const Icon = s.icon
              return (
                <div key={s.title} style={{ background: 'white', borderRadius: 14, padding: '24px', border: '1px solid #e5e7eb' }}>
                  <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={22} color="white" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 16, color: '#0d2a5c', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div id="kontakt-sprzedaz">
        <Contact office={off} />
      </div>
    </PageLayout>
  )
}
