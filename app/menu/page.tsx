import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { menu, dietaryLabels, menuNotices } from '@/lib/data/menu'
import { buildGraph, menuSchema, breadcrumbSchema, menuPriceSummary } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { MenuTabs } from '@/components/menu/MenuTabs'
import { LocationHours } from '@/components/home/LocationHours'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CtaLink } from '@/components/ui/Editorial'
import { Reveal } from '@/components/ui/Reveal'
import { SignatureMenu } from '@/components/home/SignatureMenu'

export const metadata: Metadata = {
  title: 'Menu',
  description: `Breakfast, lunch, Five Senses specialty coffee and house-baked sweets at ${site.name} in Cowes, Phillip Island. Vegetarian, vegan and gluten-free options throughout${
    menuPriceSummary() ? `, ${menuPriceSummary()}` : ''
  }.`,
  alternates: { canonical: '/menu' },
  openGraph: {
    title: `Menu · ${site.name}`,
    description: `Scratch-made breakfast and lunch, Five Senses coffee and a cabinet baked each morning — in Cowes, Phillip Island.`,
    url: '/menu',
  },
}

export default function MenuPage() {
  const graph = buildGraph(
    menuSchema(),
    breadcrumbSchema([{ name: 'Menu', path: '/menu' }]),
  )

  return (
    <>
      <PageHeader
        eyebrow="Breakfast · Lunch · Coffee"
        title={['Fresh food, good coffee,', { text: 'and a reason to stay.', accent: true }]}
        description="Cooked to order from produce we mostly picked up ourselves. Please order and pay at the counter."
        imageSrc="/images/menu-banner.png"
        imageAlt="A chef working the pans in a warmly lit kitchen during morning service"
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/reserve" variant="onDark" withArrow>
            Reserve a table
          </Button>
          <Button href={`tel:${site.phone}`} variant="onDarkOutline">
            Call {site.phoneDisplay}
          </Button>
        </div>
      </PageHeader>
      <SignatureMenu />

      <div className="bg-linen py-24 sm:py-32">
        <Container>
          <MenuTabs categories={menu} />

          {/* Dietary key ------------------------------------------------- */}
          <Reveal>
            <div className="mt-24 rounded-md border border-beige bg-cream/60 p-7 sm:mt-28 sm:p-9">
              <SectionHeading
                eyebrow="Good to know"
                title="Dietary key"
                level={2}
                size="sm"
              />

              <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(dietaryLabels).map(([tag, label]) => (
                  <div key={tag} className="flex items-center gap-3">
                    <dt className="u-micro inline-flex min-w-11 justify-center rounded-full border border-sage/35 bg-sage/10 px-2.5 py-0.5 text-sage-deep">
                      {tag}
                    </dt>
                    <dd className="text-body-sm text-coffee-soft">{label}</dd>
                  </div>
                ))}
              </dl>

              <div className="u-rule my-7" />

              <p className="text-body-sm text-coffee-soft">{menuNotices.allergens}</p>

              <p className="mt-3 text-body-sm text-coffee-soft">
                {menuNotices.surcharge} Alternative milks are always the same price as
                dairy.
              </p>
            </div>
          </Reveal>
        </Container>
      </div>

      {/* Statement — the page's editorial pause, in the same dark treatment
          and at the same scale as the homepage's brand band. */}
      <Section className="relative overflow-hidden bg-espresso">
        <div aria-hidden="true" className="u-grain absolute inset-0" />
        <div className="relative">
          <SectionHeading
            eyebrow="Why it tastes like it does"
            title={['Made fresh.', 'Served simply.', { text: 'Worth coming back for.', accent: true }]}
            size="statement"
            tone="dark"
            level={2}
          />

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t border-cream/12 pt-8 lg:mt-16">
              <p className="max-w-xl text-lead font-light text-cream/70">
                Hollandaise whisked to order rather than held in a bath. Relish,
                tartare and compote all ours. The cabinet baked before the sun
                properly landed, and the specials board written after the
                delivery arrives instead of before.
              </p>
              <CtaLink href="/about" tone="dark">
                How we work
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </Section>

      <LocationHours eyebrow="Come in" />

      <JsonLd id="schema-menu" data={graph} />
    </>
  )
}
