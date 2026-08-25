import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Generated sitemap, served at /sitemap.xml.
 *
 * `changeFrequency` and `priority` are hints crawlers largely ignore these
 * days, but `lastModified` is still read — it is stamped at build time, so a
 * redeploy after a menu change tells Google the page is worth revisiting.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/menu', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/reviews', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  ]

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
