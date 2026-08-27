'use client'

import { useInView, useReducedMotion, type Variants } from 'framer-motion'
import { forwardRef, useRef } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

import { motionTag } from '@/components/ui/motionTag'

/**
 * Scroll-triggered entrance.
 *
 * One shared primitive for the whole site so the motion language stays
 * consistent: a short rise with a long, editorial ease — never a bounce.
 *
 * Accessibility: `useReducedMotion` collapses the animation to a plain fade of
 * zero duration, so content still appears instantly for anyone who asked the
 * OS for less motion. `once` means an element never re-animates on scroll-back,
 * which is the difference between "elegant" and "seasick".
 */

type RevealProps = {
  children: ReactNode
  /** Seconds. Use small offsets (0.06–0.12) to cascade a row of cards. */
  delay?: number
  /** Travel distance in px. Keep it modest — big travel reads as cheap. */
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export function Reveal({
  children,
  delay = 0,
  distance = 8,
  direction = 'up',
  as = 'div',
  className,
  style,
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motionTag(as)

  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }[direction]

  const variants: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }
    : {
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      // Fire slightly before the element is fully on screen so the motion has
      // finished by the time the reader's eye arrives.
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Staggers direct children. Pair with <RevealItem> for lists and grids where
 * per-child `delay` maths would be tedious and brittle.
 *
 * ── Why this uses `useInView` + `animate`, not `whileInView` ───────────────
 * `whileInView` with `once: true` is a *momentary* instruction: it fires when
 * the element first intersects and is then finished. Any child mounted after
 * that point — a filtered list, a switched category, a paginated page —
 * mounts at `initial="hidden"` and never receives a `visible` instruction,
 * because there is no longer anything telling it to be visible.
 *
 * That is not hypothetical. It is exactly what emptied the homepage menu: the
 * list revealed correctly for the first category, and every category switched
 * to afterwards rendered a full, correctly-mapped, correctly-priced list of
 * dishes at `opacity: 0` — several hundred pixels of invisible DOM that read
 * as a giant blank panel next to the photograph.
 *
 * Latching the state into `animate` instead makes "visible" a standing
 * instruction, so late-mounting children inherit it and animate in normally.
 * `once` behaviour is preserved: `useInView(once)` never flips back to false,
 * so nothing re-animates on scroll-back.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.05,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  as?: ElementType
}) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motionTag(as)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: 0.03 },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}

type RevealItemProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  distance?: number
  [key: string]: unknown
}

/**
 * Forwards its ref to the underlying element — needed so callers like
 * `GalleryGrid` can keep a ref to each tile (e.g. to restore focus after the
 * lightbox closes) when `as="button"` replaces the default `div`.
 */
export const RevealItem = forwardRef<HTMLElement, RevealItemProps>(function RevealItem(
  { children, className, as = 'div', distance = 8, ...rest },
  ref,
) {
  const reduceMotion = useReducedMotion()
  // The `[key: string]: unknown` index signature above widens `as` on
  // destructuring, so it needs narrowing back to what the prop declares.
  const MotionTag = motionTag(as as ElementType)

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={
        reduceMotion
          ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }
          : {
              hidden: { opacity: 0, y: distance },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              },
            }
      }
      {...rest}
    >
      {children}
    </MotionTag>
  )
})
