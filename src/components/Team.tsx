'use client'
import { useEffect, useState } from 'react'

interface TeamMember {
  id: string
  full_name: string
  role: string
  phone: string
  avatar_url: string
  bio: string
  position_label: string
}

const CRM_API = 'https://investrent-crm-production.up.railway.app'

// Fallback jeśli API niedostępne
const FALLBACK: TeamMember[] = [
  { id: '1', full_name: 'InvestRent', role: 'manager', phone: '+48 731 554 341', avatar_url: '', bio: 'Biuro nieruchomości w Kołobrzegu', position_label: 'Dyrektor biura' },
]

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${CRM_API}/api/users/team/public`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setTeam(data)
        else setTeam(FALLBACK)
      })
      .catch(() => setTeam(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const gridCols = team.length === 1 ? 'max-w-sm mx-auto' :
                   team.length === 2 ? 'grid md:grid-cols-2 max-w-2xl mx-auto' :
                   team.length === 3 ? 'grid md:grid-cols-3 max-w-3xl mx-auto' :
                   'grid md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto'

  return (
    <section id="zespol" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
            Nasz zespół
          </div>
          <h2 className="text-4xl font-extrabold mb-4"
            style={{ fontFamily: 'Syne, sans-serif', color: '#111827' }}>
            Eksperci na których możesz liczyć
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Doświadczeni doradcy, którzy przeprowadzą Cię przez każdy etap transakcji.
          </p>
        </div>

        {loading ? (
          <div className={`${gridCols} gap-6`}>
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center animate-pulse">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className={`${gridCols} gap-6`}>
            {team.map(member => (
              <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm text-center group hover:shadow-md transition-shadow">

                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white ring-4 ring-white shadow-md"
                      style={{ background: 'linear-gradient(135deg, #1a4fa0, #f5a623)' }}>
                      {member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold mb-1" style={{ color: '#111827' }}>
                  {member.full_name}
                </h3>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1a4fa0' }}>
                  {member.position_label || (member.role === 'manager' ? 'Kierownik biura' : 'Doradca ds. nieruchomości')}
                </p>
                {member.bio && (
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">{member.bio}</p>
                )}

                {/* Telefon */}
                {member.phone && (
                  <a href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mt-2"
                    style={{ background: '#f5a623', color: '#fff' }}>
                    📞 {member.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
