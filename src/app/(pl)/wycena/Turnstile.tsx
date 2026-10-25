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
  execute: (id?: string) => void
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
        // NAPRAWA (27.09, test na zywo w przegladarce - klikniecie "Pokaz orientacyjna wycene"
        // nie robilo NIC, zero zadan sieciowych): domyslnie (execution: 'render', wartosc
        // domyslna gdy pominieta) Cloudflare NIE uruchamia weryfikacji dopoki kontener widgetu
        // nie wejdzie w viewport (wewnetrzny IntersectionObserver skryptu Turnstile) - a widget
        // jest umieszczony NISKO w dlugim formularzu, ponizej wielu pol. Potwierdzone empirycznie:
        // na swiezo zaladowanej stronie, bez przewiniecia do widgetu, po 8 s zero iframe'ow i
        // cf-turnstile-response.value pozostawal pusty na zawsze; dopiero przewiniecie widgetu
        // do widoku uruchamialo faktyczne zadanie do challenges.cloudflare.com/cdn-cgi/... .
        // "execution: 'execute'" wylacza to opoznienie - render() tylko tworzy widget, a
        // execute() ponizej odpala weryfikacje OD RAZU, niezaleznie od scrolla, wiec token jest
        // zwykle gotowy zanim uzytkownik dojdzie do przycisku (a jesli Cloudflare uzna ze
        // interakcja jest potrzebna, widget i tak pokaze sie od razu zamiast czekac w nieskonczonosc).
        execution: 'execute',
        language: 'pl',
        callback: (t: string) => cb.current.onToken(t),
        'expired-callback': () => { cb.current.onToken(null); try { window.turnstile?.reset(widgetId.current ?? undefined); window.turnstile?.execute(widgetId.current ?? undefined) } catch { /* noop */ } },
        'timeout-callback': () => cb.current.onToken(null),
        'error-callback': () => { cb.current.onToken(null); cb.current.onFail() },
      })
      // v12: ukryte pole odpowiedzi (cf-turnstile-response) nie jest elementem interfejsu - poza drzewem dostepnosci; sam widzet (gdy wymaga interakcji) zostaje dostepny
      box.current.querySelectorAll('input[name="cf-turnstile-response"]').forEach(el => el.setAttribute('aria-hidden', 'true'))
      try { if (widgetId.current) window.turnstile.execute(widgetId.current) } catch { /* noop */ }
    }).catch(() => { if (!cancelled) cb.current.onFail() })
    return () => {
      cancelled = true
      try { if (widgetId.current) window.turnstile?.remove(widgetId.current) } catch { /* noop */ }
      widgetId.current = null
    }
  }, [siteKey])

  useEffect(() => {
    if (resetKey === 0) return
    // reset() sam nie uruchamia ponownej weryfikacji w trybie execution:'execute' -
    // bez tego execute() token na kolejne wyslanie (np. ponowna wycena, krok z numerem
    // telefonu) czekalby znowu na scroll/widocznosc, czyli ten sam blad co przy pierwszym uzyciu.
    try { if (widgetId.current) { window.turnstile?.reset(widgetId.current); window.turnstile?.execute(widgetId.current) } } catch { /* noop */ }
  }, [resetKey])

  return <div ref={box} aria-label="Weryfikacja antyspamowa Cloudflare Turnstile" />
}
