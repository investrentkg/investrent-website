"use client"
import { useState } from 'react'
import { submitLead } from '@/lib/api'
import PrivacyNote from '@/components/PrivacyNote'
import SuccessBadge from '@/components/SuccessBadge'

// Pas oddzwonienia (makieta M3): biały pas z 3 korzyściami, jedno pole telefonu, WhatsApp jako link tekstowy.
// Logika wysyłki bez zmian (source callback_strip).
export default function CallbackStrip() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  function isValidPhone(p: string) {
    const cleaned = p.replace(/[\s\-()]/g, '')
    return /^(\+?[1-9]\d{7,14}|\d{9})$/.test(cleaned)
  }

  async function handleCall(e: React.FormEvent) {
    e.preventDefault()
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
    <section className="m3-call" aria-label="Oddzwonimy">
      <div className="container">
        <div className="m3-call-in">
          <div>
            <div className="ttl">Oddzwonimy najpóźniej w ciągu 24 godzin</div>
            <p className="sub">Zostaw numer — nasz doradca do Ciebie oddzwoni.</p>
            <ul className="m3-bens">
              <li>Bez zobowiązań</li>
              <li>Kontakt w 24 h</li>
              <li>Rzetelna wycena</li>
            </ul>
          </div>
          <form className="m3-cf" onSubmit={handleCall} noValidate>
            {status === 'ok' ? (
              <SuccessBadge text="Oddzwonimy wkrótce!" style={{ color: '#047857', fontWeight: 700, fontSize: 15, padding: '12px 0' }} />
            ) : (
              <>
                <input
                  type="tel" aria-label="Numer telefonu" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+48 Numer telefonu" autoComplete="tel"
                  aria-invalid={status === 'error'}
                />
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? '…' : 'Zostaw numer, oddzwonimy!'}
                </button>
                {status === 'error' && <p role="alert" style={{ flexBasis: '100%', color: '#b91c1c', fontSize: 13, margin: 0 }}>Nie udało się wysłać. Sprawdź numer telefonu i spróbuj ponownie.</p>}
                <span className="m3-wa">lub napisz na <a href="https://wa.me/48731554341" target="_blank" rel="noopener noreferrer">WhatsApp</a></span>
                <PrivacyNote color="#5a6680" size={11} style={{ flexBasis: '100%', textAlign: 'left' }} />
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
