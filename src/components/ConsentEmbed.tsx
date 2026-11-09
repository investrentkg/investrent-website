"use client"
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { getMapStorage, onMapConsentRevoked, revokeMapConsent, shouldAutoLoadMap, writeMapConsent } from '@/lib/mapConsent'

// Click-to-load dla tresci osadzanych od Google/YouTube/Vimeo (§ 25 TDDDG, art. 6
// RODO): dopoki uzytkownik nie kliknie przycisku, NIE jest ladowany zaden zasob
// zewnetrzny (iframe, skrypt). Stan "zaladowano" zyje tylko w pamieci komponentu
// (useState) - bez cookie i sessionStorage. WYJATEK: mapa Google (MapEmbed) zapamietuje
// wybor lokalnie w localStorage (klucz mapGoogleConsent, 12 mies., src/lib/mapConsent.ts):
// przy waznym wpisie laduje sie sama, a link "Wylacz mape Google" cofa wybor. Filmy
// (YouTube/Vimeo) nadal wymagaja klikniecia przy kazdej wizycie.
//
// Uklad: komponent wypelnia rodzica (position:absolute; inset:0) - rodzic MUSI miec
// position:relative i wlasny rozmiar (aspect-ratio / height / padding-bottom), dzieki
// czemu placeholder i osadzenie maja te same proporcje (brak przesuniec ukladu).

type Provider = 'google-maps' | 'youtube' | 'vimeo'
type Locale = 'pl' | 'de'

const COPY: Record<Locale, {
  title: Record<Provider, string>
  button: Record<Provider, string>
  aria: Record<Provider, string>
  notice: Record<Provider, string>
  policy: string
  policyHref: string
  openInMaps: string
  revokeMap: string
}> = {
  pl: {
    title: { 'google-maps': 'Mapa Google', youtube: 'Wideo YouTube', vimeo: 'Wideo Vimeo' },
    button: { 'google-maps': 'Załaduj mapę', youtube: 'Załaduj wideo', vimeo: 'Załaduj wideo' },
    aria: { 'google-maps': 'Załaduj mapę Google', youtube: 'Załaduj wideo z YouTube', vimeo: 'Załaduj wideo z Vimeo' },
    notice: {
      'google-maps': 'Po kliknięciu połączysz się z serwerami Google, które mogą zapisywać Twój adres IP i pliki cookie.',
      youtube: 'Po kliknięciu połączysz się z serwerami YouTube (Google), które mogą zapisywać Twój adres IP i pliki cookie.',
      vimeo: 'Po kliknięciu połączysz się z serwerami Vimeo, które mogą zapisywać Twój adres IP i pliki cookie.',
    },
    policy: 'Polityka prywatności',
    policyHref: '/rodo',
    openInMaps: 'Otwórz w Mapach Google',
    revokeMap: 'Wyłącz mapę Google / cofnij zgodę',
  },
  de: {
    title: { 'google-maps': 'Google Maps', youtube: 'YouTube-Video', vimeo: 'Vimeo-Video' },
    button: { 'google-maps': 'Karte laden', youtube: 'Video laden', vimeo: 'Video laden' },
    aria: { 'google-maps': 'Google-Maps-Karte laden', youtube: 'YouTube-Video laden', vimeo: 'Vimeo-Video laden' },
    notice: {
      'google-maps': 'Mit dem Klick verbinden Sie sich mit Servern von Google, die Ihre IP-Adresse und Cookies speichern können.',
      youtube: 'Mit dem Klick verbinden Sie sich mit Servern von YouTube (Google), die Ihre IP-Adresse und Cookies speichern können.',
      vimeo: 'Mit dem Klick verbinden Sie sich mit Servern von Vimeo, die Ihre IP-Adresse und Cookies speichern können.',
    },
    policy: 'Datenschutzerklärung',
    policyHref: '/de/datenschutz',
    openInMaps: 'In Google Maps öffnen',
    revokeMap: 'Google-Karte deaktivieren / Einwilligung widerrufen',
  },
}

