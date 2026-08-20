'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { motionTag } from '@/components/ui/motionTag'

type Tone = 'light' | 'dark'

const TONES: Record<Tone, string> = {
  light: 'text-coffee',
  dark: 'text-cream',
}

/** Rungs of the display ramp in globals.css — never a bespoke size. */
const SIZES = {
  statement: 'text-statement',
  '2xl': 'text-display-2xl',
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
  sm: 'text-display-sm',
} as const

export type StatementLine =
  | ReactNode
  | {
      text: ReactNode
      /** Serif italic in clay — the accent voice. Use once per statement. */
      accent?: boolean
      /** Indents the line on desktop, breaking the flush-left block. */
      indent?: boolean
    }

function normalise(line: StatementLine) {
  if (line && typeof line === 'object' && 'text' in (line as object)) {
    return line as { text: ReactNode; accent?: boolean; indent?: boolean }
  }
  return { text: line as ReactNode }
}

export function Statement({
  lines,
  as = 'h2',
  size = '2xl',
  tone = 'light',
  align = 'left',
  /** `load` for above-the-fold type; `scroll` for everything below it. */
  trigger = 'scroll',
  delay = 0,
  id,
  className,
}: {
  lines: StatementLine[]
  as?: ElementType
  size?: keyof typeof SIZES
  tone?: Tone
  align?: 'left' | 'center'
  trigger?: 'load' | 'scroll'
  delay?: number
  id?: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const Tag = motionTag(as)

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: delay },
    },
  }

  const line: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { y: '108%' },
        visible: {
          y: '0%',
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        },
      }

  const motionProps =
    trigger === 'load'
      ? { animate: 'visible' as const }
      : {
          whileInView: 'visible' as const,
          viewport: { once: true, margin: '0px 0px -14% 0px' },
        }

  return (
    <Tag
      id={id}
      initial="hidden"
      variants={container}
      {...motionProps}
      className={cn(SIZES[size], TONES[tone], align === 'center' && 'text-center', className)}
    >
      {lines.map((raw, index) => {
        const { text, accent, indent } = normalise(raw)

        return (
          <span
            key={index}
            className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
          >
            <motion.span
              variants={line}
              className={cn(
                'block',
                accent && 'text-clay',
                indent && 'lg:pl-[12%]',
              )}
            >
              {text}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

/**
 * The same clipped rise for a single element — a standfirst, a price, a
 * caption — so supporting copy enters in the same language as the headline
 * above it instead of using a different entrance.
 */
export function MaskRise({
  children,
  delay = 0,
  trigger = 'scroll',
  as = 'div',
  className,
}: {
  children: ReactNode
  delay?: number
  trigger?: 'load' | 'scroll'
  as?: ElementType
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const Tag = motionTag(as)

  const variants: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }
    : {
        hidden: { y: '110%' },
        visible: { y: '0%', transition: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] } },
      }

  const motionProps =
    trigger === 'load'
      ? { animate: 'visible' as const }
      : {
          whileInView: 'visible' as const,
          viewport: { once: true, margin: '0px 0px -12% 0px' },
        }

  return (
    <span className={cn('block overflow-hidden pb-[0.18em] -mb-[0.18em]', className)}>
      <Tag initial="hidden" variants={variants} {...motionProps} className="block">
        {children}
      </Tag>
    </span>
  )
}
