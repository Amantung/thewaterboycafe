import { featuredTestimonials, aggregateRating } from '@/lib/data/testimonials'
import { StarRating } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { TestimonialCard } from '@/components/ui/TestimonialCard'

const HOME_TESTIMONIALS = featuredTestimonials.slice(0, 3)

/**
 * A short, static "what people say" band — three quotes and the aggregate
 * rating, no carousel and no dedicated reviews page behind it.
 *
 * The aggregate figure is rendered as plain visible text either way, but is
 * only backed by AggregateRating structured data once the underlying reviews
 * are real — see the note in lib/data/testimonials.ts and the gate in
 * lib/schema.ts.
 */
export function Reviews() {
  return (
    <Section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden bg-espresso"
    >
      <div aria-hidden="true" className="u-grain absolute inset-0" />

      <div className="relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="reviews-heading"
            eyebrow="Guest reviews"
            size="xl"
            tone="dark"
            title={[
              <>
                What people say on the <span className="text-clay">way out</span>
              </>,
            ]}
          />

          <Reveal delay={0.1}>
            <div className="flex items-center gap-4">
              <p className="text-display-lg text-cream">{aggregateRating.value.toFixed(1)}</p>
              <div>
                <StarRating rating={aggregateRating.value} size="h-4 w-4" />
                <p className="mt-1.5 text-body-sm text-cream/55">
                  from {aggregateRating.count} reviews
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-3 lg:mt-16">
          {HOME_TESTIMONIALS.map((review) => (
            <RevealItem key={review.id}>
              <TestimonialCard review={review} tone="dark" className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}