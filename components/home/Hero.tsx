'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
 

/** One ease and one duration for the whole entrance, so it reads as one move. */
const EASE = [0.22, 1, 0.36, 1] as const

const rise = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
}

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

  // Image drifts down slower than the page; copy lifts away and fades.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.13])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100svh-5rem)] items-end overflow-hidden bg-espresso sm:min-h-[calc(100svh-6.5rem)]"
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
          className="object-cover object-[50%_35%]"
        />
      </motion.div>

      {/* Scrim, then grain. Order matters — the grain sits over the scrim so
          the whole frame shares one paper texture. */}
      <div aria-hidden="true" className="u-hero-scrim absolute inset-0" />
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-60" />
 
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
            <motion.div variants={rise} className="flex justify-center lg:justify-start">
              <Badge tone="dark">Cowes · Phillip Island</Badge>
            </motion.div>

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
          </motion.div>
        </Container>
      </motion.div> 
    </section>
  )
}
