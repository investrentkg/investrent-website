'use client'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
            style={{ background: '#1a4fa0' }}>
            IR
          </div>
          <span className="font-extrabold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
            Invest<span style={{ color: '#f5a623' }}>Rent</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: '#oferta', label: 'Oferta' },
            { href: '#dlaczego-my', label: 'Dlaczego my?' },
            { href: '#zespol', label: 'Zespół' },
            { href: '#kontakt', label: 'Kontakt' },
          ].map(item => (
            <a key={item.href} href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-800 transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+48731554341"
            className="text-sm font-semibold text-gray-700 hover:text-blue-800">
            +48 731 554 341
          </a>
          <a href="#kontakt"
            className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#f5a623' }}>
            Bezpłatna wycena
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {[
            { href: '#oferta', label: 'Oferta' },
            { href: '#dlaczego-my', label: 'Dlaczego my?' },
            { href: '#zespol', label: 'Zespół' },
            { href: '#kontakt', label: 'Kontakt' },
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700">
              {item.label}
            </a>
          ))}
          <a href="tel:+48731554341" className="text-sm font-bold" style={{ color: '#1a4fa0' }}>
            +48 731 554 341
          </a>
        </div>
      )}
    </header>
  )
}
