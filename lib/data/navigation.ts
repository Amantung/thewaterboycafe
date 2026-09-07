/**
 * Navigation model. The navbar, footer and breadcrumb builder all read from
 * here so a new page is a one-line change in a single place.
 */

export type NavLink = {
  label: string
  href: string
  /** Excluded from the footer's compact primary column. */
  secondary?: boolean
}

export const primaryNav: NavLink[] = [
  { label: 'Menu', href: '/menu.pdf' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

/** In-page anchors the homepage scroll-spy tracks, in document order. */
export const homeSections = [{ id: 'visit', label: 'Visit' }] as const

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Menu', href: '/menu.pdf' },
      { label: 'Our story', href: '/about' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    heading: 'Visit',
    links: [
      { label: 'Find us', href: '/contact' },
      { label: 'Get directions', href: '/contact#find-us' },
    ],
  },
]
