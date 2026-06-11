'use client'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="kontakt" className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
            Kontakt
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#111827' }}>
            Porozmawiajmy o Twojej nieruchomości
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Bezpłatna konsultacja – zadzwoń lub wypełnij formularz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact info */}
          <div>
            <div className="flex flex-col gap-6">
              {[
                { icon: '📞', label: 'Telefon', value: '+48 731 554 341', href: 'tel:+48731554341' },
                { icon: '✉️', label: 'Email', value: 'biuro@investrent.com.pl', href: 'mailto:biuro@investrent.com.pl' },
                { icon: '📍', label: 'Adres', value: 'ul. Przykładowa 1, 78-100 Kołobrzeg', href: '#' },
                { icon: '🕐', label: 'Godziny pracy', value: 'Pon-Pt 9:00–18:00, Sob 10:00–14:00', href: '#' },
              ].map(item => (
                <a key={item.label} href={item.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors no-underline">
                  <span className="text-2xl w-10 text-center">{item.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Dziękujemy!</h3>
                <p className="text-gray-500">Oddzwonimy w ciągu 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                  placeholder="Imię i nazwisko *"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                  placeholder="Telefon *"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Opisz czego szukasz lub co chcesz sprzedać..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
                <button type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90"
                  style={{ background: '#f5a623' }}>
                  Wyślij zapytanie →
                </button>
                <p className="text-xs text-center text-gray-400">
                  Oddzwonimy w ciągu 24h. Bezpłatna konsultacja.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
