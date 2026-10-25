// NAPRAWA (audyt SEO, Daniel 30.07.2026): robots.txt calkowicie brakowalo.
// Konwencja Next.js App Router - automatycznie dostepne pod /robots.txt.

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    // /podglad/ = linki podglądu roboczych ofert (token w adresie, noindex) - crawlery w ogóle tam nie wchodzą.
    rules: { userAgent: '*', allow: '/', disallow: ['/podglad/'] },
    sitemap: 'https://www.investrent.com.pl/sitemap.xml',
  }
}
