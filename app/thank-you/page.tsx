import type { Metadata } from 'next'

import { site, directionsUrl, menuPdfUrl } from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { Statement, MaskRise } from '@/components/ui/Statement'
import { Button } from '@/components/ui/Button'
import { CtaLink } from '@/components/ui/Editorial'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

/**
 * A pure confirmation page — reached after a form submission — rather than a
 * search landing page. Noindexed and left out of the sitemap for exactly that
 * reason: it carries no unique content worth ranking, and indexing it would
 * just be a thin duplicate of the "message sent" state already shown inline
 * on /contact. Not disallowed in robots.txt though — that would stop Google
 * from ever crawling the page and reading this directive in the first place.
 */
export const metadata: Metadata = {
  title: 'Thank You',
  description: `Thanks for getting in touch with ${site.name}. Your message is with us.`,
  alternates: { canonical: '/thank-you' },
  robots: { index: false, follow: true },
}

export default function ThankYouPage() {
  return (
    <section
      aria-labelledby="thank-you-heading"
      className="relative overflow-hidden bg-espresso"
    >
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-50" />

      <Container
        width="narrow"
        className="relative flex min-h-[70svh] flex-col items-center justify-center py-24 text-center sm:py-32"
        style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}
      >
        <Reveal>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-cream/25 bg-cream/10 text-cream">
            <Icon name="check" className="h-5 w-5" />
          </span>
        </Reveal>

        <Statement
          as="h1"
          id="thank-you-heading"
          size="xl"
          tone="dark"
          trigger="load"
          delay={0.05}
          align="center"
          lines={['Thank you —', { text: 'your message is with us.', accent: true }]}
          className="mt-8"
        />

        <MaskRise delay={0.2} trigger="load" className="mt-6">
          <p className="mx-auto max-w-md text-lead font-light text-cream/75">
            We read everything and usually reply within a day. If it is
            urgent, call us on{' '}
            <a href={`tel:${site.phone}`} className="u-underline text-cream">
              {site.phoneDisplay}
            </a>{' '}
            during opening hours.
          </p>
        </MaskRise>

        <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <Button href="/" variant="onDark" size="lg" withArrow>
            Back to homepage
          </Button>
          <CtaLink href={menuPdfUrl} tone="dark">
            View our menu
          </CtaLink>
        </Reveal>

        <Reveal delay={0.36} className="mt-14">
          <CtaLink href={directionsUrl} tone="clay">
            Get directions
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  )
}
