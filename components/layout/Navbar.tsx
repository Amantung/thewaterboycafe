'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { primaryNav, homeSections } from '@/lib/data/navigation'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

const SHADOW_AFTER = 24

const LOGO = { src: '/images/waterboy-logo.png', width: 1024, height: 1024 }

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const reduceMotion = useReducedMotion()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  /* --- Shadow depth on scroll ---------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHADOW_AFTER)
    onScroll() // Correct state on load and on a restored scroll position.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* --- Scroll-spy --------------------------------------------------------- */
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null)
      return
    }

    const elements = homeSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport among those visible —
        // "most intersecting" mis-fires on sections of very different heights.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      // Top band only: a section counts as "current" while its start sits in
      // the upper third of the viewport.
      { rootMargin: '-20% 0px -68% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [isHome])

  /* --- Mobile menu: route change, Escape, scroll lock ---------------------- */
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        // Return focus to the trigger so keyboard users don't lose their place.
        menuButtonRef.current?.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, closeMenu])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-white',
        'transition-[box-shadow,border-color] duration-300 ease-out',
        scrolled ? 'border-beige shadow-soft' : 'border-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex min-h-[5rem] max-w-(--container-shell) items-center px-5 py-2 sm:min-h-[6.5rem] sm:px-8 lg:px-12"
      >
        {/* Logo — absolutely centred on the header itself, not on the space
            left over between the nav links and the actions. Removed from
            normal flow entirely so shrinking it on scroll can never change
            the header's height or push anything else around. */}
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        >
          {/* The real brand mark. Decorative here — the link above carries
              the accessible name. */}
          <Image
            src={LOGO.src}
            alt=""
            aria-hidden="true"
            width={LOGO.width}
            height={LOGO.height}
            priority
            sizes="100px"
            className={cn(
              'rounded-full shadow-soft transition-[height,width,transform] duration-300 ease-out motion-reduce:transition-none',
              'group-hover:rotate-[8deg]',
              scrolled ? 'h-12 w-12 sm:h-16 sm:w-16' : 'h-14 w-14 sm:h-20 sm:w-20',
            )}
          />
        </Link>

        {/* Desktop links — held to `xl:` rather than `lg:` so this group and
            the actions group never have to sit close enough to the true
            centre to crowd the logo; see the note on the phone link below. */}
        <ul className="hidden items-center gap-1 xl:flex">
          {primaryNav.map((link) => {
            const isActive =
              pathname === link.href ||
              (isHome && activeSection && `/${activeSection}` === link.href.toLowerCase())

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'u-eyebrow relative rounded-full px-4 py-2.5 transition-colors duration-300',
                    'hover:bg-sand/70',
                    isActive ? 'text-coffee' : 'text-coffee-soft hover:text-coffee',
                  )}
                >
                  {link.label}
                  {/* Active indicator — a dot, not an underline, so it reads
                      as editorial rather than as a browser tab. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      aria-hidden="true"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                      className="absolute inset-x-4 -bottom-0.5 h-px bg-clay-deep"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Actions — `ml-auto` (not `justify-between`) pushes this to the far
            right whether or not the nav links beside it are rendered, so the
            layout holds on both mobile (links hidden) and desktop. */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Only appears once there is genuine room beside the nav links —
              at narrower desktop/tablet widths it would sit close enough to
              the centred logo to crowd it. */}
          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-coffee-soft transition-colors duration-300 hover:text-coffee xl:inline-flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            <span className="u-label">{site.phoneDisplay}</span>
          </a>

          <Button
            href="/reserve"
            size="sm"
            variant="primary"
            withArrow
            className="hidden sm:inline-flex"
          >
            Reserve a table
          </Button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-beige-strong text-coffee transition-colors duration-300 hover:bg-sand xl:hidden"
          >
            <Icon
              name={menuOpen ? 'close' : 'menu'}
              className="h-5 w-5"
              title={menuOpen ? 'Close menu' : 'Open menu'}
            />
          </button>
        </div>
      </nav>

      {/* Mobile panel ------------------------------------------------------ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-beige bg-linen xl:hidden"
          >
            <ul className="mx-auto max-w-(--container-shell) px-5 py-4 sm:px-8">
              {primaryNav.map((link) => (
                <li key={link.href} className="border-b border-beige/70 last:border-0">
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between py-4 text-display-xs',
                      pathname === link.href ? 'text-clay-deep' : 'text-coffee',
                    )}
                  >
                    {link.label}
                    <Icon name="arrowRight" className="h-4 w-4 opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mx-auto flex max-w-(--container-shell) flex-col gap-3 px-5 pb-6 sm:px-8">
              <Button href="/reserve" onClick={closeMenu} size="md" withArrow className="w-full">
                Reserve a table
              </Button>
              <Button href={`tel:${site.phone}`} variant="secondary" size="md" className="w-full">
                <Icon name="phone" className="h-4 w-4" />
                {site.phoneDisplay}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
