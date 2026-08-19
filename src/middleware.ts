import { NextRequest, NextResponse } from 'next/server'

// NOWE (19.08, Google Search Console: "Duplikat, uzytkownik nie oznaczyl
// strony kanonicznej" - nowa, rosnaca kategoria w raporcie indeksowania).
//
// PRZYCZYNA: strona ma poprawnie ustawiony <link rel="canonical"> na
// KAZDEJ podstronie, ZAWSZE wskazujacy na wersje z "www" (patrz
// src/app/oferty/page.tsx, src/app/oferty/[id]/page.tsx i inne -
// BASE_URL = 'https://www.investrent.com.pl'). ALE bez tego middleware
// nic nie WYMUSZALO fizycznego przekierowania miedzy
// investrent.com.pl (bez www) a www.investrent.com.pl (z www) na
// poziomie serwera - Vercel domyslnie moze serwowac ta sama tresc pod
// OBOMA wariantami hosta. Sam tag canonical to dla Google tylko
// SUGESTIA, nie potwierdzenie - bez fizycznego przekierowania 301,
// Google czasem i tak raportuje to jako duplikat zamiast po prostu
// zaufac tagowi.
//
// To jest STANDARDOWA, sprawdzona praktyka SEO: fizyczne przekierowanie
// 301 jest SILNIEJSZYM sygnalem niz sam meta tag, i eliminuje mozliwosc
// zaindeksowania obu wariantow niezaleznie.
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Tylko goly "investrent.com.pl" (bez subdomeny) - "www.investrent.com.pl"
  // i inne subdomeny (np. srodowiska preview Vercel) zostaja nietkniete.
  if (host === 'investrent.com.pl') {
    const url = request.nextUrl.clone()
    url.protocol = 'https'
    url.host = 'www.investrent.com.pl'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Wykluczamy zasoby statyczne i API z middleware - nie ma sensu
// przetwarzac kazdego requestu do /_next/static czy plikow obrazow,
// tylko rzeczywiste strony ktore moga trafic do indeksu Google.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
