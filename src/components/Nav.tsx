"use client"
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import type { Office } from '@/types'
import { formatPhoneDisplay } from '@/lib/phone'
import ChatWidget from '@/components/ChatWidget'
import { isCommercialHubOn } from '@/lib/commercialHub'
import { COMMERCIAL_PATH } from '@/content/komercyjne'

const HOUSES_ICON = 'data:image/png;base64,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'

export default function Nav({ office }: { office: Office | null }) {
  const pathname = usePathname()
  const languageTarget = pathname.startsWith('/de/')
    ? pathname === '/de/datenschutz' ? '/rodo' : pathname === '/de/impressum' ? '/kontakt' : '/'
    : pathname === '/rodo' ? '/de/datenschutz' : '/de/immobilien-kolberg'
  const languageLabel = pathname.startsWith('/de/') ? 'PL' : 'DE'
  const languageCode = pathname.startsWith('/de/') ? 'pl' : 'de'
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Zamykanie: zmiana strony, klik poza "Wiecej", Esc (fokus wraca na przycisk), fokus poza grupa.
  useEffect(() => { setOpen(false); setMoreOpen(false) }, [pathname])
  useEffect(() => {
    if (!moreOpen && !open) return
    const onDown = (e: MouseEvent) => {
      if (moreOpen && moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (moreOpen) { setMoreOpen(false); moreBtnRef.current?.focus() }
      else if (open) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [moreOpen, open])

  const phone = formatPhoneDisplay(office?.phone) || '+48 731 554 341'
  const tel = `tel:${phone.replace(/\s/g, '')}`
  // Wariant A "premium" (makieta RP 09.11): 8 pozycji w rzedzie + "Wiecej". Zadna dotychczasowa pozycja nie znika.
  // Wszystkie linki to zwykle <a href> w HTML od razu (takze na mobile - ten sam DOM, rozne style w globals.css, .ir-nav*).
  const links = [
    { label: 'Oferty',   href: '/oferty' },
    { label: 'Kupno',    href: '/kupno' },
    { label: 'Sprzedaż', href: '/sprzedaz' },
    // NOWE (25.09.2026): publiczny kalkulator wyceny (fraza "wycena mieszkania Kolobrzeg").
    { label: 'Wycena', href: '/wycena' },
    { label: 'Wynajem',  href: '/wynajem' },
    // NOWE (24.09.2026, SEO): /kolobrzeg musi miec link w glownym menu na kazdej podstronie.
    { label: 'Kołobrzeg', href: '/kolobrzeg' },
    // Komercyjne (Daniel 07.11.2026): tylko przy wlaczonej fladze NEXT_PUBLIC_COMMERCIAL_HUB (bez flagi = brak martwego linku).
    ...(isCommercialHubOn() ? [{ label: 'Komercyjne', href: COMMERCIAL_PATH }] : []),
    { label: 'Kontakt',  href: '/kontakt' },
  ]
  // Pod "Wiecej" (opisy wg makiety). Blog i Kalkulator: pozycje z makiety (Blog byl od 16.08 tylko w stopce).
  const moreLinks = [
    { label: 'Zarządzanie najmem', desc: 'Najem krótko- i długoterminowy pod klucz', href: '/zarzadzanie-najmem' },
    { label: 'O nas', desc: 'Zespół i sposób pracy', href: '/o-nas' },
    { label: 'Trudne sprawy', desc: 'Spadki, współwłasność, długi, zasiedzenie', href: '/trudne-nieruchomosci' },
    { label: 'Blog', desc: 'Poradniki o rynku w Kołobrzegu', href: '/blog' },
    { label: 'Kalkulator', desc: 'Kalkulator kredytowy i wycena', href: '/kalkulator' },
  ]
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const moreActive = moreLinks.some(l => isActive(l.href))
  const close = () => { setOpen(false); setMoreOpen(false) }

  return (
    <>
      <nav className={`ir-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`} aria-label="Menu główne">
        <div className="ir-nav-inner">
          <a href="/" className="ir-nav-logo">
            {/* Białe kontury domków bezpośrednio na granatowym tle */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HOUSES_ICON} alt="InvestRent" />
            <div>
              <span className="ir-nav-brand">INVEST RENT</span>
              <span className="ir-nav-sub">NIERUCHOMOŚCI</span>
            </div>
          </a>

          <a href={tel} className="ir-nav-mphone" aria-label={`Zadzwoń: ${phone}`}><Phone size={14} /> <span className="ir-nav-mphone-t">{phone}</span></a>
          <button type="button" className="ir-nav-burger" onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'} aria-expanded={open} aria-controls="ir-nav-panel">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div id="ir-nav-panel" className="ir-nav-panel">
            <div className="ir-nav-main">
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={close} className="ir-nav-link"
                  aria-current={isActive(l.href) ? 'page' : undefined}>{l.label}</a>
              ))}
              <div className="ir-nav-more" ref={moreRef}
                onBlur={e => { if (moreOpen && !e.currentTarget.contains(e.relatedTarget as Node | null)) setMoreOpen(false) }}>
                <button type="button" ref={moreBtnRef} className={`ir-nav-morebtn${moreActive ? ' is-active' : ''}`}
                  aria-expanded={moreOpen} aria-controls="ir-nav-more-list" onClick={() => setMoreOpen(o => !o)}>
                  Więcej <ChevronDown size={14} aria-hidden="true" />
                </button>
                <div className="ir-nav-morelabel" aria-hidden="true">Więcej</div>
                <div id="ir-nav-more-list" className={`ir-nav-morelist${moreOpen ? ' is-open' : ''}`}>
                  {moreLinks.map(l => (
                    <a key={l.href} href={l.href} onClick={close} aria-current={isActive(l.href) ? 'page' : undefined}>
                      <span>{l.label}</span><small>{l.desc}</small>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="ir-nav-right">
              <a href={languageTarget} lang={languageCode} aria-label={languageCode.toUpperCase()} onClick={close} className="ir-nav-lang">{languageLabel}</a>
              <a href={tel} className="ir-nav-phone"><Phone size={13} /> {phone}</a>
            </div>
          </div>
        </div>
      </nav>
      <ChatWidget />
    </>
  )
}
