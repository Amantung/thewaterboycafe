import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * Generated web app manifest, served at /manifest.webmanifest.
 *
 * The icons already exist for the favicon/apple-touch-icon set in
 * app/layout.tsx (see scripts/build-logo.mjs) — this just describes the same
 * 192/512 pair for Android's install prompt and home-screen icon so the site
 * doesn't fail the "Web App Manifest" checks that Lighthouse and Chrome's
 * installability criteria look for.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f0eb',
    theme_color: '#f2f0eb',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
