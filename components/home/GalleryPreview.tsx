'use client'

import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/ui/Editorial'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GALLERY_PHOTOS } from '@/components/gallery/photos'
import { Lightbox, useLightbox } from '@/components/gallery/Lightbox'
import { cn } from '@/lib/utils'

/**
 * The homepage gallery — a curated mosaic, not a feed.
 *
 * Six photographs on a four-column grid, each given a deliberate span and
 * aspect ratio so the shapes interlock rather than tile: a square anchor two
 * rows tall on the left, two squares and a panorama filling the right, then a
 * portrait and a wide finish. Placement is by hand, per photograph, because a
 * rule that derived the layout from aspect ratio would make every frame the
 * same shape at a different width — which is how this section previously read
 * as "a grid" no matter how the hover states were dressed up.
 *
 * Radius, easing and shadow all come from tokens, so the frames belong to the
 * same system as the menu preview and the Instagram wall. Opens the shared
 * `Lightbox` — the same dialog the /gallery page uses.
 */

type Placement = {
  src: string
  frame: string
  aspect: string
  sizes: string
}

const SPREAD: Placement[] = [
  // --- ROW 1 & 2 (Left Anchor) ---
  {
    src: '/images/gallery-cowes-foreshore-western-port.jpg',
    frame: 'md:col-span-2 md:row-span-2', 
    aspect: 'aspect-square', // Perfectly matches the height of the two rows beside it
    sizes: '(min-width: 768px) 40vw, 100vw',
  },
  // --- ROW 1 (Right Side) ---
  {
    src: '/images/gallery-window-seat-timber-stools.jpg',
    frame: 'md:col-span-1',
    aspect: 'aspect-square',
    sizes: '(min-width: 768px) 20vw, 100vw',
  },
  {
    src: '/images/gallery-five-senses-coffee-beans.jpg',
    frame: 'md:col-span-1',
    aspect: 'aspect-square',
    sizes: '(min-width: 768px) 20vw, 100vw',
  },
  // --- ROW 2 (Right Side) ---
  {
    src: '/images/gallery-cafe-frontage-signage.jpg',
    frame: 'md:col-span-2',
    aspect: 'aspect-[2/1]', // Wide panoramic that sits flawlessly under the two squares
    sizes: '(min-width: 768px) 40vw, 100vw',
  },
  // --- ROW 3 ---
  {
    src: '/images/gallery-team.jpg',
    frame: 'md:col-span-1',
    aspect: 'aspect-[2/3]', // Elegant, taller portrait
    sizes: '(min-width: 768px) 20vw, 100vw',
  },
  {
    src: '/images/gallery-outdoor-courtyard-seating.jpg',
    frame: 'md:col-span-3',
    aspect: 'aspect-[2/1]', // Super-wide cinematic shot to finish the block
    sizes: '(min-width: 768px) 60vw, 100vw',
  },
]

const FRAMES = SPREAD.map((placement) => {
  const photo = GALLERY_PHOTOS.find((entry) => entry.src === placement.src)
  return photo ? { ...placement, photo } : null
}).filter((frame): frame is Placement & { photo: (typeof GALLERY_PHOTOS)[number] } => frame !== null)

export function GalleryPreview() {
  const photos = FRAMES.map((frame) => frame.photo)
  const { openIndex, open, close, step, jump, triggerRefs } = useLightbox(photos.length)

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative bg-linen u-section"
    >
      <Container>
        {/* Opener */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            id="gallery-heading" 
            eyebrow="Around the cafe"
            size="2xl"
            title={
              <>
                The world of <span className="text-clay">The Waterboy</span>
              </>
            }
          />

          <Reveal delay={0.12} className="lg:max-w-xs lg:pb-3">
            <p className="text-body text-coffee-soft">
              Coffee, cabinet, courtyard, and the bay a few minutes down the
              road.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 sm:mt-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-5">
            {FRAMES.map((frame, index) => (
              <figure key={frame.src} className={cn('flex flex-col group', frame.frame)}>
                <button
                  ref={(element: HTMLButtonElement | null) => {
                    triggerRefs.current[index] = element
                  }}
                  type="button"
                  onClick={() => open(index)}
                  aria-label={`Open image: ${frame.photo.label}`}
                  className={cn(
                    'relative block w-full overflow-hidden rounded-md bg-sand ring-1 ring-inset ring-coffee/5 transition-all duration-700 ease-editorial hover:shadow-lifted hover:ring-coffee/10',
                    frame.aspect,
                  )}
                >
                  <Image
                    src={frame.photo.src}
                    alt={frame.photo.alt}
                    fill
                    loading="lazy"
                    sizes={frame.sizes}
                    className="object-cover transition-transform duration-1000 ease-editorial motion-ok:group-hover:scale-105"
                  />

                  {/* Gradient sweep overlay for better text legibility */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/40 via-espresso/0 to-transparent opacity-0 transition-opacity duration-700 ease-editorial group-hover:opacity-100 group-focus-visible:opacity-100"
                  />

                  <span
                    aria-hidden="true"
                    className="u-micro pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-2.5 text-cream opacity-0 transition-all duration-700 ease-editorial translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    Enlarge
                    <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                      <path
                        d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </div>

        {/* Colophon */}
        <Reveal delay={0.1}>
          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-coffee/12 pt-8">
            <p className="max-w-md text-body-sm text-coffee-soft/80">
              Photographed across a normal week — no styling, no props, nothing
              we do not serve.
            </p>
            <CtaLink href="/gallery">Explore the gallery</CtaLink>
          </div>
        </Reveal>
      </Container>

      <Lightbox images={photos} index={openIndex} onClose={close} onStep={step} onJump={jump} />
    </section>
  )
}