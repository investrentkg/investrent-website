import type { Metadata } from 'next'
import LegalShell, { H2, H3, P, UL, LI } from '@/components/legal/LegalShell'

// Niemieckie tlumaczenie polskiej polityki prywatnosci (/rodo) + uzupelnienia
// dla odbiorcow z Niemiec (kalkulator wyceny AI, Cloudflare Turnstile, formularze
// Meta "Suchwuensche", kontakt tel./e-mail - UWG par. 7, podprocesorzy, prawa osob).
// STATUS: po przegladzie prawnym z 25.09.2026 (_wspolne_pliki\przeglad_prawny_de_datenschutz_impressum_2026_09_25.md)
// wdrozono gotowe teksty prawnika. Wersja uzgodniona 28.09.2026 (Agent Prawnik, runda 3): baza = lokalny wt_website_de ac57b28 (Krytyk 25.09) +
// zdania o DPA oparte WYLACZNIE na potwierdzonych faktach (dostawcy_dpa_zrodla, aktualizacja 27.09) - patrz de_przeglad_prawny_runda3_2026_09_28.md.
// Brak widocznych placeholderow. Stand: ustawic na dzien publikacji.
// Daniela (sad rejestrowy, zarzad, okresy przechowywania, region serwerow, data Stand). Dane spolki: odpis KRS/VIES 25.09.2026.
// Komentarze PRAWNIK = punkty do koncowego potwierdzenia przez kancelarie.
// Ta wersja jest wiazaca dla uzytkownikow z DE; fakty musza byc zgodne z /rodo (PL).

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO durch die Investrent sp. z o.o., Kołobrzeg (Polen).',
  robots: { index: true, follow: true },
  // og:locale wg Audytu Wizualnego 28.09 (strona DE dziedziczyla pl_PL z root layoutu; lang="de" jest na kontenerze segmentu, src/app/de/layout.tsx)
  openGraph: {
    title: 'Datenschutzerklärung',
    description: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO durch die Investrent sp. z o.o., Kołobrzeg (Polen).',
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.investrent.com.pl/de/datenschutz',
    siteName: 'InvestRent Nieruchomości',
    images: [{ url: '/hero.jpg', width: 1920, height: 1080, alt: 'InvestRent Nieruchomości Kołobrzeg' }],
  },
  alternates: {
    canonical: 'https://www.investrent.com.pl/de/datenschutz',
    languages: {
      pl: 'https://www.investrent.com.pl/rodo',
      de: 'https://www.investrent.com.pl/de/datenschutz',
    },
  },
}

const link = { color: '#1a4fa0' }

