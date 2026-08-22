"use client"
import { useState, useEffect } from 'react'
import { X, Phone, CheckCircle, Home } from 'lucide-react'
import { submitLead } from '@/lib/api'

interface Props { isOpen: boolean; onClose: () => void }

export default function WycenaModal({ isOpen, onClose }: Props) {
  const [name, setName]     = useState('')
  const [phone, setPhone]   = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  useEffect(() => {
    if (!isOpen) { setName(''); setPhone(''); setStatus('idle') }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [isOpen, onClose])

  function isValidPhone(p: string) {
    const cleaned = p.replace(/[\s\-()]/g, '')
    return /^(\+?[1-9]\d{7,14}|\d{9})$/.test(cleaned)
  }

  async function submit() {
    if (!phone.trim()) return
    if (!isValidPhone(phone)) { setStatus('error'); return }
    setStatus('loading')
    const r = await submitLead({ full_name: name || 'Właściciel', phone: phone.trim(), source: 'wycena_modal', client_type: 'seller', notes: 'Bezpłatna wycena — popup strony głównej' })
    setStatus(r?.ok ? 'ok' : 'error')
  }

  if (!isOpen) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(9,20,50,.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,.25)', position: 'relative' }}>

        <button onClick={onClose} aria-label="Zamknij"
          style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          <X size={16} />
        </button>

        {status === 'ok' ? (
          <div style={{ textAlign: 'center' as const, padding: '16px 0' }}>
            <div className="success-badge" style={{ width: 72, height: 72, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', marginBottom: 8 }}>Dziękujemy!</h3>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Nasz ekspert skontaktuje się z Tobą w ciągu <strong>60 minut</strong> i bezpłatnie wyceni Twoją nieruchomość.</p>
            <button onClick={onClose} style={{ background: '#0d2a5c', color: 'white', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <div style={{ width: 56, height: 56, background: '#eff6ff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Home size={26} color="#1a4fa0" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', marginBottom: 6 }}>Bezpłatna wycena nieruchomości</h3>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Zostaw numer — ekspert oddzwoni w ciągu 60 minut i bezpłatnie wyceni Twoją nieruchomość. Bez zobowiązań.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              <input type="text" placeholder="Imię i nazwisko (opcjonalnie)" aria-label="Imię i nazwisko (opcjonalnie)" value={name} onChange={e => setName(e.target.value)}
                style={{ padding: '13px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', color: '#1e293b', fontFamily: 'inherit' }} />
              <input type="tel" placeholder="+48 numer telefonu *" aria-label="Numer telefonu (wymagane)" value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ padding: '13px 16px', borderRadius: 12, border: `1.5px solid ${status === 'error' ? '#ef4444' : '#e2e8f0'}`, fontSize: 14, outline: 'none', color: '#1e293b', fontFamily: 'inherit' }} />
              <button type="button" onClick={submit} disabled={!phone.trim() || status === 'loading'}
                style={{ background: phone.trim() ? 'linear-gradient(135deg, #1a4fa0, #0d2a5c)' : '#cbd5e1', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: phone.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                <Phone size={16} /> {status === 'loading' ? 'Wysyłanie…' : 'Zamów rozmowę — bezpłatnie'}
              </button>
              {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' as const, margin: 0 }}>Coś poszło nie tak — spróbuj ponownie</p>}
              <p style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center' as const, margin: 0 }}>🔒 Dane chronione zgodnie z RODO · Bez zobowiązań</p>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              {[{ val: '0 zł', label: 'Wycena' }, { val: '60 min', label: 'Odpowiedź' }, { val: '150+', label: 'Transakcji' }].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: 'center' as const }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#0d2a5c' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
