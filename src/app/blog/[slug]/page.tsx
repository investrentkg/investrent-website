// NOWE (14.08.2026, patrz kontekst w src/app/blog/page.tsx i backend/src/
// routes/blog.ts w investrent-crm). Ten sam wzorzec metadanych/schema.org
// co /oferty/[id]/page.tsx - Article zamiast RealEstateAgent, bo to inny
// typ tresci.
export const revalidate = 300

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getPublicBlogPost, getOffice } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }
const BASE_URL = 'https://www.investrent.com.pl'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublicBlogPost(params.slug)
  if (!post) return { title: 'Wpis | InvestRent' }
  const title = post.meta_title || `${post.title} | InvestRent Blog`
  const description = post.meta_description || post.excerpt || undefined
  return {
    title,
    description,
    openGraph: post.cover_image_url ? { title, description, images: [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }] } : undefined,
    twitter: post.cover_image_url ? { card: 'summary_large_image', title, description, images: [post.cover_image_url] } : undefined,
    alternates: { canonical: `${BASE_URL}/blog/${params.slug}` },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, officeData] = await Promise.all([getPublicBlogPost(params.slug), getOffice()])
  if (!post) notFound()
  const office = officeData ?? FALLBACK_OFFICE

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.meta_description || undefined,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at,
    author: post.users?.full_name ? { '@type': 'Person', name: post.users.full_name } : { '@type': 'Organization', name: 'InvestRent Nieruchomości' },
    publisher: { '@type': 'Organization', name: 'InvestRent Nieruchomości', logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
          </div>
        </div>

        <article className="container" style={{ maxWidth: 760, padding: '40px 0 56px' }}>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#111827', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 28 }}>
            {formatDate(post.published_at)}{post.users?.full_name ? ` · ${post.users.full_name}` : ''}
          </div>

          {post.cover_image_url && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ borderRadius: 14, overflow: 'hidden' }}>
                <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', display: 'block' }} />
              </div>
              {/* NOWE (16.08) - wymog licencyjny Unsplash API Guidelines:
                  kazde uzyte zdjecie musi byc widocznie podpisane autorem
                  z linkiem do jego profilu i do Unsplash. Dyskretne, ale
                  obecne - male, szare, pod obrazkiem. */}
              {post.cover_image_credit?.photographer_name && (
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, textAlign: 'right' }}>
                  Zdjęcie: {post.cover_image_credit.photographer_url ? (
                    <a href={post.cover_image_credit.photographer_url} target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af' }}>{post.cover_image_credit.photographer_name}</a>
                  ) : post.cover_image_credit.photographer_name} / <a href={post.cover_image_credit.photo_url || 'https://unsplash.com'} target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af' }}>Unsplash</a>
                </div>
              )}
            </div>
          )}

          <div style={{ fontSize: 16, color: '#374151', lineHeight: 1.75 }} className="blog-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer office={office} />
      <FloatingWA />
      <SocialSidebar office={office} />
    </>
  )
}
