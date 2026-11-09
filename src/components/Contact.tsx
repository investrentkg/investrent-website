"use client"
import { useState } from 'react'
import { Phone, Mail, Clock, MapPin, Send, MessageSquare } from 'lucide-react'
import { submitLead } from '@/lib/api'
import { formatPhoneDisplay } from '@/lib/phone'
import SuccessBadge from '@/components/SuccessBadge'
import MapEmbed from '@/components/ConsentEmbed'
import PrivacyNote from '@/components/PrivacyNote'
import { HEARD_FROM_OPTIONS, normalizeHeardFrom } from '@/lib/heardFrom'
import type { Office } from '@/types'

const TOPICS = [
  'Chcę kupić nieruchomość',
  'Chcę sprzedać nieruchomość',
  'Szukam mieszkania do wynajęcia',
  'Chcę wynajmować swoją nieruchomość',
  'Sprawa trudna / doradztwo prawne',
  'Kredyt hipoteczny',
  'Ubezpieczenie nieruchomości',
  'Bezpłatna wycena nieruchomości',
]

const CLIENT_TYPE: Record<string, string> = {
  'Chcę kupić nieruchomość': 'buyer',
  'Chcę sprzedać nieruchomość': 'seller',
  'Szukam mieszkania do wynajęcia': 'renter',
  'Chcę wynajmować swoją nieruchomość': 'landlord',
}

