import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { menu, dietaryLabels, menuNotices } from '@/lib/data/menu'
import { buildGraph, menuSchema, breadcrumbSchema, menuPriceSummary } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/PageHeader'
import { MenuTabs } from '@/components/menu/MenuTabs'
import { LocationHours } from '@/components/home/LocationHours'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

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
        title="The menu"
        description="Cooked to order from produce we mostly picked up ourselves. Please order and pay at the counter."
        breadcrumbs={[{ name: 'Menu', path: '/menu' }]}
        imageSrc="/images/gallery-kitchen-morning-prep.jpg"
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

      <div className="bg-linen pb-24 sm:pb-32">
        <Container>
          <MenuTabs categories={menu} />

          {/* Dietary key ------------------------------------------------- */}
          <Reveal>
            <div className="mt-20 rounded-md border border-beige bg-cream/60 p-7 sm:p-9">
              <Badge as="h2">Dietary key</Badge>

              <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <LocationHours eyebrow="Come in" heading="Where to find us" />

      <JsonLd id="schema-menu" data={graph} />
    </>
  )
}
