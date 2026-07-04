"use client"
import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string        // np. "300+", "4.9/5", "do 60 min", "Bezpłatna"
  duration?: number    // ms
}

// Wyciąga pierwszą liczbę (całkowitą lub z przecinkiem) z tekstu, żeby ją animować,
// zachowując resztę tekstu (prefiks/sufiks) bez zmian. Jeśli nie ma liczby
// (np. "Bezpłatna", "do 60 min" — tu liczba jest, animujemy tylko ją), wyświetla statycznie.
function parseValue(value: string): { prefix: string; number: number; decimals: number; suffix: string } | null {
  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const normalized = numStr.replace(',', '.')
  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0
  return { prefix, number: parseFloat(normalized), decimals, suffix }
}

export default function AnimatedCounter({ value, duration = 1400 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState<string>(() => {
    const parsed = parseValue(value)
    return parsed ? `${parsed.prefix}0${parsed.suffix}` : value
  })
  const hasAnimated = useRef(false)

  useEffect(() => {
    const parsed = parseValue(value)
    if (!parsed || !ref.current) { setDisplayValue(value); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const { prefix, number, decimals, suffix } = parsed

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease-out-expo - szybki start, delikatne wyhamowanie na końcu
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const current = number * eased
            setDisplayValue(`${prefix}${current.toFixed(decimals)}${suffix}`)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{displayValue}</span>
}
