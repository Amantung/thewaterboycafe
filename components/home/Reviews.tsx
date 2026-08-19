import { featuredTestimonials, aggregateRating } from '@/lib/data/testimonials'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel'

/**
 * Reviews band on the espresso surface.
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
      innerClassName="grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-24"
    >
      <div aria-hidden="true" className="u-grain absolute inset-0" />

      <div className="relative">
        <SectionHeading
          id="reviews-heading"
          eyebrow="Guest reviews"
          title="What people say on the way out"
          tone="dark"
        />

        <Reveal delay={0.12}>
          <div className="mt-9 flex items-center gap-5">
            <p className="text-display-lg text-cream">{aggregateRating.value.toFixed(1)}</p>
            <div>
              <StarRating rating={aggregateRating.value} size="h-4 w-4" />
              <p className="mt-1.5 text-body-sm text-cream/55">
                from {aggregateRating.count} reviews
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-7 max-w-md text-body-sm text-cream/65">
            The same three things come up again and again: the coffee is
            consistent, the staff are quick and genuinely friendly, and nobody
            minds if you stay a while.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9">
            <Button href="/reviews" variant="onDarkOutline" withArrow>
              Read all reviews
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} direction="left">
        <TestimonialCarousel reviews={featuredTestimonials} />
      </Reveal>
    </Section>
  )
}
