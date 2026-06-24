"use client"
import { useState, useEffect } from 'react'
import { Phone, Menu, X } from 'lucide-react'
import type { Office } from '@/types'

const NAV_STYLES = `
  .nav-desktop { display: none; }
  .nav-mobile  { display: flex; }
  @media (min-width: 1024px) {
    .nav-desktop { display: flex !important; align-items: center; gap: 24px; }
    .nav-mobile  { display: none !important; }
  }
`

export default function Nav({ office }: { office: Office | null }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const phone = office?.phone ?? '+48 731 554 341'
  const links = [
    { label: 'Oferty',   href: '#oferty' },
    { label: 'Kupno',    href: '#uslugi' },
    { label: 'Sprzedaż', href: '#uslugi' },
    { label: 'Wynajem',  href: '#uslugi' },
    { label: 'O nas',    href: '#o-nas' },
    { label: 'Kontakt',  href: '#kontakt' },
  ]

  return (
    <>
      <style>{NAV_STYLES}</style>
      <nav style={{
        backgroundColor: '#0d2a5c',
        padding: '12px 0',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,.3)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* LOGO — biały kwadrat z SAMĄ IKONKĄ + tekst obok */}
            <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{
                background: 'white',
                borderRadius: 9,
                width: 52,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: 6,
              }}>
                {/* logo-icon.png = tylko ikonka domku, bez tekstu */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-icon.png"
                  alt="InvestRent"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-montserrat), Arial Black, sans-serif',
                  fontWeight: 800,
                  color: 'white',
                  fontSize: 17,
                  letterSpacing: '.5px',
                }}>INVEST RENT</span>
                <span style={{
                  color: 'rgba(255,255,255,.45)',
                  fontSize: 9,
                  letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  marginTop: 3,
                }}>NIERUCHOMOŚCI</span>
              </div>
            </a>

            {/* Desktop */}
            <div className="nav-desktop">
              {links.map(l => (
                <a key={l.label} href={l.href}
                  style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                  {l.label}
                </a>
              ))}
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                style={{ background: '#f5a623', color: 'white', fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                <Phone size={13} /> {phone}
              </a>
            </div>

            {/* Mobile */}
            <div className="nav-mobile" style={{ alignItems: 'center', gap: 10 }}>
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                style={{ background: '#f5a623', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <Phone size={12} /> {phone}
              </a>
              <button onClick={() => setOpen(true)}
                style={{ color: 'rgba(255,255,255,.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <Menu size={22} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(9,30,64,.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
          <button onClick={() => setOpen(false)}
            style={{ position: 'absolute', top: 20, right: 24, color: 'rgba(255,255,255,.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={28} />
          </button>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,.85)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
          <a href={`tel:${phone.replace(/\s/g, '')}`}
            style={{ color: '#f5a623', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 20, marginTop: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={20} /> {phone}
          </a>
        </div>
      )}
    </>
  )
}
