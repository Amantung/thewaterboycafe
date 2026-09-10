import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Poppins } from 'next/font/google'

import './globals.css'
import { site, SITE_URL, ogImage } from '@/lib/site'
import { buildGraph, cafeSchema, websiteSchema } from '@/lib/schema'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

/**
 * The site uses exactly two faces and nothing else. Both are self-hosted by
 * next/font at build time: no render-blocking request to fonts.googleapis.com,
 * no layout shift (fallback metrics are matched automatically), and
 * `display: swap` so text is readable during the swap period. Each is exposed
 * as a CSS variable that @theme in globals.css reads, so a component never
 * names a font family directly.
 */
 
const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif-display', 
  preload: true,
})
 
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), 
  title: {
    default: `${site.name} — Cosy Beachside Cafe in Cowes, Phillip Island`, 
    template: `%s · ${site.name}`,
  },
  description: site.description, 
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  generator: 'Next.js',

  keywords: [
    'cafe Cowes',
    'Phillip Island cafe',
    'breakfast Phillip Island',
    'brunch Cowes',
    'best coffee Phillip Island',
    'dog friendly cafe Cowes',
    'Five Senses Coffee Phillip Island',
    'beachside cafe Victoria',
  ],

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — Cosy Beachside Cafe in Cowes, Phillip Island`,
    description: site.description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Cosy Beachside Cafe in Cowes`,
    description: site.description,
    images: [ogImage.src],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  }, 
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'Bf1cGy1H1Sv0hvxgol4S40BuYbPxJvmm7oW9SzbWzO8',
  },

  category: 'restaurant',
  formatDetection: { telephone: true, address: true, email: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1, 
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f0eb' },
    { media: '(prefers-color-scheme: dark)', color: '#2a211f' },
  ],
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) { 
  const graph = buildGraph(cafeSchema(), websiteSchema())

  return (
    <html lang="en-AU" className={`${dmSerifDisplay.variable} ${poppins.variable}`}>
      <head>
        {/* The only third-party origin the page ever requests from is the
            lazy-loaded Google Maps embed on /contact and the homepage — it
            resolves against google.com, not maps.googleapis.com (there is no
            API key, see mapEmbedUrl in lib/site.ts), so that is the one
            origin worth a hint here. */}
        <link rel="preconnect" href="https://www.google.com" />
      </head>

      <body className="min-h-screen antialiased"> 
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-coffee focus:px-6 focus:py-3 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main">{children}</main>

        <Footer />

        <JsonLd id="schema-site" data={graph} />
      </body>
    </html>
  )
}
