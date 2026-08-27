import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { buildGraph, menuSchema, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'

import { Hero } from '@/components/home/Hero'
import { Welcome } from '@/components/home/Welcome'
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

/** Homepage.**/
export default function HomePage() {
  const graph = buildGraph(menuSchema(), breadcrumbSchema([]))

  return (
    <>
      <Hero />
      <Welcome />
      {/* <StoryStrip /> */}
      <SignatureMenu />
      {/* <Highlights /> */}
      {/* <GalleryPreview /> */}
      {/* <InstagramSection  />
      <Reviews /> */}
      {/* <LocationHours  /> */}

      <JsonLd id="schema-home" data={graph} />
    </>
  )
}
