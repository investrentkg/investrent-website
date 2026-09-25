import type { CSSProperties, ReactNode } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'

// Wspolna oprawa niemieckich stron prawnych (/de/datenschutz, /de/impressum).
// Wzor wizualny: src/app/rodo/page.tsx.

const FALLBACK_OFFICE = {
  name: 'InvestRent', logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341', email: 'biuro@investrent.com.pl',
  website: null, working_hours: null,
}

const h2Style: CSSProperties = { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }

export function H2({ children }: { children: ReactNode }) {
  return <h2 style={h2Style}>{children}</h2>
}
export function H3({ children }: { children: ReactNode }) {
  return <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15.5, color: '#0d2a5c', marginTop: 20, marginBottom: 8 }}>{children}</h3>
}
export function P({ children, last }: { children: ReactNode; last?: boolean }) {
  return <p style={{ marginBottom: last ? 0 : 20 }}>{children}</p>
}
export function UL({ children }: { children: ReactNode }) {
  return <ul style={{ paddingLeft: 20, marginBottom: 20 }}>{children}</ul>
}
export function LI({ children }: { children: ReactNode }) {
  return <li style={{ marginBottom: 8 }}>{children}</li>
}
// Placeholder do uzupelnienia (widoczny, w nawiasach kwadratowych).
export function Ph({ children }: { children: ReactNode }) {
  return <span style={{ background: '#fef3c7', padding: '0 3px', borderRadius: 3 }}>{children}</span>
}

export default async function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE
  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '32px 0 24px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Startseite', href: '/' }, { label: title }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: 'white', letterSpacing: '-1px', marginTop: 12 }}>
              {title}
            </h1>
          </div>
        </div>
        <div style={{ background: 'white', padding: '48px 0 64px' }}>
          <div className="container" style={{ maxWidth: 780 }}>
            <div style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.85 }}>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
      <SocialSidebar office={office} />
    </>
  )
}
