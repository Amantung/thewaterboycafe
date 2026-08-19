'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { forwardRef } from 'react'
import type { ElementType, ReactNode } from 'react'

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
}

export function Reveal({
  children,
  delay = 0,
  distance = 24,
  direction = 'up',
  as = 'div',
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion.create(as as ElementType)

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
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <MotionTag
      className={className}
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
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  as?: ElementType
}) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion.create(as as ElementType)

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: 0.05 },
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
  { children, className, as = 'div', distance = 22, ...rest },
  ref,
) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion.create(as as ElementType)

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
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }
      }
      {...rest}
    >
      {children}
    </MotionTag>
  )
})
