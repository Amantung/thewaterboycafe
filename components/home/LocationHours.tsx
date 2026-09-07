import {
  site,
  formattedAddress,
  groupedHours,
  mapEmbedUrl,
  directionsUrl,
  menuPdfUrl,
} from '@/lib/site'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SectionLabel } from '@/components/ui/Editorial'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

export function LocationHours({
  eyebrow = 'Visit',
  className,
}: {
  eyebrow?: string
  className?: string
}) {
  const hours = groupedHours()

  return (
    <Section id="visit" aria-labelledby="visit-heading" className={cn('bg-cream', className)}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
                id="visit-heading" 
                eyebrow={eyebrow}
                size="2xl"
                // Passed as a single node rather than a one-element array: an
                // array literal holding an unkeyed element trips React's
                // key validation at the call site. `SectionHeading` wraps a
                // lone node itself. Use an array only for multi-line titles,
                // and key the elements inside it.
                title={
                  <>
                    Find <span className="text-clay">us</span>
                  </>
                }
              /> 
              <Reveal delay={0.12} className="lg:max-w-md lg:pb-3">
                <p className="text-body text-coffee-soft">
                  We are on Chapel Street in Cowes, a short walk up from the foreshore. Street parking out front, and the courtyard is around the side. Walk-ins welcome — no bookings required.
                </p>
              </Reveal>
              </div>
              
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        {/* Details ------------------------------------------------------ */}
        <div className="space-y-8">
          <Reveal>
            <div className="rounded-md border border-beige bg-linen/70 p-7 sm:p-8"> 
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
                <span className="flex items-center gap-2">
                  <Icon name="pin" className="h-4 w-4" />
                  Get directions
                </span>
              </Button>
                <Button href={menuPdfUrl} size="sm" variant="secondary">
                  View menu
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-md border border-beige bg-linen/70 p-7 sm:p-8">
              <SectionLabel variant="pill" as="h3" icon="clock">
                Opening hours
              </SectionLabel>

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
                      Open 7:30am to 2:30pm
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
            // `u-map` desaturates and warms Google's embed into the page's
            // palette, returning to full colour on hover or keyboard focus —
            // when someone is actually reading it. An embed left in its own
            // colour world is the main reason a map always looks bolted on.
            className="u-map h-full min-h-[26rem] overflow-hidden rounded-md border border-beige bg-sand shadow-soft"
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