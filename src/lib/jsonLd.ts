// Bezpieczna serializacja danych strukturalnych do <script type="application/ld+json">.
//
// JSON.stringify NIE escapuje znaku '<', wiec pole z danymi spoza kodu (np. tytul
// wpisu z CMS, opis oferty) zawierajace "</script><script>..." zamknaloby tag i
// pozwolilo wstrzyknac wlasny kod (XSS). Ta funkcja zamienia '<' na < (poprawny
// JSON, ta sama wartosc po sparsowaniu) oraz separatory linii U+2028/U+2029.
// UZYWAC WSZEDZIE, gdzie renderujemy ld+json (src/lib/jsonLd.test.mjs).
const LS = String.fromCharCode(0x2028)
const PS = String.fromCharCode(0x2029)

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .split(LS).join('\\u2028')
    .split(PS).join('\\u2029')
}
