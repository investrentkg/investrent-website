import { Search, DollarSign, KeyRound, Gavel, ArrowRight, Award, Phone } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

const SERVICES = [
  {
    icon: Search, title: 'Kupno nieruchomości',
    desc: 'Szukamy dla Ciebie nieruchomości dopasowanej do budżetu i oczekiwań. Cały proces od pierwszego oglądania po akt notarialny.',
    link: 'Sprawdź oferty', linkIcon: ArrowRight, href: '/oferty',
    bg: 'bg-blue/5', border: 'border-blue/15', iconBg: 'bg-blue', color: 'text-blue',
  },
  {
    icon: DollarSign, title: 'Sprzedaż nieruchomości',
    desc: 'Profesjonalne zdjęcia, ekspozycja na wszystkich portalach, aktywna sprzedaż. Sprzedajemy szybko i za dobrą cenę.',
    link: 'Bezpłatna wycena', linkIcon: Award, href: '/sprzedaz',
    bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-gold', color: 'text-amber-600',
  },
  {
    icon: KeyRound, title: 'Wynajem i zarządzanie',
    desc: 'Szukasz lokalu lub chcesz wynajmować bez stresu? Obsługujemy kompletnie — lokatorzy, umowy, rozliczenia, naprawy.',
    link: 'Sprawdź oferty', linkIcon: ArrowRight, href: '/wynajem',
    bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-500', color: 'text-emerald-600',
  },
  {
    icon: Gavel, title: 'Trudne nieruchomości i doradztwo',
    desc: 'Sprawy spadkowe, hipoteki, współwłasność. Pomagamy też z kredytami hipotecznymi i ubezpieczeniami.',
    link: 'Dowiedz się więcej', linkIcon: ArrowRight, href: '/trudne-nieruchomosci',
    bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-500', color: 'text-red-600',
  },
]

export default function Services() {
  return (
    <section id="uslugi" className="section section-alt">
      <div className="container">
        <div className="text-center mb-10">
          <div className="tag bg-blue/8 text-blue mb-3">Nasze usługi</div>
          <h2 className="heading text-[30px] text-navy mb-2.5">Kompleksowa obsługa nieruchomości</h2>
          <p className="text-slate-500 text-[14px] max-w-lg mx-auto leading-[1.75]">
            Od kupna po obsługę prawną — wszystko czego potrzebujesz w jednym miejscu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            const LinkIcon = s.linkIcon
            return (
              <ScrollReveal key={s.title} delay={i * 110}>
                <a href={s.href} style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                  className={`service-card group ${s.bg} border-[1.5px] ${s.border} rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}>
                  <div className={`w-12 h-12 ${s.iconBg} rounded-[13px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-mont font-extrabold text-[18px] text-navy mb-2.5 tracking-tight">{s.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-[1.75] mb-3.5">{s.desc}</p>
                  <span className={`text-[13px] font-bold ${s.color} flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1`}>
                    <LinkIcon size={14} /> {s.link}
                  </span>
                </a>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
