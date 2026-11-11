"use client"
import { useEffect, useRef, useState } from 'react'
import { submitLead } from '@/lib/api'
import { CONSENT_OPEN_EVENT } from '@/lib/consent'
import s from './page.module.css'

// Strona docelowa reklam Google Ads (sprzedaz/wycena). 1:1 z makieta M_v8n. ROBOCZA: nie wdrazac przed slowem Daniela.
// Dane zaufania: odczyt Google 11.11.2026; weryfikowac w dniu startu i OKRESOWO przez caly czas zycia strony (Prawnik).
// W SaaS: dane biura/oceny z konfiguracji tenanta (tu na sztywno, strona robocza dla InvestRent).
const PHONE_DISPLAY = '731 554 341'
const PHONE_HREF = 'tel:+48731554341'
const RATING = '4,9'
const REVIEWS = 79
// Godziny 8-20 pokazujemy dopiero po tescie przekierowania po 16:00 i w sob/niedz (warunek Prawnika); do tego czasu flaga OFF.
const SHOW_HOURS = process.env.NEXT_PUBLIC_ADS_HOURS_8_20 === 'on'
// Zrodlo leada: kod 'ads_sprzedaj' (Bezp, PR #2460). Do czasu migracji CHECK i flagi ADS_SPRZEDAJ_SOURCE_ENABLED backend
// bezpiecznie zapisuje 'website'; rozpoznawalnosc kanalu daje wtedy znacznik w notatce (zostaje).
const SOURCE = 'ads_sprzedaj'
const NOTES_MARKER = 'Kanał: Google Ads, strona /sprzedaj-z-investrent (prośba o telefon)'
const ERR_PHONE = 'Podaj 9 cyfr numeru albo zadzwoń do nas.'

type Status = 'idle' | 'loading' | 'ok' | 'invalid' | 'error'

function nineDigits(p: string): string | null {
  const d = p.replace(/\D/g, '').replace(/^48(?=\d{9}$)/, '')
  return d.length === 9 ? d : null
}

function Form({ id, status, phone, setPhone, name, setName, hp, setHp, onSubmit }: {
  id: string; status: Status; phone: string; setPhone: (v: string) => void; name: string; setName: (v: string) => void
  hp: string; setHp: (v: string) => void; onSubmit: (e: React.FormEvent) => void
}) {
  const loading = status === 'loading'
  const invalid = status === 'invalid'
  const srv = status === 'error'
  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <div className={s.f}>
        <label htmlFor={`${id}-name`}>Imię (opcjonalnie)</label>
        <input id={`${id}-name`} type="text" name="name" placeholder="np. Anna" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className={`${s.f} ${invalid ? s.fe : ''}`}>
        <label htmlFor={`${id}-phone`}>Telefon</label>
        <input id={`${id}-phone`} type="tel" name="phone" placeholder="np. 600 123 456" inputMode="tel" autoComplete="tel" value={phone}
          onChange={e => setPhone(e.target.value)} aria-invalid={invalid} aria-describedby={invalid ? `${id}-err` : undefined} />
        <div className={`${s.mslot} ${srv ? s.mslotZ : ''}`} aria-live="polite">
          {invalid && <div id={`${id}-err`} className={s.msg} role="alert">{ERR_PHONE}</div>}
        </div>
      </div>
      <input className={s.hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={e => setHp(e.target.value)} />
      <div aria-live="polite">
        {srv && <div className={s.srv} role="alert">Nie udało się wysłać. Zadzwoń: <a href={PHONE_HREF} data-phone-position="error">{PHONE_DISPLAY}</a></div>}
      </div>
      <button type="submit" className={s.sub2} disabled={loading}>
        {loading ? (<><span className={s.spin} aria-hidden="true" />Wysyłamy…</>) : 'Poproszę o telefon'}
      </button>
      <p className={s.cons}>
        Zostawiając numer, prosisz o telefon w sprawie wyceny lub sprzedaży nieruchomości. <strong>To nie jest zgoda na oferty marketingowe.</strong>{' '}
        Administratorem jest Investrent sp. z o.o. Informacje o przetwarzaniu danych: <a href="/rodo" target="_blank" rel="noopener noreferrer">Klauzula informacyjna</a>.
      </p>
    </form>
  )
}

function StickyCall({ heroCallRef }: { heroCallRef: React.RefObject<HTMLAnchorElement> }) {
  const [heroGone, setHeroGone] = useState(false)
  const [banner, setBanner] = useState(false)
  useEffect(() => {
    const el = heroCallRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [heroCallRef])
  useEffect(() => {
    const check = () => setBanner(!!document.querySelector('.irc-bar'))
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])
  if (!heroGone || banner) return null
  return (
    <div className={s.sticky}>
      <a className={s.call} href={PHONE_HREF} data-phone-position="sticky">Zadzwoń: {PHONE_DISPLAY}</a>
    </div>
  )
}

const pin = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d2a5c" strokeWidth="2" aria-hidden="true">
    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
)

