"use client"
import { useState, useEffect } from 'react'
import { Phone, Menu, X } from 'lucide-react'
import type { Office } from '@/types'

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
      <nav style={{
        backgroundColor: '#0d2a5c',
        padding: '13px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,.25)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              {office?.logo_url ? (
                <div style={{ background: 'white', borderRadius: 9, padding: '6px 14px', display: 'inline-flex' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={office.logo_url} alt={office.name ?? 'InvestRent'}
                    style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: 9, padding: '6px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, color: '#0d2a5c', fontSize: 15, letterSpacing: '.5px' }}>INVEST RENT</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, color: 'white', fontSize: 15, letterSpacing: '.5px' }}>INVEST RENT</span>
                <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 3 }}>nieruchomości</span>
              </div>
            </a>

            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 24 }}>
              {links.map(l => (
                <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>{l.label}</a>
              ))}
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                style={{ background: '#f5a623', color: 'white', fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                <Phone size={13} /> {phone}
              </a>
            </div>

            <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10 }}>
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                style={{ background: '#f5a623', color: 'white', fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <Phone size={12} /> {phone}
              </a>
              <button onClick={() => setOpen(true)} style={{ color: 'rgba(255,255,255,.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(13,42,92,.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
          <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 20, right: 24, color: 'rgba(255,255,255,.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
