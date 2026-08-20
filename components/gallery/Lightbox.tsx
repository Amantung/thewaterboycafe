'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import type { GalleryPhoto } from '@/components/gallery/photos'

/**
 * The one lightbox on the site.
 *
 * It used to live inside `GalleryGrid`, which meant the homepage could not
 * have its own gallery composition without either reusing that grid or
 * shipping a second lightbox. Pulled out here it is shared by both: the
 * art-directed homepage spread and the full `/gallery` wall open the same
 * dialog with the same keyboard model.
 *
 * `useLightbox` owns everything stateful — which frame is open, the focus
 * refs for the triggers, Escape and arrow keys, and the scroll lock — so a
 * caller only has to render triggers and hand back an index.
 */

export function useLightbox(count: number) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<(HTMLElement | null)[]>([])

  const close = useCallback(() => {
    setOpenIndex((current) => {
      // Focus goes back to the thumbnail that opened the dialog, not to the
      // top of the document.
      if (current !== null) triggerRefs.current[current]?.focus()
      return null
    })
  }, [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) => (current === null ? null : (current + delta + count) % count)),
    [count],
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

  return { openIndex, open: setOpenIndex, close, step, jump: setOpenIndex, triggerRefs }
}

export function Lightbox({
  images,
  index,
  onClose,
  onStep,
  onJump,
}: {
  images: GalleryPhoto[]
  index: number | null
  onClose: () => void
  onStep: (delta: number) => void
  onJump: (index: number) => void
}) {
  const reduceMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const image = index === null ? null : images[index]

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
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-espresso/95 p-4 backdrop-blur-md sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center border border-cream/25 text-cream transition-colors hover:bg-cream/10 sm:right-8 sm:top-8"
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
            key={image.src}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 70vw, 92vw"
              priority
              className="max-h-[62vh] w-auto object-contain"
            />
            <figcaption className="flex flex-col items-center text-center">
              <p className="u-micro text-clay">{image.label}</p>
              <p className="mx-auto mt-3 max-w-xl text-body-sm text-cream/55">{image.alt}</p>
            </figcaption>
          </motion.figure>

          {/* Filmstrip — jump straight to any frame instead of stepping. */}
          {images.length > 1 && (
            <nav
              aria-label="All images"
              className="u-no-scrollbar flex w-full max-w-3xl flex-none gap-2 overflow-x-auto px-1 pb-1"
            >
              {images.map((thumb, thumbIndex) => (
                <button
                  key={thumb.src}
                  type="button"
                  onClick={() => onJump(thumbIndex)}
                  aria-label={`Go to ${thumb.label}`}
                  aria-current={thumbIndex === index}
                  className={cn(
                    'relative h-12 w-12 flex-none overflow-hidden transition-all duration-300 sm:h-14 sm:w-14',
                    thumbIndex === index
                      ? 'opacity-100 ring-1 ring-clay'
                      : 'opacity-45 hover:opacity-80',
                  )}
                >
                  <Image src={thumb.src} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </nav>
          )}

          <p className="u-micro flex-none text-cream/35">
            {(index ?? 0) + 1} / {images.length}
          </p>
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
        'border border-cream/25 text-cream transition-colors hover:bg-cream/10',
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
