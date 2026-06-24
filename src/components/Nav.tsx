"use client"
import { useState, useEffect } from 'react'
import { Phone, Menu, X } from 'lucide-react'
import type { Office } from '@/types'

// Ikona domku zakodowana bezpośrednio — nie wymaga ładowania pliku
const LOGO_ICON = 'data:image/png;base64,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'

export default function Nav({ office }: { office: Office | null }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('scroll', onScroll)
    }
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
      <nav style={{
        backgroundColor: '#0d2a5c',
        padding: '12px 0',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,.3)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* LOGO — biały kwadrat z SAMĄ ikonką + tekst obok */}
            <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{
                background: 'white', borderRadius: 9,
                width: 50, height: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, padding: 7,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_ICON} alt="InvestRent logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontFamily: 'var(--font-montserrat), Arial Black, sans-serif', fontWeight: 800, color: 'white', fontSize: 17, letterSpacing: '.5px' }}>INVEST RENT</span>
                <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase' as const, marginTop: 3 }}>NIERUCHOMOŚCI</span>
              </div>
            </a>

            {/* Desktop — jeden przycisk telefonu */}
            {isDesktop && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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
            )}

            {/* Mobile — telefon + hamburger */}
            {!isDesktop && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a href={`tel:${phone.replace(/\s/g, '')}`}
                  style={{ background: '#f5a623', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                  <Phone size={12} /> {phone}
                </a>
                <button onClick={() => setOpen(true)}
                  style={{ color: 'rgba(255,255,255,.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Menu size={22} />
                </button>
              </div>
            )}

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
