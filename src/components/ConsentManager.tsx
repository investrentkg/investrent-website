"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useConsent, setConsent } from '@/lib/consentStore'
import { ACCEPT_ALL, REJECT_ALL, CONSENT_OPEN_EVENT, marketingAvailable } from '@/lib/consent'
import { CONSENT_COPY, localeOfPath } from '@/lib/consentCopy'

// Baner zgód + panel ustawień (teksty zatwierdzone przez Prawnika - lib/consentCopy.ts; podstawa: art. 399 PKE, § 25 TDDDG, art. 6 ust. 1 lit. a RODO).
// - pokazuje się, gdy brak ważnego wyboru (pierwsza wizyta, wygasły, zmieniona wersja);
// - "Odrzuć wszystkie" i "Akceptuj wszystkie" mają tę samą wagę wizualną (odmowa tak łatwa jak zgoda);
// - panel ustawień otwiera też przycisk w stopce (zdarzenie CONSENT_OPEN_EVENT) - wycofanie w każdej chwili;
// - marketing widoczny tylko gdy wdrożony jest piksel (NEXT_PUBLIC_META_PIXEL_ID): nie pytamy o zgodę na to, czego nie ma.

const MARKETING_ON = marketingAvailable(process.env.NEXT_PUBLIC_META_PIXEL_ID)

const css = `
.irc-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#fff;color:#0d2a5c;border-top:3px solid #f5a623;box-shadow:0 -8px 30px rgba(13,42,92,.18);padding:16px 20px calc(16px + env(safe-area-inset-bottom));font-family:var(--font-inter),system-ui,sans-serif}
.irc-in{max-width:1180px;margin:0 auto;display:flex;gap:20px;align-items:center;flex-wrap:wrap}
.irc-txt{flex:1 1 420px;min-width:0}
.irc-h{font-family:var(--font-montserrat),Arial,sans-serif;font-weight:800;font-size:15px;margin:0 0 4px}
.irc-p{margin:0;font-size:13px;line-height:1.55;color:#374151}
.irc-p a{color:#1a4fa0;text-decoration:underline}
.irc-act{display:flex;gap:10px;flex-wrap:wrap}
.irc-btn{min-height:44px;padding:0 20px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;border:2px solid #0d2a5c;font-family:inherit}
.irc-solid{background:#0d2a5c;color:#fff}
.irc-solid:hover{background:#163a7a}
.irc-line{background:#fff;color:#0d2a5c}
.irc-line:hover{background:#eef3fb}
.irc-btn:focus-visible,.irc-sw input:focus-visible+span{outline:3px solid #0d2a5c;outline-offset:2px;box-shadow:0 0 0 6px #f5a623}
.irc-ov{position:fixed;inset:0;z-index:2147483001;background:rgba(13,42,92,.55);display:flex;align-items:center;justify-content:center;padding:16px}
.irc-dlg{background:#fff;color:#0d2a5c;border-radius:12px;max-width:560px;width:100%;max-height:90vh;max-height:calc(100dvh - 32px);overflow:auto;padding:22px;font-family:var(--font-inter),system-ui,sans-serif}
.irc-row{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;padding:14px 0;border-top:1px solid #e5e7eb}
.irc-row h3{margin:0 0 3px;font-size:14px;font-weight:800;font-family:var(--font-montserrat),Arial,sans-serif}
.irc-row p{margin:0;font-size:12.5px;line-height:1.5;color:#4b5563}
.irc-always{font-size:12px;font-weight:700;color:#15803d;white-space:nowrap;padding-top:2px}
.irc-sw{position:relative;flex:none;display:inline-block;width:52px;height:44px;margin:-9px 0}
.irc-sw input{position:absolute;inset:0;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}
.irc-sw span{position:absolute;left:3px;right:3px;top:9px;bottom:9px;background:#6b7280;border-radius:26px;transition:background .15s;pointer-events:none}
.irc-sw span::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:transform .15s}
.irc-sw input:checked+span{background:#0d2a5c}
.irc-sw input:checked+span::after{transform:translateX(20px)}
@media (prefers-reduced-motion:reduce){.irc-sw span,.irc-sw span::after{transition:none}}
@media (max-width:640px){.irc-bar{padding:12px 16px calc(12px + env(safe-area-inset-bottom));max-height:70vh;overflow:auto}.irc-in{gap:10px}.irc-h{font-size:14px}.irc-p{font-size:12.5px;line-height:1.45}.irc-act{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px}.irc-act .irc-btn{padding:0 8px;font-size:13.5px}.irc-act .irc-line{grid-column:1/-1;order:3}.irc-dlg .irc-act{display:flex;position:sticky;bottom:-22px;background:#fff;padding:10px 0 4px;border-top:1px solid #e5e7eb}.irc-dlg .irc-act .irc-btn{flex:1 1 100%}}
`

