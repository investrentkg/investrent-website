"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { submitLead } from '@/lib/api'
import { trackContactEvent } from '@/lib/track'

// Launcher kontaktu: JEDEN pływający przycisk (prawy dolny róg) -> menu WhatsApp /
// "Napisz do nas" (panel z formularzem telefonu) / "Zadzwoń". Zastępuje dawne FloatingWA
// + osobny przycisk czatu. Renderowany raz, w Nav.tsx.
const WA_URL = 'https://wa.me/48731554341'
const TEL_URL = 'tel:+48731554341'
// Oficjalne logo WhatsApp (simple-icons)
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'
const SESSION_KEY = 'ir_launcher_hints'

// Strony, na których kontakt jest główną akcją (oferta, kontakt, sprzedaż) - launcher nie chowa się
// przy przewijaniu i nie pokazuje zachęty/bąbla, żeby nie zasłaniać CTA i formularzy.
function isContactPage(path: string | null) {
  if (!path) return false
  return path.startsWith('/oferty/') || path === '/kontakt' || path === '/sprzedaz'
}

function seen(flag: string): boolean {
  try { return (sessionStorage.getItem(SESSION_KEY) || '').split(',').includes(flag) } catch { return false }
}
function markSeen(flag: string) {
  try {
    const cur = (sessionStorage.getItem(SESSION_KEY) || '').split(',').filter(Boolean)
    if (!cur.includes(flag)) sessionStorage.setItem(SESSION_KEY, [...cur, flag].join(','))
  } catch { /* brak storage - najwyżej pokażemy ponownie */ }
}

