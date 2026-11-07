// Flaga strony "Nieruchomosci komercyjne" (domyslnie OFF; wlaczenie na produkcji tylko po zgodzie Daniela).
// NEXT_PUBLIC_COMMERCIAL_HUB=on => strona /nieruchomosci-komercyjne dziala i trafia do sitemap. Cofniecie: usunac zmienna + redeploy.
export function isCommercialHubOn(): boolean {
  return process.env.NEXT_PUBLIC_COMMERCIAL_HUB === 'on'
}
