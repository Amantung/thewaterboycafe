'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { primaryNav, homeSections } from '@/lib/data/navigation'
import { site } from '@/lib/site'
import { img } from '@/lib/data/images'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
 
const SHADOW_AFTER = 24 

const logo = img('logo')

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
        'sticky top-0 z-50 border-b border-beige/80 bg-linen/95 backdrop-blur-md',
        'transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'supports-[backdrop-filter]:bg-linen/85',
        scrolled && 'shadow-soft',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-(--container-shell) items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12"
      >
        {/* Logo  -------------------------------------------------- */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label={`${site.name} — home`}
        >
          {/* The real brand mark. Decorative here — the wordmark beside it
              carries the accessible name via the link's aria-label. */}
          <Image
            src={logo.src}
            alt=""
            aria-hidden="true"
            width={logo.width}
            height={logo.height}
            priority
            sizes="150px"
            className="h-11 w-11 shrink-0 rounded-full transition-transform duration-500 ease-editorial group-hover:rotate-[8deg] sm:h-24 sm:w-24"
          /> 
        </Link>

        {/* Desktop links --------------------------------------------------- */}
        <ul className="hidden items-center gap-1 lg:flex">
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

        {/* Actions --------------------------------------------------------- */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-coffee-soft transition-colors duration-300 hover:text-coffee md:inline-flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            <span className="u-label">{site.phoneDisplay}</span>
          </a>

          <Button
            href="/reserve"
            size="sm"
            variant="primary"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-beige-strong text-coffee transition-colors duration-300 hover:bg-sand lg:hidden"
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
            className="overflow-hidden border-t border-beige bg-linen lg:hidden"
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
              <Button href="/reserve" onClick={closeMenu} size="md" className="w-full">
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
