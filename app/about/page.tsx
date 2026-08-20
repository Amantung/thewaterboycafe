import Image from 'next/image'
import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { about } from '@/lib/data/content'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Highlights } from '@/components/home/Highlights'

export const metadata: Metadata = {
  title: 'Our story',
  description: `How ${site.name} came to be — a family-run beachside cafe in Cowes, Phillip Island, cooking from scratch and pouring Five Senses specialty coffee seven days a week.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `Our story · ${site.name}`,
    description:
      'A family-run beachside cafe in Cowes: scratch-made food, Five Senses coffee, and a room built around one very good window.',
    url: '/about',
  },
}

const founders = {
  src: '/images/founders.jpg',
  alt: 'Two members of the cafe team smiling beside the pastry cabinet, with the espresso machine and coffee shelves behind them',
}
const sourcing = {
  src: '/images/about-local-produce-sourcing.jpg',
  alt: 'Crates of fresh vegetables and herbs stacked at a produce market',
}

export default function AboutPage() {
  const graph = buildGraph(breadcrumbSchema([{ name: 'About', path: '/about' }]))

  return (
    <>
      <PageHeader
        eyebrow="Since the beginning"
        title="A family-run cafe with the best window in Cowes"
        description={about.intro}
        breadcrumbs={[{ name: 'About', path: '/about' }]}
        imageSrc="/images/gallery-window-seat-timber-stools.jpg"
        imageAlt="Afternoon sun falling across timber stools at a cafe window counter"
      />

      {/* Chapters ---------------------------------------------------------- */}
      <Section aria-labelledby="chapters-heading" className="bg-linen">
        <h2 id="chapters-heading" className="sr-only">
          Our story
        </h2>

        <div className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          <div className="space-y-16">
            {about.chapters.map((chapter, index) => (
              <Reveal key={chapter.id} delay={index * 0.04}>
                <article className="relative border-l border-beige-strong pl-8">
                  {/* Marker on the timeline rule. */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-linen bg-clay"
                  />
                  <Badge>{chapter.eyebrow}</Badge>
                  <h3 className="mt-3 text-display-sm text-coffee">{chapter.heading}</h3>
                  <p className="mt-4 text-body text-coffee-soft">{chapter.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Sticky image column — stays with the reader through the
              timeline on desktop, stacks normally on mobile. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal direction="left">
              <div className="relative aspect-4/3 overflow-hidden rounded-md bg-sand shadow-lifted">
                <Image
                  src={founders.src}
                  alt={founders.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} direction="left">
              <div className="relative mt-5 aspect-4/3 overflow-hidden rounded-md bg-sand shadow-soft">
                <Image
                  src={sourcing.src}
                  alt={sourcing.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Values ------------------------------------------------------------ */}
      <Section aria-labelledby="values-heading" className="bg-cream">
        <SectionHeading
          id="values-heading"
          eyebrow="How we work"
          title="Four rules we do not bend"
          align="center"
          className="max-w-2xl"
        />

        <RevealGroup className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((value, index) => (
            <RevealItem key={value.title}>
              <div className="relative pt-8">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 text-display-sm text-clay/35"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-display-xs text-coffee">{value.title}</h3>
                <p className="mt-3 text-body-sm text-coffee-soft">{value.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Team -------------------------------------------------------------- */}
      <Section aria-labelledby="team-heading" className="bg-linen">
        <SectionHeading
          id="team-heading"
          eyebrow="The people"
          title="Who you will actually meet"
          description="Owner-operated, seven days. The people making your coffee are the ones whose name is over the door."
          className="max-w-xl"
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.team.map((member) => (
            <RevealItem key={member.id}>
              <article className="h-full rounded-md border border-beige bg-cream/60 p-7 sm:p-8">
                <Badge>{member.role}</Badge>
                <h3 className="mt-3 text-display-xs text-coffee">{member.name}</h3>
                <p className="mt-4 text-body-sm text-coffee-soft">{member.bio}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Highlights />

      {/* CTA --------------------------------------------------------------- */}
      <Section className="bg-cream" space="sm" width="narrow" innerClassName="text-center">
        <Reveal>
          <h2 className="text-display-md text-coffee">Come and sit by the window</h2>
          <p className="mx-auto mt-5 max-w-lg text-lead font-light text-coffee-soft">
            Walk-ins are always welcome. If you are bringing a group, send a request
            through and we will put some tables together.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/reserve" size="lg" withArrow>
              Reserve a table
            </Button>
            <Button href="/menu" size="lg" variant="secondary">
              Browse the menu
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd id="schema-about" data={graph} />
    </>
  )
}
