import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Linki podglądu roboczej oferty (/oferty/<id>?preview=<token>) trafiają do osobnej trasy dynamicznej
// /podglad/oferty/<id>, dzięki czemu zwykła strona /oferty/[id] nie czyta searchParams i może być ISR
// (cache na krawędzi). Adres w przeglądarce się nie zmienia (rewrite, nie redirect). Pozostałe żądania
// przechodzą bez zmian. Matcher `/oferty/:id` Next kompiluje do wyrażenia pasującego tylko do /oferty (sprawdzone w
// middleware-manifest.json), dlatego `/oferty/:path*`; jednosegmentowość adresu pilnuje kod funkcji.
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const preview = searchParams.get('preview')
  if (preview) {
    const id = pathname.replace(/^\/oferty\//, '')
    if (id && !id.includes('/')) {
      const url = req.nextUrl.clone()
      url.pathname = `/podglad/oferty/${id}`
      return NextResponse.rewrite(url)
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/oferty/:path*'] }
