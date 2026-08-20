import { highlights } from '@/lib/data/content'
import { Icon } from '@/components/ui/Icon'
import { Container } from '@/components/ui/Container'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * The dark brand statement — the page's pause.
 *
 * This band already existed and the idea was right: a dark field breaking a
 * long run of linen and cream, giving the eye somewhere to rest and the
 * footer somewhere to land tonally. What it lacked was a reason to be dark.
 * A centred 44px heading and a grid of icon chips is the same section as the
 * one above it, in a different colour.
 *
 * Now the claim carries it. Three short lines at the largest size on the
 * site, set flush left, each rising into place a beat after the last — the
 * only place on the page that type is allowed to be this big, which is what
 * makes it read as the brand speaking rather than as another heading. The six
 * reasons underneath are set as a ruled table, not as cards: a rule and a
 * number are enough structure, and six rounded panels on a dark field is
 * exactly the "collection of cards" look this page is trying to shed.
 *
 * Also rendered on /about, where the same statement does the same job — hence
 * the optional `index`, which is the homepage's running sequence number and
 * means nothing anywhere else.
 */
export function Highlights({ index }: { index?: number }) {
  return (
    <section
      id="why-us"
      aria-labelledby="highlights-heading"
      className="relative overflow-hidden bg-espresso u-section"
    >
      <div aria-hidden="true" className="u-grain absolute inset-0" />

      <Container className="relative">
        <SectionHeading
          id="highlights-heading"
          index={index}
          eyebrow="Why people come back"
          size="statement"
          tone="dark"
          title={['Small cafe.', 'High standards.', { text: 'No fuss.', accent: true }]}
        />

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-xl text-lead font-light text-cream/70 lg:ml-auto lg:mt-14 lg:text-right">
            We are not trying to be the biggest place on the island. We are
            trying to be the one you think of first on a Sunday morning.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-x-14">
          {highlights.map((highlight, position) => (
            <RevealItem key={highlight.id}>
              <div className="group border-t border-cream/12 pt-6">
                <div className="flex items-center gap-3.5">
                  <span className="u-micro text-clay">
                    {String(position + 1).padStart(2, '0')}
                  </span>
                  <Icon
                    name={highlight.icon}
                    className="h-4 w-4 text-cream/40 transition-colors duration-500 group-hover:text-clay"
                  />
                </div>

                <h3 className="mt-5 font-display text-display-sm text-cream">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-body-sm text-cream/60">{highlight.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
