import type { CSSProperties } from 'react'

interface SuccessBadgeProps {
  text: string
  style?: CSSProperties
  className?: string
}

// Znaczek pokazywany po udanym wysłaniu formularza (zostawieniu numeru telefonu itp.)
// Haczyk "rysuje się" sam (SVG stroke-dashoffset), całość delikatnie wjeżdża ze
// sprężystym efektem - ten moment to najważniejszy punkt konwersji w całej ścieżce,
// więc zasługuje na wyraźne, satysfakcjonujące potwierdzenie, nie suchy tekst.
export default function SuccessBadge({ text, style, className = '' }: SuccessBadgeProps) {
  return (
    <div
      className={`success-badge ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.18" />
        <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{text}</span>
    </div>
  )
}
