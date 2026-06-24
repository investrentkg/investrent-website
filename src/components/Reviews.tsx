"use client"
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, ExternalLink } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'
const GOOGLE_URL = 'https://www.google.com/maps/place/Invest+Rent+Nieruchomo%C5%9Bci/@54.1770073,15.5744432,17z/#reviews'

const FALLBACK = [
  { author: 'Marta Kowalczyk',   avatar: null, rating: 5, text: 'Wspaniała obsługa od początku do końca. Daniel i Weronika przeprowadzili nas przez cały proces zakupu apartamentu — bezstresowo i sprawnie. Szczególnie doceniamy szybki kontakt i rzetelne informacje o stanie prawnym. Polecamy z całego serca!', time: 'styczeń 2026' },
  { author: 'Piotr Tomaszewski', avatar: null, rating: 5, text: 'Sprzedaliśmy mieszkanie w 3 tygodnie! Zdjęcia profesjonalne, oferta na portalach w dobie. Cena transakcyjna wyższa niż się spodziewałem. Odpowiedź w ciągu godziny — to naprawdę działa!', time: 'listopad 2025' },
  { author: 'Anna Nowak-Wróbel', avatar: null, rating: 5, text: 'Szukałam apartamentu inwestycyjnego pod wynajem. InvestRent znalazło idealne miejsce i zajęło się całą obsługą wynajmu. Teraz zarabiam na apartamencie nie martwiąc się o lokatorów. Szczerze polecam!', time: 'wrzesień 2025' },
]

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={16} fill={i <= n ? '#f5a623' : 'none'} color={i <= n ? '#f5a623' : '#d1d5db'} />
      ))}
    </div>
  )
}

function Avatar({ author, avatar }: { author: string; avatar: string | null }) {
  const initials = author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#1a4fa0','#0d2a5c','#059669','#d97706','#7c3aed','#dc2626']
  const bg = colors[author.charCodeAt(0) % colors.length]
  if (avatar) return <img src={avatar} alt={author} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState(FALLBACK)
  const [rating, setRating] = useState(4.9)
  const [total, setTotal] = useState(127)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/public/google-reviews`)
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.reviews?.length >= 3) {
          setReviews(d.reviews)
          setRating(d.rating)
          setTotal(d.total)
          setLoaded(true)
        }
      })
      .catch(() => {}) // fallback już ustawiony
  }, [])

  const next = useCallback(() => setActive(a => (a + 1) % reviews.length), [reviews.length])
  const prev = useCallback(() => setActive(a => (a - 1 + reviews.length) % reviews.length), [reviews.length])

  // Auto-scroll co 5s
  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next])

  const visibleCount = 3
  const visible = Array.from({ length: visibleCount }, (_, i) => reviews[(active + i) % reviews.length])

  return (
    <section style={{ background: 'white', padding: '64px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap' as const, gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: 'rgba(245,166,35,.1)', color: '#d97706', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' as const, marginBottom: 12 }}>
              ⭐ Opinie klientów
            </div>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 30, color: '#0d2a5c', letterSpacing: '-.5px', marginBottom: 6 }}>
              Co mówią o nas klienci?
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Ponad {total} opinii na Google · {loaded ? 'Aktualizowane na bieżąco' : 'Zweryfikowane opinie'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={prev} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={18} color="#374151" />
            </button>
            <button onClick={next} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={18} color="#374151" />
            </button>
          </div>
        </div>

        {/* Karuzela */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {visible.map((r, i) => (
            <div key={`${active}-${i}`} style={{ background: '#f8fafc', borderRadius: 16, padding: '24px', border: '1px solid #e5e7eb', transition: 'opacity .3s' }}>
              <Stars n={r.rating} />
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, marginBottom: 20, minHeight: 80 }}>
                "{r.text.length > 220 ? r.text.slice(0, 220) + '…' : r.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar author={r.author} avatar={r.avatar} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{r.author}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{r.time}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wskaźniki + ocena */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? '#1a4fa0' : '#d1d5db', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
            ))}
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 42, color: '#0d2a5c', lineHeight: 1 }}>{rating}</div>
            <Stars n={5} />
            <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1a4fa0', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
              Na podstawie {total} opinii w Google <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
