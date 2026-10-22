import type { Metadata } from 'next'
import LegalShell, { H2, P, UL, LI } from '@/components/legal/LegalShell'
import { serializeJsonLd } from '@/lib/jsonLd'

// Strona docelowa DE (22.10.2026) pod frazy "Immobilien Kolberg" / "Immobilienmakler Kolberg" (SEO, plan TOP Kolobrzeg, poz. 3).
// Tekst: _wspolne_pliki/SEO_DE_immobilien_kolberg_tekst_v2_po_weryfikacji_2026_10_22.md (weryfikacja jezykowa: niezalezny podagent native speaker DE).
// Decyzja Daniela 22.10.2026: obsluga klientow DE tylko pisemna (tlumacz) - brak obietnicy rozmow telefonicznych po niemiecku.
// Bez twierdzen prawnych (te zalatwia /de/datenschutz i /de/impressum); bez nazw inwestycji deweloperskich.
// UWAGA kodowanie: plik zapisywac wylacznie jako UTF-8 (polskie znaki w nazwach "Kołobrzeg").

const URL_DE = 'https://www.investrent.com.pl/de/immobilien-kolberg'
const TITLE = 'Immobilien Kolberg | Makler InvestRent in Kołobrzeg'
const DESC = 'Immobilienbüro InvestRent in Kolberg (Kołobrzeg): Wohnungen kaufen, verkaufen, vermieten an der polnischen Ostsee. Persönliche Beratung vor Ort.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  robots: { index: true, follow: true },
  alternates: { canonical: URL_DE, languages: { de: URL_DE, pl: 'https://www.investrent.com.pl' } },
  openGraph: { title: TITLE, description: DESC, type: 'website', locale: 'de_DE', url: URL_DE, siteName: 'InvestRent Nieruchomości', images: [{ url: '/hero.jpg', width: 1920, height: 1080, alt: 'InvestRent Immobilien Kolberg' }] },
}

const FAQ = [
  { q: 'Wie finde ich eine Wohnung in Kolberg?', a: 'Schreiben Sie uns Ihre Wünsche (Lage, Größe, Budget); wir senden Ihnen passende Angebote.' },
  { q: 'Ist eine Besichtigung auch aus der Ferne möglich?', a: 'Wir stimmen Besichtigungstermine mit Ihnen ab und beantworten Ihre Fragen vorab schriftlich per E-Mail.' },
  { q: 'Was kostet eine Wohnung in Kolberg?', a: 'Die Preise hängen stark von Lage und Zustand ab; aktuelle Werte finden Sie in unseren Angeboten und im Beitrag zu den Preisen.' },
]

const link = { color: '#1a4fa0' }

export default function ImmobilienKolbergPage() {
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: 'de', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <LegalShell title="Immobilien in Kolberg (Kołobrzeg) – Ihr Immobilienbüro vor Ort">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }} />
      <P>
        Kolberg (polnisch Kołobrzeg) ist einer der bekanntesten Ostseekurorte Polens. Wir, das Immobilienbüro InvestRent, sind mitten in der Stadt ansässig und begleiten Käufer, Verkäufer und Vermieter – vom ersten Gespräch bis zum Abschluss.
      </P>

      <H2>Was wir für Sie tun</H2>
      <UL>
        <LI><strong>Wohnung oder Haus in Kolberg kaufen:</strong> Wir stellen Ihnen passende Angebote vor, organisieren Besichtigungen und begleiten Sie durch den gesamten Kaufprozess.</LI>
        <LI><strong>Immobilie in Kolberg verkaufen:</strong> Wir bewerten Ihre Immobilie, präsentieren sie professionell und betreuen die Interessenten bis zum Abschluss.</LI>
        <LI><strong>Vermietung:</strong> Wir unterstützen Eigentümer bei der langfristigen Vermietung ihrer Wohnung.</LI>
        <LI><strong>Online-Bewertung:</strong> Mit unserem <a href="/wycena" style={link}>Bewertungsrechner</a> erhalten Sie eine erste Einschätzung zum Wert Ihrer Wohnung.</LI>
      </UL>

      <H2>Kolberg und die Umgebung</H2>
      <P>
        Auch in den Küstenorten der Umgebung sind wir für Sie tätig, etwa in Dźwirzyno, Grzybowo, Sianożęty und Ustronie Morskie. Mehr zu den einzelnen Orten finden Sie auf unserer <a href="/nadmorskie-miejscowosci-kolobrzeg" style={link}>Übersichtsseite</a>.
      </P>

      <H2>Preise: Angebotspreise und Transaktionspreise</H2>
      <P>
        Wir unterscheiden bewusst zwischen den Preisen in aktuellen Angeboten und den tatsächlich beurkundeten Preisen aus dem polnischen Immobilienpreisregister. Beide Werte zeigen wir nebeneinander und nennen die Stichprobengröße. Mehr dazu in unserem <a href="/blog/ile-kosztuje-mieszkanie-w-kolobrzegu-ceny-ofertowe-i-transakcyjne" style={link}>Beitrag zu den Preisen in Kolberg</a> (auf Polnisch).
      </P>

      <H2>So läuft die Zusammenarbeit</H2>
      <UL>
        <LI>Erstkontakt: Sie schildern uns Ihre Wünsche schriftlich per E-Mail oder Kontaktformular.</LI>
        <LI>Passende Angebote und Besichtigungstermine.</LI>
        <LI>Begleitung bei Verhandlungen und Formalitäten. Für rechtliche Fragen empfehlen wir die Beratung durch einen Notar oder Rechtsanwalt.</LI>
      </UL>

      <H2>Kontakt</H2>
      <P>
        InvestRent Nieruchomości, ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg<br />
        Telefon: +48 731 554 341 · E-Mail: <a href="mailto:biuro@investrent.com.pl" style={link}>biuro@investrent.com.pl</a><br />
        Öffnungszeiten: Mo–Fr 8:00–16:00 Uhr, Sa 10:00–15:00 Uhr. Wir antworten in der Regel innerhalb von 24 Stunden.
      </P>
      <P>
        Auf Deutsch betreuen wir Sie schriftlich: Schreiben Sie uns per E-Mail oder <a href="/kontakt" style={link}>Kontaktformular</a>, wir antworten Ihnen auf Deutsch.
      </P>

      <H2>Häufig gestellte Fragen</H2>
      {FAQ.map(f => (
        <P key={f.q}><strong>{f.q}</strong><br />{f.a}</P>
      ))}
      <P last>
        <a href="/de/impressum" style={link}>Impressum</a> · <a href="/de/datenschutz" style={link}>Datenschutz</a>
      </P>
    </LegalShell>
  )
}
