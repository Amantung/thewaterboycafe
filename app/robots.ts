import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Generated robots.txt.
 *
 * /_next/image is deliberately NOT disallowed — next/image srcsets point at
 * this endpoint, and blocking it hides every optimised image from Google
 * Images and from the renderer that judges layout stability.
 *
 * /_next/static must stay crawlable too: Googlebot needs the CSS and JS to
 * render the page the way a visitor sees it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
