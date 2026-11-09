// Skraca tekst do max znakow na granicy slowa (bez ciecia w pol slowa i bez wiszacej interpunkcji
// przed wielokropkiem). Tekst krotszy lub rowny limitowi zwracany bez zmian.
export function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  // spacja tuz za limitem = cut konczy sie pelnym slowem
  const wholeWord = /\s/.test(text.charAt(max))
  const base = wholeWord ? cut : cut.replace(/\s+\S*$/, '')
  const trimmed = (base || cut).replace(/[\s.,;:!?\-–—]+$/, '')
  return trimmed + '…'
}
