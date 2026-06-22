'use client'
import { useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://investrent-crm-production.up.railway.app'

export default function Hero() {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [search, setSearch] = useState('')
  const [sellForm, setSellForm] = useState({ name: '', phone: '', city: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function submitSellLead() {
    if (!sellForm.phone) return
    setSending(true)
    try {
      await fetch(`${BACKEND}/api/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: sellForm.name || 'Klient ze strony',
          phone: sellForm.phone,
          preferred_city: sellForm.city,
          source: 'website_hero_sprzedaj',
          notes: 'Zapytanie ze strony głównej — chce sprzedać nieruchomość',
          client_type: 'seller'
        })
      })
      setSent(true)
    } catch { setSent(true) }
    finally { setSending(false) }
  }

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d2a5c 0%, #1a4fa0 60%, #1e5bbf 100%)' }}>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full border border-white" />
        <div className="absolute top-40 right-40 w-64 h-64 rounded-full border border-white" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full border border-white" />
      </div>

      <div className="container relative z-10 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Lewa kolumna — tekst */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(245,166,35,.15)', color: '#f5a623', border: '1px solid rgba(245,166,35,.3)' }}>
              🏖️ Nr 1 w Kołobrzegu i okolicach
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-1px' }}>
              Nieruchomości<br />
              <span style={{ color: '#f5a623' }}>nad Bałtykiem</span><br />
              bez komplikacji
            </h1>

            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              Kupujesz, sprzedajesz lub wynajmujesz? Nasz zespół w Kołobrzegu
              przeprowadzi Cię przez cały proces — bezpiecznie i bez stresu.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: '🤝', text: '500+ transakcji' },
                { icon: '⚡', text: 'Odpowiedź w 60 min' },
                { icon: '🏅', text: '10 lat na rynku' },
              ].map(s => (
                <div key={s.text} className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-white/80 text-sm font-semibold">{s.text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <a href="tel:+48731554341"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: '#f5a623', color: '#fff', boxShadow: '0 4px 20px rgba(245,166,35,.4)' }}>
                📞 Zadzwoń teraz
              </a>
              <a href="https://wa.me/48731554341" target="_blank" rel="noopener"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: '#25D366', color: '#fff' }}>
                💬 WhatsApp
              </a>
              <a href="#kontakt"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>
                ✉️ Wyślij wiadomość
              </a>
            </div>
          </div>

          {/* Prawa kolumna — formularz */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.15)' }}>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(0,0,0,.2)' }}>
              {[
                { id: 'buy' as const, label: '🔍 Szukam nieruchomości' },
                { id: 'sell' as const, label: '🏠 Chcę sprzedać' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: tab === t.id ? '#fff' : 'transparent',
                    color: tab === t.id ? '#1a4fa0' : 'rgba(255,255,255,.7)'
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Szukam tab */}
            {tab === 'buy' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">Czego szukasz?</label>
                  <select className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-white text-gray-800 border-0 outline-none">
                    <option>Mieszkanie</option>
                    <option>Dom</option>
                    <option>Działka</option>
                    <option>Lokal użytkowy</option>
                    <option>Magazyn / Hala</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">Transakcja</label>
                  <select className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-white text-gray-800 border-0 outline-none">
                    <option>Kupno</option>
                    <option>Wynajem</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-1.5">Lokalizacja</label>
                  <input className="w-full px-4 py-3 rounded-xl text-sm bg-white text-gray-800 border-0 outline-none"
                    placeholder="np. Kołobrzeg, Kamień Pomorski..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <a href={`/oferty?q=${encodeURIComponent(search)}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#f5a623', color: '#fff' }}>
                  🔍 Szukaj ofert
                </a>
                <p className="text-center text-white/50 text-xs">
                  lub <a href="tel:+48731554341" className="text-white/80 underline">zadzwoń +48 731 554 341</a> — odpiszemy w 60 min
                </p>
              </div>
            )}

            {/* Sprzedaj tab */}
            {tab === 'sell' && !sent && (
              <div className="space-y-3">
                <p className="text-white/80 text-sm leading-relaxed mb-2">
                  Zostaw numer — oddzwonimy w ciągu <strong className="text-white">60 minut</strong> i umówimy bezpłatną wycenę Twojej nieruchomości.
                </p>
                <input className="w-full px-4 py-3 rounded-xl text-sm bg-white text-gray-800 border-0 outline-none"
                  placeholder="Imię i nazwisko (opcjonalnie)"
                  value={sellForm.name} onChange={e => setSellForm(f => ({ ...f, name: e.target.value }))} />
                <input className="w-full px-4 py-3 rounded-xl text-sm bg-white text-gray-800 border-0 outline-none"
                  placeholder="📞 Twój numer telefonu *" required
                  value={sellForm.phone} onChange={e => setSellForm(f => ({ ...f, phone: e.target.value }))} />
                <input className="w-full px-4 py-3 rounded-xl text-sm bg-white text-gray-800 border-0 outline-none"
                  placeholder="Miejscowość nieruchomości"
                  value={sellForm.city} onChange={e => setSellForm(f => ({ ...f, city: e.target.value }))} />
                <button onClick={submitSellLead} disabled={sending || !sellForm.phone}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#f5a623', color: '#fff' }}>
                  {sending ? 'Wysyłam...' : '✓ Chcę bezpłatną wycenę'}
                </button>
                <p className="text-white/40 text-xs text-center">
                  Nie wysyłamy spamu. Kontaktujemy się wyłącznie w sprawie Twojego zapytania.
                </p>
              </div>
            )}

            {tab === 'sell' && sent && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-white font-bold text-lg mb-2">Dziękujemy!</h3>
                <p className="text-white/70 text-sm">Skontaktujemy się z Tobą w ciągu 60 minut.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/48731554341" target="_blank" rel="noopener"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full font-bold text-white text-sm shadow-2xl transition-all hover:scale-105"
        style={{ background: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,.5)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Napisz na WhatsApp
      </a>
    </section>
  )
}
