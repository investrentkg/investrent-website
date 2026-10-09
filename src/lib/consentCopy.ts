// Teksty banera zgód PL/DE - ZATWIERDZONE PRZEZ PRAWNIKA (opinia 03.10.2026:
// _wspolne_pliki/prawnik_opinia_baner_cookies_pixel_capi_2026_10_03.md, sekcja "Gotowy tekst"), wstawione DOSŁOWNIE.
// Odstępstwa (do akceptacji Prawnika przy przeglądzie PR):
//  1. marketing.desc: zdanie Prawnika z 09.10.2026 (doprecyzowanie pkt a: cel przed mechanizmem), PL dosłownie, DE tłumaczenie;
//     zdania o Meta Pixel/CAPI i transferze poza EOG USUNIĘTE z Marketingowych; przełączniki rozdzielone (pkt c): Marketingowe (UTM) i Reklamowe (Meta) -
//     ads.desc: tekst roboczy RP w czasie przyszłym/warunkowym (pkt b), do przeglądu Prawnika;
//  2. save ("Zapisz wybór"/"Auswahl speichern") i privacyLabel - dodane etykiety UI, których opinia nie podaje.
// Jedno źródło prawdy dla banera, panelu ustawień i przycisku w stopce.

export type ConsentLocale = 'pl' | 'de'

export interface ConsentCopy {
  title: string
  /** Pierwsza warstwa - pełny tekst Prawnika (z klauzulą o pomiarze reklam). */
  intro: string
  rejectAll: string
  customize: string
  acceptAll: string
  save: string
  settingsTitle: string
  necessary: { name: string; alwaysActive: string; desc: string }
  analytics: { name: string; desc: string }
  /** Marketingowe = zapis atrybucji UTM (dane wyłącznie wewnętrzne). */
  marketing: { name: string; desc: string }
  /** Reklamowe = przyszły Meta Pixel/CAPI (udostępnianie danych Meta); do wdrożenia przełącznik nieaktywny. */
  ads: { name: string; badge: string; desc: string }
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
      desc: 'pozwalają nam mierzyć skuteczność kampanii reklamowych, np. zapisując, z jakiej kampanii przyszedł użytkownik.',
    },
    ads: {
      name: 'Reklamowe (Meta)',
      badge: 'planowane',
      desc: 'obecnie nic tu nie uruchamiamy. Ewentualne udostępnianie danych Meta Platforms Ireland Limited w celu pomiaru reklam na Facebooku i Instagramie będzie wymagało Państwa odrębnej zgody.',
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
      desc: 'ermöglichen uns, die Wirksamkeit unserer Werbekampagnen zu messen, z. B. indem gespeichert wird, über welche Kampagne Sie zu uns gekommen sind.',
    },
    ads: {
      name: 'Werbung (Meta)',
      badge: 'geplant',
      desc: 'derzeit läuft hier nichts. Eine etwaige Weitergabe von Daten an Meta Platforms Ireland Limited zur Messung von Werbung auf Facebook und Instagram erfordert Ihre gesonderte Einwilligung.',
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
