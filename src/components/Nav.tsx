"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
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
    { label: 'Oferty',    href: '#oferty' },
    { label: 'Kupno',     href: '#uslugi' },
    { label: 'Sprzedaż',  href: '#uslugi' },
    { label: 'Wynajem',   href: '#uslugi' },
    { label: 'O nas',     href: '#o-nas' },
    { label: 'Kontakt',   href: '#kontakt' },
  ]

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-navy transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="container">
          <div className="flex items-center justify-between py-3.5">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              {office?.logo_url ? (
                <div className="bg-white rounded-lg px-2.5 py-1.5">
                  <Image src={office.logo_url} alt={office.name ?? 'InvestRent'} width={120} height={36}
                    className="h-9 w-auto object-contain" />
                </div>
              ) : (
                <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                  <span className="font-mont font-black text-navy text-[15px] tracking-wide">INVEST RENT</span>
                </div>
              )}
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-mont font-black text-white text-[15px] tracking-wide">INVEST RENT</span>
                <span className="text-white/40 text-[9px] tracking-[1.5px] uppercase mt-0.5">nieruchomości</span>
              </div>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6">
              {links.map(l => (
                <a key={l.label} href={l.href}
                  className="text-white/65 text-[13px] font-medium hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 bg-gold text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:brightness-105 transition-all">
                <Phone size={13} /> {phone}
              </a>
            </div>

            {/* Mobile: phone + hamburger */}
            <div className="flex lg:hidden items-center gap-3">
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-1.5 bg-gold text-white text-[12px] font-bold px-3 py-2 rounded-lg">
                <Phone size={12} /> {phone}
              </a>
              <button onClick={() => setOpen(true)}
                className="text-white/70 hover:text-white p-1" aria-label="Menu">
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-navy/97 flex flex-col items-center justify-center gap-7">
          <button onClick={() => setOpen(false)}
            className="absolute top-5 right-6 text-white/60 hover:text-white" aria-label="Zamknij">
            <X size={28} />
          </button>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="font-mont font-bold text-[22px] text-white/85 hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
          <a href={`tel:${phone.replace(/\s/g, '')}`}
            className="mt-2 flex items-center gap-2 text-gold font-mont font-bold text-xl">
            <Phone size={20} /> {phone}
          </a>
        </div>
      )}
    </>
  )
}
