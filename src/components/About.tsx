import Image from 'next/image'
import { MapPin, ShieldCheck, Clock, Trophy } from 'lucide-react'

const POINTS = [
  { icon: MapPin, title: 'Lokalny ekspert', desc: 'Znamy każdą ulicę Kołobrzegu i okolic. Wiemy które lokalizacje zyskają na wartości.' },
  { icon: ShieldCheck, title: 'Bezpieczna transakcja', desc: 'Weryfikujemy stan prawny każdej nieruchomości. Zero niespodzianek po zakupie.' },
  { icon: Clock, title: 'Odpowiadamy do 60 minut', desc: 'Żadnego czekania. Kontaktujemy się z każdym klientem tego samego dnia.' },
]

export default function About() {
  return (
    <section id="o-nas" className="section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden">
            <Image src="/about.jpg" alt="Biuro nieruchomości InvestRent w Kołobrzegu"
              width={600} height={500} className="w-full h-[500px] object-cover" />
            <div className="absolute bottom-6 left-6 bg-white rounded-xl px-5 py-4 shadow-xl flex items-center gap-4">
              <div className="w-11 h-11 bg-gold rounded-[10px] flex items-center justify-center">
                <Trophy size={22} className="text-white" />
              </div>
              <div>
                <div className="font-mont font-black text-[16px] text-slate-900">Nr 1</div>
                <div className="text-[12px] text-slate-500">biuro nad Bałtykiem</div>
              </div>
            </div>
          </div>
          <div>
            <div className="tag bg-blue/8 text-blue mb-4">O nas</div>
            <h2 className="heading text-[32px] text-navy leading-[1.15] mb-4">
              Nieruchomości nad Bałtykiem — to nasza specjalność
            </h2>
            <p className="text-slate-500 text-[14px] leading-[1.8] mb-4">
              InvestRent to kołobrzeskie biuro nieruchomości z wieloletnim doświadczeniem na rynku
              nadmorskim. Doskonale znamy lokalne realia — od cen po prawne zawiłości rynku wakacyjnego.
            </p>
            <p className="text-slate-500 text-[14px] leading-[1.8] mb-6">
              Naszą misją jest przeprowadzenie klientów przez każdą transakcję bezpiecznie i bez stresu.
              Nie znikamy po podpisaniu umowy — jesteśmy do dyspozycji przez cały proces i długo po nim.
            </p>
            <div className="flex flex-col gap-4">
              {POINTS.map(pt => {
                const Icon = pt.icon
                return (
                  <div key={pt.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={15} className="text-blue" />
                    </div>
                    <div>
                      <strong className="text-[13px] font-bold text-navy block mb-0.5">{pt.title}</strong>
                      <span className="text-[12px] text-slate-500 leading-[1.6]">{pt.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
