import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import Contact from '@/components/Contact'
import Breadcrumb from '@/components/Breadcrumb'
import { getOffice } from '@/lib/api'
import { Gavel, Scale, Building, Users, FileWarning, CreditCard, CheckCircle, Phone, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trudne nieruchomości i doradztwo | InvestRent Kołobrzeg',
  description: 'Sprawy spadkowe, hipoteki, współwłasność, licytacje komornicze. Pomagamy rozwiązać skomplikowane sprawy nieruchomości w Kołobrzegu.',
}

const FALLBACK_OFFICE = {
  name: 'InvestRent', logo_url: '/logo.png',
  address: 'ul. Ratuszowa 12/1 lok. 3, 78-100 Kołobrzeg',
  phone: '+48 731 554 341', email: 'biuro@investrent.com.pl',
  website: null, working_hours: null,
}

const CASES = [
  { icon: Scale,       title: 'Sprawy spadkowe',         desc: 'Dziedziczysz nieruchomość i nie wiesz co z nią zrobić? Pomagamy w sprzedaży lub podziale między spadkobierców. Współpracujemy z notariuszami specjalizującymi się w prawie spadkowym.',   tags: ['Dział spadku', 'Sprzedaż po śmierci', 'Podział majątku'] },
  { icon: Building,    title: 'Współwłasność',            desc: 'Jesteś współwłaścicielem nieruchomości z osobą, z którą trudno się porozumieć? Pomagamy w negocjacjach, sprzedaży udziałów lub zniesieniu współwłasności.',                              tags: ['Sprzedaż udziałów', 'Zniesienie współwłasności', 'Negocjacje'] },
  { icon: FileWarning, title: 'Hipoteka i obciążenia',    desc: 'Nieruchomość z kredytem hipotecznym, służebnością lub innym obciążeniem? Wiemy jak przeprowadzić sprzedaż tak, żeby wszystkie strony były zabezpieczone prawnie.',                       tags: ['Sprzedaż z hipoteką', 'Służebności', 'Zaległości'] },
  { icon: Gavel,       title: 'Licytacje komornicze',     desc: 'Szukasz okazji w licytacjach lub chcesz sprzedać przed licytacją? Znamy procedury, pomagamy kupującym i sprzedającym w najtrudniejszych sytuacjach.',                                   tags: ['Zakup na licytacji', 'Sprzedaż przed egzekucją', 'Doradztwo'] },
  { icon: Users,       title: 'Rozwód i podział majątku', desc: 'Podział wspólnej nieruchomości po rozstaniu to jeden z najtrudniejszych procesów. Działamy dyskretnie, pomagamy znaleźć rozwiązanie satysfakcjonujące obie strony.',                    tags: ['Podział majątku', 'Sprzedaż za zgodą obu stron', 'Dyskrecja'] },
  { icon: CreditCard,  title: 'Kredyt i doradztwo',       desc: 'Potrzebujesz kredytu na zakup? Współpracujemy z doradcami kredytowymi i pomagamy wybrać najlepszą ofertę. Również dla osób z trudniejszą historią kredytową.',                          tags: ['Kredyt hipoteczny', 'Ubezpieczenie', 'Doradztwo finansowe'] },
]

const PROCESS = [
  { n: '01', title: 'Bezpłatna konsultacja',   desc: 'Zadzwoń lub napisz — opowiedz nam o swojej sytuacji. Pierwsza konsultacja jest całkowicie bezpłatna i bez zobowiązań.' },
  { n: '02', title: 'Analiza i plan działania', desc: 'Oceniamy sytuację prawną i finansową. Przygotowujemy konkretny plan rozwiązania problemu.' },
  { n: '03', title: 'Działamy za Ciebie',       desc: 'Negocjujemy, koordynujemy z prawnikami i notariuszami. Ty nie musisz zajmować się formalnościami.' },
  { n: '04', title: 'Rozwiązanie',              desc: 'Doprowadzamy sprawę do końca — sprzedaż, podział lub inne rozwiązanie. Pełna obsługa do ostatniego podpisu.' },
]

