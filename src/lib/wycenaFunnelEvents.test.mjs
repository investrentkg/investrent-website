import test from 'node:test'
import assert from 'node:assert/strict'
import { FUNNEL_STAGE_MAP, metaVariantParams, planFunnelEvent } from './wycenaFunnelEvents.ts'
import { trackConsentedWycenaLead } from './wycenaMetaPixel.ts'

const on = { enabled: true, adsConsent: true }

test('mapa etapow: view -> start -> result -> lead na trzech kanalach', () => {
  assert.deepEqual(Object.keys(FUNNEL_STAGE_MAP), ['view', 'start', 'result', 'lead'])
  assert.equal(FUNNEL_STAGE_MAP.view.funnel, 'entry')
  assert.equal(FUNNEL_STAGE_MAP.view.meta, null)
  assert.equal(FUNNEL_STAGE_MAP.start.funnel, 'start')
  assert.equal(FUNNEL_STAGE_MAP.result.funnel, 'valuation')
  assert.equal(FUNNEL_STAGE_MAP.lead.funnel, 'submit')
  assert.deepEqual(FUNNEL_STAGE_MAP.lead.meta, { kind: 'standard', name: 'Lead' })
})

test('flaga OFF: dokladnie dzisiejsze zachowanie, zero Meta, zero nowych parametrow GA4', () => {
  for (const stage of ['view', 'start', 'result', 'lead']) {
    const plan = planFunnelEvent(stage, { enabled: false, adsConsent: true, variant: 'ekran1_4pola.wynik_v2', resultKind: 'range' })
    assert.equal(plan.meta, null)
    assert.deepEqual(plan.ga4 ? plan.ga4.params : {}, {})
    assert.equal(plan.funnel.step, FUNNEL_STAGE_MAP[stage].funnel)
    assert.equal(plan.funnel.variant, 'ekran1_4pola.wynik_v2')
  }
})

test('flaga ON bez zgody Reklamowych: brak Meta, licznik i GA4 dzialaja', () => {
  const plan = planFunnelEvent('start', { enabled: true, adsConsent: false, variant: 'ekran1_2pola' })
  assert.equal(plan.meta, null)
  assert.equal(plan.funnel.step, 'start')
})

test('flaga ON + zgoda: custom events start i wynik z wariantem, bez PII', () => {
  const start = planFunnelEvent('start', { ...on, variant: 'ekran1_4pola.wynik_v2' })
  assert.deepEqual(start.meta, { method: 'trackCustom', name: 'WycenaStart', params: { screen1_variant: 'ekran1_4pola', result_variant: 'wynik_v2' } })
  const result = planFunnelEvent('result', { ...on, variant: 'ekran1_2pola.wynik_v1', resultKind: 'no_numbers' })
  assert.deepEqual(result.meta, { method: 'trackCustom', name: 'WycenaWynik', params: { screen1_variant: 'ekran1_2pola', result_variant: 'wynik_v1' } })
  assert.equal(result.ga4.event, 'wycena_estimate_no_numbers')
  assert.equal(planFunnelEvent('result', { ...on, resultKind: 'range' }).ga4.event, 'wycena_estimate_success')
  const keys = new Set([...Object.keys(start.meta.params), ...Object.keys(result.meta.params)])
  assert.deepEqual([...keys].sort(), ['result_variant', 'screen1_variant'])
})

test('etap view nigdy nie ma Meta (jest PageView); custom events bez eventID', () => {
  assert.equal(planFunnelEvent('view', { ...on, variant: 'ekran1_2pola' }).meta, null)
  const plan = planFunnelEvent('start', on)
  assert.equal('eventID' in plan.meta, false)
  assert.equal(plan.meta.method, 'trackCustom')
})

test('metaVariantParams: biala lista, nieznane kody i phone_block pomijane', () => {
  assert.deepEqual(metaVariantParams('ekran1_4pola.wynik_v2'), { screen1_variant: 'ekran1_4pola', result_variant: 'wynik_v2' })
  assert.deepEqual(metaVariantParams('wynik_v1'), { result_variant: 'wynik_v1' })
  assert.deepEqual(metaVariantParams('phone_block'), {})
  assert.deepEqual(metaVariantParams(''), {})
  assert.deepEqual(metaVariantParams(undefined), {})
  assert.deepEqual(metaVariantParams('jan.kowalski@x.pl'), {})
  assert.deepEqual(metaVariantParams('ekran1_4pola.' + 'x'.repeat(40)), {})
})

test('Lead zachowuje eventID; custom_data z wariantem tylko gdy podane', () => {
  const calls = []
  const base = { enabled: true, marketingConsent: true, pixelAvailable: true, eventId: 'wyc_1234567890abcdef', track: (...a) => calls.push(a) }
  assert.equal(trackConsentedWycenaLead(base), true)
  assert.deepEqual(calls[0], ['Lead', { eventID: 'wyc_1234567890abcdef' }])
  assert.equal(trackConsentedWycenaLead({ ...base, params: { screen1_variant: 'ekran1_4pola' } }), true)
  assert.deepEqual(calls[1], ['Lead', { eventID: 'wyc_1234567890abcdef' }, { screen1_variant: 'ekran1_4pola' }])
  assert.equal(trackConsentedWycenaLead({ ...base, params: {} }), true)
  assert.equal(calls[2].length, 2)
})
