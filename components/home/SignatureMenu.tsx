'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'

import { menu, priceLabel, type MenuItem } from '@/lib/data/menu'
import { menuPdfUrl } from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/ui/Editorial'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

/**
 * The menu section — a list that drives a photograph.
 *
 * The interaction is the design here. Every photo in the active category is
 * mounted once and left mounted, stacked in one frame; moving between dishes
 * changes which one is present, never what exists. The outgoing plate settles
 * back and fades as the incoming one settles forward, so the frame reads as
 * one physical print being turned rather than a slideshow cutting between
 * slides — and because nothing mounts, unmounts or navigates, there is no
 * frame where the frame is empty and no lag on the first hover of each dish.
 *
 * Every hover response is a `transform`, an `opacity` or a colour. Nothing
 * changes size, padding or font-size, which is what stops a row growing under
 * the pointer and shoving its neighbour out from underneath it — the failure
 * mode that makes most hover-driven lists feel broken rather than responsive.
 *
 * Touch: the same handler runs on click and on focus, so tapping a row works
 * and so does tabbing to it. The frame sits above the list at a wider crop on
 * small screens specifically so a tap and its result are visible at the same
 * time — a preview a reader has to scroll back up to see is not a preview.
 */

type ShowcaseCategory = { id: string; name: string; eyebrow: string; items: MenuItem[] }

/** How many dishes each category shows here. Six fills the column against the
    sticky photograph without turning the homepage into the menu page. */
const PER_CATEGORY = 6

/**
 * Photographed dishes first, then the rest of the board in printed order.
 *
 * This used to filter to `item.image` only, which quietly gutted two of the
 * three categories: lunch has two photographed dishes and hot drinks has one,
 * so switching tab left a list of one or two rows beside a tall photograph —
 * or, combined with the reveal bug, nothing at all. Ordering by photograph
 * instead of filtering by it keeps every plate we have a picture of at the top
 * of the list and still fills the column with real menu content underneath.
 *
 * Nothing is invented and no image is reassigned: names, descriptions and
 * prices all come straight from the board transcription in lib/data/menu.ts,
 * and a dish without a photograph simply doesn't show one.
 */
const SHOWCASE: ShowcaseCategory[] = (['breakfast', 'lunch', 'hot-drinks'] as const)
  .map((id) => {
    const category = menu.find((entry) => entry.id === id)
    if (!category) return null

    const withImage = category.items.filter((item) => item.image)
    const withoutImage = category.items.filter((item) => !item.image)
    const items = [...withImage, ...withoutImage].slice(0, PER_CATEGORY)

    return items.length > 0
      ? { id: category.id, name: category.name, eyebrow: category.eyebrow, items }
      : null
  })
  .filter((category): category is ShowcaseCategory => category !== null)

/** Short display names — the data's full category names are too long to sit
    on one line of tabs, and "Coffee · Tea · Hot Drinks" is a heading, not a tab. */
const TAB_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  'hot-drinks': 'Coffee',
}

