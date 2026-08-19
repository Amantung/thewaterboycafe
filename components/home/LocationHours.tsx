import {
  site,
  formattedAddress,
  groupedHours,
  mapEmbedUrl,
  directionsUrl,
} from '@/lib/site'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

/**
 * Location, hours and the map.
 *
 * The map is a keyless Google Maps embed resolved by address, so there is no
 * API key to provision and no billing account to attach. It is lazy-loaded —
 * an iframe in the critical path would cost more than the rest of the page put
 * together — and given a title so it is not an unlabelled frame in the
 * accessibility tree.
 *
 * Also carries the canonical on-page NAP, which is what local search actually
 * reads. It matches lib/site.ts and the JSON-LD exactly, by construction.
 */
export function LocationHours({
  heading = 'Find us',
  eyebrow = 'Visit',
  className,
}: {
  heading?: string
  eyebrow?: string
  className?: string
}) {
  const hours = groupedHours()

  return (
    <Section id="visit" aria-labelledby="visit-heading" className={cn('bg-cream', className)}>
      <SectionHeading
        id="visit-heading"
        eyebrow={eyebrow}
        title={heading}
        description={`We are on Chapel Street in Cowes, a short walk up from the foreshore. Street parking out front, and the courtyard is around the side.`}
        className="max-w-xl"
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        {/* Details ------------------------------------------------------ */}
        <div className="space-y-8">
          <Reveal>
            <div className="rounded-[var(--radius-organic)] border border-beige bg-linen/70 p-7 sm:p-8">
              <Badge as="h3">Where</Badge>

              <address className="mt-5 space-y-4 not-italic">
                <p className="text-display-xs leading-snug text-coffee">
                  {site.name}
                  <span className="mt-1 block text-body text-coffee-soft">
                    {formattedAddress}
                  </span>
                </p>

                <div className="u-rule" />

                <div className="flex flex-col gap-3 text-body-sm">
                  <a
                    href={`tel:${site.phone}`}
                    className="group inline-flex items-center gap-3 text-coffee-soft transition-colors hover:text-coffee"
                  >
                    <Icon name="phone" className="h-4 w-4 text-clay-deep" />
                    <span className="u-underline u-label">{site.phoneDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="group inline-flex items-center gap-3 text-coffee-soft transition-colors hover:text-coffee"
                  >
                    <Icon name="heart" className="h-4 w-4 text-clay-deep" />
                    <span className="u-underline">{site.email}</span>
                  </a>
                </div>
              </address>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={directionsUrl} size="sm">
                  <Icon name="pin" className="h-4 w-4" />
                  Get directions
                </Button>
                <Button href="/reserve" size="sm" variant="secondary">
                  Reserve a table
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[var(--radius-organic)] border border-beige bg-linen/70 p-7 sm:p-8">
              <Badge as="h3" icon="clock">
                Opening hours
              </Badge>

              <dl className="mt-5 space-y-3">
                {hours.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-body-sm text-coffee-soft">{row.label}</dt>
                    <span
                      aria-hidden="true"
                      className="min-w-4 flex-1 translate-y-[-0.25rem] border-b border-dotted border-beige-strong"
                    />
                    <dd className="u-label whitespace-nowrap text-body-sm text-coffee">
                      {row.hours}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {site.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-beige-strong bg-cream px-3 py-1.5 text-caption text-coffee-soft"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Map ---------------------------------------------------------- */}
        <Reveal delay={0.15} direction="left">
          <div
            id="find-us"
            className="h-full min-h-[26rem] overflow-hidden rounded-[var(--radius-organic)] border border-beige bg-sand shadow-soft"
          >
            <iframe
              title={`Google Map showing ${site.name} at ${formattedAddress}`}
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[26rem] w-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
