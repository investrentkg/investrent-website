import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { H2, H3, P, UL, LI, Ph } from '@/components/legal/LegalShell'
import { getOffice } from '@/lib/api'
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
// razem. Widoczne placeholdery (Ph) = tylko dane od Daniela / okresy do decyzji prawnika.
// Dane spolki z odpisu KRS/VIES z 25.09.2026 - do weryfikacji przed publikacja.

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
  name: 'InvestRent', logo_url: '/logo.png',
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

              <H2>Administrator danych osobowych</H2>
              <P>
                Administratorem Państwa danych osobowych jest Investrent sp. z o.o. (INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ) z siedzibą w Kołobrzegu, przy ul. Ratuszowej 12/1 lok. 3, 78-100 Kołobrzeg, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0001069797, NIP: 671 185 85 59, REGON: 526973936.
                {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacją */}
              </P>
              <P>
                Kontakt w sprawach ochrony danych: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>, tel. +48 731 554 341. Inspektor ochrony danych nie został powołany, ponieważ nie ma takiego ustawowego obowiązku.
                {/* Wariant, gdy Daniel powola IOD: "Inspektorem ochrony danych jest [imie i nazwisko], kontakt: [e-mail]." (spojnie z /de/datenschutz sekcja 1). */}
              </P>

              <H2>Cel i podstawa prawna przetwarzania danych</H2>
              <P>Państwa dane osobowe są przetwarzane w celu:</P>
              <UL>
                <LI>Realizacji usług związanych z obrotem nieruchomościami, zgodnie z zawartą umową lub w celu podjęcia działań przed jej zawarciem na Państwa żądanie (art. 6 ust. 1 lit. b RODO).</LI>
                <LI>Spełnienia obowiązków prawnych ciążących na Administratorze, w szczególności wynikających z przepisów podatkowych i rachunkowych oraz przepisów o przeciwdziałaniu praniu pieniędzy (art. 6 ust. 1 lit. c RODO).</LI>
                <LI>Realizacji prawnie uzasadnionych interesów Administratora, takich jak dochodzenie roszczeń lub obrona przed roszczeniami oraz ochrona przed nadużyciami i zautomatyzowanymi wejściami (art. 6 ust. 1 lit. f RODO).</LI>
                <LI>Przesyłania informacji handlowych i marketingowych, na podstawie udzielonej zgody (art. 6 ust. 1 lit. a RODO).</LI>
              </UL>

              <H2>Hosting i techniczne udostępnianie strony</H2>
              <P>
                Strona jest hostowana u Vercel Inc. (USA). Przy każdym wejściu na stronę dostawca hostingu przetwarza niezbędne dane techniczne połączenia (adres IP, data i godzina, odwiedzana podstrona, typ przeglądarki), aby dostarczyć stronę i zapewnić jej bezpieczeństwo (art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes w bezpiecznym i stabilnym działaniu strony). Dane te są przechowywane w dziennikach serwera przez <Ph>[30]</Ph> dni. Interfejs API naszego systemu CRM działa na Railway Corp., a baza danych na Supabase Inc.; baza danych znajduje się w regionie UE Irlandia (Supabase, eu-west-1), API działa w regionie UE Holandia (Railway, europe-west4), a funkcje strony działają u Vercel we Frankfurcie (fra1); treści statyczne są dostarczane przez sieć Vercel. Z dostawcami zawarto umowy powierzenia przetwarzania danych (art. 28 RODO) <Ph>[DO POTWIERDZENIA: podpisane DPA z Vercel, Railway, Supabase]</Ph>. Informacje o przekazywaniu danych do państw trzecich znajdują się w części „Przekazywanie danych do państw trzecich”.
              </P>
              <H3>Treści osadzone od podmiotów trzecich (dwuklik)</H3>
              <P>
                Na wybranych podstronach mogą być osadzone treści podmiotów trzecich: na stronach „Kontakt”, „O nas” i na stronach ofert mapa Google Maps (Google Ireland Limited), a na stronach ofert – jeśli dla oferty dodano wideo – filmy z YouTube (Google Ireland Limited) lub Vimeo. Treści te ładują się dopiero po kliknięciu przycisku „Załaduj mapę” lub „Załaduj wideo”; wcześniej nie ma połączenia z serwerami tych dostawców. Klikając, łączą się Państwo z serwerami danego dostawcy, który przetwarza Państwa adres IP i może zapisywać lub odczytywać informacje (np. pliki cookies) na Państwa urządzeniu; zgodę wyrażają Państwo kliknięciem (art. 6 ust. 1 lit. a RODO) i mogą ją zakończyć, odświeżając stronę. Filmy z YouTube ładujemy w trybie rozszerzonej prywatności (youtube-nocookie.com). Państwa wybór jest przechowywany wyłącznie w pamięci przeglądarki, bez plików cookies i pamięci lokalnej; po odświeżeniu strony potrzebne jest ponowne kliknięcie. Dodatkowo linkujemy „Otwórz w Mapach Google” jako zwykły link: dopiero po jego kliknięciu opuszczają Państwo naszą stronę.
              </P>
              <P>
                Zdjęcia ofert i pracowników oraz obrazy w wpisach blogowych są ładowane z magazynu naszego dostawcy bazy danych (Supabase Storage; art. 6 ust. 1 lit. f RODO); pojedyncze zdjęcia stockowe z Unsplash są dostarczane przez naszego dostawcę hostingu Vercel, więc Państwa przeglądarka nie łączy się w tym celu z Unsplash. Opinie Google pokazujemy bez zdjęć profilowych. Używane przez nas czcionki są serwowane z naszego własnego serwera. My sami nie stosujemy na stronie plików cookies ani nie zapisujemy danych w pamięci lokalnej przeglądarki.
              </P>

              <H2>Zapytania z formularzy, prośby o kontakt i czat na stronie</H2>
              <P>
                Gdy kontaktują się Państwo z nami przez formularz na stronie (np. formularz kontaktowy, prośba o telefon, zapytanie o ofertę) lub czat, przetwarzamy wpisane dane (np. imię i nazwisko, numer telefonu, adres e-mail, treść wiadomości, odniesienie do oferty), aby obsłużyć zapytanie i się z Państwem skontaktować. Podstawą jest art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) lub art. 6 ust. 1 lit. f RODO (obsługa zapytań). Dane zapisujemy w wewnętrznym systemie CRM; dostęp mają wyłącznie upoważnieni pracownicy Investrent sp. z o.o. oraz – w zakresie niezbędnym dla zapytania – odbiorcy wskazani w części „Odbiorcy danych”. Czat na stronie jest formularzem wiadomości: wiadomość obsługują nasi pracownicy, nie działa tam chatbot AI.
              </P>

              <H2>Wycena nieruchomości (kalkulator wspierany przez AI)</H2>
              <P>
                Gdy korzystają Państwo z kalkulatora wyceny, przetwarzamy wpisane dane nieruchomości (miejscowość lub adres, rodzaj, powierzchnia, liczba pokoi, piętro, stan). Do obliczenia szacunku przekazujemy te dane – bez Państwa danych kontaktowych – do Anthropic, PBC (USA), który działa jako nasz podmiot przetwarzający (art. 28 RODO) na podstawie umowy powierzenia i standardowych klauzul umownych. Zgodnie z warunkami umownymi przekazane dane nie są wykorzystywane do trenowania modeli AI <Ph>[DO POTWIERDZENIA: DPA/SCC i wyłączenie treningu – Anthropic]</Ph>. Podstawą obliczenia jest art. 6 ust. 1 lit. b RODO (realizacja Państwa żądania). W celu ochrony przed nadużyciami i ograniczania liczby zapytań przechowujemy krótkotrwale Państwa adres IP (art. 6 ust. 1 lit. f RODO). Jeśli dodatkowo zostawią Państwo numer telefonu, aby konsultant do Państwa oddzwonił, przetwarzamy imię, numer telefonu, dane nieruchomości i wynik w naszym systemie CRM (art. 6 ust. 1 lit. b RODO – oddzwonienie w sprawie wyceny; w zakresie dalszego marketingu art. 6 ust. 1 lit. a RODO na podstawie odrębnie udzielonej zgody).
              </P>
              <P>
                {/* OPIS KALKULATORA I DWOCH POL ZGODY OBOWIAZUJE PO WDROZENIU PR #21 (/wycena + backend; na origin/main CRM 25.09.2026 brak endpointu /api/public/valuation/estimate). */}
                Kalkulator wyceny jest dostępny obecnie tylko w języku polskim. Przy prośbie o oddzwonienie w kalkulatorze dostępne są dwa oddzielne pola wyboru, które zaznaczają Państwo samodzielnie: (1) zgoda na telefon w sprawie wyceny nieruchomości – wymagana, abyśmy mogli zadzwonić pod podany numer; (2) zgoda na marketing bezpośredni przez telefon i SMS – oferty pośrednictwa i inne oferty Investrent sp. z o.o. – dobrowolna, niezaznaczona domyślnie i niewymagana do skorzystania z kalkulatora ani do oddzwonienia w sprawie wyceny (art. 6 ust. 1 lit. a RODO; art. 398 Prawa komunikacji elektronicznej). Obie zgody mogą Państwo w każdej chwili cofnąć (patrz „Prawa osób, których dane dotyczą”). Datę, treść i źródło zgód zapisujemy w celu wykazania ich udzielenia (art. 7 ust. 1 RODO).
              </P>
              <P>
                Wynik jest wyraźnie orientacyjny; nie stanowi operatu szacunkowego ani wyceny w rozumieniu przepisów. Nie podejmujemy decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu w rozumieniu art. 22 RODO, wywołujących wobec Państwa skutki prawne lub w podobny sposób istotnie na Państwa wpływających: z wyniku nie wynikają zawarcie umowy, ustalenie ceny ani odmowa; dalszą obsługę zawsze prowadzą nasi pracownicy.
              </P>

              <H2>Ochrona przed automatycznymi wejściami (Cloudflare Turnstile)</H2>
              <P>
                Na stronie kalkulatora wyceny chronimy formularz przed spamem i automatycznymi wejściami (botami) za pomocą usługi „Cloudflare Turnstile” firmy Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Skrypt Turnstile jest pobierany z serwerów Cloudflare (challenges.cloudflare.com) dopiero po wejściu na stronę kalkulatora; na pozostałych podstronach nie jest ładowany. Usługa działa w tle i staje się widoczna dla Państwa tylko wtedy, gdy Cloudflare wymaga interakcji. Do Cloudflare przekazywane są dane techniczne (w szczególności adres IP, informacje o przeglądarce i urządzeniu, cechy interakcji) i tam analizowane w celu sprawdzenia, czy zapytanie pochodzi od człowieka. Wynik weryfikacji (token) jest przesyłany wraz z zapytaniem do naszego systemu i tam weryfikowany w Cloudflare. My sami nie ustawiamy w tym celu plików cookies; czy Cloudflare zapisuje coś na urządzeniu w ramach weryfikacji <Ph>[DO POTWIERDZENIA: dokumentacja Cloudflare Turnstile]</Ph>. Podstawą jest art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes w bezpieczeństwie systemów i ochronie przed nadużyciami). Przekazanie do USA opiera się na decyzji wykonawczej Komisji Europejskiej z 10 lipca 2023 r. (EU-US Data Privacy Framework), o ile Cloudflare jest certyfikowany, a pomocniczo na standardowych klauzulach umownych (art. 46 ust. 2 lit. c RODO).
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
                Podstawą obsługi Państwa zapytania jest art. 6 ust. 1 lit. b RODO. Na marketing przez e-mail prosimy o odrębną, wyraźną zgodę (art. 6 ust. 1 lit. a RODO), którą udzielają Państwo w formularzu przez aktywne zaznaczenie jednego, opcjonalnego pola (kontakt e-mail); jest ona dobrowolna i niewymagana do obsługi zapytania. Kontaktu telefonicznego ani przez komunikator (np. WhatsApp) na podstawie tego formularza nie oferujemy. Datę, treść i źródło zgody zapisujemy, aby móc wykazać jej udzielenie (art. 7 ust. 1 RODO). {/* OBOWIAZUJE PO WDROZENIU PR CRM: zapis dowodu zgody z importu Meta (leadgen_id, form_id, czas, wersja tresci zgody). Do tego czasu backend tego nie zapisuje. Numer telefonu usuniety z listy pol formularza Meta (brak pola telefonu - potwierdzic liste pol). */}Zgodę można w każdej chwili cofnąć ze skutkiem na przyszłość. Meta udostępnia nam dane zebrane w formularzu do pobrania i w tym zakresie przetwarza je jako nasz podmiot przetwarzający, zgodnie z warunkami przetwarzania danych Meta; przy wyświetlaniu reklam Meta przetwarza dane we własnym imieniu lub na podstawie Controller Addendum (<a href="https://www.facebook.com/legal/controller_addendum" style={link} target="_blank" rel="noopener noreferrer">facebook.com/legal/controller_addendum</a>). Obowiązują informacje o prywatności Meta (<a href="https://www.facebook.com/privacy/policy" style={link} target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>).
              </P>

              <H2>Kontakt handlowy przez e-mail, telefon i komunikatory</H2>
              <P>
                W celach marketingowych kontaktujemy się z Państwem tylko wtedy, gdy uprzednio wyraźnie wyrazili Państwo zgodę na dany kanał: e-mailem – na podstawie opcjonalnego pola w formularzu (patrz część o formularzach Facebook i Instagram), a telefonicznie i SMS-em wyłącznie wtedy, gdy w kalkulatorze wyceny samodzielnie zaznaczą Państwo opcjonalne pole zgody na marketing telefoniczny i SMS (patrz część „Wycena nieruchomości”). Marketingu przez komunikator (np. WhatsApp) nie prowadzimy; jeśli piszą Państwo do nas sami przez WhatsApp, odpowiadamy na konkretne zapytanie (art. 6 ust. 1 lit. b RODO). Oddzwonienie lub odpowiedź, o które wyraźnie Państwo prosili w konkretnym zapytaniu, odbywa się na podstawie art. 6 ust. 1 lit. b RODO. Zgodę można w każdej chwili cofnąć; po cofnięciu nie otrzymają Państwo już marketingu tym kanałem.
              </P>

              {/* NOWE (20.09.2026, przygotowanie do weryfikacji OAuth Google dla
                  zakresow Business Profile/Kalendarz/Analytics/Search Console -
                  Google wymaga jawnego opisu wykorzystania danych z jego API oraz
                  odwolania do Google API Services User Data Policy z klauzula
                  Limited Use, dokladnie ten sam wzorzec co sekcja Meta powyzej. */}
              <H2>Korzystanie z danych Google (Google API Services)</H2>
              <P>
                Nasz wewnętrzny system CRM łączy się, wyłącznie za Państwa zgodą wyrażoną przy logowaniu przez konto Google, z wybranymi usługami Google w celu obsługi wizytówki firmowej Investrent sp. z o.o. Korzystamy z danych udostępnionych przez Google API w następującym zakresie: odczyt i publikacja treści wizytówki Google Business Profile (w tym opinie klientów i odpowiedzi na nie, posty, informacje o firmie), odczyt i zapis wydarzeń w Kalendarzu Google powiązanym z kontem firmowym oraz odczyt statystyk Google Analytics (o ile włączone) i Google Search Console. Dane te są wykorzystywane wyłącznie do świadczenia i ulepszania funkcji CRM widocznych dla upoważnionych pracowników i współpracowników Investrent sp. z o.o. i nie są przekazywane podmiotom trzecim ani wykorzystywane do celów reklamowych. Korzystanie i przekazywanie przez Investrent sp. z o.o. informacji uzyskanych z API Google innym aplikacjom podlega Google API Services User Data Policy, w tym wymogom Limited Use.
              </P>

              <H2>Odbiorcy danych</H2>
              <P>Państwa dane osobowe mogą być przekazywane:</P>
              <UL>
                <LI>Partnerom współpracującym w obrocie nieruchomościami (np. deweloperom lub sprzedającym daną nieruchomość, innym pośrednikom i notariuszom), o ile jest to niezbędne do obsługi Państwa sprawy i wyrazili Państwo na to zgodę lub jest to konieczne do realizacji Państwa zapytania.</LI>
                <LI>Podmiotom przetwarzającym dane osobowe na zlecenie Administratora, np. dostawcom usług IT – na podstawie umowy z Administratorem i wyłącznie zgodnie z jego poleceniami.</LI>
                <LI>Kancelariom prawnym, doradcom podatkowym i firmom księgowym, które w zależności od charakteru zlecenia działają jako podmioty przetwarzające lub – gdy działają samodzielnie w ramach obowiązków zawodowych – jako odrębni administratorzy.</LI>
                <LI>Organom uprawnionym do otrzymania danych na podstawie przepisów prawa (np. w ramach obowiązków dotyczących przeciwdziałania praniu pieniędzy).</LI>
              </UL>
              <P>Do dostawców, z których korzystamy, należą w szczególności:</P>
              <UL>
                <LI>Vercel Inc. (USA) – hosting strony;</LI>
                <LI>Railway Corp. (USA) – działanie interfejsu API systemu CRM;</LI>
                <LI>Supabase Inc. – baza danych i przechowywanie danych (lokalizacja serwerów – patrz „Hosting i techniczne udostępnianie strony”);</LI>
                <LI>Brevo (Sendinblue SAS, Francja) – wysyłka wiadomości e-mail (powiadomienia dla naszych pracowników, np. o nowych zapytaniach, oraz wiadomości do klientów);</LI>
                <LI>Anthropic, PBC (USA) – dostawca AI dla kalkulatora wyceny i przetwarzania tekstów;</LI>
                <LI>OpenAI (USA) – zamiana nagrań głosowych pracowników na tekst (asystent głosowy w CRM);</LI>
                <LI>Replicate (USA) – obróbka zdjęć ofert i automatyczne napisy do wideo naszych pracowników;</LI>
                <LI>Google (Gemini API, Google Ireland Limited lub Google LLC) – tworzenie plakatów ofert;</LI>
                <LI>Apify i Bright Data – pobieranie publicznie dostępnych ogłoszeń nieruchomości z portali oraz usługi obróbki zdjęć ofert;</LI>
                <LI>Cloudflare, Inc. (USA) – ochrona przed automatycznymi wejściami (Turnstile, tylko na stronie kalkulatora);</LI>
                <LI>Meta Platforms Ireland Limited (Irlandia) – formularze kontaktowe na Facebooku/Instagramie;</LI>
                <LI>Google Ireland Limited (Irlandia) – usługi Google (mapy, wideo, API – patrz wyżej).</LI>
              </UL>
              {/* Lista dostawcow = jedno zrodlo prawdy z /de/datenschutz (sekcja 10). Zmieniac obie wersje razem. Daniel: potwierdzic, czy Brevo jest faktycznie uzywane (jesli nie - usunac w obu). */}

              <H3>Wsparcie AI w wewnętrznym systemie CRM</H3>
              <P>
                Nasi pracownicy korzystają w wewnętrznym systemie CRM z funkcji AI firmy Anthropic, PBC (USA), np. do analizy notatek z rozmów, podpowiadania pasujących ofert, streszczeń stanu kontaktu, sprawdzania projektów umów i asystenta głosowego. Do Anthropic mogą być przy tym przekazywane treści Państwa zapytania, np. imię i nazwisko, kryteria poszukiwań, notatki z rozmów oraz – przy sprawdzaniu projektu umowy – dane stron umowy i nieruchomości zawarte w projekcie (art. 6 ust. 1 lit. b i f RODO). Anthropic działa jako podmiot przetwarzający. Wyniki służą wyłącznie wsparciu pracowników; decyzje podejmują ludzie.
              </P>

              <H3>Pozostali dostawcy w wewnętrznym systemie CRM</H3>
              <P>
                OpenAI zamienia na tekst nagrania głosowe, które pracownicy kierują do asystenta głosowego CRM; nagrania mogą zawierać wypowiedziane imiona i numery telefonów klientów. Replicate obrabia zdjęcia ofert (usuwanie znaków wodnych) i generuje automatyczne napisy do wideo naszych pracowników. Przez Gemini API Google tworzone są plakaty ofert ze zdjęć; przekazywane są przy tym imię, nazwisko i telefon opiekuna oferty (pracownika). Apify i Bright Data pobierają dla nas publicznie dostępne ogłoszenia nieruchomości z portali (patrz „Dane z publicznych ogłoszeń”). Podstawą jest każdorazowo art. 6 ust. 1 lit. f RODO; z dostawcami zawieramy umowy powierzenia <Ph>[DO POTWIERDZENIA: DPA OpenAI, Replicate, Google, Apify, Bright Data]</Ph>.
              </P>

              {/* Klauzula art. 14 RODO (runda 2, pkt 3.3): przeglad prawny NIE podal gotowego tekstu - brzmienie ponizej oparte na faktach z kodu CRM (portalArchive.ts: archiwum ogloszen z seller_phone; commissionAlerts.ts: alert gdy numer wlasciciela pojawia sie w nowym ogloszeniu; portalVerification.ts: dopasowanie do numerow naszych agentow). DO ZATWIERDZENIA PRZEZ KANCELARIE (pytanie 5). Uzycie tych numerow do kontaktu handlowego = osobna decyzja prawna (art. 398 PKE) - nie deklarujemy go. */}
              <H2>Dane z publicznych ogłoszeń (informacja z art. 14 RODO)</H2>
              <P>
                Jeżeli Państwa dane osobowe znalazły się w publicznie dostępnym ogłoszeniu o nieruchomości na portalu ogłoszeniowym (m.in. Otodom, OLX, Facebook Marketplace), a nie otrzymaliśmy ich bezpośrednio od Państwa, informujemy: Administratorem jest Investrent sp. z o.o. (dane kontaktowe wyżej). Źródłem danych są publiczne ogłoszenia, które pobieramy za pośrednictwem dostawców Apify i Bright Data. Przetwarzamy kategorie danych zawarte w ogłoszeniu, w szczególności numer telefonu ogłaszającego, jego rodzaj (osoba prywatna lub biuro), treść i dane ogłoszenia (adres nieruchomości, cena, opis). Cele: analiza rynku i wycena nieruchomości, weryfikacja i porównywanie ofert oraz ochrona prawnie uzasadnionych interesów Administratora, w tym wykrywanie ponownego wystawienia tej samej nieruchomości przez osobę związaną umową z naszym biurem (art. 6 ust. 1 lit. f RODO). Dane przechowujemy <Ph>[DO POTWIERDZENIA: okres przechowywania archiwum ogłoszeń]</Ph>. Odbiorcami są dostawcy wymienieni wyżej (hosting, baza danych, Apify, Bright Data). Przysługują Państwu prawa opisane w części „Prawa osób, których dane dotyczą”, w tym prawo sprzeciwu (art. 21 RODO) oraz skargi do Prezesa UODO. Ze względu na charakter źródła (publiczne ogłoszenia) informacja jest udzielana przez publikację niniejszej klauzuli (art. 14 ust. 5 lit. b RODO). Numerów telefonów z ogłoszeń nie wykorzystujemy do marketingu bezpośredniego <Ph>[DO POTWIERDZENIA z Danielem i kancelarią: faktyczne użycie numerów z ogłoszeń]</Ph>.
              </P>

              <H2>Przekazywanie danych do państw trzecich</H2>
              <P>
                Niektórzy z wymienionych dostawców mają siedzibę w USA lub przetwarzają tam dane. Przekazanie do USA opieramy na decyzji wykonawczej Komisji Europejskiej (EU-US Data Privacy Framework), o ile dany odbiorca jest certyfikowany, a w pozostałych przypadkach na standardowych klauzulach umownych Komisji Europejskiej (art. 46 ust. 2 lit. c RODO). Dotyczy to w szczególności Vercel, Railway, Supabase, Anthropic, OpenAI, Replicate, Cloudflare, Google i Meta (o ile mają siedzibę w USA lub przetwarzają tam dane). Kopię zabezpieczeń otrzymają Państwo na żądanie, kontaktując się z nami pod podanymi danymi.
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
                <LI>Prawo do cofnięcia zgody na przetwarzanie danych w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem.</LI>
                <LI>Prawo do wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl).</LI>
              </UL>
              <H3>Prawo sprzeciwu – zwrócenie uwagi</H3>
              <P>
                Mają Państwo prawo w dowolnym momencie wnieść sprzeciw z przyczyn związanych z Państwa szczególną sytuacją wobec przetwarzania danych osobowych opartego na art. 6 ust. 1 lit. f RODO (art. 21 ust. 1 RODO). Jeżeli dane osobowe są przetwarzane na potrzeby marketingu bezpośredniego, mają Państwo prawo w dowolnym momencie, bez podawania przyczyn, wnieść sprzeciw wobec przetwarzania dotyczących Państwa danych na potrzeby takiego marketingu (art. 21 ust. 2 RODO). Wystarczy sprzeciw przesłany e-mailem na adres <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
              </P>

              <H2>Okres przechowywania danych</H2>
              <P>
                Państwa dane osobowe będą przechowywane przez okres niezbędny do realizacji celów przetwarzania, a po tym czasie przez okres oraz w zakresie wymaganym przez przepisy prawa lub dla zabezpieczenia ewentualnych roszczeń. W szczególności:
              </P>
              <UL>
                <LI>zapytania i dane kontaktowe bez zawarcia umowy (poszukiwania, prośby o kontakt, zapytania o wycenę): do <Ph>[OKRES PRZECHOWYWANIA — propozycja 12 miesięcy, PRAWNIK]</Ph> od ostatniego kontaktu, w razie cofnięcia zgody lub sprzeciwu – krócej;</LI>
                <LI>dowód udzielonych zgód: do upływu terminu przedawnienia ewentualnych roszczeń, nie dłużej niż <Ph>[3]</Ph> lata od końca roku, w którym zgodę cofnięto lub zakończono przetwarzanie;</LI>
                <LI>dane umowne: przez czas trwania umowy, a następnie przez <Ph>[5]</Ph> lat od końca roku kalendarzowego, w którym powstał obowiązek podatkowy i rachunkowy; w razie potrzeby dłużej dla ochrony roszczeń (przedawnienie według polskiego prawa cywilnego, do <Ph>[6]</Ph> lat);</LI>
                <LI>dane zbierane na podstawie przepisów o przeciwdziałaniu praniu pieniędzy: <Ph>[5]</Ph> lat od zakończenia stosunków gospodarczych;</LI>
                <LI>dzienniki serwera: <Ph>[30]</Ph> dni.</LI>
              </UL>

              <H2>Zmiany i wersje językowe</H2>
              <P>
                Aktualizujemy niniejszą politykę, gdy zmienia się sposób przetwarzania lub stan prawny. Stan na: <Ph>[DD.MM.RRRR]</Ph>. Dla użytkowników korzystających ze strony w języku niemieckim wiążąca jest wersja niemiecka (<a href="/de/datenschutz" style={link}>/de/datenschutz</a>); niniejsza wersja polska obowiązuje użytkowników korzystających ze strony w języku polskim. Obie wersje opisują te same czynności przetwarzania.
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
