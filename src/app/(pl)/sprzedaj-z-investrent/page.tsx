import type { Metadata } from 'next'
import LeadForm from './LeadForm'

// Strona docelowa reklam Google Ads (sprzedaz/wycena). ROBOCZA: noindex,nofollow, poza sitemap, bez menu.
// Teksty NIEZATWIERDZONE (trojka + Marketing + Daniel); nie wdrazac przed 10/10 i slowem Daniela.
export const metadata: Metadata = {
  title: { absolute: 'Sprzedaż mieszkania lub domu w Kołobrzegu | InvestRent' },
  description: 'Sprzedaż lub wycena nieruchomości w Kołobrzegu. Zadzwoń lub zostaw numer, oddzwonimy w ciągu 24 godzin.',
  alternates: { canonical: 'https://www.investrent.com.pl/sprzedaj-z-investrent' },
  robots: { index: false, follow: false },
}

const PHONE_DISPLAY = '731 554 341'
const PHONE_HREF = 'tel:+48731554341'

export default function SprzedajZInvestRentPage() {
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 32px', fontFamily: 'var(--font-inter), system-ui, sans-serif', color: '#111827' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 }}>
        {/* Logo bez linku (strona bez wyjsc) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="InvestRent" height={32} style={{ height: 32, width: 'auto' }} />
        <a href={PHONE_HREF} data-phone-position="header" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', fontWeight: 700 }}>{PHONE_DISPLAY}</a>
      </header>

      <h1 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 26, lineHeight: 1.2, margin: '16px 0 8px' }}>
        Sprzedaż mieszkania lub domu w Kołobrzegu
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 16 }}>Zadzwoń lub zostaw numer, oddzwonimy w ciągu 24 godzin.</p>

      <a href={PHONE_HREF} data-phone-position="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 8, background: '#0b3d91', color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>
        Zadzwoń: {PHONE_DISPLAY}
      </a>

      <LeadForm />

      <section aria-label="Jak to wygląda" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20 }}>Jak to wygląda</h2>
        <ol style={{ paddingLeft: 20, lineHeight: 1.5 }}>
          <li>Dzwonisz albo zostawiasz numer. Oddzwania agent InvestRent.</li>
          <li>[tekst kroku 2 wg zatwierdzonej makiety]</li>
          <li>Wycena jest bezpłatna. Warunki ewentualnej umowy omawiamy osobno.</li>
        </ol>
      </section>

      <footer style={{ marginTop: 32, fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
        <p style={{ margin: 0 }}>Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg</p>
        <p style={{ margin: '4px 0 0' }}><a href="/rodo" target="_blank" rel="noopener noreferrer">Polityka prywatności</a></p>
      </footer>
    </main>
  )
}
