export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d2a5c 0%, #1a4fa0 60%, #1e5bbf 100%)' }}>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full border border-white" />
        <div className="absolute top-40 right-40 w-64 h-64 rounded-full border border-white" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full border border-white" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(245,166,35,.15)', color: '#f5a623', border: '1px solid rgba(245,166,35,.3)' }}>
            🏖️ Nr 1 w Kołobrzegu i okolicach
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-1px' }}>
            Twoje wymarzone
            <span style={{ color: '#f5a623' }}> mieszkanie</span>
            <br />nad Bałtykiem
          </h1>

          <p className="text-xl text-white/75 mb-10 max-w-xl leading-relaxed">
            InvestRent to biuro nieruchomości z Kołobrzegu. Pomagamy kupować, sprzedawać
            i wynajmować nieruchomości szybko, bezpiecznie i bez stresu.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#kontakt"
              className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
              style={{ background: '#f5a623', boxShadow: '0 4px 20px rgba(245,166,35,.4)' }}>
              Skontaktuj się z nami
            </a>
            <a href="#oferta"
              className="px-8 py-4 rounded-xl font-bold text-white text-base border-2 transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,.3)' }}>
              Zobacz ofertę →
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { value: '500+', label: 'Transakcji' },
              { value: '15 lat', label: 'Na rynku' },
              { value: '98%', label: 'Zadowolonych klientów' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
