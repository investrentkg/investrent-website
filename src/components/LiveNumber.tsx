"use client"
import { useEffect, useRef, useState } from 'react'

interface LiveNumberProps {
  value: number
  format?: (n: number) => string  // domyślnie: zaokrąglone, z separatorem tysięcy pl-PL
  duration?: number               // ms
}

// W przeciwieństwie do AnimatedCounter (liczy raz od zera przy wejściu w pole widoku),
// LiveNumber płynnie "dojeżdża" od poprzedniej wartości do nowej PRZY KAŻDEJ ZMIANIE -
// używane tam, gdzie liczba zmienia się w reakcji na akcję użytkownika (np. suwak
// kalkulatora kredytowego), żeby wynik "żył", zamiast błyskawicznie skakać.
export default function LiveNumber({ value, format, duration = 350 }: LiveNumberProps) {
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString('pl-PL'))
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return

    const start = performance.now()
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - start) / duration, 0), 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic - płynne dojście, bez odbicia
      setDisplay(from + (to - from) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return <>{fmt(display)}</>
}
