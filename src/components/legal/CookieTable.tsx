import type { CSSProperties } from 'react'

// Tabela cookies i zapisow w pamieci przegladarki dla polityk prywatnosci (/rodo - PL, /de/datenschutz - DE).
// Rekomendacja Prawnika 09.10.2026 (prawnik_baner_zgod_doprecyzowanie_2026_10_09.md, pkt d): kolumny nazwa / dostawca / cel / czas zycia.
// Fakty zweryfikowane w kodzie main (09.10.2026):
//  - _ga, _ga_<ID>: src/components/GoogleAnalytics.tsx - gtag('config', ID) bez cookie_expires/cookie_domain => domyslne ustawienia Google (2 lata), ladowane DOPIERO po zgodzie "analytics".
//  - ir_consent: src/lib/consent.ts (CONSENT_STORAGE_KEY, localStorage; CONSENT_MAX_AGE_MS = 12 mies., potem ponowne pytanie).
//  - ir_attr: src/lib/attribution.ts (ATTRIBUTION_STORAGE_KEY, sessionStorage; tylko po zgodzie "attribution"; kasowany po jej wycofaniu - consentStore.ts).
//  - ir_launcher_hints: src/components/ChatWidget.tsx (sessionStorage, flagi podpowiedzi okna czatu).
//  - Reklamowe (Meta Pixel/CAPI): ADS_AVAILABLE = false w consent.ts - nic nie jest zapisywane.
// Tabela jest zrodlem prawdy dla tekstu polityki: przy zmianie zapisow (nowy klucz, inny czas zycia, nowy dostawca) zmienic ja RAZEM z CONSENT_VERSION / banerem zgod.
// Przewijanie poziome tylko w kontenerze tabeli (nie strony).

type Locale = 'pl' | 'de'

interface Row { name: string; kind: string; provider: string; purpose: string; lifetime: string }
interface Group { title: string; rows: Row[] }

const OWN = { pl: 'InvestRent (własne)', de: 'InvestRent (eigene)' }
const GOOGLE = 'Google Ireland Limited'

