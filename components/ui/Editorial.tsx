import Link from 'next/link'
import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/ui/Icon'

/**
 * The small repeating parts of the editorial system.
 *
 * Both components below take their type, tracking, easing and radius from
 * tokens in globals.css. Neither declares a font-family, a font-size, a
 * letter-spacing or a bezier of its own — that is deliberate, and it is the
 * rule to keep if these are ever edited. The previous version of `CtaLink`
 * had grown a full parallel implementation in TSX (two rules, its own
 * `cubic-bezier(0.19,1,0.22,1)`, its own `tracking-[0.18em]`) which is how a
 * design system ends up with two of everything.
 *
 * Server components — no state, no handlers, nothing shipped to the client.
 */

/* -------------------------------------------------------------------------- */
/* Section label                                                              */
/* -------------------------------------------------------------------------- */

type LabelVariant = 'rule' | 'pill'

/**
 * The label that sits above a section heading, in two weights.
 *
 *   rule — an optional index, a hairline, the label. The quiet default, for
 *          sections whose oversized heading is already carrying the hierarchy.
 *   pill — the same type inside a bordered chip. For sections where the
 *          heading needs a little more announcement above it, and for dark
 *          bands where a bare hairline reads as debris.
 *
 * Use `pill` sparingly. A chip above all eight homepage sections is the
 * "component library" look the rule variant exists to avoid.
 */
export function SectionLabel({
  index,
  children,
  tone = 'light',
  variant = 'rule',
  icon,
  as,
  id,
  className,
}: {
  /** Position in the page's running sequence. Rendered as `01`, `02`, … */
  index?: number
  children: ReactNode
  tone?: 'light' | 'dark'
  variant?: LabelVariant
  /** Pill variant only — a small leading glyph. */
  icon?: IconName
  /**
   * Keeps the markup honest: a label that is genuinely a section's only
   * heading should still be an `<h2>`/`<h3>`, just styled like every other
   * label. Defaults to `<span>` for the pill and `<p>` for the rule.
   */
  as?: Extract<ElementType, 'span' | 'p' | 'h2' | 'h3' | 'h4'>
  id?: string
  className?: string
}) {
  const dark = tone === 'dark'

  if (variant === 'pill') {
    const Tag = (as ?? 'span') as ElementType
    return (
      <Tag
        id={id}
        className={cn(
          'u-micro inline-flex items-center gap-2.5 rounded-full border px-4 py-2',
          dark
            ? 'border-cream/20 bg-cream/8 text-cream/85'
            : 'border-clay-deep/25 bg-clay/10 text-clay-deep',
          className,
        )}
      >
        {index !== undefined && (
          <>
            <span className={dark ? 'text-clay' : 'text-clay-deep/65'}>
              {String(index).padStart(2, '0')}
            </span>
            <span
              aria-hidden="true"
              className={cn('h-2.5 w-px', dark ? 'bg-cream/25' : 'bg-clay-deep/30')}
            />
          </>
        )}
        {icon && <Icon name={icon} className="h-3 w-3 flex-none" />}
        {children}
      </Tag>
    )
  }

  const RuleTag = (as ?? 'p') as ElementType

  return (
    <RuleTag id={id} className={cn('u-micro flex items-center gap-3', className)}>
      {index !== undefined && (
        <span className={dark ? 'text-clay' : 'text-clay-deep'}>
          {String(index).padStart(2, '0')}
        </span>
      )}
      <span
        aria-hidden="true"
        className={cn('h-px w-6 flex-none', dark ? 'bg-cream/30' : 'bg-coffee/25')}
      />
      <span className={dark ? 'text-cream/70' : 'text-coffee-soft'}>{children}</span>
    </RuleTag>
  )
}

/* -------------------------------------------------------------------------- */
/* Editorial link                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A tracked label on a rule that redraws on hover, with an arrow that walks.
 * The low-weight call to action: unmistakably a link, still an obvious
 * affordance, no furniture. All behaviour lives in `.u-cta`.
 */
export function CtaLink({
  href,
  children,
  tone = 'light',
  className,
}: {
  href: string
  children: ReactNode
  tone?: 'light' | 'dark' | 'clay'
  className?: string
}) {
  const classes = cn(
    'u-cta',
    {
      light: 'text-coffee hover:text-clay-deep',
      dark: 'text-cream hover:text-clay',
      clay: 'text-clay-deep hover:text-coffee',
    }[tone],
    className,
  )

  const content = (
    <>
      <span>{children}</span>
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="u-cta__arrow h-3 w-3">
        <path
          d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  )

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
