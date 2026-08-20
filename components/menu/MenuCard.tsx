import Image from 'next/image'

import { formatPrice, priceLabel, dietaryLabels, type MenuItem } from '@/lib/data/menu'
import { cn } from '@/lib/utils'

/**
 * Two presentations of one dish.
 *
 * <MenuCard>  — photographic card for the full /menu page's card layout.
 * <MenuRow>   — dense typographic row for list-layout categories, where a grid
 *               of sixty photos would be both slower and less readable than a
 *               well-set list.
 *
 * Both are server components; nothing here needs interactivity.
 */

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function MenuCard({
  item,
  priority = false,
  className,
}: {
  item: MenuItem
  /** Set on above-the-fold cards only — priority on everything defeats it. */
  priority?: boolean
  className?: string
}) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-md',
        'border border-beige bg-cream/70 shadow-soft',
        'transition-all duration-500 ease-editorial',
        'hover:border-beige-strong hover:shadow-lifted motion-ok:hover:-translate-y-1',
        className,
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-sand">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.06]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand to-beige"
          >
            <span className="font-display text-8xl text-clay/25">
              {item.name.charAt(0)}
            </span>
          </div>
        )}

        {item.popular && (
          <span className="u-micro absolute left-4 top-4 rounded-full bg-coffee/85 px-3 py-1.5 text-cream backdrop-blur-sm">
            Kitchen favourite
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-display-xs">{item.name}</h3>
          <span className="u-label shrink-0 rounded-full bg-linen px-3 py-1 text-body-sm text-coffee">
            {priceLabel(item)}
          </span>
        </div>

        {item.description && (
          <p className="mt-3 flex-1 text-body-sm text-coffee-soft">{item.description}</p>
        )}

        {item.dietary?.length ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <DietaryTags item={item} />
          </div>
        ) : null}
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Row                                                                        */
/* -------------------------------------------------------------------------- */

export function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="group py-6 first:pt-0 last:pb-0 focus-within:outline-none">
      <div className="flex items-baseline gap-4">
        <h3 className="text-display-xs text-coffee transition-colors duration-300 group-hover:text-clay-deep group-focus-within:text-clay-deep">
          {item.name}
          {item.popular && (
            <span
              className="u-micro ml-2.5 align-middle text-clay-deep"
              title="A kitchen favourite"
            >
              ★ favourite
            </span>
          )}
        </h3>

        {/* Leader dots — the classic menu device, drawn as a border so it
            reflows with the text instead of overflowing at narrow widths. */}
        <span
          aria-hidden="true"
          className="min-w-6 flex-1 translate-y-[-0.3rem] border-b border-dotted border-beige-strong transition-colors duration-300 group-hover:border-clay-deep/60 group-focus-within:border-clay-deep/60"
        />

        <span className="u-label shrink-0 text-body text-coffee">
          {item.sizes?.length ? (
            <span className="inline-flex items-baseline gap-2">
              {item.sizes.map((size, index) => (
                <span key={size.label}>
                  {index > 0 && <span className="mx-1 text-coffee-soft/50">/</span>}
                  {formatPrice(size.price)}
                  <span className="u-micro ml-1 text-coffee-soft/70">
                    {size.label}
                  </span>
                </span>
              ))}
            </span>
          ) : (
            formatPrice(item.price)
          )}
        </span>
      </div>

      {item.description && (
        <p className="mt-2 max-w-2xl text-body-sm text-coffee-soft">{item.description}</p>
      )}

      {item.addOns && item.addOns.length > 0 && (
        <p className="mt-2.5 text-body-sm text-coffee-soft/85">
          <span className="u-eyebrow mr-2 text-clay-deep">Add</span>
          {item.addOns.map((addOn, index) => (
            <span key={addOn.label}>
              {index > 0 && <span className="mx-1.5 opacity-40">·</span>}
              {addOn.label}{' '}
              <span className="u-label text-coffee">+{formatPrice(addOn.price)}</span>
            </span>
          ))}
        </p>
      )}

      {item.dietary?.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DietaryTags item={item} />
        </div>
      ) : null}
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared                                                                     */
/* -------------------------------------------------------------------------- */

function DietaryTags({ item }: { item: MenuItem }) {
  if (!item.dietary?.length) return null

  return (
    <>
      {item.dietary.map((tag) => (
        <span
          key={tag}
          title={dietaryLabels[tag]}
          className="u-micro inline-flex items-center rounded-full border border-sage/35 bg-sage/10 px-2.5 py-0.5 text-sage-deep"
        >
          {tag}
        </span>
      ))}
      {/* Spelled out for screen readers — "gfo" is meaningless read aloud. */}
      <span className="sr-only">
        Dietary: {item.dietary.map((tag) => dietaryLabels[tag]).join(', ')}
      </span>
    </>
  )
}
