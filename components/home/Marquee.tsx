import type { CSSProperties } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

type MarqueeItem = { label: string; icon: IconName }

const ROW_ONE: MarqueeItem[] = [
  { label: 'Fresh Coffee', icon: 'cup' },
  { label: 'Homemade Cakes', icon: 'star' },
  { label: 'Brunch & Lunch', icon: 'utensils' },
  { label: 'Freshly Baked', icon: 'sunrise' },
  { label: 'Good Food, Good Coffee', icon: 'bean' },
]

const ROW_TWO: MarqueeItem[] = [
  { label: 'Made with love', icon: 'heart' },
  { label: 'Coffee & cake', icon: 'cup' },
  { label: 'Phillip Island favourite', icon: 'wave' },
  { label: 'Relax · Eat · Enjoy', icon: 'leaf' },
  { label: 'See you at Waterboy', icon: 'star' },
]

/**
 * Two-row marquee bridging the hero into the rest of the homepage.
 *
 * The loop is a plain CSS keyframe animation, not Framer Motion — once
 * started it never touches the main thread, so it can run indefinitely
 * without a JS-driven `requestAnimationFrame` loop costing CPU. Reduced
 * motion is handled globally (see globals.css), which collapses every
 * animation on the page to a single near-instant pass.
 *
 * Purely decorative and duplicated for the loop, so the whole band is
 * hidden from assistive tech — the cafe's actual copy lives in the sections
 * either side of it.
 */
export function Marquee() {
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-beige bg-sand"
    >
      <Reveal className="flex flex-col gap-5 py-9 sm:gap-6 sm:py-11">
        <MarqueeRow items={ROW_ONE} direction="left" variant="sans" seconds={40} />
        <MarqueeRow items={ROW_TWO} direction="right" variant="serif" seconds={48} />
      </Reveal>
    </section>
  )
}

function MarqueeRow({
  items,
  direction,
  variant,
  seconds,
}: {
  items: MarqueeItem[]
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
        {track.map((item, index) => (
          <span
            key={index}
            className={cn(
              'flex shrink-0 items-center gap-3 px-5 opacity-80 transition duration-300 ease-out sm:gap-4 sm:px-7',
              'hover:scale-[1.05] hover:opacity-100',
              variant === 'sans'
                ? 'font-body text-lg font-semibold uppercase tracking-[0.05em] text-coffee sm:text-2xl'
                : 'font-display text-xl text-clay-deep italic sm:text-3xl',
            )}
          >
            <Icon
              name={item.icon}
              className={cn(
                'h-4 w-4 shrink-0 sm:h-5 sm:w-5',
                variant === 'sans' ? 'text-clay' : 'text-sage-deep',
              )}
            />
            {item.label}
            <span className="text-clay/50">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
