const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.investrent.com.pl'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'InvestRent Nieruchomości'
const DEFAULT_IMAGE = '/hero.jpg'

/**
 * Builds page-specific social metadata while keeping the canonical URL aligned.
 * @param {import('next').Metadata} pageMetadata
 * @param {string} path
 * @param {{ image?: string, imageAlt?: string, locale?: string }} [options]
 * @returns {import('next').Metadata}
 */
export function buildPageMeta(pageMetadata, path, { image = DEFAULT_IMAGE, imageAlt, locale = 'pl_PL' } = {}) {
  const title = typeof pageMetadata.title === 'string' ? pageMetadata.title : (pageMetadata.title?.absolute || pageMetadata.title?.template || '')
  const description = pageMetadata.description || ''
  const canonical = new URL(path, SITE_URL).toString()
  const imageUrl = new URL(image, SITE_URL).toString()

  return {
    ...pageMetadata,
    alternates: { ...(pageMetadata.alternates || {}), canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1920, height: 1080, alt: imageAlt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
