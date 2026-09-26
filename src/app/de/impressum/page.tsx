import type { Metadata } from 'next'
import LegalShell, { H2, P, Ph } from '@/components/legal/LegalShell'

// Impressum (Anbieterkennzeichnung, § 5 DDG - dawniej § 5 TMG) dla odbiorcow z
// Niemiec. Po przegladzie prawnym z 25.09.2026 (uwagi 5-7, 19-22): teksty prawnika
// wdrozone, dane spolki z odpisu KRS/VIES z 25.09.2026 (_wspolne_pliki\dane_spolki_do_impressum_2026_09_25.md).
// Placeholdery (zolte) = WYLACZNIE dane od Daniela: sad rejestrowy, imiona i nazwiska
// zarzadu, polisa OC (ubezpieczyciel/adres/zasieg), osoba odpowiedzialna za tresci (§ 18 MStV).
// STATUS: PROJEKT DO PRZEGLADU PRAWNIKA.

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Anbieterkennzeichnung der Investrent sp. z o.o., Kołobrzeg (Polen) gemäß § 5 DDG.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.investrent.com.pl/de/impressum' },
}

const link = { color: '#1a4fa0' }

export default function ImpressumPage() {
  return (
    <LegalShell title="Impressum">
      <H2>Angaben gemäß § 5 DDG</H2>
      <P>
        Investrent sp. z o.o. (INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ)<br />
        ul. Ratuszowa 12/1 lok. 3<br />
        78-100 Kołobrzeg (Kolberg)<br />
        Polen
        {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacja */}
        {/* ERLEDIGT: adres "12/1 lok. 3" jest poprawny wg KRS (nr domu 12, lokal 1 lok. 3) - to nie jest dublowanie. Nazwa handlowa wobec DE ("Invest Rent Nieruchomosci" vs "Investrent sp. z o.o.") - decyzja Daniela (pkt 14); tu uzyta pelna firma zgodna z KRS. */}
      </P>
      <P>
        Rechtsform: Gesellschaft mit beschränkter Haftung nach polnischem Recht (spółka z ograniczoną odpowiedzialnością)
      </P>
      <P>
        Vertretungsberechtigt: Vorstand (zarząd), jedes der zwei Vorstandsmitglieder ist einzelvertretungsberechtigt: <Ph>[Vor- und Nachname der beiden Vorstandsmitglieder]</Ph>
      </P>

      <H2>Kontakt</H2>
      <P>
        Telefon: +48 731 554 341<br />
        E-Mail: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a><br />
        Website: <a href="https://www.investrent.com.pl" style={link}>www.investrent.com.pl</a>
      </P>

      <H2>Registereintrag</H2>
      <P>
        Eingetragen im Handelsregister (Krajowy Rejestr Sądowy, KRS): KRS-Nummer 0001069797<br />
        Registergericht: <Ph>[Registergericht – laut KRS-Auszug bestätigen, z. B. Sąd Rejonowy w Koszalinie, IX Wydział Gospodarczy KRS]</Ph><br />
        REGON: 526973936<br />
        Stammkapital: 5.000,00 PLN (eingezahlt)
        {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacja */}
        {/* PRAWNIK (uwaga 5): kapital 5 000 PLN wg KRS; "eingezahlt" - w sp. z o.o. kapital pokrywa sie wkladami wniesionymi przed rejestracja; kancelaria potwierdza brzmienie (§ 5 DDG / dyrektywa 2009/101/WE - przy podaniu kapitalu nalezy podac, ile wplacono). */}
      </P>

      <H2>Steuernummern</H2>
      <P>
        Steuernummer (NIP): 671 185 85 59<br />
        Umsatzsteuer-Identifikationsnummer (VAT-UE): PL6711858559
        {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacja */}
        {/* ERLEDIGT (Przeglad 3.12, uwaga 21): numer polski VAT-UE (PL+NIP); VIES potwierdza aktywny VAT-UE (25.09.2026). Odwolanie do "§ 27a UStG" usuniete (dotyczy niemieckiego numeru). */}
      </P>

      <H2>Berufsrechtliche Angaben</H2>
      <P>
        Tätigkeit: Vermittlung von Immobilien (Immobilienmakler nach polnischem Recht, pośrednik w obrocie nieruchomościami). Eine behördliche Erlaubnis oder Registrierung ist für diese Tätigkeit in Polen nicht erforderlich; eine Aufsichtsbehörde im Sinne des § 5 Abs. 1 Nr. 4 DDG besteht daher nicht. Unsere Tätigkeit bezieht sich auf Immobilien in der Republik Polen und wird von Polen aus erbracht.<br />
        Berufshaftpflichtversicherung (nach polnischem Recht vorgeschrieben): <Ph>[Versicherer], [Anschrift des Versicherers]</Ph>. Räumlicher Geltungsbereich: <Ph>[z. B. Republik Polen / Europäische Union – laut Police bestätigen]</Ph>.
        {/* ERLEDIGT (Przeglad 3.11, uwaga 6-7): "verliehen"/organ nadzorczy/licencja zastapione tekstem prawnika (licencja posrednika zniesiona 1.01.2014). Daniel: dane ubezpieczyciela OC i zasieg terytorialny (czy obejmuje klientow z DE). PRAWNIK: § 34c GewO (uwaga 22) - decyzja/opinia kancelarii; zdanie "dotyczy nieruchomosci w RP, swiadczona z Polski" zgodne z zaleceniem ostroznosciowym (b). */}
      </P>

      <H2>Verantwortlich für den Inhalt</H2>
      <P>
        Verantwortlich für redaktionelle Inhalte (§ 18 Abs. 2 MStV): <Ph>[Vor- und Nachname], Anschrift wie oben – entfällt, wenn auf der deutschen Version keine redaktionellen Inhalte veröffentlicht werden</Ph>
        {/* PRAWNIK (uwaga 20): pole potrzebne tylko jesli po niemiecku sa tresci redakcyjne (blog jest obecnie tylko po polsku) - decyzja Daniela (pkt 8 listy): wskazac osobe albo usunac sekcje. */}
      </P>

      <H2>Verbraucherstreitbeilegung</H2>
      <P>
        Wir sind weder bereit noch verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
        {/* OK (uwaga 19): platforma ODR UE zlikwidowana 20.07.2025 - stary link usuniety prawidlowo; "weder bereit noch verpflichtet" dopuszczalne. Zmiana na "bereit" = decyzja biznesowa. */}
      </P>

      <H2>Haftung für Inhalte und Links</H2>
      <P>
        Wir bemühen uns um richtige und aktuelle Inhalte auf dieser Website; für Vollständigkeit und Aktualität können wir jedoch keine Gewähr übernehmen. Objektangaben und Bewertungsergebnisse sind unverbindlich. Für Inhalte externer Seiten, auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich; zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir entsprechende Links umgehend.
        {/* PRAWNIK: Haftungshinweis - Standardtext, bitte pruefen/kuerzen. */}
      </P>

      <H2>Datenschutz</H2>
      <P last>
        Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer <a href="/de/datenschutz" style={link}>Datenschutzerklärung</a>.
      </P>
    </LegalShell>
  )
}
