import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { testimonials, aggregateRating } from '@/lib/data/testimonials'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { StarRating, Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Container'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'

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
        title="What people say"
        description="Collected from the people who actually come in. The same handful of things come up again and again, which is about the best feedback a small cafe can hope for."
        breadcrumbs={[{ name: 'Reviews', path: '/reviews' }]}
        imageSrc="/images/gallery-team.jpg"
        imageAlt="Four members of the team standing together behind the counter, aprons on, ready for service"
        imagePosition="object-[center_20%]"
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-display-lg text-coffee">{aggregateRating.value.toFixed(1)}</p>
            <div>
              <StarRating rating={aggregateRating.value} className="text-clay-deep" />
              <p className="mt-1.5 text-body-sm text-coffee-soft">
                from {aggregateRating.count} reviews
              </p>
            </div>
          </div>

          <Button href={`tel:${site.phone}`} variant="secondary" size="sm">
            Call {site.phoneDisplay}
          </Button>
        </div>
      </PageHeader>

      {/* Themes ------------------------------------------------------------ */}
      <Section aria-labelledby="themes-heading" className="border-b border-beige bg-cream" space="sm">
        <Badge as="h2" id="themes-heading">
          What comes up most
        </Badge>

        <RevealGroup className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        <h2 id="all-reviews-heading" className="sr-only">
          All reviews
        </h2>

        <RevealGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((review) => (
            <RevealItem key={review.id} className="h-full">
              <TestimonialCard review={review} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* CTA ---------------------------------------------------------------- */}
      <Section className="border-t border-beige bg-cream" space="sm" width="narrow" innerClassName="text-center">
        <Reveal>
          <h2 className="text-display-md text-coffee">Been in recently?</h2>
          <p className="mx-auto mt-5 max-w-lg text-lead font-light text-coffee-soft">
            Reviews genuinely help a small cafe on a big island. If we got it right —
            or got it wrong — we would like to hear about it.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" withArrow>
              Send us feedback
            </Button>
            <Button href={site.socials.instagram} size="lg" variant="secondary">
              <Icon name="instagram" className="h-4 w-4" />
              Follow along
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd id="schema-reviews" data={graph} />
    </>
  )
}
