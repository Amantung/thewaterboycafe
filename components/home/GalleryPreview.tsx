import { galleryImages } from '@/lib/data/images'
import { site } from '@/lib/site'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'

/**
 * Homepage gallery strip — the first eight images, linking out to /gallery and
 * to Instagram. Shares the lightbox implementation with the full gallery page.
 */
export function GalleryPreview() {
  const preview = galleryImages.slice(0, 8)

  return (
    <Section id="gallery" aria-labelledby="gallery-heading" className="bg-linen">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="gallery-heading"
          eyebrow="Around the cafe"
          title="Mornings here, more or less"
          description="Coffee, cabinet, courtyard, and the bay a few minutes down the road."
          className="max-w-xl"
        />

        <Reveal delay={0.1}>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/gallery" variant="secondary" withArrow>
              Full gallery
            </Button>
            <Button href={site.socials.instagram} variant="secondary">
              <Icon name="instagram" className="h-4 w-4" />
              Follow {site.socials.instagramHandle}
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <GalleryGrid images={preview} columns={4} className="mt-14" />
      </Reveal>
    </Section>
  )
}
