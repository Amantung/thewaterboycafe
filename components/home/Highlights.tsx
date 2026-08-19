import { highlights } from '@/lib/data/content'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

/**
 * "Why us" grid on the dark coffee band.
 *
 * The dark section is the visual pivot of the homepage — it breaks up a long
 * run of linen and cream, and gives the footer somewhere to land tonally.
 */
export function Highlights() {
  return (
    <Section
      id="why-us"
      aria-labelledby="highlights-heading"
      className="relative overflow-hidden bg-coffee"
    >
      <div aria-hidden="true" className="u-grain absolute inset-0" />

      <div className="relative">
        <SectionHeading
          id="highlights-heading"
          eyebrow="Why people come back"
          title="Small cafe, high standards, no fuss"
          description="We are not trying to be the biggest place on the island. We are trying to be the one you think of first on a Sunday morning."
          tone="dark"
          align="center"
          className="max-w-2xl"
        />

        <RevealGroup className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((highlight) => (
            <RevealItem key={highlight.id}>
              <div className="group flex gap-5">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cream/15 bg-cream/[0.06] text-clay transition-all duration-500 group-hover:border-clay/40 group-hover:bg-clay/10">
                  <Icon name={highlight.icon} className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="text-display-xs text-cream">{highlight.title}</h3>
                  <p className="mt-2.5 text-body-sm text-cream/65">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}
