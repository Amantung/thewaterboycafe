'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { CtaLink } from '@/components/ui/Editorial'
import { Statement, MaskRise } from '@/components/ui/Statement'
import { directionsUrl, menuPdfUrl } from '@/lib/site'

const EASE = [0.22, 1, 0.36, 1] as const

const hero = {
  src: '/images/waterboy-resort.jpg',
  alt: "The Waterboy Cafe's shopfront on Chapel Street, Cowes, with the cafe's name lettered across the awning and the doors open to the street",
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col justify-between overflow-hidden bg-espresso sm:min-h-svh sm:justify-end"
    >
      {/* Photography ------------------------------------------------------ */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative h-[48vh] w-full shrink-0 pt-[var(--header-h)] sm:absolute sm:inset-0 sm:h-full sm:pt-0"
      >
        <div className="relative h-full w-full">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            fetchPriority="high"
            quality={82}
            sizes="100vw"
            className="object-cover object-top sm:object-[50%_38%]"
          />
        </div>
      </motion.div>

      {/* Scrim Overlays */}
      <div aria-hidden="true" className="u-hero-scrim--home absolute inset-0 hidden sm:block" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 hidden h-48 bg-gradient-to-b from-espresso/55 via-espresso/20 to-transparent sm:block"
      />
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-60 pointer-events-none" />

      {/* Copy ------------------------------------------------------------- */}
      <div className="relative w-full">
        <div
          className="mx-auto w-full max-w-(--container-shell) px-5 pb-10 pt-6 sm:px-8 sm:pb-10 sm:pt-[calc(var(--header-h)+3rem)] lg:px-12 lg:pb-12"
        >
          <Statement
            as="h1"
            id="hero-heading"
            size="statement"
            tone="dark"
            trigger="load"
            delay={0.35}
            lines={[
              <>
                Happiness comes {' '}
                <span className="text-clay"> one cup at a time.</span>
              </>
            ]}
            className="max-w-[30ch]"
          />

          <div className="mt-9 max-w-[700px] lg:mt-11">
            <MaskRise delay={0.95} trigger="load">
              <p className="text-lead font-light text-cream/80">
                A family-run cafe a short walk from the Cowes foreshore.
                Scratch-made breakfast and lunch, Five Senses specialty coffee,
                and a dog-friendly courtyard with your name on it.
              </p>
            </MaskRise>

            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.55, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-6"
            >
              <Button href={menuPdfUrl} variant="onDark" size="lg" withArrow>
                View menu
              </Button>
              <CtaLink href={directionsUrl} tone="dark">
                Visit us
              </CtaLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}