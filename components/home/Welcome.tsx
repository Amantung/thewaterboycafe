import Image from 'next/image'

import { welcome } from '@/lib/data/content'
import { menuPdfUrl } from '@/lib/site'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/ui/Editorial'
import { Icon } from '@/components/ui/Icon'

/**
 * The SEO-facing introduction beneath the hero.
 *
 * Sits between the hero's single tagline and the brand-story strip further
 * down the page: where `StoryStrip` speaks in the cafe's voice about how the
 * room came together, this section states plainly what a visitor gets —
 * dietary options, space, parking, who runs the place — in short, scannable
 * blocks rather than one long paragraph.
 */
export function Welcome() {
  return (
    <Section id="welcome" aria-labelledby="welcome-heading" className="bg-linen">
     <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <SectionHeading
        id="welcome-heading"
        eyebrow={welcome.eyebrow} 
        title={["Welcome to ", { text: 'The Waterboy Cafe', accent: true }]}
        size="xl"
      />

      <div className="mt-7 max-w-3xl space-y-5">
        {welcome.intro.map((paragraph, index) => (
          <Reveal key={index} delay={0.06 * index}>
            <p className="text-body text-coffee-soft">{paragraph}</p>
          </Reveal>
        ))}
      </div>
      </div>

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
        {welcome.features.map((feature) => (
          <RevealItem key={feature.id} className="flex">
            <article className="flex w-full flex-col overflow-hidden rounded-md border border-beige bg-linen/70">
              {feature.image ? (
                <div className="relative aspect-4/3 w-full overflow-hidden bg-sand">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt ?? ''}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 90vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="px-7 pt-7 sm:px-8 sm:pt-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-beige bg-cream text-clay-deep">
                    <Icon name={feature.icon} className="h-4.5 w-4.5" />
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <h3 className="text-display-xs text-coffee">{feature.title}</h3>
                <p className="mt-3 text-body-sm text-coffee-soft">{feature.body}</p>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-start justify-between gap-8 border-t border-beige pt-8 sm:mt-16 lg:flex-row lg:items-center">
          <p className="max-w-xl text-lead font-light text-coffee-soft">{welcome.closing}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <CtaLink href={menuPdfUrl}>View menu</CtaLink>
            <CtaLink href="/gallery">Explore our gallery</CtaLink>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
