'use client'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#oferta',      label: 'Usługi' },
  { href: '#dlaczego-my', label: 'Dlaczego my' },
  { href: '#zespol',      label: 'Zespół' },
  { href: '#kontakt',     label: 'Kontakt' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13,42,92,.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.2)' : 'none',
      }}>
      <div className="container flex items-center justify-between h-16">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 text-white no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: '#1a4fa0', border: '2px solid rgba(245,166,35,.5)' }}>
            <span style={{ color: '#f5a623', fontFamily: 'Syne, sans-serif' }}>IR</span>
          </div>
          <span className="text-xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Invest<span style={{ color: '#f5a623' }}>Rent</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all no-underline">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+48731554341"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors no-underline">
            📞 731 554 341
          </a>
          <a href="#kontakt"
            className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 no-underline"
            style={{ background: '#f5a623', boxShadow: '0 2px 12px rgba(245,166,35,.3)' }}>
            Bezpłatna wycena
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: 'rgba(13,42,92,.97)', backdropFilter: 'blur(12px)' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-white/80 hover:text-white no-underline"
              style={{ borderBottom: '1px solid rgba(255,255,255,.1)' }}>
              {link.label}
            </a>
          ))}
          <a href="tel:+48731554341"
            className="block mt-4 py-3 text-center rounded-xl text-sm font-bold text-white no-underline"
            style={{ background: '#f5a623' }}>
            📞 Zadzwoń: 731 554 341
          </a>
        </div>
      )}
    </header>
  )
}
