"use client"
import { useEffect, useRef, useState } from 'react'
import { Calculator, CheckCircle, Phone } from 'lucide-react'
import { submitLead } from '@/lib/api'
import Breadcrumb from '@/components/Breadcrumb'
import WycenaModal from '@/components/WycenaModal'
import Turnstile from './Turnstile'
import {
  CONDITIONS, EMPTY_FORM, OFFICE_PHONE, PROPERTY_TYPES,
  buildLeadNotes, buildPayload, fieldApplies, formatPLN, formatRange, formatRetryAfter, isOutOfScope, isValidPhone,
  readUtm, requestEstimate, submittedTooFast, trackValuation, validateForm,
  type EstimateOutcome, type FormErrors, type FormValues,
} from '@/lib/valuation'
import { T } from './texts'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''
const ESTIMATE_URL = `${API}/api/public/valuation/estimate`

const card: React.CSSProperties = { background: 'white', borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 8px 32px rgba(13,42,92,.08)', border: '1px solid #e2e8f0' }
const label: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: 14, color: '#0d2a5c', marginBottom: 6 }
const hint: React.CSSProperties = { fontSize: 13, color: '#475569', marginTop: 4 }
const errStyle: React.CSSProperties = { fontSize: 13, color: '#b91c1c', marginTop: 4, fontWeight: 600 }
const h2: React.CSSProperties = { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 22, color: '#0d2a5c', margin: '0 0 8px', lineHeight: 1.25 }

const phoneHref = 'tel:+48731554341'

function Field({ id, text, hintText, error, children }: { id: string; text: string; hintText?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={label}>{text}</label>
      {children}
      {hintText && <div id={`${id}-hint`} style={hint}>{hintText}</div>}
      {error && <div id={`${id}-err`} role="alert" style={errStyle}>{error}</div>}
    </div>
  )
}

