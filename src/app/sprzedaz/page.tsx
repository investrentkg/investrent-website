import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import { DollarSign, Camera, Globe, FileCheck, Key, CheckCircle, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sprzedaz nieruchomosci Kolobrzeg | InvestRent',
  description: 'Sprzedaj nieruchomosc w Kolob rzegu szybko i za dobra cene. Bezplatna wycena, pelna obsluga.',
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

const SERVICES = [
  { icon: DollarSign, title: 'Bezplatna wycena',       desc: 'Dokladna analiza rynku i wycena Twojej nieruchomosci bez zobowiazan. W ciagu 24h.' },
  { icon: Camera,     title: 'Profesjonalne zdjecia',  desc: 'Sesja zdjeciowa przez profesjonalnego fotografa. Opcjonalnie wirtualny spacer 360.' },
  { icon: Globe,      title: 'Ekspozycja na portalach',desc: 'Otodom, OLX, Gratka, Morizon. Twoja oferta dotrze do tysiecy kupujacych.' },
  { icon: FileCheck,  title: 'Weryfikacja dokumentow', desc: 'Sprawdzamy stan prawny, pomagamy skompletowac dokumenty potrzebne do sprzedazy.' },
  { icon: DollarSign, title: 'Negocjacje i finalizacja',desc: 'Reprezentujemy Twoje interesy. Towarzyszymy u notariusza.' },
  { icon: Key,        title: 'Staly kontakt',           desc: 'Raportujemy postepy co tydzien. Zawsze wiesz co sie dzieje z Twoja oferta.' },
]

const WHY = [
  '500+ zrealizowanych transakcji',
  'Sredni czas sprzedazy: 45 dni (rynek: 90+ dni)',
  'Pelna obsluga prawna i notarialna w cenie',
  'Ekspozycja na wszystkich glownych portalach',
  'Fotografik, wirtualny spacer, home staging',
]

export default async function SprzedazPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <Breadcrumb crumbs={[{ label: 'Strona glowna', href: '/' }, { label: 'Sprzedaz' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              Sprzedaj swoja nieruchomosc<br />szybko i za dobra cene
            </h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 540, lineHeight: 1.8, marginBottom: 32 }}>
              Zajmujemy sie wszystkim — od bezplatnej wyceny, przez profesjonalne zdjecia i ekspozycje, az po akt notarialny.
            </p>
            <a href="#kontakt-sprzedaz" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#d97706', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
              Chce bezplatna wycene <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div style={{ background: 'white', padding: '56px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#0d2a5c', marginBottom: 20 }}>Wiemy jak sprzedac nieruchomosc nad Baltykiem</h2>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  {WHY.map(w => (
                    <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={17} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, color: '#374151' }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[{ val: '500+', label: 'Transakcji' }, { val: '45 dni', label: 'Sredni czas' }, { val: '4.9/5', label: 'Ocena' }, { val: '0 zl', label: 'Wycena' }].map(s => (
                  <div key={s.label} style={{ background: '#f8fafc', borderRadius: 14, padding: '24px 20px', textAlign: 'center' as const, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 32, color: '#0d2a5c', marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '56px 0' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', marginBottom: 32, textAlign: 'center' as const }}>Co robimy za Ciebie</h2>
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

        <div id="kontakt-sprzedaz">
          <Contact office={office} />
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
