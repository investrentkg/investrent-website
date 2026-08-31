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
  // NAPRAWA (31.08, potwierdzone na zywo na /o-nas: fetch strony bez
  // wykonania JS pokazuje doslownie "0" zamiast prawdziwej liczby -
  // dotyczy KAZDEGO uzycia tego komponentu na calej stronie, nie tylko
  // licznika opinii). Poprzednio stan poczatkowy byl ZAWSZE wymuszony na
  // "0" (parsed.prefix + '0' + suffix), niezaleznie od przekazanej
  // wartosci - SSR/crawler/wylaczony JS widzial fikcyjne zero zamiast
  // prawdziwej tresci strony. Teraz stan poczatkowy to PRAWDZIWA,
  // docelowa wartosc (dokladnie to co przyszlo w propsie `value`) - dla
  // SSR/braku JS to jest ostateczny, poprawny tekst. Dopiero PO
  // hydratacji (w useEffect, a wiec tylko w przegladarce z dzialajacym
  // JS) resetujemy widoczna wartosc na zero, zeby zachowac DOKLADNIE
  // ten sam, przyjemny efekt "odliczania w gore" dla prawdziwych
  // uzytkownikow - oni i tak zobacza tylko bardzo krotkie mignięcie
  // przed animacja, ktora i tak zaczyna sie dopiero po wejsciu elementu
  // w pole widoku (IntersectionObserver ponizej, bez zmian).
  const [displayValue, setDisplayValue] = useState<string>(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const parsed = parseValue(value)
    if (!parsed || !ref.current) { setDisplayValue(value); return }
    setDisplayValue(`${parsed.prefix}0${parsed.suffix}`) // zerowanie TYLKO po stronie klienta, patrz komentarz wyzej

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