export default async function TrudneNieruchomosciPage() {
  const officeData = await getOffice()
  const office = officeData ?? FALLBACK_OFFICE

  return (
    <>
      <Nav office={office} />
      <main>
        <style>{`
          .case-card { background: white; border-radius: 16px; padding: 28px; border: 1px solid #e5e7eb; transition: transform .2s, box-shadow .2s; }
          .case-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,.08); }
        `}</style>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4338ca)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.06)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <Breadcrumb light={true} crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Trudne nieruchomości' }]} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(255,255,255,.15)', color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 18 }}>
              <Gavel size={12} /> Specjalistyczne doradztwo
            </div>
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 44, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.08, marginBottom: 18 }}>
              Trudne sprawy<br />to nasza specjalność
            </h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, maxWidth: 560, lineHeight: 1.8, marginBottom: 32 }}>
              Sprawy spadkowe, współwłasność, hipoteki, licytacje komornicze — pomagamy rozwiązać najtrudniejsze sytuacje nieruchomościowe. Dyskretnie i skutecznie.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <a href="#kontakt-trudne" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#4338ca', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none' }}>
                <Phone size={16} /> Bezpłatna konsultacja
              </a>
              <a href="tel:+48731554341" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.15)', color: 'white', fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 12, textDecoration: 'none' }}>
                +48 731 554 341
              </a>
            </div>
          </div>
        </div>

        {/* Cases */}
        <div style={{ background: '#f8fafc', padding: '64px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(67,56,202,.08)', color: '#4338ca', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 12 }}>Czym się zajmujemy</div>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 10 }}>Rozwiązujemy najtrudniejsze sprawy</h2>
              <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>Każda sytuacja jest inna. Nie ma sprawy zbyt skomplikowanej.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
              {CASES.map(c => {
                const Icon = c.icon
                return (
                  <div key={c.title} className="case-card">
                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #4338ca, #1e1b4b)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Icon size={24} color="white" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#0d2a5c', marginBottom: 10 }}>{c.title}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.75, marginBottom: 14 }}>{c.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                      {c.tags.map(t => (
                        <span key={t} style={{ background: 'rgba(67,56,202,.08)', color: '#4338ca', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dlaczego my */}
        <div style={{ background: 'white', padding: '56px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', marginBottom: 16 }}>Dlaczego warto nam zaufać?</h2>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 20 }}>
                  Trudne sprawy wymagają doświadczenia i sieci kontaktów. Przez lata zbudowaliśmy relacje z prawnikami, notariuszami i specjalistami — co pozwala rozwiązywać przypadki, z którymi inne agencje sobie nie radzą.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {[
                    'Bezpłatna wstępna konsultacja — bez zobowiązań',
                    'Sieć prawników specjalizujących się w nieruchomościach',
                    'Dyskrecja i pełna poufność Twoich spraw',
                    'Działamy nawet przy skomplikowanych stanach prawnych',
                    'Prowizja tylko od sukcesu',
                  ].map(w => (
                    <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={17} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, color: '#374151' }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { val: '100%', label: 'Poufność',     sub: 'Gwarancja dyskrecji' },
                  { val: '0 zł', label: 'Konsultacja',  sub: 'Pierwsza rozmowa gratis' },
                  { val: '500+', label: 'Transakcji',   sub: 'W tym trudne przypadki' },
                  { val: '24h',  label: 'Odpowiedź',    sub: 'Na każde zapytanie' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f8fafc', borderRadius: 14, padding: '24px', textAlign: 'center' as const, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 32, color: '#0d2a5c', marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proces */}
        <div style={{ background: '#f8fafc', padding: '56px 0' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#0d2a5c', textAlign: 'center' as const, marginBottom: 40 }}>Jak działamy</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {PROCESS.map(p => (
                <div key={p.n} style={{ textAlign: 'center' as const }}>
                  <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #4338ca, #1e1b4b)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'white', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 18 }}>{p.n}</div>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#0d2a5c', marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="kontakt-trudne"><Contact office={office} /></div>
      </main>
      <Footer office={office} />
      <FloatingWA />
    </>
  )
}
