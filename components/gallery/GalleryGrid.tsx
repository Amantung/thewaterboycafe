'use client'

import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import type { GalleryPhoto } from '@/components/gallery/photos'
import { Lightbox, useLightbox } from '@/components/gallery/Lightbox'

const EASE = [0.22, 1, 0.36, 1] as const

/** One uniform, subtle fade-up — every tile arrives the same quiet way. */
function tileVariants(index: number, reduceMotion: boolean | null): Variants {
  if (reduceMotion) {
    return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.001 } } }
  }

  return {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE, delay: (index % 6) * 0.03 },
    },
  }
}

/**
 * The dense gallery wall, for the /gallery page.
 *
 * A bento composition art-directed via `size` on each `GalleryPhoto` (see
 * photos.ts) rather than derived from aspect ratio: a handful of tiles are
 * deliberately much larger than the rest, and `grid-flow-dense` packs the
 * remainder into whatever gaps they leave at every column count without a
 * hand-written placement table per breakpoint. Photos are cropped to their
 * cell — a considered trade against never cropping, because the size contrast
 * is the entire point of a wall.
 *
 * Square corners and no drop shadows. The radius-and-shadow treatment this
 * used to carry turned every photograph into a card floating above the page;
 * flush edges on a shared grid read as a printed plate on a sheet. Shares its
 * `Lightbox` dialog with any other gallery composition on the site.
 */

const SIZE_SPAN: Record<NonNullable<GalleryPhoto['size']>, string> = {
  feature: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  normal: 'col-span-1 row-span-1',
}

export function GalleryGrid({
  images,
  className,
}: {
  images: GalleryPhoto[]
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const { openIndex, open, close, step, jump, triggerRefs } = useLightbox(images.length)

  return (
    <>
      <motion.div
        className={cn(
          'grid grid-flow-row-dense grid-cols-2 sm:grid-cols-4 lg:grid-cols-6',
          'auto-rows-[11rem] gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:auto-rows-[13rem]',
          className,
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        {images.map((image, index) => {
          const size = image.size ?? 'normal'

          return (
            <motion.button
              key={image.src}
              ref={(element: HTMLButtonElement | null) => {
                triggerRefs.current[index] = element
              }}
              variants={tileVariants(index, reduceMotion)}
              style={{ willChange: 'transform, opacity' }}
              type="button"
              onClick={() => open(index)}
              aria-label={`Open image: ${image.label}`}
              className={cn('group relative block overflow-hidden bg-sand text-left', SIZE_SPAN[size])}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes={
                  size === 'feature' || size === 'wide'
                    ? '(min-width: 1024px) 45vw, 66vw'
                    : '(min-width: 1024px) 20vw, 33vw'
                }
                className="object-cover transition-transform duration-[900ms] ease-editorial motion-ok:group-hover:scale-[1.05]"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span className="u-micro text-cream">{image.label}</span>
                <span className="inline-flex h-8 w-8 flex-none translate-y-1 items-center justify-center border border-cream/35 text-cream opacity-0 transition-[opacity,transform] duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <Icon name="arrowRight" className="h-3.5 w-3.5 -rotate-45" />
                </span>
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      <Lightbox images={images} index={openIndex} onClose={close} onStep={step} onJump={jump} />
    </>
  )
}
