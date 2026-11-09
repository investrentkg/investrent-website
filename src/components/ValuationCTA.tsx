"use client"
import { Award, Clock, ShieldCheck } from 'lucide-react'

export default function ValuationCTA() {
  return (
    <section className="m3-val">
      <div className="container">
        <div className="m3-val-in">
          <div style={{ maxWidth: 680 }}>
            <h2>Ile warta jest Twoja<br />nieruchomość?</h2>
            <p>
              Dowiedz się za darmo — bez wychodzenia z domu. Nasz ekspert przygotuje wycenę
              i skontaktuje się z Tobą do 24h. Żadnych ukrytych kosztów, żadnych zobowiązań.
            </p>
            <ul className="m3-val-bens">
              {[
                { icon: Award, label: 'Bezpłatna, bez zobowiązań' },
                { icon: Clock, label: 'Kontakt do 24h' },
                { icon: ShieldCheck, label: 'Rzetelna wycena eksperta' },
              ].map(p => {
                const Icon = p.icon
                return (
                  <li key={p.label}><Icon size={16} aria-hidden="true" /> {p.label}</li>
                )
              })}
            </ul>
          </div>
          <div className="m3-val-cta">
            <a href="/wycena" className="m3-val-btn">Chcę bezpłatną wycenę</a>
            <span>Odpowiadamy najpóźniej w ciągu 24 godzin · +48 731 554 341</span>
          </div>
        </div>
      </div>
    </section>
  )
}
