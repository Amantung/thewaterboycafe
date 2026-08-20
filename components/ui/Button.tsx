import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The one button in the system.
 *
 * Renders an `<a>` when given `href` and a `<button>` otherwise, so a link
 * that looks like a button is still a link — keyboard users get the right
 * affordance and middle-click still opens a new tab. Server component: no
 * state, no handlers, no client bundle cost.
 *
 * Everything structural — the radius, the uppercase type, the tracking, the
 * padding ramp, the transitions and the hover wipe — lives in `.u-btn` and
 * `.u-btn--{sm,md,lg}` in globals.css. This file only picks a skin and a
 * size, which is what stops a button ending up with different proportions
 * depending on which page it is on. There is exactly one button shape
 * (`--radius-sm`); a `shape="pill"` escape hatch existed and was removed
 * because nothing used it and a second shape is a second system.
 *
 * The hover is a wipe, not a colour swap: a pseudo-element in the variant's
 * accent rises from the bottom edge behind the label. It animates `transform`
 * only, so it composites on the GPU. `--btn-wipe` is the one thing each
 * variant has to supply.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkOutline'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  /* Deep coffee on linen — comfortably AAA. Wipes to espresso. */
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
  /* Over photography. Solid cream, so legibility never depends on the image. */
  onDark: cn(
    'bg-cream text-coffee border-cream shadow-lifted',
    '[--btn-wipe:#ffffff]',
    'hover:border-white',
  ),
  /* The quiet partner to onDark — the pairing that stops two solid buttons
     fighting over a hero. */
  onDarkOutline: cn(
    'bg-transparent text-cream border-cream/45',
    '[--btn-wipe:var(--color-cream)]',
    'hover:text-coffee hover:border-cream',
  ),
}
 
/** Padding and font-size live in `.u-btn--*` in globals.css, so the button's
    type scale sits with the rest of the type system rather than as arbitrary
    values here. */
const SIZES: Record<Size, string> = {
  sm: 'u-btn--sm',
  md: 'u-btn--md',
  lg: 'u-btn--lg',
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
    'motion-ok:hover:-translate-y-0.5', 
    block ? 'w-full' : 'w-auto',
    className,
  )

  const content = (
    <>
      <span className="u-btn__label relative z-10">{children}</span>
      {withArrow && <Arrow />}
    </>
  )

  if ('href' in rest && rest.href) {
    const { href, ...linkProps } = rest as ButtonAsLink
    const isExternal = /^(https?:|mailto:|tel:)/.test(href)

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

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="u-btn__arrow relative z-10 h-3 w-3"
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