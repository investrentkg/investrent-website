const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'

// Zapytania z tej strony do CRM idą z serwera Next.js (SSR), nie z przeglądarki -
// nigdy nie niosą nagłówka Origin, więc dotychczasowy mechanizm rozpoznawania
// tenanta (Origin + publiczny klucz) zawsze je odrzucał jako "nieznane źródło"
// (znalezisko 15.07.2026 - Zespół pokazywał inicjały zamiast zdjęć, bo /api/public/team
// zwracał 400 i strona cicho przełączała się na dane zapasowe). Ten nagłówek to
// prawdziwie tajny klucz serwer-serwer, nigdy nieujawniany przeglądarce.
const INTERNAL_HEADERS: Record<string, string> = process.env.INTERNAL_SERVICE_API_KEY
  ? { 'x-internal-service-key': process.env.INTERNAL_SERVICE_API_KEY, 'x-tenant-slug': 'investrent' }
  : {}

async function apiFetch<T>(path: string, options?: RequestInit, signal?: AbortSignal): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { ...options, signal, headers: { ...INTERNAL_HEADERS, ...(options?.headers || {}) } })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

// ── Oferty ──
export async function getPublicOffers(params: {
  page?: number
  limit?: number
  tab?: 'new' | 'promo' | 'exclusive'
  property_type?: string
  transaction_type?: string
  agent_id?: string
} = {}, signal?: AbortSignal) {
  const q = new URLSearchParams()
  if (params.page)             q.set('page',             String(params.page))
  if (params.limit)            q.set('limit',            String(params.limit))
  if (params.tab)              q.set('tab',              params.tab)
  if (params.property_type)   q.set('property_type',   params.property_type)
  if (params.transaction_type) q.set('transaction_type', params.transaction_type)
  if (params.agent_id)         q.set('agent_id',         params.agent_id)

  return apiFetch<import('@/types').PaginatedOffers>(
    `/api/public/offers?${q}`,
    { next: { revalidate: 60 } },    // ISR 1 min
    signal
  )
}

export async function getPublicOffer(id: string) {
  return apiFetch<import('@/types').Offer>(
    `/api/public/offers/${id}`,
    { next: { revalidate: 60 } }
  )
}

// ── Zespół ──
export async function getTeam() {
  return apiFetch<{ data: import('@/types').TeamMember[] }>(
    '/api/public/team',
    { next: { revalidate: 60 } }    // ISR 1 min
  )
}

// ── Dane biura ──
export async function getOffice() {
  return apiFetch<import('@/types').Office>(
    '/api/public/office',
    { next: { revalidate: 3600 } }  // ISR 1 h
  )
}

// NOWE (16.08, Daniel: "chce miec mozliwosc APLIKACJI sugestii SEO z
// poziomu CRM"). Pobiera nadpisania tresci (w tym meta title/description)
// dla danej strony z website_content_blocks - uzywane w generateMetadata()
// stron ktore maja edytowalne SEO. Zwraca mape pusta ({}) jesli nikt
// jeszcze nic nie nadpisal (bezpieczny fallback do domyslnej tresci w
// kodzie strony samej). Revalidate 1h - zgodnosc z getOffice powyzej,
// zmiana meta tagow nie musi byc natychmiastowa co do sekundy.
export async function getPageContent(page: string) {
  return apiFetch<{ blocks: Record<string, string> }>(
    `/api/public/content/${page}`,
    { next: { revalidate: 3600 } }
  )
}

// ── Statystyki ──
export async function getStats() {
  return apiFetch<import('@/types').PublicStats>(
    '/api/public/stats',
    { next: { revalidate: 3600 } }
  )
}

// ── Formularz kontaktowy ──
export async function submitLead(payload: {
  full_name?: string
  phone?: string
  email?: string
  notes?: string
  source?: string
  client_type?: string
  preferred_city?: string
}) {
  const res = await fetch(`${API}/api/public/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

// ── Blog (14.08, patrz backend/src/routes/blog.ts w investrent-crm) ──
export async function getPublicBlogPosts() {
  return apiFetch<import('@/types').BlogPostSummary[]>(
    '/api/public/blog',
    { next: { revalidate: 300 } } // ISR 5 min - artykuly zmieniaja sie rzadko
  )
}

export async function getPublicBlogPost(slug: string) {
  return apiFetch<import('@/types').BlogPost>(
    `/api/public/blog/${slug}`,
    { next: { revalidate: 300 } }
  )
}
