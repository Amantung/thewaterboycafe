'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { primaryNav, homeSections } from '@/lib/data/navigation'
import { site, openingSummary, formattedAddress } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const SOLID_AFTER = 24

const LOGO = { src: '/images/waterboy-logo.png', width: 1024, height: 1024 }

/**
 * Site header.
 *
 * `fixed`, and with no spacer beneath it. Every route on this site opens on a
 * full-bleed photograph — the homepage hero, a `PageHeader` masthead
 * everywhere else — so the header's resting state is an overlay: hairline
 * rules and cream type sitting directly on the image, with no bar behind it.
 * That is the difference between a header that belongs to the photograph and
 * one parked above it. `PageHeader` reserves the clearance itself (see the
 * `--header-h` padding there), which is why nothing here reserves any.
 *
 * On scroll it becomes an opaque cream bar. The background is a separate
 * absolutely-positioned layer whose opacity is animated rather than the
 * header's own `background-color`, so the fill, the hairline and the shadow
 * all arrive as one compositable fade instead of three interpolated colours.
 * Height steps down at the same time — cheap, because a fixed element
 * changing height reflows nothing.
 *
 * The logo lives in the centre track of a `1fr auto 1fr` grid rather than
 * being absolutely positioned: the two equal side tracks keep it
 * mathematically centred at every width, and links or actions can grow in
 * their own track without nudging the mark off-centre.
 */
export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const reduceMotion = useReducedMotion()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  /* The sheet behind the mobile menu is espresso, so while it is open the
     header keeps its cream-on-dark treatment even if the page is scrolled. */
  const onDark = !scrolled || menuOpen
  const barFilled = scrolled && !menuOpen

  /* --- Solid state on scroll ---------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER)
    onScroll()
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
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -68% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [isHome])

  /* --- Mobile sheet: route change, Escape, scroll lock -------------------- */
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
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
    <header className="fixed inset-x-0 top-0 z-[60]">
      {/* --- The bar ------------------------------------------------------- */}
      <div
        className="relative z-10 transition-[height] duration-500 ease-editorial"
        style={{ height: barFilled ? 'var(--header-h-scrolled)' : 'var(--header-h)' }}
      >
        {/* Fill, hairline and shadow as one fading layer. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-10 border-b border-beige-strong/70 bg-cream/92 shadow-soft backdrop-blur-xl',
            'transition-opacity duration-500 ease-editorial',
            barFilled ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div className="mx-auto grid h-full max-w-(--container-shell) grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 lg:px-12">
          {/* Left — desktop nav, or the menu trigger below xl ------------- */}
          <div className="flex min-w-0 items-center justify-self-start">
            <ul className="hidden items-center xl:flex">
              {primaryNav.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (isHome && activeSection !== null && `/${activeSection}` === link.href)

                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={cn(
                        'u-nav-link__trigger u-micro block px-4 py-3 transition-colors duration-500',
                        onDark
                          ? isActive
                            ? 'text-cream'
                            : 'text-cream/70 hover:text-cream'
                          : isActive
                            ? 'text-coffee'
                            : 'text-coffee-soft hover:text-coffee',
                      )}
                    >
                      <span className="u-nav-link">
                        <span className="u-nav-link__inner">{link.label}</span>
                        <span aria-hidden="true" className="u-nav-link__ghost">
                          {link.label}
                        </span>
                      </span>
                    </Link>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-4 bottom-1.5 h-px origin-left transition-transform duration-500 ease-editorial',
                        onDark ? 'bg-clay' : 'bg-clay-deep',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </li>
                )
              })}
            </ul>

            {/* A worded trigger rather than a bare hamburger — the label is
                the affordance, the two rules are the ornament. */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={cn(
                'u-micro group -ml-1 inline-flex items-center gap-2.5 py-3 pl-1 pr-2 transition-colors duration-500 xl:hidden',
                onDark ? 'text-cream' : 'text-coffee',
              )}
            >
              <span aria-hidden="true" className="flex h-3 w-4 flex-col justify-center gap-[3px]">
                <span
                  className={cn(
                    'block h-px w-full bg-current transition-transform duration-400 ease-editorial',
                    menuOpen && 'translate-y-[2px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'block h-px w-full bg-current transition-transform duration-400 ease-editorial',
                    menuOpen ? '-translate-y-[2px] -rotate-45' : 'group-hover:translate-x-[3px]',
                  )}
                />
              </span>
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          {/* Centre — the mark ------------------------------------------- */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="group flex items-center gap-3 justify-self-center sm:gap-3.5"
          >
            <Image
              src={LOGO.src}
              alt=""
              aria-hidden="true"
              width={LOGO.width}
              height={LOGO.height}
              priority
              sizes="120px"
              className={cn(
                'rounded-full transition-[height,width,transform] duration-500 ease-editorial',
                'motion-ok:group-hover:rotate-[8deg]',
                barFilled ? 'h-8 w-8 xl:h-18 xl:w-18' : 'h-14 w-14 lg:h-24 lg:w-24',
              )}
            />
          </Link>

          {/* Right — utility and the visit action -------------------------- */}
          <div className="flex items-center gap-4 justify-self-end xl:gap-6">

            <Button
              href="/contact"
              size="sm"
              variant={onDark ? 'onDark' : 'primary'}
              withArrow
              className="hidden sm:inline-flex"
            >
              Visit us
            </Button>

            <Link
              href="/contact"
              className={cn(
                'u-micro sm:hidden',
                onDark ? 'text-cream' : 'text-coffee',
              )}
            >
              Visit
            </Link>
          </div>
        </div>
      </div>

      {/* --- Mobile sheet -------------------------------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="u-grain fixed inset-0 z-0 overflow-y-auto bg-espresso xl:hidden"
          >
            <div className="flex min-h-full flex-col justify-between px-5 pb-10 sm:px-8"
                 style={{ paddingTop: 'calc(var(--header-h) + 1.5rem)' }}>
              <nav aria-label="Primary">
                <ul>
                  {primaryNav.map((link, index) => (
                    <li key={link.href} className="border-b border-cream/10 last:border-0">
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.55,
                          delay: reduceMotion ? 0 : 0.12 + index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          aria-current={pathname === link.href ? 'page' : undefined}
                          className="group flex items-baseline gap-4 py-4 sm:py-5"
                        >
                          <span className="u-micro w-6 flex-none text-clay">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'text-display-lg transition-[color,transform] duration-500 ease-editorial motion-ok:group-hover:translate-x-1.5',
                              pathname === link.href ? 'text-clay' : 'text-cream',
                            )}
                          >
                            {link.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : 0.12 + primaryNav.length * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-14"
              >
                <Button href="/contact" onClick={closeMenu} variant="onDark" withArrow block>
                  Visit us
                </Button>

                <div className="mt-10 grid gap-8 border-t border-cream/10 pt-8 sm:grid-cols-2">
                  <div>
                    <p className="u-micro text-cream/40">Find us</p>
                    <p className="mt-3 text-body-sm text-cream/75">{formattedAddress}</p>
                    <p className="mt-1 text-body-sm text-cream/50">{openingSummary()}</p>
                  </div>

                  <div className="sm:text-right">
                    <p className="u-micro text-cream/40">Say hello</p>
                    <a
                      href={`tel:${site.phone}`}
                      className="u-label mt-3 block text-body-sm text-cream/75 transition-colors hover:text-cream"
                    >
                      {site.phoneDisplay}
                    </a>
                    <a
                      href={site.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-body-sm text-cream/75 transition-colors hover:text-clay"
                    >
                      {site.socials.instagramHandle}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
