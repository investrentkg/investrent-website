export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#0a1f4e' }}>
      <div className="container py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: '#1a4fa0', border: '2px solid rgba(245,166,35,.5)' }}>
                <span style={{ color: '#f5a623', fontFamily: 'Syne, sans-serif' }}>IR</span>
              </div>
              <span className="text-xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Invest<span style={{ color: '#f5a623' }}>Rent</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,.5)' }}>
              Biuro nieruchomości w Kołobrzegu. Pomagamy kupować, sprzedawać i wynajmować
              nieruchomości szybko, bezpiecznie i bez stresu od ponad 15 lat.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Instagram', 'Otodom'].map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.1)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,.4)' }}>
              Nawigacja
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '#oferta',      label: 'Nasze usługi' },
                { href: '#dlaczego-my', label: 'Dlaczego my' },
                { href: '#zespol',      label: 'Zespół' },
                { href: '#kontakt',     label: 'Kontakt' },
              ].map(link => (
                <a key={link.href} href={link.href}
                  className="text-sm no-underline transition-colors"
                  style={{ color: 'rgba(255,255,255,.5)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,.4)' }}>
              Kontakt
            </h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+48731554341" className="text-sm no-underline" style={{ color: 'rgba(255,255,255,.7)' }}>
                📞 +48 731 554 341
              </a>
              <a href="mailto:biuro@investrent.com.pl" className="text-sm no-underline" style={{ color: 'rgba(255,255,255,.7)' }}>
                ✉️ biuro@investrent.com.pl
              </a>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,.5)' }}>
                📍 Kołobrzeg, woj. zachodniopomorskie
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,.3)' }}>
                Pon–Pt: 9:00–17:00<br />Sob: 10:00–14:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,.3)' }}>
            © {currentYear} InvestRent Nieruchomości. Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,.2)' }}>
            Licencja pośrednika: nr xxxxxxxx
          </p>
        </div>
      </div>
    </footer>
  )
}
