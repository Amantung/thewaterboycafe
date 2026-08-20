import Image from 'next/image'

import { formatPrice, dietaryLabels, type MenuItem } from '@/lib/data/menu'


export function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="group relative py-7 focus-within:outline-none sm:py-8">
      {/* Bleeds past the container gutters so the wash reads as the page
          reacting rather than as a button lighting up. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-5 inset-y-0 -z-10 bg-sand/55 opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100 group-focus-within:opacity-100 sm:-inset-x-8"
      />

      <div className="flex gap-5 sm:gap-7">
        {item.image && (
          <div className="relative aspect-square w-16 flex-none overflow-hidden rounded-md bg-sand sm:w-20">
            <Image
              src={item.image}
              alt=""
              aria-hidden="true"
              fill
              loading="lazy"
              sizes="80px"
              className="object-cover transition-transform duration-700 ease-editorial motion-ok:group-hover:scale-105"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-4">
            <h3 className="font-display text-display-sm text-coffee transition-colors duration-500 group-hover:text-clay-deep group-focus-within:text-clay-deep">
              {item.name}
              {item.popular && (
                <span className="u-micro ml-3 align-middle text-clay-deep" title="A kitchen favourite">
                  ★ Favourite
                </span>
              )}
            </h3>

            {/* Leader dots — the classic printed-menu device, drawn as a
                border so it reflows with the text instead of overflowing.
                Hidden below `sm`: at phone widths a dish name wraps to two
                lines and the leader collapses to a two-pixel stub beside the
                first line, which reads as a rendering artefact rather than a
                device. The flex gap alone separates name from price there. */}
            <span
              aria-hidden="true"
              className="hidden min-w-6 flex-1 translate-y-[-0.3rem] border-b border-dotted border-beige-strong transition-colors duration-500 group-hover:border-clay-deep/55 group-focus-within:border-clay-deep/55 sm:block"
            />
            <span aria-hidden="true" className="flex-1 sm:hidden" />

            <span className="u-label shrink-0 text-body text-coffee transition-colors duration-500 group-hover:text-clay-deep group-focus-within:text-clay-deep">
              {item.sizes?.length ? (
                <span className="inline-flex items-baseline gap-2">
                  {item.sizes.map((size) => (
                    <span key={size.label}>
                      {formatPrice(size.price)}
                      <span className="u-micro ml-1 text-coffee-soft/70">{size.label}</span>
                    </span>
                  ))}
                </span>
              ) : (
                formatPrice(item.price)
              )}
            </span>
          </div>

          {item.description && (
            <p className="mt-2.5 max-w-2xl text-body-sm text-coffee-soft">{item.description}</p>
          )}

          {item.addOns && item.addOns.length > 0 && (
            <p className="mt-3 text-body-sm text-coffee-soft/85">
              <span className="u-micro mr-2 text-clay-deep">Add</span>
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
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <DietaryTags item={item} />
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}

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
