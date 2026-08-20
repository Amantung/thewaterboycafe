import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { testimonials, aggregateRating } from '@/lib/data/testimonials'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { StarRating, Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Reviews } from '@/components/home/Reviews'

export const metadata: Metadata = {
  title: 'Reviews',
  description: `What guests say about ${site.name} in Cowes, Phillip Island — consistent coffee, quick friendly service, generous brunch and a dog-friendly courtyard.`,
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: `Reviews · ${site.name}`,
    description:
      'Guest reviews of our beachside cafe in Cowes — the coffee, the service, and the courtyard.',
    url: '/reviews',
  },
}

/** The recurring themes, pulled out so the page says something beyond quotes. */
const THEMES = [
  { icon: 'bean' as const, label: 'Consistent coffee', note: 'The same cup in a queue as in an empty room.' },
  { icon: 'heart' as const, label: 'Friendly, quick service', note: 'Fast even on a packed Sunday.' },
  { icon: 'sunrise' as const, label: 'Generous portions', note: 'Well-priced plates that genuinely fill you up.' },
  { icon: 'paw' as const, label: 'Dogs welcome', note: 'Water bowls before the order is taken.' },
]

export default function ReviewsPage() {
  const graph = buildGraph(breadcrumbSchema([{ name: 'Reviews', path: '/reviews' }]))

  return (
    <>
      <PageHeader
        eyebrow="Guest reviews"
        title={['In the words of', { text: 'the people who come in.', accent: true }]}
        description="Collected from the people who actually come in. The same handful of things come up again and again, which is about the best feedback a small cafe can hope for."
        imageSrc="/images/gallery-team.jpg"
        imageAlt="Four members of the team standing together behind the counter, aprons on, ready for service"
        imagePosition="object-[center_20%]"
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-display-lg text-cream">{aggregateRating.value.toFixed(1)}</p>
            <div>
              <StarRating rating={aggregateRating.value} className="text-clay" />
              <p className="mt-1.5 text-body-sm text-cream/70">
                from {aggregateRating.count} reviews
              </p>
            </div>
          </div>

          <Button href={`tel:${site.phone}`} variant="onDarkOutline" size="sm">
            Call {site.phoneDisplay}
          </Button>
        </div>
      </PageHeader>

      {/* Themes ------------------------------------------------------------ */}
      <Section aria-labelledby="themes-heading" className="border-b border-beige bg-cream">
        <SectionHeading
          id="themes-heading"
          eyebrow="The pattern"
          title={['What comes up', { text: 'again and again', accent: true }]}
          size="xl"
        />

        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
          {THEMES.map((theme) => (
            <RevealItem key={theme.label}>
              <div className="flex gap-4">
                <Icon name={theme.icon} className="h-5 w-5 shrink-0 text-clay-deep" />
                <div>
                  <h3 className="text-display-xs text-coffee">{theme.label}</h3>
                  <p className="mt-1.5 text-body-sm text-coffee-soft">{theme.note}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* All reviews -------------------------------------------------------- */}
      <Section aria-labelledby="all-reviews-heading" className="bg-linen">
        {/* Was a visually-hidden <h2>. A heading that exists only to label a
            region leaves the section looking like an unheaded slab of cards;
            giving it a real one costs nothing and adds the hierarchy step. */}
        <SectionHeading
          id="all-reviews-heading"
          eyebrow={`All ${testimonials.length} reviews`}
          title="Every word, unedited"
          size="xl"
          className="mb-14 sm:mb-16"
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((review) => (
            <RevealItem key={review.id} className="h-full">
              <TestimonialCard review={review} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

    {/* crousel-reviews */}
      <Reviews />

      {/* CTA ---------------------------------------------------------------- */}
      <Section className="border-t border-beige bg-cream" space="sm" width="narrow" innerClassName="text-center">
        <SectionHeading
          eyebrow="Your turn"
          title={['Been in', { text: 'recently?', accent: true }]}
          description="Reviews genuinely help a small cafe on a big island. If we got it right — or got it wrong — we would like to hear about it."
          size="lg"
          align="center"
        >
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" withArrow>
              Send us feedback
            </Button> 
            <Button href={site.socials.instagram} variant="secondary">
          <span className="flex items-center gap-2">
              <Icon name="instagram" className="h-4 w-4" />
            Follow along
          </span>
        </Button> 
          </div>
        </SectionHeading>
      </Section>

      <JsonLd id="schema-reviews" data={graph} />
    </>
  )
}
