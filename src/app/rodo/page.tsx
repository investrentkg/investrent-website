import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import type { Metadata } from 'next'

// NAPRAWA (audyt SEO/tresci, Daniel 30.07.2026): strona calkowicie brakowala,
// mimo ze stopka (Footer.tsx) juz do niej linkowala - martwy link na zywo.
// Tresc PRZENIESIONA 1:1 ze starej strony (investrent.com.pl/rodo, platforma
// Virgo) - to nie jest wymyslona tresc, tylko realne dane firmy (NIP itd.)
// ktore juz tam byly opublikowane.

export const metadata: Metadata = {
  title: 'Polityka prywatności (RODO)',
  description: 'Informacja o przetwarzaniu danych osobowych zgodnie z RODO przez Investrent sp. z o.o.',
  // NAPRAWA (audyt SEO, Daniel 30.07.2026): strony czysto prawne (polityka
  // prywatnosci, regulamin) standardowo NIE sa indeksowane w wynikach
  // wyszukiwania - nie wnosza wartosci dla uzytkownika szukajacego "biuro
  // nieruchomosci Kolobrzeg" i moga rozmywac ocene jakosci tresci calej
  // domeny przez Google. follow:true zeby linki WYCHODZACE z tej strony
  // (np. do strony glownej) nadal przekazywaly wartosc.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.investrent.com.pl/rodo' },
}

const FALLBACK_OFFICE = {
  name: 'InvestRent', logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341', email: 'biuro@investrent.com.pl',
  website: null, working_hours: null,
}

