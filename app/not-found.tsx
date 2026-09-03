import type { Metadata } from 'next'

import { site, directionsUrl, menuPdfUrl } from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { Statement, MaskRise } from '@/components/ui/Statement'
import { Button } from '@/components/ui/Button'
import { CtaLink } from '@/components/ui/Editorial'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The App Router's dedicated not-found boundary. Next.js renders this for
 * any unmatched route and serves it with a genuine HTTP 404 — no extra
 * wiring required, and no risk of a soft-404 (a "not found" page served
 * with a 200) as long as nothing upstream returns 200 for the same URL.
 *
 * Two inheritance traps to guard against here, both confirmed by inspecting
 * the rendered head:
 *
 *   • `alternates.canonical` falls back to the nearest ancestor that
 *     declares one — the root layout's `/` — unless overridden. A 404 has
 *     no content of its own, so a canonical pointing at the homepage would
 *     tell Google "this is the same page as `/`", a textbook soft-404
 *     signal. The empty object below clears the inherited value.
 *   • `robots` falls back the same way, to the root layout's
 *     `{ index: true, follow: true }`. Next.js *also* unconditionally
 *     injects its own `<meta name="robots" content="noindex">` for the
 *     not-found boundary, so leaving `robots` unset here would print that
 *     tag right next to an inherited "index, follow" — a contradiction, not
 *     a fix. Declaring it explicitly makes both tags agree instead.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  description: `The page you're looking for could not be found at ${site.name}.`,
  alternates: {},
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="relative overflow-hidden bg-espresso">
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-50" />

      <Container
        width="narrow"
        className="relative flex min-h-[70svh] flex-col items-center justify-center py-24 text-center sm:py-32"
        style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}
      >
        <Reveal>
          <span className="u-micro text-clay">404</span>
        </Reveal>

        <Statement
          as="h1"
          id="not-found-heading"
          size="xl"
          tone="dark"
          trigger="load"
          delay={0.05}
          align="center"
          lines={['This page has drifted', { text: 'out with the tide.', accent: true }]}
          className="mt-6"
        />

        <MaskRise delay={0.2} trigger="load" className="mt-6">
          <p className="mx-auto max-w-md text-lead font-light text-cream/75">
            We couldn&rsquo;t find what you were looking for. It may have
            moved, or the address might not be quite right.
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

        <Reveal delay={0.36} className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <CtaLink href="/about" tone="clay">
            Our story
          </CtaLink>
          <CtaLink href="/gallery" tone="clay">
            Gallery
          </CtaLink>
          <CtaLink href="/contact" tone="clay">
            Contact
          </CtaLink>
          <CtaLink href={directionsUrl} tone="clay">
            Get directions
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  )
}