export function SignatureMenu() {
  const reduceMotion = useReducedMotion()
  const [categoryId, setCategoryId] = useState(SHOWCASE[0]?.id)
  const category = SHOWCASE.find((entry) => entry.id === categoryId) ?? SHOWCASE[0]
  const [itemId, setItemId] = useState(category?.items[0]?.id)
  const activeItem = category?.items.find((entry) => entry.id === itemId) ?? category?.items[0]

  if (!category || !activeItem) return null

  const selectCategory = (id: string) => {
    const next = SHOWCASE.find((entry) => entry.id === id)
    if (!next) return
    setCategoryId(id)
    setItemId(next.items[0]?.id)
  }

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="relative bg-cream u-section"
    >
      <Container>
        {/* Opener ------------------------------------------------------- */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            id="menu-heading" 
            eyebrow="From the kitchen"
            size="2xl"
            title={["What's on", { text: 'the table', accent: true }]}
          />

          <Reveal delay={0.12} className="lg:pb-3">
            <p className="max-w-sm text-body text-coffee-soft">
              Cooked to order, plated the same way every morning. Follow a dish
              with your cursor to see it — or tap, if you are reading this on
              the beach.
            </p>
            <CtaLink href={menuPdfUrl} className="mt-7">
              View the full menu
            </CtaLink>
          </Reveal>
        </div>

        {/* Categories ---------------------------------------------------- */}
        <Reveal delay={0.1}>
          {/* Toggle buttons, not ARIA tabs. A `role="tablist"` is a promise of
              tabpanels and arrow-key navigation between tabs; this is a filter
              over the list below it, and `aria-pressed` describes exactly that
              without claiming a widget the markup does not implement. */}
          <div
            role="group"
            aria-label="Menu categories"
            className="mt-14 flex flex-wrap items-center gap-x-9 gap-y-3 border-b border-coffee/12 sm:mt-16"
          >
            {SHOWCASE.map((entry) => {
              const isActive = entry.id === category.id
              return (
                <button
                  key={entry.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(entry.id)}
                  className={cn(
                    'u-micro relative pb-4 pt-1 transition-colors duration-500',
                    isActive ? 'text-coffee' : 'text-coffee-soft/50 hover:text-coffee-soft',
                  )}
                >
                  {TAB_LABELS[entry.id] ?? entry.name}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-px h-[2px] origin-left bg-clay-deep transition-transform duration-500 ease-editorial',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </button>
              )
            })}

            <span aria-hidden="true" className="u-micro ml-auto hidden pb-4 text-coffee-soft/40 sm:block">
              {category.eyebrow}
            </span>
          </div>
        </Reveal>

        {/* List + frame -------------------------------------------------- */}
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          {/* Frame — first on mobile, second on desktop. */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            {/* Taller on mobile than the 16/10 it had: the caption strip is a
                fixed height, so on a short crop it covered most of the plate
                and the type ended up over the brightest part of the photo. */}
            <div className="relative aspect-4/3 overflow-hidden rounded-md bg-espresso sm:aspect-3/2 lg:aspect-4/5">
              {/* Warm grain, so a dish we have no photograph of still shows a
                  considered surface rather than a flat brown rectangle. */}
              <div aria-hidden="true" className="u-grain absolute inset-0" />

              {category.items.map((item) => {
                if (!item.image) return null
                const isActive = item.id === activeItem.id
                return (
                  <div
                    key={item.id}
                    aria-hidden={!isActive}
                    className={cn(
                      'absolute inset-0 origin-center transition-[opacity,transform] ease-editorial',
                      reduceMotion ? 'duration-150' : 'duration-[700ms]',
                      isActive ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0',
                    )}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 40vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                )
              })}

              {/* The caption sits on this, not on the photograph. Dishes are
                  shot on white plates in daylight, so the scrim has to carry
                  the contrast on its own rather than hoping the crop is dark
                  where the type lands. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 via-40% to-espresso/5"
              />

              {/* Not every dish on the board has been photographed. Rather
                  than borrow another plate's picture — which would put the
                  wrong food under a dish name — the frame becomes a
                  typographic plate: this mark, and the caption below. */}
              {!activeItem.image && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 flex h-1/2 flex-col items-center justify-center gap-4"
                >
                  <span className="h-2.5 w-2.5 rotate-45 border border-clay/60" />
                  <span className="u-micro text-cream/30">{category.name}</span>
                </div>
              )}

              {/* Plate index — crossfades with the photograph. */}
              <div aria-hidden="true" className="pointer-events-none absolute left-5 top-5 sm:left-6 sm:top-6">
                {category.items.map((item, index) => (
                  <span
                    key={item.id}
                    className={cn(
                      'u-micro absolute left-0 top-0 whitespace-nowrap text-cream/70 transition-[opacity,transform] duration-500 ease-editorial',
                      item.id === activeItem.id
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-1 opacity-0',
                    )}
                  >
                    Plate {String(index + 1).padStart(2, '0')} /{' '}
                    {String(category.items.length).padStart(2, '0')}
                  </span>
                ))}
              </div>

              {/* Caption — fixed-height strip so a longer description can
                  never reflow the frame mid-transition. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 min-h-[8.5rem] p-6"
              >
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'absolute inset-x-6 bottom-6 transition-[opacity,transform] ease-editorial',
                      reduceMotion ? 'duration-150' : 'duration-500',
                      item.id === activeItem.id
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0',
                    )}
                  >
                    <p className="font-display text-display-sm text-cream">{item.name}</p>
                    {item.description && (
                      <p className="mt-2 max-w-sm text-body-sm text-cream/70">{item.description}</p>
                    )}
                    <p className="u-label mt-3 text-body text-clay">{priceLabel(item)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <RevealGroup
            as="ul"
            stagger={0.05}
            className="order-2 divide-y divide-coffee/10 border-b border-coffee/10 lg:order-1 lg:col-span-7"
          >
            {category.items.map((item, index) => {
              const isActive = item.id === activeItem.id
              return (
                <RevealItem key={item.id} as="li">
                  <button
                    type="button"
                    onMouseEnter={() => setItemId(item.id)}
                    onFocus={() => setItemId(item.id)}
                    onClick={() => setItemId(item.id)}
                    aria-pressed={isActive}
                    className="group relative block w-full py-6 text-left sm:py-7"
                  >
                    {/* Background wash. A separate layer so the row itself
                        never animates a colour, and it bleeds past the
                        gutters so the wash reads as the page reacting
                        rather than as a button lighting up. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'pointer-events-none absolute -inset-x-5 inset-y-0 -z-10 bg-sand/70 transition-opacity duration-500 ease-editorial',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />

                    <span
                      className={cn(
                        'flex items-baseline gap-4 transition-transform duration-500 ease-editorial sm:gap-6',
                        'motion-ok:group-hover:translate-x-1.5',
                        isActive && 'motion-ok:translate-x-1.5',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'u-micro w-6 flex-none transition-colors duration-500',
                          isActive ? 'text-clay-deep' : 'text-coffee-soft/40',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="relative block">
                          {/* Arrow is absolutely placed in the left margin, so
                              it can appear without moving the dish name a
                              single pixel. */}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            className={cn(
                              'absolute -left-7 top-[0.45em] hidden h-3.5 w-3.5 text-clay-deep transition-[opacity,transform] duration-500 ease-editorial sm:block',
                              isActive
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-2 opacity-0',
                            )}
                          >
                            <path
                              d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <span
                            className={cn(
                              'block font-display text-display-sm transition-colors duration-500 sm:text-display-md',
                              isActive ? 'text-clay-deep' : 'text-coffee',
                            )}
                          >
                            {item.name}
                          </span>
                        </span>

                        {item.description && (
                          <span
                            className={cn(
                              'mt-1.5 block max-w-lg text-body-sm transition-colors duration-500',
                              isActive ? 'text-coffee-soft' : 'text-coffee-soft/65',
                            )}
                          >
                            {item.description}
                          </span>
                        )}
                      </span>

                      <span
                        className={cn(
                          'u-label flex-none text-body transition-[color,transform] duration-500 ease-editorial',
                          isActive
                            ? 'text-clay-deep motion-ok:-translate-y-0.5'
                            : 'text-coffee-soft',
                        )}
                      >
                        {priceLabel(item)}
                      </span>
                    </span>
                  </button>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl text-body-sm text-coffee-soft/85">
            Vegetarian, vegan and gluten-free options throughout. Tell our team
            about allergies when you order — our kitchen is small, and we will
            always be straight with you about what we can and cannot guarantee.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
