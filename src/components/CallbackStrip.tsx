"use client"
import { useState } from 'react'
import { PhoneForwarded } from 'lucide-react'
import { submitLead } from '@/lib/api'

export default function CallbackStrip() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  function isValidPhone(p: string) {
    const cleaned = p.replace(/[\s\-()]/g, '')
    return /^(\+?[1-9]\d{7,14}|\d{9})$/.test(cleaned)
  }

  async function handleCall() {
    if (!phone.trim()) return
    if (!isValidPhone(phone)) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const res = await submitLead({ phone, source: 'callback_strip', client_type: 'buyer' })
    setStatus(res?.ok ? 'ok' : 'error')
  }

  return (
    <div style={{ backgroundColor: '#f5a623', padding: '20px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,.22)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PhoneForwarded size={22} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat), Arial, sans-serif', fontWeight: 800, color: 'white', fontSize: 17, letterSpacing: -0.3, marginBottom: 2 }}>
                Oddzwonimy do 60 minut
              </div>
              <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12 }}>
                Zostaw numer — nasz doradca oddzwoni do Ciebie jeszcze dziś
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {status === 'ok' ? (
              <div style={{ background: 'rgba(255,255,255,.2)', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: 12, fontSize: 13 }}>
                ✓ Oddzwonimy wkrótce!
              </div>
            ) : (
              <>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+48 … wpisz numer telefonu"
                  style={{ background: 'rgba(255,255,255,.95)', borderRadius: 10, padding: '11px 16px', fontSize: 13, color: '#374151', width: 210, border: 'none', outline: 'none' }}
                />
                <button onClick={handleCall} disabled={status === 'loading'}
                  style={{ background: '#0d2a5c', color: 'white', fontSize: 12, fontWeight: 700, padding: '12px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
                  <PhoneForwarded size={14} />
                  {status === 'loading' ? '…' : 'Zostaw numer, oddzwonimy!'}
                </button>
                <a href="https://wa.me/48731554341" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25D366', color: 'white', fontSize: 12, fontWeight: 700, padding: '12px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21zm4.5-2.4a7 7 0 1 0-1.1-1.1l-.9 2 2-.9z"/>
                  </svg>
                  WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
