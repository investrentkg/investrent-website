export default function Team() {
  const team = [
    { name: 'Marek K.', role: 'Dyrektor biura', phone: '+48 731 554 341', specialization: 'Sprzedaż i wynajem mieszkań' },
    { name: 'Agent InvestRent', role: 'Doradca ds. nieruchomości', phone: '+48 731 554 341', specialization: 'Domy i działki' },
  ]
  return (
    <section id="zespol" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(26,79,160,.08)', color: '#1a4fa0' }}>
            Nasz zespół
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#111827' }}>
            Eksperci na których możesz liczyć
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {team.map(member => (
            <div key={member.name} className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-extrabold text-white"
                style={{ background: 'linear-gradient(135deg, #1a4fa0, #f5a623)' }}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#111827' }}>{member.name}</h3>
              <p className="text-sm font-medium mb-1" style={{ color: '#1a4fa0' }}>{member.role}</p>
              <p className="text-xs text-gray-400 mb-3">{member.specialization}</p>
              <a href={`tel:${member.phone}`}
                className="inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#f5a623', color: '#fff' }}>
                {member.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
