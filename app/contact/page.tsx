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
import { SectionLabel } from '@/components/ui/Editorial'
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
        title={['Come for the coffee.', { text: 'Stay for the view.', accent: true }]}
        description="Questions about the menu, a large group, a function, or something we could be doing better — it all reaches the same small team. We're a walk-in only cafe, so there's no need to book ahead."
        imageSrc="/images/sitting.jpg"
        imageAlt="The dining room's timber tables and bentwood chairs under rattan pendant lights, with Western Port Bay through the window"
        imagePosition="object-[center_60%]"
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
            title={['The fastest', { text: 'ways in', accent: true }]}
            size="xl"
          />

          <div className="mt-9 space-y-6">
            <ContactMethod
              icon="phone" 
              value={site.phoneDisplay}
              href={`tel:${site.phone}`}
              note="Best during opening hours. If it is busy, leave a message."
            />
            <ContactMethod
              icon="heart" 
              value={site.email}
              href={`mailto:${site.email}`}
              note="We read everything and usually reply within a day."
            />
            <ContactMethod
              icon="pin" 
              value={formattedAddress}
              href={directionsUrl}
              note="Street parking on Chapel Street, courtyard around the side."
            />
            <ContactMethod
              icon="instagram" 
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
              <details className="group py-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-display-sm text-coffee transition-colors duration-300 group-hover:text-clay-deep">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-beige-strong text-coffee-soft transition-all duration-300 group-hover:border-clay-deep group-hover:text-clay-deep group-open:rotate-45 group-open:border-clay-deep group-open:text-clay-deep"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl pr-12 text-body text-coffee-soft">
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
  value,
  href,
  note,
}: {
  icon: 'phone' | 'heart' | 'pin' | 'instagram' 
  value: string
  href: string
  note: string
}) {
  const isExternal = href.startsWith('http')

  return (
    <Reveal>
      <div className="flex gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-beige bg-cream text-clay-deep">
          <Icon name={icon} className="h-4.5 w-4.5" />
        </span>

        <div> 
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
