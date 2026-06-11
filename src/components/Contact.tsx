'use client'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', type: 'kupno' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In real implementation this would call an API
    setSent(true)
  }

  return (
    <section id="kontakt" className="py-20" style={{ background: '#fff' }}>
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
            Kontakt
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#111827' }}>
            Skontaktuj się z nami
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Odpowiadamy na każde zapytanie w ciągu 24 godzin. Zadzwoń lub napisz – pierwsze spotkanie
            jest zawsze bezpłatne.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">

          {/* Contact info */}
          <div>
            <div className="flex flex-col gap-4 mb-8">
              {[
                { icon: '📞', label: 'Telefon', value: '+48 731 554 341', href: 'tel:+48731554341' },
                { icon: '✉️', label: 'Email', value: 'biuro@investrent.com.pl', href: 'mailto:biuro@investrent.com.pl' },
                { icon: '📍', label: 'Adres', value: 'Kołobrzeg, woj. zachodniopomorskie', href: null },
                { icon: '🕐', label: 'Godziny otwarcia', value: 'Pon–Pt: 9–17, Sob: 10–14', href: null },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-semibold no-underline"
                        style={{ color: '#1a4fa0' }}>
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-sm font-semibold text-gray-700">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl"
                style={{ background: 'rgba(22,163,74,.05)', border: '1px solid rgba(22,163,74,.2)' }}>
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#16a34a' }}>Wiadomość wysłana!</h3>
                <p className="text-gray-500 text-sm">Odezwiemy się w ciągu 24 godzin.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'kupno', label: '🏠 Chcę kupić' },
                    { value: 'sprzedaz', label: '💰 Chcę sprzedać' },
                    { value: 'wynajem', label: '🔑 Szukam do wynajmu' },
                    { value: 'inne', label: '💬 Inne' },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                      className="p-3 rounded-xl text-xs font-semibold text-center transition-all border"
                      style={{
                        background: form.type === opt.value ? 'rgba(26,79,160,.08)' : '#f8fafc',
                        borderColor: form.type === opt.value ? '#1a4fa0' : '#e2e8f0',
                        color: form.type === opt.value ? '#1a4fa0' : '#6b7280',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <input
                  required
                  placeholder="Imię i nazwisko *"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#1a4fa0')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <input
                  required
                  placeholder="Telefon *"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#1a4fa0')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <input
                  placeholder="Email (opcjonalnie)"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#1a4fa0')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <textarea
                  rows={3}
                  placeholder="Wiadomość (opcjonalnie)..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#1a4fa0')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button type="submit"
                  className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1a4fa0, #0d2a5c)', boxShadow: '0 4px 16px rgba(26,79,160,.3)' }}>
                  Wyślij zapytanie →
                </button>
                <p className="text-xs text-center text-gray-400">
                  Twoje dane są bezpieczne. Nie wysyłamy spamu.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
