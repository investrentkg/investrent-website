// Flaga Google Ads w zgodach (jak GOOGLE_ADS_CONSENT_ENABLED w consent.ts; tu bez importu, zeby modul byl niezalezny).
const G: boolean = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONSENT === 'on'

// v4 (11.11.2026): PL pierwsza warstwa i etykiety przyciskow wg makiety M_v8n, TAK Prawnika (jednakowy styl trzech przyciskow, link do Polityki w pierwszej warstwie).
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
  ads: { name: string; badge: string; desc: string; /** Tekst po wdrożeniu piksela (ADS_AVAILABLE); PROPOZYCJA do akceptacji Daniela/Prawnika. */ liveDesc: string }
  /** Zdanie o wycofaniu zgody; po nim link do polityki. */
  withdraw: string
  privacyLabel: string
  privacyHref: string
  footerButton: string
}

export const CONSENT_COPY: Record<ConsentLocale, ConsentCopy> = {
  pl: {
    title: 'Ustawienia prywatności',
    intro: 'Cookies do działania strony; za Twoją zgodą także statystyki i reklamy.',
    rejectAll: 'Tylko niezbędne',
    customize: 'Ustawienia',
    acceptAll: 'Zaakceptuj',
    save: 'Zapisz wybór',
    settingsTitle: 'Ustawienia prywatności',
    necessary: {
      name: 'Niezbędne',
      alwaysActive: 'zawsze aktywne',
      desc: 'umożliwiają podstawowe działanie strony, w tym zapamiętanie Państwa wyboru dotyczącego plików cookies. Nie można ich wyłączyć.',
    },
    analytics: {
      name: 'Analityczne',
      desc: 'Google Analytics (Google Ireland Limited) pomaga nam zrozumieć, jak korzystają Państwo ze strony, żebyśmy mogli ją ulepszać. Dane mogą być przekazywane poza Europejski Obszar Gospodarczy (szczegóły w polityce prywatności).' + (G ? ' Dane z Google Analytics mogą być też wykorzystywane w Google Ads do zbiorczych statystyk skuteczności reklam.' : ''),
    },
    marketing: {
      name: 'Marketingowe',
      desc: 'pozwalają nam mierzyć skuteczność kampanii reklamowych, np. zapisując, z jakiej kampanii przyszedł użytkownik.',
    },
    ads: {
      name: 'Reklamowe',
      badge: 'planowane',
      // v4 (Prawnik 11.11.2026, forma Państwo): jeden tekst dla liveDesc i desc; "Jeśli korzystamy" pokrywa narzędzia aktywne dziś i w przyszłości (Meta, Google Ads) bez kolejnego podbicia wersji.
      liveDesc: 'Pozwalają nam mierzyć skuteczność i dopasowanie naszych reklam. Jeśli korzystamy z narzędzi pomiaru reklam (Meta Pixel/Conversions API, znacznik konwersji Google Ads), po wysłaniu przez Państwa zgłoszenia na stronie przekażemy do Meta Platforms Ireland Limited i/lub Google Ireland Limited (odrębni administratorzy danych) informację o tym zdarzeniu — bez imienia, numeru telefonu i adresu e-mail — wraz z identyfikatorami przeglądarki i kliknięcia reklamy (np. fbp/fbc, gclid) oraz adresem IP i danymi przeglądarki. Dane mogą być przekazywane poza Europejski Obszar Gospodarczy.' + (G ? ' Po Państwa zgodzie mogą być zapisywane pliki cookie Google (_gcl_aw, _gcl_au) oraz, jeśli używamy Piksela Meta, także Meta (_fbp, _fbc).' : '') + ' Zgoda jest dobrowolna.',
      desc: 'Pozwalają nam mierzyć skuteczność i dopasowanie naszych reklam. Jeśli korzystamy z narzędzi pomiaru reklam (Meta Pixel/Conversions API, znacznik konwersji Google Ads), po wysłaniu przez Państwa zgłoszenia na stronie przekażemy do Meta Platforms Ireland Limited i/lub Google Ireland Limited (odrębni administratorzy danych) informację o tym zdarzeniu — bez imienia, numeru telefonu i adresu e-mail — wraz z identyfikatorami przeglądarki i kliknięcia reklamy (np. fbp/fbc, gclid) oraz adresem IP i danymi przeglądarki. Dane mogą być przekazywane poza Europejski Obszar Gospodarczy.' + (G ? ' Po Państwa zgodzie mogą być zapisywane pliki cookie Google (_gcl_aw, _gcl_au) oraz, jeśli używamy Piksela Meta, także Meta (_fbp, _fbc).' : '') + ' Zgoda jest dobrowolna.',
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
      desc: 'Google Analytics (Google Ireland Limited) hilft uns zu verstehen, wie Sie die Website nutzen, damit wir sie verbessern können. Daten können außerhalb des Europäischen Wirtschaftsraums verarbeitet werden (Einzelheiten in der Datenschutzerklärung).' + (G ? ' Die Daten aus Google Analytics können zudem in Google Ads für aggregierte Statistiken zur Wirksamkeit von Anzeigen genutzt werden.' : ''),
    },
    marketing: {
      name: 'Marketing',
      desc: 'ermöglichen uns, die Wirksamkeit unserer Werbekampagnen zu messen, z. B. indem gespeichert wird, über welche Kampagne Sie zu uns gekommen sind.',
    },
    ads: {
      name: 'Werbung',
      badge: 'geplant',
      // v4: Übersetzung des Prawnik-Textes (11.11.2026); VOR Veröffentlichung Durchsicht durch die DE-Textverantwortliche Person (Ernest) nötig.
      liveDesc: 'Sie ermöglichen uns, die Wirksamkeit und Ausrichtung unserer Werbung zu messen. Sofern wir Tools zur Anzeigenmessung nutzen (Meta Pixel/Conversions API, Google Ads Conversion-Tracking), übermitteln wir nach dem Absenden Ihrer Anfrage auf unserer Website an Meta Platforms Ireland Limited und/oder Google Ireland Limited (jeweils eigenständige Verantwortliche) Informationen über dieses Ereignis — ohne Namen, Telefonnummer oder E-Mail-Adresse — zusammen mit Browser- und Klick-Kennungen (z. B. fbp/fbc, gclid) sowie der IP-Adresse und Browserdaten. Die Daten können außerhalb des Europäischen Wirtschaftsraums übermittelt werden.' + (G ? ' Mit Ihrer Einwilligung können Cookies von Google (_gcl_aw, _gcl_au) und, falls wir das Meta-Pixel einsetzen, auch von Meta (_fbp, _fbc) gespeichert werden.' : '') + ' Die Einwilligung ist freiwillig.',
      desc: 'Sie ermöglichen uns, die Wirksamkeit und Ausrichtung unserer Werbung zu messen. Sofern wir Tools zur Anzeigenmessung nutzen (Meta Pixel/Conversions API, Google Ads Conversion-Tracking), übermitteln wir nach dem Absenden Ihrer Anfrage auf unserer Website an Meta Platforms Ireland Limited und/oder Google Ireland Limited (jeweils eigenständige Verantwortliche) Informationen über dieses Ereignis — ohne Namen, Telefonnummer oder E-Mail-Adresse — zusammen mit Browser- und Klick-Kennungen (z. B. fbp/fbc, gclid) sowie der IP-Adresse und Browserdaten. Die Daten können außerhalb des Europäischen Wirtschaftsraums übermittelt werden.' + (G ? ' Mit Ihrer Einwilligung können Cookies von Google (_gcl_aw, _gcl_au) und, falls wir das Meta-Pixel einsetzen, auch von Meta (_fbp, _fbc) gespeichert werden.' : '') + ' Die Einwilligung ist freiwillig.',
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
