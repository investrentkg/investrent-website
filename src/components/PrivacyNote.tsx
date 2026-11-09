import type { CSSProperties } from 'react'

// Krotka klauzula informacyjna (art. 13 RODO) pod formularzami zbierajacymi dane:
// administrator, cel, podstawa i link do polityki prywatnosci (/rodo).
// Uzywana pod kazdym formularzem korzystajacym z submitLead (przeglad prawny, runda 2).
// Strona jest wylacznie po polsku - formularze DE nie istnieja; dla ruchu z DE
// polityka DE: /de/datenschutz (osobna klauzula, gdy powstanie wersja DE formularzy).
export default function PrivacyNote({ color = '#9ca3af', linkColor, size = 10, style }: {
  color?: string
  linkColor?: string
  size?: number
  style?: CSSProperties
}) {
  return (
    <p style={{ color, fontSize: size, lineHeight: 1.45, textAlign: 'center', margin: 0, ...style }}>
      Wysyłając formularz, przekazujesz dane Investrent sp. z o.o. w celu odpowiedzi na Twoje zapytanie (art. 6 ust. 1 lit. b RODO).{' '}
      <a href="/rodo" target="_blank" rel="noopener noreferrer" style={{ color: linkColor ?? color, textDecoration: 'underline' }}>Polityka prywatności</a>
    </p>
  )
}
