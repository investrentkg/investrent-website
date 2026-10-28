export type PixelTrack = (event: 'Lead', options: { eventID: string }) => void

export function trackConsentedWycenaLead(input: {
  enabled: boolean
  marketingConsent: boolean
  pixelAvailable: boolean
  eventId: string
  track: PixelTrack
}): boolean {
  if (!input.enabled || !input.marketingConsent || !input.pixelAvailable || !/^[A-Za-z0-9_-]{16,128}$/.test(input.eventId)) return false
  try { input.track('Lead', { eventID: input.eventId }); return true } catch { return false }
}
