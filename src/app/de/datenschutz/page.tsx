import type { Metadata } from 'next'
import LegalShell, { H2, P, UL, LI, Ph } from '@/components/de/LegalShell'

// Niemieckie tlumaczenie polskiej polityki prywatnosci (/rodo) + uzupelnienia
// dla odbiorcow z Niemiec (kalkulator wyceny AI, Cloudflare Turnstile, formularze
// Meta "Suchwuensche", kontakt tel./e-mail - UWG par. 7, podprocesorzy, prawa osob).
// STATUS: PROJEKT DO PRZEGLADU PRAWNIKA. Kazda watpliwa klauzula ma komentarz
// PRAWNIK; brakujace dane to widoczne placeholdery w nawiasach kwadratowych.

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
        Verantwortlicher im Sinne der DSGVO ist die Investrent sp. z o.o. mit Sitz in Kołobrzeg (Kolberg), Polen, ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, Polen, Steuernummer (NIP): 671 185 85 59, KRS: <Ph>[KRS: …]</Ph>, REGON: <Ph>[REGON: …]</Ph>.
        {/* PRAWNIK: NIP und Anschrift stammen aus der polnischen Seite /rodo; KRS/REGON fehlen im Repository - bitte ergaenzen. Anschrift "12/1 lok. 3" laut internem Vermerk ggf. doppelt - mit KRS-Auszug abgleichen. */}
      </P>
      <P>
        Kontakt: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>, Telefon: +48 731 554 341.
      </P>
      <P>
        Datenschutzbeauftragter: <Ph>[DATENSCHUTZBEAUFTRAGTER / KONTAKT – PRAWNIK: angeben oder streichen, falls keine Benennungspflicht besteht]</Ph>
        {/* PRAWNIK: Pruefen, ob ein DPO benannt werden muss (Art. 37 DSGVO). Der Verantwortliche sitzt in der EU (PL), daher wohl kein Vertreter nach Art. 27 noetig - bitte bestaetigen. */}
      </P>

      <H2>2. Zwecke und Rechtsgrundlagen der Verarbeitung</H2>
      <P>Ihre personenbezogenen Daten werden verarbeitet zum Zweck</P>
      <UL>
        <LI>der Erbringung von Dienstleistungen im Zusammenhang mit dem Immobilienverkehr entsprechend dem geschlossenen Vertrag bzw. zur Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO);</LI>
        <LI>der Erfüllung rechtlicher Pflichten, denen der Verantwortliche unterliegt (Art. 6 Abs. 1 lit. c DSGVO);</LI>
        <LI>der Wahrung berechtigter Interessen des Verantwortlichen, etwa der Geltendmachung von Ansprüchen oder der Verteidigung gegen Ansprüche sowie der Abwehr von Missbrauch und automatisierten Zugriffen (Art. 6 Abs. 1 lit. f DSGVO);</LI>
        <LI>der Zusendung von Handels- und Marketinginformationen auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</LI>
      </UL>

      <H2>3. Hosting und technische Bereitstellung der Website</H2>
      <P>
        Diese Website wird bei der Vercel Inc. (USA) gehostet; die Anwendungsschnittstelle (API) unserer Systeme wird bei Railway Corp. (USA) betrieben; Daten aus Anfragen werden in einer Datenbank bei Supabase Inc. gespeichert. Beim Aufruf der Website verarbeiten die Hosting-Anbieter technisch erforderliche Verbindungsdaten (insbesondere IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
        {/* PRAWNIK: Die polnische /rodo nennt Vercel/Railway/Supabase NICHT namentlich. Bitte bestaetigen: Anbieter, Serverstandorte/Regionen (EU vs. USA), AV-Vertraege (Art. 28), Drittlandtransfer-Grundlage (DPF/SCC). */}
        {' '}<Ph>[PRAWNIK: potwierdzić – dostawcy hostingu, region serwerów, umowy powierzenia]</Ph>
      </P>
      <P>
        Sofern Webanalyse (Google Analytics) aktiviert wird, erfolgt dies nur nach Ihrer Einwilligung über ein Einwilligungsbanner (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO).
        {/* PRAWNIK: Im Code ist ein GA4-Skript vorbereitet, aber nur aktiv bei gesetzter Umgebungsvariable - aktuell ggf. inaktiv. Wenn aktiv: Consent-Banner und eigener Abschnitt noetig; sonst diesen Absatz streichen. */}
      </P>

      <H2>4. Anfragen über Formulare, Rückruf und Chat auf der Website</H2>
      <P>
        Wenn Sie über ein Formular unserer Website (z. B. Kontakt-, Rückruf- oder Angebotsanfrage) oder den Chat Kontakt aufnehmen, verarbeiten wir die von Ihnen eingegebenen Daten (z. B. Name, Telefonnummer, E-Mail-Adresse, Nachricht, Bezug zu einem Angebot), um Ihre Anfrage zu bearbeiten und Sie zu kontaktieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (Bearbeitung von Anfragen). Die Daten werden in unserem internen CRM-System gespeichert; Zugriff haben nur berechtigte Mitarbeitende und Kooperationspartner der Investrent sp. z o.o.
        {/* PRAWNIK: Bitte pruefen, ob die Formulare einen sichtbaren Datenschutzhinweis/Einwilligungstext mit Link auf diese Seite haben (Art. 13 DSGVO). */}
      </P>

      <H2>5. Immobilienbewertung (KI-gestützter Bewertungsrechner)</H2>
      <P>
        Wenn Sie unseren Bewertungsrechner nutzen, verarbeiten wir die von Ihnen eingegebenen Angaben zur Immobilie (z. B. Standort/Adresse, Art, Fläche, Zimmerzahl, Zustand, Ausstattung) sowie – falls Sie ein Ergebnis oder einen Rückruf wünschen – Ihre Kontaktdaten. Die Angaben werden verwendet, um eine unverbindliche, orientierende Wertspanne mithilfe von Marktdaten und KI-gestützten Modellen zu berechnen. Hierzu übermitteln wir die Immobilienangaben an einen KI-Dienstleister (derzeit: Anthropic, PBC, USA); Ihre Kontaktdaten werden dafür nicht benötigt und nicht weitergegeben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage) bzw. Ihre Einwilligung, soweit Sie diese erteilen (Art. 6 Abs. 1 lit. a DSGVO).
        {/* PRAWNIK: Technisch bestaetigen lassen, welche Felder genau an den KI-Anbieter gehen (Adresse ist ggf. personenbezogen), ob Anthropic als Auftragsverarbeiter mit AVV/SCC eingebunden ist und ob eine Trainingsnutzung ausgeschlossen ist. */}
        {' '}<Ph>[PRAWNIK: potwierdzić – zakres danych przekazywanych dostawcy AI, umowa powierzenia, brak treningu na danych]</Ph>
      </P>
      <P>
        Das Ergebnis ist ausdrücklich eine unverbindliche Orientierung; es stellt weder ein Gutachten noch eine Wertermittlung im Rechtssinne dar. Es findet keine ausschließlich automatisierte Entscheidung im Sinne des Art. 22 DSGVO statt, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie in ähnlicher Weise erheblich beeinträchtigt: Aus dem Ergebnis folgen keine Vertragsabschlüsse, Preisfestsetzungen oder Ablehnungen; die weitere Bearbeitung erfolgt stets durch unsere Mitarbeitenden.
        {/* PRAWNIK: Art. 22 - Aussage bitte bestaetigen (Rechner liefert Richtwert, kein Vertragsabschluss). Falls Profiling im Sinne von Art. 4 Nr. 4 vorliegt (z. B. Lead-Scoring), hier offenlegen. */}
      </P>

      <H2>6. Schutz vor automatisierten Zugriffen (Cloudflare Turnstile)</H2>
      <P>
        Zum Schutz unserer Formulare vor Spam und automatisierten Zugriffen (Bots) setzen wir „Cloudflare Turnstile“ ein, einen Dienst der Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Beim Laden bzw. Absenden eines Formulars werden technische Daten (insbesondere IP-Adresse, Browser- und Geräteinformationen, Merkmale der Interaktion) an Cloudflare übermittelt und dort ausgewertet, um zu prüfen, ob die Anfrage von einem Menschen stammt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherheit unserer Systeme und der Abwehr von Missbrauch). Die Übermittlung in die USA stützt sich auf <Ph>[GRUNDLAGE DRITTLANDTRANSFER – PRAWNIK: EU-US Data Privacy Framework / Standardvertragsklauseln]</Ph>.
        {/* PRAWNIK: Turnstile-Einsatz technisch bestaetigen (im Website-Repo derzeit nicht gefunden). Zugriff auf Endgeraeteinformationen -> Einwilligung nach § 25 TDDDG noetig oder "unbedingt erforderlich" (§ 25 Abs. 2 Nr. 2)? Bitte bewerten; Cloudflare-DPF-Zertifizierung pruefen. */}
      </P>

      <H2>7. Kontaktformulare auf Facebook und Instagram („Suchwünsche“ / Lead Ads)</H2>
      <P>
        Im Rahmen von Werbekampagnen auf Facebook und Instagram nutzen wir Kontaktformulare (Lead Ads bzw. Instant Forms, im deutschsprachigen Raum teils als „Suchwünsche“ bezeichnet), die von Meta bereitgestellt werden. Wenn Sie ein solches Formular ausfüllen, gelangen die von Ihnen übermittelten Daten (Vor- und Nachname, Telefonnummer, E-Mail-Adresse sowie ggf. Antworten auf Qualifizierungsfragen, z. B. zu Lage, Budget oder Objektart) zunächst zu Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irland (und ggf. weiteren Meta-Unternehmen). Von dort werden sie über die offizielle Schnittstelle von Meta (Graph API) automatisch in unser internes CRM-System übertragen, ausschließlich zu dem Zweck, Sie hinsichtlich des Immobilienangebots bzw. Ihres Suchwunsches zu kontaktieren. Zugriff haben nur berechtigte Mitarbeitende und Kooperationspartner der Investrent sp. z o.o. Diese Daten unterliegen denselben Grundsätzen zu Speicherung, Schutz und Betroffenenrechten wie in den übrigen Abschnitten dieser Erklärung beschrieben.
      </P>
      <P>
        Rechtsgrundlage ist Ihre Einwilligung, die Sie durch das Absenden des Formulars erteilen (Art. 6 Abs. 1 lit. a DSGVO), sowie Art. 6 Abs. 1 lit. b DSGVO für die Bearbeitung Ihrer Anfrage. Für die Verarbeitung durch Meta bei der Ausspielung der Anzeigen und Formulare gelten die Datenschutzhinweise von Meta (<a href="https://www.facebook.com/privacy/policy" style={link} target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>). Zwischen Meta und uns kann hinsichtlich der Erhebung der Daten im Formular eine gemeinsame Verantwortlichkeit (Art. 26 DSGVO) bestehen; wesentliche Inhalte der Vereinbarung stellt Meta unter <a href="https://www.facebook.com/legal/controller_addendum" style={link} target="_blank" rel="noopener noreferrer">facebook.com/legal/controller_addendum</a> bereit.
        {/* PRAWNIK: (1) Gemeinsame Verantwortlichkeit Art. 26 DSGVO (Meta Controller Addendum) bewerten/bestaetigen; (2) Uebermittlung Meta -> CRM; (3) Reicht die Einwilligung im Formular (Meta-Einwilligungstext + Link auf diese Seite als Datenschutzrichtlinien-URL im Formular)? */}
      </P>

      <H2>8. Kontaktaufnahme per Telefon, E-Mail und Messenger</H2>
      <P>
        Wir kontaktieren Sie per Telefon, E-Mail oder Messenger (z. B. WhatsApp) nur, soweit Sie uns Ihre Kontaktdaten zu diesem Zweck mitgeteilt haben (z. B. über ein Formular oder Lead-Formular) und – soweit rechtlich erforderlich – zuvor ausdrücklich eingewilligt haben. Werbliche Anrufe und E-Mails ohne vorherige ausdrückliche Einwilligung führen wir nicht durch. Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (siehe Abschnitt 15). Kontaktaufnahmen zur Beantwortung Ihrer konkreten Anfrage erfolgen auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
        {/* PRAWNIK: § 7 UWG (Deutschland): Telefonwerbung gegenueber Verbrauchern nur mit vorheriger ausdruecklicher Einwilligung (§ 7 Abs. 2 Nr. 2), E-Mail-Werbung nur mit Einwilligung bzw. Ausnahme § 7 Abs. 3. Bitte pruefen, ob Formulare/Lead Ads diesen Anforderungen genuegen (Nachweis der Einwilligung, ggf. Double-Opt-In) und ob Anrufe an DE-Rufnummern zulaessig sind; Formulierung ggf. anpassen. */}
        {' '}<Ph>[PRAWNIK: potwierdzić – zgodność z § 7 UWG dla kontaktu telefonicznego i e-mail do odbiorców z Niemiec]</Ph>
      </P>

      <H2>9. Nutzung von Google-Diensten (Google API Services)</H2>
      <P>
        Unser internes CRM-System verbindet sich – ausschließlich mit Ihrer bei der Anmeldung über ein Google-Konto erteilten Zustimmung – mit ausgewählten Google-Diensten, um das Unternehmensprofil der Investrent sp. z o.o. zu verwalten. Wir nutzen über die Google-API bereitgestellte Daten in folgendem Umfang: Lesen und Veröffentlichen von Inhalten des Google Unternehmensprofils (einschließlich Kundenbewertungen und Antworten darauf, Beiträge, Unternehmensinformationen), Lesen und Schreiben von Terminen im Google Kalender des Firmenkontos sowie Lesen von Statistiken aus Google Analytics und Google Search Console. Diese Daten werden ausschließlich zur Bereitstellung und Verbesserung der CRM-Funktionen für berechtigte Mitarbeitende und Kooperationspartner der Investrent sp. z o.o. verwendet und weder an Dritte weitergegeben noch für Werbezwecke genutzt. Die Nutzung und Weitergabe von aus der Google-API erhaltenen Informationen durch die Investrent sp. z o.o. an andere Anwendungen unterliegt der Google API Services User Data Policy, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use).
      </P>

      <H2>10. Empfänger der Daten und Auftragsverarbeiter</H2>
      <P>Ihre personenbezogenen Daten können weitergegeben werden an:</P>
      <UL>
        <LI>Unternehmen, die mit uns bei der Erbringung von Immobiliendienstleistungen zusammenarbeiten;</LI>
        <LI>Auftragsverarbeiter, die Daten in unserem Auftrag verarbeiten, z. B. IT-Dienstleister, Rechtsanwaltskanzleien und Buchhaltungsunternehmen – auf Grundlage eines Vertrags mit uns und ausschließlich nach unseren Weisungen;</LI>
        <LI>Behörden und sonstige Stellen, soweit wir hierzu aufgrund gesetzlicher Vorschriften berechtigt oder verpflichtet sind.</LI>
      </UL>
      <P>Zu den von uns eingesetzten Dienstleistern gehören insbesondere:</P>
      <UL>
        <LI>Vercel Inc. (USA) – Hosting der Website;</LI>
        <LI>Railway Corp. (USA) – Betrieb der Anwendungsschnittstelle (API) des CRM-Systems;</LI>
        <LI>Supabase Inc. – Datenbank und Speicher <Ph>[PRAWNIK: potwierdzić – region/lokalizacja]</Ph>;</LI>
        <LI>Brevo (Sendinblue SAS, Frankreich) – Versand von E-Mails <Ph>[PRAWNIK: potwierdzić – czy Brevo jest faktycznie używane i w jakim zakresie]</Ph>;</LI>
        <LI>Anthropic, PBC (USA) – KI-Dienstleister für den Bewertungsrechner und die Textverarbeitung <Ph>[PRAWNIK: potwierdzić]</Ph>;</LI>
        <LI>Cloudflare, Inc. (USA) – Schutz vor automatisierten Zugriffen (Turnstile);</LI>
        <LI>Meta Platforms Ireland Limited (Irland) – Kontaktformulare auf Facebook/Instagram;</LI>
        <LI>Google Ireland Limited (Irland) – Google-Dienste (siehe Abschnitt 9).</LI>
      </UL>
      {/* PRAWNIK: Die polnische /rodo nennt nur allgemein "Anbieter von IT-Diensten". Diese Liste wurde aus den im Projekt eingesetzten Diensten abgeleitet und muss vor Veroeffentlichung vom Verantwortlichen auf Vollstaendigkeit/Richtigkeit bestaetigt werden (Verarbeitungsverzeichnis Art. 30, AV-Vertraege Art. 28). */}

      <H2>11. Übermittlung in Drittländer</H2>
      <P>
        Einige der genannten Anbieter haben ihren Sitz in den USA oder verarbeiten Daten dort. Soweit personenbezogene Daten in Länder außerhalb des Europäischen Wirtschaftsraums übermittelt werden, geschieht dies nur, wenn ein Angemessenheitsbeschluss der EU-Kommission vorliegt (z. B. EU-US Data Privacy Framework bei zertifizierten Unternehmen) oder geeignete Garantien nach Art. 46 DSGVO bestehen (insbesondere Standardvertragsklauseln der EU-Kommission). Eine Kopie der Garantien erhalten Sie auf Anfrage über die oben genannten Kontaktdaten.
        {/* PRAWNIK: Pro Anbieter (Vercel, Railway, Supabase, Anthropic, Cloudflare, Google, Meta, Brevo) DPF-Zertifizierung bzw. SCC bestaetigen; ggf. Transfer Impact Assessment. */}
        {' '}<Ph>[PRAWNIK: potwierdzić – podstawa transferu dla każdego dostawcy]</Ph>
      </P>

      <H2>12. Freiwilligkeit der Angabe</H2>
      <P>
        Die Bereitstellung personenbezogener Daten ist freiwillig, jedoch erforderlich, um Sie zu kontaktieren, ein Angebot zu erstellen oder einen Immobilienvermittlungsvertrag abzuschließen und durchzuführen. Werden die Daten nicht bereitgestellt, können diese Zwecke gegebenenfalls nicht erreicht werden.
      </P>

      <H2>13. Automatisierte Entscheidungsfindung</H2>
      <P>
        Der Verantwortliche trifft Ihnen gegenüber keine ausschließlich automatisierten Entscheidungen und wendet kein Profiling im Sinne der DSGVO an. Zum Bewertungsrechner siehe Abschnitt 5.
      </P>

      <H2>14. Speicherdauer</H2>
      <P>
        Ihre personenbezogenen Daten werden so lange gespeichert, wie es zur Erfüllung der Verarbeitungszwecke erforderlich ist, und danach für den Zeitraum und im Umfang, wie er sich aus gesetzlichen Vorschriften ergibt oder zur Sicherung etwaiger Ansprüche erforderlich ist. Im Einzelnen: <Ph>[OKRES PRZECHOWYWANIA — PRAWNIK]</Ph>
        {/* PRAWNIK: Konkrete Fristen festlegen (Anfragen/Leads ohne Vertragsschluss; Vertragsdaten - polnisches Steuer-/Buchhaltungsrecht, Verjaehrung; Einwilligungsnachweise; Server-Logs). Die polnische /rodo enthaelt nur die allgemeine Formulierung. */}
      </P>

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

      <H2>16. Beschwerderecht bei der Aufsichtsbehörde</H2>
      <P>
        Zuständige Aufsichtsbehörde für den Verantwortlichen ist der Präsident des Amtes für den Schutz personenbezogener Daten in Polen (Prezes Urzędu Ochrony Danych Osobowych, UODO), ul. Stawki 2, 00-193 Warszawa, Polen, <a href="https://uodo.gov.pl" style={link} target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>. Wenn Sie Ihren gewöhnlichen Aufenthalt in Deutschland haben, können Sie sich außerdem an die für Ihren Wohnort zuständige deutsche Datenschutzaufsichtsbehörde (Landesdatenschutzbeauftragte bzw. Landesdatenschutzbeauftragter Ihres Bundeslandes) wenden; eine Übersicht finden Sie beim Bundesbeauftragten für den Datenschutz und die Informationsfreiheit unter <a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html" style={link} target="_blank" rel="noopener noreferrer">bfdi.bund.de</a>.
        {/* PRAWNIK: Adresse UODO und BfDI-Link auf Aktualitaet pruefen; federfuehrende Behoerde (Art. 56 DSGVO) ist die polnische, Beschwerden bei einer deutschen Behoerde werden an diese weitergeleitet. */}
      </P>

      <H2>17. Änderungen dieser Datenschutzerklärung</H2>
      <P>
        Wir passen diese Datenschutzerklärung an, wenn sich die Verarbeitung oder die Rechtslage ändert. Stand: <Ph>[STAND DATUM – PRAWNIK]</Ph>. Die polnische Fassung finden Sie unter <a href="/rodo" style={link}>/rodo</a>.
        {/* PRAWNIK: Welche Sprachfassung ist bei Abweichungen massgeblich? Bitte Klausel festlegen. */}
      </P>

      <H2>18. Kontakt</H2>
      <P last>
        Bei Fragen zur Verarbeitung personenbezogener Daten erreichen Sie uns schriftlich unter: Investrent sp. z o.o., ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg, Polen, oder per E-Mail unter <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a>.
      </P>
    </LegalShell>
  )
}
