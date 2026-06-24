"use client"
interface Crumb { label: string; href?: string }
export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <div style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <span style={{ color: '#d1d5db' }}>›</span>}
          {c.href ? (
            <a href={c.href} style={{ color: i === crumbs.length - 1 ? '#111827' : '#1a4fa0', fontWeight: i === crumbs.length - 1 ? 600 : 400, textDecoration: 'none' }}>
              {c.label}
            </a>
          ) : (
            <span style={{ color: '#111827', fontWeight: 600 }}>{c.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
