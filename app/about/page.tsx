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
      {/* Chapters ---------------------------------------------------------- */}
      <Section aria-labelledby="chapters-heading" className="bg-cream">
        <SectionHeading
          id="chapters-heading" 
          title={['How the room', { text: 'came together', accent: true }]} 
          size="xl"
          className=""
        />
        
        <Reveal delay={0.15}>
          <p className=" max-w-xl text-lead font-light text-clay lg:ml-auto mb-10 lg:text-right">
            Four short chapters — the space, the kitchen, the coffee and the welcome.
          </p>
        </Reveal>


        <div className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          
          {/* Timeline Column */}
          <div className="relative">
            {/* Continuous background line that spans the whole height seamlessly */}
            <div 
              className="absolute bottom-0 left-[4.5px] top-3 w-px bg-beige-strong" 
              aria-hidden="true" 
            />

            <div className="space-y-16">
              {about.chapters.map((chapter, index) => (
                <Reveal key={chapter.id} delay={index * 0.04}>
                  <article className="relative pl-8 sm:pl-10">
                    {/* Marker placed perfectly over the continuous line */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full border-2 border-linen bg-clay"
                    />
                    <SectionLabel variant="pill">{chapter.eyebrow}</SectionLabel>
                    <h3 className="mt-3 text-display-sm text-coffee">{chapter.heading}</h3>
                    <p className="mt-4 text-body text-coffee-soft">{chapter.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Sticky Image Column — Collage Layout */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal direction="left">
              {/* Primary Image: Slightly narrower to leave room for the overlap */}
              <div className="relative aspect-4/3 w-[90%] overflow-hidden rounded-xl bg-sand shadow-lifted">
                <Image
                  src={founders.src}
                  alt={founders.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 35vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} direction="left">
              {/* Secondary Image: Offset to the right, negative margin pulls it up to overlap the first image. The 'border-cream' creates a nice cutout effect against the background. */}
              <div className="relative z-10 -mt-16 ml-auto w-[75%] aspect-4/3 overflow-hidden rounded-xl border-8 border-cream bg-sand shadow-soft sm:-mt-24">
                <Image
                  src={sourcing.src}
                  alt={sourcing.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, 75vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
          
        </div>
      </Section>

      {/* Values ------------------------------------------------------------ */}
        <Section aria-labelledby="values-heading" className="bg-linen">
          <SectionHeading
            id=""
            eyebrow=""
            title=""
            align="center"
            className="max-w-2xl"
          />
          <SectionHeading
                    id="values-heading" 
                    eyebrow="How we work"
                    size="2xl"
                    title={["Four rules we do ", { text: 'not bend', accent: true }]}
                  />
        <RevealGroup className="mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((value, index) => (
            <RevealItem key={value.title} className="flex">
              {/* Increased padding here with p-10 and xl:p-12 */}
              <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-cream/50 p-10 xl:p-12 transition-all duration-500 hover:-translate-y-2 hover:bg-cream hover:shadow-lifted">
                
                {/* Animated top accent line that draws itself on hover */}
                <div 
                  className="absolute left-0 top-0 h-1 w-0 bg-clay transition-all duration-500 ease-out group-hover:w-full" 
                  aria-hidden="true" 
                />

                {/* Massive decorative background number (Watermark) */}
                <span
                  aria-hidden="true"
                  className="absolute right-0 -top-2 text-[8rem] font-bold leading-none text-clay/8 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:text-clay/10"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Content wrapper */}
                <div className="relative z-10 flex h-full flex-col"> 
                  
                  <h3 className="text-display-sm text-coffee transition-colors duration-300 group-hover:text-clay">
                    {value.title}
                  </h3>
                  
                  <p className="mt-4 text-body-sm text-coffee-soft">
                    {value.body}
                  </p>
                </div>
                
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Team -------------------------------------------------------------- */}
      <Section aria-labelledby="team-heading" className="bg-cream"> 
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                  <SectionHeading
                    id="The people" 
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
              <article className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl bg-linen p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft sm:p-10">
                
                {/* Abstract animated corner circle that expands on hover */}
                <div 
                  className="absolute right-0 top-0 h-20 w-20 -translate-y-10 translate-x-10 rounded-full bg-clay/5 transition-transform duration-700 ease-out group-hover:scale-[2.5] group-hover:bg-clay/10" 
                  aria-hidden="true" 
                />
                
                <div className="relative z-10 flex h-full flex-col">
                  
                  <div className="mb-6 flex items-start justify-between">
                    {/* Refined Role Badge */}
                    <span className="inline-flex items-center rounded-full border border-beige-strong bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-widest text-clay">
                      {member.role}
                    </span>
                    
                    {/* Decorative quote icon to frame the bio as a personal story */}
                    <svg 
                      className="mt-1 h-6 w-6 text-clay/20 transition-colors duration-500 group-hover:text-clay/40" 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      aria-hidden="true"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Name with subtle hover color transition */}
                  <h3 className="text-display-sm text-coffee transition-colors duration-300 group-hover:text-clay">
                    {member.name}
                  </h3>
                  
                  {/* Bio pushed slightly further down for hierarchy */}
                  <p className="mt-5 text-body text-coffee-soft leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                
                {/* Elegant bottom accent line that draws left-to-right on hover */}
                <div 
                  className="absolute bottom-0 left-0 h-1.5 w-0 bg-clay transition-all duration-500 ease-out group-hover:w-full" 
                  aria-hidden="true" 
                />
                
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Highlights />

      {/* CTA --------------------------------------------------------------- */}
      <Section className="bg-linen" space="md" width="content" innerClassName="text-center">
        <SectionHeading
          eyebrow="Visit us"
          title={['Good coffee. Fresh food.', { text: 'A place to slow down.', accent: true }]}
          description="Walk-ins are always welcome. If you are bringing a group, send a request through and we will put some tables together."
          size="lg"
          align="center"
        >
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/reserve" size="lg" withArrow>
              Reserve a table
            </Button>
            <Button href="/menu" size="lg" variant="secondary">
              Browse the menu
            </Button>
          </div>
        </SectionHeading>
      </Section>

      <JsonLd id="schema-about" data={graph} />
    </>
  )
}
