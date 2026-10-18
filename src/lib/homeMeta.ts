// Title i description strony glownej (SEO krok 1, zaakceptowany przez Daniela 18.10.2026).
// Osobny plik bez importow, zeby test jednostkowy (node --test) mogl go wczytac.
export const HOME_TITLE = 'Nieruchomości Kołobrzeg | Biuro nieruchomości InvestRent'
export const HOME_DESCRIPTION =
  'Biuro nieruchomości w Kołobrzegu: mieszkania na sprzedaż i wynajem, orientacyjna wycena online, obsługa sprzedaży i zakupu. Zadzwoń lub napisz.'

// Stare wartosci zapisane w CRM (Strony -> strona-glowna) - zywa strona wciaz je serwuje,
// bo wartosc z CRM ma pierwszenstwo nad domyslna z kodu. Traktowane jak "brak wlasnej
// wartosci", zeby zatwierdzony tekst zadzialal bez recznej edycji w CRM. Kazda INNA
// wartosc z CRM nadal wygrywa.
export const LEGACY_HOME_TITLES = ['Biuro Nieruchomości Kołobrzeg | Invest Rent', 'Biuro nieruchomości Kołobrzeg | Invest Rent']
export const LEGACY_HOME_DESCRIPTIONS = [
  'Invest Rent – biuro nieruchomości w Kołobrzegu. Kupno, sprzedaż i wynajem mieszkań, domów i działek. Sprawdź aktualne oferty i skontaktuj się z naszym agentem.',
  'Biuro nieruchomości w Kołobrzegu i okolicach: sprzedaż, kupno i wynajem mieszkań oraz domów. Bezpłatna wycena, odpowiedź do 60 minut.',
]

export function pickHomeMeta(crmTitle?: string | null, crmDescription?: string | null) {
  const ownTitle = crmTitle && !LEGACY_HOME_TITLES.includes(crmTitle.trim()) ? crmTitle : null
  const ownDescription = crmDescription && !LEGACY_HOME_DESCRIPTIONS.includes(crmDescription.trim()) ? crmDescription : null
  return { ownTitle, title: ownTitle || HOME_TITLE, description: ownDescription || HOME_DESCRIPTION }
}
