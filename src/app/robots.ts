// NAPRAWA (audyt SEO, Daniel 30.07.2026): robots.txt calkowicie brakowalo.
// Konwencja Next.js App Router - automatycznie dostepne pod /robots.txt.

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.investrent.com.pl/sitemap.xml',
  }
}
