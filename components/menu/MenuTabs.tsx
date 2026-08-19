'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import type { MenuCategory } from '@/lib/data/menu'
import { cn } from '@/lib/utils'
import { MenuCard, MenuRow } from '@/components/menu/MenuCard'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

/**
 * Category switcher for the full menu.
 *
 * SEO decision worth preserving: EVERY panel is rendered into the HTML and the
 * inactive ones are hidden with the `hidden` attribute, rather than being
 * unmounted. Mounting only the active category would leave five of six
 * categories out of the served markup — most of the menu, which is the single
 * most valuable block of indexable text on the site.
 *
 * Implements the WAI-ARIA tabs pattern properly, because a menu is exactly the
 * kind of page someone will open on a phone with VoiceOver running:
 *   • roving tabindex — one tab stop for the strip, arrows move between tabs,
 *     Home/End jump to the ends
 *   • each panel is labelled by its tab and vice versa
 *   • `hidden` keeps inactive panels out of the accessibility tree, so browse
 *     mode cannot wander into a category the user is not looking at
 *
 * The tab strip scrolls horizontally on narrow screens instead of wrapping
 * into three ragged lines.
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
      <div className="sticky top-32 z-30 -mx-5 border-b border-beige bg-linen/92 px-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div
          role="tablist"
          aria-label="Menu categories"
          onKeyDown={onKeyDown}
          className="u-no-scrollbar -mb-px flex gap-1 overflow-x-auto py-2"
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
                  'relative shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm transition-colors duration-300',
                  isActive ? 'text-coffee' : 'text-coffee-soft hover:text-coffee',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-tab-pill"
                    aria-hidden="true"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 400, damping: 34 }
                    }
                    className="absolute inset-0 rounded-full border border-beige-strong bg-cream"
                  />
                )}
                <span className="relative">{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Panels ------------------------------------------------------------ */}
      {categories.map((category) => {
        const isActive = category.id === activeId
        const layout = category.layout ?? 'cards'

        return (
          <section
            key={category.id}
            role="tabpanel"
            id={`panel-${category.id}`}
            aria-labelledby={`tab-${category.id}`}
            tabIndex={0}
            hidden={!isActive}
            className="pt-14 focus:outline-none"
          >
            <motion.div
              // Re-keyed on selection so the content fades in on each switch.
              key={`${category.id}-${isActive}`}
              initial={
                !hasInteracted.current || reduceMotion
                  ? false
                  : { opacity: 0, y: 14, x: direction.current * 12 }
              }
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-2xl">
                <p className="u-eyebrow text-clay-deep">{category.eyebrow}</p>
                <h2 className="mt-4 text-display-md text-coffee">{category.name}</h2>
                <p className="mt-5 text-lead font-light text-coffee-soft">
                  {category.description}
                </p>
                {category.note && (
                  <p className="mt-3 text-body-sm italic text-coffee-soft/80">{category.note}</p>
                )}
              </div>

              {layout === 'cards' ? (
                <RevealGroup
                  className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                  stagger={0.06}
                >
                  {category.items.map((item) => (
                    <RevealItem key={item.id}>
                      <MenuCard item={item} className="h-full" />
                    </RevealItem>
                  ))}
                </RevealGroup>
              ) : (
                <ul className="mt-12 divide-y divide-beige">
                  {category.items.map((item) => (
                    <MenuRow key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}
