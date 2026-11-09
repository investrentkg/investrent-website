import Link from 'next/link'
import { Home, FileText, Handshake, Search, KeyRound, Building2, ShieldCheck, type LucideIcon } from 'lucide-react'
import { isCommercialHubOn } from '@/lib/commercialHub'
import { COMMERCIAL_PATH } from '@/content/komercyjne'

// Jedna rodzina usług na stronie głównej (makieta M3, 09.11.2026): zastępuje DWA osobne bloki
// ("Czego dziś szukasz?" 4 linki + "Nasze usługi" 4 karty + osobny kafel komercyjnych). Wszystkie
// dotychczasowe linki wewnętrzne zachowane jako zwykłe <a href> (bez JS): /sprzedaz, /wycena, /kupno,
// /mieszkania-na-sprzedaz-kolobrzeg, /oferty, /wynajem, /trudne-nieruchomosci (+ komercyjne przy fladze).
// H2 "Czego dziś szukasz?" oraz dotychczasowy H2 "Kompleksowa obsługa nieruchomości" (teraz w kafelku
// wprowadzającym) bez zmian treści. Kafel jest klikalny w całości (link główny rozciągnięty ::after),
// drugi link (np. "Sprawdź oferty") leży nad nim.

interface Tile {
  icon: LucideIcon
  title: string
  desc: string
  href: string
  action: string
  second?: { href: string; label: string }
}

const TILES: Tile[] = [
  { icon: Home, title: 'Sprzedaję nieruchomość', href: '/sprzedaz', action: 'Sprzedaj z InvestRent',
    desc: 'Profesjonalne zdjęcia, ekspozycja na wszystkich portalach, aktywna sprzedaż. Sprzedajemy szybko i za dobrą cenę.' },
  { icon: FileText, title: 'Chcę poznać wartość', href: '/wycena', action: 'Sprawdź wartość',
    desc: 'Orientacyjna wycena w kalkulatorze online, a potem bezpłatna wycena eksperta.' },
  { icon: Handshake, title: 'Kupuję nieruchomość', href: '/kupno', action: 'Jak wygląda zakup',
    desc: 'Szukamy dla Ciebie nieruchomości dopasowanej do budżetu i oczekiwań. Cały proces od pierwszego oglądania po akt notarialny.',
    second: { href: '/oferty', label: 'Sprawdź oferty' } },
  { icon: Search, title: 'Szukam oferty', href: '/mieszkania-na-sprzedaz-kolobrzeg', action: 'Zobacz mieszkania',
    desc: 'Aktualne mieszkania na sprzedaż w Kołobrzegu.' },
  { icon: KeyRound, title: 'Wynajem i zarządzanie', href: '/wynajem', action: 'Sprawdź oferty',
    desc: 'Szukasz lokalu lub chcesz wynajmować bez stresu? Obsługujemy kompletnie — lokatorzy, umowy, rozliczenia, naprawy.' },
]

const COMMERCIAL: Tile = { icon: Building2, title: 'Nieruchomości komercyjne', href: COMMERCIAL_PATH, action: 'Zobacz',
  desc: 'Działki, hale i magazyny, lokale usługowe i obiekty inwestycyjne. Sprzedaż oraz szukanie obiektu dla inwestora.' }

const HARD: Tile = { icon: ShieldCheck, title: 'Trudne nieruchomości i doradztwo', href: '/trudne-nieruchomosci', action: 'Dowiedz się więcej',
  desc: 'Sprawy spadkowe, hipoteki, współwłasność. Pomagamy też z kredytami hipotecznymi i ubezpieczeniami.' }

export default function HomeServices({ id = 'sciezki-home' }: { id?: string }) {
  const tiles = [...TILES, ...(isCommercialHubOn() ? [COMMERCIAL] : []), HARD]
  return (
    <section id="uslugi" className="container m3-fam" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="m3-h2">Czego dziś szukasz?</h2>
      <p className="lead">Wybierz swoją drogę — resztą zajmiemy się my.</p>
      <ul className="m3-tiles">
        <li className="m3-tile intro">
          <span className="kick">Nasze usługi</span>
          <h2>Kompleksowa obsługa nieruchomości</h2>
          <p>Od kupna po obsługę prawną — wszystko czego potrzebujesz w jednym miejscu.</p>
        </li>
        {tiles.map((t, idx) => {
          const Icon = t.icon
          // przy 7 kafelkach (bez komercyjnych) ostatni zajmuje 2 kolumny, żeby siatka 4-kolumnowa nie miała dziury
          const wide = idx === tiles.length - 1 && (tiles.length + 1) % 4 === 3
          return (
            <li key={t.href} className={wide ? 'm3-tile wide' : 'm3-tile'}>
              <Link href={t.href} className="main">
                <Icon className="ic" aria-hidden="true" strokeWidth={1.6} />
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="act">{t.action} →</span>
              </Link>
              {t.second && <Link href={t.second.href} className="sec">{t.second.label} →</Link>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
