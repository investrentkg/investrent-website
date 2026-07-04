"use client"
import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string        // np. "300+", "4.9/5", "do 60 min", "Bezpłatna"
  duration?: number    // ms
  startDelay?: number  // ms — opóźnienie startu liczenia OD momentu wejścia w pole widoku
                        // (do sekwencyjnego, jeden-po-drugim odliczania kilku liczników obok siebie)
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

export default function AnimatedCounter({ value, duration = 1900, startDelay = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState<string>(() => {
    const parsed = parseValue(value)
    return parsed ? `${parsed.prefix}0${parsed.suffix}` : value
  })
  const hasAnimated = useRef(false)

  useEffect(() => {
    const parsed = parseValue(value)
    if (!parsed || !ref.current) { setDisplayValue(value); return }

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          const run = () => {
            const start = performance.now()
            const { prefix, number, decimals, suffix } = parsed

            const tick = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(Math.max(elapsed / duration, 0), 1)
              // ease-out-expo - szybki start, delikatne wyhamowanie na końcu
              const eased = progress === 1 ? 1 : Math.max(0, 1 - Math.pow(2, -10 * progress))
              const current = number * eased
              setDisplayValue(`${prefix}${current.toFixed(decimals)}${suffix}`)
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }

          if (startDelay > 0) timeoutId = setTimeout(run, startDelay)
          else run()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(ref.current)
    return () => { observer.disconnect(); if (timeoutId) clearTimeout(timeoutId) }
  }, [value, duration, startDelay])

  return <span ref={ref}>{displayValue}</span>
}
