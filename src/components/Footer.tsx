export default function Footer() {
  return (
    <footer style={{ background: '#0d2a5c', color: 'rgba(255,255,255,.6)' }}>
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                style={{ background: '#1a4fa0' }}>
                IR
              </div>
              <span className="font-extrabold text-lg text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Invest<span style={{ color: '#f5a623' }}>Rent</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Biuro nieruchomości w Kołobrzegu. Pomagamy Polakom i obcokrajowcom kupować,
              sprzedawać i wynajmować nieruchomości nad Bałtykiem.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Usługi</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {['Sprzedaż nieruchomości', 'Wynajem', 'Zakup', 'Wycena', 'Rynek pierwotny'].map(s => (
                <li key={s}><a href="#oferta" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Kontakt</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><a href="tel:+48731554341" className="hover:text-white">+48 731 554 341</a></li>
              <li><a href="mailto:biuro@investrent.com.pl" className="hover:text-white">biuro@investrent.com.pl</a></li>
              <li>78-100 Kołobrzeg</li>
              <li>Pon–Pt 9:00–18:00</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <span>© {new Date().getFullYear()} InvestRent Nieruchomości. Wszelkie prawa zastrzeżone.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Polityka prywatności</a>
            <a href="#" className="hover:text-white">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