export default function DatenschutzPage() {
  return (
    <LegalShell title="Datenschutzerklärung">
      <P>
        Der Schutz Ihrer Privatsphäre und Ihrer personenbezogenen Daten ist für die Investrent sp. z o.o. von zentraler Bedeutung. Nachfolgend informieren wir Sie darüber, wie wir Ihre personenbezogenen Daten verarbeiten – gemäß der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates vom 27. April 2016 (Datenschutz-Grundverordnung, DSGVO).
      </P>

      <P>
        Unsere Vermittlungsleistungen beziehen sich auf Immobilien in der Republik Polen und werden von Polen aus erbracht. Wir kontaktieren Sie grundsätzlich nur auf Ihre Anfrage bzw. mit Ihrer Einwilligung; Ausnahme: Personen, die selbst eine Immobilie inseriert haben (siehe Abschnitt 8). Werbenachrichten per E-Mail, SMS oder Messenger senden wir ohne Einwilligung nicht.
        {/* Zmiana 28.09.2026 wg Prawnika (pkt 4.3): wyjatek dla osob, ktore same wystawily ogloszenie (decyzja Daniela 26.09: czasem dzwonimy do sprzedajacych); uslugi w Polsce (spojnie z Impressum i § 34c GewO - PRAWNIK). */}
      </P>

      <H2>1. Verantwortlicher</H2>
      <P>
        Verantwortlicher im Sinne der DSGVO ist die Investrent sp. z o.o. (INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ), ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg (Kolberg), Polen, eingetragen im Handelsregister (Krajowy Rejestr Sądowy) beim Amtsgericht Koszalin (Sąd Rejonowy w Koszalinie), IX. Wirtschaftsabteilung des Landesgerichtsregisters, unter der KRS-Nummer 0001069797, REGON 526973936, Steuernummer (NIP) 671 185 85 59.
        {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacja */}
        {/* ERLEDIGT (Przeglad 3.1): tekst prawnika wdrozony; KRS/REGON/NIP/adres z odpisu KRS (zapis "12/1 lok. 3" jest poprawny). Sad rejestrowy wpisany wg decyzji Daniela 25.09.2026 (Amtsgericht Koszalin, IX. Wirtschaftsabteilung) - DO WERYFIKACJI z pelnym odpisem KRS. */}
      </P>
      <P>
        Vertreten durch die Geschäftsführung (Vorstand, zarząd); die beiden Mitglieder Daniel Kamiński und Dawid Sadownik sind jeweils einzelvertretungsberechtigt.
        {/* Zarzad wg decyzji Daniela 25.09.2026 (odpis KRS: reprezentacja jednoosobowa) - do weryfikacji z odpisem */}
      </P>
      <P>
        Kontakt in Datenschutzangelegenheiten: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>, Telefon +48 731 554 341.
        Einen Datenschutzbeauftragten haben wir nicht benannt, da hierzu keine gesetzliche Verpflichtung besteht.
        {/* ERLEDIGT (Przeglad 3.1, pkt 6 uwag): wariant "nie powolano IOD". Jesli Daniel powola IOD, zamienic na: "Unser Datenschutzbeauftragter ist [Name], erreichbar unter [E-Mail]." Art. 27 (przedstawiciel) niepotrzebny - administrator z siedziba w UE. */}
      </P>

      <H2>2. Zwecke und Rechtsgrundlagen der Verarbeitung</H2>
      <P>Ihre personenbezogenen Daten werden verarbeitet zum Zweck</P>
      <UL>
        <LI>der Erbringung von Dienstleistungen im Zusammenhang mit dem Immobilienverkehr entsprechend dem geschlossenen Vertrag bzw. zur Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO);</LI>
        <LI>der Erfüllung rechtlicher Pflichten, denen der Verantwortliche unterliegt, insbesondere aus dem polnischen Steuer- und Rechnungslegungsrecht und den polnischen Vorschriften zur Bekämpfung der Geldwäsche (Art. 6 Abs. 1 lit. c DSGVO);</LI>
        <LI>der Wahrung berechtigter Interessen des Verantwortlichen, etwa der Geltendmachung von Ansprüchen oder der Verteidigung gegen Ansprüche sowie der Abwehr von Missbrauch und automatisierten Zugriffen (Art. 6 Abs. 1 lit. f DSGVO);</LI>
        <LI>der Zusendung von Werbe- und Marketinginformationen auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</LI>
      </UL>

      <H2>3. Hosting, technische Bereitstellung und eingebettete Inhalte</H2>
      <P>
        Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf verarbeitet der Hosting-Anbieter technisch erforderliche Verbindungsdaten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse am sicheren und stabilen Betrieb der Website). Diese Daten speichert der Hosting-Anbieter (Vercel) in Server-Logdateien nach seinen eigenen Vorgaben und Fristen; API-Anfrageprotokolle bei Railway werden bis zu 30 Tage gespeichert, die IP-Adresse nutzen wir in unserer Anwendung nur kurzzeitig für die Begrenzung der Anfragen. Die Anwendungsschnittstelle (API) unseres CRM-Systems wird bei Railway Corp. betrieben, die Datenbank bei Supabase Inc. Die Datenbank liegt in der EU-Region Irland (Supabase, eu-west-1), die API läuft in der EU-Region Niederlande (Railway, europe-west4); die Funktionen der Website laufen bei Vercel in Frankfurt (fra1), statische Inhalte werden über das Vercel-Netzwerk ausgeliefert. Mit Vercel, Railway und Supabase bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO; die Bedingungen sind abrufbar bei <a href="https://vercel.com/legal/dpa" target="_blank" rel="noopener noreferrer" style={link}>Vercel</a>, <a href="https://railway.com/legal/dpa" target="_blank" rel="noopener noreferrer" style={link}>Railway</a> und <a href="https://supabase.com/legal/dpa" target="_blank" rel="noopener noreferrer" style={link}>Supabase</a>. {/* Agent Prawnik 28.09.2026: jedna formula transferow (sekcja 11) zamiast mechanizmu per dostawca. Ponizej stan z DPA, nadal aktualny: */ /* Stan 27.09.2026 (Bezpieczenstwo, dostawcy_dpa_zrodla): Vercel Pro od 26.09 (DPA obejmuje konto), Railway DPA podpisane 26.09 (w dokumencie 'InvestRent sp. z o.o.' bez pelnej nazwy/KRS - aneks zalecany, nie blokuje), Supabase automatycznie (Version 1, 01.08.2026). Zdanie 'bestehen' jest zatem prawdziwe; przed publikacja potwierdzic, ze Vercel nadal na Pro. */}Zu Übermittlungen in Drittländer siehe Abschnitt 11.
        {/* ERLEDIGT (Przeglad 3.3): tekst prawnika. Regiony zweryfikowane 25.09.2026: Supabase eu-west-1 (get_project), Railway europe-west4 (multiRegionConfig prod), Vercel fra1 (vercel.json) - patrz _wspolne_pliki\de_fakty_do_polityki_weryfikacja_2026_09_25.md. Daniel: okres logow, potwierdzenie podpisanych DPA. Paragraf o Google Analytics USUNIETY (uwaga 11): layout.tsx uruchamia GA4 tylko po ustawieniu NEXT_PUBLIC_GA_MEASUREMENT_ID - PRZED ustawieniem tej zmiennej w Vercelu trzeba wdrozyc baner zgod (§ 25 TDDDG), osobna sekcje i transfer. */}
      </P>
      <H3>Eingebettete Inhalte Dritter (Zwei-Klick-Lösung)</H3>
      <P>
        Auf einzelnen Unterseiten können Inhalte von Drittanbietern eingebunden sein: auf den Seiten „Kontakt“, „Über uns“ und den Objektseiten eine Karte von Google Maps (Google Ireland Limited), auf Objektseiten – sofern für das Objekt hinterlegt – Videos von YouTube (Google Ireland Limited) bzw. Vimeo. Diese Inhalte werden erst geladen, wenn Sie auf die Schaltfläche „Karte laden“ bzw. „Video laden“ klicken; vorher findet keine Verbindung zu den Servern der Anbieter statt. Mit dem Klick verbinden Sie sich mit den Servern des jeweiligen Anbieters, der Ihre IP-Adresse verarbeitet und Informationen (z. B. Cookies) auf Ihrem Endgerät speichern oder abrufen kann; die Einwilligung erteilen Sie durch den Klick (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG) und können sie durch Neuladen der Seite beenden. YouTube-Videos laden wir im erweiterten Datenschutzmodus (youtube-nocookie.com). Ihre Entscheidung wird nur im Arbeitsspeicher Ihres Browsers gehalten und nicht in Cookies oder im lokalen Speicher abgelegt; nach dem Neuladen der Seite ist erneut ein Klick nötig. Zusätzlich verlinken wir „In Google Maps öffnen“ als einfachen Link: erst wenn Sie ihn anklicken, verlassen Sie unsere Website.
        {/* Click-to-load wdrozony 25.09.2026 (src/components/ConsentEmbed.tsx): Google Maps (Contact, o-nas, oferty/[id]), YouTube (nocookie, IFrame API dopiero po kliknieciu), Vimeo (dnt=1). PRAWNIK: potwierdzic, ze klik = wystarczajaca zgoda (§ 25 Abs. 1 TDDDG / Art. 7). */}
      </P>
      <P>
        Fotos von Objekten und Mitarbeitenden sowie Bilder in Blogbeiträgen werden aus dem Speicher unseres Datenbankanbieters (Supabase Storage) geladen (Art. 6 Abs. 1 lit. f DSGVO); einzelne Stockfotos von Unsplash werden über unseren Hosting-Anbieter Vercel ausgeliefert, sodass Ihr Browser dafür keine Verbindung zu Unsplash herstellt. Google-Bewertungen zeigen wir ohne Profilbilder. Die von uns verwendeten Schriftarten werden von unserem eigenen Server ausgeliefert. Wir selbst setzen auf dieser Website keine Cookies und speichern keine Daten im lokalen Speicher Ihres Browsers.
        {/* Fakty 25.09.2026: grep src - brak document.cookie/localStorage/sessionStorage; next/font (self-hosted); zdjecia <Image unoptimized>/<img> ladowane bezposrednio z Supabase Storage; About.tsx i okladki bloga - Unsplash; Reviews Avatar <img src={avatar}> z API. GA4 tylko po ustawieniu env (usuniete z tekstu). */}
      </P>

      <H2>4. Anfragen über Formulare, Rückruf und Chat auf der Website</H2>
      <P>
        Wenn Sie über ein Formular unserer Website (z. B. Kontakt-, Rückruf- oder Angebotsanfrage) oder den Chat Kontakt aufnehmen, verarbeiten wir die von Ihnen eingegebenen Daten (z. B. Name, Telefonnummer, E-Mail-Adresse, Nachricht, Bezug zu einem Angebot), um Ihre Anfrage zu bearbeiten und Sie zu kontaktieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (Bearbeitung von Anfragen). Die Daten werden in unserem internen CRM-System gespeichert; Zugriff haben nur berechtigte Mitarbeitende der Investrent sp. z o.o. und – soweit für Ihre Anfrage erforderlich – die in Abschnitt 10 genannten Empfänger.
      </P>
      <P>
        Der Chat auf unserer Website ist ein Nachrichtenformular: Ihre Nachricht wird von unseren Mitarbeitenden bearbeitet; ein KI-Chatbot kommt dort nicht zum Einsatz.
        {/* PRAWNIK (uwaga 14, AI Act art. 50): kod ChatWidget.tsx to formularz (imie, telefon, "czego szukasz") wysylajacy lead - nie bot AI; zdanie zgodne ze stanem kodu z 25.09.2026, do potwierdzenia przez Daniela (pkt 9 listy). Jesli powstanie bot AI - dopisac informacje o interakcji z AI. */}
        {/* PRAWNIK (Art. 13): formularze na stronie (Contact, CallbackStrip, HeroWidget, WycenaModal, OfferDetail, ChatWidget) maja tylko notke "Dane chronione zgodnie z RODO" BEZ linku i bez osobnych zgod - lista zmian w _wspolne_pliki\de_zgody_per_kanal_miejsca_i_klauzule_2026_09_25.md (osobny zakres). */}
      </P>

      <H2>5. Immobilienbewertung (Bewertungsrechner)</H2>
      <P>
        Unser Bewertungsrechner (KI-gestützte, unverbindliche Wertspanne für Immobilien in Kołobrzeg und ausgewählten Ortschaften der Region (Liste im Formular)) steht derzeit nur in polnischer Sprache zur Verfügung und richtet sich nicht an Nutzer dieser deutschen Fassung. Alle Informationen zur Datenverarbeitung im Rechner (Eingaben zur Immobilie, eingesetzte KI-Dienstleister, Rückrufwunsch mit einem Kontrollkästchen (Einwilligung in einen Anruf zur Bewertung), Schutz vor Missbrauch) finden Sie in der polnischen Datenschutzerklärung unter <a href="/rodo" style={link}>/rodo</a>; insoweit ist die polnische Fassung maßgeblich. Sollte der Rechner künftig auf Deutsch angeboten werden, ergänzen wir diese Erklärung vor dem Start.
        {/* Runda 2 (25.09.2026): kalkulator (PR #21) jest tylko po polsku - polityka DE nie opisuje go jako uslugi dla DE. Pelny opis (Anthropic, dwa pola zgody, Turnstile) w /rodo; wersja DE kalkulatora ze zgodami po niemiecku = decyzja Rozwoju Produktu (klauzule DE w _wspolne_pliki\de_zgody_per_kanal_miejsca_i_klauzule_2026_09_25.md pkt 2). Usunieto zwrot "ab Einfuehrung ..." (przeglad 2.2). */}
      </P>

      <H2>6. Schutz vor automatisierten Zugriffen (Cloudflare Turnstile)</H2>
      <P>
        Auf den deutschsprachigen Seiten dieser Website setzen wir Cloudflare Turnstile nicht ein. Der Dienst (Cloudflare, Inc., USA) wird ausschließlich auf der polnischsprachigen Seite des Bewertungsrechners geladen; Einzelheiten stehen in der polnischen Fassung unter <a href="/rodo" style={link}>/rodo</a>; insoweit ist die polnische Fassung maßgeblich.
        {/* Opis Turnstile wg kodu PR #21 przeniesiony do /rodo (kalkulator tylko PL). */}
      </P>

      <H2>7. Kontaktformulare auf Facebook und Instagram („Suchwünsche“ / Lead Ads)</H2>
      <P>
        Im Rahmen von Werbekampagnen auf Facebook und Instagram nutzen wir Kontaktformulare (Lead Ads bzw. Instant Forms, im deutschsprachigen Raum teils als „Suchwünsche“ bezeichnet), die von Meta bereitgestellt werden. Wenn Sie ein solches Formular ausfüllen, gelangen die von Ihnen übermittelten Daten (Vor- und Nachname, E-Mail-Adresse sowie ggf. Antworten auf Qualifizierungsfragen, z. B. zu Lage, Budget oder Objektart) zunächst zu Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irland (und ggf. weiteren Meta-Unternehmen). Von dort werden sie über die offizielle Schnittstelle von Meta (Graph API) automatisch in unser internes CRM-System übertragen, ausschließlich zu dem Zweck, Sie hinsichtlich des Immobilienangebots bzw. Ihres Suchwunsches zu kontaktieren. Zugriff haben nur berechtigte Mitarbeitende der Investrent sp. z o.o. und – soweit für Ihre Anfrage erforderlich – die in Abschnitt 10 genannten Empfänger. Diese Daten unterliegen denselben Grundsätzen zu Speicherung, Schutz und Betroffenenrechten wie in den übrigen Abschnitten dieser Erklärung beschrieben.
      </P>
      <P>
        Rechtsgrundlage für die Bearbeitung Ihres Suchwunsches ist Art. 6 Abs. 1 lit. b DSGVO. Für Werbung per E-Mail holen wir Ihre ausdrückliche Einwilligung ein (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 3 UWG). Diese erteilen Sie im Formular durch gesonderte, aktive Auswahl eines einzelnen, optionalen Kontrollkästchens (Kontakt per E-Mail); sie ist freiwillig und für die Bearbeitung Ihres Suchwunsches nicht erforderlich. Eine Kontaktaufnahme per Telefon, SMS oder über WhatsApp auf Grundlage dieses Formulars erfolgt nur, wenn Sie hierfür gesondert eingewilligt haben (siehe unten). Zum Nachweis Ihrer Einwilligung speichern wir die Kennung Ihrer Formular-Einreichung (leadgen_id), die Kennung des Formulars, den Zeitpunkt der Einreichung und die Version des Formulars (Art. 7 Abs. 1 DSGVO). {/* Dowod zgody z importu Meta: ZWERYFIKOWANY w kodzie CRM origin/main 25.09.2026 (PR #472: lib/consentRules.ts buildMetaImportMarker -> linia [Meta-zgoda] leadgen_id/form_id/czas/wersja, podpisana HMAC; zapis w lib/metaLeadsImport.ts:342-344, 422; zmienna UNSUBSCRIBE_HMAC_SECRET ustawiona w Railway prod). Zakres deklaracji ostrozny (identyfikatory, czas, wersja formularza) - NIE obiecujemy zapisu pelnej tresci. Nie potwierdzono na zywym wpisie; jesli backend nie dziala na produkcji - usunac zdanie do czasu wdrozenia. */} Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Meta stellt uns die im Formular erhobenen Daten zum Abruf bereit und verarbeitet sie insoweit als unser Auftragsverarbeiter nach den Datenverarbeitungsbedingungen von Meta; für die Ausspielung der Anzeigen verarbeitet Meta Daten in eigener Verantwortung bzw. nach dem Controller Addendum (<a href="https://www.facebook.com/legal/controller_addendum" style={link} target="_blank" rel="noopener noreferrer">facebook.com/legal/controller_addendum</a>). Es gelten die Datenschutzhinweise von Meta (<a href="https://www.facebook.com/privacy/policy" style={link} target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>).
        {/* ERLEDIGT (Przeglad 3.6, uwagi 2 i 9): tekst prawnika; z zastrzezenia w nawiasie usunieto szablon "[Rolle von Meta ...]" - rola Meta (przetwarzajacy dla danych z formularza; odrebny/wspoladministrator dla emisji reklam) MUSI zostac potwierdzona przez kancelarie (pytanie 3) i Daniela (warunki Meta / Business Manager, pkt 11 listy). DECYZJA Dyrektora 25.09.2026: formularz Meta ma JEDNO opcjonalne pole zgody na kontakt e-mail; telefon i WhatsApp na podstawie tego formularza NIE sa oferowane (tekst dostosowany do stanu faktycznego). Marketing: pole musi byc faktycznie w formularzu przed startem kampanii. Zgode na uzycie danych z leadow do Custom/Lookalike Audiences wymaga odrebnej podstawy - tu nie deklarujemy takiego uzycia. */}
        {/* AKTUALIZACJA 01.10.2026 (RP, formularz "Kolberg DE v3" - zgoda Prawnika+Krytyka, _wspolne_pliki\formularz_DE_v3_tekst_zgody_telefon_FINAL_2026_10_01.md): kategoryczne zdanie o braku telefonu/WhatsApp zastapione zdaniem warunkowym, bo przynajmniej jeden formularz (Kolberg DE v3) ma teraz osobne opcjonalne pole telefonu + zgode na ten kanal - patrz nowy akapit nizej. */}
      </P>
      <P>
        Zusätzlich können Sie über ein weiteres, gesondertes und ebenfalls optionales Kontrollkästchen einwilligen, dass wir Ihnen per E-Mail auch Wohnungsangebote und Informationen rund um den Wohnungskauf aus den folgenden Orten zusenden: Dźwirzyno, Grzybowo, Zieleniewo, Bogucino, Budzistowo, Ustronie Morskie, Sarbinowo, Karlino, Gościno, Siemyśl und Rymań (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 3 UWG). Diese Einwilligung ist unabhängig von der oben genannten Einwilligung für Kolberg: Sie können beide unabhängig voneinander erteilen oder verweigern, und keine von beiden ist für die Bearbeitung Ihres Suchwunsches erforderlich. Für Nachweis, Speicherung und Widerruf dieser Einwilligung gilt das oben zur Einwilligung für Kolberg Gesagte entsprechend.
        {/* NOWY AKAPIT 02.10.2026 (RP, zlecenie Prawnika przez Dyrektora): osobna, opcjonalna zgoda e-mail na oferty z okolicznych miejscowosci (nie tylko Kolobrzeg) - finalna wersja PO poprawce Krytyka/Prawnika (pierwsza wersja miala otwarta kategorie "aus der Umgebung von Kolberg, namentlich aus: ..." zamiast zamknietej listy - ZAMIENIONA na "aus den folgenden Orten: ..."). Lista miejscowosci MUSI byc identyczna z tekstem checkboxa w formularzu Meta (ten PR jest warunkiem wstepnym przed podpieciem formularza v4 z tym polem zgody - Marketing czeka na wdrozenie tego tekstu na produkcje). Jesli lista sie zmieni: zaktualizowac TUTAJ i w tekscie formularza razem (brak dzis wspolnej stalej miedzy tym repo a konfiguracja formularza Meta - formularz nie jest w kodzie tego repo). */}
      </P>
      <P>
        Wenn Sie zusätzlich Ihre Telefonnummer angeben und das gesondert vorgesehene Kontrollkästchen aktiv auswählen, dürfen wir Sie unter dieser Nummer auch telefonisch, per SMS oder über WhatsApp zu Ihrer Anfrage kontaktieren (Art. 6 Abs. 1 lit. a DSGVO). Diese Einwilligung ist freiwillig und für die Bearbeitung Ihrer Anfrage nicht erforderlich. Bei Kontakt über WhatsApp verarbeitet Meta Platforms Ireland Limited Ihre Daten im Rahmen des WhatsApp-Business-Dienstes als unser Auftragsverarbeiter (Einzelheiten siehe Abschnitt 10). Ihre Telefonnummer und der Nachweis dieser Einwilligung speichern wir, solange es zur Bearbeitung Ihrer Anfrage erforderlich ist. Wenn Sie eine Telefonnummer angeben, ohne dieses Kontrollkästchen auszuwählen, kontaktieren wir Sie ausschließlich per E-Mail.
        {/* NOWY AKAPIT 01.10.2026 (RP): Tekst 2 z formularz_DE_v3_tekst_zgody_telefon_FINAL_2026_10_01.md, ZATWIERDZONY przez Krytyka (9/10) i Prawnika (rozstrzygniecie w tym samym pliku). Retencja bez nawiasu "12 Monate" - job retencji telefon/WhatsApp nie istnieje (zgodnie z decyzja Prawnika/Daniela 01.10.2026); nawias doda sie po wdrozeniu joba. Zdanie koncowe z "Wenn" wg sugestii stylistycznej Krytyka (9/10, nie blokujaca). */}
      </P>

      <H2>8. Kontaktaufnahme</H2>
      <P>
        Wir kontaktieren Sie grundsätzlich nur auf Ihre Anfrage bzw. mit Ihrer Einwilligung. Eine Ausnahme betrifft Personen, die selbst eine Immobilie auf einem Portal zum Verkauf inseriert haben: Bei ihnen rufen wir gelegentlich an, um uns nach der inserierten Immobilie und einer möglichen Zusammenarbeit zu erkundigen (Einzelheiten und Widerspruchsrecht: Abschnitt 10, „Daten aus öffentlichen Immobilienanzeigen“). Eine von Ihnen ausdrücklich erbetene Antwort, ein erbetener Rückruf oder eine Antwort auf Ihre konkrete Anfrage erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Darüber hinausgehende Nachrichten zu Werbezwecken erhalten Sie nur, wenn Sie in den jeweiligen Kommunikationskanal zuvor ausdrücklich eingewilligt haben: per E-Mail auf Grundlage des optionalen Kontrollkästchens im Formular (siehe Abschnitt 7). Der Rückrufwunsch im (polnischsprachigen) Bewertungsrechner ist keine Werbeeinwilligung: Der Anruf betrifft ausschließlich die Bewertung Ihrer Immobilie (siehe polnische Fassung unter /rodo; insoweit ist die polnische Fassung maßgeblich). Werbung per Messenger (z. B. WhatsApp) führen wir nicht durch, es sei denn, Sie haben uns hierfür ausdrücklich Ihre Einwilligung erteilt (siehe Abschnitt 7); schreiben Sie uns von sich aus über WhatsApp (ein Dienst von Meta, der Daten nach eigenen Datenschutzhinweisen verarbeitet), antworten wir auf Ihre konkrete Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Sie können Ihre Einwilligung jederzeit widerrufen (siehe Abschnitt 15); nach dem Widerruf erhalten Sie keine Werbung mehr über den betroffenen Kanal.
        {/* Zmiana 02.10.2026 wg Prawnika (przez Dyrektora): do zdania o Messengerze/WhatsApp dopisany wyjatek "es sei denn, Sie haben uns hierfuer ausdruecklich Ihre Einwilligung erteilt (siehe Abschnitt 7)" - zdanie bez wyjatku bylo sprzeczne z zatwierdzonym akapitem §7 o zgodzie telefon/SMS/WhatsApp. */}
        {/* Zmiana 28.09.2026 wg Prawnika (pkt 4.2): wyjatek dla osob, ktore same wystawily ogloszenie; oddzwonienie w kalkulatorze PL nie jest zgoda marketingowa. Zgoda marketingowa (e-mail Meta) pozostaje opcjonalna. DECYZJA 25.09.2026: zgody Meta = tylko e-mail. Deklaracja "Double-Opt-in" usunieta: w kodzie CRM nie ma mailingu marketingowego ani DOI. */}
      </P>

      <H2>9. Nutzung von Google-Diensten (Google API Services)</H2>
      <P>
        Unser internes CRM-System (nur für Mitarbeitende der Investrent sp. z o.o.; kein Bestandteil des Website-Besuchs) verbindet sich mit ausgewählten Google-Diensten (Google Unternehmensprofil, Google Kalender, Google Analytics – sofern aktiviert – und Google Search Console des Firmenkontos), um das Unternehmensprofil und die Termine der Investrent sp. z o.o. zu verwalten und Statistiken auszuwerten. Die über die Google-API erhaltenen Daten werden nur für diese Funktionen verwendet und weder an Dritte weitergegeben noch für Werbezwecke genutzt. Die Nutzung und Weitergabe von aus der Google-API erhaltenen Informationen unterliegt der Google API Services User Data Policy, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use). Die ausführliche Beschreibung finden Sie in der polnischen Fassung unter <a href="/rodo" style={link}>/rodo</a>; insoweit ist die polnische Fassung maßgeblich.
        {/* ERLEDIGT (Przeglad, uwaga 16): skrocone; pelny opis (wymagany do weryfikacji OAuth Google) zostaje w /rodo. */}
      </P>

      <H2>10. Empfänger der Daten und Auftragsverarbeiter</H2>
      <P>Ihre personenbezogenen Daten können weitergegeben werden an:</P>
      <UL>
        <LI>Kooperationspartner im Immobilienverkehr (z. B. Bauträger/Verkäufer des angefragten Objekts, andere Vermittler und Notare), soweit dies für die Bearbeitung Ihres Anliegens erforderlich ist und Sie dem zugestimmt haben bzw. es zur Durchführung Ihrer Anfrage notwendig ist;</LI>
        <LI>Auftragsverarbeiter, die Daten in unserem Auftrag verarbeiten, z. B. IT-Dienstleister – auf Grundlage eines Vertrags mit uns und ausschließlich nach unseren Weisungen;</LI>
        <LI>Rechtsanwaltskanzleien, Steuerberater und Buchhaltungsunternehmen, die je nach Art der Beauftragung als Auftragsverarbeiter oder – soweit sie berufsrechtlich eigenverantwortlich handeln – als eigenständige Verantwortliche tätig werden;</LI>
        <LI>Behörden und sonstige Stellen, soweit wir hierzu aufgrund gesetzlicher Vorschriften berechtigt oder verpflichtet sind (z. B. im Rahmen der Pflichten zur Bekämpfung der Geldwäsche).</LI>
      </UL>
      <P>Zu den von uns eingesetzten Dienstleistern gehören insbesondere:</P>
      <UL>
        <LI>Vercel Inc. (USA) – Hosting der Website;</LI>
        <LI>Railway Corp. (USA) – Betrieb der Anwendungsschnittstelle (API) des CRM-Systems;</LI>
        <LI>Supabase Inc. – Datenbank und Speicher (Serverstandort siehe Abschnitt 3);</LI>
        <LI>Brevo (Sendinblue SAS, Frankreich) – Versand von E-Mails (Benachrichtigungen an unsere Mitarbeitenden, z. B. über neue Anfragen, sowie E-Mails an Kunden);</LI>
        <LI>Anthropic, PBC (USA) – KI-Dienstleister für den Bewertungsrechner, die Textverarbeitung und die Übersetzung von Nachrichten;</LI>
        <LI>OpenAI (USA) – Umwandlung von Sprachaufnahmen der Mitarbeitenden in Text (Sprachassistent im CRM);</LI>
        <LI>Replicate (USA) – Bildbearbeitung von Objektfotos und automatische Untertitel für Videos unserer Mitarbeitenden;</LI>
        <LI>Google (Gemini API, Google Ireland Limited bzw. Google LLC) – Erstellung von Objektplakaten aus Objektfotos;</LI>
        <LI>Apify und Bright Data – Abruf öffentlich zugänglicher Immobilienanzeigen von Portalen sowie Bildbearbeitungsdienste für Objektfotos;</LI>
        <LI>Cloudflare, Inc. (USA) – Schutz vor automatisierten Zugriffen (Turnstile, nur auf der polnischsprachigen Rechner-Seite);</LI>
        <LI>Meta Platforms Ireland Limited (Irland) – Kontaktformulare auf Facebook/Instagram sowie, soweit Sie uns Ihre Einwilligung erteilt haben, Kontaktaufnahme über WhatsApp (WhatsApp Business);</LI>
        <LI>Google Ireland Limited (Irland) – Google-Dienste (siehe Abschnitte 3 und 9).</LI>
      </UL>
      {/* ERLEDIGT (Przeglad 3.8, uwaga 15): kategorie odbiorcow wg prawnika + doprecyzowanie kancelarii/ksiegowych. Daniel/Backend (pkt 9 listy): potwierdzic, czy Brevo jest faktycznie uzywane (jesli nie - usunac pozycje tu i w /rodo); lista dostawcow to jedno zrodlo prawdy z /rodo (art. 30, art. 28). */}

      <H3>KI-Unterstützung im internen CRM</H3>
      <P>
        Unsere Mitarbeitenden nutzen im internen CRM-System Funktionen von Anthropic, PBC (USA), um ihre Arbeit zu unterstützen: zur Auswertung von Gesprächsnotizen, für Vorschläge passender Objekte, für Zusammenfassungen zum Stand Ihrer Anfrage, zur Prüfung von Vertragsentwürfen und für einen Sprachassistenten. Dabei können Inhalte Ihrer Anfrage oder Ihres Vertragsverhältnisses an Anthropic übermittelt werden, z. B. Suchkriterien, Notizen zu Gesprächen, Sprachbefehle sowie – bei der Prüfung eines Vertragsentwurfs – die im Entwurf enthaltenen Angaben zu den Vertragsparteien und zum Objekt (Art. 6 Abs. 1 lit. b und f DSGVO).
      </P>
      <P>
        Ihr Name wird für Objektvorschläge und Zusammenfassungen nicht als gesonderte Angabe übermittelt; in Freitexten wie Notizen oder Sprachbefehlen kann er jedoch vorkommen. Bei Notizen, Sprachbefehlen und der Prüfung von Vertragsentwürfen werden PESEL-, Ausweis- und Kontonummern vor der Übermittlung an Anthropic automatisch maskiert.
      </P>
      <P>
        Anthropic verarbeitet diese Inhalte in unserem Auftrag als Auftragsverarbeiter; die Bedingungen zur Auftragsverarbeitung von Anthropic (Data Processing Addendum) sind abrufbar unter <a href="https://www.anthropic.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer" style={link}>anthropic.com/legal/data-processing-addendum</a>. Nach den Bedingungen für die API von Anthropic werden über die API übermittelte Daten standardmäßig nicht zum Training der Anthropic-Modelle verwendet und in der Regel innerhalb von 30 Tagen gelöscht; Ausnahmen (z. B. gesetzliche Pflichten oder die Prüfung von Missbrauch) sind möglich. Zur Übermittlung in die USA siehe Abschnitt 11. Die Ergebnisse unterstützen nur unsere Mitarbeitenden; Entscheidungen treffen stets Menschen.
        {/* Zakres maskowania wg Krytyka 25.09.2026 (piiMask: notatki, polecenia glosowe po transkrypcji, prześwietlanie umow, tytuly kalendarza); nie obiecujemy absolutnosci. Zrodlo i data sprawdzenia warunkow Anthropic: ZRODLO (sprawdzone 25.09.2026): https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training (domyslnie brak treningu na danych z API/produktow komercyjnych; wyjatek: swiadomy feedback/zgoda) i https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data (API: usuwanie w ciagu 30 dni; wyjatki: naruszenia polityki do 2 lat, wymogi prawa, umowy szczegolne). [do weryfikacji w umowie/DPA] - tekst publiczny oparty na tych stronach, nie na podpisanym DPA; rola 'Auftragsverarbeiter' bez powolywania sie na SCC/umowe powierzenia do czasu potwierdzenia DPA. */}
      </P>

      <H3>Übersetzung von Nachrichten</H3>
      <P>
        Für die Korrespondenz mit Kunden und Interessenten, die mit uns auf Deutsch kommunizieren (Ihre Nachrichten und unsere Antworten, jeweils zwischen Deutsch und Polnisch), übersetzen wir Texte maschinell mit Hilfe von Anthropic, PBC (USA). Dafür wird der Text der jeweiligen Nachricht unverändert an Anthropic übermittelt, also ohne Maskierung von Kennnummern (Art. 6 Abs. 1 lit. b DSGVO; Übermittlung in die USA siehe Abschnitt 11). Anthropic handelt dabei als Auftragsverarbeiter; zu Training und Löschung gilt das oben Gesagte. Maschinelle Übersetzungen können Fehler enthalten; bei Unklarheiten fragen wir gern nach.
        {/* Kod: backend/src/lib/translateText.ts + routes/clientTranslatedEmail.ts (nie uzywa maskPii). */}
      </P>

      <H3>Weitere Dienstleister im internen CRM</H3>
      <P>
        OpenAI wandelt Sprachaufnahmen, die Mitarbeitende an den Sprachassistenten des CRM richten, in Text um; die Aufnahmen können dabei genannte Namen und Telefonnummern von Kunden enthalten. Die Umwandlung der Aufnahme in Text erfolgt bei OpenAI, bevor personenbezogene Kennnummern maskiert werden. Replicate bearbeitet Objektfotos (Entfernung von Wasserzeichen) und erzeugt automatische Untertitel für Videos unserer Mitarbeitenden. Über die Gemini API von Google werden Objektplakate aus Objektfotos erstellt; Name und Telefonnummer der betreuenden Mitarbeitenden werden nicht an Google übermittelt, sondern erst lokal auf dem Plakat ergänzt. Apify und Bright Data rufen für uns öffentlich zugängliche Immobilienanzeigen von Portalen ab. Rechtsgrundlage ist jeweils Art. 6 Abs. 1 lit. f DSGVO. Mit OpenAI und Apify bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO; ihre Bedingungen sind abrufbar bei <a href="https://openai.com/policies/data-processing-addendum/" target="_blank" rel="noopener noreferrer" style={link}>OpenAI</a> und <a href="https://docs.apify.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer" style={link}>Apify</a>. Replicate und Bright Data sind für uns als Auftragsverarbeiter tätig, soweit sie personenbezogene Daten in unserem Auftrag verarbeiten; ihre Bedingungen bzw. Datenschutzhinweise sind abrufbar bei <a href="https://replicate.com/privacy" target="_blank" rel="noopener noreferrer" style={link}>Replicate (Datenschutzerklärung)</a> und <a href="https://brightdata.com/license" target="_blank" rel="noopener noreferrer" style={link}>Bright Data</a>. Für die Gemini API von Google gelten die <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" style={link}>Bedingungen von Google</a>. {/* Stan 27.09.2026: OpenAI i Apify - DPA automatyczne (zalatwione). Replicate: brak publicznego DPA/SCC (strony /dpa 404) - tylko rola 'processor' z polityki prywatnosci, BEZ twierdzenia o umowie/transferze; Daniel pisze na legal@/privacy@replicate.com. Bright Data: brightdata.com niedostepne z srodowiska deweloperskiego, link/rola NIEZWERYFIKOWANE odczytem - przed publikacja otworzyc link recznie. Gemini: status paid-tier NIE potwierdzony - celowo bez deklaracji roli/DPA. */}
        {/* Fakty (kod investrent-crm origin/main 25.09.2026): voice.ts:33 - audio do api.openai.com/v1/audio/transcriptions (whisper-1); lamaWatermarkRemoval.ts, reelAutocaption.ts - Replicate (zdjecia ofert, wideo rolek); geminiPosterGenerator.ts - zdjecia + imie i telefon opiekuna oferty; apify.scraper.ts, homeStaging.ts, photoWatermarkRemoval.ts - Apify (scraping, obrobka zdjec). Nie zgadywano zakresu: tam, gdzie brak dowodu - DO POTWIERDZENIA. */}
      </P>

      <H3>Daten aus öffentlichen Immobilienanzeigen (Art. 14 DSGVO)</H3>
      <P>
        Wenn Ihre Daten in einer öffentlich zugänglichen Immobilienanzeige auf einem Portal (z. B. Otodom, OLX, Facebook Marketplace) stehen und wir sie nicht von Ihnen erhalten haben, verarbeiten wir die in der Anzeige enthaltenen Angaben (insbesondere Telefonnummer, Art des Inserenten, Objektdaten) zur Marktanalyse, Objektbewertung und Prüfung von Anzeigen (Art. 6 Abs. 1 lit. f DSGVO). Quelle sind öffentliche Anzeigen, die wir über Apify und Bright Data abrufen. Die Telefonnummer aus der Anzeige speichern wir nicht länger, als es für die genannten Zwecke erforderlich ist; die übrigen Angaben zur Anzeige (Adresse der Immobilie, Preis, Beschreibung) ohne Telefonnummer können wir länger für Marktstatistiken und Bewertungen verwenden. Ihnen stehen die in Abschnitt 15 genannten Rechte zu, insbesondere das Widerspruchsrecht (Art. 21 DSGVO). Gelegentlich rufen wir Personen an, die eine Anzeige eingestellt haben, um uns nach der Immobilie und einer möglichen Zusammenarbeit zu erkundigen; dem können Sie jederzeit widersprechen (Art. 21 DSGVO), auch im Gespräch oder per E-Mail an biuro@investrent.com.pl.
        {/* Tekst Krytyka 25.09.2026 (Art. 14 po niemiecku, bez odsylacza do PL). */}
      </P>

      <H2>11. Übermittlung in Drittländer</H2>
      <P>
        Einige der genannten Anbieter haben ihren Sitz in den USA oder verarbeiten Daten dort. Übermittlungen an Vercel, Railway, Supabase, Anthropic, OpenAI, Cloudflare, Google und Meta (soweit diese ihren Sitz in den USA haben oder dort Daten verarbeiten) stützen wir auf den Angemessenheitsbeschluss der EU-Kommission (EU-US Data Privacy Framework), soweit der jeweilige Empfänger zertifiziert ist, im Übrigen auf Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO). Für die übrigen in Abschnitt 10 genannten Dienstleister gelten die dort verlinkten Bedingungen der Anbieter. Eine Kopie der bestehenden Garantien erhalten Sie auf Anfrage über die oben genannten Kontaktdaten.
        {/* ERLEDIGT (Przeglad 3.8, uwaga 4): sformulowanie "DPF, zastepczo SCC" wg prawnika (nie opierac wylacznie na DPF). Bez deklaracji, ktory dostawca ma DPF, a ktory SCC - przed publikacja Bezpieczenstwo/Daniel weryfikuja w dataprivacyframework.gov i DPA; TIA dla dostawcow bez DPF do teczki. */}
      </P>

      <H2>12. Freiwilligkeit der Angabe</H2>
      <P>
        Die Bereitstellung personenbezogener Daten ist freiwillig, jedoch erforderlich, um Sie zu kontaktieren, ein Angebot zu erstellen oder einen Immobilienvermittlungsvertrag abzuschließen und durchzuführen. Werden die Daten nicht bereitgestellt, können diese Zwecke gegebenenfalls nicht erreicht werden. Einwilligungen in Werbung sind stets freiwillig.
      </P>

      <H2>13. Automatisierte Entscheidungsfindung</H2>
      <P>
        Wir treffen Ihnen gegenüber keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung. Intern berechnet unser CRM-System für Kontakte eine Prioritätskennzahl (aus Interessenstufe, Verfahrensstand, Zeit seit dem letzten Kontakt und offenen Aufgaben), die unseren Mitarbeitenden anzeigt, wen sie zuerst anrufen sollten (Art. 6 Abs. 1 lit. f DSGVO). Die Kennzahl dient nur der Sortierung: Sie führt nicht automatisch zu einer Ablehnung, Zuteilung oder zu einem Versand; über Kontakt und Angebote entscheiden stets Mitarbeitende. Zum Bewertungsrechner siehe Abschnitt 5.
        {/* ZWERYFIKOWANE 25.09.2026: backend/src/lib/leadScoring.ts = deterministyczny wzor punktowy (temperatura, etap, dni od kontaktu, zadania), zapis clients.ai_score, uzywany tylko do sortowania listy 'Zadzwon dzis' (callToday.ts) - brak automatycznej decyzji. To wciaz 'profilowanie' w szerokim sensie (art. 4 pkt 4) - dlatego jawny opis; art. 22 nie ma zastosowania. PRAWNIK: potwierdzic brzmienie. */}
      </P>

      <H2>14. Speicherdauer</H2>
      <P>
        Ihre personenbezogenen Daten werden so lange gespeichert, wie es zur Erfüllung der Verarbeitungszwecke erforderlich ist, und danach für den Zeitraum und im Umfang, wie er sich aus gesetzlichen Vorschriften ergibt oder zur Sicherung etwaiger Ansprüche erforderlich ist. Insbesondere gilt:
      </P>
      <UL>
        <LI>Anfragen und Kontaktdaten aus Formularen auf der Website (außer dem Bewertungsrechner) und aus Facebook- und Instagram-Formularen ohne Vertragsschluss: nicht länger, als es zur Bearbeitung der Anfrage erforderlich ist; bei Widerruf oder Widerspruch kürzer;</LI>
        <LI>Nachweis der E-Mail-Werbeeinwilligung aus Facebook- und Instagram-Formularen: so lange, wie zum Nachweis der Einwilligung und zur Abwehr von Ansprüchen erforderlich, nicht länger als erforderlich;</LI>
        <LI>Verträge und Dokumente zu Transaktionen: 5 Jahre (nach den maßgeblichen steuer- und buchhaltungsrechtlichen Vorschriften Polens); in laufenden Rechtsstreitigkeiten bis zu deren Abschluss;</LI>
        <LI>Daten, die wir nach den polnischen Vorschriften zur Bekämpfung der Geldwäsche erheben: 5 Jahre nach Beendigung der Geschäftsbeziehung;</LI>
        <LI>Protokolle: API-Anfrageprotokolle bei Railway bis zu 30 Tage; IP-Adresse in unserer Anwendung nur kurzzeitig für die Anfragebegrenzung; Server-Logs des Website-Hostings (Vercel) nach dessen Vorgaben.</LI>
      </UL>
      {/* Okresy wpisane wg decyzji Daniela 25.09.2026 (wersja standardowa) - DO ZATWIERDZENIA PRAWNIE (AML 5 lat i okres podatkowy do weryfikacji w zrodle). UWAGA: CRM na origin/main NIE ma automatycznego usuwania/anonimizacji - sformulowanie jako limit ("nicht laenger als"), nie obietnica automatyzacji; zadania backlogu: _wspolne_pliki\retencja_danych_stan_i_backlog_2026_09_25.md. Przed publikacja wdrozyc joby albo wprowadzic reczna procedure (kwartalny przeglad). */}

      <H2>15. Ihre Rechte</H2>
      <P>Nach der DSGVO stehen Ihnen folgende Rechte zu:</P>
      <UL>
        <LI>Recht auf Auskunft über Ihre Daten und auf Erhalt einer Kopie (Art. 15 DSGVO);</LI>
        <LI>Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO);</LI>
        <LI>Recht auf Löschung (Art. 17 DSGVO) und auf Einschränkung der Verarbeitung (Art. 18 DSGVO);</LI>
        <LI>Recht auf Datenübertragbarkeit (Art. 20 DSGVO);</LI>
        <LI>Recht auf Widerspruch gegen die Verarbeitung, die auf berechtigten Interessen beruht (Art. 21 DSGVO) – bei Direktwerbung jederzeit und ohne Angabe von Gründen;</LI>
        <LI>Recht, eine erteilte Einwilligung jederzeit zu widerrufen, ohne dass die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird (Art. 7 Abs. 3 DSGVO);</LI>
        <LI>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO), siehe Abschnitt 16.</LI>
      </UL>
      <P>
        Zur Ausübung Ihrer Rechte wenden Sie sich bitte an <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
      </P>
      <H3>Hinweis auf Ihr Widerspruchsrecht</H3>
      <P>
        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. f DSGVO erfolgt, Widerspruch einzulegen (Art. 21 Abs. 1 DSGVO). Werden Ihre personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit ohne Angabe von Gründen Widerspruch gegen die Verarbeitung Sie betreffender Daten zum Zwecke derartiger Werbung einzulegen (Art. 21 Abs. 2 DSGVO). Ein Widerspruch genügt in Textform an <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
        {/* ERLEDIGT (Przeglad 3.2, uwaga 8): osobny akapit art. 21 ust. 4; dodatkowo powtorzyc w pierwszej wiadomosci handlowej (procedura marketingu, nie strona). */}
      </P>

      <H2>16. Beschwerderecht bei der Aufsichtsbehörde</H2>
      <P>
        Zuständige Aufsichtsbehörde für den Verantwortlichen ist der Präsident des Amtes für den Schutz personenbezogener Daten in Polen (Prezes Urzędu Ochrony Danych Osobowych, UODO), ul. Stawki 2, 00-193 Warszawa, Polen, <a href="https://uodo.gov.pl" style={link} target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>. Wenn Sie Ihren gewöhnlichen Aufenthalt in Deutschland haben, können Sie sich außerdem an die für Ihren Wohnort zuständige deutsche Datenschutzaufsichtsbehörde (Landesdatenschutzbeauftragte bzw. Landesdatenschutzbeauftragter Ihres Bundeslandes) wenden; eine Übersicht finden Sie beim Bundesbeauftragten für den Datenschutz und die Informationsfreiheit unter <a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html" style={link} target="_blank" rel="noopener noreferrer">bfdi.bund.de</a>.
        {/* PRAWNIK (uwaga 17 - OK): adres UODO i link BfDI do weryfikacji aktualnosci przy publikacji; organ wiodacy (art. 56) - polski, skargi zlozone w DE sa przekazywane. */}
      </P>

      <H2>17. Änderungen dieser Datenschutzerklärung</H2>
      <P>
        Wir passen diese Datenschutzerklärung an, wenn sich die Verarbeitung oder die Rechtslage ändert. Stand: 01.10.2026{/* USTAWIC na dzien faktycznej publikacji przy merge */}. Für Nutzer, die diese Website in deutscher Sprache aufrufen, ist diese deutsche Fassung maßgeblich. Die polnische Fassung finden Sie unter <a href="/rodo" style={link}>/rodo</a>. Beide Fassungen beschreiben dieselben Verarbeitungen; der Bewertungsrechner ist nur auf Polnisch verfügbar und daher nur in der polnischen Fassung beschrieben.
        {/* ERLEDIGT (Przeglad 3.10, uwaga 18): klauzula wersji wiazacej wg prawnika. Daniel: data Stand = data zatwierdzenia/publikacji. */}
      </P>

      <H2>18. Kontakt</H2>
      <P last>
        Bei Fragen zur Verarbeitung personenbezogener Daten erreichen Sie uns schriftlich unter: Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, Polen, oder per E-Mail unter <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
      </P>
    </LegalShell>
  )
}
