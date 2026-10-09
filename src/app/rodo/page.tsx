import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { H2, H3, P, UL, LI } from '@/components/legal/LegalShell'
import { getOffice } from '@/lib/api'
import { RETENTION_A_ITEMS } from '@/app/wycena/texts'
import type { Metadata } from 'next'

// NAPRAWA (audyt SEO/tresci, Daniel 30.07.2026): strona calkowicie brakowala,
// mimo ze stopka (Footer.tsx) juz do niej linkowala - martwy link na zywo.
// Tresc PRZENIESIONA 1:1 ze starej strony (investrent.com.pl/rodo, platforma
// Virgo) - to nie jest wymyslona tresc, tylko realne dane firmy (NIP itd.)
// ktore juz tam byly opublikowane.
//
// AKTUALIZACJA 25.09.2026 (przeglad prawny, uwaga 25): dopisano dostawcow (Vercel,
// Railway, Supabase, Brevo, Anthropic, Cloudflare, Meta, Google), kalkulator wyceny
// AI, Cloudflare Turnstile, zgody per kanal, kontakt handlowy, transfery, okresy
// przechowywania, art. 21 ust. 4, klauzule wersji jezykowej. Fakty MUSZA byc zgodne
// z /de/datenschutz (wersja wiazaca dla uzytkownikow z DE) - zmieniac obie wersje
// razem.
// FINALNY TEKST (26.09.2026): usuniete wszystkie placeholdery; tekst opisuje wylacznie to, co
// dziala albo jest warunkiem startu kalkulatora (bez obietnic ponad praktyke).
// Dane spolki z odpisu KRS/VIES z 25.09.2026 - do weryfikacji przed publikacja.

// STAN NA (jedno miejsce): data ma byc zaktualizowana w dniu faktycznego wdrozenia na produkcje.
const POLICY_DATE = '09.10.2026'

// PRZELACZNIK OKRESOW KALKULATORA (wydanie 28.09.2026): true = wariant A (okresy 12/24 mies.), false = wariant B (ogolny: "nie dluzej niz konieczne").
// MUSI byc zgodny z RETENTION_VARIANT_A w src/app/wycena/texts.ts (oba naraz: klauzula w kalkulatorze i /rodo musza mowic to samo).
// Tresc wariantu A jest w JEDNYM miejscu: RETENTION_A_ITEMS w src/app/wycena/texts.ts (czas terazniejszy/przyszly zalezy tam od RETENTION_JOB_ACTIVE).
const RETENTION_CALCULATOR_ACTIVE = true

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
  // hreflang: niemiecka wersja (dodane 25.09.2026)
  alternates: {
    canonical: 'https://www.investrent.com.pl/rodo',
    languages: {
      pl: 'https://www.investrent.com.pl/rodo',
      de: 'https://www.investrent.com.pl/de/datenschutz',
    },
  },
}

const FALLBACK_OFFICE = {
  name: 'InvestRent Nieruchomości', logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341', email: 'biuro@investrent.com.pl',
  website: null, working_hours: null,
}

