// Teksty ekranu 1 kalkulatora v4 (flaga NEXT_PUBLIC_WYCENA_SCREEN1_V4). Źródło: makieta E1i zatwierdzona przez Daniela 11.11.2026 (forma Ty).
export const WYCENA_SCREEN1_V4_TEXTS = {
  area: { label: 'Metraż', placeholder: 'np. 45', unit: 'm²', error: 'Wpisz metraż w m², np. 45.' },
  city: { label: 'Miejscowość' },
  rooms: { label: 'Pokoje', optional: '(opcjonalnie)', group: 'Liczba pokoi' },
  floor: { label: 'Piętro', optional: '(opcjonalnie)', group: 'Piętro' },
  unknownSelected: 'Nie wiem',
  hint: 'Pokoje i piętro zawężają tylko ceny ofertowe.',
  submit: 'Pokaż ceny w mojej okolicy',
  noPhone: 'Wynik zobaczysz od razu, bez podawania numeru telefonu.',
  fine: 'Wynik jest orientacyjny, nie jest operatem szacunkowym rzeczoznawcy majątkowego ani wiążącą ofertą ceny.',
} as const
