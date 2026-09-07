/**
 * Guest reviews.
 *
 * ⚠️  These are ORIGINAL paraphrases written around the recurring themes in the
 * cafe's public reviews (friendly and fast service, strong coffee, generous
 * and well-priced brunch, cosy room, dog-friendly outdoor seating, solid kids'
 * menu). They are not verbatim quotes from real people, and the names are
 * invented — so `context` deliberately says "Guest feedback" rather than
 * naming a specific platform like Google, which these were never posted to.
 *
 * BEFORE LAUNCH — this matters legally and for SEO:
 *   • Review and AggregateRating structured data must describe REAL reviews.
 *     Marking up invented testimonials is a Google structured-data policy
 *     violation and risks a manual action.
 *   • `EMIT_REVIEW_SCHEMA` below is therefore FALSE while any entry is a
 *     placeholder. Replace these with genuine reviews (with permission),
 *     flip each `source` to 'verified', and the schema turns itself on.
 */

export type ReviewSource = 'verified' | 'placeholder'

export type Testimonial = {
  id: string
  quote: string
  author: string
  /** Shown under the name, e.g. "Guest feedback · March 2026". */
  context: string
  rating: 1 | 2 | 3 | 4 | 5
  /** ISO date used by the Review schema once these are real. */
  datePublished: string
  /** Pulls the review into the homepage carousel. */
  featured?: boolean
  source: ReviewSource
}

export const testimonials: Testimonial[] = [
  {
    id: 'coffee-consistency',
    quote:
      'We have been coming here every summer for years and the coffee has never once been off. Same excellent flat white in a queue of twenty as in an empty room — that consistency is genuinely rare.',
    author: 'Marguerite D.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2026-01-14',
    featured: true,
    source: 'placeholder',
  },
  {
    id: 'service-speed',
    quote:
      'Packed on a Sunday and still the food landed quickly and the staff stayed cheerful about it. Someone noticed our water jug was empty before we did.',
    author: 'Tom & Alicia R.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2025-12-28',
    featured: true,
    source: 'placeholder',
  },
  {
    id: 'value-portions',
    quote:
      'Enormous plates for what you pay. The scramble is a proper feed and the sourdough is not the sad thin stuff you get elsewhere on the island.',
    author: 'Dev P.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2025-11-09',
    featured: true,
    source: 'placeholder',
  },
  {
    id: 'dog-friendly',
    quote:
      'They brought a water bowl out for our kelpie before they took our order. We drove past two closer cafes to sit in that courtyard and would do it again.',
    author: 'Hannah M.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2026-02-02',
    featured: true,
    source: 'placeholder',
  },
  {
    id: 'atmosphere',
    quote:
      'High ceilings, big window onto the water, and that warm hum of a room full of people who are all having a nice morning. We stayed two hours longer than planned.',
    author: 'Jules W.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2025-10-21',
    featured: true,
    source: 'placeholder',
  },
  {
    id: 'family-kids',
    quote:
      'Three generations at one table and everybody found something. The kids demolished the little pancakes, my father approved of the coffee, which never happens.',
    author: 'Sandra K.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2025-09-30',
    source: 'placeholder',
  },
  {
    id: 'gluten-free',
    quote:
      'Asked about gluten free and got a real answer instead of a shrug. The kitchen swapped the benedict onto GF bread without making it feel like a favour.',
    author: 'Priya N.',
    context: 'Guest feedback',
    rating: 5,
    datePublished: '2026-03-11',
    source: 'placeholder',
  },
  {
    id: 'daily-specials',
    quote:
      'The specials board is the reason we keep coming back — it actually changes. Last visit it was a mushroom polenta thing I have thought about since.',
    author: 'Callum B.',
    context: 'Guest feedback',
    rating: 4,
    datePublished: '2026-04-05',
    source: 'placeholder',
  },
]

/** Mean rating to one decimal, e.g. 4.9. */
export const aggregateRating = {
  value:
    Math.round(
      (testimonials.reduce((total, review) => total + review.rating, 0) /
        testimonials.length) *
        10,
    ) / 10,
  count: testimonials.length,
  best: 5,
  worst: 1,
}

/**
 * Structured data for reviews is emitted ONLY when every testimonial is real.
 * See the warning at the top of this file — do not force this to true.
 */
export const EMIT_REVIEW_SCHEMA = testimonials.every(
  (review) => review.source === 'verified',
)
