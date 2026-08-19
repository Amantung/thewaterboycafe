import type { Metadata } from 'next'

import { site, formattedAddress, groupedHours } from '@/lib/site'
import { buildGraph, breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { ReservationForm } from '@/components/forms/ReservationForm'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Reserve a table',
  description: `Request a table at ${site.name} in Cowes, Phillip Island. Small tables are walk-in; we hold a limited number of bookings for groups. Call ${site.phoneDisplay} or send a request.`,
  alternates: { canonical: '/reserve' },
  openGraph: {
    title: `Reserve a table · ${site.name}`,
    description: `Request a table at our beachside cafe in Cowes, Phillip Island.`,
    url: '/reserve',
  },
  // A booking form has no search value and can generate near-duplicate
  // crawl paths; keep it out of the index but let link equity flow through.
  robots: { index: false, follow: true },
}

const GOOD_TO_KNOW = [
  {
    icon: 'clock' as const,
    title: 'Walk-ins always welcome',
    body: 'Most tables are kept for walk-ins. A booking is worth it for groups, or if you are driving down specially.',
  },
  {
    icon: 'paw' as const,
    title: 'Bringing a dog?',
    body: 'Say so in the notes and we will put you in the courtyard, where there is shade and a water bowl.',
  },
  {
    icon: 'heart' as const,
    title: 'Big group or a function',
    body: `For more than 20 people, please call us on ${site.phoneDisplay} so we can plan it properly with the kitchen.`,
  },
]

export default function ReservePage() {
  const graph = buildGraph(breadcrumbSchema([{ name: 'Reserve', path: '/reserve' }]))
  const hours = groupedHours()

  return (
    <>
      <PageHeader
        eyebrow="Bookings"
        title="Reserve a table"
        description="Send a request and we will confirm by phone or email. Nothing is locked in until you hear back from us — we would rather be clear than have you turn up to a table that was never held."
        breadcrumbs={[{ name: 'Reserve', path: '/reserve' }]}
        image="galleryTable"
      />

      <Section
        aria-labelledby="reserve-form-heading"
        className="bg-linen"
        innerClassName="grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:gap-20"
      >
        <div>
          <h2 id="reserve-form-heading" className="sr-only">
            Table request form
          </h2>
          <ReservationForm />
        </div>

        <aside className="space-y-8">
          <Reveal delay={0.08}>
            <div className="rounded-[var(--radius-organic)] border border-beige bg-cream/60 p-7">
              <h3 className="u-eyebrow text-clay-deep">Good to know</h3>
              <ul className="mt-6 space-y-6">
                {GOOD_TO_KNOW.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <Icon name={item.icon} className="mt-0.5 h-5 w-5 shrink-0 text-clay-deep" />
                    <div>
                      <h4 className="text-body font-medium text-coffee">{item.title}</h4>
                      <p className="mt-1.5 text-body-sm text-coffee-soft">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="rounded-[var(--radius-organic)] border border-beige bg-cream/60 p-7">
              <h3 className="u-eyebrow flex items-center gap-2.5 text-clay-deep">
                <Icon name="clock" className="h-3.5 w-3.5" />
                When we are open
              </h3>
              <dl className="mt-5 space-y-2.5">
                {hours.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 text-body-sm">
                    <dt className="text-coffee-soft">{row.label}</dt>
                    <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-0.25rem] border-b border-dotted border-beige-strong" />
                    <dd className="u-label whitespace-nowrap text-coffee">{row.hours}</dd>
                  </div>
                ))}
              </dl>

              <div className="u-rule my-6" />

              <address className="text-body-sm not-italic text-coffee-soft">
                {site.name}
                <br />
                {formattedAddress}
                <br />
                <a href={`tel:${site.phone}`} className="u-underline u-label mt-2 inline-block text-coffee">
                  {site.phoneDisplay}
                </a>
              </address>
            </div>
          </Reveal>
        </aside>
      </Section>

      <JsonLd id="schema-reserve" data={graph} />
    </>
  )
}
