// Teksty banera zgód PL/DE - ZATWIERDZONE PRZEZ PRAWNIKA (opinia 03.10.2026:
// _wspolne_pliki/prawnik_opinia_baner_cookies_pixel_capi_2026_10_03.md, sekcja "Gotowy tekst"), wstawione DOSŁOWNIE.
// Odstępstwa (do akceptacji Prawnika przy przeglądzie PR):
//  1. introAnalyticsOnly: wariant pierwszej warstwy BEZ klauzuli o pomiarze reklam - używany dopóki nie jest wdrożony
//     piksel Meta (nie pytamy o zgodę na to, czego nie ma; kategoria "marketing" też jest wtedy ukryta);
//  2. save ("Zapisz wybór"/"Auswahl speichern") i privacyLabel - dodane etykiety UI, których opinia nie podaje.
// Jedno źródło prawdy dla banera, panelu ustawień i przycisku w stopce.

export type ConsentLocale = 'pl' | 'de'

export interface ConsentCopy {
  title: string
  /** Pierwsza warstwa - pełny tekst Prawnika (z klauzulą o pomiarze reklam); gdy marketing dostępny. */
  intro: string
  /** Pierwsza warstwa bez klauzuli o reklamach (marketing jeszcze niewdrożony). */
  introAnalyticsOnly: string
  rejectAll: string
  customize: string
  acceptAll: string
  save: string
  settingsTitle: string
  necessary: { name: string; alwaysActive: string; desc: string }
  analytics: { name: string; desc: string }
  marketing: { name: string; desc: string }
  /** Zdanie o wycofaniu zgody; po nim link do polityki. */
  withdraw: string
  privacyLabel: string
  privacyHref: string
  footerButton: string
}

export const CONSENT_COPY: Record<ConsentLocale, ConsentCopy> = {
  pl: {
    title: 'Ustawienia prywatności',
    intro:
      'Używamy plików cookies, aby strona działała poprawnie oraz — za Państwa zgodą — do analizy ruchu na stronie i pomiaru skuteczności naszych reklam. Mogą Państwo zaakceptować wszystkie, odrzucić wszystkie poza niezbędnymi lub dostosować wybór.',
    introAnalyticsOnly:
      'Używamy plików cookies, aby strona działała poprawnie oraz — za Państwa zgodą — do analizy ruchu na stronie. Mogą Państwo zaakceptować wszystkie, odrzucić wszystkie poza niezbędnymi lub dostosować wybór.',
    rejectAll: 'Odrzuć wszystkie',
    customize: 'Dostosuj',
    acceptAll: 'Zaakceptuj wszystkie',
    save: 'Zapisz wybór',
    settingsTitle: 'Ustawienia prywatności',
    necessary: {
      name: 'Niezbędne',
      alwaysActive: 'zawsze aktywne',
      desc: 'umożliwiają podstawowe działanie strony, w tym zapamiętanie Państwa wyboru dotyczącego plików cookies. Nie można ich wyłączyć.',
    },
    analytics: {
      name: 'Analityczne',
      desc: 'Google Analytics (Google Ireland Limited) pomaga nam zrozumieć, jak korzystają Państwo ze strony, żebyśmy mogli ją ulepszać. Dane mogą być przekazywane poza Europejski Obszar Gospodarczy (szczegóły w polityce prywatności).',
    },
    marketing: {
      name: 'Marketingowe',
      desc: 'Meta Pixel i interfejs konwersji Meta (Meta Platforms Ireland Limited) pozwalają nam mierzyć skuteczność reklam na Facebooku i Instagramie oraz lepiej dopasować je do zainteresowanych osób; obejmuje to także przesyłanie zahaszowanych (nieczytelnych wprost) danych kontaktowych przy zgłoszeniu z formularza, np. kalkulatora wyceny. Dane mogą być przekazywane poza Europejski Obszar Gospodarczy (szczegóły w polityce prywatności).',
    },
    withdraw: 'Zgodę mogą Państwo w każdej chwili zmienić lub wycofać w „Ustawieniach prywatności” (link w stopce strony).',
    privacyLabel: 'Polityka prywatności',
    privacyHref: '/rodo',
    footerButton: 'Ustawienia prywatności',
  },
  de: {
    title: 'Datenschutzeinstellungen',
    intro:
      'Wir verwenden Cookies, damit die Website ordnungsgemäß funktioniert, sowie — mit Ihrer Einwilligung — zur Analyse des Websitetraffics und zur Messung der Wirksamkeit unserer Werbung. Sie können alle akzeptieren, alle außer den notwendigen ablehnen oder Ihre Auswahl anpassen.',
    introAnalyticsOnly:
      'Wir verwenden Cookies, damit die Website ordnungsgemäß funktioniert, sowie — mit Ihrer Einwilligung — zur Analyse des Websitetraffics. Sie können alle akzeptieren, alle außer den notwendigen ablehnen oder Ihre Auswahl anpassen.',
    rejectAll: 'Alle ablehnen',
    customize: 'Einstellungen',
    acceptAll: 'Alle akzeptieren',
    save: 'Auswahl speichern',
    settingsTitle: 'Datenschutzeinstellungen',
    necessary: {
      name: 'Notwendig',
      alwaysActive: 'immer aktiv',
      desc: 'ermöglichen die grundlegende Funktion der Website, einschließlich der Speicherung Ihrer Cookie-Auswahl. Lassen sich nicht deaktivieren.',
    },
    analytics: {
      name: 'Analyse',
      desc: 'Google Analytics (Google Ireland Limited) hilft uns zu verstehen, wie Sie die Website nutzen, damit wir sie verbessern können. Daten können außerhalb des Europäischen Wirtschaftsraums verarbeitet werden (Einzelheiten in der Datenschutzerklärung).',
    },
    marketing: {
      name: 'Marketing',
      desc: 'Meta Pixel und die Meta Conversions API (Meta Platforms Ireland Limited) ermöglichen uns, die Wirksamkeit unserer Werbung auf Facebook und Instagram zu messen und besser auf interessierte Personen auszurichten; dies umfasst auch die Übermittlung gehashter (nicht direkt lesbarer) Kontaktdaten bei einer Formularanfrage, z. B. im Bewertungsrechner. Daten können außerhalb des Europäischen Wirtschaftsraums verarbeitet werden (Einzelheiten in der Datenschutzerklärung).',
    },
    withdraw: 'Sie können Ihre Einwilligung jederzeit in den „Datenschutzeinstellungen” (Link in der Fußzeile) ändern oder widerrufen.',
    privacyLabel: 'Datenschutzerklärung',
    privacyHref: '/de/datenschutz',
    footerButton: 'Datenschutzeinstellungen',
  },
}

/** Język banera po ścieżce: /de/... = niemiecki, reszta polski (w repo nie ma biblioteki i18n). */
export const localeOfPath = (pathname: string | null | undefined): ConsentLocale =>
  pathname === '/de' || (pathname ?? '').startsWith('/de/') ? 'de' : 'pl'
