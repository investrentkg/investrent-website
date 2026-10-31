"use client"
import { useEffect, useRef, useState } from 'react'
import { CheckCircle, Phone } from 'lucide-react'
import { submitLead } from '@/lib/api'
import { getAttribution } from '@/lib/attribution'
import {
  OFFICE_PHONE, TS_STUCK_MS, buildLeadRequest, inAppBrowserClass, isValidPhone, leadBlockReason, readUtm, trackValuation,
  type EstimateOutcome, type FormValues,
} from '@/lib/valuation'
import { sendPhoneRequest } from '@/lib/phoneBlockSubmit'
import { CALLBACK_ON, MARKET_CARD_ACTIVE, WYCENA_LAYOUT_V4_ACTIVE, WYCENA_META_TRACKING_ON } from '@/lib/wycenaFlags'
import { CONSENT_TEXT, CONSENT_VERSION } from '@/lib/wycenaConsentText'
import { CONTACT_WINDOWS, CONTACT_WINDOW_LABELS, type ContactWindow } from '@/lib/marketCard'
import { T } from './texts'
import { PHONE_BLOCK_CONSENT_VERSION, PHONE_BLOCK_LEGAL as L, PHONE_BLOCK_TEXTS as P } from './phoneBlockTexts'
import { hasAdsConsent } from '@/lib/consentStore'
import { buildWycenaMetaTracking } from '@/lib/wycenaMetaPixel'
import { useMetaConsentReceipt } from './useMetaConsentReceipt'
import { trackWycenaMetaLead } from '@/components/WycenaMetaPixel'
import Turnstile from './Turnstile'
import MarketCard from './MarketCard'
import { MARKET_CARD_TEXTS as MC } from './marketCardTexts'

// Blok "Bezplatna, dokladniejsza wycena od agenta" BEZPOSREDNIO pod wynikiem (flaga NEXT_PUBLIC_WYCENA_PHONE_BLOCK=on).
// Pole numeru + przycisk (jawne dzialanie uzytkownika; bez checkboxa: opinia Prawnika 15.10.2026 - kontakt zamowiony, nie marketing) + krotka wymiana wartosci.
// Bez SMS. Po wyslaniu potwierdzenie bez terminu oddzwonienia. Teksty prawne: phoneBlockTexts.ts (zatwierdzone doslownie przez Daniela 15.10.2026).

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.investrent.com.pl'
const CALLBACK_URL = `${API}/api/public/valuation/callback`
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''
const phoneHref = 'tel:+48731554341'
const iab = () => (typeof navigator === 'undefined' ? 'other' : inAppBrowserClass(navigator.userAgent))

const hintStyle: React.CSSProperties = { fontSize: 13, color: '#475569', marginTop: 4 }
const errStyle: React.CSSProperties = { fontSize: 13, color: '#b91c1c', marginTop: 4, fontWeight: 600 }

