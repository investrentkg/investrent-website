export interface Offer {
  id: string
  ref_number: string
  title: string | null
  property_type: 'mieszkanie' | 'dom' | 'dzialka' | 'lokal' | 'biuro' | 'magazyn' | 'garaz' | 'inwestycja'
  transaction_type: 'sprzedaz' | 'wynajem' | 'dzierzawa'
  market_type: 'pierwotny' | 'wtorny'
  price: number | null
  price_per_m2: number | null
  area: number | null
  rooms_count: number | null
  floor: number | null
  floors_total: number | null
  address_city: string
  address_district: string | null
  address_street: string | null
  exclusivity: boolean
  no_rent_fee?: boolean | null
  is_swap: boolean
  has_garden: boolean
  status: 'opublikowana' | 'zarezerwowana'
  created_at: string
  main_photo: string | null
  photo_count: number
  offer_photos?: Array<{ id: string; url: string; is_main: boolean; sort_order: number }>
  agent?: {
    full_name: string
    avatar_url: string | null
    phone: string | null
    email?: string | null
  } | null
}

export interface TeamMember {
  id: string
  full_name: string
  role: string
  role_label: string
  avatar_url: string | null
  bio: string | null
  specialization: string | null
  offer_count?: number
  position_label?: string | null
}

export interface Office {
  name: string
  logo_url: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  working_hours: Record<string, string> | null
  facebook_url?: string | null
  instagram_url?: string | null
}

export interface PublicStats {
  active_offers: number
  completed_transactions: number
  team_size: number
}

export interface PaginatedOffers {
  data: Offer[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// NOWE (14.08, blog - patrz backend/src/routes/blog.ts w investrent-crm)
export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string
  users: { full_name: string } | null
}

export interface BlogPost extends BlogPostSummary {
  content: string
  meta_title: string | null
  meta_description: string | null
}
