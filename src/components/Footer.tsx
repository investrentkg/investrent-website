import type { Office } from '@/types'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import FooterGroup from '@/components/FooterGroup'
import { isCommercialHubOn } from '@/lib/commercialHub'
import { COMMERCIAL_PATH } from '@/content/komercyjne'
import { LOCALITIES, HUB } from '@/content/miejscowosci'
import { formatPhoneDisplay, formatStreetDisplay } from '@/lib/napFormat'

const HOUSES_ICON = 'data:image/png;base64,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'

type L = { label: string; href: string }

// Stopka wg makiet M1 (desktop 1440) i M2 (mobile 390) z 09.11.2026. Wszystkie linki to zwykle <a href>
// renderowane od razu w HTML (takze w sekcjach zwinietych na mobile - <details> w HTML zawsze zawiera linki).
// Style: klasy .ft-* w globals.css.
const OFERTY: L[] = [
  { label: 'Mieszkania', href: '/mieszkania-na-sprzedaz-kolobrzeg' },
  { label: 'Domy', href: '/domy-na-sprzedaz-kolobrzeg' },
  { label: 'Działki', href: '/dzialki-na-sprzedaz-kolobrzeg' },
  // Komercyjne (Daniel 07.11.2026): tylko przy wlaczonej fladze.
  ...(isCommercialHubOn() ? [{ label: 'Nieruchomości komercyjne', href: COMMERCIAL_PATH }] : []),
  { label: 'Wynajem nieruchomości', href: '/wynajem' },
  { label: 'Nieruchomości Kołobrzeg', href: '/kolobrzeg' },
]
const USLUGI: L[] = [
  { label: 'Kupno', href: '/kupno' },
  { label: 'Sprzedaż', href: '/sprzedaz' },
  { label: 'Bezpłatna wycena', href: '/wycena' },
  { label: 'Zarządzanie najmem', href: '/zarzadzanie-najmem' },
  { label: 'Trudne nieruchomości', href: '/trudne-nieruchomosci' },
]
const BIURO: L[] = [
  { label: 'O nas', href: '/o-nas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kalkulator kredytowy', href: '/#kalkulator' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Mapa strony', href: '/sitemap.xml' },
]
// Okolice: z danych (zatwierdzone miejscowosci huba), bez twardo wpisanych nazw -
// dla innego biura zestaw bedzie inny (docelowo z CRM).
// Zestaw wg makiety M1 (konfiguracja stopki; docelowo per biuro z CRM).
const FOOTER_LOCALITY_SLUGS = ['ustronie-morskie']
const OKOLICE: L[] = [
  { label: 'Kołobrzeg', href: '/kolobrzeg' },
  ...LOCALITIES.filter(l => l.status === 'approved' && FOOTER_LOCALITY_SLUGS.includes(l.slug)).map(l => ({ label: l.name, href: `${HUB.path}/${l.slug}` })),
]
const DE_LINKS: L[] = [
  { label: 'Immobilien Kolberg (DE)', href: '/de/immobilien-kolberg' },
  { label: 'Datenschutz (DE)', href: '/de/datenschutz' },
  { label: 'Impressum (DE)', href: '/de/impressum' },
]

// Dane NAP: najpierw dane biura z API (jedno zrodlo prawdy), w razie braku ten sam
// fallback co w not-found.tsx / offerPageImpl.tsx.
const FALLBACK_NAP = { address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl' }
// Social: zawsze w stopce - dane biura, a gdy API zwroci pusto, te same adresy co na zywej stronie.
const FALLBACK_SOCIAL = { facebook: 'https://www.facebook.com/profile.php?id=61578147880836', instagram: 'https://www.instagram.com/invest.rent/' }
const OFFICE_NAME = 'InvestRent Nieruchomości'
// Godziny zgodne z openingHoursSpecification w src/lib/officeSchema.ts (Pn-Pt 08-16, Sob 10-15).
const HOURS = 'Pon–Pt 8:00–16:00, Sob 10:00–15:00'

function LinkList({ items }: { items: L[] }) {
  return (
    <ul className="ft-list">
      {items.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
    </ul>
  )
}

export default function Footer({ office }: { office: Office | null }) {
  const addr = office?.address || FALLBACK_NAP.address
  const [street, ...rest] = addr.split(/,\s*/)
  const phone = office?.phone || FALLBACK_NAP.phone
  const email = office?.email || FALLBACK_NAP.email
  const fbUrl = office?.facebook_url || FALLBACK_SOCIAL.facebook
  const igUrl = office?.instagram_url || FALLBACK_SOCIAL.instagram
  const telHref = 'tel:' + phone.replace(/[^+\d]/g, '')
  return (
    <footer className="ft">
      <div className="container">
        <div className="ft-cols">
          <div className="ft-brand">
            <div className="ft-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOUSES_ICON} alt="InvestRent" />
              <div><b>INVEST RENT</b><i>NIERUCHOMOŚCI</i></div>
            </div>
            <p className="ft-desc">Biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż, wynajem.</p>
            {/* Social: tylko gdy link ustawiony w Ustawieniach biura. Footer to Server Component -
                hover wylacznie przez CSS (.social-icon), bez handlerow zdarzen (naprawa 17.07.2026). */}
            {(
              <div className="ft-soc">
                {(
                  <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <span className="social-icon"><svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.7V14h2.7v8z"/></svg></span>Facebook
                  </a>
                )}
                {(
                  <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <span className="social-icon"><svg viewBox="0 0 24 24"><path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.3-3.2a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg></span>Instagram
                  </a>
                )}
              </div>
            )}
          </div>
          <FooterGroup title="Oferty" className="ft-oferty"><LinkList items={OFERTY} /></FooterGroup>
          <FooterGroup title="Usługi" className="ft-uslugi"><LinkList items={USLUGI} /></FooterGroup>
          {/* NAP - spojne z danymi w JSON-LD (officeSchema.ts) */}
          <address className="ft-kon">
            <h4>Kontakt</h4>
            <p>{OFFICE_NAME}<br />{formatStreetDisplay(street)}{rest.length > 0 && <><br />{rest.join(', ')}</>}</p>
            <p className="ft-ph"><a href={telHref}>{formatPhoneDisplay(phone)}</a></p>
            <p><a href={`mailto:${email}`}>{email}</a></p>
            <p>{HOURS}</p>
            <a className="ft-btn" href={telHref}>&#9742; Zadzwoń</a>
          </address>
        </div>
        <div className="ft-row ft-biuro"><h5>Biuro</h5>{BIURO.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}</div>
        <div className="ft-row ft-okolice"><h5>Okolice</h5>{OKOLICE.map(l => <a key={l.href + l.label} href={l.href}>{l.label}</a>)}</div>
        <div className="ft-bot">
          <div className="ft-co">
            © {new Date().getFullYear()} {OFFICE_NAME}
            {/* Dane rejestrowe spolki (odpis aktualny KRS, zgodne z /rodo i /de/datenschutz; 09.11.2026). Specyficzne dla InvestRent - przy sprzedazy CRM/strony innym biurom wynies do konfiguracji biura. */}
            <span className="ft-spolka">INVESTRENT sp.&nbsp;z&nbsp;o.o. · KRS&nbsp;0001069797 · NIP&nbsp;671&nbsp;185&nbsp;85&nbsp;59 · REGON&nbsp;526973936</span>
          </div>
          <div className="ft-r">
            <div>
              <a href="/rodo">Polityka prywatności (RODO)</a>
              <span aria-hidden="true" className="ft-dot">·</span>
              <CookieSettingsButton style={{ textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center', fontSize: 'inherit' }} />
            </div>
            {/* Linki dla odbiorcow z Niemiec (Meta Suchwünsche) */}
            <div className="ft-de">
              {DE_LINKS.map((l, i) => (
                <span key={l.href}>{i > 0 && <span aria-hidden="true" className="ft-dot">·</span>}<a href={l.href} hrefLang="de" lang="de">{l.label}</a></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
