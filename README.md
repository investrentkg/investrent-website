# InvestRent Website — Next.js

Strona www biura nieruchomości InvestRent, połączona live z CRM.

## Stack
- **Next.js 14** (App Router, ISR)
- **TypeScript** + Tailwind CSS
- **Montserrat** + **Inter** via `next/font`
- API: `api.investrent.com.pl`

## Uruchomienie lokalnie

```bash
npm install
cp .env.example .env.local
# ustaw NEXT_PUBLIC_API_URL w .env.local
npm run dev
```

## Zmienne środowiskowe

| Zmienna | Opis |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL backendu CRM (api.investrent.com.pl) |
| `NEXT_PUBLIC_META_PIXEL_ENABLED` | Meta Pixel for valuation; keep unset or `off` until explicitly enabled |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID (public identifier, required for browser Pixel) |
| `NEXT_PUBLIC_MAPS_KEY` | Google Maps API key (opcjonalnie) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (opcjonalnie) |

Server-side Conversions API is not included in this website change. It requires a CRM-issued proof tied to a successfully saved lead; do not enable a public CAPI endpoint based on browser-supplied consent or identifiers.

## Pliki do uzupełnienia (public/)
- `public/hero.jpg` — zdjęcie hero (latarnia Kołobrzeg, 1920×1080)
- `public/about.jpg` — zdjęcie biura (opcjonalnie)
- `public/og-image.jpg` — Open Graph image (1200×630)

## Deploy (Vercel)

1. Połącz repo `investrentkg/investrent-website` w Vercel
2. Ustaw env var `NEXT_PUBLIC_API_URL`
3. Deploy automatyczny przy każdym pushu na `main`

## Endpointy publiczne CRM

- `GET  /api/public/offers` — lista ofert (ISR 5min)
- `GET  /api/public/offers/:id` — szczegóły oferty
- `GET  /api/public/team` — agenci (ISR 10min)
- `GET  /api/public/office` — dane biura (ISR 1h)
- `GET  /api/public/stats` — statystyki live
- `POST /api/public/leads` — formularz kontaktowy

## Architektura

```
app/
  layout.tsx      — root layout (fonty, metadata)
  page.tsx        — strona główna (Server Component, równoległe fetch)
  globals.css     — Tailwind + CSS custom properties

components/
  Nav.tsx         — sticky nav + hamburger (Client)
  Hero.tsx        — hero z video/photo background (Client)
  CallbackStrip.tsx — "Oddzwonimy do 60 min" + form (Client)
  OffersSection.tsx — karuzela ofert z tabami (Client)
  About.tsx       — sekcja "O nas" (Server)
  Services.tsx    — 4 kafelki usług (Server)
  ValuationCTA.tsx — CTA bezpłatna wycena (Server)
  Reviews.tsx     — opinie Google (Server, static)
  Team.tsx        — karuzela zespołu z avatarami (Client)
  Contact.tsx     — formularz + dane kontaktowe (Client)
  Footer.tsx      — stopka (Server)
  FloatingWA.tsx  — floating WhatsApp button

lib/
  api.ts          — API client z ISR revalidation

types/
  index.ts        — TypeScript interfaces
```
<!-- build: 2026-06-29T09:56 -->
