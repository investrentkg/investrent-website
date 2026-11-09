import test from 'node:test'
import assert from 'node:assert/strict'
import { sortTeam, TEAM_ORDER_IDS } from './teamOrder.ts'

const mk = (id, full_name) => ({ id, full_name })
const known = TEAM_ORDER_IDS.map((id, i) => mk(id, 'K' + i))
const extra = [mk('zzz', 'Ala'), mk('aaa', 'Ala'), mk('mmm', 'Zofia')]

function perms(a) { return a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])) }

test('kolejnosc zgodna z lista, nieznani na koncu po imieniu i id', () => {
  const out = sortTeam([...extra, ...known].reverse()).map(m => m.id)
  assert.deepEqual(out, [...TEAM_ORDER_IDS, 'aaa', 'zzz', 'mmm'])
})
test('determinizm: ta sama kolejnosc dla roznych permutacji wejscia', () => {
  const base = sortTeam([...known.slice(0, 4), ...extra]).map(m => m.id)
  for (const p of perms([...known.slice(0, 4), ...extra])) assert.deepEqual(sortTeam(p).map(m => m.id), base)
  const shuffled = [...known, ...extra].sort(() => Math.random() - 0.5)
  assert.deepEqual(sortTeam(shuffled).map(m => m.id), sortTeam([...known, ...extra]).map(m => m.id))
})
test('nie mutuje wejscia', () => {
  const inp = [...known].reverse(); const copy = inp.map(m => m.id)
  sortTeam(inp); assert.deepEqual(inp.map(m => m.id), copy)
})
