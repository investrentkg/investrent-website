// Parser opisu oferty -> bloki do czytelnego wyswietlenia (CRM: karta oferty; strona WWW: ten sam algorytm). CZYSTA logika, bez zaleznosci,
// TRESC SIE NIE ZMIENIA (tylko uklad): nic nie jest dopisywane ani przepisywane, usuwamy wylacznie znaczniki list (* • ✔ – -) i koncowe przecinki/srednik pozycji listy.
// Reguly (ustalone z Danielem 07.11, makieta MAKIETA_KARTA_OFERTY_07_11):
//  1) puste linie rozdzielaja akapity;
//  2) linia zaczynajaca sie od znacznika listy (* • ✔ – -) to pozycja listy; kolejne takie linie tworza jedna liste;
//  3) znaczniki srodliniowe ("... AGD: * zmywarka, * piekarnik, ...") sa rozbijane na pozycje listy (tekst przed pierwszym znacznikiem zostaje akapitem);
//  4) srodtytul = linia SAMA w akapicie (puste linie przed i po), do 80 znakow, bez kropki/dwukropka/ssredniku/przecinka na koncu (pierwsza linia opisu to lead, nie srodtytul);
//     linia pisana WIELKIMI LITERAMI (>= 4 litery, bez malych) jest srodtytulem zawsze, takze z kropka lub dwukropkiem na koncu nie - tylko bez znaku konca zdania;
//  5) lista, w ktorej kazda pozycja ma postac "Klucz: wartosc" (klucz <= 40 znakow), jest oznaczona jako kv (tabelka).
// Uniwersalne dla CRM (nie zalezy od biura).
export type DescBlock =
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; kv: Array<[string, string]> | null }

const BULLET_LINE = /^\s*([*•✔✓–-])\s+(.*\S)\s*$/
const INLINE_BULLET = /\s[*•✔✓]\s+/
const MAX_HEADING_LEN = 80

function isAllCaps(line: string): boolean {
  const letters = line.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, '')
  return letters.length >= 4 && letters === letters.toUpperCase()
}

function cleanItem(s: string): string {
  return s.trim().replace(/[,;]+$/, '').trim()
}

function toKv(items: string[]): Array<[string, string]> | null {
  if (items.length < 2) return null
  const out: Array<[string, string]> = []
  for (const it of items) {
    const m = /^([^:]{2,40}):\s+(.+)$/.exec(it)
    if (!m) return null
    out.push([m[1].trim(), m[2].trim()])
  }
  return out
}

export function parseOfferDescription(raw: string | null | undefined): DescBlock[] {
  const text = String(raw ?? '').replace(/\r\n?/g, '\n')
  if (!text.trim()) return []
  const lines = text.split('\n')
  const blocks: DescBlock[] = []
  let list: string[] | null = null
  let leadUsed = false
  const flushList = () => {
    if (list && list.length) blocks.push({ type: 'list', items: list, kv: toKv(list) })
    list = null
  }
  const pushList = (items: string[]) => {
    if (!list) list = []
    for (const it of items) { const c = cleanItem(it); if (c) list.push(c) }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) { flushList(); continue }

    const b = BULLET_LINE.exec(line)
    if (b) { pushList([b[2]]); continue }

    // znaczniki srodliniowe: tekst przed pierwszym znacznikiem = akapit, reszta = lista ("2 * 3" miedzy cyframi to nie znacznik)
    const guarded = line.replace(/(\d)\s\*\s(\d)/g, '$1\u0000$2')
    if (INLINE_BULLET.test(` ${guarded}`)) {
      const parts = ` ${guarded}`.split(/\s[*•✔✓]\s+/).map(p => p.replace(/\u0000/g, ' * '))
      const head = parts.shift()!.trim()
      if (parts.length >= 2 || (parts.length === 1 && head)) {
        flushList()
        if (head) {
          if (!leadUsed) { blocks.push({ type: 'lead', text: head }); leadUsed = true } else blocks.push({ type: 'paragraph', text: head })
        }
        pushList(parts)
        continue
      }
    }

    flushList()
    const prevBlank = i === 0 || !lines[i - 1].trim()
    const nextBlank = i === lines.length - 1 || !lines[i + 1].trim()
    if (!leadUsed) { blocks.push({ type: 'lead', text: line }); leadUsed = true; continue }
    // (z testu na żywo SEO, Witosa/Polanki) śródtytuł WIELKIMI LITERAMI także gdy tekst zaczyna się w następnej linii (wystarczy pusta linia PRZED);
    // krótka linia-śródtytuł nie może zawierać ':' ani cyfry ("Cena brutto: 950 000 zł", "VAT 23%: ..." to dane, nie śródtytuł).
    if (prevBlank && isAllCaps(line) && line.length <= MAX_HEADING_LEN && !/[.;,]$/.test(line)) {
      blocks.push({ type: 'heading', text: line.replace(/:$/, '') }); continue
    }
    if (prevBlank && nextBlank && line.length <= MAX_HEADING_LEN && !/[.:;,]$/.test(line) && !/[:\d]/.test(line) && !/^[*•✔✓–-]\s/.test(line)) {
      blocks.push({ type: 'heading', text: line }); continue
    }
    blocks.push({ type: 'paragraph', text: line })
  }
  flushList()
  // Srodtytul bez tresci pod spodem (tuz przed kolejnym naglowkiem albo na samym koncu) to zwykly akapit, nie naglowek.
  for (let k = 0; k < blocks.length; k++) {
    const cur = blocks[k]
    if (cur.type === 'heading' && (k === blocks.length - 1 || blocks[k + 1].type === 'heading')) {
      blocks[k] = { type: 'paragraph', text: cur.text }
    }
  }
  return blocks
}

/** Liczba wierszy (przyblizona) do decyzji o zwijaniu w CRM: opisy krotsze nie dostaja przycisku „Pokaz caly opis”. */
export const DESC_COLLAPSE_MIN_CHARS = 700
export function shouldCollapseDescription(raw: string | null | undefined): boolean {
  return String(raw ?? '').length >= DESC_COLLAPSE_MIN_CHARS
}