const link = { color: '#1a4fa0' }

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
              <P>
                Informacja dotycząca przetwarzania danych osobowych (RODO). W Investrent sp. z o.o. priorytetem jest ochrona Państwa prywatności i danych osobowych. Poniżej przedstawiamy najważniejsze informacje dotyczące przetwarzania danych osobowych zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych (RODO).
              </P>

              <P>
                Nasze usługi pośrednictwa dotyczą nieruchomości w Rzeczypospolitej Polskiej i są świadczone z Polski. Kontaktujemy się z Państwem zasadniczo wyłącznie na Państwa zapytanie lub za Państwa zgodą. Wyjątkiem są osoby, które same wystawiły ogłoszenie o sprzedaży nieruchomości na portalu: do nich czasem dzwonimy (patrz część „Dane z publicznych ogłoszeń o nieruchomościach”). Wiadomości marketingowych SMS-em, e-mailem ani przez komunikator bez Państwa zgody nie wysyłamy.
              </P>

              <H2>Administrator danych osobowych</H2>
              <P>
                Administratorem Państwa danych osobowych jest Investrent sp. z o.o. (INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ) z siedzibą w Kołobrzegu, przy ul. Ratuszowej 12/1 lok. 3, 78-100 Kołobrzeg, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0001069797, NIP: 671 185 85 59, REGON: 526973936. Działamy pod marką InvestRent.
                {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacją */}
              </P>
              <P>
                Kontakt w sprawach ochrony danych: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>, tel. +48 731 554 341. Nie powołaliśmy inspektora ochrony danych; w sprawach danych osobowych można kontaktować się z nami pod powyższymi adresami.
                {/* Wariant, gdy Daniel powola IOD: "Inspektorem ochrony danych jest [imie i nazwisko], kontakt: [e-mail]." (spojnie z /de/datenschutz sekcja 1). */}
              </P>

              <H2>Cel i podstawa prawna przetwarzania danych</H2>
              <P>Państwa dane osobowe są przetwarzane w celu:</P>
              <UL>
                <LI>Realizacji usług związanych z obrotem nieruchomościami, zgodnie z zawartą umową lub w celu podjęcia działań przed jej zawarciem na Państwa żądanie (art. 6 ust. 1 lit. b RODO).</LI>
                <LI>Obliczenia szacunku wyceny w kalkulatorze (art. 6 ust. 1 lit. b RODO), telefonu w sprawie wyceny (art. 6 ust. 1 lit. a RODO – zgoda), rozmów o współpracy na Państwa prośbę i umowy (art. 6 ust. 1 lit. b RODO) oraz zabezpieczenia formularza i limitu zapytań (art. 6 ust. 1 lit. f RODO).</LI>
                <LI>Kontaktu z osobami, które opublikowały ogłoszenie o nieruchomości na portalu, w sprawie ogłoszonej nieruchomości (art. 6 ust. 1 lit. f RODO; patrz część „Dane z publicznych ogłoszeń o nieruchomościach”).</LI>
                <LI>Spełnienia obowiązków prawnych ciążących na Administratorze, w szczególności wynikających z przepisów podatkowych i rachunkowych oraz przepisów o przeciwdziałaniu praniu pieniędzy (art. 6 ust. 1 lit. c RODO).</LI>
                <LI>Realizacji prawnie uzasadnionych interesów Administratora, takich jak dochodzenie roszczeń lub obrona przed roszczeniami oraz ochrona przed nadużyciami i zautomatyzowanymi wejściami (art. 6 ust. 1 lit. f RODO).</LI>
                <LI>Przesyłania informacji handlowych i marketingowych, na podstawie udzielonej zgody (art. 6 ust. 1 lit. a RODO).</LI>
              </UL>

              <H2>Hosting i techniczne udostępnianie strony</H2>
              <P>
                Strona jest hostowana u Vercel Inc. (USA). Przy każdym wejściu na stronę dostawca hostingu przetwarza niezbędne dane techniczne połączenia (adres IP, data i godzina, odwiedzana podstrona, typ przeglądarki), aby dostarczyć stronę i zapewnić jej bezpieczeństwo (art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes w bezpiecznym i stabilnym działaniu strony). Dostawca hostingu strony (Vercel) przechowuje takie dzienniki według własnych zasad i okresów; dzienniki żądań do interfejsu API naszego systemu przechowuje Railway do 30 dni, a w samej naszej aplikacji adres IP wykorzystujemy krótkotrwale, dla limitu zapytań kalkulatora. Interfejs API naszego systemu CRM działa na Railway Corp., a baza danych na Supabase Inc.; baza danych znajduje się w regionie UE Irlandia (Supabase, eu-west-1), API działa w regionie UE Holandia (Railway, europe-west4), a funkcje strony działają u Vercel we Frankfurcie (fra1); treści statyczne są dostarczane przez sieć Vercel. Z Vercel, Railway i Supabase obowiązują umowy powierzenia przetwarzania danych (art. 28 RODO), czyli umowy, na mocy których dostawca przetwarza dane wyłącznie na nasze polecenie. Warunki przetwarzania danych (DPA) są dostępne pod adresami: <a href="https://vercel.com/legal/dpa" target="_blank" rel="noopener noreferrer" style={link}>Vercel</a>, <a href="https://railway.com/legal/dpa" target="_blank" rel="noopener noreferrer" style={link}>Railway</a> i <a href="https://supabase.com/legal/dpa" target="_blank" rel="noopener noreferrer" style={link}>Supabase</a>. {/* Linki DPA (zrodla odczytane 25.09.2026, _wspolne_pliki\dostawcy_dpa_zrodla_2026_09_25.md). Warunek publikacji wg Prawnika 28.09: potwierdzic w panelu, ze Vercel nadal jest na planie Pro (zdanie o obowiazujacych umowach powierzenia). */} Informacje o przekazywaniu danych do państw trzecich znajdują się w części „Przekazywanie danych do państw trzecich”.
              </P>
              {/* Potwierdzic DevTools w dniu wdrozenia: brak polaczen do google/youtube/vimeo przed kliknieciem, bez zgody brak cookies analitycznych/marketingowych (GA4 i atrybucja UTM dopiero po zgodzie z banera, website#35/#42); sessionStorage: ir_launcher_hints (ChatWidget). */}
              <H3>Treści osadzone od podmiotów trzecich (dwuklik)</H3>
              <P>
                Na wybranych podstronach mogą być osadzone treści podmiotów trzecich: na stronach „Kontakt”, „O nas” i na stronach ofert mapa Google Maps (Google Ireland Limited), a na stronach ofert – jeśli dla oferty dodano wideo – filmy z YouTube (Google Ireland Limited) lub Vimeo. Treści te ładują się dopiero po kliknięciu przycisku „Załaduj mapę” lub „Załaduj wideo”; wcześniej nie ma połączenia z serwerami tych dostawców. Klikając, łączą się Państwo z serwerami danego dostawcy, który przetwarza Państwa adres IP i może zapisywać lub odczytywać informacje (np. pliki cookies) na Państwa urządzeniu; zgodę wyrażają Państwo kliknięciem (art. 6 ust. 1 lit. a RODO) i mogą ją zakończyć, odświeżając stronę. Filmy z YouTube ładujemy w trybie rozszerzonej prywatności (youtube-nocookie.com). Państwa wybór jest przechowywany wyłącznie w pamięci bieżącej strony, bez plików cookies i pamięci lokalnej przeglądarki; po odświeżeniu strony potrzebne jest ponowne kliknięcie. Dodatkowo linkujemy „Otwórz w Mapach Google” jako zwykły link: dopiero po jego kliknięciu opuszczają Państwo naszą stronę.
              </P>
              <P>
                Zdjęcia ofert i pracowników oraz obrazy w wpisach blogowych są ładowane z magazynu naszego dostawcy bazy danych (Supabase Storage; art. 6 ust. 1 lit. f RODO); pojedyncze zdjęcia stockowe z Unsplash są dostarczane przez naszego dostawcę hostingu Vercel, więc Państwa przeglądarka nie łączy się w tym celu z Unsplash. Opinie Google pokazujemy bez zdjęć profilowych. Używane przez nas czcionki są serwowane z naszego własnego serwera. Okno czatu zapamiętuje jedynie w pamięci sesji przeglądarki (do zamknięcia karty), czy wyświetliliśmy już podpowiedź, bez danych osobowych.
              </P>
              {/* COOKIES (09.10.2026): tekst Prawnika (jedyna zmiana: zdanie o liscie cookies w panelu zastapione opisem kategorii - decyzja Dyrektora 09.10, listy jeszcze nie ma) - _wspolne_pliki\prawnik_baner_zgod_cookies_PL_DE_2026_10_09.md pkt 6 (PL). Usunieto zdanie "My sami nie stosujemy na stronie plikow cookies ani trwalej pamieci lokalnej" - nieprawdziwe (GA4 po zgodzie, ir_consent). Zmieniac razem z /de/datenschutz (sekcja 3). */}
              <H3>Pliki cookie i podobne technologie</H3>
              <P>
                Nasza strona korzysta z plików cookie oraz podobnych technologii przechowywania informacji w Państwa urządzeniu. Dzielimy je na trzy kategorie:
              </P>
              <UL>
                <LI><strong>Niezbędne</strong> — konieczne do prawidłowego działania strony (np. zapamiętanie Państwa wyboru w banerze zgód). Nie wymagają zgody.</LI>
                <LI><strong>Analityczne</strong> — pomagają nam zrozumieć, jak korzystają Państwo ze strony (np. Google Analytics 4). Uruchamiane wyłącznie po wyrażeniu zgody.</LI>
                <LI><strong>Marketingowe</strong> — pozwalają mierzyć skuteczność naszych kampanii reklamowych. Uruchamiane wyłącznie po wyrażeniu zgody. Jeśli wyrazili Państwo zgodę na kategorię Marketingowe, informacja o kampanii, z której Państwo przyszli (parametry UTM oraz znacznik wejścia z linku reklamowego Facebooka), może zostać dołączona do wysłanego przez Państwa zgłoszenia, wyłącznie w celu oceny skuteczności naszych kampanii; sama ta informacja nie zawiera Państwa danych osobowych.</LI>
              </UL>
              <P>
                Zgodę mogą Państwo wyrazić, odrzucić lub dostosować przy pierwszej wizycie na stronie w banerze zgód, a także w dowolnym momencie później poprzez zmianę ustawień. Wybór jest zapamiętywany przez 12 miesięcy, po czym poprosimy o niego ponownie. Opis poszczególnych kategorii dostępny jest w panelu zgód.
              </P>

              <H2>Zapytania z formularzy, prośby o kontakt i czat na stronie</H2>
              <P>
                Gdy kontaktują się Państwo z nami przez formularz na stronie (np. formularz kontaktowy, prośba o telefon, zapytanie o ofertę) lub czat, przetwarzamy wpisane dane (np. imię i nazwisko, numer telefonu, adres e-mail, treść wiadomości, odniesienie do oferty), aby obsłużyć zapytanie i się z Państwem skontaktować. Podstawą jest art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) lub art. 6 ust. 1 lit. f RODO (obsługa zapytań). Dane zapisujemy w wewnętrznym systemie CRM; dostęp mają wyłącznie upoważnieni pracownicy Investrent sp. z o.o. oraz – w zakresie niezbędnym dla zapytania – odbiorcy wskazani w części „Odbiorcy danych”. Czat na stronie jest formularzem wiadomości: wiadomość obsługują nasi pracownicy, nie działa tam chatbot AI.
              </P>

              <H2>Wycena nieruchomości (kalkulator wspierany przez AI)</H2>
              <P>
                Gdy korzystają Państwo z kalkulatora wyceny, przetwarzamy wpisane dane nieruchomości (miejscowość i dzielnica wybierane z listy, rodzaj, powierzchnia, liczba pokoi, piętro, stan). Do obliczenia szacunku korzystamy z usług sztucznej inteligencji dostawcy Anthropic, PBC (USA), na warunkach korzystania z jego interfejsu API; przekazujemy tam dane nieruchomości, bez Państwa danych kontaktowych i adresu IP. Anthropic przetwarza te dane w naszym imieniu jako podmiot przetwarzający (art. 28 RODO). Według warunków API dostawcy dane przekazane przez API nie są domyślnie wykorzystywane do trenowania jego modeli, a dostawca usuwa dane wejściowe i wyniki przekazane przez API w ciągu 30 dni, z wyjątkami przewidzianymi w tych warunkach. Dane rynkowe w kalkulatorze publicznym pobieramy od Cenogram (Arena Paweł Nguyen, Warszawa, Polska; rejestr cen transakcyjnych); do Cenogram trafiają parametry nieruchomości (rodzaj, miejscowość, dzielnica, powierzchnia), bez danych kontaktowych i adresu IP. Podstawą obliczenia jest art. 6 ust. 1 lit. b RODO (realizacja Państwa żądania). W celu ochrony przed nadużyciami i ograniczania liczby zapytań wykorzystujemy adres IP krótkotrwale; dzienniki żądań Railway mogą zawierać adres IP do 30 dni, a Vercel i Cloudflare przetwarzają go w swoich dziennikach według własnych zasad (art. 6 ust. 1 lit. f RODO). Jeśli dodatkowo zostawią Państwo numer telefonu, aby konsultant do Państwa oddzwonił, przetwarzamy imię, numer telefonu, dane nieruchomości i wynik w naszym systemie CRM (art. 6 ust. 1 lit. a RODO – zgoda na telefon w sprawie wyceny).
              </P>
              <P>
                Kalkulator wyceny jest dostępny obecnie tylko w języku polskim. Przy prośbie o oddzwonienie w kalkulatorze jest jedno pole wyboru, które zaznaczają Państwo samodzielnie (niezaznaczone domyślnie):
              </P>
              <UL>
                <LI>Zgoda na telefon w sprawie wyceny nieruchomości (art. 6 ust. 1 lit. a RODO) jest wymagana, abyśmy mogli zadzwonić pod podany numer. Obejmuje wyłącznie kontakt telefoniczny, nie SMS, komunikatory ani e-mail z naszej inicjatywy.</LI>
                <LI>Kalkulator nie zbiera zgody na marketing.</LI>
                <LI>Przyjmujemy cofnięcie zgody pod adresem <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>. Po cofnięciu nie zadzwonimy do Państwa w sprawie wyceny.</LI>
                <LI>Zapisujemy dowód zgody: wersję zgody, kanał (telefon w sprawie wyceny) i czas (art. 6 ust. 1 lit. f RODO w związku z art. 7 ust. 1 RODO).</LI>
                <LI>Jeśli sami poproszą Państwo o rozmowy o współpracy albo dojdzie do zawarcia umowy, przetwarzamy dane w tym celu na podstawie art. 6 ust. 1 lit. b RODO (działania na Państwa żądanie przed zawarciem umowy i jej wykonanie), a w zakresie wynikającym z przepisów także art. 6 ust. 1 lit. c RODO.</LI>
              </UL>
              <P>
                Wynik jest wyraźnie orientacyjny; nie stanowi operatu szacunkowego ani wyceny w rozumieniu przepisów. Nie podejmujemy decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu w rozumieniu art. 22 RODO, wywołujących wobec Państwa skutki prawne lub w podobny sposób istotnie na Państwa wpływających: z wyniku nie wynikają zawarcie umowy, ustalenie ceny ani odmowa; dalszą obsługę zawsze prowadzą nasi pracownicy.
              </P>

              <H2>Ochrona przed automatycznymi wejściami (Cloudflare Turnstile)</H2>
              <P>
                Na stronie kalkulatora wyceny chronimy formularz przed spamem i automatycznymi wejściami (botami) za pomocą usługi „Cloudflare Turnstile” firmy Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Skrypt Turnstile jest pobierany z serwerów Cloudflare (challenges.cloudflare.com) dopiero po wejściu na stronę kalkulatora; na pozostałych podstronach nie jest ładowany. Usługa działa w tle i staje się widoczna dla Państwa tylko wtedy, gdy Cloudflare wymaga interakcji. Do Cloudflare przekazywane są dane techniczne: adres IP, odcisk połączenia TLS, nagłówek User-Agent (informacje o przeglądarce i urządzeniu), klucz witryny wraz z adresem strony oraz cechy interakcji i tam analizowane w celu sprawdzenia, czy zapytanie pochodzi od człowieka. Wynik weryfikacji (token) jest przesyłany wraz z zapytaniem do naszego systemu i tam weryfikowany w Cloudflare. Cloudflare przetwarza te dane w naszym imieniu jako podmiot przetwarzający; część sygnałów Cloudflare może wykorzystywać we własnym prawnie uzasadnionym interesie do doskonalenia wykrywania botów (zgodnie ze swoimi zasadami, patrz linki poniżej). My sami nie ustawiamy w tym celu plików cookies. Według dokumentacji dostawcy Turnstile przetwarza dane potrzebne do weryfikacji i nie odczytuje treści wpisywanych w formularzu; o ewentualnym zapisywaniu informacji na urządzeniu w ramach weryfikacji informuje Cloudflare w swoich zasadach (<a href="https://www.cloudflare.com/cookie-policy/" target="_blank" rel="noopener noreferrer" style={link}>polityka cookies Cloudflare</a>). Więcej informacji: <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" style={link}>polityka prywatności Cloudflare Turnstile</a> oraz <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" target="_blank" rel="noopener noreferrer" style={link}>warunki przetwarzania danych Cloudflare (DPA)</a>. {/* Linki Cloudflare (Turnstile Privacy Addendum, odczyt 25.09.2026). */} Podstawą jest art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes w bezpieczeństwie systemów i ochronie przed nadużyciami). Przekazanie do USA opiera się na zasadach opisanych w części „Przekazywanie danych do państw trzecich”.
              </P>

              {/* NAPRAWA (audyt prawny, Daniel 30.07.2026): brakujacy element wymagany
                  przez art. 13 ust. 2 lit. e RODO - czy podanie danych jest wymogiem
                  umownym/ustawowym i jakie sa konsekwencje niepodania. Byla to realna
                  luka w tresci skopiowanej ze starej strony. */}
              {/* NOWE (22.08.2026, przygotowanie do Meta App Review dla uprawnienia
                  leads_retrieval - recenzenci Meta konkretnie sprawdzaja czy polityka
                  prywatnosci jawnie opisuje obsluge danych z formularzy kontaktowych
                  Facebook/Instagram (Instant Forms), tego wczesniej brakowalo). */}
              <H2>Dane z formularzy kontaktowych Facebook i Instagram</H2>
              <P>
                W ramach kampanii reklamowych prowadzonych na Facebooku i Instagramie korzystamy z formularzy kontaktowych (Instant Forms) udostępnianych przez Meta. Gdy wypełnią Państwo taki formularz, przekazane dane (imię i nazwisko, adres e-mail oraz ewentualne odpowiedzi na pytania kwalifikujące) trafiają najpierw do Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irlandia (i ewentualnie innych podmiotów Meta), a stamtąd są automatycznie pobierane do naszego wewnętrznego systemu CRM za pomocą oficjalnego interfejsu API Meta (Graph API), wyłącznie w celu skontaktowania się z Państwem w sprawie oferty nieruchomości, którą byli Państwo zainteresowani. Dostęp do tych danych w naszym systemie CRM mają wyłącznie upoważnieni pracownicy Investrent sp. z o.o. oraz – w zakresie niezbędnym dla zapytania – odbiorcy wskazani w części „Odbiorcy danych”. Dane te podlegają tym samym zasadom przechowywania, ochrony i prawom osób, których dane dotyczą, opisanym w pozostałych częściach niniejszej polityki.
              </P>
              <P>
                Podstawą obsługi Państwa zapytania jest art. 6 ust. 1 lit. b RODO; do ofert, które zamawiają Państwo przez nasz formularz, odnosi się kolejny akapit. Na marketing przez e-mail wykraczający poza zamówione oferty prosimy o odrębną, wyraźną zgodę (art. 6 ust. 1 lit. a RODO). W formularzach, które zawierają w tym celu osobne, opcjonalne pole (kontakt e-mail), udzielają Państwo tej zgody przez jego aktywne zaznaczenie; jest ona dobrowolna i niewymagana do obsługi zapytania. Jeśli dodatkowo podadzą Państwo numer telefonu i aktywnie zaznaczą przewidziane do tego celu pole, możemy kontaktować się z Państwem pod tym numerem także telefonicznie, SMS-em lub przez WhatsApp w sprawie Państwa zapytania (art. 6 ust. 1 lit. a RODO). Ta zgoda jest dobrowolna i niewymagana do obsługi zapytania. Przy kontakcie przez WhatsApp dane przetwarza Meta Platforms Ireland Limited w ramach usługi WhatsApp Business jako nasz podmiot przetwarzający (szczegóły w części „Odbiorcy danych”). Numer telefonu i dowód tej zgody przechowujemy tak długo, jak jest to konieczne do obsługi Państwa zapytania. Jeśli podadzą Państwo numer telefonu bez zaznaczenia tego pola, kontaktujemy się z Państwem wyłącznie e-mailem. Na potrzeby wykazania zgody lub zamówienia ofert zapisujemy identyfikator zgłoszenia formularza (leadgen_id), identyfikator formularza, czas zgłoszenia i wersję formularza (art. 7 ust. 1 RODO). {/* Dowod zgody z importu Meta zweryfikowany w kodzie CRM origin/main 25.09.2026 (PR #472, consentRules.ts/metaLeadsImport.ts); zakres ostrozny; nie potwierdzono na zywym wpisie. Numer telefonu usuniety z listy pol formularza Meta (brak pola telefonu - potwierdzic liste pol). */}Zgodę można w każdej chwili cofnąć ze skutkiem na przyszłość. Meta udostępnia nam dane zebrane w formularzu do pobrania i w tym zakresie przetwarza je jako nasz podmiot przetwarzający, zgodnie z warunkami przetwarzania danych Meta; przy wyświetlaniu reklam Meta przetwarza dane we własnym imieniu lub na podstawie Controller Addendum (<a href="https://www.facebook.com/legal/controller_addendum" style={link} target="_blank" rel="noopener noreferrer">facebook.com/legal/controller_addendum</a>). Obowiązują informacje o prywatności Meta (<a href="https://www.facebook.com/privacy/policy" style={link} target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>).
              </P>
              <P>
                Jeśli za pośrednictwem naszego formularza kontaktowego Meta dla polskiego wybrzeża Bałtyku (m.in. Kołobrzeg, Mielno, Międzyzdroje) zamówią Państwo dopasowane oferty nieruchomości e-mailem, przetwarzamy podane dane (m.in. imię, adres e-mail, preferowaną lokalizację, budżet, metraż), aby obsłużyć zapytanie i przesłać zamówione oferty. Podstawą prawną jest art. 6 ust. 1 lit. b RODO (działania podjęte na Państwa żądanie przed zawarciem umowy) — nie jest do tego wymagana odrębna zgoda marketingowa. Wysyłamy wyłącznie oferty zgodne z podanymi w formularzu kryteriami, co do zasady w ciągu 30 dni od zgłoszenia; po tym okresie kolejne oferty wysyłamy wyłącznie za odrębną zgodą lub na nowe żądanie z Państwa strony. Mogą Państwo w każdej chwili sprzeciwić się dalszemu kontaktowi, np. odpowiadając na naszą wiadomość lub pisząc na biuro@investrent.com.pl; każda wiadomość zawiera odpowiednią informację. Dowód zgłoszenia (treść formularza, znacznik czasu, wersja formularza) przechowujemy do 3 lat, aby móc wykazać zgodność z prawem naszego kontaktu.
                {/* WARIANT A (06.10.2026, RP): tekst Prawnika (jedyna zmiana: zdanie o liscie cookies w panelu zastapione opisem kategorii - decyzja Dyrektora 09.10, listy jeszcze nie ma) - _wspolne_pliki\prawnik_wdrozenie_wariant_a_finalne_2026_10_06.md sekc. 1 (PL). Adaptacja zakresu "dla Kolobrzegu" -> region wg prawnik_wariant_a_region_nadmorski_2026_10_06.md; poczatek zdania ("formularza kontaktowego Meta dla polskiego wybrzeza Baltyku (m.in. ...) zamowia Panstwo") wg prawnik_review_pr39_diff_pelny_2026_10_06.md pkt 2 (bez podwojnego nawiasu) - zatwierdzone przez Prawnika. Tresc MUSI byc zgodna z naglowkiem i checkboxem zywego formularza Meta v5/v5b; numer/data wersji polityki (POLICY_DATE) NIE zmieniane. */}
              </P>

              <H2>Zasady kontaktu z Państwem</H2>
              <P>
                Wiadomości marketingowe e-mail wysyłamy, gdy mamy do tego podstawę prawną, w szczególności Państwa zgodę, np. wyrażoną w opcjonalnym polu formularza na Facebooku lub Instagramie (patrz część o tych formularzach); oferty, które zamawiają Państwo przez nasz formularz, wysyłamy na Państwa żądanie (art. 6 ust. 1 lit. b RODO, patrz ta sama część). Kalkulator wyceny nie zbiera zgód marketingowych i nie służy do marketingu; telefon do osoby, która zostawiła numer w kalkulatorze, dotyczy wyłącznie jej wyceny nieruchomości. Kontakty z osobami, które ogłaszają nieruchomości na portalach, opisujemy w części „Dane z publicznych ogłoszeń o nieruchomościach”. Marketingu przez komunikator (np. WhatsApp) nie prowadzimy, chyba że wyrazili Państwo na to wyraźną zgodę (patrz część o formularzach na Facebooku i Instagramie). Jeśli napiszą Państwo do nas sami przez WhatsApp, odpowiadamy na Państwa konkretne zapytanie (art. 6 ust. 1 lit. b RODO). Odpowiedź lub oddzwonienie, o które wyraźnie Państwo prosili w konkretnym zapytaniu (poza oddzwonieniem po kalkulatorze wyceny, które opiera się na zgodzie), odbywa się na podstawie art. 6 ust. 1 lit. b RODO. Zgodę na marketing e-mail można cofnąć w każdej chwili, pisząc na adres biuro@investrent.com.pl; po cofnięciu nie otrzymają Państwo już marketingu tym kanałem.
              </P>

              {/* NOWE (20.09.2026, przygotowanie do weryfikacji OAuth Google dla
                  zakresow Business Profile/Kalendarz/Analytics/Search Console -
                  Google wymaga jawnego opisu wykorzystania danych z jego API oraz
                  odwolania do Google API Services User Data Policy z klauzula
                  Limited Use, dokladnie ten sam wzorzec co sekcja Meta powyzej. */}
              <H2>Korzystanie z danych Google (Google API Services)</H2>
              <P>
                Nasz wewnętrzny system CRM łączy się, wyłącznie za Państwa zgodą wyrażoną przy logowaniu przez konto Google, z wybranymi usługami Google w celu obsługi wizytówki firmowej Investrent sp. z o.o. Korzystamy z danych udostępnionych przez Google API w następującym zakresie: odczyt i publikacja treści wizytówki Google Business Profile (w tym opinie klientów i odpowiedzi na nie, posty, informacje o firmie), odczyt i zapis wydarzeń w Kalendarzu Google powiązanym z kontem firmowym oraz odczyt statystyk Google Analytics (o ile włączone) i Google Search Console. Dane te są wykorzystywane wyłącznie do świadczenia i ulepszania funkcji CRM widocznych dla upoważnionych pracowników i współpracowników Investrent sp. z o.o. i nie są sprzedawane ani wykorzystywane do celów reklamowych; korzystają z nich wyłącznie nasi upoważnieni pracownicy i dostawcy usług opisani w tej polityce. Korzystanie i przekazywanie przez Investrent sp. z o.o. informacji uzyskanych z API Google innym aplikacjom podlega Google API Services User Data Policy, w tym wymogom Limited Use.
              </P>

              <H2>Odbiorcy danych</H2>
              <P>Państwa dane osobowe mogą być przekazywane:</P>
              <UL>
                <LI>Partnerom współpracującym w obrocie nieruchomościami (np. deweloperom lub sprzedającym daną nieruchomość, innym pośrednikom i notariuszom), o ile jest to niezbędne do obsługi Państwa sprawy i wyrazili Państwo na to zgodę lub jest to konieczne do realizacji Państwa zapytania.</LI>
                <LI>Podmiotom przetwarzającym dane osobowe na zlecenie Administratora, np. dostawcom usług IT – w zakresie niezbędnym do działania tych usług (dostawcy wymienieni poniżej).</LI>
                <LI>Kancelariom prawnym, doradcom podatkowym i firmom księgowym, które w zależności od charakteru zlecenia działają jako podmioty przetwarzające lub – gdy działają samodzielnie w ramach obowiązków zawodowych – jako odrębni administratorzy.</LI>
                <LI>Organom uprawnionym do otrzymania danych na podstawie przepisów prawa (np. w ramach obowiązków dotyczących przeciwdziałania praniu pieniędzy).</LI>
              </UL>
              <P>Do dostawców, z których korzystamy, należą w szczególności:</P>
              <UL>
                <LI>Vercel Inc. (USA) – hosting strony;</LI>
                <LI>Railway Corp. (USA) – działanie interfejsu API systemu CRM;</LI>
                <LI>Supabase Inc. – baza danych i przechowywanie danych (lokalizacja serwerów – patrz „Hosting i techniczne udostępnianie strony”);</LI>
                <LI>Brevo (Sendinblue SAS, Francja) – wysyłka wiadomości e-mail (powiadomienia dla naszych pracowników o zgłoszeniach, w tym imię, numer telefonu i treść zgłoszenia, oraz wiadomości do klientów);</LI>
                <LI>Anthropic, PBC (USA) – dostawca AI dla kalkulatora wyceny (bez danych kontaktowych i adresu IP z kalkulatora), przetwarzania tekstów i tłumaczenia wiadomości;</LI>
                <LI>Cenogram (Arena Paweł Nguyen, Polska) – dane rynkowe do kalkulatora wyceny (parametry nieruchomości, bez danych kontaktowych);</LI>
                <LI>OpenAI (USA) – zamiana nagrań głosowych pracowników na tekst (asystent głosowy w CRM);</LI>
                <LI>Replicate (USA) – obróbka zdjęć ofert i automatyczne napisy do wideo naszych pracowników;</LI>
                <LI>Google (Gemini API, Google Ireland Limited lub Google LLC) – tworzenie plakatów ofert ze zdjęć;</LI>
                <LI>Apify i Bright Data – pobieranie publicznie dostępnych ogłoszeń nieruchomości z portali oraz usługi obróbki zdjęć ofert;</LI>
                <LI>Cloudflare, Inc. (USA) – ochrona przed automatycznymi wejściami (Turnstile, tylko na stronie kalkulatora);</LI>
                <LI>Meta Platforms Ireland Limited (Irlandia) – formularze kontaktowe na Facebooku/Instagramie;</LI>
                <LI>Google Ireland Limited (Irlandia) – usługi Google (mapy, wideo, API – patrz wyżej), w tym Kalendarz Google pracowników biura, jeśli pracownik połączył go z naszym systemem: tworzymy w nim zadanie oddzwonienia z imieniem osoby i odnośnikiem do jej karty w naszym systemie.</LI>
              </UL>
              {/* Lista dostawcow = jedno zrodlo prawdy z /de/datenschutz (sekcja 10). Zmieniac obie wersje razem. Brevo potwierdzone jako uzywane (od 13.09.2026). */}

              <H3>Wsparcie AI w wewnętrznym systemie CRM</H3>
              <P>
                Nasi pracownicy korzystają w wewnętrznym systemie CRM z funkcji AI firmy Anthropic, PBC (USA), np. do analizy notatek z rozmów, podpowiadania pasujących ofert, streszczeń stanu kontaktu, sprawdzania projektów umów i asystenta głosowego. Do Anthropic mogą być przy tym przekazywane treści Państwa zapytania, np. kryteria poszukiwań, notatki z rozmów (z zamaskowanymi numerami PESEL, dokumentów tożsamości i kont) oraz – przy sprawdzaniu projektu umowy – dane stron umowy i nieruchomości zawarte w projekcie (art. 6 ust. 1 lit. b i f RODO). Numery PESEL, dokumentów tożsamości i kont są automatycznie maskowane przed przekazaniem do Anthropic w notatkach, poleceniach głosowych i przy sprawdzaniu projektów umów. Anthropic przetwarza te treści w naszym imieniu jako podmiot przetwarzający; według warunków API dostawcy dane przekazane przez API nie są domyślnie wykorzystywane do trenowania jego modeli i są co do zasady usuwane w ciągu 30 dni, z wyjątkami (np. obowiązki prawne, badanie nadużyć). Warunki przetwarzania danych Anthropic (Data Processing Addendum): <a href="https://www.anthropic.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer" style={link}>anthropic.com/legal/data-processing-addendum</a>. Wyniki służą wyłącznie wsparciu pracowników; decyzje podejmują ludzie.
              </P>

              <H3>Tłumaczenie wiadomości</H3>
              <P>
                Do obsługi korespondencji z klientami i osobami zainteresowanymi, którzy komunikują się z nami po niemiecku (Państwa wiadomości i nasze odpowiedzi, w obie strony między niemieckim a polskim), tłumaczymy teksty maszynowo z pomocą Anthropic, PBC (USA). Tekst danej wiadomości jest w tym celu przekazywany do Anthropic bez zmian, czyli bez maskowania numerów identyfikacyjnych (art. 6 ust. 1 lit. b RODO; przekazanie do USA – patrz „Przekazywanie danych do państw trzecich”). Anthropic działa jako podmiot przetwarzający; w zakresie trenowania i usuwania danych obowiązuje to, co napisano wyżej. Tłumaczenia maszynowe mogą zawierać błędy.
              </P>

              <H3>Pozostali dostawcy w wewnętrznym systemie CRM</H3>
              <P>
                OpenAI zamienia na tekst nagrania głosowe, które pracownicy kierują do asystenta głosowego CRM; nagrania mogą zawierać wypowiedziane imiona i numery telefonów klientów. Replicate obrabia zdjęcia ofert (usuwanie znaków wodnych) i generuje automatyczne napisy do wideo naszych pracowników. Przez Gemini API Google tworzone są plakaty ofert ze zdjęć ofert. Apify i Bright Data pobierają dla nas publicznie dostępne ogłoszenia nieruchomości z portali (patrz „Dane z publicznych ogłoszeń”). Podstawą jest każdorazowo art. 6 ust. 1 lit. f RODO. Zamiana nagrania na tekst następuje w OpenAI, zanim numery identyfikacyjne zostaną zamaskowane. Do Google (Gemini API) nie trafiają imię, nazwisko ani numer telefonu opiekuna oferty; są one dodawane na plakacie lokalnie. Z OpenAI i Apify obowiązują umowy powierzenia przetwarzania danych (art. 28 RODO), których warunki są pod linkami. Warunki i polityki dostawców są dostępne pod adresami: <a href="https://openai.com/policies/data-processing-addendum/" target="_blank" rel="noopener noreferrer" style={link}>OpenAI (DPA)</a>, <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" style={link}>Google (Gemini API)</a>, <a href="https://replicate.com/privacy" target="_blank" rel="noopener noreferrer" style={link}>Replicate (polityka prywatności)</a>, <a href="https://docs.apify.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer" style={link}>Apify (DPA)</a> i <a href="https://brightdata.com/license" target="_blank" rel="noopener noreferrer" style={link}>Bright Data</a>. {/* Linki odczytane 25.09.2026. Replicate: brak publicznego DPA. Bright Data: link brightdata.com/license potwierdzony 28.09.2026 (HTTP 200, tytul "Bright Data License Agreement"; sprawdzone przez wskazany adres IP, bo lokalny resolver nie rozwiazywal domeny). */}
              </P>

              {/* Klauzula art. 14 RODO. Fakty z kodu CRM (portalArchive.ts: archiwum ogloszen z seller_phone; commissionAlerts.ts: alert gdy numer wlasciciela pojawia sie w nowym ogloszeniu; portalVerification.ts: dopasowanie do numerow naszych agentow) oraz decyzja Daniela 26.09.2026: "Czasem dzwonimy do sprzedajacych". RYZYKO PRAWNE do Krytyka/prawnika: kontakt telefoniczny z osobami prywatnymi z ogloszen (prawo telekomunikacyjne, UOKiK, RODO). To NIE jest zgoda marketingowa. */}
              {/* RYZYKO PRAWNE do Krytyka/prawnika: kontakt telefoniczny z osobami prywatnymi z ogloszen (prawo telekomunikacyjne/PKE, UOKiK, RODO, regulaminy portali).
                  Decyzja Daniela 26.09.2026: "Czasem dzwonimy do sprzedajacych". Sekcja jest zamierzenie ogolna i bez obietnic ponad praktyke.
                  DO PRAWNIKA (celowo poza tekstem publicznym): art. 14 ust. 3 (informacja przy pierwszym kontakcie: skrypt w _wspolne_pliki/informacja_art14_pierwszy_kontakt_sprzedajacy_2026_09_26.md;
                  dodac do tekstu zdanie o informowaniu w rozmowie DOPIERO po wdrozeniu skryptu), art. 14 ust. 5 lit. b (czy publikacja wystarcza wobec ogloszeniodawcow bez kontaktu),
                  ocena "marketing bezposredni", LIA, lista "nie dzwonimy" dla sprzedajacych (backlog; dodac sekcje po wdrozeniu). */}
              <H2>Dane z publicznych ogłoszeń o nieruchomościach</H2>
              <P>
                Jeżeli Państwa dane osobowe znalazły się w publicznie dostępnym ogłoszeniu o nieruchomości na portalu ogłoszeniowym (np. Otodom, OLX, Facebook Marketplace), a nie otrzymaliśmy ich bezpośrednio od Państwa, informujemy:
              </P>
              <UL>
                <LI>Administrator: Investrent sp. z o.o. (dane kontaktowe wyżej).</LI>
                <LI>Źródło danych: publiczne ogłoszenia, które pobieramy za pośrednictwem dostawców Apify i Bright Data.</LI>
                <LI>Kategorie danych: zawarte w ogłoszeniu, w szczególności numer telefonu ogłaszającego, czasem jego imię, jego rodzaj (osoba prywatna lub biuro) oraz treść i dane ogłoszenia (adres nieruchomości, cena, opis).</LI>
                <LI>Cele: analiza rynku i wycena nieruchomości, weryfikacja i porównywanie ofert, kontakt z osobą, która wystawiła ogłoszenie (opisany niżej), oraz ochrona prawnie uzasadnionych interesów Administratora, w tym wykrywanie ponownego wystawienia tej samej nieruchomości przez osobę związaną umową z naszym biurem.</LI>
                <LI>Podstawa prawna: art. 6 ust. 1 lit. f RODO, czyli nasz prawnie uzasadniony interes: prowadzenie analizy rynku oraz nawiązywanie kontaktu z osobami, które same zaoferowały nieruchomość do sprzedaży, w związku z działalnością pośrednictwa w obrocie nieruchomościami.</LI>
                <LI>Odbiorcy: dostawcy wymienieni w części „Odbiorcy danych” (w szczególności hosting, baza danych, Apify i Bright Data) oraz upoważnieni pracownicy biura.</LI>
                <LI>Okres przechowywania: numer telefonu z ogłoszenia przechowujemy nie dłużej, niż jest to konieczne do celów opisanych w tej części; pozostałe dane ogłoszenia (adres nieruchomości, cena, opis), niezawierające numeru telefonu, mogą służyć dłużej statystykom rynku i wycenom.</LI>
                <LI>Prawa: przysługują Państwu prawa opisane w części „Prawa osób, których dane dotyczą”, w tym prawo sprzeciwu (art. 21 RODO) oraz skargi do Prezesa UODO.</LI>
              </UL>
              <H3>Kontakt telefoniczny z osobami, które wystawiły ogłoszenie</H3>
              <P>
                Czasem dzwonimy do osób, które wystawiły ogłoszenie, aby zapytać o ogłoszoną nieruchomość i o możliwość współpracy z naszym biurem. Mogą Państwo w każdej chwili sprzeciwić się takiemu kontaktowi i takiemu przetwarzaniu danych (art. 21 RODO), pisząc na adres <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a> albo mówiąc o tym podczas rozmowy. Jeśli nie kontaktujemy się z ogłaszającym, informację przekazujemy przez publikację tej części polityki.
              </P>

              <H2>Przekazywanie danych do państw trzecich</H2>
              <P>
                Niektórzy z wymienionych dostawców mają siedzibę w USA lub mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym. Przekazanie danych do Vercel, Railway, Anthropic, OpenAI, Cloudflare i Google (w zakresie, w jakim mają siedzibę w USA lub tam przetwarzają dane) opieramy na decyzji wykonawczej Komisji Europejskiej z 10 lipca 2023 r. (EU-US Data Privacy Framework), o ile dany odbiorca ma w danym czasie aktywną certyfikację, a w pozostałym zakresie na standardowych klauzulach umownych Komisji Europejskiej (art. 46 ust. 2 lit. c RODO). Supabase przechowuje dane w regionie UE (Irlandia), a jego umowa powierzenia zawiera standardowe klauzule umowne UE. Brevo (Francja), Apify (Czechy) i Cenogram (Polska) mają siedzibę w UE. Kopię zabezpieczeń przekażemy na Państwa wniosek (<a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>).
              </P>
              <P>
                Dane przekazujemy także pozostałym dostawcom wymienionym w części „Odbiorcy danych” (m.in. OpenAI, Replicate, Gemini API Google, Bright Data); opisujemy ich rolę i cel, a informacji o zabezpieczeniach przekazania danych udzielamy na Państwa wniosek (biuro@investrent.com.pl), w zakresie, w jakim dostawca je udostępnia. Zasady przekazywania danych przez Meta opisano w części o formularzach Facebook i Instagram.
              </P>

              <H2>Dobrowolność podania danych</H2>
              <P>
                Podanie danych osobowych jest dobrowolne, jednak niezbędne do skontaktowania się z Państwem, przygotowania oferty lub zawarcia i realizacji umowy pośrednictwa w obrocie nieruchomościami. Niepodanie danych może uniemożliwić realizację tych celów. Zgody na marketing są zawsze dobrowolne.
              </P>

              <H2>Zautomatyzowane podejmowanie decyzji</H2>
              <P>
                Nie podejmujemy wobec Państwa decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, wywołujących skutki prawne lub w podobny sposób istotnie na Państwa wpływających. Wewnętrznie nasz system CRM oblicza dla kontaktów wskaźnik priorytetu (z poziomu zainteresowania, etapu sprawy, czasu od ostatniego kontaktu i otwartych zadań), który pokazuje pracownikom, do kogo zadzwonić w pierwszej kolejności (art. 6 ust. 1 lit. f RODO). Wskaźnik służy wyłącznie do sortowania: nie prowadzi automatycznie do odrzucenia, przydziału ani wysyłki; o kontakcie i ofertach zawsze decydują pracownicy. Informacje o kalkulatorze wyceny – patrz część „Wycena nieruchomości”.
              </P>

              <H2>Prawa osób, których dane dotyczą</H2>
              <P>Zgodnie z RODO przysługuje Państwu:</P>
              <UL>
                <LI>Prawo dostępu do swoich danych oraz otrzymania ich kopii.</LI>
                <LI>Prawo do sprostowania (poprawiania) swoich danych.</LI>
                <LI>Prawo do usunięcia danych, ograniczenia przetwarzania danych.</LI>
                <LI>Prawo do wniesienia sprzeciwu wobec przetwarzania danych.</LI>
                <LI>Prawo do przenoszenia danych.</LI>
                <LI>Prawo do cofnięcia zgody na przetwarzanie danych w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem. Cofnięcie przyjmujemy pod adresem <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>. Po cofnięciu zgody na telefon w sprawie wyceny nie zadzwonimy do Państwa w sprawie wyceny.</LI>
                <LI>Prawo do wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl).</LI>
              </UL>
              <H3>Prawo sprzeciwu – zwrócenie uwagi</H3>
              <P>
                Mają Państwo prawo w dowolnym momencie wnieść sprzeciw z przyczyn związanych z Państwa szczególną sytuacją wobec przetwarzania danych osobowych opartego na art. 6 ust. 1 lit. f RODO (art. 21 ust. 1 RODO). Jeżeli dane osobowe są przetwarzane na potrzeby marketingu bezpośredniego, mają Państwo prawo w dowolnym momencie, bez podawania przyczyn, wnieść sprzeciw wobec przetwarzania dotyczących Państwa danych na potrzeby takiego marketingu (art. 21 ust. 2 RODO). Sprzeciw dotyczy m.in. dowodu zgody na telefon w sprawie wyceny, adresu IP oraz kontaktu z osobami, które wystawiły ogłoszenie (art. 6 ust. 1 lit. f RODO); w przypadku kontaktu telefonicznego z ogłoszeń wystarczy powiedzieć o tym podczas rozmowy; w pozostałych przypadkach wystarczy sprzeciw przesłany e-mailem na adres <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
              </P>

              <H2>Okres przechowywania danych</H2>
              <P>
                Państwa dane osobowe będą przechowywane przez okres niezbędny do realizacji celów przetwarzania, a po tym czasie przez okres oraz w zakresie wymaganym przez przepisy prawa lub dla zabezpieczenia ewentualnych roszczeń. W szczególności:
              </P>
              <UL>
                <LI>zapytania i dane kontaktowe z formularzy na stronie (poza kalkulatorem wyceny) i z formularzy Facebook i Instagram, gdy nie doszło do zawarcia umowy: nie dłużej, niż jest to konieczne do obsługi zapytania, w razie cofnięcia zgody lub sprzeciwu – krócej;</LI>
                <LI>dowód zgody na marketing e-mail udzielonej w formularzach Facebook i Instagram: do 3 lat;</LI>
                <LI>dowód zgłoszenia żądania ofert nieruchomości w formularzach Facebook i Instagram (treść formularza, znacznik czasu, wersja formularza): do 3 lat;</LI>
                <LI>dane umowne: przez czas trwania umowy, a następnie przez okres wymagany przepisami podatkowymi i rachunkowymi (5 lat od końca roku kalendarzowego, w którym powstał obowiązek podatkowy i rachunkowy); w razie toczących się sporów do ich zakończenia;</LI>
                <LI>dane zbierane na podstawie przepisów o przeciwdziałaniu praniu pieniędzy: 5 lat od zakończenia stosunków gospodarczych;</LI>
                <LI>dzienniki techniczne: dzienniki żądań do interfejsu API (Railway) do 30 dni; adres IP w naszej aplikacji tylko krótkotrwale, dla limitu zapytań; dzienniki hostingu strony (Vercel) i ochrony formularza (Cloudflare) według zasad tych dostawców.</LI>
              </UL>
              <H3>Okresy dla kalkulatora wyceny</H3>
              {RETENTION_CALCULATOR_ACTIVE ? (
                <>
                  <P>Dla zapytań w kalkulatorze wyceny obowiązują odrębne okresy (nie stosuje się ich do pozostałych formularzy). Poniżej ten sam tekst, który pokazujemy osobom korzystającym z kalkulatora (zwracamy się w nim wprost do użytkownika):</P>
                  <UL>
                    {RETENTION_A_ITEMS.map(item => <LI key={item}>{item}</LI>)}
                  </UL>
                </>
              ) : (
                <P>
                  Zapytania z kalkulatora wyceny przechowujemy nie dłużej, niż jest to konieczne do obsługi Państwa wyceny.
                </P>
              )}

              <H2>Zmiany i wersje językowe</H2>
              <P>
                Aktualizujemy niniejszą politykę, gdy zmienia się sposób przetwarzania lub stan prawny. Stan na: {POLICY_DATE}. Dla użytkowników korzystających ze strony w języku niemieckim wiążąca jest wersja niemiecka (<a href="/de/datenschutz" style={link}>/de/datenschutz</a>); niniejsza wersja polska obowiązuje użytkowników korzystających ze strony w języku polskim. Obie wersje opisują to samo przetwarzanie danych; kalkulator wyceny jest dostępny tylko po polsku i dlatego opisany wyłącznie w wersji polskiej.
              </P>

              <H2>Kontakt</H2>
              <P last>
                W sprawach związanych z przetwarzaniem danych osobowych mogą Państwo skontaktować się z nami pisemnie na adres naszej siedziby: Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, lub mailowo pod adresem: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
              </P>
            </div>
          </div>
        </div>
      </main>
      <Footer office={office} />
      <SocialSidebar office={office} />
    </>
  )
}
