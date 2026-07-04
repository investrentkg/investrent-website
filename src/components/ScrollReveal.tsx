"use client"
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number      // ms — do kaskadowego opóźniania kolejnych elementów (np. index * 90)
  className?: string
  style?: CSSProperties  // przekazywane na wrapper - WAŻNE przy elementach flex/grid, żeby
                          // owinięcie nie popsuło layoutu rodzica (np. karuzela z width: 33%)
}

// Odsłania dziecko (fade + lekkie wjechanie od dołu) gdy wejdzie w pole widoku.
// Używane dla kart ofert, sekcji "O nas" itd. — żeby treść pojawiała się w rytm
// przewijania, zamiast być widoczna od razu w całości.
export default function ScrollReveal({ children, delay = 0, className = '', style }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // odsłania raz, nie chowa z powrotem przy wyscrollowaniu
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? 'scroll-reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}
