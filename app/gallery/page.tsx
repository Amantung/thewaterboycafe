import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { GALLERY_PHOTOS } from '@/components/gallery/photos'
import { InstagramSection } from '@/components/home/InstagramSection'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { GalleryPreview } from '@/components/home/GalleryPreview'

export const metadata: Metadata = {
  title: 'Gallery',
  description: `Inside ${site.name} — the courtyard, the cabinet, the coffee and the Cowes foreshore a few minutes down the road on Phillip Island.`,
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: `Gallery · ${site.name}`,
    description:
      'A look around our beachside cafe in Cowes — courtyard seating, the pastry cabinet, and mornings on Western Port Bay.',
    url: '/gallery',
  },
}

export default function GalleryPage() {
  const graph = buildGraph(breadcrumbSchema([{ name: 'Gallery', path: '/gallery' }]))

  return (
    <>
      <PageHeader
        eyebrow="Around the cafe"
        title={['The little moments', { text: 'make the place.', accent: true }]}
        description="The room, the courtyard, the cabinet before it empties, and the bay that makes people stay an extra half hour."
        imageSrc="/images/gallery-outdoor-courtyard-seating.jpg"
        imageAlt="Guests at outdoor cafe tables under a canvas umbrella, shaded by gum trees"
      >
        <Button href={site.socials.instagram} variant="onDarkOutline">
          <span className="flex items-center gap-2">
              <Icon name="instagram" className="h-4 w-4" />
            Follow {site.socials.instagramHandle}
          </span>
        </Button> 
      </PageHeader>

      <GalleryPreview />
      <Section className="bg-linen" aria-labelledby="gallery-wall-heading">
        <SectionHeading
          id="gallery-wall-heading"
          eyebrow="The full set"
          title="Every corner of the place"
          description={`${GALLERY_PHOTOS.length} photographs taken across ordinary weeks — no styling, no props, nothing we do not serve.`}
          size="xl"
          className="mb-14 sm:mb-16"
        />

        <GalleryGrid images={GALLERY_PHOTOS} />

        <Reveal delay={0.1}>
          <p className="u-micro mt-12 text-center text-coffee-soft/70">
            Tap any image to open it · Arrow keys to move · Escape to close
          </p>
        </Reveal>
      </Section>

      <InstagramSection />

      <JsonLd id="schema-gallery" data={graph} />
    </>
  )
}
