import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The one button in the system.
 *
 * Renders an `<a>` when given `href` and a `<button>` otherwise, so a link that
 * looks like a button is still a link — keyboard users get the right affordance
 * and middle-click still opens a new tab.
 *
 * Server component: no state, no handlers, no client bundle cost.
 *
 * ── The design ────────────────────────────────────────────────────────────
 * Everything structural — pill radius, uppercase Poppins at 500 with 0.14em
 * tracking, the flex centring, the transitions and the hover wipe — lives in
 * `.u-btn` in globals.css. That is deliberate: it means a button cannot end up
 * with different proportions or a different hover depending on which page it
 * is on. This file only chooses a skin and a size.
 *
 * The hover is a wipe rather than a colour swap: a pseudo-element in the
 * variant's accent rises from the bottom edge behind the label over 550ms. It
 * animates `transform` only, so it composites on the GPU. `--btn-wipe` is the
 * one thing each variant has to supply.
 *
 * Sizes are on a 1.15× ramp and every one keeps the label optically centred —
 * uppercase type has no descenders, so the vertical padding is set slightly
 * tighter at the bottom than a naive `py-` would give.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkOutline'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  /* Deep coffee on linen — 9.8:1, comfortably AAA. Wipes to espresso, and the
     ring lifts to clay so the edge reads as considered rather than flat. */
  primary: cn(
    'bg-coffee text-cream border-coffee shadow-soft',
    '[--btn-wipe:var(--color-espresso)]',
    'hover:border-espresso hover:shadow-lifted',
  ),

  /* Outlined, for the second action in a pair. Wipes to coffee and inverts. */
  secondary: cn(
    'bg-transparent text-coffee border-beige-strong',
    '[--btn-wipe:var(--color-coffee)]',
    'hover:text-cream hover:border-coffee',
  ),

  /* Lowest emphasis — inline actions, tertiary links, form cancels. */
  ghost: cn(
    'bg-transparent text-coffee-soft border-transparent',
    '[--btn-wipe:var(--color-sand)]',
    'hover:text-coffee',
  ),

  /* Over photography. Solid cream so legibility never depends on the image. */
  onDark: cn(
    'bg-cream text-coffee border-cream shadow-lifted',
    '[--btn-wipe:#fff]',
    'hover:border-white',
  ),

  /* The quiet partner to onDark. A hairline in cream, filling to cream on
     hover — the pairing that stops two solid buttons fighting over a hero. */
  onDarkOutline: cn(
    'bg-transparent text-cream border-cream/45',
    '[--btn-wipe:var(--color-cream)]',
    'hover:text-coffee hover:border-cream',
  ),
}

/**
 * Padding is asymmetric on purpose: uppercase labels sit optically high in
 * their line box, so a hair more padding below than above centres them.
 */
const SIZES: Record<Size, string> = {
  sm: 'px-6 pb-[0.6875rem] pt-2.5 text-[0.6875rem]',
  md: 'px-8 pb-[0.9375rem] pt-3.5 text-[0.75rem]',
  lg: 'px-10 pb-[1.1875rem] pt-[1.0625rem] text-[0.8125rem]',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Trailing arrow that slides on hover — for forward navigation. */
  withArrow?: boolean
  /** Stretch to the container. Preferred over passing `w-full` by hand. */
  block?: boolean
}

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, 'className' | 'children'> & { href: string }

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: never }

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    withArrow = false,
    block = false,
    ...rest
  } = props

  const classes = cn(
    'u-btn',
    VARIANTS[variant],
    SIZES[size],
    // Lifts a hair on hover. Subtle enough to feel like paper, not a toy.
    'motion-ok:hover:-translate-y-0.5',
    block ? 'w-full' : 'w-auto',
    className,
  )

  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </>
  )

  if ('href' in rest && rest.href) {
    const { href, ...linkProps } = rest as ButtonAsLink
    const isExternal = /^(https?:|mailto:|tel:)/.test(href)

    // External destinations get a plain anchor — Link's prefetching and
    // client-side routing do nothing useful for an off-site URL.
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
          {...(linkProps as ComponentProps<'a'>)}
        >
          {content}
        </a>
      )
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    )
  }

  const { ...buttonProps } = rest as ButtonAsButton
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  )
}

/** Decorative — the surrounding label already carries the meaning. */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="u-btn__arrow h-3 w-3"
    >
      <path
        d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
