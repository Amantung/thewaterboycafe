import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Generated robots.txt.
 *
 * Two things deliberately NOT disallowed, both of which are common own goals:
 *
 *   • /reserve — it is noindex via its page metadata. Disallowing it here as
 *     well would stop crawlers fetching the page at all, so they would never
 *     see the noindex, and the bare URL could still get indexed from inbound
 *     links. Crawlable + noindex is the combination that actually works.
 *
 *   • /_next/image — next/image srcsets point at this endpoint. Blocking it
 *     hides every optimised image from Google Images and from the renderer
 *     that judges layout stability.
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