const TEXT: Record<Locale, {
  caption: string; cols: [string, string, string, string]; scroll: string; groups: Group[]
}> = {
  pl: {
    caption: 'Pliki cookie i zapisy w pamięci przeglądarki używane na stronie',
    cols: ['Nazwa', 'Dostawca', 'Cel', 'Czas życia'],
    scroll: 'Tabela plików cookie i pamięci przeglądarki (przewijana poziomo)',
    groups: [
      {
        title: 'Niezbędne (bez zgody)',
        rows: [
          { name: 'ir_consent', kind: 'pamięć lokalna (localStorage)', provider: OWN.pl, purpose: 'Zapamiętuje Państwa wybór w banerze zgód (które kategorie włączono).', lifetime: '12 miesięcy od wyboru, potem poprosimy o niego ponownie' },
          { name: 'ir_launcher_hints', kind: 'pamięć sesji (sessionStorage)', provider: OWN.pl, purpose: 'Zapamiętuje, czy okno czatu pokazało już podpowiedź. Bez danych osobowych.', lifetime: 'do zamknięcia karty przeglądarki' },
        ],
      },
      {
        title: 'Analityczne (tylko po zgodzie)',
        rows: [
          { name: '_ga', kind: 'cookie', provider: GOOGLE, purpose: 'Google Analytics 4: rozróżnia użytkowników, aby liczyć odwiedziny i sprawdzać, jak korzystają Państwo ze strony.', lifetime: '2 lata (ustawienie domyślne Google)' },
          { name: '_ga_<identyfikator>', kind: 'cookie', provider: GOOGLE, purpose: 'Google Analytics 4: utrzymuje stan sesji wizyty.', lifetime: '2 lata (ustawienie domyślne Google)' },
        ],
      },
      {
        title: 'Marketingowe (tylko po zgodzie)',
        rows: [
          { name: 'ir_attr', kind: 'pamięć sesji (sessionStorage)', provider: OWN.pl, purpose: 'Zapisuje, z jakiej kampanii Państwo przyszli (parametry UTM i znacznik wejścia z linku reklamowego Facebooka), aby dołączyć to do wysłanego zgłoszenia i mierzyć skuteczność kampanii. Dane pozostają w systemach InvestRent.', lifetime: 'do zamknięcia karty przeglądarki; usuwany od razu po wycofaniu zgody' },
        ],
      },
      {
        title: 'Reklamowe (planowane, obecnie brak)',
        rows: [
          { name: '—', kind: 'obecnie nic nie jest zapisywane', provider: 'Meta Platforms Ireland Limited (planowane)', purpose: 'Kategoria zarezerwowana na przyszłość (narzędzia reklamowe Meta). Nie jest dziś stosowana i nie można jej włączyć.', lifetime: '—' },
        ],
      },
    ],
  },
  de: {
    // Arbeitsuebersetzung (nicht von der Kanzlei geprueft) - PL ist die Referenzfassung.
    caption: 'Auf der Website verwendete Cookies und Einträge im Browserspeicher',
    cols: ['Name', 'Anbieter', 'Zweck', 'Lebensdauer'],
    scroll: 'Tabelle der Cookies und des Browserspeichers (horizontal scrollbar)',
    groups: [
      {
        title: 'Notwendig (ohne Einwilligung)',
        rows: [
          { name: 'ir_consent', kind: 'lokaler Speicher (localStorage)', provider: OWN.de, purpose: 'Speichert Ihre Auswahl im Einwilligungsbanner (welche Kategorien aktiviert wurden).', lifetime: '12 Monate ab der Auswahl, danach fragen wir erneut' },
          { name: 'ir_launcher_hints', kind: 'Sitzungsspeicher (sessionStorage)', provider: OWN.de, purpose: 'Merkt sich, ob das Chatfenster bereits einen Hinweis angezeigt hat. Ohne personenbezogene Daten.', lifetime: 'bis zum Schließen des Browser-Tabs' },
        ],
      },
      {
        title: 'Analyse (nur nach Einwilligung)',
        rows: [
          { name: '_ga', kind: 'Cookie', provider: GOOGLE, purpose: 'Google Analytics 4: unterscheidet Nutzer, um Besuche zu zählen und zu verstehen, wie die Website genutzt wird.', lifetime: '2 Jahre (Standardeinstellung von Google)' },
          { name: '_ga_<Kennung>', kind: 'Cookie', provider: GOOGLE, purpose: 'Google Analytics 4: speichert den Sitzungsstatus des Besuchs.', lifetime: '2 Jahre (Standardeinstellung von Google)' },
        ],
      },
      {
        title: 'Marketing (nur nach Einwilligung)',
        rows: [
          { name: 'ir_attr', kind: 'Sitzungsspeicher (sessionStorage)', provider: OWN.de, purpose: 'Speichert, über welche Kampagne Sie zu uns gekommen sind (UTM-Parameter und eine Kennzeichnung des Besuchs über einen Werbelink auf Facebook), um dies Ihrer abgesendeten Anfrage beizufügen und die Wirksamkeit der Kampagnen zu messen. Die Angaben verbleiben in den Systemen von InvestRent.', lifetime: 'bis zum Schließen des Browser-Tabs; wird bei Widerruf der Einwilligung sofort gelöscht' },
        ],
      },
      {
        title: 'Werbung (geplant, derzeit nicht vorhanden)',
        rows: [
          { name: '—', kind: 'derzeit wird nichts gespeichert', provider: 'Meta Platforms Ireland Limited (geplant)', purpose: 'Für die Zukunft vorgesehene Kategorie (Werbetools von Meta). Wird derzeit nicht eingesetzt und kann nicht aktiviert werden.', lifetime: '—' },
        ],
      },
    ],
  },
}

// Kolory jak w LegalShell/globals.css (--navy, --blue, --light); tabela dziedziczy rozmiar i kolor tekstu polityki.
const wrap: CSSProperties = { overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }
const table: CSSProperties = { position: 'relative', width: '100%', minWidth: 720, borderCollapse: 'collapse', fontSize: 13.5, lineHeight: 1.55 }
const cell: CSSProperties = { padding: '10px 12px', textAlign: 'left', verticalAlign: 'top', borderTop: '1px solid #e2e8f0' }
const headCell: CSSProperties = { ...cell, borderTop: 'none', background: '#0d2a5c', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }
const groupCell: CSSProperties = { ...cell, background: '#f8fafc', color: '#0d2a5c', fontWeight: 700 }
const nameCell: CSSProperties = { ...cell, fontWeight: 600, color: '#0d2a5c', minWidth: 170 }
const kindStyle: CSSProperties = { display: 'block', fontWeight: 400, fontSize: 12, color: '#64748b' }
const code: CSSProperties = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }

export default function CookieTable({ locale }: { locale: Locale }) {
  const t = TEXT[locale]
  return (
    <div style={wrap} role="region" aria-label={t.scroll} tabIndex={0}>
      <table style={table}>
        <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{t.caption}</caption>
        <thead>
          <tr>
            {t.cols.map(c => <th key={c} scope="col" style={headCell}>{c}</th>)}
          </tr>
        </thead>
        {t.groups.map(g => (
          <tbody key={g.title}>
            <tr><th scope="rowgroup" colSpan={4} style={groupCell}>{g.title}</th></tr>
            {g.rows.map(r => (
              <tr key={g.title + r.name}>
                <th scope="row" style={nameCell}><span style={r.name === '—' ? undefined : code}>{r.name}</span><span style={kindStyle}>{r.kind}</span></th>
                <td style={cell}>{r.provider}</td>
                <td style={cell}>{r.purpose}</td>
                <td style={cell}>{r.lifetime}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}
