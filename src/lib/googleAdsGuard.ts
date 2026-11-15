// Tryb podstawowy Consent Mode dla tagu Google Ads (decyzja Daniela 15.11.2026, rekomendacja Prawnika: RODO art. 5 ust. 1 lit. b, art. 7 ust. 3).
// Czysta logika BEZ importów Next/React - testowalna przez `node --test` (googleAdsGuard.test.mjs).
//
// Problem: tag Google strumienia GA4 (gtag/js?id=G-...) niesie cel Ads (AW-...) z powiązania GA4<->Google Ads
// (w pliku gtag.js: __ccd_ga_ads_link, __dest_aw). Przy ad_storage='denied' Google wysyła wtedy bezciasteczkowe pingi
// (pagead2.googlesyndication.com/ccm/collect, gcs=G101, npa=1) = tryb ZAAWANSOWANY. Chcemy tryb PODSTAWOWY:
// dopóki użytkownik nie udzielił zgody Reklamowej, żadne żądanie do domen reklamowych Google nie może wyjść.
// Powiązania GA4<->Ads NIE odłączamy (import zdarzeń GA4 do Ads działa po stronie Google, bez udziału przeglądarki).
//
// Flaga: NEXT_PUBLIC_GOOGLE_ADS_PING_GUARD - 'off' wyłącza straznika (cofnięcie); brak/inna wartość = straznik aktywny.

/** Hosty reklamowe Google, do których nie wolno nic wysyłać bez zgody Reklamowe. */
export const GOOGLE_ADS_HOST_SOURCE = '(^|\\.)(googlesyndication\\.com|googleadservices\\.com|doubleclick\\.net)$'
/** google.<tld>/ccm/... i google.<tld>/pagead/... (pingi zgodowe i konwersyjne na domenie google). */
export const GOOGLE_PAGE_HOST_SOURCE = '^(www\\.)?google\\.[a-z.]+$'
export const GOOGLE_PAGE_PATH_SOURCE = '^/(ccm|pagead)/'

export const GOOGLE_ADS_PING_GUARD_ENABLED: boolean = process.env.NEXT_PUBLIC_GOOGLE_ADS_PING_GUARD !== 'off'

/** true = adres należy do reklamowej części Google (do zablokowania bez zgody Reklamowe). Nigdy nie rzuca. */
export function isGoogleAdsRequestUrl(url: unknown, base: string = 'https://www.investrent.com.pl/'): boolean {
  try {
    const raw = typeof url === 'string' ? url : url && typeof (url as { url?: unknown }).url === 'string' ? (url as { url: string }).url : String(url)
    const u = new URL(raw, base)
    if (new RegExp(GOOGLE_ADS_HOST_SOURCE, 'i').test(u.hostname)) return true
    if (new RegExp(GOOGLE_PAGE_HOST_SOURCE, 'i').test(u.hostname) && new RegExp(GOOGLE_PAGE_PATH_SOURCE).test(u.pathname)) return true
    return false
  } catch {
    return false
  }
}

/**
 * Kod wstrzykiwany PRZED skryptem gtag (inline). Dopóki window.__irAdsAllowed !== true, odrzuca żądania do hostów reklamowych Google
 * przez sendBeacon, fetch, XMLHttpRequest oraz ustawianie src/href (img, script, iframe, link). Po zgodzie Reklamowe
 * (window.__irAdsAllowed = true, ustawiane z consent) przepuszcza. Idempotentny (window.__irAdsGuard).
 */
export const GOOGLE_ADS_GUARD_SNIPPET = `(function(){
if(window.__irAdsGuard)return;window.__irAdsGuard=1;
var HS=new RegExp(${JSON.stringify(GOOGLE_ADS_HOST_SOURCE)},'i'),PH=new RegExp(${JSON.stringify(GOOGLE_PAGE_HOST_SOURCE)},'i'),PP=new RegExp(${JSON.stringify(GOOGLE_PAGE_PATH_SOURCE)});
function bad(u){try{var raw=(u&&typeof u==='object'&&typeof u.url==='string')?u.url:String(u);var x=new URL(raw,location.href);return HS.test(x.hostname)||(PH.test(x.hostname)&&PP.test(x.pathname))}catch(e){return false}}
function blocked(u){return window.__irAdsAllowed!==true&&bad(u)}
var sb=navigator.sendBeacon;if(sb){navigator.sendBeacon=function(u){if(blocked(u))return true;return sb.apply(navigator,arguments)}}
var ft=window.fetch;if(ft){window.fetch=function(i){if(blocked(i))return Promise.resolve(new Response(null,{status:204}));return ft.apply(this,arguments)}}
var xo=XMLHttpRequest.prototype.open,xs=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open=function(m,u){this.__irB=blocked(u);return xo.apply(this,arguments)};
XMLHttpRequest.prototype.send=function(){if(this.__irB)return;return xs.apply(this,arguments)};
function guardProp(proto,prop){var d=Object.getOwnPropertyDescriptor(proto,prop);if(!d||!d.set)return;
Object.defineProperty(proto,prop,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){if(blocked(v))return;d.set.call(this,v)}})}
guardProp(HTMLImageElement.prototype,'src');guardProp(HTMLScriptElement.prototype,'src');guardProp(HTMLIFrameElement.prototype,'src');guardProp(HTMLLinkElement.prototype,'href');
var sa=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(n,v){if((n==='src'||n==='href')&&blocked(v)&&/^(IMG|SCRIPT|IFRAME|LINK)$/.test(this.tagName))return;return sa.apply(this,arguments)};
})();`
