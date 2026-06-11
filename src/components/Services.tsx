export default function Services() {
  const services = [
    { icon: '💰', title: 'Sprzedaż nieruchomości', desc: 'Profesjonalna wycena, marketing i obsługa prawna. Sprzedajemy szybko i w dobrej cenie.' },
    { icon: '🔑', title: 'Wynajem', desc: 'Znajdziemy najemcę, sprawdzimy wiarygodność, przygotujemy umowę. Twój spokój ducha.' },
    { icon: '🏠', title: 'Zakup nieruchomości', desc: 'Doradzamy, negocjujemy, pilnujemy interesów kupującego od początku do końca.' },
    { icon: '📋', title: 'Obsługa prawna', desc: 'Współpracujemy z notariuszami i prawnikami. Bezpieczna transakcja gwarantowana.' },
    { icon: '📊', title: 'Wycena nieruchomości', desc: 'Rzetelna wycena oparta na aktualnych danych rynkowych z okolic Kołobrzegu.' },
    { icon: '🏗️', title: 'Rynek pierwotny', desc: 'Jesteśmy pośrednikiem sprawdzonych deweloperów w regionie Kołobrzegu.' },
  ]
  return (
    <section id="oferta" className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
            Nasze usługi
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#111827' }}>
            Kompleksowa obsługa nieruchomości
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Zajmujemy się wszystkim – od pierwszej rozmowy po przekazanie kluczy.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.title} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow bg-white">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
