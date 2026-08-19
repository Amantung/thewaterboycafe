import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The one section header on the site: a tracked uppercase eyebrow, a DM Serif
 * Display title, and an optional standfirst.
 *
 * Every heading on every page goes through here, which is what keeps the
 * hierarchy readable — the eyebrow is always the same size and tracking, the
 * title always steps from the same fluid ramp in globals.css, and the
 * standfirst always sits on the same measure. No section gets to invent its
 * own scale.
 *
 * Two things are deliberately decoupled:
 *
 *   • `level` sets the heading tag and therefore the document outline. Pages
 *     use exactly one <h1> and sections step down from it.
 *   • `size` sets the visual scale. A section can look large while still being
 *     an <h2>, which is the usual case.
 *
 * `tone` flips the palette for the dark bands, so contrast never depends on
 * whoever remembered to pass a text colour.
 */

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  level?: 1 | 2 | 3
  align?: 'left' | 'center'
  /** Visual scale, decoupled from heading level. */
  size?: 'sm' | 'md' | 'lg'
  /** Tone of the surface behind it, so contrast stays correct on dark bands. */
  tone?: 'light' | 'dark'
  /** Widen past the default measure when the title is a single long line. */
  measure?: 'default' | 'wide'
  className?: string
  id?: string
  /** Rendered under the standfirst — buttons, chips, a hours line. */
  children?: ReactNode
}

const SIZES = {
  sm: 'text-display-sm',
  md: 'text-display-md',
  lg: 'text-display-lg',
} as const

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
  align = 'left',
  size = 'md',
  tone = 'light',
  measure = 'default',
  className,
  id,
  children,
}: SectionHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  const dark = tone === 'dark'

  return (
    <div
      className={cn(
        measure === 'wide' ? 'max-w-4xl' : 'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              'u-eyebrow flex items-center gap-3',
              align === 'center' && 'justify-center',
              dark ? 'text-clay' : 'text-clay-deep',
            )}
          >
            {/* Short rule as a typographic flourish, not a divider. */}
            <span
              aria-hidden="true"
              className={cn('h-px w-8 flex-none', dark ? 'bg-clay/60' : 'bg-clay-deep/45')}
            />
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <Tag
          id={id}
          className={cn(
            SIZES[size],
            eyebrow && 'mt-5',
            dark ? 'text-cream' : 'text-coffee',
          )}
        >
          {title}
        </Tag>
      </Reveal>

      {description && (
        <Reveal delay={0.1}>
          <div
            className={cn(
              'mt-5 text-lead font-light',
              dark ? 'text-cream/75' : 'text-coffee-soft',
            )}
          >
            {description}
          </div>
        </Reveal>
      )}

      {children && (
        <Reveal delay={0.15}>
          <div className={cn('mt-8', align === 'center' && 'flex justify-center')}>
            {children}
          </div>
        </Reveal>
      )}
    </div>
  )
}
