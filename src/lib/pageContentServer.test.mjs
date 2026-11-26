// Strony serwerowe muszą czytać treści z CRM przez getPageContent (klucz serwerowy + x-tenant-slug).
// Gołe fetch bez nagłówków dostawało HTTP 400 i treści z CRM nie trafiały na stronę.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8')

for (const slug of ['kupno', 'o-nas', 'sprzedaz', 'wynajem', 'zarzadzanie-najmem']) {
  test(`/${slug}: treści z CRM przez getPageContent, tylko po stronie serwera`, () => {
    const src = read(`../app/(pl)/${slug}/page.tsx`)
    assert.ok(src.includes(`getPageContent('${slug}')`))
    assert.ok(!src.includes('/api/public/content/'), 'gołe wywołanie /api/public/content')
    assert.ok(!/^\s*['"]use client['"]/m.test(src), 'strona z kluczem serwerowym nie może być kliencka')
  })
}

test('klucz serwerowy nie ma przedrostka NEXT_PUBLIC_', () => {
  const api = read('./api.ts')
  assert.ok(api.includes('process.env.INTERNAL_SERVICE_API_KEY'))
  assert.ok(!api.includes('NEXT_PUBLIC_INTERNAL'))
})
