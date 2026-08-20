import Image from 'next/image'

import { story } from '@/lib/data/content'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Brand story: a tall portrait image, an overlapping square, and the copy.
 *
 * The overlap is built with a negative margin on a grid child rather than
 * absolute positioning, so the section still reflows sensibly at every width
 * and the images keep their intrinsic aspect ratios.
 */
const interior = {
  src: '/images/sitting.jpg',
  alt: "The dining room's timber tables and bentwood chairs under rattan pendant lights, with Western Port Bay through the window",
}
const pour = {
  src: '/images/coffee.jpg',
  alt: 'A chef leaning in to finish a plate on the pass during morning service, in black and white',
}

export function StoryStrip() {

  return (
    <Section
      id="story"
      aria-labelledby="story-heading"
      className="relative overflow-hidden bg-linen"
      innerClassName="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-24"
    >
        {/* Images ---------------------------------------------------------- */}
        <div className="relative">
          <Reveal direction="right" distance={32}>
            <div className="relative aspect-4/5 overflow-hidden rounded-md bg-sand shadow-lifted">
              <Image
                src={interior.src}
                alt={interior.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Overlapping detail shot, hidden on the narrowest screens where
              it would crowd the primary image rather than complement it. */}
          <Reveal delay={0.18} direction="up" distance={28}>
            <div className="absolute -bottom-10 -right-4 hidden aspect-square w-40 overflow-hidden rounded-md border-4 border-linen bg-sand shadow-lifted sm:block sm:w-52 lg:-right-10 lg:w-56">
              <Image
                src={pour.src}
                alt={pour.alt}
                fill
                loading="lazy"
                sizes="224px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Copy ------------------------------------------------------------ */}
        <div className="lg:pl-4">
          <SectionHeading
            id="story-heading" 
            eyebrow={story.eyebrow}
            title={story.heading}
            size="md"
          />

          <div className="mt-7 space-y-5">
            {story.body.map((paragraph, index) => (
              <Reveal key={index} delay={0.08 * index}>
                <p className="text-body text-coffee-soft">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28}>
            <div className="mt-9 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Button href="/about" variant="secondary" withArrow>
                Read our story
              </Button>

              <p className="text-display-xs text-clay-deep">{story.signature}</p>
            </div>
          </Reveal>
        </div>
    </Section>
  )
}