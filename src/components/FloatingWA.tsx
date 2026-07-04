import { MessageCircle } from 'lucide-react'

export default function FloatingWA() {
  return (
    <a href="https://wa.me/48731554341" target="_blank" rel="noopener noreferrer"
      className="cta-pulse-limited fixed z-50 flex items-center gap-2 bg-[#25D366] text-white
                 text-[13px] font-bold px-5 py-3.5 rounded-full shadow-xl hover:-translate-y-0.5
                 transition-all"
      style={{ bottom: 24, right: 90, boxShadow: '0 8px 24px rgba(37,211,102,.4)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21zm4.5-2.4a7 7 0 1 0-1.1-1.1l-.9 2 2-.9z"/>
      </svg>
      Napisz na WhatsApp
    </a>
  )
}
