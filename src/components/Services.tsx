export default function Services() {
  const services = [
    {
      icon: '🏠',
      title: 'Kupno nieruchomości',
      desc: 'Znajdziemy dla Ciebie wymarzoną nieruchomość — dopasowaną do budżetu i preferencji. Obsługujemy cały proces od wyszukania po podpisanie aktu.',
      cta: 'Szukam nieruchomości',
      href: '/oferty',
      color: '#1a4fa0',
    },
    {
      icon: '💰',
      title: 'Sprzedaż nieruchomości',
      desc: 'Skutecznie i szybko sprzedamy Twoją nieruchomość. Profesjonalne zdjęcia, ekspozycja na wszystkich portalach i aktywna sprzedaż — nie czekasz.',
      cta: 'Chcę sprzedać',
      href: '#kontakt',
      color: '#f5a623',
    },
    {
      icon: '🔑',
      title: 'Wynajem',
      desc: 'Szukasz mieszkania do wynajęcia lub chcesz wynająć swoją nieruchomość? Zajmujemy się kompletną obsługą — od znalezienia lokatora po umowę.',
      cta: 'Wynajem',
      href: '/oferty?typ=wynajem',
      color: '#10b981',
    },
    {
      icon: '🏢',
      title: 'Zarządzanie najmem',
      desc: 'Wynajmujesz mieszkanie ale nie masz czasu na obsługę? Przejmiemy wszystkie obowiązki właściciela — rozliczenia, naprawy, kontakt z najemcą.',
      cta: 'Dowiedz się więcej',
      href: '/zarzadzanie-najmem',
      color: '#8b5cf6',
    },
    {
      icon: '⚖️',
      title: 'Trudne nieruchomości',
      desc: 'Sprawy spadkowe, współwłasność, hipoteki, zaległości czynszowe — specjalizujemy się w nieruchomościach z historią. Nie poddajemy się tam gdzie inni rezygnują.',
      cta: 'Mam trudną sprawę',
      href: '/trudne-nieruchomosci',
      color: '#ef4444',
    },
    {
      icon: '📋',
      title: 'Obsługa prawna',
      desc: 'Sprawdzimy stan prawny nieruchomości, KW, umowy i zadbamy o bezpieczne przeprowadzenie całej transakcji. Masz spokój, my pilnujemy formalności.',
      cta: 'Zapytaj o obsługę',
      href: '#kontakt',
      color: '#0ea5e9',
    },
  ]

  return (
    <section id="uslugi" className="py-20" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
            Kompleksowa obsługa
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#0d2a5c' }}>
            Wszystko czego potrzebujesz<br />w jednym miejscu
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6b7280' }}>
            Niezależnie czy kupujesz, sprzedajesz czy chcesz bezproblemowo wynajmować — jesteśmy tu dla Ciebie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.title} className="bg-white rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ border: '1px solid #e5e7eb' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: s.color + '15' }}>
                {s.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b7280' }}>{s.desc}</p>
              <a href={s.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5"
                style={{ color: s.color }}>
                {s.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)' }}>
          <h3 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Nie wiesz od czego zacząć?
          </h3>
          <p className="text-white/70 mb-6">Zadzwoń lub napisz — nasz ekspert pomoże bezpłatnie wybrać najlepszą ścieżkę dla Ciebie.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+48731554341"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: '#f5a623', color: '#fff' }}>
              📞 +48 731 554 341
            </a>
            <a href="https://wa.me/48731554341" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: '#25D366', color: '#fff' }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
