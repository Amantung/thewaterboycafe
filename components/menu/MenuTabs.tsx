'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import type { MenuCategory } from '@/lib/data/menu'
import { cn } from '@/lib/utils'
import { MenuRow } from '@/components/menu/MenuRow'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Category switcher for the full menu.
 *
 * ── Two things here are load-bearing and must survive any refactor ─────────
 *
 * 1. EVERY panel is rendered into the HTML and inactive ones are hidden with
 *    the `hidden` attribute rather than unmounted. Mounting only the active
 *    category would leave five of six categories out of the served markup —
 *    most of the menu, and the single most valuable block of indexable text
 *    on the site.
 *
 * 2. It implements the WAI-ARIA tabs pattern properly, because a menu is
 *    exactly the page someone opens on a phone with VoiceOver running: roving
 *    tabindex (one tab stop for the strip, arrows between tabs, Home/End to
 *    the ends), each panel labelled by its tab and vice versa, and `hidden`
 *    keeping inactive panels out of the accessibility tree.
 *
 * ── What changed ──────────────────────────────────────────────────────────
 * The strip was a row of spring-animated pills with a `layoutId` shuttle and
 * `text-body-sm` labels — heavier UI than anything else on the site, and a
 * different interaction language from the homepage menu two clicks away. It
 * is now the homepage's treatment exactly: `u-micro` labels with a clay
 * underline that scales from its left edge. Same component vocabulary, one
 * less motion idiom.
 *
 * The strip is sticky beneath the site header, offset by `--header-h-scrolled`
 * so the two never overlap at any breakpoint, and scrolls horizontally on
 * narrow screens instead of wrapping into ragged lines.
 */
export function MenuTabs({ categories }: { categories: MenuCategory[] }) {
  const reduceMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(categories[0]?.id)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  // Suppresses the entrance animation on first paint — the panel is already
  // there, and fading it in would look like a loading state.
  const hasInteracted = useRef(false)
  // Which way the panel should slide in from — set just before the tab that
  // triggered the switch updates state, read by the panel that mounts next.
  const direction = useRef(1)

  const activeIndex = categories.findIndex((category) => category.id === activeId)

  useEffect(() => {
    if (!hasInteracted.current) return
    tabRefs.current[activeId]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeId, reduceMotion])

  const select = (id: string) => {
    hasInteracted.current = true
    const nextIndex = categories.findIndex((category) => category.id === id)
    direction.current = nextIndex >= activeIndex ? 1 : -1
    setActiveId(id)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const lastIndex = categories.length - 1
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1
    if (event.key === 'ArrowLeft') nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = lastIndex

    if (nextIndex !== null) {
      event.preventDefault()
      const next = categories[nextIndex]
      select(next.id)
      tabRefs.current[next.id]?.focus()
    }
  }

  if (categories.length === 0) return null

  return (
    <div>
      {/* Tabs -------------------------------------------------------------- */}
      <div
        className="sticky z-30 -mx-5 border-b border-coffee/12 bg-linen/92 px-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
        style={{ top: 'var(--header-h-scrolled)' }}
      >
        <div
          role="tablist"
          aria-label="Menu categories"
          onKeyDown={onKeyDown}
          className="u-no-scrollbar -mb-px flex gap-x-8 overflow-x-auto sm:gap-x-10"
        >
          {categories.map((category) => {
            const isActive = category.id === activeId

            return (
              <button
                key={category.id}
                ref={(element) => {
                  tabRefs.current[category.id] = element
                }}
                type="button"
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${category.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(category.id)}
                className={cn(
                  'u-micro relative shrink-0 whitespace-nowrap py-5 transition-colors duration-500',
                  isActive ? 'text-coffee' : 'text-coffee-soft/55 hover:text-coffee-soft',
                )}
              >
                {category.name}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-[2px] origin-left bg-clay-deep transition-transform duration-500 ease-editorial',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Panels ------------------------------------------------------------ */}
      {categories.map((category) => {
        const isActive = category.id === activeId

        return (
          <section
            key={category.id}
            role="tabpanel"
            id={`panel-${category.id}`}
            aria-labelledby={`tab-${category.id}`}
            tabIndex={0}
            hidden={!isActive}
            className="pt-16 focus:outline-none sm:pt-20"
          >
            <motion.div
              // Re-keyed on selection so the content settles in on each switch.
              key={`${category.id}-${isActive}`}
              initial={
                !hasInteracted.current || reduceMotion
                  ? false
                  : { opacity: 0, y: 14, x: direction.current * 12 }
              }
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionHeading
                eyebrow={category.eyebrow}
                title={category.name}
                description={category.description}
                level={2}
                size="md"
              />

              {category.note && (
                <p className="mt-4 max-w-xl text-body-sm text-coffee-soft/85">{category.note}</p>
              )}

              <ul className="mt-12 divide-y divide-coffee/10 border-y border-coffee/10 sm:mt-14">
                {category.items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </ul>
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}