export function ConsentGate({
  provider, locale = 'pl', children, onLoad, loaded: loadedProp, focusButton = false,
}: {
  provider: Provider
  locale?: Locale
  children: ReactNode
  onLoad?: () => void
  /** Tryb sterowany (MapEmbed): rodzic decyduje, czy tresc jest zaladowana. Bez tego - stan lokalny (klik = zaladuj). */
  loaded?: boolean
  /** Po zamontowaniu ustaw fokus na przycisku (np. po wycofaniu zgody, zeby fokus nie przepadl). */
  focusButton?: boolean
}) {
  const [innerLoaded, setInnerLoaded] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const loaded = loadedProp ?? innerLoaded
  useEffect(() => { if (focusButton && !loaded) btnRef.current?.focus() }, [focusButton, loaded])
  const t = COPY[locale]
  if (loaded) return <>{children}</>
  return (
    <div
      role="group"
      aria-label={t.title[provider]}
      style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 10, padding: 16, textAlign: 'center', overflow: 'auto',
        background: 'linear-gradient(135deg, #eef3fb, #dbe6f6)', color: '#0d2a5c',
      }}
    >
      <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16 }}>{t.title[provider]}</div>
      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: '#374151', maxWidth: 420 }}>
        {t.notice[provider]}{' '}
        <a href={t.policyHref} style={{ color: '#1a4fa0', textDecoration: 'underline' }}>{t.policy}</a>
      </p>
      <button
        ref={btnRef}
        type="button"
        aria-label={t.aria[provider]}
        onClick={() => { setInnerLoaded(true); onLoad?.() }}
        style={{ padding: '10px 22px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
      >
        {t.button[provider]}
      </button>
    </div>
  )
}

// Mapa Google: ramka o okreslonych proporcjach + placeholder + zwykly link zewnetrzny.
// `query` = juz zakodowany (encodeURIComponent) tekst zapytania.
export default function MapEmbed({
  query, zoom, title, locale = 'pl', height, paddingBottom, minHeight, hideLink = false, radius = 0,
}: {
  query: string
  zoom: number
  title: string
  locale?: Locale
  height?: number
  paddingBottom?: string
  minHeight?: number
  hideLink?: boolean
  radius?: number
}) {
  const t = COPY[locale]
  const lang = locale === 'de' ? 'de' : 'pl'
  // Poczatkowo ZAWSZE false (SSR i pierwszy render = przycisk, zero zadan do Google); wazny zapis
  // z localStorage wlaczy mape dopiero w efekcie po zamontowaniu.
  const [loaded, setLoaded] = useState(false)
  const [refocus, setRefocus] = useState(false)
  useEffect(() => { if (shouldAutoLoadMap()) setLoaded(true) }, [])
  // Wycofanie w dowolnej instancji (lub w innej karcie) wylacza WSZYSTKIE mapy na stronie.
  useEffect(() => onMapConsentRevoked(() => setLoaded(false)), [])
  const revoke = () => { setRefocus(true); revokeMapConsent() }
  const boxStyle = height
    ? { position: 'relative' as const, width: '100%', height }
    : { position: 'relative' as const, width: '100%', paddingBottom, minHeight }
  return (
    <div>
      <div style={{ ...boxStyle, borderRadius: radius, overflow: 'hidden' }}>
        <ConsentGate
          provider="google-maps"
          locale={locale}
          loaded={loaded}
          focusButton={refocus}
          onLoad={() => { writeMapConsent(getMapStorage()); setLoaded(true) }}
        >
          <iframe
            src={`https://maps.google.com/maps?q=${query}&output=embed&hl=${lang}&z=${zoom}`}
            title={title}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
          />
        </ConsentGate>
      </div>
      {/* Wiersz zarezerwowany ZAWSZE (min. 44 px), zeby po hydratacji/zaladowaniu mapy tresc sie nie przesuwala; przed zaladowaniem link jest ukryty (visibility, brak fokusu). */}
      <div style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontSize: 12.5, visibility: loaded ? 'visible' : 'hidden' }}>
        <button
          type="button"
          onClick={revoke}
          style={{ background: 'none', border: 0, padding: '0 4px', minHeight: 44, font: 'inherit', color: '#1a4fa0', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {t.revokeMap}
        </button>
      </div>
      {!hideLink && (
        <div style={{ padding: '8px 12px 10px', textAlign: 'right', fontSize: 12.5 }}>
          <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1a4fa0', textDecoration: 'underline' }}>
            {t.openInMaps}
          </a>
        </div>
      )}
    </div>
  )
}
