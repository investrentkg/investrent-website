const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.investrent.com.pl'

export type BreadcrumbEntry = { name: string; path: string }
export type SchemaListEntry = { name: string; path: string; image?: string | null }

export function buildBreadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: new URL(entry.path, BASE_URL).toString(),
    })),
  }
}

export function buildCollectionJsonLd(input: { name: string; description: string; path: string; items: SchemaListEntry[]; totalItems?: number }) {
  const collectionUrl = new URL(input.path, BASE_URL).toString()
  const itemListId = `${collectionUrl}#item-list`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': collectionUrl,
        name: input.name,
        description: input.description,
        url: collectionUrl,
        mainEntity: { '@id': itemListId },
      },
      {
        '@type': 'ItemList',
        '@id': itemListId,
        numberOfItems: input.totalItems ?? input.items.length,
        itemListElement: input.items.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.name,
          url: new URL(entry.path, BASE_URL).toString(),
          ...(entry.image ? { image: entry.image } : {}),
        })),
      },
    ],
  }
}

export function buildServiceJsonLd(input: { name: string; description: string; provider: string; areaServed: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: new URL(input.path, BASE_URL).toString(),
    provider: { '@type': 'RealEstateAgent', name: input.provider },
    areaServed: { '@type': 'Place', name: input.areaServed },
  }
}
