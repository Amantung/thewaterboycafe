import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { buildGraph, menuSchema, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'

import { Hero } from '@/components/home/Hero'
import { Marquee } from '@/components/home/Marquee'
import { StoryStrip } from '@/components/home/StoryStrip'
import { SignatureMenu } from '@/components/home/SignatureMenu'
import { Reviews } from '@/components/home/Reviews'
import { Highlights } from '@/components/home/Highlights'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { InstagramSection } from '@/components/home/InstagramSection'
import { LocationHours } from '@/components/home/LocationHours'

export const metadata: Metadata = {
  title: `${site.name} — Cosy Beachside Cafe in Cowes, Phillip Island`,
  description: site.description,
  alternates: { canonical: '/' },
}

/**
 * Homepage.
 *
 * The sequence is a tonal argument as much as a content one, and the two are
 * set against each other deliberately:
 *
 *   Hero          dark    photograph — the opening statement
 *   Marquee       dark    carries the dark one more beat, on oversized type
 *   Story    01   linen   the page opens into light
 *   Menu     02   cream   a warmer light; the product
 *   Why us   03   dark    the pause — the brand at its loudest
 *   Gallery  04   linen   back to light, and quiet: the world of the cafe
 *   Instagram 05  cream   the daily life of the cafe, travelling
 *   Reviews  06   sand    corroboration, in the guests' own words
 *   Visit    07   cream   the practical part, and the map
 *   Footer        dark    the sign-off
 *
 * The running numbers must match this order — they are the device that ties
 * eight very different layouts into one document, so an index that disagrees
 * with the page is worse than no index at all. They are passed from here
 * rather than hardcoded in each section wherever the section is reused on
 * another page (`Highlights` on /about, `LocationHours` on /menu and
 * /contact), because the sequence is a property of this page, not of them.
 *
 * Server components throughout except where an interaction genuinely needs
 * the client: the hero's scroll response, the menu's hover preview, the
 * gallery's lightbox, and the shared scroll-reveal primitives.
 */
export default function HomePage() {
  const graph = buildGraph(menuSchema(), breadcrumbSchema([]))

  return (
    <>
      <Hero />
      <Marquee />
      <StoryStrip />
      <SignatureMenu />
      <Highlights index={3} />
      <GalleryPreview />
      <InstagramSection index={5} />
      <Reviews />
      <LocationHours index={7} />

      <JsonLd id="schema-home" data={graph} />
    </>
  )
}