export default async function RodoPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '32px 0 24px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Polityka prywatności' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: 'white', letterSpacing: '-1px', marginTop: 12 }}>
              Polityka prywatności
            </h1>
          </div>
        </div>

        <div style={{ background: 'white', padding: '48px 0 64px' }}>
          <div className="container" style={{ maxWidth: 780 }}>
            <div style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.85 }}>
              <p style={{ marginBottom: 20 }}>
                Informacja dotycząca przetwarzania danych osobowych (RODO). W Investrent sp. z o.o. priorytetem jest ochrona Państwa prywatności i danych osobowych. Poniżej przedstawiamy najważniejsze informacje dotyczące przetwarzania danych osobowych zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych (RODO).
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Administrator danych osobowych</h2>
              <p style={{ marginBottom: 20 }}>
                Administratorem Państwa danych osobowych jest Investrent sp. z o.o. z siedzibą w Kołobrzegu, przy ul. Ratuszowej 12/1 lok. 3, NIP: 671 185 85 59.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Cel i podstawa prawna przetwarzania danych</h2>
              <p style={{ marginBottom: 10 }}>Państwa dane osobowe są przetwarzane w celu:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li style={{ marginBottom: 8 }}>Realizacji usług związanych z obrotem nieruchomościami, zgodnie z zawartą umową (art. 6 ust. 1 lit. b RODO).</li>
                <li style={{ marginBottom: 8 }}>Spełnienia obowiązków prawnych ciążących na Administratorze (art. 6 ust. 1 lit. c RODO).</li>
                <li style={{ marginBottom: 8 }}>Realizacji prawnie uzasadnionych interesów Administratora, takich jak dochodzenie roszczeń lub obrona przed roszczeniami (art. 6 ust. 1 lit. f RODO).</li>
                <li>Przesyłania informacji handlowych i marketingowych, na podstawie udzielonej zgody (art. 6 ust. 1 lit. a RODO).</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Odbiorcy danych</h2>
              <p style={{ marginBottom: 10 }}>Państwa dane osobowe mogą być przekazywane:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li style={{ marginBottom: 8 }}>Podmiotom współpracującym z Administratorem w zakresie świadczenia usług nieruchomościowych.</li>
                <li style={{ marginBottom: 8 }}>Podmiotom przetwarzającym dane osobowe na zlecenie Administratora, np. dostawcom usług IT, kancelariom prawnym, firmom księgowym, przy czym takie podmioty przetwarzają dane na podstawie umowy z Administratorem i wyłącznie zgodnie z jego poleceniami.</li>
                <li>Organom uprawnionym do otrzymania danych na podstawie przepisów prawa.</li>
              </ul>

              {/* NAPRAWA (audyt prawny, Daniel 30.07.2026): brakujacy element wymagany
                  przez art. 13 ust. 2 lit. e RODO - czy podanie danych jest wymogiem
                  umownym/ustawowym i jakie sa konsekwencje niepodania. Byla to realna
                  luka w tresci skopiowanej ze starej strony. */}
              {/* NOWE (22.08.2026, przygotowanie do Meta App Review dla uprawnienia
                  leads_retrieval - recenzenci Meta konkretnie sprawdzaja czy polityka
                  prywatnosci jawnie opisuje obsluge danych z formularzy kontaktowych
                  Facebook/Instagram (Instant Forms), tego wczesniej brakowalo). */}
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Dane z formularzy kontaktowych Facebook i Instagram</h2>
              <p style={{ marginBottom: 20 }}>
                W ramach kampanii reklamowych prowadzonych na Facebooku i Instagramie korzystamy z formularzy kontaktowych (Instant Forms) udostępnianych przez Meta. Gdy wypełnią Państwo taki formularz, przekazane dane (imię i nazwisko, numer telefonu, adres e-mail oraz ewentualne odpowiedzi na pytania kwalifikujące) są automatycznie pobierane z systemów Meta do naszego wewnętrznego systemu CRM za pomocą oficjalnego interfejsu API Meta (Graph API), wyłącznie w celu skontaktowania się z Państwem w sprawie oferty nieruchomości, którą byli Państwo zainteresowani. Dostęp do tych danych w naszym systemie CRM mają wyłącznie upoważnieni pracownicy i współpracownicy Investrent sp. z o.o. Dane te podlegają tym samym zasadom przechowywania, ochrony i prawom osób, których dane dotyczą, opisanym w pozostałych częściach niniejszej polityki.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Dobrowolność podania danych</h2>
              <p style={{ marginBottom: 20 }}>
                Podanie danych osobowych jest dobrowolne, jednak niezbędne do skontaktowania się z Państwem, przygotowania oferty lub zawarcia i realizacji umowy pośrednictwa w obrocie nieruchomościami. Niepodanie danych może uniemożliwić realizację tych celów.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Zautomatyzowane podejmowanie decyzji</h2>
              <p style={{ marginBottom: 20 }}>
                Administrator nie podejmuje wobec Państwa decyzji w sposób zautomatyzowany, w tym nie stosuje profilowania w rozumieniu RODO.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Prawa osób, których dane dotyczą</h2>
              <p style={{ marginBottom: 10 }}>Zgodnie z RODO przysługuje Państwu:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li style={{ marginBottom: 8 }}>Prawo dostępu do swoich danych oraz otrzymania ich kopii.</li>
                <li style={{ marginBottom: 8 }}>Prawo do sprostowania (poprawiania) swoich danych.</li>
                <li style={{ marginBottom: 8 }}>Prawo do usunięcia danych, ograniczenia przetwarzania danych.</li>
                <li style={{ marginBottom: 8 }}>Prawo do wniesienia sprzeciwu wobec przetwarzania danych.</li>
                <li style={{ marginBottom: 8 }}>Prawo do przenoszenia danych.</li>
                <li style={{ marginBottom: 8 }}>Prawo do cofnięcia zgody na przetwarzanie danych w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem.</li>
                <li>Prawo do wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych.</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Okres przechowywania danych</h2>
              <p style={{ marginBottom: 20 }}>
                Państwa dane osobowe będą przechowywane przez okres niezbędny do realizacji celów przetwarzania, a po tym czasie przez okres oraz w zakresie wymaganym przez przepisy prawa lub dla zabezpieczenia ewentualnych roszczeń.
              </p>

              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 19, color: '#0d2a5c', marginTop: 32, marginBottom: 10 }}>Kontakt</h2>
              <p>
                W sprawach związanych z przetwarzaniem danych osobowych mogą Państwo skontaktować się z nami pisemnie na adres naszej siedziby: Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, lub mailowo pod adresem: <a href="mailto:biuro@investrent.com.pl" style={{ color: '#1a4fa0' }}>biuro@investrent.com.pl</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
      <SocialSidebar office={office} />
    </>
  )
}
