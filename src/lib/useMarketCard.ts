"use client"

import { useEffect, useRef, useState } from 'react'
import { fetchMarketCard, trackCardShown, type CardCondition, type MarketCardFilters, type MarketCardView } from './marketCard'

/** Wspólny stan karty rynku; odrzuca odpowiedzi ze starszego wyszukiwania. */
export function useMarketCard(token: string | null, filters?: MarketCardFilters) {
  const [view, setView] = useState<MarketCardView | null>(null)
  const [condition, setCondition] = useState<CardCondition | null>(null)
  const [busy, setBusy] = useState(false)
  const tracked = useRef(false)
  const sequence = useRef(0)

  useEffect(() => {
    const current = ++sequence.current
    if (!token) {
      setView({ kind: 'none' })
      setBusy(false)
      return
    }

    setBusy(true)
    void fetchMarketCard(token, condition, filters ? { filters } : {}).then(next => {
      if (current !== sequence.current) return
      setView(next)
      setBusy(false)
      if (next.kind === 'card' && !tracked.current) {
        tracked.current = true
        trackCardShown()
      }
    })

    return () => { sequence.current += 1 }
  }, [token, condition, filters?.rooms, filters?.floor_group])

  return { view, condition, setCondition, busy }
}
