// Zgłasza adresy z sitemap do IndexNow (Bing, Yandex, Seznam, Naver; Google nie korzysta z IndexNow).
// Użycie: node scripts/indexnow.mjs            -> wszystkie adresy z sitemap
//         node scripts/indexnow.mjs URL1 URL2  -> tylko wskazane adresy
// Klucz: plik public/<klucz>.txt (musi być dostępny pod https://www.investrent.com.pl/<klucz>.txt).
import { readdirSync } from 'node:fs'

const HOST = 'www.investrent.com.pl'
const KEY = readdirSync('public').find(f => /^[0-9a-f]{32}\.txt$/.test(f))?.replace('.txt', '')
if (!KEY) { console.error('Brak pliku klucza public/<32 hex>.txt'); process.exit(1) }

let urls = process.argv.slice(2)
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
  urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
})
console.log(`IndexNow: ${res.status} ${res.statusText}, adresów: ${urls.length}`)
