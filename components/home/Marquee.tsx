import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const ROW_ONE = [
  'Fresh coffee',
  'Homemade cakes',
  'Brunch & lunch',
  'Freshly baked',
  'Good food, good coffee',
]

const ROW_TWO = [
  'The Waterboy',
  'Fresh daily',
  'Beach side',
  'Made with love',
  'See you soon',
]

/**
 * The band between the hero and the page — a design element, not a notice bar.
 *
 * What it was: two rows of 24px labels with icons, inside a bordered strip on
 * sand. That is an announcement bar, and it read as one.
 *
 * What it is now: two oversized rows travelling in opposite directions on
 * espresso, so the dark of the hero carries through one more beat before the
 * page opens into linen. The upper row is set in light sans at display size;
 * the lower row is the same scale in serif italic, drawn as an outline. Two
 * rows of solid type at this size would be two walls of ink — the outline
 * makes the second row a counterpoint to the first instead of a repeat of it,
 * and the opposing directions are what make the band read as movement rather
 * than as scrolling text.
 *
 * The loop is a plain CSS keyframe, not Framer Motion: once started it never
 * touches the main thread, so an animation that runs forever costs nothing
 * per frame. `prefers-reduced-motion` is handled globally in globals.css,
 * which collapses it to a single static pass. Hovering a row pauses that row
 * only.
 *
 * Decorative and duplicated for the seam, so the whole band is hidden from
 * assistive tech — every claim in it is made properly in the sections either
 * side.
 */
export function Marquee() {
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-b border-cream/10 bg-espresso py-10 sm:py-14"
    >
      <div aria-hidden="true" className="u-grain absolute inset-0" />

      <div className="relative flex flex-col gap-2 sm:gap-4">
        <MarqueeRow items={ROW_ONE} direction="left" variant="sans" seconds={46} />
        <MarqueeRow items={ROW_TWO} direction="right" variant="serif" seconds={58} />
      </div>
    </section>
  )
}

function MarqueeRow({
  items,
  direction,
  variant,
  seconds,
}: {
  items: string[]
  direction: 'left' | 'right'
  variant: 'sans' | 'serif'
  seconds: number
}) {
  // Duplicated once so the track can loop from -50% back to 0% with no seam.
  const track = [...items, ...items]

  return (
    <div className="u-marquee-row overflow-hidden">
      <div
        className={cn(
          'u-marquee-track items-center',
          direction === 'right' && 'u-marquee-track--reverse',
        )}
        style={{ '--marquee-duration': `${seconds}s` } as CSSProperties}
      >
        {track.map((label, index) => (
          <span
            key={index}
            className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10"
          >
            <span
              className={cn(
                'text-marquee whitespace-nowrap',
                variant === 'sans'
                  ? 'font-body font-light uppercase text-cream/90'
                  : 'u-text-outline font-display italic',
              )}
            >
              {label}
            </span>

            <Mark variant={variant} />
          </span>
        ))}
      </div>
    </div>
  )
}

/** Separator. A clay asterisk between the sans items, a small open diamond
    between the serif ones — different rhythm markers for different voices. */
function Mark({ variant }: { variant: 'sans' | 'serif' }) {
  if (variant === 'serif') {
    return (
      <span
        aria-hidden="true"
        className="block h-2 w-2 shrink-0 rotate-45 border border-clay/70 sm:h-2.5 sm:w-2.5"
      />
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-clay sm:h-6 sm:w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M12 3v18M3.9 7.5l16.2 9M20.1 7.5l-16.2 9" />
    </svg>
  )
}
