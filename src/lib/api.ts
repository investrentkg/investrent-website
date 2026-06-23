const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://investrent-crm-production.up.railway.app'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, options)
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
} = {}) {
  const q = new URLSearchParams()
  if (params.page)             q.set('page',             String(params.page))
  if (params.limit)            q.set('limit',            String(params.limit))
  if (params.tab)              q.set('tab',              params.tab)
  if (params.property_type)   q.set('property_type',   params.property_type)
  if (params.transaction_type) q.set('transaction_type', params.transaction_type)

  return apiFetch<import('@/types').PaginatedOffers>(
    `/api/public/offers?${q}`,
    { next: { revalidate: 300 } }   // ISR 5 min
  )
}

export async function getPublicOffer(id: string) {
  return apiFetch<import('@/types').Offer>(
    `/api/public/offers/${id}`,
    { next: { revalidate: 300 } }
  )
}

// ── Zespół ──
export async function getTeam() {
  return apiFetch<{ data: import('@/types').TeamMember[] }>(
    '/api/public/team',
    { next: { revalidate: 600 } }   // ISR 10 min
  )
}

// ── Dane biura ──
export async function getOffice() {
  return apiFetch<import('@/types').Office>(
    '/api/public/office',
    { next: { revalidate: 3600 } }  // ISR 1 h
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
