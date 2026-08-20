import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/Editorial'
import { Statement, type StatementLine } from '@/components/ui/Statement'

/**
 * The one section heading on the site.
 *
 * There were two systems doing this job. Interior pages used this component —
 * a pill badge, a serif title, a standfirst. The homepage used a hand-rolled
 * `SectionLabel` + `Statement` pair. Same content, two visual languages, and
 * whichever page you landed on the other one looked like a different website.
 *
 * This is now the single implementation and it composes the pieces the
 * homepage was using, because the line-masked `Statement` is the better of
 * the two treatments: it steps from the same display ramp everywhere, it
 * enters the same way everywhere, and it cannot invent its own type scale.
 * Every section on every page goes through here.
 *
 * Two things stay deliberately decoupled:
 *
 *   • `level` sets the heading tag and therefore the document outline. A page
 *     has exactly one <h1> and sections step down from it.
 *   • `size` sets the visual scale. A section can look enormous and still be
 *     an <h2>, which is the usual case.
 *
 * `tone` flips the palette for the dark bands, so contrast never depends on
 * whoever remembered to pass a text colour.
 */

/** Maps onto the display ramp in globals.css. Nothing here invents a size. */
const SIZES = {
  statement: 'statement',
  '2xl': '2xl',
  xl: 'xl',
  lg: 'lg',
  md: 'md',
  sm: 'sm',
} as const

type Size = keyof typeof SIZES

/** Large headings run to the full measure; small ones are held to a column so
    a standfirst-sized title does not stretch across 1500px. */
const MEASURES = {
  default: 'max-w-2xl',
  wide: 'max-w-4xl',
  full: '',
} as const

const BIG: Size[] = ['statement', '2xl', 'xl']

type SectionHeadingProps = {
  /** Small caps label above the title. */
  eyebrow?: ReactNode
  /** Running sequence number, rendered inside the label. */
  index?: number
  /** `rule` is the quiet default; `pill` announces a little more. */
  labelVariant?: 'rule' | 'pill'
  /**
   * A string for a single line, or an array to control where the lines break
   * and which one carries the clay accent. Explicit lines are preferred for
   * anything at `xl` and above — a wrapped line shares one reveal mask with
   * its sibling and loses the stagger.
   */
  title: ReactNode | StatementLine[]
  description?: ReactNode
  level?: 1 | 2 | 3
  align?: 'left' | 'center'
  size?: Size
  tone?: 'light' | 'dark'
  measure?: keyof typeof MEASURES
  className?: string
  /**
   * For the rare heading that is set in the body face rather than the display
   * serif — the Instagram handle, which is a wordmark, not a sentence. Use it
   * to change the *face*, never to introduce a size or a tracking.
   */
  titleClassName?: string
  id?: string
  /** Rendered under the standfirst — buttons, chips, an hours line. */
  children?: ReactNode
}

export function SectionHeading({
  eyebrow,
  index,
  labelVariant = 'rule',
  title,
  description,
  level = 2,
  align = 'left',
  size = 'md',
  tone = 'light',
  measure,
  className,
  titleClassName,
  id,
  children,
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  const lines: StatementLine[] = Array.isArray(title) ? title : [title]
  const resolvedMeasure = measure ?? (BIG.includes(size) ? 'full' : 'default')

  return (
    <div
      className={cn(MEASURES[resolvedMeasure], align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && (
        <Reveal>
          <div className={cn(align === 'center' && 'flex justify-center')}>
            <SectionLabel index={index} tone={tone} variant={labelVariant}>
              {eyebrow}
            </SectionLabel>
          </div>
        </Reveal>
      )}

      <Statement
        id={id}
        as={`h${level}`}
        size={SIZES[size]}
        tone={tone}
        align={align}
        lines={lines}
        className={cn(Boolean(eyebrow) && 'mt-6 sm:mt-7', titleClassName)}
      />

      {description && (
        <Reveal delay={0.1}>
          <div
            className={cn(
              'mt-5 text-lead font-light',
              // Long-form supporting copy stays on a readable measure even
              // when the title above it runs the full width.
              resolvedMeasure === 'full' && align === 'left' && 'max-w-xl',
              dark ? 'text-cream/75' : 'text-coffee-soft',
            )}
          >
            {description}
          </div>
        </Reveal>
      )}

      {children && (
        <Reveal delay={0.15}>
          <div className={cn('mt-8', align === 'center' && 'flex justify-center')}>{children}</div>
        </Reveal>
      )}
    </div>
  )
}
