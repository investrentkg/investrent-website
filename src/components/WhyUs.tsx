export default function WhyUs() {
  const reasons = [
    { icon: '📍', title: 'Lokalna wiedza', desc: 'Znamy Kołobrzeg i okolice lepiej niż ktokolwiek. Wiemy które ulice zyskują na wartości i gdzie warto inwestować.' },
    { icon: '🤝', title: 'Uczciwe podejście', desc: 'Nie obiecujemy gruszek na wierzbie. Dajemy rzetelną wycenę i realny plan sprzedaży.' },
    { icon: '⚡', title: 'Szybkie działanie', desc: 'Odpowiadamy w ciągu 24h. Pierwsze prezentacje organizujemy w ciągu 48h od podpisania umowy.' },
    { icon: '🛡️', title: 'Bezpieczeństwo transakcji', desc: 'Sprawdzamy każdą nieruchomość pod kątem prawnym. Twoje pieniądze są bezpieczne.' },
  ]
  return (
    <section id="dlaczego-my" className="py-20"
      style={{ background: 'linear-gradient(135deg, #0d2a5c 0%, #1a4fa0 100%)' }}>
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(245,166,35,.2)', color: '#f5a623' }}>
            Dlaczego InvestRent?
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Co nas wyróżnia
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Działamy w Kołobrzegu od lat. Znamy ten rynek lepiej niż ktokolwiek.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map(r => (
            <div key={r.title} className="flex gap-4 p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)' }}>
              <div className="text-3xl shrink-0">{r.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
