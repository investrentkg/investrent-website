"use client"
import { useState } from 'react'
import { submitLead } from '@/lib/api'

// Formularz strony reklamowej: Imie + Telefon. Zrodlo = staly znacznik kanalu (nie identyfikator reklamowy).
// gclid NIE jest zapisywany przy leadzie (decyzja Prawnika, 11.11.2026).
// ROBOCZE: tekst informacyjny/zgody z makiety po TAK Prawnika; tu miejsce na wersje zatwierdzona.
const SOURCE = 'Google Ads / strona sprzedaj-z-investrent'

// Backend (routes/public.ts) zapisuje w clients.source TYLKO wartosci z webSources, inne -> 'website'; dopoki nie ma wpisu
// w webSources + migracji CHECK clients_source_check, rozpoznawalnosc kanalu zapewnia ten znacznik w notatce klienta.
const NOTES_MARKER = 'Kanał: Google Ads, strona /sprzedaj-z-investrent (prośba o telefon)'

function digits(p: string) {
  return p.replace(/\D/g, '').replace(/^48(?=\d{9}$)/, '')
}

export default function LeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error' | 'invalid'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    if (digits(phone).length !== 9) {
      setStatus('invalid')
      return
    }
    setStatus('loading')
    const res = await submitLead({ full_name: name.trim() || undefined, phone: digits(phone), source: SOURCE, client_type: 'seller', notes: NOTES_MARKER, hp_field: hp })
    setStatus(res?.ok ? 'ok' : 'error')
  }

  if (status === 'ok') {
    return <p role="status" style={{ margin: '16px 0', fontWeight: 700, color: '#047857' }}>Dziękujemy. Oddzwonimy w ciągu 24 godzin.</p>
  }

  const field = { width: '100%', height: 48, padding: '0 12px', fontSize: 16, border: '1px solid #9ca3af', borderRadius: 8, boxSizing: 'border-box' as const }
  return (
    <form onSubmit={onSubmit} noValidate style={{ marginTop: 16, display: 'grid', gap: 12 }}>
      <input type="text" name="name" aria-label="Imię" placeholder="Imię" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} style={field} />
      <input type="tel" name="phone" aria-label="Telefon" placeholder="Telefon" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} aria-invalid={status === 'invalid'} style={field} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={e => setHp(e.target.value)} style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }} />
      {(status === 'invalid' || status === 'error') && (
        <p role="alert" style={{ margin: 0, color: '#b91c1c', fontSize: 14 }}>
          {status === 'invalid' ? 'Podaj 9-cyfrowy numer telefonu albo zadzwoń do nas.' : 'Nie udało się wysłać. Spróbuj ponownie albo zadzwoń do nas.'}
        </p>
      )}
      <button type="submit" disabled={status === 'loading'} style={{ height: 48, borderRadius: 8, border: '1px solid #0b3d91', background: '#fff', color: '#0b3d91', fontWeight: 700, fontSize: 16 }}>
        {status === 'loading' ? 'Wysyłanie…' : 'Oddzwońcie do mnie'}
      </button>
      <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.45 }}>
        [tekst informacyjny wg wersji zatwierdzonej przez Prawnika] <a href="/rodo" target="_blank" rel="noopener noreferrer">Polityka prywatności</a>
      </p>
    </form>
  )
}
