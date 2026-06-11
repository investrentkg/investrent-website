export default function CTA() {
  return (
    <section className="py-20" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d2a5c 0%, #1a4fa0 100%)', padding: '60px 48px' }}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(245,166,35,.2)', color: '#f5a623', border: '1px solid rgba(245,166,35,.3)' }}>
              🏖️ Kołobrzeg i okolice
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}>
              Gotowy na nowe mieszkanie?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,.7)' }}>
              Skontaktuj się z nami. Bezpłatna konsultacja, rzetelna wycena i pełna obsługa
              od pierwszej rozmowy po klucze w dłoni.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+48731554341"
                className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105 no-underline"
                style={{ background: '#f5a623', boxShadow: '0 4px 20px rgba(245,166,35,.4)' }}>
                📞 Zadzwoń teraz: 731 554 341
              </a>
              <a href="#kontakt"
                className="px-8 py-4 rounded-xl font-bold text-base border-2 transition-all hover:bg-white/10 no-underline"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>
                Napisz do nas →
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                '✓ Bezpłatna wycena',
                '✓ Bez zobowiązań',
                '✓ Odpowiadamy w 24h',
                '✓ 15 lat na rynku',
              ].map(badge => (
                <span key={badge} className="text-sm font-medium" style={{ color: 'rgba(255,255,255,.6)' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
