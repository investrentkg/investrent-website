// Parser opisu oferty na stronie WWW (layout czytelny, BEZ zwijania: pelny tekst zawsze w HTML).
// Czysta funkcja, bez zaleznosci. Tresc nie jest zmieniana: znika tylko znacznik listy (* / • / - ).

export type DescBlock =
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

const BULLET_LINE = /^\s*(?:[*•✔✓✅►▪]\s*|[-–]\s+)(?=\S)/
const MAX_HEADING_CHARS = 70
const MAX_HEADING_WORDS = 7

function isCapsHeading(line: string): boolean {
  const t = line.trim().replace(/:$/, '')
  if (t.length < 3 || t.length > 80) return false
  const letters = t.match(/\p{L}/gu) ?? []
  if (letters.length < 3) return false
  return !/\p{Ll}/u.test(t)
}

// Dzieli linie po znacznikach listy takze w srodku linii (" * ", " • "), z wyjatkiem "2 * 3" (cyfry po obu stronach).
function splitInlineBullets(line: string): { head: string; items: string[] } {
  const re = /(^|\s)([*•])\s+(?=\S)/g
  const cuts: { start: number; end: number }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    const start = m.index
    const end = m.index + m[0].length
    const before = line.slice(0, start).trimEnd().slice(-1)
    const after = line.slice(end, end + 1)
    if (/\d/.test(before) && /\d/.test(after)) continue
    cuts.push({ start, end })
  }
  if (!cuts.length) return { head: line.trim(), items: [] }
  const head = line.slice(0, cuts[0].start).trim()
  const items: string[] = []
  cuts.forEach((c, i) => {
    const next = i + 1 < cuts.length ? cuts[i + 1].start : line.length
    const t = line.slice(c.end, next).trim()
    if (t) items.push(t)
  })
  return { head, items }
}

function looksLikeShortHeading(text: string): boolean {
  const t = text.trim()
  if (!t || t.length > MAX_HEADING_CHARS) return false
  if (/[.!?:;,]$/.test(t)) return false
  if (/[:\d]/.test(t)) return false // ceny, parametry, pary klucz: wartosc nie sa srodtytulami
  return t.split(/\s+/).length <= MAX_HEADING_WORDS
}

export function parseOfferDescription(raw: string): DescBlock[] {
  const blocks: DescBlock[] = []
  const pushItems = (items: string[]) => {
    if (!items.length) return
    const last = blocks[blocks.length - 1]
    if (last && last.type === 'list') last.items.push(...items)
    else blocks.push({ type: 'list', items: [...items] })
  }
  const lines = raw.replace(/\r\n?/g, '\n').split('\n')
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li].trim()
    const prevBlank = li > 0 && !lines[li - 1].trim()
    const nextLine = (lines[li + 1] ?? '').trim()
    const nextIsBreak = !nextLine || BULLET_LINE.test(nextLine)
    if (!line) { blocks.push({ type: 'paragraph', text: '' }); continue } // znacznik odstepu, usuwany nizej
    if (isCapsHeading(line)) { blocks.push({ type: 'heading', text: line }); continue }
    // Samodzielna krotka linia miedzy pustymi liniami (lub przed lista), bez kropki na koncu = srodtytul (nie pierwsza linia).
    if (li > 0 && prevBlank && nextIsBreak && !BULLET_LINE.test(line) && looksLikeShortHeading(line)) { blocks.push({ type: 'heading', text: line }); continue }
    const lineBullet = BULLET_LINE.test(line)
    const body = lineBullet ? line.replace(BULLET_LINE, '') : line
    const { head, items } = splitInlineBullets(lineBullet ? '* ' + body : body)
    if (head) {
      if (items.length && looksLikeShortHeading(head)) blocks.push({ type: 'heading', text: head })
      else blocks.push({ type: 'paragraph', text: head })
    }
    pushItems(items)
    if (!items.length && lineBullet) pushItems([body])
  }
  const out = blocks.filter(b => !(b.type === 'paragraph' && b.text === ''))
  // pierwszy blok tekstowy (akapit) = lead
  const first = out[0]
  if (first && first.type === 'paragraph') out[0] = { type: 'lead', text: first.text }
  return out
}

// Do testu "tresc bez zmian": tekst z blokow bez znacznikow list i bialych znakow.
export function normalizeForCompare(s: string): string {
  return s.replace(/(^|\s)[*•✔✓✅►▪]\s*/g, ' ').replace(/(^|\s)[-–]\s+/g, ' ').replace(/\s+/g, ' ').trim()
}
export function blocksToText(blocks: DescBlock[]): string {
  return blocks.map(b => (b.type === 'list' ? b.items.join(' ') : b.text)).join(' ')
}
