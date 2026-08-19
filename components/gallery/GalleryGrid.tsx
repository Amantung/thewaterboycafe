'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { SiteImage } from '@/lib/data/images'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

/**
 * Editorial grid gallery with a keyboard-accessible lightbox.
 *
 * A real CSS Grid with `grid-auto-flow: dense`, not CSS columns. Columns give
 * every image the same width and let the ragged column bottoms do the
 * "curation" for you — which is exactly the uneven, gap-prone look this
 * replaces. Here every tile is deliberately one of a handful of shapes
 * (`SHAPES` below), assigned by position so the wall reads as an edited
 * sequence — a feature shot, then a run of smaller ones, then the next
 * feature — rather than a grid of identical frames. `dense` packing means a
 * wide or tall tile never leaves a hole for the tile behind it to fall into.
 *
 * The lightbox is a real modal: Escape closes, arrows page, focus is moved in
 * on open and restored to the triggering thumbnail on close, and the page
 * behind it is scroll-locked and inert to screen readers via aria-modal.
 */

/**
 * One shape per position, cycling every 12 images. Long enough that neither
 * the homepage's 8-image preview nor the full gallery's ~10 ever visibly
 * repeats it. `col-span-2` reads as "full width" at 2 columns (mobile) and
 * "half width" at 4 (desktop) — the same class does the right thing at both
 * without a breakpoint variant.
 */
const SHAPES = [
  'col-span-2 row-span-2', // feature
  '',
  'row-span-2', // tall
  '',
  '',
  'col-span-2', // wide
  '',
  'row-span-2', // tall
  '',
  'col-span-2', // wide
  '',
  '',
] as const

const GRID_COLS: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

export function GalleryGrid({
  images,
  columns = 3,
  className,
}: {
  images: SiteImage[]
  columns?: 2 | 3 | 4
  className?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<(HTMLElement | null)[]>([])

  const close = useCallback(() => {
    setOpenIndex((current) => {
      // Hand focus back to the thumbnail the user opened from.
      if (current !== null) triggerRefs.current[current]?.focus()
      return null
    })
  }, [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openIndex, close, step])

  return (
    <>
      <RevealGroup
        className={cn(
          'grid auto-rows-[150px] gap-3 [grid-auto-flow:dense] sm:auto-rows-[180px] sm:gap-4 lg:auto-rows-[210px] lg:gap-5',
          GRID_COLS[columns],
          className,
        )}
        stagger={0.05}
      >
        {images.map((image, index) => (
          <RevealItem
            key={image.key}
            as="button"
            ref={(element: HTMLElement | null) => {
              triggerRefs.current[index] = element
            }}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image: ${image.label}`}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-beige bg-sand text-left shadow-soft',
              'transition-shadow duration-500 hover:shadow-lifted motion-ok:hover:-translate-y-0.5',
              SHAPES[index % SHAPES.length],
            )}
          >
            <Image
              src={`/images/${image.file}`}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 46vw, 92vw"
              className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.06]"
            />

            {/* Caption veil — hidden until hover/focus so the wall stays clean. */}
            <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-espresso/80 via-espresso/15 to-transparent p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100">
              <Badge tone="dark">{image.label}</Badge>
            </span>
          </RevealItem>
        ))}
      </RevealGroup>

      <Lightbox images={images} index={openIndex} onClose={close} onStep={step} />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

function Lightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: SiteImage[]
  index: number | null
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const reduceMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const image = index === null ? null : images[index]

  // Move focus into the dialog so the next Tab stays inside it.
  useEffect(() => {
    if (index !== null) closeRef.current?.focus()
  }, [index])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${image.label} — image ${(index ?? 0) + 1} of ${images.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/94 p-4 backdrop-blur-sm sm:p-8"
          // Click the backdrop to dismiss, but not a click on the image itself.
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10 sm:right-8 sm:top-8"
          >
            <Icon name="close" className="h-5 w-5" title="Close gallery" />
          </button>

          {images.length > 1 && (
            <>
              <LightboxArrow direction="left" onClick={() => onStep(-1)} />
              <LightboxArrow direction="right" onClick={() => onStep(1)} />
            </>
          )}

          <motion.figure
            key={image.key}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-full w-full max-w-5xl flex-col items-center gap-5"
          >
            <Image
              src={`/images/${image.file}`}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 70vw, 92vw"
              priority
              className="max-h-[74vh] w-auto rounded-2xl object-contain shadow-lifted"
            />
            <figcaption className="flex flex-col items-center text-center">
              <Badge tone="dark">{image.label}</Badge>
              <p className="mx-auto mt-3 max-w-xl text-body-sm text-cream/55">{image.alt}</p>
              <p className="u-label mt-3 text-caption text-cream/35">
                {(index ?? 0) + 1} / {images.length}
              </p>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function LightboxArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center',
        'rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10',
        direction === 'left' ? 'left-3 sm:left-8' : 'right-3 sm:right-8',
      )}
    >
      <Icon
        name={direction === 'left' ? 'arrowLeft' : 'arrowRight'}
        className="h-5 w-5"
        title={direction === 'left' ? 'Previous image' : 'Next image'}
      />
    </button>
  )
}
