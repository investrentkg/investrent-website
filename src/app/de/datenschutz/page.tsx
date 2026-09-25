import type { Metadata } from 'next'
import LegalShell, { H2, H3, P, UL, LI, Ph } from '@/components/de/LegalShell'

// Niemieckie tlumaczenie polskiej polityki prywatnosci (/rodo) + uzupelnienia
// dla odbiorcow z Niemiec (kalkulator wyceny AI, Cloudflare Turnstile, formularze
// Meta "Suchwuensche", kontakt tel./e-mail - UWG par. 7, podprocesorzy, prawa osob).
// STATUS: po przegladzie prawnym z 25.09.2026 (_wspolne_pliki\przeglad_prawny_de_datenschutz_impressum_2026_09_25.md)
// wdrozono gotowe teksty prawnika. Widoczne placeholdery (zolte) = WYLACZNIE dane od
// Daniela (sad rejestrowy, zarzad, okresy przechowywania, region serwerow, data Stand). Dane spolki: odpis KRS/VIES 25.09.2026.
// Komentarze PRAWNIK = punkty do koncowego potwierdzenia przez kancelarie.
// Ta wersja jest wiazaca dla uzytkownikow z DE; fakty musza byc zgodne z /rodo (PL).

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO durch die Investrent sp. z o.o., Kołobrzeg (Polen).',
  robots: { index: true, follow: true },
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

      <H2>1. Verantwortlicher</H2>
      <P>
        Verantwortlicher im Sinne der DSGVO ist die Investrent sp. z o.o. (INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ), ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg (Kolberg), Polen, eingetragen im Handelsregister (Krajowy Rejestr Sądowy) beim <Ph>[Registergericht – laut KRS-Auszug bestätigen]</Ph> unter der KRS-Nummer 0001069797, REGON 526973936, Steuernummer (NIP) 671 185 85 59.
        {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacja */}
        {/* ERLEDIGT (Przeglad 3.1): tekst prawnika wdrozony; KRS/REGON/NIP/adres z odpisu KRS (zapis "12/1 lok. 3" jest poprawny). Daniel: sad rejestrowy (nie ma go w odpisie z API). */}
      </P>
      <P>
        Vertreten durch den Vorstand (zarząd); jedes Mitglied des Vorstands ist einzelvertretungsberechtigt: <Ph>[Vor- und Nachname der beiden Vorstandsmitglieder]</Ph>
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
        Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf verarbeitet der Hosting-Anbieter technisch erforderliche Verbindungsdaten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse am sicheren und stabilen Betrieb der Website). Diese Daten werden in Server-Logdateien für <Ph>[30]</Ph> Tage gespeichert. Die Anwendungsschnittstelle (API) unseres CRM-Systems wird bei Railway Corp. betrieben, die Datenbank bei Supabase Inc.; Serverstandort: <Ph>[Region, z. B. EU (Frankfurt/Irland) – bestätigen]</Ph>. Mit den Anbietern bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO. Zu Übermittlungen in Drittländer siehe Abschnitt 11.
        {/* ERLEDIGT (Przeglad 3.3): tekst prawnika. Daniel: region Supabase/Railway, okres logow, potwierdzenie podpisanych DPA (pkt 9-10 listy). Paragraf o Google Analytics USUNIETY (uwaga 11): layout.tsx uruchamia GA4 tylko po ustawieniu NEXT_PUBLIC_GA_MEASUREMENT_ID - PRZED ustawieniem tej zmiennej w Vercelu trzeba wdrozyc baner zgod (§ 25 TDDDG), osobna sekcje i transfer. */}
      </P>
      <H3>Eingebettete Inhalte Dritter</H3>
      <P>
        Auf einzelnen Unterseiten binden wir Inhalte von Drittanbietern ein: auf den Seiten „Kontakt“ und „Über uns“ eine Karte von Google Maps (Google Ireland Limited), auf Objektseiten – sofern für das Objekt hinterlegt – Videos von YouTube (Google Ireland Limited) bzw. Vimeo. Beim Laden dieser Inhalte wird Ihre IP-Adresse an den jeweiligen Anbieter übermittelt; dieser kann darüber hinaus Informationen auf Ihrem Endgerät speichern oder abrufen. Die von uns verwendeten Schriftarten werden von unserem eigenen Server ausgeliefert. Wir selbst setzen auf dieser Website keine eigenen Cookies zu Analyse- oder Werbezwecken.
        {/* PRAWNIK: Stan kodu (25.09.2026): mapa Google Maps na /o-nas i w sekcji Contact (strona glowna) laduje sie od razu (iframe loading="lazy", bez zgody); YouTube IFrame API na stronach ofert z wideo; czcionki przez next/font (self-hosted), brak wlasnych cookies i localStorage. Prosze ocenic § 25 TDDDG / Art. 6 Abs. 1 lit. a/f dla map i wideo (ew. rozwiazanie 2-klik / baner) - to nie jest decyzja Daniela, tylko ryzyko do zamkniecia z kancelaria. */}
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

      <H2>5. Immobilienbewertung (KI-gestützter Bewertungsrechner)</H2>
      <P>
        Wenn Sie unseren Bewertungsrechner nutzen, verarbeiten wir die von Ihnen eingegebenen Angaben zur Immobilie (Ort bzw. Adresse, Art, Fläche, Zimmerzahl, Stockwerk, Zustand). Zur Berechnung übermitteln wir diese Angaben – ohne Ihre Kontaktdaten – an Anthropic, PBC (USA), die als unser Auftragsverarbeiter nach Art. 28 DSGVO auf Grundlage eines Auftragsverarbeitungsvertrags und Standardvertragsklauseln tätig wird. Nach den vertraglichen Vereinbarungen werden die übermittelten Daten nicht zum Training der KI-Modelle verwendet. Rechtsgrundlage für die Berechnung ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung Ihrer Anfrage). Zur Abwehr von Missbrauch und zur Begrenzung der Anzahl von Anfragen speichern wir Ihre IP-Adresse kurzzeitig (Art. 6 Abs. 1 lit. f DSGVO). Hinterlassen Sie zusätzlich Ihre Telefonnummer, damit ein Mitarbeitender Sie zurückruft, verarbeiten wir Name, Telefonnummer, Immobilienangaben und Ergebnis in unserem CRM-System (Art. 6 Abs. 1 lit. b DSGVO für den Rückruf zur Bewertung; für darüber hinausgehende Werbung Art. 6 Abs. 1 lit. a DSGVO auf Grundlage der gesondert erteilten Einwilligung).
        {/* ERLEDIGT (Przeglad 3.4): tekst prawnika 1:1. PRAWNIK/Daniel (uwaga 12): zdania o braku treningu i o AVV/SCC z Anthropic zostawic tylko po potwierdzeniu w biezacych warunkach Anthropic i po podpisaniu DPA; potwierdzic, ze do Anthropic nie idzie nic poza polami nieruchomosci (adres jest potencjalnie dana osobowa). */}
      </P>
      <P>
        Beim Rückrufwunsch im Rechner stehen Ihnen zwei getrennte Kontrollkästchen zur Verfügung, die Sie jeweils selbst aktiv auswählen: (1) Zustimmung zum Rückruf in Sachen Bewertung Ihrer Immobilie – erforderlich, damit wir Sie unter der angegebenen Nummer anrufen können; (2) Einwilligung in Werbung per Telefon und SMS zu Vermittlungsangeboten und weiteren Angeboten der Investrent sp. z o.o. – freiwillig, nicht vorausgewählt und für die Nutzung des Rechners sowie den Rückruf zur Bewertung nicht erforderlich (Art. 6 Abs. 1 lit. a DSGVO). Beide Erklärungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen (siehe Abschnitt 15). Zeitpunkt, Wortlaut und Quelle Ihrer Erklärungen speichern wir zu Nachweiszwecken (Art. 7 Abs. 1 DSGVO).
        {/* PRAWNIK (uwaga 23, wariant B z przegladu 2.6): dwa pola opisane wg rekomendacji; wdrozenie formularza (PR #21 /wycena + WycenaModal) to osobny zakres - dopoki formularz ma jedno pole zgody, ten akapit NIE odpowiada rzeczywistosci; nie publikowac /de/datenschutz przed wdrozeniem dwoch pol. */}
      </P>
      <P>
        Das Ergebnis ist ausdrücklich eine unverbindliche Orientierung; es stellt weder ein Gutachten noch eine Wertermittlung im Rechtssinne dar. Es findet keine ausschließlich automatisierte Entscheidung im Sinne des Art. 22 DSGVO statt, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie in ähnlicher Weise erheblich beeinträchtigt: Aus dem Ergebnis folgen keine Vertragsabschlüsse, Preisfestsetzungen oder Ablehnungen; die weitere Bearbeitung erfolgt stets durch unsere Mitarbeitenden.
        {/* PRAWNIK (uwaga 13): stwierdzenie merytorycznie prawdopodobne; potwierdzic z developerem CRM, ze nie ma scoringu leadow (jesli jest - ujawnic w sekcji 13, art. 4 pkt 4 i art. 13 ust. 2 lit. f). */}
      </P>

      <H2>6. Schutz vor automatisierten Zugriffen (Cloudflare Turnstile)</H2>
      <P>
        Auf der Seite unseres Bewertungsrechners setzen wir zum Schutz des Formulars vor Spam und automatisierten Zugriffen (Bots) „Cloudflare Turnstile“ ein, einen Dienst der Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Das Turnstile-Skript wird von den Servern von Cloudflare (challenges.cloudflare.com) erst geladen, wenn Sie die Seite des Bewertungsrechners aufrufen; auf anderen Seiten unserer Website wird es nicht geladen. Der Dienst arbeitet im Hintergrund und wird für Sie nur sichtbar, wenn Cloudflare eine Interaktion verlangt. Dabei werden technische Daten (insbesondere IP-Adresse, Browser- und Geräteinformationen, Merkmale der Interaktion) an Cloudflare übermittelt und dort ausgewertet, um zu prüfen, ob die Anfrage von einem Menschen stammt. Das dabei erzeugte Prüfergebnis (Token) wird mit Ihrer Anfrage an unser System übermittelt und dort bei Cloudflare verifiziert. Wir selbst setzen dafür keine Cookies. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherheit unserer Systeme und der Abwehr von Missbrauch).
      </P>
      <P>
        Die Übermittlung an Cloudflare in die USA stützt sich auf den Angemessenheitsbeschluss der EU-Kommission vom 10. Juli 2023 (EU-US Data Privacy Framework), sofern Cloudflare zertifiziert ist, hilfsweise auf Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Der Einsatz dient ausschließlich der Sicherheit des von Ihnen angeforderten Formulars und ist hierfür technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
        {/* Opis wg kodu z PR #21 (investrentkg/investrent-website, src/app/wycena/Turnstile.tsx): skrypt api.js?render=explicit ladowany dynamicznie dopiero po zamontowaniu komponentu na /wycena, tylko gdy ustawiono NEXT_PUBLIC_TURNSTILE_SITE_KEY; appearance 'interaction-only' (niewidoczny); token wysylany w turnstile_token do backendu; wlasnych cookies/localStorage brak. PRAWNIK: ocena § 25 TDDDG ("unbedingt erforderlich") do potwierdzenia (uwaga 10); ewentualne dane Cloudflare (np. cf_clearance/storage po stronie Cloudflare) - potwierdzic w dokumentacji Cloudflare. UWAGA: PR #21 nie jest zmergowany - ten akapit obowiazuje dopiero po wdrozeniu /wycena z kluczem Turnstile; przed tym usunac sekcje albo nie publikowac. */}
      </P>

      <H2>7. Kontaktformulare auf Facebook und Instagram („Suchwünsche“ / Lead Ads)</H2>
      <P>
        Im Rahmen von Werbekampagnen auf Facebook und Instagram nutzen wir Kontaktformulare (Lead Ads bzw. Instant Forms, im deutschsprachigen Raum teils als „Suchwünsche“ bezeichnet), die von Meta bereitgestellt werden. Wenn Sie ein solches Formular ausfüllen, gelangen die von Ihnen übermittelten Daten (Vor- und Nachname, Telefonnummer, E-Mail-Adresse sowie ggf. Antworten auf Qualifizierungsfragen, z. B. zu Lage, Budget oder Objektart) zunächst zu Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irland (und ggf. weiteren Meta-Unternehmen). Von dort werden sie über die offizielle Schnittstelle von Meta (Graph API) automatisch in unser internes CRM-System übertragen, ausschließlich zu dem Zweck, Sie hinsichtlich des Immobilienangebots bzw. Ihres Suchwunsches zu kontaktieren. Zugriff haben nur berechtigte Mitarbeitende der Investrent sp. z o.o. und – soweit für Ihre Anfrage erforderlich – die in Abschnitt 10 genannten Empfänger. Diese Daten unterliegen denselben Grundsätzen zu Speicherung, Schutz und Betroffenenrechten wie in den übrigen Abschnitten dieser Erklärung beschrieben.
      </P>
      <P>
        Rechtsgrundlage für die Bearbeitung Ihres Suchwunsches ist Art. 6 Abs. 1 lit. b DSGVO. Für Werbung per Telefon, E-Mail oder Messenger (z. B. WhatsApp) holen wir Ihre ausdrückliche Einwilligung ein (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 2 und 3 UWG). Diese erteilen Sie im Formular durch gesonderte, aktive Auswahl des jeweiligen Kontrollkästchens; sie ist freiwillig und für die Bearbeitung Ihres Suchwunsches nicht erforderlich. Wir speichern Zeitpunkt, Wortlaut und Quelle der Einwilligung, um diese nachweisen zu können (Art. 7 Abs. 1 DSGVO). Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Meta stellt uns die im Formular erhobenen Daten zum Abruf bereit und verarbeitet sie insoweit als unser Auftragsverarbeiter nach den Datenverarbeitungsbedingungen von Meta; für die Ausspielung der Anzeigen verarbeitet Meta Daten in eigener Verantwortung bzw. nach dem Controller Addendum (<a href="https://www.facebook.com/legal/controller_addendum" style={link} target="_blank" rel="noopener noreferrer">facebook.com/legal/controller_addendum</a>). Es gelten die Datenschutzhinweise von Meta (<a href="https://www.facebook.com/privacy/policy" style={link} target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>).
        {/* ERLEDIGT (Przeglad 3.6, uwagi 2 i 9): tekst prawnika; z zastrzezenia w nawiasie usunieto szablon "[Rolle von Meta ...]" - rola Meta (przetwarzajacy dla danych z formularza; odrebny/wspoladministrator dla emisji reklam) MUSI zostac potwierdzona przez kancelarie (pytanie 3) i Daniela (warunki Meta / Business Manager, pkt 11 listy). BLOKER wdrozeniowy: "gesonderte, aktive Auswahl des jeweiligen Kontrollkastchens" wymaga pol zgody per kanal w formularzu Meta (osobny zakres; Marketing). Zgode na uzycie danych z leadow do Custom/Lookalike Audiences wymaga odrebnej podstawy - tu nie deklarujemy takiego uzycia. */}
      </P>

      <H2>8. Kontaktaufnahme per Telefon, E-Mail und Messenger</H2>
      <P>
        Zu Werbezwecken kontaktieren wir Sie per Telefon, E-Mail oder Messenger (z. B. WhatsApp) nur, wenn Sie in den jeweiligen Kommunikationskanal zuvor ausdrücklich eingewilligt haben. E-Mail-Werbung versenden wir im Double-Opt-in-Verfahren. Ein von Ihnen ausdrücklich erbetener Rückruf oder eine Antwort auf Ihre konkrete Anfrage erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Sie können Ihre Einwilligung jederzeit widerrufen (siehe Abschnitt 15); nach dem Widerruf erhalten Sie keine Werbung mehr über den betroffenen Kanal.
        {/* ERLEDIGT (Przeglad 3.7): tekst prawnika. UWAGA: deklaracja "Double-Opt-in" dla e-maili i zgoda per kanal musza byc faktycznie zaimplementowane (CRM/Brevo) zanim kampania DE wystartuje - potwierdzic z Rozwojem Produktu. */}
      </P>

      <H2>9. Nutzung von Google-Diensten (Google API Services)</H2>
      <P>
        Unser internes CRM-System (nur für Mitarbeitende der Investrent sp. z o.o.; kein Bestandteil des Website-Besuchs) verbindet sich mit ausgewählten Google-Diensten (Google Unternehmensprofil, Google Kalender, Google Analytics und Google Search Console des Firmenkontos), um das Unternehmensprofil und die Termine der Investrent sp. z o.o. zu verwalten und Statistiken auszuwerten. Die über die Google-API erhaltenen Daten werden nur für diese Funktionen verwendet und weder an Dritte weitergegeben noch für Werbezwecke genutzt. Die Nutzung und Weitergabe von aus der Google-API erhaltenen Informationen unterliegt der Google API Services User Data Policy, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use). Die ausführliche Beschreibung finden Sie in der polnischen Fassung unter <a href="/rodo" style={link}>/rodo</a>.
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
        <LI>Brevo (Sendinblue SAS, Frankreich) – Versand von E-Mails;</LI>
        <LI>Anthropic, PBC (USA) – KI-Dienstleister für den Bewertungsrechner und die Textverarbeitung;</LI>
        <LI>Cloudflare, Inc. (USA) – Schutz vor automatisierten Zugriffen (Turnstile);</LI>
        <LI>Meta Platforms Ireland Limited (Irland) – Kontaktformulare auf Facebook/Instagram;</LI>
        <LI>Google Ireland Limited (Irland) – Google-Dienste (siehe Abschnitte 3 und 9).</LI>
      </UL>
      {/* ERLEDIGT (Przeglad 3.8, uwaga 15): kategorie odbiorcow wg prawnika + doprecyzowanie kancelarii/ksiegowych. Daniel/Backend (pkt 9 listy): potwierdzic, czy Brevo jest faktycznie uzywane (jesli nie - usunac pozycje tu i w /rodo); lista dostawcow to jedno zrodlo prawdy z /rodo (art. 30, art. 28). */}

      <H2>11. Übermittlung in Drittländer</H2>
      <P>
        Einige der genannten Anbieter haben ihren Sitz in den USA oder verarbeiten Daten dort. Übermittlungen in die USA stützen wir auf den Angemessenheitsbeschluss der EU-Kommission (EU-US Data Privacy Framework), soweit der jeweilige Empfänger zertifiziert ist, im Übrigen auf Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO). Dies betrifft insbesondere Vercel, Railway, Supabase, Anthropic, Cloudflare, Google und Meta. Eine Kopie der Garantien erhalten Sie auf Anfrage über die oben genannten Kontaktdaten.
        {/* ERLEDIGT (Przeglad 3.8, uwaga 4): sformulowanie "DPF, zastepczo SCC" wg prawnika (nie opierac wylacznie na DPF). Bez deklaracji, ktory dostawca ma DPF, a ktory SCC - przed publikacja Bezpieczenstwo/Daniel weryfikuja w dataprivacyframework.gov i DPA; TIA dla dostawcow bez DPF do teczki. */}
      </P>

      <H2>12. Freiwilligkeit der Angabe</H2>
      <P>
        Die Bereitstellung personenbezogener Daten ist freiwillig, jedoch erforderlich, um Sie zu kontaktieren, ein Angebot zu erstellen oder einen Immobilienvermittlungsvertrag abzuschließen und durchzuführen. Werden die Daten nicht bereitgestellt, können diese Zwecke gegebenenfalls nicht erreicht werden. Einwilligungen in Werbung sind stets freiwillig.
      </P>

      <H2>13. Automatisierte Entscheidungsfindung</H2>
      <P>
        Der Verantwortliche trifft Ihnen gegenüber keine ausschließlich automatisierten Entscheidungen und wendet kein Profiling im Sinne der DSGVO an. Zum Bewertungsrechner siehe Abschnitt 5.
        {/* PRAWNIK: bez zmian; potwierdzic z developerem, ze CRM nie robi scoringu leadow (uwaga 13). */}
      </P>

      <H2>14. Speicherdauer</H2>
      <P>
        Ihre personenbezogenen Daten werden so lange gespeichert, wie es zur Erfüllung der Verarbeitungszwecke erforderlich ist, und danach für den Zeitraum und im Umfang, wie er sich aus gesetzlichen Vorschriften ergibt oder zur Sicherung etwaiger Ansprüche erforderlich ist. Im Einzelnen speichern wir Ihre Daten wie folgt:
      </P>
      <UL>
        <LI>Anfragen und Kontaktdaten ohne Vertragsschluss (Suchwünsche, Rückrufwünsche, Bewertungsanfragen): bis zu <Ph>[OKRES PRZECHOWYWANIA — propozycja 12 Monate, PRAWNIK]</Ph> nach dem letzten Kontakt, bei Widerruf oder Widerspruch früher;</LI>
        <LI>Nachweis erteilter Einwilligungen: bis zum Ablauf der Verjährungsfrist möglicher Ansprüche, höchstens <Ph>[3]</Ph> Jahre nach Ende des Jahres, in dem die Einwilligung widerrufen wurde oder die Verarbeitung endete;</LI>
        <LI>Vertragsdaten: für die Dauer des Vertrags und danach <Ph>[5]</Ph> Jahre ab Ende des Kalenderjahres, in dem die steuer- und buchhaltungsrechtliche Pflicht entstanden ist (polnisches Steuer- und Rechnungslegungsrecht); ggf. länger zur Wahrung von Ansprüchen (Verjährung nach polnischem Zivilrecht, bis zu <Ph>[6]</Ph> Jahre);</LI>
        <LI>Daten, die wir nach den polnischen Vorschriften zur Bekämpfung der Geldwäsche erheben: <Ph>[5]</Ph> Jahre nach Beendigung der Geschäftsbeziehung;</LI>
        <LI>Server-Logdateien: <Ph>[30]</Ph> Tage.</LI>
      </UL>
      {/* ERLEDIGT (Przeglad 3.9, uwaga 3): struktura wg prawnika; wartosci w [ ] = propozycje do akceptacji Daniela/kancelarii (pkt 5 listy); okres AML 5 lat i podatkowy do weryfikacji w zrodle. */}

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
        Wir passen diese Datenschutzerklärung an, wenn sich die Verarbeitung oder die Rechtslage ändert. Stand: <Ph>[TT.MM.JJJJ]</Ph>. Für Nutzer, die diese Website in deutscher Sprache aufrufen, ist diese deutsche Fassung maßgeblich. Die polnische Fassung finden Sie unter <a href="/rodo" style={link}>/rodo</a>.
        {/* ERLEDIGT (Przeglad 3.10, uwaga 18): klauzula wersji wiazacej wg prawnika. Daniel: data Stand = data zatwierdzenia/publikacji. */}
      </P>

      <H2>18. Kontakt</H2>
      <P last>
        Bei Fragen zur Verarbeitung personenbezogener Daten erreichen Sie uns schriftlich unter: Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, Polen, oder per E-Mail unter <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
      </P>
    </LegalShell>
  )
}
