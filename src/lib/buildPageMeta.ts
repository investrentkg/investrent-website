import type { Metadata } from 'next'

type PageMetaInput = {
  title: string | { absolute: string }
  description: string
  path: string
  locale?: string
  image?: string
}

/** Build page-specific social metadata from the same canonical URL and copy. */
export function buildPageMeta({ title, description, path, locale = 'pl_PL', image = '/hero.jpg' }: PageMetaInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  const socialTitle = typeof title === 'string' ? title : title.absolute
  const url = new URL(path, process.env.NEXT_PUBLIC_SITE_URL || 'https://www.investrent.com.pl').toString()
  const siteName = process.env.NEXT_PUBLIC_BRAND_NAME || 'InvestRent Nieruchomości'

  return {
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      locale,
      url,
      siteName,
      images: [{ url: image, width: 1920, height: 1080, alt: siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image],
    },
  }
}
