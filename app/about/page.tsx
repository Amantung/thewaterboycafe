import Image from 'next/image'
import type { Metadata } from 'next'

import { site, directionsUrl, menuPdfUrl } from '@/lib/site'
import { about } from '@/lib/data/content'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/Editorial'
import { Highlights } from '@/components/home/Highlights'
import { StoryStrip } from '@/components/home/StoryStrip'

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
  src: '/images/sitting.jpg',
  alt: 'Two members of the cafe team smiling beside the pastry cabinet, with the espresso machine and coffee shelves behind them',
}
const sourcing = {
  src: '/images/caramel-finish.png',
  alt: 'Crates of fresh vegetables and herbs stacked at a produce market',
}

export default function AboutPage() {
  const graph = buildGraph(breadcrumbSchema([{ name: 'About', path: '/about' }]))

  return (
    <>
      <PageHeader
        eyebrow="Since the beginning"
        title={['A small beachside cafe', { text: 'made for slow mornings.', accent: true }]}
        description={about.intro} 
        imageSrc="/images/beach-morning-cafe.png"
        imageAlt="Afternoon sun falling across timber stools at a cafe window counter"
      />

      <StoryStrip /> 
  {/* Team -------------------------------------------------------------- */}
      <Section aria-labelledby="team-heading" className="bg-cream"> 
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                  <SectionHeading
                    id="team-heading"
                    eyebrow="From the kitchen"
                    size="2xl"
                    title={["Who you will ", { text: 'actually meet', accent: true }]}
                  />
        
                  <Reveal delay={0.12} className="lg:pb-3">
                    <p className="max-w-sm text-body text-coffee-soft">
                      Owner-operated, seven days. The people making your coffee are the ones whose name is over the door.
                    </p> 
                  </Reveal>
                </div>

        <RevealGroup className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {about.team.map((member) => (
            <RevealItem key={member.id} className="flex">
              <article className="flex w-full flex-col justify-between rounded-md border border-beige bg-linen p-8 transition-colors duration-500 ease-editorial hover:border-beige-strong sm:p-10">
                <div className="flex h-full flex-col">
                  <span className="inline-flex w-fit items-center rounded-full border border-beige-strong bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-widest text-clay">
                    {member.role}
                  </span>

                  <h3 className="mt-6 text-display-sm text-coffee">{member.name}</h3>

                  <p className="mt-5 text-body text-coffee-soft leading-relaxed">{member.bio}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Values ------------------------------------------------------------ */}
        <Section aria-labelledby="values-heading" className="bg-linen">
          <SectionHeading
                    id="values-heading" 
                    eyebrow="How we work"
                    size="2xl"
                    title={["Four rules we do ", { text: 'not bend', accent: true }]}
                  />
        <RevealGroup className="mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((value, index) => (
            <RevealItem key={value.title} className="flex">
              <div className="group relative flex w-full flex-col rounded-md border border-beige bg-cream/50 p-10 transition-colors duration-500 ease-editorial hover:border-beige-strong hover:bg-cream xl:p-12">
                <span aria-hidden="true" className="u-micro text-clay-deep/60">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-4 text-display-sm text-coffee">{value.title}</h3>

                <p className="mt-4 text-body-sm text-coffee-soft">{value.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

    

      {/* <Highlights /> */}

      {/* CTA --------------------------------------------------------------- */}
      {/* <Section className="bg-linen" space="md" width="content" innerClassName="text-center">
        <SectionHeading
          eyebrow="Visit us"
          title={['Good coffee. Fresh food.', { text: 'A place to slow down.', accent: true }]}
          description="Walk-ins welcome — no bookings required. If you are coming as a large group, give us a call ahead and we will do our best to put some tables together."
          size="lg"
          align="center"
        >
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={directionsUrl} size="lg" withArrow>
              Visit us
            </Button>
            <Button href={menuPdfUrl} size="lg" variant="secondary">
              View menu
            </Button>
          </div>
        </SectionHeading>
      </Section> */}

      <JsonLd id="schema-about" data={graph} />
    </>
  )
}