export default function PhoneBlock({ outcome, values, onDone }: { outcome: EstimateOutcome; values: FormValues; onDone?: () => void }) {
  const [phone, setPhone] = useState('')
  const [errs, setErrs] = useState<{ phone?: string; consent?: string }>({})
  // flaga NEXT_PUBLIC_WYCENA_MARKET_CARD (aktywna tylko z gotowym tekstem zgody): karta rynku + okno kontaktu + checkbox zgody
  const mc = MARKET_CARD_ACTIVE
  const [win, setWin] = useState<ContactWindow | ''>('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')
  const [hp, setHp] = useState('')
  const [tsToken, setTsToken] = useState<string | null>(null)
  const [tsReset, setTsReset] = useState(0)
  const [tsFailed, setTsFailed] = useState(false)
  const [tsStuck, setTsStuck] = useState(false)
  const [queued, setQueued] = useState(false)
  const inFlight = useRef(false)
  const metaConsent = useMetaConsentReceipt()
  const mode = outcome.kind
  const token = 'valuationToken' in outcome && outcome.valuationToken ? outcome.valuationToken : null

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || tsToken) { setTsStuck(false); return }
    const t = setTimeout(() => setTsStuck(true), TS_STUCK_MS)
    return () => clearTimeout(t)
  }, [tsToken, tsReset])
  useEffect(() => { if (queued && (tsStuck || tsFailed)) setQueued(false) }, [queued, tsStuck, tsFailed])
  useEffect(() => { if (queued && tsToken) void attempt() }, [queued, tsToken]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state === 'ok') onDone?.() }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  async function attempt() {
    if (inFlight.current) return
    const next: typeof errs = {}
    if (!isValidPhone(phone)) next.phone = P.errPhone
    if (mc && !consent) next.consent = MC.errConsent
    setErrs(next)
    const block = leadBlockReason({ phoneValid: !next.phone, consent: mc ? consent : true, needsToken: !!TURNSTILE_SITE_KEY, hasToken: !!tsToken, tokenFailed: tsFailed || tsStuck })
    if (block) trackValuation('wycena_lead_submit_blocked', { reason: block, mode, iab: iab(), placement: 'phone_block' })
    if (next.phone || next.consent) { setQueued(false); document.getElementById(next.phone ? 'wy-phone' : 'wy-consent')?.focus(); return }
    if (TURNSTILE_SITE_KEY && !tsToken) {
      if (!(tsFailed || tsStuck)) setQueued(true) // wysylka ruszy sama po wydaniu tokenu
      return
    }
    setQueued(false)
    inFlight.current = true
    setState('sending')
    trackValuation('wycena_lead_submit', { mode, iab: iab(), placement: 'phone_block' })
    const utm = readUtm(window.location.search)
    try {
      const attribution = getAttribution()
      const metaReceipt = metaConsent.getReceipt()
      const metaTracking = buildWycenaMetaTracking({
        enabled: WYCENA_META_TRACKING_ON,
        marketingConsent: hasAdsConsent(),
        eventId: metaReceipt?.eventId ?? null,
        consentReceipt: metaReceipt?.receipt ?? null,
        readCookie: () => document.cookie,
        search: window.location.search,
        attribution: attribution as Record<string, unknown> | null,
      })
      const r = await sendPhoneRequest(
        { phone, valuationToken: token, consentVersion: mc ? CONSENT_VERSION : PHONE_BLOCK_CONSENT_VERSION, values, outcome, utm, turnstileToken: tsToken, honeypot: hp, contactWindow: mc && win ? win : null, metaTracking },
        {
          callbackEnabled: CALLBACK_ON, callbackUrl: CALLBACK_URL,
          submitLeadFallback: async () => {
            const res = await submitLead({ ...buildLeadRequest({ name: '', phone, values, outcome, utm, attribution, turnstileToken: tsToken, honeypot: hp, consentVersion: mc ? CONSENT_VERSION : PHONE_BLOCK_CONSENT_VERSION }), ...(metaTracking ? { meta_tracking: metaTracking } : {}) })
            return res.ok ? { ok: true } : { ok: false, reason: res.reason }
          },
        },
      )
      if (r.ok) { setState('ok'); trackValuation('wycena_lead', { mode, placement: 'phone_block', via: r.via }); trackWycenaMetaLead(metaTracking?.event_id) }
      else { setState('fail'); trackValuation('wycena_lead_submit_failed', { reason: r.reason, status: '', iab: iab(), placement: 'phone_block' }) }
    } catch {
      setState('fail')
    } finally {
      inFlight.current = false
      if (TURNSTILE_SITE_KEY) { setTsToken(null); setTsReset(n => n + 1) }
    }
  }

  if (state === 'ok') {
    return (
      <div role="status" className="wy-phoneblock" style={{ textAlign: 'center' }}>
        <CheckCircle size={32} color="#15803d" aria-hidden="true" style={{ margin: '0 auto 6px' }} />
        <div className="wy-pb-title">{P.doneTitle}</div>
        <p style={{ margin: 0, color: '#374151', fontSize: 15, lineHeight: 1.6 }}>{P.doneBody}</p>
      </div>
    )
  }

  const stuck = (tsStuck || tsFailed) && !tsToken
  return (
    <form onSubmit={e => { e.preventDefault(); void attempt() }} noValidate className="wy-phoneblock" aria-labelledby="wy-pb-title">
      <h3 id="wy-pb-title" className="wy-pb-title">{mc ? MC.blockTitle : P.title}</h3>
      <p style={{ margin: '0 0 6px', color: '#374151', fontSize: 15, lineHeight: 1.6 }}>{mc ? MC.blockIntro : P.exchange}</p>
      {mc && !WYCENA_LAYOUT_V4_ACTIVE && <MarketCard token={token} />}
      {!mc && <p style={{ margin: '0 0 12px', ...hintStyle }}>{L.notAppraisal}</p>}

      {mc && <p style={{ margin: '0 0 8px', color: '#374151', fontSize: 15, lineHeight: 1.6 }}>{MC.contactIntro}</p>}
      <label htmlFor="wy-phone" style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0d2a5c', marginBottom: 6 }}>{L.label} *</label>
      <input id="wy-phone" className="wy-field" type="tel" inputMode="tel" autoComplete="tel" required aria-required="true"
        value={phone} aria-invalid={!!errs.phone} aria-describedby={errs.phone ? 'wy-phone-err wy-phone-hint wy-pb-notice' : 'wy-phone-hint wy-pb-notice'}
        onChange={e => { setPhone(e.target.value); if (errs.phone) setErrs({}) }} />
      <div id="wy-phone-hint" style={hintStyle}>{P.phoneHint}</div>
      {errs.phone && <div id="wy-phone-err" role="alert" style={errStyle}>{errs.phone}</div>}
      {mc && (
        <>
          <label htmlFor="wy-window" style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0d2a5c', margin: '12px 0 6px' }}>{MC.windowLabel}</label>
          <select id="wy-window" className="wy-field" value={win} onChange={e => setWin(e.target.value as ContactWindow | '')}>
            <option value="">{MC.windowNone}</option>
            {CONTACT_WINDOWS.map(w => <option key={w} value={w}>{CONTACT_WINDOW_LABELS[w]}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 12 }}>
            <input id="wy-consent" type="checkbox" checked={consent} required aria-required="true" aria-invalid={!!errs.consent} aria-describedby={errs.consent ? 'wy-consent-err' : undefined}
              style={{ marginTop: 3, width: 20, height: 20, flex: '0 0 auto' }} onChange={e => { setConsent(e.target.checked); if (errs.consent) setErrs({}) }} />
            <label htmlFor="wy-consent" style={{ fontSize: 14, lineHeight: 1.6, color: '#374151' }}>{CONSENT_TEXT}</label>
          </div>
          {errs.consent && <div id="wy-consent-err" role="alert" style={errStyle}>{errs.consent}</div>}
        </>
      )}
      {!mc && <p id="wy-pb-notice" style={{ margin: '10px 0 0', color: '#374151', fontSize: 14, lineHeight: 1.6 }}>{L.clickNotice}</p>}
      <p style={{ ...hintStyle, margin: '8px 0 0' }}>
        {L.clauseBeforeLink}<a href={L.clauseLinkHref} target="_blank" rel="noopener noreferrer" style={{ color: '#1a4fa0', textDecoration: 'underline' }}>{L.clauseLinkLabel}</a>{L.clauseAfterLink}
      </p>
      {mc && <p style={{ ...hintStyle, margin: '8px 0 0' }}>{L.notAppraisal}</p>}
      <div className="wy-hp" aria-hidden="true">
        <label>Nie wypełniaj tego pola
          <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
        </label>
      </div>
      {metaConsent.widget}
      {TURNSTILE_SITE_KEY && (
        <div style={{ marginTop: 12 }}>
          <Turnstile siteKey={TURNSTILE_SITE_KEY} resetKey={tsReset} onToken={t => { setTsToken(t); if (t) { setTsFailed(false); setTsStuck(false) } }} onFail={() => setTsFailed(true)} />
          {queued && <p role="status" style={{ ...hintStyle, color: '#334155' }}>{T.errors.turnstileQueued}</p>}
          {stuck && (
            <div role="alert" style={{ marginTop: 10, padding: '10px 12px', border: '1px solid #fcd34d', background: '#fffbeb', borderRadius: 12 }}>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: '#92400e', fontWeight: 600 }}>{T.errors.turnstileStuck}</p>
              <a className="wy-textlink" href={phoneHref}>{T.lead.callCta}</a>
              <button type="button" className="wy-linkbtn" onClick={() => { setTsFailed(false); setTsStuck(false); setTsReset(n => n + 1) }}>{T.errors.turnstileRetry}</button>
            </div>
          )}
        </div>
      )}
      {state === 'fail' && (
        <p role="alert" style={{ ...errStyle, margin: '12px 0 0' }}>{T.errors.leadFail} <a href={phoneHref} style={{ color: '#0d2a5c', fontWeight: 700 }}>{OFFICE_PHONE}</a></p>
      )}

      <button type="submit" className="wy-btn" style={{ marginTop: 16 }} disabled={state === 'sending' || queued}>
        <Phone size={18} aria-hidden="true" /> {state === 'sending' || queued ? P.sending : mc ? MC.submit : L.submit}
      </button>
      <p style={{ ...hintStyle, textAlign: 'center', marginTop: 8 }}>
        {P.callAlt} <a className="wy-textlink" href={phoneHref}>{OFFICE_PHONE}</a>
      </p>
    </form>
  )
}
