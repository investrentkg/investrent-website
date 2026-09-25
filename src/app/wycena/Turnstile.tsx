"use client"
import { useEffect, useRef } from 'react'

// Cloudflare Turnstile (tryb managed, appearance 'interaction-only': widget jest
// niewidoczny, dopoki Cloudflare nie zazada interakcji). Skrypt ladowany DOPIERO
// po zamontowaniu tego komponentu (tylko /wycena). Klucz strony z
// NEXT_PUBLIC_TURNSTILE_SITE_KEY - nigdy wartosc w kodzie.

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}
declare global { interface Window { turnstile?: TurnstileApi } }

let scriptPromise: Promise<void> | null = null
function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'))
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = SCRIPT_SRC
      s.async = true
      s.defer = true
      s.onload = () => resolve()
      s.onerror = () => { scriptPromise = null; reject(new Error('load')) }
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

export default function Turnstile({ siteKey, resetKey, onToken, onFail }: {
  siteKey: string
  resetKey: number // zmiana wartosci = nowy token (token jest jednorazowy)
  onToken: (token: string | null) => void
  onFail: () => void
}) {
  const box = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const cb = useRef({ onToken, onFail })
  cb.current = { onToken, onFail }

  useEffect(() => {
    let cancelled = false
    loadScript().then(() => {
      if (cancelled || !box.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(box.current, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        language: 'pl',
        callback: (t: string) => cb.current.onToken(t),
        'expired-callback': () => { cb.current.onToken(null); try { window.turnstile?.reset(widgetId.current ?? undefined) } catch { /* noop */ } },
        'timeout-callback': () => cb.current.onToken(null),
        'error-callback': () => { cb.current.onToken(null); cb.current.onFail() },
      })
    }).catch(() => { if (!cancelled) cb.current.onFail() })
    return () => {
      cancelled = true
      try { if (widgetId.current) window.turnstile?.remove(widgetId.current) } catch { /* noop */ }
      widgetId.current = null
    }
  }, [siteKey])

  useEffect(() => {
    if (resetKey === 0) return
    try { if (widgetId.current) window.turnstile?.reset(widgetId.current) } catch { /* noop */ }
  }, [resetKey])

  return <div ref={box} aria-label="Weryfikacja antyspamowa Cloudflare Turnstile" />
}
