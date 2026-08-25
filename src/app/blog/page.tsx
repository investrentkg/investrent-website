// NOWE (14.08.2026, Daniel: "jezeli uznasz ze blog bedzie przydatny w
// pozycjonowaniu, mozemy zrobic taka podstrone" - patrz backend/src/
// routes/blog.ts w investrent-crm dla pelnego kontekstu). Ten sam wzorzec
// co /oferty/page.tsx - naglowek z gradientem, siatka kart.
export const dynamic = 'force-dynamic'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import SocialSidebar from '@/components/SocialSidebar'
import Breadcrumb from '@/components/Breadcrumb'
import { getPublicBlogPosts, getOffice } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | InvestRent Nieruchomości Kołobrzeg',
  description: 'Poradniki, analizy rynku i praktyczne wskazówki o kupnie, sprzedaży i wynajmie nieruchomości w Kołobrzegu i na Wybrzeżu Bałtyckim.',
  alternates: { canonical: 'https://www.investrent.com.pl/blog' },
}

const FALLBACK_OFFICE = { name: 'InvestRent', logo_url: '/logo.png', address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg', phone: '+48 731 554 341', email: 'biuro@investrent.com.pl', website: null, working_hours: null }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPage() {
  const [posts, officeData] = await Promise.all([getPublicBlogPosts(), getOffice()])
  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <Nav office={office} />
      <main>
        <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '40px 0 32px' }}>
          <div className="container">
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Blog' }]} />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 36, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>Blog</h1>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>Poradniki i analizy rynku nieruchomości nad Bałtykiem</p>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 0 56px' }}>
          {!posts || posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
              <p style={{ fontSize: 15 }}>Pierwsze artykuły już wkrótce.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <article style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', height: '100%' }}>
                    <div style={{ height: 190, overflow: 'hidden', background: '#f0f4ff', position: 'relative' }}>
                      {post.cover_image_url
                        ? <Image src={post.cover_image_url} alt={post.title} fill unoptimized
                            sizes="(max-width: 768px) 100vw, 400px" loading="lazy" style={{ objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📝</div>}
                    </div>
                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>{formatDate(post.published_at)}</div>
                      <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h2>
                      {post.excerpt && <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.5 }}>{post.excerpt}</p>}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer office={office} />
      <FloatingWA />
      <SocialSidebar office={office} />
    </>
  )
}
