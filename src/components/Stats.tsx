export default function Stats() {
  const stats = [
    { value: '150+', label: 'Zrealizowanych transakcji', icon: '🏠' },
    { value: '5+', label: 'Lat na rynku', icon: '⭐' },
    { value: '98%', label: 'Zadowolonych klientów', icon: '😊' },
    { value: '24h', label: 'Czas reakcji na zapytanie', icon: '⚡' },
  ]
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-extrabold mb-1" style={{ color: '#1a4fa0', fontFamily: 'Syne, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
