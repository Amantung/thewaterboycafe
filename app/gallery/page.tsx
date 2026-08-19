import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { galleryImages } from '@/lib/data/images'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

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
        title="A look around"
        description="The room, the courtyard, the cabinet before it empties, and the bay that makes people stay an extra half hour."
        breadcrumbs={[{ name: 'Gallery', path: '/gallery' }]}
        image="galleryTerrace"
      >
        <Button href={site.socials.instagram} variant="secondary">
          <Icon name="instagram" className="h-4 w-4" />
          Follow {site.socials.instagramHandle}
        </Button>
      </PageHeader>

      <Section className="bg-linen" space="sm">
        <Reveal>
          <GalleryGrid images={galleryImages} columns={3} />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center text-body-sm text-coffee-soft/85">
            Tap any image to open it. Use the arrow keys to move through the
            gallery, or Escape to close.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-beige bg-cream" space="sm" width="narrow" innerClassName="text-center">
        <Reveal>
          <p className="u-eyebrow text-clay-deep">Day to day</p>
          <h2 className="mt-4 text-display-md text-coffee">
            The specials board lives on Instagram
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lead font-light text-coffee-soft">
            What is in the cabinet, what the kitchen is cooking, and the occasional
            photograph of a dog who has made himself at home.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href={site.socials.instagram} size="lg">
              <Icon name="instagram" className="h-4 w-4" />
              {site.socials.instagramHandle}
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd id="schema-gallery" data={graph} />
    </>
  )
}
