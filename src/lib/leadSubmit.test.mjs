// Uruchom: node --test src/lib/leadSubmit.test.mjs   (Node >= 22.6, natywne strip-types)
import test from 'node:test'
import assert from 'node:assert/strict'
import { postLead, trackLeadSuccess } from './leadSubmit.ts'

const json = (body, status = 200) => async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

test('sukces: 200 + {ok:true}', async () => {
  assert.deepEqual(await postLead('http://x', { a: 1 }, { fetchImpl: json({ ok: true }) }), { ok: true })
})
test('200 bez ok:true -> rejected', async () => {
  const r = await postLead('http://x', {}, { fetchImpl: json({ error: 'x' }) })
  assert.equal(r.ok, false); assert.equal(r.reason, 'rejected')
})
test('400 JSON -> http', async () => {
  const r = await postLead('http://x', {}, { fetchImpl: json({ error: 'bad' }, 400) })
  assert.equal(r.ok, false); assert.equal(r.reason, 'http'); assert.equal(r.status, 400)
})
test('502 z HTML -> http, bez wyjatku', async () => {
  const r = await postLead('http://x', {}, { fetchImpl: async () => new Response('<html>Bad Gateway</html>', { status: 502 }) })
  assert.equal(r.ok, false); assert.equal(r.reason, 'http'); assert.equal(r.status, 502)
})
test('200 z HTML -> invalid_response', async () => {
  const r = await postLead('http://x', {}, { fetchImpl: async () => new Response('<html></html>', { status: 200 }) })
  assert.equal(r.ok, false); assert.equal(r.reason, 'invalid_response')
})
test('siec padla -> network', async () => {
  const r = await postLead('http://x', {}, { fetchImpl: async () => { throw new TypeError('Failed to fetch') } })
  assert.equal(r.ok, false); assert.equal(r.reason, 'network')
})
test('timeout -> timeout', async () => {
  const hang = (u, init) => new Promise((_, rej) => init.signal.addEventListener('abort', () => rej(new DOMException('aborted', 'AbortError'))))
  const r = await postLead('http://x', {}, { fetchImpl: hang, timeoutMs: 30 })
  assert.equal(r.ok, false); assert.equal(r.reason, 'timeout')
})
test('GA: no-op bez gtag; event tylko z lead_source (bez danych osobowych)', () => {
  globalThis.window = {}
  trackLeadSuccess('wycena_modal')
  const calls = []
  globalThis.window = { gtag: (...a) => calls.push(a) }
  trackLeadSuccess('wycena_modal')
  assert.deepEqual(calls, [['event', 'generate_lead', { lead_source: 'wycena_modal' }]])
  delete globalThis.window
})