export default function ConsentManager() {
  const consent = useConsent()
  const pathname = usePathname()
  const t = CONSENT_COPY[localeOfPath(pathname)]
  const [open, setOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const dlgRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const openSettings = useCallback(() => {
    returnFocus.current = (document.activeElement as HTMLElement) ?? null
    setAnalytics(!!consent?.analytics)
    setMarketing(!!consent?.marketing)
    setOpen(true)
  }, [consent])

  useEffect(() => {
    const on = () => openSettings()
    window.addEventListener(CONSENT_OPEN_EVENT, on)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, on)
  }, [openSettings])

  useEffect(() => {
    if (!open) return
    const first = dlgRef.current?.querySelector<HTMLElement>('input,button')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); returnFocus.current?.focus() }
      if (e.key === 'Tab' && dlgRef.current) { // prosta pułapka fokusu w oknie dialogowym
        const f = Array.from(dlgRef.current.querySelectorAll<HTMLElement>('input,button,a[href]')).filter(el => !el.hasAttribute('disabled'))
        if (!f.length) return
        const firstEl = f[0], lastEl = f[f.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Pasek zajmuje dół ekranu: przekazujemy jego wysokość w --consent-h, żeby launcher kontaktu (Zadzwoń/WhatsApp)
  // i przyklejony pasek kalkulatora (.wy-sticky) stały NAD banerem, a nie pod nim (globals.css).
  const barVisible = consent === null && !open
  useEffect(() => {
    const root = document.documentElement
    const el = barRef.current
    if (!barVisible || !el) { root.style.removeProperty('--consent-h'); return }
    const set = () => root.style.setProperty('--consent-h', el.offsetHeight + 'px')
    set()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null
    ro?.observe(el)
    window.addEventListener('resize', set)
    return () => { ro?.disconnect(); window.removeEventListener('resize', set); root.style.removeProperty('--consent-h') }
  }, [barVisible])

  const choose = (c: { analytics: boolean; marketing: boolean }) => { setConsent(c); setOpen(false); returnFocus.current?.focus?.() }

  // undefined = SSR/hydracja (nic nie renderujemy, brak migotania); wybór jest = banner schowany, panel tylko na żądanie
  const showBar = consent === null && !open
  if (consent === undefined) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {showBar && (
        <div className="irc-bar" role="region" aria-label={t.title} ref={barRef}>
          <div className="irc-in">
            <div className="irc-txt">
              <p className="irc-h">{t.title}</p>
              <p className="irc-p">
                {MARKETING_ON ? t.intro : t.introAnalyticsOnly}{' '}
                <a href={t.privacyHref}>{t.privacyLabel}</a>
              </p>
            </div>
            <div className="irc-act">
              <button type="button" className="irc-btn irc-solid" onClick={() => choose(REJECT_ALL)}>{t.rejectAll}</button>
              <button type="button" className="irc-btn irc-line" onClick={openSettings}>{t.customize}</button>
              <button type="button" className="irc-btn irc-solid" onClick={() => choose(MARKETING_ON ? ACCEPT_ALL : { analytics: true, marketing: false })}>{t.acceptAll}</button>
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="irc-ov" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="irc-dlg" role="dialog" aria-modal="true" aria-labelledby="irc-dlg-title" ref={dlgRef}>
            <h2 id="irc-dlg-title" className="irc-h" style={{ fontSize: 18 }}>{t.settingsTitle}</h2>
            <p className="irc-p" style={{ marginBottom: 6 }}>{t.withdraw} <a href={t.privacyHref}>{t.privacyLabel}</a></p>
            <div className="irc-row">
              <div><h3>{t.necessary.name}</h3><p>{t.necessary.desc}</p></div>
              <span className="irc-always">{t.necessary.alwaysActive}</span>
            </div>
            <div className="irc-row">
              <div><h3 id="irc-an">{t.analytics.name}</h3><p>{t.analytics.desc}</p></div>
              <label className="irc-sw"><input type="checkbox" aria-labelledby="irc-an" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /><span /></label>
            </div>
            {MARKETING_ON && (
              <div className="irc-row">
                <div><h3 id="irc-mk">{t.marketing.name}</h3><p>{t.marketing.desc}</p></div>
                <label className="irc-sw"><input type="checkbox" aria-labelledby="irc-mk" checked={marketing} onChange={e => setMarketing(e.target.checked)} /><span /></label>
              </div>
            )}
            <div className="irc-act" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="irc-btn irc-line" onClick={() => choose(REJECT_ALL)}>{t.rejectAll}</button>
              <button type="button" className="irc-btn irc-line" onClick={() => choose(MARKETING_ON ? ACCEPT_ALL : { analytics: true, marketing: false })}>{t.acceptAll}</button>
              <button type="button" className="irc-btn irc-solid" onClick={() => choose({ analytics, marketing: MARKETING_ON ? marketing : false })}>{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
