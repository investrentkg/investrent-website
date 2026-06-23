import { BadgeCheck, Clock, ShieldCheck } from 'lucide-react'

export default function ValuationCTA() {
  return (
    <section className="relative overflow-hidden py-14" style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)' }}>
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full border border-white/5" />
      <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full border border-white/4" />
      <div className="container relative z-10">
        <div className="flex items-center justify-between gap-10 flex-wrap">
          <div className="max-w-xl">
            <div className="tag bg-gold/20 border border-gold/35 text-gold mb-5">
              <BadgeCheck size={13} /> Bezpłatna usługa · bez zobowiązań
            </div>
            <h2 className="heading text-[36px] text-white leading-[1.1] mb-4">
              Ile warta jest Twoja<br />nieruchomość?
            </h2>
            <p className="text-white/70 text-[15px] leading-[1.8] max-w-lg">
              Dowiedz się za darmo — bez wychodzenia z domu. Nasz ekspert przygotuje wycenę
              i skontaktuje się z Tobą do 24h. Żadnych ukrytych kosztów, żadnych zobowiązań.
            </p>
            <div className="flex gap-6 mt-5 flex-wrap">
              {[
                { icon: BadgeCheck, label: 'Bezpłatna, bez zobowiązań' },
                { icon: Clock,      label: 'Kontakt do 24h' },
                { icon: ShieldCheck,label: 'Rzetelna wycena eksperta' },
              ].map(p => {
                const Icon = p.icon
                return (
                  <div key={p.label} className="flex items-center gap-2">
                    <Icon size={16} className="text-gold" />
                    <span className="text-white/75 text-[13px]">{p.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <a href="#kontakt" className="btn-gold text-[16px] font-extrabold px-11 py-4">
              <BadgeCheck size={18} /> Chcę bezpłatną wycenę
            </a>
            <span className="text-white/40 text-[12px] text-center">
              Odpowiadamy do 60 minut · +48 731 554 341
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
