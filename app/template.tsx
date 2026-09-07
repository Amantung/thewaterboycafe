'use client'

import { useLayoutEffect } from 'react'

/**
 * Forces the top-of-page landing on every real navigation.
 *
 * `html { scroll-behavior: smooth }` in globals.css is there for intentional
 * anchor-link jumps, but that CSS property also intercepts Next.js's own
 * `scrollTo(0, 0)` reset after a client-side route change (bare `scrollTo`
 * calls inherit `scroll-behavior` from the page per the CSSOM spec) — the
 * animated version of that reset gets interrupted by layout shifts as the
 * new route's images/fonts load, leaving the page stuck mid-scroll. This
 * file remounts on every navigation (a layout would not), so its effect is
 * the reliable hook to correct that: neutralise the CSS smoothing only for
 * this one reset, and only when the visitor actually landed on a new page.
 *
 * Two cases are deliberately left untouched:
 *  - a URL with a hash — the browser's own smooth scroll to that anchor
 *    should run exactly as CSS intends.
 *  - browser back/forward — the browser already restores prior scroll
 *    position for a POP navigation; forcing the top here would fight that.
 */
let isPopNavigation = false

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    isPopNavigation = true
  })
}

export default function Template({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    if (isPopNavigation) {
      isPopNavigation = false
      return
    }

    if (window.location.hash) return

    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)

    // Restored on a macrotask, not synchronously: Next's own router runs a
    // passive-effect scroll pass shortly after this layout effect, and that
    // pass must still see `auto` or it re-introduces the same smooth-scroll
    // drift this effect exists to prevent.
    const timer = setTimeout(() => {
      root.style.scrollBehavior = previousScrollBehavior
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return children
}
