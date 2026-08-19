import { featuredItems } from '@/lib/data/menu'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem, Reveal } from '@/components/ui/Reveal'
import { MenuCard } from '@/components/menu/MenuCard'

/**
 * Homepage menu preview — the six dishes flagged `featured` in lib/data/menu.
 *
 * Capped at six deliberately: this is an appetiser that should push people to
 * /menu, and a longer grid both dilutes that and pushes the reviews and
 * location sections below a scroll most visitors never make.
 */
export function SignatureMenu() {
  const items = featuredItems.slice(0, 6)

  return (
    <Section id="menu" aria-labelledby="signature-heading" className="relative bg-cream">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="signature-heading"
          eyebrow="From the kitchen"
          title="A few things we are known for"
          description="The plates that come back to the pass empty. Everything is cooked to order, and the specials board changes with whatever the growers sent down that week."
          className="max-w-xl"
        />

        <Reveal delay={0.1}>
          <Button href="/menu" variant="secondary" className="shrink-0" withArrow>
            See the full menu
          </Button>
        </Reveal>
      </div>

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <RevealItem key={item.id} className="h-full">
            <MenuCard item={item} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="mt-10 text-center text-body-sm text-coffee-soft/85">
          Vegetarian, vegan and gluten-free options throughout. Tell our team about
          allergies when you order — our kitchen is small, and we will always be
          straight with you about what we can and cannot guarantee.
        </p>
      </Reveal>
    </Section>
  )
}
