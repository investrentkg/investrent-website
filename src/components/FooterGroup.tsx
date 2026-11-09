"use client"
import { useEffect, useRef, type ReactNode } from 'react'

// Sekcja stopki: na desktopie zawsze otwarta (naglowek jak h4), na mobile (<768 px) akordeon <details>.
// Serwer renderuje <details open> - linki sa w HTML zawsze; na mobile po zaladowaniu zwijamy.
export default function FooterGroup({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => { if (ref.current) ref.current.open = !mq.matches }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return (
    <details ref={ref} className={`ft-group ${className ?? ''}`} open>
      <summary>{title}<span aria-hidden="true">+</span></summary>
      {children}
    </details>
  )
}
