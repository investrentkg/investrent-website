'use client'

import { useState } from 'react'
import type { Office } from '@/types'

// Sticky pasek ikonek social media, przyklejony do bocznej krawędzi strony,
// przesuwa się razem ze scrollem (żądanie Daniela 16.07.2026).
//
// NAPRAWA 17.07.2026: Facebook miał tu żywy podgląd przez oficjalny Page
// Plugin (iframe) - działał w momencie wdrożenia, ale zgłoszenie Daniela
// ("Facebook nas banuje, server rejected connection") doprowadziło do
// odkrycia, że Meta CAŁKOWICIE wycofała Social Plugins (w tym Page Plugin)
// 10 lutego 2026 - oficjalnie, bez zamiennika ("No replacement plugins are
// being provided", developers.facebook.com/docs/plugins/). To nie był błąd
// naszego kodu - cała funkcja przestała istnieć u źródła, dla wszystkich
// stron na świecie. Oba przyciski (Facebook i Instagram) są więc teraz
// jednolicie prostymi, NIEZAWODNYMI linkami z małą podpowiedzią po
// najechaniu - zero zależności od widżetów stron trzecich, które mogą zniknąć
// bez ostrzeżenia.
export default function SocialSidebar({ office }: { office: Office | null }) {
  const [hovered, setHovered] = useState<'facebook' | 'instagram' | null>(null)
  if (!office?.facebook_url && !office?.instagram_url) return null

  const buttons = [
    office.facebook_url && {
      key: 'facebook' as const,
      href: office.facebook_url,
      label: 'Facebook',
      bg: '#1877F2',
      tooltip: 'Zobacz nasz profil na Facebooku',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
      ),
    },
    office.instagram_url && {
      key: 'instagram' as const,
      href: office.instagram_url,
      label: 'Instagram',
      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
      tooltip: 'Zobacz nasz profil na Instagramie',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg>
      ),
    },
  ].filter(Boolean) as { key: 'facebook' | 'instagram'; href: string; label: string; bg: string; tooltip: string; icon: React.ReactNode }[]

  return (
    <div
      className="fixed z-40 hidden md:flex flex-col gap-2"
      style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
    >
      {buttons.map(b => (
        <div key={b.key} className="relative"
          onMouseEnter={() => setHovered(b.key)}
          onMouseLeave={() => setHovered(null)}>
          {hovered === b.key && (
            <div className="absolute rounded-xl shadow-2xl bg-white px-4 py-3 text-sm"
              style={{ right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8, width: 220 }}>
              <p className="text-gray-700 mb-2">{b.tooltip}</p>
              <a href={b.href} target="_blank" rel="noopener noreferrer"
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: b.bg }}>
                Otwórz {b.label} →
              </a>
            </div>
          )}
          <a href={b.href} target="_blank" rel="noopener noreferrer" aria-label={b.label}
            className="flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
            style={{ width: 44, height: 44, background: b.bg, borderRadius: '8px 0 0 8px' }}>
            {b.icon}
          </a>
        </div>
      ))}
    </div>
  )
}
