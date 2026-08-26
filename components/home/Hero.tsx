'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { CtaLink } from '@/components/ui/Editorial'
import { Statement, MaskRise } from '@/components/ui/Statement'

const EASE = [0.22, 1, 0.36, 1] as const

const hero = {
  src: '/images/waterboy-resort.jpg',
  alt: "The Waterboy Cafe's shopfront on Chapel Street, Cowes, with the cafe's name lettered across the awning and the doors open to the street",
}
 
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-26%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-espresso"
    >
      {/* Photography ------------------------------------------------------ */}
      <motion.div
        style={reduceMotion ? undefined : { y: imageY }}
        className="absolute inset-0 will-change-transform"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { scale: 1.14, opacity: 0 }}
          animate={{ scale: 1.04, opacity: 1 }}
          transition={{
            scale: { duration: 2.2, ease: EASE },
            opacity: { duration: 1.1, ease: 'easeOut' },
          }}
          className="absolute inset-0"
        >
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            fetchPriority="high"
            quality={82}
            sizes="100vw"
            className="object-cover object-[50%_38%]"
          />
        </motion.div>
      </motion.div>

      <div aria-hidden="true" className="u-hero-scrim--home absolute inset-0" />

      {/* A second, shallow scrim just for the header band. The main scrim is
          tuned for the headline at the bottom of the frame; the transparent
          header sits on whatever the top of the photograph happens to be,
          which here is bright sky. This guarantees the nav is legible without
          darkening the middle of the picture to get there. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-espresso/55 via-espresso/20 to-transparent"
      />

      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-60" /> 

      {/* Copy ------------------------------------------------------------- */}
      <motion.div
        style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative w-full"
      >
        <div
          className="mx-auto w-full max-w-(--container-shell) px-5 pb-10 sm:px-8 lg:px-12 lg:pb-12"
          style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}
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
                <span className="text-clay">one cup at a time.</span>
              </>
            ]}
            className="max-w-[30ch]" // You may need to increase the max-width so it fits on one line!
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
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: reduceMotion ? 0 : 1.15, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-6"
            >
              <Button href="/menu" variant="onDark" size="lg" withArrow>
                View our menu
              </Button>
              <CtaLink href="/contact" tone="dark">
                Visit us
              </CtaLink>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
