import type { Office } from '@/types'

// Sticky pasek ikonek social media, przyklejony do bocznej krawędzi strony,
// przesuwa się razem ze scrollem (żądanie Daniela 16.07.2026).
//
// NAPRAWA 17.07.2026 (v2): usunięta chmurka-podpowiedź po najechaniu -
// zgłoszenie Daniela: "klikam w ikonkę Facebook i od razu mnie przekierowuje,
// bez dodatkowych okienek". Ikonka to teraz bezpośredni link - jedno
// kliknięcie, bez pośredniego kroku. Otwiera się w NOWEJ karcie (celowo -
// odwiedzający nie traci Waszej strony z ofertami, gdy zerknie na social
// media - może wrócić i kontynuować przeglądanie).
//
// (v1, wcześniej tego samego dnia: usunięty żywy podgląd Facebooka przez
// Page Plugin - Meta całkowicie wycofała ten widżet 10.02.2026, bez
// zamiennika, dla wszystkich stron na świecie).
//
// Bez interaktywnego stanu (hover) - z powrotem zwykły Server Component,
// nie potrzeba już 'use client'.
export default function SocialSidebar({ office }: { office: Office | null }) {
  if (!office?.facebook_url && !office?.instagram_url) return null

  const buttons = [
    office.facebook_url && {
      key: 'facebook' as const,
      href: office.facebook_url,
      label: 'Facebook',
      bg: '#1877F2',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
      ),
    },
    office.instagram_url && {
      key: 'instagram' as const,
      href: office.instagram_url,
      label: 'Instagram',
      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg>
      ),
    },
  ].filter(Boolean) as { key: 'facebook' | 'instagram'; href: string; label: string; bg: string; icon: React.ReactNode }[]

  return (
    <div
      className="fixed z-40 hidden md:flex flex-col gap-2"
      style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
    >
      {buttons.map(b => (
        <a key={b.key} href={b.href} target="_blank" rel="noopener noreferrer" aria-label={b.label}
          className="flex items-center justify-center shadow-lg hover:brightness-110 transition-all social-icon"
          style={{ width: 44, height: 44, background: b.bg, borderRadius: '8px 0 0 8px' }}>
          {b.icon}
        </a>
      ))}
    </div>
  )
}
