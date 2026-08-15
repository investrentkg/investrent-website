// NAPRAWA (audyt SEO, Daniel 30.07.2026): sitemap.xml calkowicie brakowalo.
// Dla nowo startujacej strony (zero historii indeksowania) to istotnie
// przyspiesza wykrycie i zaindeksowanie wszystkich podstron przez Google,
// zwlaszcza pojedynczych ofert (dynamiczne, bez sitemap trudniej je znalezc).
// Konwencja Next.js App Router - automatycznie dostepne pod /sitemap.xml.

import { MetadataRoute } from 'next'
import { getPublicOffers, getPublicBlogPosts } from '@/lib/api'

const BASE_URL = 'https://www.investrent.com.pl'

const STATIC_PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/oferty', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/kupno', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/sprzedaz', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/wynajem', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/zarzadzanie-najmem', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/kalkulator', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/trudne-nieruchomosci', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/o-nas', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/kontakt', priority: 0.7, changeFrequency: 'monthly' as const },
  // /rodo CELOWO pominiete - oznaczone noindex (patrz rodo/page.tsx), obecnosc
  // w sitemapie razem z noindex to sprzeczny sygnal dla Google.
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(p => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  // Wszystkie aktywne oferty - paginowane po stronie API, wiec pobieramy
  // strona po stronie az do konca (limit 100/req, zabezpieczenie 20 stron =
  // max 2000 ofert, z zapasem ponad realna skale biura).
  //
  // NAPRAWA (01.08.2026, Google Search Console: "Nie udalo sie pobrac" przy
  // proble mapy strony): backend na Railway usypia przy bezczynnosci -
  // pierwsze zapytanie po przerwie bywa wolne (znany, wczesniejszy problem
  // w tym projekcie). fetch() w apiFetch() nie mial ZADNEGO limitu czasu -
  // przy wolnym "wybudzeniu" backendu, generowanie calej mapy strony moglo
  // sie nie zdazyc na czas, i Google dostawal blad zamiast tresci zamiast
  // przynajmniej statycznych podstron. Dodany jawny, krotki timeout (8s) -
  // w najgorszym razie mapa strony wraca z samymi statycznymi podstronami
  // zamiast wisiec/zawiesic sie calkowicie.
  let offerEntries: MetadataRoute.Sitemap = []
  try {
    let page = 1
    let pages = 1
    do {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      let res
      try {
        res = await getPublicOffers({ page, limit: 100 }, controller.signal)
      } finally {
        clearTimeout(timeoutId)
      }
      if (!res) break
      offerEntries = offerEntries.concat(
        res.data.map(o => ({
          url: `${BASE_URL}/oferty/${o.id}`,
          lastModified: new Date(o.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      )
      pages = res.pagination.pages
      page++
    } while (page <= pages && page <= 20)
  } catch {
    // Jesli API akurat niedostepne przy generowaniu sitemapy - lepiej zwrocic
    // same strony statyczne niz wywalic caly build.
  }

  // NOWE (14.08) - wpisy bloga, ten sam wzorzec ochronny co oferty wyzej
  // (jesli API akurat niedostepne, zwracamy sitemape bez tej czesci
  // zamiast wywalic caly build).
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await getPublicBlogPosts()
    blogEntries = (posts || []).map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // jw.
  }

  return [...staticEntries, ...offerEntries, ...blogEntries]
}
