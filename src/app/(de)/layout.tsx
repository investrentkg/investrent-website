import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import ConsentManager from '@/components/ConsentManager'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import AttributionCapture from '@/components/AttributionCapture'
import '../globals.css'

// Fonty self-hostowane (src/fonts, licencja OFL): build NIE pobiera CSS z Google Fonts (patrz (pl)/layout.tsx).
const montserrat = localFont({
  src: [{ path: '../../fonts/Montserrat-latin-ext-VF.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = localFont({
  src: [{ path: '../../fonts/Inter-latin-ext-VF.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.investrent.com.pl'),
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  verification: { google: 'DPbWw1Vt5Jf3CsaKHwQUJNbde9eieF0VuieK2S1BICs' },
  openGraph: { locale: 'de_DE', siteName: 'InvestRent' },
}

export default function GermanRootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="de" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <AttributionCapture />
        <div className="page-wrap">{children}</div>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <ConsentManager />
      </body>
    </html>
  )
}
