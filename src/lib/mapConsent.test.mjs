// Uruchomienie: node --test src/lib/mapConsent.test.mjs (Node >= 22.6) albo `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import {
  MAP_CONSENT_KEY, MAP_CONSENT_VERSION, MAP_CONSENT_MAX_AGE_MS,
  isValidMapConsent, readMapConsent, writeMapConsent, clearMapConsent, getMapStorage,
} from './mapConsent.ts'

const NOW = Date.UTC(2026, 9, 18, 12, 0, 0)
const mem = () => {
  const m = new Map()
  return { m, getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => void m.set(k, String(v)), removeItem: k => void m.delete(k) }
}

test('klucz i format zapisu: {"v":1,"ts":<ms>} w localStorage', () => {
  assert.equal(MAP_CONSENT_KEY, 'mapGoogleConsent')
  const s = mem()
  assert.equal(writeMapConsent(s, NOW), true)
  assert.deepEqual(JSON.parse(s.m.get(MAP_CONSENT_KEY)), { v: MAP_CONSENT_VERSION, ts: NOW })
  assert.equal(MAP_CONSENT_VERSION, 1)
})

test('brak zapisanego wyboru => mapa NIE laduje sie sama (false)', () => {
  assert.equal(readMapConsent(mem(), NOW), false)
  assert.equal(readMapConsent(null, NOW), false)
  assert.equal(readMapConsent(undefined, NOW), false)
})

test('wazny zapis => true; zapis w dniu wygasniecia jeszcze wazny', () => {
  const s = mem(); writeMapConsent(s, NOW)
  assert.equal(readMapConsent(s, NOW + 1000), true)
  assert.equal(readMapConsent(s, NOW + MAP_CONSENT_MAX_AGE_MS - 1), true)
  assert.equal(s.m.has(MAP_CONSENT_KEY), true)
})

test('po 12 miesiacach wpis jest ignorowany i USUWANY', () => {
  const s = mem(); writeMapConsent(s, NOW)
  assert.equal(readMapConsent(s, NOW + MAP_CONSENT_MAX_AGE_MS + 1), false)
  assert.equal(s.m.has(MAP_CONSENT_KEY), false)
})

test('smieci / inna wersja / data z przyszlosci => false i usuniecie wpisu', () => {
  for (const bad of ['nie-json', '123', 'null', '{}', '[]', '{"v":2,"ts":' + NOW + '}', '{"v":1,"ts":"x"}', '{"v":1}', '{"v":1,"ts":' + (NOW + 3 * 86400000) + '}']) {
    const s = mem(); s.m.set(MAP_CONSENT_KEY, bad)
    assert.equal(readMapConsent(s, NOW), false, bad)
    assert.equal(s.m.has(MAP_CONSENT_KEY), false, 'usuniety: ' + bad)
  }
  assert.equal(isValidMapConsent(null, NOW), false)
})

test('cofniecie wyboru usuwa wpis; po nim mapa sie nie laduje', () => {
  const s = mem(); writeMapConsent(s, NOW)
  assert.equal(clearMapConsent(s), true)
  assert.equal(s.m.has(MAP_CONSENT_KEY), false)
  assert.equal(readMapConsent(s, NOW + 1), false)
})

test('storage rzuca wyjatki (tryb prywatny / zablokowane dane) albo go brak => bez bledu, zachowanie jak dotad (przycisk)', () => {
  const boom = { getItem() { throw new Error('x') }, setItem() { throw new Error('x') }, removeItem() { throw new Error('x') } }
  assert.equal(readMapConsent(boom, NOW), false)
  assert.equal(writeMapConsent(boom, NOW), false)
  assert.equal(clearMapConsent(boom), false)
  assert.equal(writeMapConsent(null, NOW), false)
  assert.equal(clearMapConsent(null), false)
  const rm = mem(); rm.m.set(MAP_CONSENT_KEY, 'zly'); rm.removeItem = () => { throw new Error('x') }
  assert.equal(readMapConsent(rm, NOW), false)
  assert.equal(getMapStorage(), null) // brak window (Node/SSR)
})

test('nic nie jest wysylane na serwer ani do cookie: modul nie uzywa document.cookie/fetch/sendBeacon/XMLHttpRequest', () => {
  const src = readFileSync(new URL('./mapConsent.ts', import.meta.url), 'utf8')
  for (const w of ['document.cookie', 'fetch(', 'sendBeacon', 'XMLHttpRequest', 'sessionStorage']) assert.equal(src.includes(w), false, w)
})

test('etykieta linku cofniecia w UI jest IDENTYCZNA jak w tekstach polityki (PL i DE)', () => {
  const ui = readFileSync(new URL('../components/ConsentEmbed.tsx', import.meta.url), 'utf8')
  const pl = readFileSync(new URL('../app/rodo/page.tsx', import.meta.url), 'utf8')
  const de = readFileSync(new URL('../app/de/datenschutz/page.tsx', import.meta.url), 'utf8')
  const PL = 'Wyłącz mapę Google / cofnij zgodę'
  const DE = 'Google-Karte deaktivieren / Einwilligung widerrufen'
  assert.ok(ui.includes(`revokeMap: '${PL}'`) && pl.includes(`„${PL}”`))
  assert.ok(ui.includes(`revokeMap: '${DE}'`) && de.includes(`„${DE}“`))
})

// --- Render komponentu (SSR): przed wyborem zadnego iframe/URL Google (zero zadan do Google) ---
test('render komponentu MapEmbed bez zapisanego wyboru: przycisk "Zaladuj mape", BRAK iframe i maps.google.com', async () => {
  const require = createRequire(import.meta.url)
  const ts = require('typescript')
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const dir = mkdtempSync(join(tmpdir(), 'mapembed-'))
  const out = (name, code) => { const p = join(dir, name); writeFileSync(p, code); return p }
  const tr = (file) => ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, jsxImportSource: 'react' } }).outputText
  mkdirSync(join(dir, 'node_modules'), { recursive: true })
  const lib = out('mapConsent.mjs', tr('./mapConsent.ts'))
  const compSrc = tr('../components/ConsentEmbed.tsx')
    .replace("'@/lib/mapConsent'", JSON.stringify(pathToFileURL(lib).href))
    .replace(/from "react\/jsx-runtime"/, 'from ' + JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/from 'react'|from "react"/, 'from ' + JSON.stringify(pathToFileURL(require.resolve('react')).href))
  const comp = out('ConsentEmbed.mjs', compSrc)
  const mod = await import(pathToFileURL(comp).href)
  const MapEmbed = mod.default.default ?? mod.default
  for (const locale of ['pl', 'de']) {
    const html = renderToStaticMarkup(React.createElement(MapEmbed, { query: 'Ratuszowa%2012', zoom: 16, title: 'Mapa', locale, height: 300 }))
    assert.equal(html.includes('<iframe'), false, 'brak iframe przed wyborem')
    assert.equal(html.includes('maps.google.com'), false, 'brak URL osadzenia Google przed wyborem')
    assert.equal(html.includes('<script'), false)
    assert.equal(html.includes('<img'), false)
    assert.match(html, locale === 'pl' ? /Załaduj mapę/ : /Karte laden/)
    assert.equal(html.includes('cofnij zgodę') || html.includes('widerrufen'), false, 'link cofniecia tylko przy zaladowanej mapie')
  }
})
