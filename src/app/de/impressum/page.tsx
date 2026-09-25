import type { Metadata } from 'next'
import LegalShell, { H2, P, Ph } from '@/components/de/LegalShell'

// Impressum (Anbieterkennzeichnung, § 5 DDG - dawniej § 5 TMG) dla odbiorcow z
// Niemiec. Dane z repo/stopki: nazwa, adres, telefon, e-mail, NIP. Reszta =
// placeholdery do uzupelnienia. STATUS: PROJEKT DO PRZEGLADU PRAWNIKA.

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
        Investrent sp. z o.o.<br />
        ul. Ratuszowa 12/1 lok. 3<br />
        78-100 Kołobrzeg (Kolberg)<br />
        Polen
        {/* PRAWNIK: Anschrift laut Website/Footer; "12/1 lok. 3" ggf. mit KRS-Auszug abgleichen (interner Vermerk: koennte doppelt sein). */}
      </P>
      <P>
        Rechtsform: Gesellschaft mit beschränkter Haftung nach polnischem Recht (spółka z ograniczoną odpowiedzialnością)
      </P>
      <P>
        Vertretungsberechtigte(r) Geschäftsführer / Vorstand (zarząd): <Ph>[ZARZĄD / GESCHÄFTSFÜHRER: imię i nazwisko — PRAWNIK]</Ph>
      </P>

      <H2>Kontakt</H2>
      <P>
        Telefon: +48 731 554 341<br />
        E-Mail: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a><br />
        Website: <a href="https://www.investrent.com.pl" style={link}>www.investrent.com.pl</a>
      </P>

      <H2>Registereintrag</H2>
      <P>
        Eingetragen im Handelsregister (Krajowy Rejestr Sądowy, KRS): <Ph>[KRS: …]</Ph><br />
        Registergericht: <Ph>[SĄD REJESTROWY: … — PRAWNIK]</Ph><br />
        REGON: <Ph>[REGON: …]</Ph><br />
        Stammkapital: <Ph>[KAPITAŁ ZAKŁADOWY: … — PRAWNIK, wenn angegeben, dann das gezeichnete und eingezahlte Kapital]</Ph>
        {/* PRAWNIK: Bei Kapitalgesellschaften mit Angabe zum Kapital muss angegeben werden, ob es eingezahlt ist (§ 5 Abs. 1 Nr. 4 DDG analog / § 35a GmbHG); nach polnischem Recht evtl. abweichend - bitte pruefen. */}
      </P>

      <H2>Steuernummern</H2>
      <P>
        Steueridentifikationsnummer (NIP): 671 185 85 59<br />
        Umsatzsteuer-Identifikationsnummer nach § 27a UStG (USt-IdNr.): <Ph>[USt-IdNr.: … — PRAWNIK: z. B. PL6711858559, nur angeben, wenn als VAT-UE registriert]</Ph>
        {/* PRAWNIK: NIP stammt aus /rodo. USt-IdNr. nur eintragen, wenn tatsaechlich VAT-UE registriert (Format PL + NIP); sonst Zeile streichen. */}
      </P>

      <H2>Berufsrechtliche Angaben</H2>
      <P>
        Berufsbezeichnung: Immobilienmakler (pośrednik w obrocie nieruchomościami), verliehen in der Republik Polen. Zuständige Aufsichts-/Registerbehörde: <Ph>[PRAWNIK: potwierdzić – organ/rejestr, numer licencji jeśli dotyczy]</Ph><br />
        Berufshaftpflichtversicherung: <Ph>[UBEZPIECZENIE OC — PRAWNIK: ubezpieczyciel, adres, zakres terytorialny]</Ph>
        {/* PRAWNIK: (1) Polen: Ubezpieczenie OC pośrednika ist gesetzlich vorgeschrieben (Ustawa o gospodarce nieruchomościami) - Angaben zu Versicherer und geografischem Geltungsbereich (§ 2 Abs. 1 Nr. 11 DL-InfoV, gilt fuer Dienstleistungen in DE) pruefen. (2) Ist eine deutsche Erlaubnis nach § 34c GewO noetig, wenn Immobilien in DE vermittelt werden? Hier wohl nur PL-Objekte - bitte klaeren. */}
      </P>

      <H2>Verantwortlich für den Inhalt</H2>
      <P>
        Verantwortlich für journalistisch-redaktionelle Inhalte (§ 18 Abs. 2 MStV): <Ph>[NAME UND ANSCHRIFT — PRAWNIK: entfällt ggf., wenn keine journalistisch-redaktionellen Inhalte (z. B. Blog)]</Ph>
      </P>

      <H2>Verbraucherstreitbeilegung</H2>
      <P>
        Wir sind weder bereit noch verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
        {/* PRAWNIK: Formulierung bestaetigen (Bereitschaft ja/nein). Die EU-OS-Plattform (ODR) wurde zum 20.07.2025 eingestellt; alter Hinweis daher entfernt. */}
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
