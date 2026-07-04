"use client"
import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react'
import { submitLead } from '@/lib/api'

export default function ChatWidget() {
  const [open, setOpen]         = useState(false)
  const [shown, setShown]       = useState(false)
  const [bubble, setBubble]     = useState(false)
  const [name, setName]         = useState('')
  const [chatError, setChatError] = useState('')
  const [phone, setPhone]       = useState('')
  const [msg, setMsg]           = useState('')
  const [status, setStatus]     = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [unread, setUnread]     = useState(true)

  useEffect(() => {
    // Pokaż bąbel po 30 sekundach
    const t1 = setTimeout(() => { setBubble(true); setShown(true) }, 30000)
    // Schowaj bąbel po 8 sekundach
    const t2 = setTimeout(() => setBubble(false), 38000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  function openChat() { setOpen(true); setBubble(false); setUnread(false) }

  async function send() {
    if (!phone.trim()) return
    const cleaned = phone.replace(/[\s\-()]/g, '')
    if (!/^(\+?[1-9]\d{7,14}|\d{9})$/.test(cleaned)) {
      setChatError('Podaj prawidłowy numer telefonu (9 cyfr)')
      return
    }
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

  return (
    <>
      {/* Bąbel powitalny */}
      {bubble && !open && (
        <div onClick={openChat} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
          background: 'white', borderRadius: 16, padding: '14px 18px',
          boxShadow: '0 8px 32px rgba(0,0,0,.15)', cursor: 'pointer',
          maxWidth: 260, animation: 'fadeUp .3s ease',
          border: '1px solid rgba(26,79,160,.12)',
        }}>
          <div style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.5, fontWeight: 500 }}>
            Cześć! 👋 Szukasz nieruchomości?<br />
            <span style={{ color: '#1a4fa0' }}>Chętnie pomogę!</span>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Odpiszemy w kilka minut</div>
          {/* trójkąt */}
          <div style={{ position: 'absolute', bottom: -8, right: 24, width: 0, height: 0,
            borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
            borderTop: '8px solid white', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.08))' }} />
        </div>
      )}

      {/* Przycisk chat */}
      <button onClick={() => open ? setOpen(false) : openChat()}
        className={!open ? 'cta-pulse-limited' : ''}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)',
          color: 'white', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(13,42,92,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        {open ? <ChevronDown size={22} /> : <MessageCircle size={22} />}
        {unread && !open && (
          <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10,
            borderRadius: '50%', background: '#ef4444', border: '2px solid white' }} />
        )}
      </button>

      {/* Panel chatu */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 9997,
          width: 320, background: 'white', borderRadius: 20,
          boxShadow: '0 16px 64px rgba(0,0,0,.18)',
          border: '1px solid rgba(26,79,160,.1)',
          overflow: 'hidden', animation: 'fadeUp .25s ease',
        }}>
          {/* Header */}
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

          {/* Treść */}
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
                  <input type="text" placeholder="Imię (opcjonalnie)"
                    value={name} onChange={e => setName(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                      fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                  <input type="tel" placeholder="+48 numer telefonu *"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    style={{ padding: '10px 14px', borderRadius: 10,
                      border: `1.5px solid ${status === 'error' ? '#ef4444' : '#e2e8f0'}`,
                      fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                  <input type="text" placeholder="Czego szukasz? (opcjonalnie)"
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
