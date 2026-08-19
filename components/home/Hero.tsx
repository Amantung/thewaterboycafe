'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

import { openingSummary } from '@/lib/site'
import { img } from '@/lib/data/images'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'

/**
 * Full-bleed hero.
 *
 * ── The composition ───────────────────────────────────────────────────────
 * The copy sits in a left-hand column rather than dead centre. Centred hero
 * text over a photograph is the default everyone reaches for, and it fights
 * the image: the headline lands on the busiest part of the frame and nothing
 * has a clear reading order. Anchoring the block low and left gives a single
 * diagonal — eyebrow, headline, standfirst, buttons — and leaves the
 * photograph's own subject (the tables, the palm, the water) unobstructed on
 * the right.
 *
 * Hierarchy is carried by scale and colour, not by weight: DM Serif Display
 * has one weight, so the headline steps up two full sizes from the standfirst
 * and the second line goes italic clay. That is the whole emphasis system.
 *
 * ── Performance ───────────────────────────────────────────────────────────
 * This is the LCP element on the site, so:
 *   • `priority` + `fetchPriority="high"`, no lazy loading, so the image is in
 *     the first wave of requests.
 *   • The parallax moves the image with `transform` only — a compositor-only
 *     property, so scrolling never triggers layout or paint.
 *   • The headline is server-rendered text with a CSS-driven entrance, not a
 *     JS typewriter, so the LCP text paints on the first frame.
 *   • Reduced motion disables the parallax and the stagger entirely rather
 *     than merely shortening them.
 */

/** One ease and one duration for the whole entrance, so it reads as one move. */
const EASE = [0.22, 1, 0.36, 1] as const

const rise = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
}

const facts = [
  { icon: 'clock' as const, label: openingSummary() },
  { icon: 'bean' as const, label: 'Five Senses Coffee' },
  { icon: 'paw' as const, label: 'Dog-friendly courtyard' },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const hero = img('heroMain')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Image drifts down slower than the page; copy lifts away and fades.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.13])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-espresso"
    >
      {/* Photography ------------------------------------------------------ */}
      <motion.div
        style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          fetchPriority="high"
          quality={82}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Scrim, then grain. Order matters — the grain sits over the scrim so
          the whole frame shares one paper texture. */}
      <div aria-hidden="true" className="u-hero-scrim absolute inset-0" />
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-60" />

      {/* Copy ------------------------------------------------------------- */}
      <motion.div
        style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative w-full pb-24 pt-40 sm:pb-28 lg:pb-32"
      >
        <Container>
          <motion.div
            initial="hidden"
            animate="shown"
            transition={reduceMotion ? { duration: 0 } : { staggerChildren: 0.11 }}
            className="max-w-3xl text-center lg:text-left"
          >
            <motion.p
              variants={rise}
              className="u-eyebrow flex items-center justify-center gap-3 text-cream/70 lg:justify-start"
            >
              <span aria-hidden="true" className="h-px w-10 flex-none bg-clay" />
              Cowes · Phillip Island
            </motion.p>

            <motion.h1
              id="hero-heading"
              variants={rise}
              className="mt-7 text-display-xl text-cream"
            >
              Cosy beachside coffee,
              <span className="mt-1 block text-clay">made fresh every day</span>
            </motion.h1>

            <motion.p
              variants={rise}
              className="mx-auto mt-8 max-w-xl text-lead font-light text-cream/80 lg:mx-0"
            >
              A family-run cafe a short walk from the Cowes foreshore. Scratch-made
              breakfast and lunch, Five Senses specialty coffee, and a dog-friendly
              courtyard with your name on it.
            </motion.p>

            <motion.div
              variants={rise}
              className="mt-11 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start"
            >
              <Button href="/menu" variant="onDark" size="lg" withArrow>
                View the menu
              </Button>
              <Button href="/contact" variant="onDarkOutline" size="lg">
                Find us
              </Button>
            </motion.div>

            {/* Trust strip — the three facts a first-time visitor wants, set
                off by a hairline so it reads as a footnote to the block
                rather than a fourth level of hierarchy. */}
            <motion.ul
              variants={rise}
              className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream/15 pt-7 text-cream/70 lg:justify-start"
            >
              {facts.map((fact) => (
                <li
                  key={fact.label}
                  className="flex items-center gap-2.5 text-body-sm"
                >
                  <Icon name={fact.icon} className="h-4 w-4 flex-none text-clay" />
                  {fact.label}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </Container>
      </motion.div>

      {/* Scroll cue ------------------------------------------------------- */}
      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.9 }}
        className="absolute bottom-7 right-6 z-10 hidden rounded-full p-2 text-cream/50 transition-colors hover:text-cream lg:right-12 lg:block"
        aria-label="Skip to our story"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v15m0 0-6-6m6 6 6-6" />
          </svg>
        </motion.span>
      </motion.a>
    </section>
  )
}
