import { Star, ExternalLink } from 'lucide-react'

const REVIEWS = [
  {
    initials: 'MK', name: 'Marta Kowalczyk', date: 'styczeń 2026',
    text: 'Wspaniała obsługa od początku do końca. Daniel i Weronika przeprowadzili nas przez cały proces zakupu apartamentu — bezstresowo i sprawnie. Szczególnie doceniamy szybki kontakt i rzetelne informacje o stanie prawnym. Polecamy z całego serca!',
    bg: 'bg-gradient-to-br from-blue to-navy',
  },
  {
    initials: 'PT', name: 'Piotr Tomaszewski', date: 'listopad 2025',
    text: 'Sprzedaliśmy mieszkanie w 3 tygodnie! Zdjęcia profesjonalne, oferta na portalach w dobie. Cena transakcyjna wyższa niż się spodziewałem. Odpowiedź w ciągu godziny — to naprawdę działa!',
    bg: 'bg-gradient-to-br from-gold to-amber-500',
  },
  {
    initials: 'AN', name: 'Anna Nowak-Wróbel', date: 'wrzesień 2025',
    text: 'Szukałam apartamentu inwestycyjnego pod wynajem. InvestRent znalazło idealne miejsce i zajęło się całą obsługą wynajmu. Teraz zarabiam na apartamencie nie martwiąc się o lokatorów. Szczerze polecam!',
    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
  },
]

export default function Reviews() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-10">
          <div className="tag bg-amber-100 text-amber-800 mb-3">
            <Star size={12} fill="currentColor" /> Opinie klientów
          </div>
          <h2 className="heading text-[30px] text-navy mb-2.5">Co mówią o nas klienci?</h2>
          <p className="text-slate-500 text-[14px] max-w-lg mx-auto">
            Ponad 120 opinii na Google — sprawdź co piszą osoby, które nam zaufały.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(r => (
            <div key={r.name} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full ${r.bg} flex items-center justify-center font-mont font-bold text-[15px] text-white flex-shrink-0`}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-slate-900">{r.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{r.date}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-gold" fill="#f5a623" />)}
              </div>
              <p className="text-[13px] text-slate-500 leading-[1.75]">{r.text}</p>
              <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 w-fit">
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-[11px] font-semibold text-slate-500">Zweryfikowana opinia Google</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 pt-7 border-t border-slate-200">
          <div className="font-mont font-black text-[52px] text-navy leading-none mb-1.5">4.9</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={22} className="text-gold" fill="#f5a623" />)}
          </div>
          <p className="text-[14px] text-slate-500">
            Na podstawie 127 opinii w Google &nbsp;·&nbsp;
            <a href="https://www.google.com/maps/place/Invest+Rent+Nieruchomo%C5%9Bci/@54.1770073,15.5744432,17z/#reviews" target="_blank" rel="noopener"
              className="text-blue font-semibold inline-flex items-center gap-1 hover:underline">
              Zobacz wszystkie <ExternalLink size={13} />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
