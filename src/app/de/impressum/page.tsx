import type { Metadata } from 'next'
import LegalShell, { H2, P, Ph } from '@/components/legal/LegalShell'

// Impressum (Anbieterkennzeichnung, § 5 DDG - dawniej § 5 TMG) dla odbiorcow z
// Niemiec. Po przegladzie prawnym z 25.09.2026 (uwagi 5-7, 19-22, runda 2 w
// _wspolne_pliki\przeglad_prawny_de_runda2_2026_09_25.md) i po finalnych odpowiedziach
// Daniela z 27.09.2026: sad rejestrowy, zarzad i OC sa juz WYPELNIONE ponizej.
// Sekcja § 18 MStV zostala USUNIETA decyzja Daniela (kampania reklamowa, brak
// dedykowanych tresci redakcyjnych po niemiecku - patrz komentarz przy dawnej sekcji).
//
// WAZNA DECYZJA BIZNESOWA (27.09.2026, do wiadomosci kazdego, kto edytuje ta strone):
// § 34c GewO (czy oferowanie posrednictwa zdalnie z Polski kupujacym z Niemiec wymaga
// niemieckiego zezwolenia) NIE zostalo potwierdzone opinia kancelarii z kompetencja
// niemiecka - Agent Prawnik oznaczyl to jako pytanie wymagajace takiej opinii (przeglad
// 25.09.2026, pytanie 2 do kancelarii). Daniel zdecydowal 27.09.2026 ruszyc bez tej
// opinii, na podstawie wlasnej obserwacji rynku ("wiele biur robi marketing na klientow
// niemieckich bez dodatkowych pozwolen"), NIE na podstawie formalnej opinii prawnej.
// To ryzyko ZAAKCEPTOWANE PRZEZ WLASCICIELA FIRMY, swiadomie i wprost, nie pominiete.
// Srodki ostroznosci utrzymane w tekscie ponizej: brak spotkan/targow w Niemczech,
// dzialalnosc opisana jako "swiadczona z Polski, dotyczy nieruchomosci w Polsce".

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
        Investrent sp. z o.o. (INVESTRENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ), Handelsname: InvestRent<br />
        ul. Ratuszowa 12/1 lok. 3<br />
        78-100 Kołobrzeg (Kolberg)<br />
        Polen
        {/* Dane z odpisu KRS/VIES z 25.09.2026 — do weryfikacji przed publikacja */}
        {/* ERLEDIGT: adres "12/1 lok. 3" jest poprawny wg KRS (nr domu 12, lokal 1 lok. 3) - to nie jest dublowanie. Nazwa handlowa "InvestRent" dodana obok pelnej firmy zgodnie z decyzja Daniela 27.09.2026 (marka w komunikacji, pelna nazwa prawna tam gdzie wymagana). */}
      </P>
      <P>
        Rechtsform: Gesellschaft mit beschränkter Haftung nach polnischem Recht (spółka z ograniczoną odpowiedzialnością)
      </P>
      <P>
        Vertretungsberechtigt: Vorstand (zarząd), jedes der zwei Vorstandsmitglieder ist einzelvertretungsberechtigt: Daniel Kamiński, Dawid Sadownik.
        {/* ZAMKNIETE 27.09.2026: imiona zarzadu potwierdzone przez Daniela. */}
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
        Registergericht: Sąd Rejonowy w Koszalinie, IX Wydział Gospodarczy Krajowego Rejestru Sądowego (Amtsgericht Koszalin, IX. Wirtschaftsabteilung des Landesgerichtsregisters)<br />
        REGON: 526973936<br />
        Stammkapital: 5.000,00 PLN (eingezahlt)
        {/* Dane z odpisu KRS/VIES z 25.09.2026. Sad rejestrowy potwierdzony przez Daniela 27.09.2026 - do zweryfikowania z pelnym odpisem KRS przy publikacji. */}
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
        Tätigkeit: Vermittlung von Immobilien (Immobilienmakler nach polnischem Recht, pośrednik w obrocie nieruchomościami). Eine behördliche Erlaubnis oder Registrierung ist für diese Tätigkeit in Polen nicht erforderlich; eine Aufsichtsbehörde im Sinne des § 5 Abs. 1 Nr. 4 DDG besteht daher nicht. Unsere Tätigkeit bezieht sich ausschließlich auf Immobilien in der Republik Polen und wird von Polen aus erbracht; wir unterhalten keine Niederlassung, kein Personal und keine regelmäßigen Präsenzveranstaltungen (Messen, Vorträge, Besichtigungstermine vor Ort) in Deutschland.<br />
        Berufshaftpflichtversicherung (nach polnischem Recht vorgeschrieben): PZU SA, Rondo Ignacego Daszyńskiego 4, 00-843 Warszawa (Versicherungssumme: 25.000 EUR je Schadenfall und insgesamt). Räumlicher Geltungsbereich: Republik Polen.
        {/* ERLEDIGT (Przeglad 3.11, uwaga 6-7): "verliehen"/organ nadzorczy/licencja zastapione tekstem prawnika (licencja posrednika zniesiona 1.01.2014). OC: PZU SA, suma 25 000 EUR, zasieg Polska (decyzja Daniela 25.09.2026: dzialamy tylko w Polsce - zgodne z zasada nadrzedna z 27.09.2026 nizej). */}
        {/* DECYZJA BIZNESOWA 27.09.2026 (§ 34c GewO, patrz komentarz na gorze pliku): zdanie o braku dzialalnosci fizycznej w Niemczech to swiadomy srodek ostroznosci przyjety przez Daniela BEZ formalnej opinii kancelarii niemieckiej - Agent Prawnik zaznaczyl to ryzyko wprost (pytanie 2 do kancelarii z przegladu 25.09.2026), Daniel zdecydowal ruszyc kampanie na podstawie wlasnej obserwacji rynku. */}
        {/* Numer polisy OC (WYLACZNIE do wewnetrznej teczki, NIE publikowac na stronie): 1118663294, okres 12.03.2026-11.03.2027, ubezpieczajacy/ubezpieczony: Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kolobrzeg, REGON 526973936 - potwierdzone przez Daniela 27.09.2026 na podstawie zdjecia dokumentu (zapisane trwale w reference_dane_spolki_de_impressum_2026_09_27.md). UWAGA: dokument polisy NIE wskazuje wprost zasiegu terytorialnego wobec klientow z Niemiec - to standardowe obowiazkowe OC posrednika w PL bez wzmianki o DE. Zdanie "Raeumlicher Geltungsbereich: Republik Polen" w tekscie odzwierciedla to, co polisa faktycznie potwierdza (nie deklaruje szerszego zasiegu, ale tez nie wyklucza wprost klientow z DE) - jesli kiedykolwiek potrzebne bedzie twarde potwierdzenie zasiegu DE, wymaga to zapytania do ubezpieczyciela/OWU, nie interpretacji. */}
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
