"use client"
import { useState } from 'react'
import { Phone, Mail, Clock, MapPin, Send, MessageSquare } from 'lucide-react'
import { submitLead } from '@/lib/api'
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
  const [form, setForm] = useState({ topic: '', name: '', phone: '', email: '', notes: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleSubmit() {
    if (!form.phone && !form.email) { alert('Podaj telefon lub email'); return }
    setStatus('loading')
    const res = await submitLead({
      full_name: form.name,
      phone: form.phone,
      email: form.email,
      notes: form.notes ? `[${form.topic}] ${form.notes}` : form.topic,
      source: 'contact_form',
      client_type: CLIENT_TYPE[form.topic] ?? 'buyer',
    })
    setStatus(res?.ok ? 'ok' : 'error')
  }

  const phone   = office?.phone   ?? '+48 731 554 341'
  const email   = office?.email   ?? 'biuro@investrent.com.pl'
  const address = office?.address ?? 'ul. Twoja Ulica 1, 78-100 Kołobrzeg'

  return (
    <section id="kontakt" className="section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          {/* Left: contact details */}
          <div>
            <div className="tag bg-blue/8 text-blue mb-4">
              <MessageSquare size={12} /> Skontaktuj się
            </div>
            <h2 className="heading text-[36px] text-navy leading-[1.1] mb-4">
              Odpowiemy<br />do 60 minut
            </h2>
            <p className="text-slate-500 text-[14px] leading-[1.8] mb-7">
              Zostaw numer lub napisz wiadomość — nasz doradca skontaktuje się z Tobą
              jeszcze dzisiaj. Bezpłatna konsultacja bez zobowiązań.
            </p>
            <div className="flex flex-col gap-4 mb-7">
              {[
                { icon: Phone,   label: 'Telefon',       val: phone,   href: `tel:${phone.replace(/\s/g,'')}` },
                { icon: Mail,    label: 'Email',         val: email,   href: `mailto:${email}` },
                { icon: Clock,   label: 'Godziny pracy', val: 'Pon–Pt 8:00–18:00 · Sob 9:00–14:00', href: null },
                { icon: MapPin,  label: 'Adres biura',   val: address, href: null },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue/8 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={19} className="text-blue" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[.8px] mb-0.5">{item.label}</div>
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
              className="inline-flex items-center gap-2.5 bg-[#25D366] text-white text-[14px] font-bold px-7 py-3.5 rounded-xl hover:brightness-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21zm4.5-2.4a7 7 0 1 0-1.1-1.1l-.9 2 2-.9z"/>
              </svg>
              Napisz na WhatsApp
            </a>

            {/* Map placeholder */}
            <div className="mt-7 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-[200px] flex flex-col items-center justify-center gap-3 text-slate-400">
              <iframe
                src="https://maps.google.com/maps?q=ul.+Ratuszowa+12+Kołobrzeg&output=embed&hl=pl&z=16"
                width="100%" height="200" style={{border:0,display:'block'}}
                allowFullScreen loading="lazy"
                title="InvestRent — lokalizacja biura"
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <h3 className="heading text-[22px] text-navy mb-5 flex items-center gap-2">
              <Send size={18} /> Wyślij wiadomość
            </h3>
            {status === 'ok' ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">✓</div>
                <div className="font-bold text-navy text-lg mb-2">Wysłano!</div>
                <div className="text-slate-500 text-sm">Skontaktujemy się z Tobą do 60 minut.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <select value={form.topic} onChange={set('topic')}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 outline-none focus:border-blue w-full">
                  <option value="">Czego dotyczy zapytanie?</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2.5">
                  <input type="text" placeholder="Imię i nazwisko" value={form.name} onChange={set('name')}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue" />
                  <input type="tel" placeholder="+48 telefon" value={form.phone} onChange={set('phone')}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue" />
                </div>
                <input type="email" placeholder="Email (opcjonalnie)" value={form.email} onChange={set('email')}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue" />
                <textarea placeholder="Opisz czego szukasz lub co chcesz sprzedać…"
                  value={form.notes} onChange={set('notes')} rows={3}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue resize-none" />
                <button onClick={handleSubmit} disabled={status === 'loading'}
                  className="btn-navy justify-center text-[14px] py-4 mt-1 disabled:opacity-60">
                  <Send size={15} />
                  {status === 'loading' ? 'Wysyłanie…' : 'Wyślij — odpiszemy do 60 min'}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-[12px] text-center">Błąd wysyłania. Spróbuj ponownie lub zadzwoń.</p>
                )}
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Dane chronione zgodnie z RODO · Nie wysyłamy spamu · Kontakt bez zobowiązań
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