export default function SprzedajPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [sentPhone, setSentPhone] = useState('')
  const heroCallRef = useRef<HTMLAnchorElement>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    const digits = nineDigits(phone)
    if (!digits) { setStatus('invalid'); return }
    setStatus('loading')
    const res = await submitLead({ full_name: name.trim() || undefined, phone: digits, source: SOURCE, client_type: 'seller', notes: NOTES_MARKER, hp_field: hp })
    if (res?.ok) { setSentPhone(digits); setStatus('ok') } else setStatus('error')
  }

  const formProps = { status, phone, setPhone, name, setName, hp, setHp, onSubmit }
  const done = status === 'ok'
  const masked = sentPhone ? `${sentPhone.slice(0, 3)} *** ${sentPhone.slice(6)}` : ''

  const steps = (afterSend: boolean) => (
    <div className={s.sec}>
      <h2>{afterSend ? 'Co dalej' : 'Jak to wygląda'}</h2>
      <ol className={s.steps}>
        <li><span className={s.n}>1</span><span>{afterSend ? 'Mamy Twój numer. Oddzwania ktoś z zespołu InvestRent.' : 'Dzwonisz albo zostawiasz numer. Oddzwania ktoś z zespołu InvestRent.'}</span></li>
        <li><span className={s.n}>2</span><span>Rozmawiamy o Twojej nieruchomości i o tym, jak ją sprzedać.</span></li>
        <li><span className={s.n}>3</span><span>Rozmowa i wycena orientacyjna są bezpłatne. Warunki ewentualnej umowy omawiamy osobno.</span></li>
      </ol>
    </div>
  )

  return (
    <div className={s.page}>
      <header className={s.topbar}>
        <span className={s.logo}>Invest<b>Rent</b></span>
        <a className={s.pill} href={PHONE_HREF} data-phone-position="header">{PHONE_DISPLAY}</a>
      </header>

      <main>
        {done ? (
          <section className={s.hero}>
            <div className={`${s.wrapd} ${s.oneH1}`}>
              <div className={s.in}><h1>Sprzedaż mieszkania lub domu w Kołobrzegu</h1></div>
              <div className={s.in}>
                <div className={s.done} role="status">
                  <h2>Dziękujemy, numer zapisany</h2>
                  <p>Numer {masked}. Oddzwonimy w ciągu 24 godzin. Jeśli sprawa jest pilna, zadzwoń od razu.</p>
                  <a className={s.call} href={PHONE_HREF} data-phone-position="done">Zadzwoń: {PHONE_DISPLAY}</a>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className={s.hero}>
            <div className={s.wrapd}>
              <div className={s.in}>
                <h1>Sprzedaż mieszkania lub domu w Kołobrzegu</h1>
                <p className={s.sub}>Zadzwoń lub zostaw numer: porozmawiamy o sprzedaży lub wycenie. Oddzwonimy w ciągu 24&nbsp;godzin.</p>
                <a ref={heroCallRef} className={s.call} href={PHONE_HREF} data-phone-position="main">Zadzwoń: {PHONE_DISPLAY}</a>
                {SHOW_HOURS && <div className={s.hours}>Telefon odbieramy codziennie 8:00–20:00</div>}
                <div className={s.tl}>Biuro w Kołobrzegu · ★ {RATING} w Google ({REVIEWS} opinii)</div>
              </div>
              <div className={s.in}><Form id="hero" {...formProps} /></div>
            </div>
          </section>
        )}

        <div className={s.mid}>
          {steps(done)}
          <section className={`${s.sec} ${s.trustc}`}>
            <h2>Dlaczego InvestRent</h2>
            <div className={s.rate}><i aria-hidden="true">★★★★★</i> {RATING} w Google · {REVIEWS} opinii</div>
            <p>Ponad 150 zrealizowanych transakcji w historii biura.</p>
            <p>{pin}<span>Biuro w Kołobrzegu: ul. Ratuszowa 12/1 lok.&nbsp;3, <span style={{ whiteSpace: "nowrap" }}>78-100 Kołobrzeg</span>.</span></p>
          </section>
        </div>

        {!done && (
          <section className={s.cwrap}>
            <div className={`${s.sec} ${s.c}`}>
              <h2>Zadzwoń albo zostaw numer</h2>
              <p className={s.cLead}>Oddzwonimy w ciągu 24 godzin.</p>
              <a className={`${s.call} ${s.dOnly}`} href={PHONE_HREF} data-phone-position="bottom">Zadzwoń: {PHONE_DISPLAY}</a>
              <Form id="bottom" {...formProps} />
            </div>
          </section>
        )}
      </main>

      <footer className={s.foot}>
        Investrent sp. z o.o., ul. Ratuszowa 12/1 lok.&nbsp;3, <span style={{ whiteSpace: "nowrap" }}>78-100 Kołobrzeg</span> · NIP 671 185 85 59 · KRS 0001069797 · biuro@investrent.com.pl<br />
        <a href="/rodo" target="_blank" rel="noopener noreferrer">Polityka prywatności</a> · <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new Event(CONSENT_OPEN_EVENT)) }}>Ustawienia prywatności</a>
      </footer>

      {!done && <StickyCall heroCallRef={heroCallRef} />}
    </div>
  )
}
