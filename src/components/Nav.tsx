"use client"
import { useState, useEffect } from 'react'
import { Phone, Menu, X } from 'lucide-react'
import type { Office } from '@/types'

const HOUSES_ICON = 'data:image/png;base64,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'

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
    { label: 'Oferty',   href: '/oferty' },
    { label: 'Kupno',    href: '/kupno' },
    { label: 'Sprzedaż', href: '/sprzedaz' },
    { label: 'Wynajem',  href: '/wynajem' },
    { label: 'O nas',    href: '/o-nas' },
    { label: 'Trudne sprawy', href: '/trudne-nieruchomosci' },
    { label: 'Kontakt',  href: '/kontakt' },
  ]

  return (
    <>
      <nav style={{
        backgroundColor: '#0d2a5c', padding: '13px 0',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,.3)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* Białe kontury domków bezpośrednio na granatowym tle */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOUSES_ICON} alt="InvestRent"
                style={{ height: 50, width: 'auto', display: 'block' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontFamily: 'var(--font-montserrat), Arial Black, sans-serif', fontWeight: 800, color: 'white', fontSize: 17, letterSpacing: '.5px' }}>INVEST RENT</span>
                <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase' as const, marginTop: 3 }}>NIERUCHOMOŚCI</span>
              </div>
            </a>

            {isDesktop && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {links.map(l => (
                  <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>{l.label}</a>
                ))}
                <a href={`tel:${phone.replace(/\s/g, '')}`}
                  style={{ background: '#f5a623', color: 'white', fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                  <Phone size={13} /> {phone}
                </a>
              </div>
            )}

            {!isDesktop && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a href={`tel:${phone.replace(/\s/g, '')}`}
                  style={{ background: '#f5a623', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                  <Phone size={12} /> {phone}
                </a>
                <button onClick={() => setOpen(true)} style={{ color: 'rgba(255,255,255,.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Menu size={22} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(9,30,64,.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
          <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 20, right: 24, color: 'rgba(255,255,255,.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={28} />
          </button>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,.85)', textDecoration: 'none' }}>{l.label}</a>
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