export default function Contact({ office }: { office: Office | null }) {
  const [form, setForm] = useState({ topic: '', name: '', phone: '', email: '', notes: '', heardFrom: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  // NAPRAWA (audyt wizualny 07.09.2026, P0 - przycisk "Wyślij" nie był w
  // ogóle w <form>, więc submit nic nie robił dla pustego formularza:
  // handleSubmit() nigdy się nie wykonywał przy braku owijającego <form
  // onSubmit>. Dodany prawdziwy <form> + inline komunikat walidacji
  // zamiast blokującego window.alert(), spójny wizualnie z resztą
  // formularza (patrz istniejący styl "status === 'error'" niżej).
  const [validationError, setValidationError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.phone && !form.email) { setValidationError('Podaj telefon lub email, żebyśmy mogli się odezwać.'); return }
    setValidationError('')
    setStatus('loading')
    const res = await submitLead({
      full_name: form.name,
      phone: form.phone,
      email: form.email,
      notes: form.notes ? `[${form.topic}] ${form.notes}` : form.topic,
      source: 'contact_form',
      client_type: CLIENT_TYPE[form.topic] ?? 'buyer',
      heard_from: normalizeHeardFrom(form.heardFrom),
    })
    setStatus(res?.ok ? 'ok' : 'error')
  }

  const phone   = formatPhoneDisplay(office?.phone) || '+48 731 554 341'
  const email   = office?.email   ?? 'biuro@investrent.com.pl'
  const address = office?.address ?? 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg'

  return (
    <section id="kontakt" className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          {/* Left: contact details */}
          <div>
            <div className="tag bg-blue/8 text-blue mb-4">
              <MessageSquare size={12} /> Skontaktuj się
            </div>
            <h2 className="heading text-navy leading-[1.2] mb-4" style={{ fontSize: 'clamp(24px, 3.4vw, 30px)' }}>
              Odpowiemy jak najszybciej,<br />nie później niż w ciągu 24 godzin
            </h2>
            <p className="text-slate-500 text-[14px] leading-[1.8] mb-7">
              Zostaw numer lub napisz wiadomość.
              Bezpłatna konsultacja bez zobowiązań.
            </p>
            <div className="flex flex-col gap-4 mb-7">
              {[
                { icon: Phone,   label: 'Telefon',       val: phone,   href: `tel:${phone.replace(/\s/g,'')}` },
                { icon: Mail,    label: 'Email',         val: email,   href: `mailto:${email}` },
                { icon: Clock,   label: 'Godziny pracy', val: 'Pon–Pt 8:00–16:00 · Sob 10:00–15:00', href: null },
                { icon: MapPin,  label: 'Adres biura',   val: address, href: null },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue/8 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={19} className="text-blue" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[.8px] mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-[15px] font-bold text-blue hover:underline">{item.val}</a>
                      ) : (
                        <div className="text-[14px] font-semibold text-slate-700">{item.val}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <a href="https://wa.me/48731554341" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] text-[#1a1a1a] text-[14px] font-bold px-7 py-3.5 rounded-xl hover:brightness-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21zm4.5-2.4a7 7 0 1 0-1.1-1.1l-.9 2 2-.9z"/>
              </svg>
              Napisz na WhatsApp
            </a>
          </div>

          {/* Right: form */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-8">
            <h3 className="heading m3-fh text-navy mb-5 flex items-center gap-2" style={{ fontSize: 18 }}>
              <Send size={18} style={{ flexShrink: 0 }} /> Wyślij wiadomość
            </h3>
            {status === 'ok' ? (
              <div className="py-12 text-center">
                <SuccessBadge
                  text=""
                  size={48}
                  style={{ flexDirection: 'column' as const, justifyContent: 'center', gap: 10, color: '#10b981', marginBottom: 8 }}
                />
                <div className="font-bold text-navy text-lg mb-2">Wysłano!</div>
                <div className="text-slate-500 text-sm">Skontaktujemy się z Tobą jak najszybciej, nie później niż w ciągu 24 godzin.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <select value={form.topic} onChange={set('topic')} aria-label="Czego dotyczy zapytanie?"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 outline-none focus:border-blue w-full">
                  <option value="">Czego dotyczy zapytanie?</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2.5">
                  <input type="text" placeholder="Imię i nazwisko" aria-label="Imię i nazwisko" value={form.name} onChange={set('name')}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue" />
                  <input type="tel" placeholder="+48 telefon" aria-label="Numer telefonu" value={form.phone} onChange={set('phone')}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue" />
                </div>
                <input type="email" placeholder="Email (opcjonalnie)" aria-label="Adres e-mail (opcjonalnie)" value={form.email} onChange={set('email')}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue" />
                <textarea placeholder="Opisz czego szukasz lub co chcesz sprzedać…" aria-label="Opisz czego szukasz lub co chcesz sprzedać"
                  value={form.notes} onChange={set('notes')} rows={3}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue resize-none" />
                <select value={form.heardFrom} onChange={set('heardFrom')} aria-label="Skąd o nas wiesz? (opcjonalnie)"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 outline-none focus:border-blue w-full">
                  <option value="">Skąd o nas wiesz? (opcjonalnie)</option>
                  {HEARD_FROM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button type="submit" disabled={status === 'loading'}
                  className="btn-navy justify-center text-[14px] py-4 mt-1 disabled:opacity-60">
                  <Send size={15} />
                  {status === 'loading' ? 'Wysyłanie…' : 'Wyślij — odpiszemy najpóźniej w ciągu 24 godzin'}
                </button>
                {validationError && (
                  <p className="text-red-500 text-[12px] text-center">{validationError}</p>
                )}
                {status === 'error' && (
                  <p className="text-red-500 text-[12px] text-center">Błąd wysyłania. Spróbuj ponownie lub zadzwoń.</p>
                )}
                <PrivacyNote color="#5a6680" size={11} style={{ marginTop: 4 }} />
              </form>
            )}
          </div>
        </div>

        {/* Map — pełna szerokość, pod obiema kolumnami */}
        <div className="mt-10 m3-map">
          <div className="m3-map-frame">
          {/* Click-to-load (25.09.2026): mapa Google laduje sie dopiero po kliknieciu (ConsentEmbed); link "Wyznacz trase" ponizej to zwykly link zewnetrzny. */}
          <MapEmbed query="Ratuszowa+12%2F1+lok.+3+Ko%C5%82obrzeg" zoom={17} paddingBottom="20%" minHeight={250} hideLink radius={14} title="InvestRent — lokalizacja biura" />
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Ratuszowa+12%2F1+lok.+3+Ko%C5%82obrzeg"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1a4fa0', color: 'white', padding: '15px 20px', minHeight: 48, borderRadius: 10, marginTop: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Wyznacz trasę do biura
          </a>
        </div>
      </div>
    </section>
  )
}
