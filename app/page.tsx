import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { buildGraph, menuSchema, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'

import { Hero } from '@/components/home/Hero'
import { Marquee } from '@/components/home/Marquee'
import { StoryStrip } from '@/components/home/StoryStrip'
import { SignatureMenu } from '@/components/home/SignatureMenu'
import { Highlights } from '@/components/home/Highlights'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { Reviews } from '@/components/home/Reviews'
import { LocationHours } from '@/components/home/LocationHours'

export const metadata: Metadata = {
  title: `${site.name} — Cosy Beachside Cafe in Cowes, Phillip Island`,
  description: site.description,
  alternates: { canonical: '/' },
}

/**
 * Homepage.
 *
 * Server component throughout — only the hero parallax, the review carousel
 * and the gallery lightbox opt into the client, so the JavaScript that ships
 * above the fold is close to nothing.
 *
 * Section order is deliberate: hook, credibility, product, differentiators,
 * atmosphere, social proof, then the practical details someone needs to
 * actually turn up.
 */
export default function HomePage() {
  const graph = buildGraph(menuSchema(), breadcrumbSchema([]))

  return (
    <>
      <Hero />
      <Marquee />
      <StoryStrip />
      <SignatureMenu />
      <Highlights />
      <GalleryPreview />
      <Reviews />
      <LocationHours />

      <JsonLd id="schema-home" data={graph} />
    </>
  )
}
