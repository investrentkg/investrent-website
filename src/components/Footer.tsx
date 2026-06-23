import Image from 'next/image'
import type { Office } from '@/types'

const LINKS = [
  { label: 'Polityka prywatności', href: '/polityka-prywatnosci' },
  { label: 'RODO',                href: '/rodo' },
  { label: 'Mapa strony',         href: '/sitemap.xml' },
  { label: 'Kontakt',             href: '#kontakt' },
]

export default function Footer({ office }: { office: Office | null }) {
  const name = office?.name ?? 'InvestRent Nieruchomości'

  return (
    <footer className="bg-navy py-8">
      <div className="container">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {office?.logo_url ? (
              <div className="bg-white rounded-lg px-2.5 py-1.5">
                <Image src={office.logo_url} alt={name} width={100} height={30}
                  className="h-7 w-auto object-contain" />
              </div>
            ) : null}
            <div>
              <div className="font-mont font-black text-[14px] text-white/90 tracking-wide">INVEST RENT</div>
              <div className="text-white/40 text-[10px] uppercase tracking-[1.5px] mt-0.5">nieruchomości · Kołobrzeg</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-5 flex-wrap justify-end">
              {LINKS.map(l => (
                <a key={l.label} href={l.href}
                  className="text-white/40 text-[12px] hover:text-white/80 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="text-white/30 text-[12px]">
              © {new Date().getFullYear()} {name} · Wszystkie prawa zastrzeżone
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
