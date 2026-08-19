import type { Metadata } from 'next'

import { site, formattedAddress, directionsUrl } from '@/lib/site'
import { faqs } from '@/lib/data/content'
import { buildGraph, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { ContactForm } from '@/components/forms/ContactForm'
import { LocationHours } from '@/components/home/LocationHours'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name} — ${formattedAddress}. Call ${site.phoneDisplay}, send a message, or find opening hours and directions for our beachside cafe in Cowes, Phillip Island.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `Contact · ${site.name}`,
    description: `Find us at ${formattedAddress}. Opening hours, directions, and a way to reach the team.`,
    url: '/contact',
  },
}

export default function ContactPage() {
  const graph = buildGraph(
    breadcrumbSchema([{ name: 'Contact', path: '/contact' }]),
    faqSchema(),
  )

  return (
    <>
      <PageHeader
        eyebrow="Say hello"
        title="Get in touch"
        description="Questions about the menu, a group booking, a function, or something we could be doing better — it all reaches the same small team."
        breadcrumbs={[{ name: 'Contact', path: '/contact' }]}
        image="gallerySignage"
      />

      {/* Quick contact + form ---------------------------------------------- */}
      <Section
        aria-labelledby="contact-form-heading"
        className="bg-linen"
        innerClassName="grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20"
      >
        <div>
          <SectionHeading
            id="contact-form-heading"
            eyebrow="Reach us"
            title="The fastest ways"
          />

          <div className="mt-9 space-y-6">
            <ContactMethod
              icon="phone"
              label="Phone"
              value={site.phoneDisplay}
              href={`tel:${site.phone}`}
              note="Best during opening hours. If it is busy, leave a message."
            />
            <ContactMethod
              icon="heart"
              label="Email"
              value={site.email}
              href={`mailto:${site.email}`}
              note="We read everything and usually reply within a day."
            />
            <ContactMethod
              icon="pin"
              label="Address"
              value={formattedAddress}
              href={directionsUrl}
              note="Street parking on Chapel Street, courtyard around the side."
            />
            <ContactMethod
              icon="instagram"
              label="Instagram"
              value={site.socials.instagramHandle}
              href={site.socials.instagram}
              note="Daily specials, the cabinet, and the occasional dog."
            />
          </div>
        </div>

        <ContactForm />
      </Section>

      <LocationHours eyebrow="Find us" heading="Where we are" />

      {/* FAQ ---------------------------------------------------------------- */}
      <Section aria-labelledby="faq-heading" className="border-t border-beige bg-linen">
        <SectionHeading
          id="faq-heading"
          eyebrow="Before you ask"
          title="Frequently asked"
          description="The questions that come up most. If yours is not here, send it through."
          align="center"
          className="max-w-2xl"
        />

        {/* Native <details> — accessible, keyboard-operable and functional
            with zero JavaScript. Marked up as FAQPage in the graph above. */}
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-beige border-y border-beige">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.03}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-display-xs text-coffee">{faq.question}</h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-beige-strong text-coffee-soft transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl pr-12 text-body-sm text-coffee-soft">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      <JsonLd id="schema-contact" data={graph} />
    </>
  )
}

function ContactMethod({
  icon,
  label,
  value,
  href,
  note,
}: {
  icon: 'phone' | 'heart' | 'pin' | 'instagram'
  label: string
  value: string
  href: string
  note: string
}) {
  const isExternal = href.startsWith('http')

  return (
    <Reveal>
      <div className="flex gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-beige bg-cream text-clay-deep">
          <Icon name={icon} className="h-4.5 w-4.5" />
        </span>

        <div>
          <Badge className="border-beige-strong/70 bg-transparent text-coffee-soft">{label}</Badge>
          <a
            href={href}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="u-underline mt-1.5 inline-block text-display-xs text-coffee"
          >
            {value}
          </a>
          <p className="mt-1.5 text-body-sm text-coffee-soft/85">{note}</p>
        </div>
      </div>
    </Reveal>
  )
}
