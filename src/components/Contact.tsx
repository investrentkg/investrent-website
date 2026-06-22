'use client'
import { useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://investrent-crm-production.up.railway.app'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', topic: 'kupno' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await fetch(`${BACKEND}/api/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.name,
          phone: form.phone,
          email: form.email,
          notes: `Temat: ${form.topic}\n${form.message}`,
          source: 'website_contact',
          client_type: form.topic === 'sprzedaz' ? 'seller' : 'buyer'
        })
      })
      setSent(true)
    } catch { setSent(true) }
    setSending(false)
  }

  return (
    <section id="kontakt" className="py-20 bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Lewa — dane kontaktowe */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
              Skontaktuj się z nami
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#0d2a5c' }}>
              Odpowiemy<br />w 60 minut
            </h2>
            <p className="text-lg mb-8" style={{ color: '#6b7280' }}>
              Zostaw nam swój numer lub napisz wiadomość — nasz doradca skontaktuje się z Tobą jeszcze dziś.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: '📞', label: 'Telefon', value: '+48 731 554 341', href: 'tel:+48731554341' },
                { icon: '✉️', label: 'Email', value: 'biuro@investrent.com.pl', href: 'mailto:biuro@investrent.com.pl' },
                { icon: '📍', label: 'Adres', value: 'ul. Przykładowa 1, 78-100 Kołobrzeg', href: null },
                { icon: '🕐', label: 'Godziny', value: 'Pon–Pt 8:00–18:00, Sob 9:00–14:00', href: null },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: 'rgba(26,79,160,.08)' }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9ca3af' }}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} className="font-semibold text-sm hover:underline" style={{ color: '#1a4fa0' }}>{c.value}</a>
                      : <div className="font-semibold text-sm" style={{ color: '#111827' }}>{c.value}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            <a href="https://wa.me/48731554341" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm"
              style={{ background: '#25D366', color: '#fff' }}>
              💬 Napisz na WhatsApp
            </a>
          </div>

          {/* Prawa — formularz */}
          <div className="rounded-2xl p-8" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
            {!sent ? (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="text-xl font-extrabold mb-2" style={{ color: '#0d2a5c', fontFamily: 'Syne, sans-serif' }}>
                  Wyślij wiadomość
                </h3>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Temat zapytania</label>
                  <select className="w-full px-4 py-3 rounded-xl text-sm border bg-white outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                    value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}>
                    <option value="kupno">Chcę kupić nieruchomość</option>
                    <option value="sprzedaz">Chcę sprzedać nieruchomość</option>
                    <option value="wynajem">Szukam wynajmu</option>
                    <option value="najem_zarzadzanie">Zarządzanie najmem</option>
                    <option value="trudne">Trudna nieruchomość</option>
                    <option value="inne">Inne</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Imię i nazwisko</label>
                    <input className="w-full px-4 py-3 rounded-xl text-sm border bg-white outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      placeholder="Jan Kowalski" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Telefon *</label>
                    <input className="w-full px-4 py-3 rounded-xl text-sm border bg-white outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      placeholder="+48 ..." required type="tel"
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Email</label>
                  <input className="w-full px-4 py-3 rounded-xl text-sm border bg-white outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="jan@przykład.pl" type="email"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Wiadomość</label>
                  <textarea className="w-full px-4 py-3 rounded-xl text-sm border bg-white outline-none resize-none"
                    style={{ borderColor: '#e5e7eb' }}
                    rows={4} placeholder="Opisz czego szukasz lub co chcesz sprzedać..."
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', color: '#fff' }}>
                  {sending ? 'Wysyłam...' : '✓ Wyślij zapytanie — odpiszemy w 60 min'}
                </button>

                <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
                  Dane są chronione zgodnie z RODO. Nie wysyłamy spamu.
                </p>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0d2a5c' }}>Dziękujemy za wiadomość!</h3>
                <p style={{ color: '#6b7280' }}>Nasz doradca skontaktuje się z Tobą w ciągu 60 minut.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
