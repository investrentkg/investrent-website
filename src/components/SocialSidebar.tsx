'use client'

import { useState } from 'react'
import type { Office } from '@/types'

// Sticky pasek ikonek social media, przyklejony do bocznej krawędzi strony,
// przesuwa się razem ze scrollem (żądanie Daniela 16.07.2026).
//
// Facebook ma oficjalny, publiczny widżet strony (Page Plugin) - nie wymaga
// kluczy API ani logowania, można go osadzić jako zwykły iframe. Dlatego przy
// najechaniu na ikonę Facebooka pokazujemy PRAWDZIWY, żywy podgląd strony.
//
// Instagram od kilku lat NIE oferuje takiego publicznego widżetu - każdy
// "podgląd na żywo" wymagałby pełnej integracji z Graph API Mety (klucze
// dostępu, autoryzacja konta biznesowego) - to osobny, większy projekt, nie
// prosta zmiana wyglądu. Instagram zostaje więc jako zwykły przycisk-link.
export default function SocialSidebar({ office }: { office: Office | null }) {
  const [hovered, setHovered] = useState<'facebook' | 'instagram' | null>(null)
  if (!office?.facebook_url && !office?.instagram_url) return null

  return (
    <div
      className="fixed z-40 hidden md:flex flex-col gap-2"
      style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
    >
      {office.facebook_url && (
        <div
          className="relative"
          onMouseEnter={() => setHovered('facebook')}
          onMouseLeave={() => setHovered(null)}
        >
          {hovered === 'facebook' && (
            <div
              className="absolute rounded-xl overflow-hidden shadow-2xl bg-white"
              style={{ right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8, width: 300, height: 380 }}
            >
              {/* Prawdziwy, publiczny widżet Facebooka (Page Plugin) - nie wymaga
                  logowania ani kluczy API, pokazuje żywe posty/dane strony */}
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(office.facebook_url)}&tabs=timeline&width=300&height=380&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="300" height="380" style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no" frameBorder="0" allowFullScreen
                title="Podgląd Facebook"
              />
            </div>
          )}
          <a href={office.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
            style={{ width: 44, height: 44, background: '#1877F2', borderRadius: '8px 0 0 8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
          </a>
        </div>
      )}
      {office.instagram_url && (
        <div
          className="relative"
          onMouseEnter={() => setHovered('instagram')}
          onMouseLeave={() => setHovered(null)}
        >
          {hovered === 'instagram' && (
            <div
              className="absolute rounded-xl shadow-2xl bg-white px-4 py-3 text-sm"
              style={{ right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8, width: 220 }}
            >
              <p className="text-gray-700 mb-2">Zobacz nasz profil na Instagramie</p>
              <a href={office.instagram_url} target="_blank" rel="noopener noreferrer"
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
                Otwórz Instagram →
              </a>
            </div>
          )}
          <a href={office.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
            style={{ width: 44, height: 44, background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', borderRadius: '8px 0 0 8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg>
          </a>
        </div>
      )}
    </div>
  )
}
