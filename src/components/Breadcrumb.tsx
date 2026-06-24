"use client"
interface Crumb { label: string; href?: string }
interface Props { crumbs: Crumb[]; light?: boolean }

export default function Breadcrumb({ crumbs, light = true }: Props) {
  const linkColor  = light ? 'rgba(255,255,255,.65)' : '#1a4fa0'
  const activeColor = light ? 'white' : '#111827'
  const sepColor   = light ? 'rgba(255,255,255,.35)' : '#d1d5db'

  return (
    <div style={{ padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <span style={{ color: sepColor, fontSize: 15 }}>›</span>}
          {c.href && i < crumbs.length - 1 ? (
            <a href={c.href} style={{ color: linkColor, textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = light ? 'white' : '#0d2a5c')}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}>
              {c.label}
            </a>
          ) : (
            <span style={{ color: activeColor, fontWeight: 700 }}>{c.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