export default function ChatWidget() {
  const pathname = usePathname()
  const contactPage = isContactPage(pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [open, setOpen]         = useState(false) // panel czatu
  const [hidden, setHidden]     = useState(false)
  const [teaser, setTeaser]     = useState(false)
  const [bubble, setBubble]     = useState(false)
  const [name, setName]         = useState('')
  const [chatError, setChatError] = useState('')
  const [phone, setPhone]       = useState('')
  const [msg, setMsg]           = useState('')
  const [status, setStatus]     = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const fabRef = useRef<HTMLButtonElement>(null)
  const menuOpenRef = useRef(false)
  const chatOpenRef = useRef(false)
  menuOpenRef.current = menuOpen
  chatOpenRef.current = open

  const closeAll = useCallback((returnFocus: boolean) => {
    setMenuOpen(false); setOpen(false)
    if (returnFocus) fabRef.current?.focus()
  }, [])

  // Zachęta (pastylka) 4 s po wejściu - raz na sesję; bąbel powitalny po 30 s - raz na sesję.
  useEffect(() => {
    if (contactPage) { setTeaser(false); setBubble(false); return }
    const timers: ReturnType<typeof setTimeout>[] = []
    if (!seen('teaser')) {
      markSeen('teaser'); setTeaser(true)
      timers.push(setTimeout(() => setTeaser(false), 4000))
    }
    if (!seen('bubble')) {
      timers.push(setTimeout(() => {
        if (menuOpenRef.current || chatOpenRef.current) return
        markSeen('bubble'); setBubble(true)
      }, 30000))
      timers.push(setTimeout(() => setBubble(false), 38000))
    }
    return () => timers.forEach(clearTimeout)
  }, [contactPage])

  // Chowanie przy przewijaniu w dół; powrót po przewinięciu w górę o >=8 px lub ~600 ms po zatrzymaniu scrolla.
  useEffect(() => {
    if (contactPage) { setHidden(false); return }
    let lastY = window.scrollY
    let upDist = 0
    let idle: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      setTeaser(false); setBubble(false)
      if (chatOpenRef.current) return
      if (dy > 0 && y > 80) {
        upDist = 0
        setHidden(true); setMenuOpen(false)
      } else if (dy < 0) {
        upDist += -dy
        if (upDist >= 8) setHidden(false)
      }
      if (idle) clearTimeout(idle)
      idle = setTimeout(() => setHidden(false), 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (idle) clearTimeout(idle) }
  }, [contactPage])

  // Escape zamyka menu/panel i zwraca fokus na przycisk.
  useEffect(() => {
    if (!menuOpen && !open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(true) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, open, closeAll])

  function toggleFab() {
    setTeaser(false); setBubble(false)
    if (open) { setOpen(false); return }
    setMenuOpen(m => !m)
  }
  function openChat() {
    setMenuOpen(false); setBubble(false); setTeaser(false); setOpen(true)
    trackContactEvent('chat_open')
  }

  async function send() {
    if (!phone.trim()) return
    const cleaned = phone.replace(/[\s\-()]/g, '')
    if (!/^(\+?[1-9]\d{7,14}|\d{9})$/.test(cleaned)) {
      setChatError('Podaj prawidłowy numer telefonu (9 cyfr)')
      return
    }
    setChatError('')
    setStatus('loading')
    const r = await submitLead({
      full_name: name || 'Klient chat',
      phone: phone.trim(),
      notes: msg ? `Chat: ${msg}` : 'Kontakt przez chat na stronie',
      source: 'chat_widget',
      client_type: 'buyer',
    })
    setStatus(r?.ok ? 'ok' : 'error')
  }

  const active = menuOpen || open

  return (
    <>
      {menuOpen && <div className="lnch-scrim" onClick={() => closeAll(false)} aria-hidden="true" />}

      {/* Bąbel powitalny - raz na sesję, znika przy scrollu i przy otwarciu menu/panelu */}
      {bubble && !active && !hidden && (
        <div onClick={openChat} className="lnch-bubble" style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.5, fontWeight: 500 }}>
            Cześć! 👋 Szukasz nieruchomości?<br />
            <span style={{ color: '#1a4fa0' }}>Chętnie pomogę!</span>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Odpiszemy w kilka minut</div>
        </div>
      )}

      <div className="lnch-root" data-hidden={hidden && !active ? 'true' : 'false'}>
        {menuOpen && (
          <ul id="contact-launcher-menu" className="lnch-menu" aria-label="Kontakt z biurem">
            <li>
              <a className="lnch-item" href={WA_URL} target="_blank" rel="noopener noreferrer"
                onClick={() => { trackContactEvent('whatsapp_click'); closeAll(false) }}>
                <span className="lnch-ico wa" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d={WA_PATH} /></svg>
                </span>
                WhatsApp
              </a>
            </li>
            <li>
              <button type="button" className="lnch-item" onClick={openChat}>
                <span className="lnch-ico" aria-hidden="true"><MessageCircle size={22} /></span>
                Napisz do nas
              </button>
            </li>
            <li>
              <a className="lnch-item" href={TEL_URL}
                onClick={() => { trackContactEvent('phone_click'); closeAll(false) }}>
                <span className="lnch-ico" aria-hidden="true"><Phone size={22} /></span>
                Zadzwoń
              </a>
            </li>
          </ul>
        )}

        <div className="lnch-row">
          {teaser && !active && (
            <button type="button" className="lnch-teaser" onClick={() => { setTeaser(false); setMenuOpen(true) }}>
              Napisz do nas
            </button>
          )}
          <button ref={fabRef} type="button" className="lnch-fab" onClick={toggleFab}
            aria-label="Kontakt z biurem" aria-expanded={active}
            aria-controls={open ? 'contact-launcher-panel' : 'contact-launcher-menu'}>
            {active ? <X size={24} /> : <MessageCircle size={24} />}
          </button>
        </div>
      </div>

      {/* Panel czatu (formularz telefonu) */}
      {open && (
        <div id="contact-launcher-panel" className="lnch-panel" role="dialog" aria-label="Napisz do nas">
          <div style={{ background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🏠
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>InvestRent</div>
                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                  Odpowiadamy w kilka minut
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: 20 }}>
            {status === 'ok' ? (
              <div style={{ textAlign: 'center' as const, padding: '16px 0' }}>
                <div className="success-badge" style={{ width: 44, height: 44, margin: '0 auto 12px', color: '#10b981' }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.15" />
                    <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ fontWeight: 700, color: '#0d2a5c', fontSize: 16, marginBottom: 6 }}>
                  Wiadomość wysłana!
                </div>
                <div style={{ color: '#64748b', fontSize: 13 }}>
                  Oddzwonimy lub odpiszemy najszybciej jak to możliwe.
                </div>
              </div>
            ) : (
              <>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', marginBottom: 14,
                  fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                  Cześć! W czym możemy pomóc? Zostaw numer — oddzwonimy! 😊
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  <input type="text" placeholder="Imię (opcjonalnie)" aria-label="Imię"
                    value={name} onChange={e => setName(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                      fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                  <input type="tel" placeholder="+48 numer telefonu *" aria-label="Numer telefonu"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    style={{ padding: '10px 14px', borderRadius: 10,
                      border: `1.5px solid ${status === 'error' || chatError ? '#ef4444' : '#e2e8f0'}`,
                      fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                  {chatError && <div role="alert" style={{ color: '#ef4444', fontSize: 12 }}>{chatError}</div>}
                  <input type="text" placeholder="Czego szukasz? (opcjonalnie)" aria-label="Czego szukasz"
                    value={msg} onChange={e => setMsg(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                      fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                  <button type="button" onClick={send} disabled={!phone.trim() || status === 'loading'}
                    style={{ background: phone.trim() ? 'linear-gradient(135deg,#1a4fa0,#0d2a5c)' : '#cbd5e1',
                      color: 'white', border: 'none', borderRadius: 10, padding: '11px',
                      fontSize: 13, fontWeight: 700, cursor: phone.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      fontFamily: 'inherit' }}>
                    <Send size={14} />
                    {status === 'loading' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
                  </button>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 10, textAlign: 'center' as const, margin: '10px 0 0' }}>
                  🔒 RODO · Bez zobowiązań
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
