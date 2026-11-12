// Jedno miejsce prawdy dla zdarzen pomiarowych lejka kalkulatora /wycena (flaga NEXT_PUBLIC_WYCENA_FUNNEL_EVENTS_V2, domyslnie OFF).
// Etapy: view (ekran 1) -> start (pierwsze pole formularza) -> result (wynik wyswietlony) -> lead (zapis kontaktu).
// Kazdy etap ma mape na trzy kanaly: licznik lejka CRM (funnel), GA4 (ga4) i Meta (meta).
// Funkcja jest CZYSTA (nic nie wysyla): zwraca plan, a wykonawca (WycenaClient) wywoluje sendFunnelStep / trackValuation / fbq.
//
// Zasady Meta (Housing / Special Ad Category): zdarzenia Meta niosa WYLACZNIE etap i wariant testu A/B z bialej listy.
// Zadnych danych osobowych, adresu, ceny, metrazu ani wyniku wyceny. Wariant spoza bialej listy jest pomijany (nie naprawiany).
// Custom events (trackCustom) nie maja eventID: nie sa parowane z CAPI, wiec nie wymagaja deduplikacji.
// Standardowy Lead zachowuje istniejacy eventID wyc_<uuid> (dedup z Lead CAPI); tu dochodzi tylko custom_data z wariantem.
import type { FunnelStep } from './funnel.ts'

export type FunnelStage = 'view' | 'start' | 'result' | 'lead'
export type ResultKind = 'range' | 'no_numbers'

export type MetaEventSpec =
  | { kind: 'custom'; name: 'WycenaStart' | 'WycenaWynik' }
  | { kind: 'standard'; name: 'Lead' }

export type StageSpec = {
  /** Krok licznika CRM (POST /api/public/valuation/funnel-step). */
  funnel: FunnelStep
  /** Nazwa zdarzenia GA4 (null = brak zdarzenia GA4 dla etapu; dla result zalezy od rodzaju wyniku). */
  ga4: string | { range: string; no_numbers: string } | null
  /** Zdarzenie Meta (null = brak; ekran 1 pokrywa PageView z WycenaMetaPixel). */
  meta: MetaEventSpec | null
}

export const FUNNEL_STAGE_MAP: Readonly<Record<FunnelStage, StageSpec>> = {
  view: { funnel: 'entry', ga4: 'wycena_view', meta: null },
  start: { funnel: 'start', ga4: null, meta: { kind: 'custom', name: 'WycenaStart' } },
  result: { funnel: 'valuation', ga4: { range: 'wycena_estimate_success', no_numbers: 'wycena_estimate_no_numbers' }, meta: { kind: 'custom', name: 'WycenaWynik' } },
  lead: { funnel: 'submit', ga4: 'wycena_lead', meta: { kind: 'standard', name: 'Lead' } },
}

/** Biala lista wartosci wariantu (makieta E1i i wynik v2 z PR #164); wszystko inne jest pomijane. */
export const SCREEN1_VARIANTS = ['ekran1_2pola', 'ekran1_4pola'] as const
export const RESULT_VARIANTS = ['wynik_v1', 'wynik_v2'] as const

export type MetaVariantParams = { screen1_variant?: string; result_variant?: string }

/**
 * Rozbija wariant licznika (np. "ekran1_4pola.wynik_v2", "wynik_v1", "phone_block", "") na parametry Meta.
 * Zwraca tylko wartosci z bialej listy; "phone_block" i nieznane kody nie trafiaja do Meta.
 */
export function metaVariantParams(variant: string | undefined | null): MetaVariantParams {
  const out: MetaVariantParams = {}
  if (typeof variant !== 'string' || variant.length > 32) return out
  for (const part of variant.split('.')) {
    if ((SCREEN1_VARIANTS as readonly string[]).includes(part)) out.screen1_variant = part
    else if ((RESULT_VARIANTS as readonly string[]).includes(part)) out.result_variant = part
  }
  return out
}

export type FunnelPlanInput = {
  /** Wartosc flagi NEXT_PUBLIC_WYCENA_FUNNEL_EVENTS_V2. */
  enabled: boolean
  /** Zgoda kategorii Reklamowe (Marketing); bez niej plan nie zawiera zdarzenia Meta. */
  adsConsent: boolean
  /** Wariant licznika w postaci jak dzis (np. "ekran1_4pola.wynik_v2"). */
  variant?: string
  /** Rodzaj wyniku; dotyczy etapu result (GA4). */
  resultKind?: ResultKind
}

export type FunnelPlan = {
  funnel: { step: FunnelStep; variant?: string }
  ga4: { event: string; params: Record<string, string> } | null
  meta: { method: 'track' | 'trackCustom'; name: string; params: MetaVariantParams } | null
}

/**
 * Plan wykonania etapu. Flaga OFF = dokladnie dzisiejsze zachowanie (licznik + GA4 bez nowych parametrow, ZERO Meta).
 * Flaga ON = to samo + wariant w parametrach GA4 + zdarzenie Meta (custom dla start/result, Lead dla lead) po zgodzie Reklamowych.
 * Etap view nigdy nie ma Meta (jest PageView); Lead jest wysylany osobno (z eventID) wywolaniem trackWycenaMetaLead, tu tylko dla spojnosci mapy.
 */
export function planFunnelEvent(stage: FunnelStage, input: FunnelPlanInput): FunnelPlan {
  const spec = FUNNEL_STAGE_MAP[stage]
  const funnel = { step: spec.funnel, ...(input.variant ? { variant: input.variant } : {}) }
  const ga4Name = spec.ga4 === null ? null : typeof spec.ga4 === 'string' ? spec.ga4 : spec.ga4[input.resultKind ?? 'range']
  const params = input.enabled ? metaVariantParams(input.variant) : {}
  const ga4 = ga4Name ? { event: ga4Name, params: { ...params } as Record<string, string> } : null
  const meta = input.enabled && input.adsConsent && spec.meta
    ? { method: spec.meta.kind === 'custom' ? 'trackCustom' as const : 'track' as const, name: spec.meta.name, params }
    : null
  return { funnel, ga4, meta }
}
