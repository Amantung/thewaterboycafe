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
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
]

/** In-page anchors the homepage scroll-spy tracks, in document order. */
export const homeSections = [
  { id: 'story', label: 'Story' },
  { id: 'menu', label: 'Menu' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'why-us', label: 'Why us' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'visit', label: 'Visit' },
] as const

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Full menu', href: '/menu' },
      { label: 'Our story', href: '/about' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    heading: 'Visit',
    links: [
      { label: 'Find us', href: '/contact' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Get directions', href: '/contact#find-us' },
    ],
  },
]
