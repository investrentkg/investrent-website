/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'sqpepaiqwxginqnglspl.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,  // ignoruj błędy ESLint przy buildzie
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // ═══════════════════════════════════════════════════════════════════
  // PRZEKIEROWANIA 301 ZE STAREJ STRONY (Virgo Galactica) — KRYTYCZNE
  // (Daniel 30.07.2026: "nie chcę żeby zmiana platformy zaszkodziła
  // pozycjonowaniu, to ma byc terapia bez szoku dla Google").
  //
  // Stara strona (investrent.com.pl, platforma Virgo) ma inna strukture URL
  // niz nowa. Bez przekierowan kazdy stary, zaindeksowany adres zwrocilby
  // 404 w momencie przelaczenia domeny - Google traktuje to jako sygnal
  // negatywny (utracona tresc), a realni odwiedzajacy z linkow/zakladek
  // trafialiby na blad zamiast na strone.
  //
  // permanent: true = kod 301 (przekazuje "moc" SEO starego adresu na nowy,
  // nie 302 ktory tego nie robi).
  // ═══════════════════════════════════════════════════════════════════
  async redirects() {
    return [
      // Proste zmiany nazw (czasowniki -> rzeczowniki)
      { source: '/kup',      destination: '/kupno',    permanent: true },
      { source: '/sprzedaj', destination: '/sprzedaz', permanent: true },
      { source: '/wynajmij', destination: '/wynajem',  permanent: true },

      // Kategorie ofert - stara strona mialy osobne adresy per typ, nowa
      // filtruje przez query string na wspolnej stronie /oferty
      { source: '/oferty/mieszkania', destination: '/oferty?property_type=mieszkanie', permanent: true },
      { source: '/oferty/domy',       destination: '/oferty?property_type=dom',        permanent: true },
      { source: '/oferty/dzialki',    destination: '/oferty?property_type=dzialka',    permanent: true },
      { source: '/oferty/lokale',     destination: '/oferty?property_type=lokal',      permanent: true },
      { source: '/oferty/hale',       destination: '/oferty?property_type=magazyn',    permanent: true },
      // "Obiekty" nie ma odpowiednika w nowym systemie typow nieruchomosci -
      // przekierowanie do ogolnej listy zamiast 404
      { source: '/oferty/obiekty',    destination: '/oferty', permanent: true },

      // Strony per-agent (stare ID Virgo typu "ag-25731" nie maja odpowiednika
      // w nowych ID uzytkownikow CRM - nie da sie 1:1 zmapowac) -> ogolna lista
      { source: '/oferty/sf/:agentSlug*', destination: '/oferty', permanent: true },

      // Funkcje bez odpowiednika w nowym serwisie (ulubione po stronie
      // klienta, formularze "zglos nieruchomosc") -> strona glowna/kontakt
      { source: '/obserwowane',          destination: '/',        permanent: true },
      { source: '/oferuje-nieruchomosc', destination: '/sprzedaz', permanent: true },
      { source: '/szukam-nieruchomosci', destination: '/kupno',    permanent: true },

      // Blog - nowa strona go jeszcze nie ma. Przekierowanie do strony glownej
      // zamiast 404, do czasu ewentualnego zbudowania odpowiednika.
      { source: '/blog',       destination: '/', permanent: true },
      { source: '/blog/:path*', destination: '/', permanent: true },

      // KATCH-ALL: pojedyncze strony ofert na starej stronie mialy adresy typu
      // "/hale-na-sprzedaz-1390000zl-4000m2-gryfice/7150775" (slug + numeryczne
      // ID Virgo) - te ID nie maja zadnego odpowiednika w nowej bazie (inny
      // system, inne ID). Zamiast 404, przekierowanie do listy ofert - to
      // wciaz duzo lepszy sygnal dla Google (przekierowanie) niz strona bledu,
      // i realny odwiedzajacy trafia gdzies uzytecznie zamiast na "404".
      // Dopasowuje TYLKO adresy dwuczlonowe gdzie drugi czlon jest czysto
      // liczbowy - nie koliduje z zadna z istniejacych, znanych tras strony.
      { source: '/:slug/:id(\\d+)', destination: '/oferty', permanent: true },
    ]
  },
}

module.exports = nextConfig
