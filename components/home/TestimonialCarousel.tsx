'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { Testimonial } from '@/lib/data/testimonials'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import { TestimonialCard } from '@/components/ui/TestimonialCard'

/**
 * Review carousel.
 *
 * Accessibility decisions worth keeping if this is ever refactored:
 *   • The slide region is a labelled group with aria-live="polite", so a change
 *     is announced without stealing focus.
 *   • Autoplay pauses on hover, on keyboard focus anywhere inside, when the tab
 *     is hidden, and permanently after any manual interaction — an animation
 *     that fights the reader is worse than no animation.
 *   • Autoplay never starts at all under prefers-reduced-motion.
 *   • Dots are real buttons with meaningful labels, not decorative spans.
 */

const AUTOPLAY_MS = 7000

export function TestimonialCarousel({ reviews }: { reviews: Testimonial[] }) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  // Once someone drives the carousel themselves, stop driving it for them.
  const [userTookOver, setUserTookOver] = useState(false)
  const regionRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (next: number, manual = true) => {
      setDirection(next > index ? 1 : -1)
      setIndex(((next % reviews.length) + reviews.length) % reviews.length)
      if (manual) setUserTookOver(true)
    },
    [index, reviews.length],
  )

  const step = useCallback(
    (delta: number, manual = true) => {
      setDirection(delta)
      setIndex((current) => (current + delta + reviews.length) % reviews.length)
      if (manual) setUserTookOver(true)
    },
    [reviews.length],
  )

  /* --- Autoplay ----------------------------------------------------------- */
  useEffect(() => {
    if (reduceMotion || paused || userTookOver || reviews.length < 2) return

    const timer = window.setInterval(() => step(1, false), AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [reduceMotion, paused, userTookOver, reviews.length, step])

  /* --- Pause when the tab is not visible ---------------------------------- */
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* --- Arrow keys, scoped to the carousel --------------------------------- */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  if (reviews.length === 0) return null

  const slide = {
    enter: (dir: number) =>
      reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir * 48 },
    center: { opacity: 1, x: 0 },
    exit: (dir: number) =>
      reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir * -48 },
  }

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Guest reviews"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        // Only resume once focus has genuinely left the carousel.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false)
      }}
      className="relative"
    >
      <div aria-live="polite" aria-atomic="true" className="relative min-h-[22rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={reviews[index].id}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            // Swipe on touch devices; the 90px threshold avoids hijacking
            // a vertical page scroll that drifted sideways.
            drag={reduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_event, info) => {
              if (info.offset.x < -90) step(1)
              else if (info.offset.x > 90) step(-1)
            }}
          >
            <p className="sr-only">
              Review {index + 1} of {reviews.length}
            </p>
            <TestimonialCard review={reviews[index]} tone="dark" className="cursor-grab active:cursor-grabbing" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls ---------------------------------------------------------- */}
      <div className="mt-8 flex items-center justify-between gap-6">
        <div className="flex gap-2.5" role="tablist" aria-label="Choose a review">
          {reviews.map((review, dotIndex) => (
            <button
              key={review.id}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`Review ${dotIndex + 1} of ${reviews.length}, by ${review.author}`}
              onClick={() => goTo(dotIndex)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-400',
                dotIndex === index
                  ? 'w-9 bg-clay'
                  : 'w-1.5 bg-cream/25 hover:bg-cream/50',
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <CarouselButton label="Previous review" onClick={() => step(-1)} icon="arrowLeft" />
          <CarouselButton label="Next review" onClick={() => step(1)} icon="arrowRight" />
        </div>
      </div>
    </div>
  )
}

function CarouselButton({
  label,
  onClick,
  icon,
}: {
  label: string
  onClick: () => void
  icon: 'arrowLeft' | 'arrowRight'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-all duration-300 hover:border-clay hover:bg-clay/15 hover:text-cream"
    >
      <Icon name={icon} className="h-4 w-4" title={label} />
    </button>
  )
}