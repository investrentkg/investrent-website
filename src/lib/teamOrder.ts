// Deterministyczna kolejnosc kart zespolu na stronie glownej (makieta M3).
// API /api/public/team nie zwraca pola kolejnosci (sort_order/position), a jego
// kolejnosc potrafila sie zmieniac miedzy zaladowaniami (Julia Krupinska raz na
// poz. 2, raz na 7). Dlatego kolejnosc zadajemy kluczem id czlonka (konfiguracja
// ponizej, nie imionami w kodzie renderu); czlonkowie spoza listy ida na koniec,
// stabilnie: po full_name (pl), potem po id. Wynik nie zalezy od kolejnosci wejscia.
export const TEAM_ORDER_IDS: readonly string[] = [
  '9612bbd8-88d8-4df8-98b0-1142d004ae21', // Sara Kida
  'ed29cfdc-1106-40e5-95c4-6b338b03461c', // Julia Krupinska
  'f79c1364-b890-429e-9cbd-132160529014', // Dariusz Fugiel
  '8cb47bee-e26d-4506-962e-de711874c85e', // Dagmara Kotarba
  '3bcb9327-c18d-4725-9763-55e7d5acfa66', // Xavier Niznik
  '0063d1e7-62a6-420a-aae6-4430be4af197', // Julia Semak
  '575a293b-f8ec-4fe7-91a2-cd77be9dddea', // Marta Semak
  '7be65a1f-c1b6-4973-a5e5-5d5fc62f6f6f', // Dawid Sadownik
  '56d8b6db-4011-4f20-898a-c34932eceaff', // Weronika Skwarek
  '8340d185-4854-4bcf-827c-74274873b4d3', // Ernest Podhajski
  '8225b61e-77f6-4564-9c42-05f3d7306124', // Daniel Kaminski
]

export function sortTeam<T extends { id: string; full_name?: string }>(
  members: readonly T[],
  order: readonly string[] = TEAM_ORDER_IDS,
): T[] {
  const rank = new Map(order.map((id, i) => [id, i]))
  const r = (m: T) => rank.get(m.id) ?? Number.MAX_SAFE_INTEGER
  return [...members].sort((a, b) =>
    r(a) - r(b)
    || (a.full_name ?? '').localeCompare(b.full_name ?? '', 'pl')
    || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}
