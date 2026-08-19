import { cn } from '@/lib/utils'

/**
 * Hand-drawn line icon set.
 *
 * Inlined rather than pulled from an icon library: there are eleven of them,
 * they never change, and shipping a whole package to render eleven paths would
 * be the single largest dependency on the site.
 *
 * All icons share a 24×24 box, 1.4 stroke and round caps so they sit together
 * as a family. Purely decorative by default (`aria-hidden`) — the adjacent
 * label always carries the meaning. Pass `title` when an icon must stand alone.
 */

export type IconName =
  | 'sunrise'
  | 'wave'
  | 'paw'
  | 'bean'
  | 'cup'
  | 'utensils'
  | 'leaf'
  | 'heart'
  | 'clock'
  | 'pin'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'star'
  | 'quote'
  | 'arrowLeft'
  | 'arrowRight'
  | 'close'
  | 'menu'
  | 'check'
  | 'alert'

const PATHS: Record<IconName, React.ReactNode> = {
  sunrise: (
    <>
      <path d="M12 3v3M5.2 8.2 7 10M18.8 8.2 17 10M3 18h18M6 21h12" />
      <path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  wave: (
    <>
      <path d="M2 9c2.2 0 2.2 2 4.4 2S8.6 9 10.8 9s2.2 2 4.4 2S17.4 9 19.6 9c1.1 0 1.7.5 2.4 1" />
      <path d="M2 14c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2c1.1 0 1.7.5 2.4 1" />
      <path d="M2 19c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2" opacity=".45" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="8" cy="7.5" rx="1.9" ry="2.4" />
      <ellipse cx="16" cy="7.5" rx="1.9" ry="2.4" />
      <ellipse cx="4.6" cy="12.6" rx="1.7" ry="2.1" />
      <ellipse cx="19.4" cy="12.6" rx="1.7" ry="2.1" />
      <path d="M12 12.4c2.6 0 4.8 2.1 4.8 4.4 0 1.8-1.4 2.9-3.1 2.9-.9 0-1.2-.3-1.7-.3s-.8.3-1.7.3c-1.7 0-3.1-1.1-3.1-2.9 0-2.3 2.2-4.4 4.8-4.4Z" />
    </>
  ),
  bean: (
    <>
      <ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(35 12 12)" />
      <path d="M8.6 6.4c2.8 2.2 3.4 8.5 1.2 11.6" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 8.8-4.6 13.2-10.4 13.2A5.6 5.6 0 0 1 4 11.6C4 6.4 10.6 4 20 4Z" />
      <path d="M4.5 19.5C8 15 12.4 11.6 17 9.6" />
    </>
  ),
  cup: (
    <>
      <path d="M5.5 9.5h10.2v5.1a4.3 4.3 0 0 1-4.3 4.3h-1.6a4.3 4.3 0 0 1-4.3-4.3V9.5Z" />
      <path d="M15.7 10.6h1.2a2.35 2.35 0 1 1 0 4.7h-1.2" />
      <path d="M8.3 6.3c.6-.7 0-1.2-.3-1.9M12.2 6.3c.6-.7 0-1.2-.3-1.9" />
    </>
  ),
  utensils: (
    <>
      <path d="M6 3v4a3 3 0 0 0 3 3v11M9 3v4" />
      <ellipse cx="17.3" cy="6.4" rx="2.7" ry="3.4" />
      <path d="M17.3 9.8V21" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.3-4.4-9-9.2C1.9 7.5 3.7 4.4 7 4.4c2 0 3.7 1.2 5 3 1.3-1.8 3-3 5-3 3.3 0 5.1 3.1 4 6.4-1.7 4.8-9 9.2-9 9.2Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 6.8V12l3.4 2.2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-6.2 7-11.2a7 7 0 1 0-14 0c0 5 7 11.2 7 11.2Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  phone: (
    <path d="M6.3 3.5h3l1.6 4-2 1.4a12.4 12.4 0 0 0 6.2 6.2l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A17.4 17.4 0 0 1 4.3 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.3V5.4h-2.6c-2.4 0-3.9 1.5-3.9 4v2.1H7.7v3.1h2.6V21h3.3v-6.4h2.5l.4-3.1h-2.9V9.7c0-.8.3-1.2.9-1.2Z" />
  ),
  star: (
    <path
      d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  quote: (
    <path
      d="M9.4 6C6.3 7.5 4.5 10.2 4.5 13.3c0 2.7 1.6 4.5 3.9 4.5 2 0 3.5-1.5 3.5-3.4 0-1.9-1.3-3.3-3.1-3.3-.3 0-.6 0-.9.1.4-1.6 1.7-3 3.5-3.9L9.4 6Zm9 0c-3.1 1.5-4.9 4.2-4.9 7.3 0 2.7 1.6 4.5 3.9 4.5 2 0 3.5-1.5 3.5-3.4 0-1.9-1.3-3.3-3.1-3.3-.3 0-.6 0-.9.1.4-1.6 1.7-3 3.5-3.9L18.4 6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  arrowLeft: <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  arrowRight: <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.6v5.2" />
      <circle cx="12" cy="16.3" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
}

type IconProps = {
  name: IconName
  className?: string
  /** Supplying a title makes the icon exposed to assistive tech. */
  title?: string
  strokeWidth?: number
}

export function Icon({ name, className, title, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  )
}

/** Row of five stars. One accessible label, five decorative glyphs. */
export function StarRating({
  rating,
  className,
  size = 'h-4 w-4',
}: {
  rating: number
  className?: string
  size?: string
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5 text-clay', className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Icon
          key={index}
          name="star"
          className={cn(size, index < Math.round(rating) ? 'opacity-100' : 'opacity-25')}
        />
      ))}
    </span>
  )
}
