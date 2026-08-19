import type { Testimonial } from '@/lib/data/testimonials'
import { formatDate, cn } from '@/lib/utils'
import { Icon, StarRating } from '@/components/ui/Icon'

/**
 * A single review.
 *
 * Marked up as a <figure>/<blockquote>/<figcaption> so the attribution is
 * semantically tied to the quote — screen readers announce who said it, and
 * the structure is what a crawler expects to find under Review markup.
 */
export function TestimonialCard({
  review,
  className,
  tone = 'light',
}: {
  review: Testimonial
  className?: string
  tone?: 'light' | 'dark'
}) {
  const isDark = tone === 'dark'

  return (
    <figure
      className={cn(
        'relative flex h-full flex-col rounded-[var(--radius-organic)] border p-7 sm:p-9',
        'transition-all duration-500 ease-editorial',
        isDark
          ? 'border-cream/12 bg-cream/[0.05] hover:border-cream/25'
          : 'border-beige bg-cream/70 shadow-soft hover:border-beige-strong hover:shadow-lifted',
        className,
      )}
    >
      <Icon
        name="quote"
        className={cn('h-7 w-7', isDark ? 'text-clay/60' : 'text-clay/45')}
      />

      <blockquote
        className={cn(
          'mt-5 flex-1 text-display-xs leading-[1.5]',
          isDark ? 'text-cream/90' : 'text-coffee',
        )}
      >
        <p>{review.quote}</p>
      </blockquote>

      <figcaption className="mt-7">
        <StarRating rating={review.rating} className={isDark ? 'text-clay' : 'text-clay-deep'} />

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span
            className={cn(
              'u-label text-sm',
              isDark ? 'text-cream' : 'text-coffee',
            )}
          >
            {review.author}
          </span>
          <span
            className={cn(
              'text-caption',
              isDark ? 'text-cream/45' : 'text-coffee-soft/75',
            )}
          >
            {review.context} · {formatDate(review.datePublished)}
          </span>
        </div>
      </figcaption>
    </figure>
  )
}