function describedBy(id: string, hasHint: boolean, hasErr: boolean) {
  return [hasHint ? `${id}-hint` : '', hasErr ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined
}

export default function WycenaClient({ initialEnabled = true }: { initialEnabled?: boolean }) {
  const [available, setAvailable] = useState(initialEnabled) // false = tryb sam numer (flaga albo 503)
  const [modalOpen, setModalOpen] = useState(false)
  const [tsToken, setTsToken] = useState<string | null>(null)
  const [tsReset, setTsReset] = useState(0)
  const [tsNotice, setTsNotice] = useState<'pending' | null>(null)
  const [tooFast, setTooFast] = useState(false) // zbyt szybkie wyslanie (prog czasowy) - neutralny komunikat
  const loadedAt = useRef(Date.now())
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [honeypot, setHoneypot] = useState('')
  const [phase, setPhase] = useState<'form' | 'loading' | 'after'>('form')
  const [outcome, setOutcome] = useState<EstimateOutcome | null>(null)
  const [submittedValues, setSubmittedValues] = useState<FormValues>(EMPTY_FORM)
  const inFlight = useRef(false)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => { trackValuation('wycena_view') }, [])
  useEffect(() => { if (phase === 'after') resultRef.current?.focus() }, [phase])

  function set<K extends keyof FormValues>(k: K, v: FormValues[K]) {
    setValues(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inFlight.current) return // blokada podwojnego wyslania
    // Minimalny czas od zaladowania strony (odsiew najprostszych botow). Tylko front, ta sama odpowiedz co przy zwyklym bledzie.
    if (submittedTooFast(loadedAt.current, Date.now())) { setTooFast(true); return }
    setTooFast(false)
    const errs = validateForm(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = (['property_type', 'city', 'district', 'area_m2', 'rooms', 'floor'] as const).find(k => errs[k])
      if (first) document.getElementById(`wy-${first}`)?.focus()
      return
    }
    if (TURNSTILE_SITE_KEY && !tsToken) { setTsNotice('pending'); return }
    setTsNotice(null)
    inFlight.current = true
    setPhase('loading')
    const res = await requestEstimate(ESTIMATE_URL, buildPayload(values, honeypot, tsToken))
    inFlight.current = false
    if (TURNSTILE_SITE_KEY) { setTsToken(null); setTsReset(n => n + 1) } // token jest jednorazowy
    if (res.kind === 'invalid') {
      // blad walidacji po stronie serwera - zostajemy w formularzu
      setErrors({ area_m2: res.message ?? `${T.errors.invalid} ${OFFICE_PHONE}` })
      setPhase('form')
      return
    }
    if (res.kind === 'disabled') { setAvailable(false); setOutcome(null); setPhase('form'); return }
    setSubmittedValues(values)
    setOutcome(res)
    if (res.kind === 'range') trackValuation('wycena_estimate_success', { property_type: values.property_type })
    else if (res.kind === 'no_numbers') trackValuation('wycena_estimate_no_numbers', { property_type: values.property_type })
    setPhase('after')
  }

  function reset() {
    setOutcome(null)
    setPhase('form')
  }

  return (
    <>
    <div style={{ background: 'linear-gradient(135deg, #0d2a5c, #1a4fa0)', padding: '32px 0 36px' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Wycena nieruchomości' }]} />
        <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(26px, 5vw, 38px)', color: 'white', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 14 }}>
          {available ? T.h1 : T.h1Off}
        </h1>
        <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 16, lineHeight: 1.7, maxWidth: 620, margin: 0 }}>{available ? T.intro : T.introOff}</p>
      </div>
    </div>
    <div style={{ background: '#f8fafc', padding: '32px 0 64px' }}>
      <div className="container" style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {!available && <LeadPanel outcome={null} values={EMPTY_FORM} />}

        {available && phase !== 'after' && (
          <form onSubmit={onSubmit} noValidate style={card} aria-labelledby="wy-form-title" aria-busy={phase === 'loading'}>
            <h2 id="wy-form-title" style={h2}>{T.formTitle}</h2>
            <p style={{ ...hint, marginTop: 0, marginBottom: 20 }}>{T.requiredNote}</p>

            {/* Honeypot: ukryte pole, czlowiek go nie widzi ani nie dotyka */}
            <div className="wy-hp" aria-hidden="true">
              <label>Nie wypełniaj tego pola
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
              </label>
            </div>

            <div className="wy-grid">
              <Field id="wy-property_type" text={`${T.fields.property_type} *`} error={errors.property_type}>
                <select id="wy-property_type" className="wy-field" required aria-required="true" value={values.property_type}
                  aria-invalid={!!errors.property_type} aria-describedby={describedBy('wy-property_type', false, !!errors.property_type)}
                  onChange={e => set('property_type', e.target.value as FormValues['property_type'])}>
                  <option value="">{T.fields.property_type_placeholder}</option>
                  {PROPERTY_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <Field id="wy-area_m2" text={`${T.fields.area_m2} *`} error={errors.area_m2}>
                <input id="wy-area_m2" className="wy-field" type="text" inputMode="decimal" autoComplete="off" required aria-required="true"
                  value={values.area_m2} aria-invalid={!!errors.area_m2} aria-describedby={describedBy('wy-area_m2', false, !!errors.area_m2)}
                  onChange={e => set('area_m2', e.target.value)} />
              </Field>

              <Field id="wy-city" text={`${T.fields.city} *`} hintText={T.fields.city_hint} error={errors.city}>
                <input id="wy-city" className="wy-field" type="text" autoComplete="address-level2" required aria-required="true"
                  value={values.city} aria-invalid={!!errors.city} aria-describedby={describedBy('wy-city', true, !!errors.city)}
                  onChange={e => set('city', e.target.value)} />
              </Field>

              <Field id="wy-district" text={T.fields.district} hintText={T.fields.district_hint} error={errors.district}>
                <input id="wy-district" className="wy-field" type="text" autoComplete="off"
                  value={values.district} aria-invalid={!!errors.district} aria-describedby={describedBy('wy-district', true, !!errors.district)}
                  onChange={e => set('district', e.target.value)} />
              </Field>

              {fieldApplies(values.property_type, 'rooms') && (
                <Field id="wy-rooms" text={T.fields.rooms} error={errors.rooms}>
                  <input id="wy-rooms" className="wy-field" type="text" inputMode="numeric" autoComplete="off"
                    value={values.rooms} aria-invalid={!!errors.rooms} aria-describedby={describedBy('wy-rooms', false, !!errors.rooms)}
                    onChange={e => set('rooms', e.target.value)} />
                </Field>
              )}

              {fieldApplies(values.property_type, 'floor') && (
                <Field id="wy-floor" text={T.fields.floor} hintText={T.fields.floor_hint} error={errors.floor}>
                  <input id="wy-floor" className="wy-field" type="text" inputMode="numeric" autoComplete="off"
                    value={values.floor} aria-invalid={!!errors.floor} aria-describedby={describedBy('wy-floor', true, !!errors.floor)}
                    onChange={e => set('floor', e.target.value)} />
                </Field>
              )}

              {fieldApplies(values.property_type, 'condition') && (
                <Field id="wy-condition" text={T.fields.condition}>
                  <select id="wy-condition" className="wy-field" value={values.condition}
                    onChange={e => set('condition', e.target.value as FormValues['condition'])}>
                    <option value="">{T.fields.condition_placeholder}</option>
                    {CONDITIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              )}
            </div>

            {tooFast && <p role="alert" style={{ ...errStyle, marginTop: 16 }}>{T.errors.tryAgain}</p>}
            {Object.keys(errors).some(k => errors[k as keyof FormErrors]) && (
              <p role="alert" style={{ ...errStyle, marginTop: 16 }}>{T.formErrorSummary}</p>
            )}

            {available && TURNSTILE_SITE_KEY && (
              <div style={{ marginTop: 16 }}>
                <Turnstile siteKey={TURNSTILE_SITE_KEY} resetKey={tsReset} onToken={t => { setTsToken(t); if (t) setTsNotice(null) }} onFail={() => setAvailable(false)} />
                {tsNotice === 'pending' && <p role="alert" style={errStyle}>{T.errors.turnstilePending}</p>}
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <button type="submit" className="wy-btn" disabled={phase === 'loading'}>
                <Calculator size={18} aria-hidden="true" /> {phase === 'loading' ? T.submitting : T.submit}
              </button>
              <p role="status" aria-live="polite" style={{ ...hint, textAlign: 'center' }}>
                {phase === 'loading' ? T.submitting : T.disclaimerTop}
              </p>
              <p style={{ ...hint, textAlign: 'center', marginTop: 12 }}>
                {T.callInstead}{' '}
                <button type="button" onClick={() => setModalOpen(true)} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#1a4fa0', textDecoration: 'underline', cursor: 'pointer' }}>{T.callInsteadLink}</button>
              </p>
            </div>
          </form>
        )}

        {available && phase === 'after' && outcome && (
          <div ref={resultRef} tabIndex={-1} style={{ outline: 'none', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <OutcomePanel outcome={outcome} scoped={!isOutOfScope(submittedValues)} onAgain={reset} />
            <LeadPanel outcome={outcome} values={submittedValues} />
          </div>
        )}

        {available && (
          <section style={{ padding: '0 4px' }} aria-labelledby="wy-how">
            <h2 id="wy-how" style={{ ...h2, fontSize: 18 }}>{T.how.title}</h2>
            {T.how.body.map(p => <p key={p} style={{ color: '#374151', fontSize: 14.5, lineHeight: 1.75, margin: '0 0 10px' }}>{p}</p>)}
          </section>
        )}
      </div>
    </div>
    <WycenaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

function PhoneLink() {
  return <a href={phoneHref} style={{ color: '#0d2a5c', fontWeight: 700 }}>{OFFICE_PHONE}</a>
}

function OutcomePanel({ outcome, scoped, onAgain }: { outcome: EstimateOutcome; scoped: boolean; onAgain: () => void }) {
  if (outcome.kind === 'range') {
    return (
      <section style={card} aria-labelledby="wy-res-title">
        <h2 id="wy-res-title" style={h2}>{T.result.title}</h2>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '18px 20px', margin: '12px 0' }}>
          <div style={{ fontSize: 14, color: '#475569' }}>{T.result.priceLabel}</div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(22px, 5vw, 30px)', color: '#0d2a5c', lineHeight: 1.2 }}>
            {formatRange(outcome.range)}
          </div>
          {outcome.pricePerM2 && (
            <div style={{ marginTop: 10, fontSize: 15, color: '#0d2a5c' }}>
              <span style={{ color: '#475569' }}>{T.result.perM2Label}: </span>
              <strong>{formatPLN(outcome.pricePerM2.low)} – {formatPLN(outcome.pricePerM2.high)}</strong>
            </div>
          )}
        </div>
        <p style={{ color: '#374151', fontSize: 14.5, lineHeight: 1.7, margin: '0 0 8px' }}><strong>{T.result.scopeNote}</strong></p>
        {outcome.message && <p style={{ color: '#374151', fontSize: 14.5, lineHeight: 1.7, margin: '0 0 8px' }}>{outcome.message}</p>}
        {outcome.comparables && <p style={{ color: '#374151', fontSize: 14.5, lineHeight: 1.7, margin: '0 0 8px' }}>{T.result.comparables(outcome.comparables.min, outcome.comparables.max)}</p>}
        <p style={{ color: '#7c2d12', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '10px 14px', fontSize: 14, lineHeight: 1.6, margin: '12px 0 0' }}>
          <strong>{outcome.disclaimer ?? T.result.disclaimerFallback}</strong>
        </p>
        <button type="button" className="wy-btn wy-btn-secondary" style={{ marginTop: 16 }} onClick={onAgain}>{T.result.again}</button>
      </section>
    )
  }
  if (outcome.kind === 'no_numbers') {
    return (
      <section style={card} aria-labelledby="wy-res-title">
        <h2 id="wy-res-title" style={h2}>{scoped ? T.result.noNumbersTitle : T.result.outOfScopeTitle}</h2>
        <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{scoped ? T.result.noNumbersBody : T.result.outOfScopeBody}</p>
        <button type="button" className="wy-btn wy-btn-secondary" style={{ marginTop: 16 }} onClick={onAgain}>{T.result.again}</button>
      </section>
    )
  }
  const text =
    outcome.kind === 'disabled' ? T.errors.disabled
    : outcome.kind === 'rate_limited' ? T.errors.rateLimited(formatRetryAfter(outcome.retryAfterSeconds))
    : outcome.kind === 'error' && (outcome.reason === 'network' || outcome.reason === 'timeout') ? T.errors.network
    : T.errors.server
  return (
    <section style={card} role="alert">
      <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{text} <PhoneLink /></p>
      {outcome.kind !== 'disabled' && <button type="button" className="wy-btn wy-btn-secondary" style={{ marginTop: 16 }} onClick={onAgain}>{T.result.again}</button>}
    </section>
  )
}

function LeadPanel({ outcome, values }: { outcome: EstimateOutcome | null; values: FormValues }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false) // zgoda 1 (wymagana) - NIEZAZNACZONA domyslnie
  const [marketingPhone, setMarketingPhone] = useState(false) // zgoda 2 (marketing telefon, opcjonalna) - NIEZAZNACZONA domyslnie
  const [marketingSms, setMarketingSms] = useState(false) // zgoda 3 (marketing SMS, opcjonalna) - NIEZAZNACZONA domyslnie
  const [errs, setErrs] = useState<{ phone?: string; consent?: string }>({})
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')
  const inFlight = useRef(false)
  const withNumbers = outcome?.kind === 'range'

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (inFlight.current) return
    const next: typeof errs = {}
    if (!isValidPhone(phone)) next.phone = T.lead.errPhone
    if (!consent) next.consent = T.lead.errConsent
    setErrs(next)
    if (next.phone) { document.getElementById('wy-phone')?.focus(); return }
    if (next.consent) { document.getElementById('wy-consent')?.focus(); return }
    inFlight.current = true
    setState('sending')
    try {
      const r = await submitLead({
        full_name: name.trim() || 'Właściciel',
        phone: phone.trim(),
        source: 'wycena_modal',
        client_type: 'seller',
        preferred_city: values.city.trim(),
        notes: buildLeadNotes(values, outcome, readUtm(window.location.search), { marketingPhone, marketingSms }),
      })
      if (r?.ok) { setState('ok'); trackValuation('wycena_lead', { mode: outcome?.kind ?? 'none' }) } else setState('fail')
    } catch {
      setState('fail')
    } finally {
      inFlight.current = false
    }
  }

  if (state === 'ok') {
    return (
      <section style={{ ...card, textAlign: 'center' }} role="status">
        <CheckCircle size={40} color="#15803d" aria-hidden="true" style={{ margin: '0 auto 8px' }} />
        <h2 style={h2}>{T.lead.doneTitle}</h2>
        <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{T.lead.doneBody}</p>
      </section>
    )
  }

  return (
    <form onSubmit={send} noValidate style={card} aria-labelledby="wy-lead-title">
      <h2 id="wy-lead-title" style={h2}>{withNumbers ? T.lead.titleRange : T.lead.titleFallback}</h2>
      <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: '0 0 16px' }}>{withNumbers ? T.lead.bodyRange : T.lead.bodyFallback}</p>
      <div className="wy-grid">
        <Field id="wy-name" text={T.lead.name}>
          <input id="wy-name" className="wy-field" type="text" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} />
        </Field>
        <Field id="wy-phone" text={`${T.lead.phone} *`} hintText={T.lead.phoneHint} error={errs.phone}>
          <input id="wy-phone" className="wy-field" type="tel" inputMode="tel" autoComplete="tel" required aria-required="true"
            value={phone} aria-invalid={!!errs.phone} aria-describedby={describedBy('wy-phone', true, !!errs.phone)}
            onChange={e => { setPhone(e.target.value); if (errs.phone) setErrs(p => ({ ...p, phone: undefined })) }} />
        </Field>
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <input id="wy-consent" className="wy-check" type="checkbox" checked={consent} required aria-required="true"
              aria-invalid={!!errs.consent} aria-describedby={describedBy('wy-consent', false, !!errs.consent)}
              onChange={e => { setConsent(e.target.checked); if (errs.consent) setErrs(p => ({ ...p, consent: undefined })) }}
              style={{ width: 22, height: 22, marginTop: 2, flexShrink: 0, accentColor: '#0d2a5c' }} />
            <label htmlFor="wy-consent" style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{T.lead.consentCall} <strong>{T.lead.consentCallRequired}</strong></label>
          </div>
          {errs.consent && <div id="wy-consent-err" role="alert" style={{ ...errStyle, marginLeft: 34 }}>{errs.consent}</div>}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <input id="wy-marketing-phone" className="wy-check" type="checkbox" checked={marketingPhone}
            onChange={e => setMarketingPhone(e.target.checked)}
            style={{ width: 22, height: 22, marginTop: 2, flexShrink: 0, accentColor: '#0d2a5c' }} />
          <label htmlFor="wy-marketing-phone" style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{T.lead.consentMarketingPhone} <strong>{T.lead.consentMarketingOptional}</strong></label>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <input id="wy-marketing-sms" className="wy-check" type="checkbox" checked={marketingSms}
            onChange={e => setMarketingSms(e.target.checked)}
            style={{ width: 22, height: 22, marginTop: 2, flexShrink: 0, accentColor: '#0d2a5c' }} />
          <label htmlFor="wy-marketing-sms" style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{T.lead.consentMarketingSms} <strong>{T.lead.consentMarketingOptional}</strong></label>
        </div>
        <div id="wy-consent-hint" style={hint}>
          {T.lead.consentInfo.map(c => (
            <div key={c.h} style={{ margin: '0 0 8px', ...('highlight' in c && c.highlight ? { border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: 8, padding: '8px 10px' } : {}) }}>
              <p style={{ margin: 0 }}><strong>{c.h}</strong> {c.t}</p>
              {'items' in c && c.items && <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{c.items.map(i => <li key={i} style={{ marginBottom: 3 }}>{i}</li>)}</ul>}
            </div>
          ))}
          <p style={{ margin: 0 }}>{T.lead.consentInfoMore}<a href="/rodo" target="_blank" rel="noopener noreferrer" style={{ color: '#1a4fa0', textDecoration: 'underline' }}>{T.lead.consentInfoLink}</a>{T.lead.consentInfoSuffix}</p>
        </div>
      </div>

      {state === 'fail' && <p role="alert" style={{ ...errStyle, marginTop: 16 }}>{T.errors.leadFail} <PhoneLink /></p>}

      <div style={{ marginTop: 20 }}>
        <button type="submit" className="wy-btn" disabled={state === 'sending'}>
          <Phone size={18} aria-hidden="true" /> {state === 'sending' ? T.lead.submitting : T.lead.submit}
        </button>
      </div>
    </form>
  )
}
