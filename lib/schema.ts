/**
 * JSON-LD builders.
 *
 * Everything is wired into one connected `@id` graph rather than a pile of
 * unrelated blobs — the CafeOrCoffeeShop node is the hub, and the Menu,
 * WebSite and BreadcrumbList nodes reference it by `@id`. That is what lets
 * Google resolve "this menu belongs to this business at this address".
 *
 * Two deliberate guardrails:
 *   • Review / AggregateRating markup is only emitted when every testimonial
 *     is flagged `verified` (see lib/data/testimonials.ts). Marking up
 *     invented reviews violates Google's structured data policies.
 *   • Opening hours come from lib/site.ts, so the visible hours table and the
 *     markup can never disagree.
 */

import { site, formattedAddress, SITE_URL } from '@/lib/site'
import { menu, formatPrice, type MenuCategory } from '@/lib/data/menu'
import {
  testimonials,
  aggregateRating,
  EMIT_REVIEW_SCHEMA,
} from '@/lib/data/testimonials'
import { img } from '@/lib/data/images'
import { faqs } from '@/lib/data/content'

/** Stable node ids — reused as reference targets across the graph. */
const ID = {
  business: `${SITE_URL}/#cafe`,
  website: `${SITE_URL}/#website`,
  menu: `${SITE_URL}/menu#menu`,
  organization: `${SITE_URL}/#organization`,
}

/** Schema.org wants two-letter day codes prefixed with the vocabulary URL. */
const DAY_URI: Record<string, string> = {
  Monday: 'https://schema.org/Monday',
  Tuesday: 'https://schema.org/Tuesday',
  Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday',
  Friday: 'https://schema.org/Friday',
  Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
}

function openingHoursSpecification() {
  return site.hours
    .filter((entry) => entry.opens && entry.closes)
    .map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_URI[entry.day],
      opens: entry.opens,
      closes: entry.closes,
    }))
}

/* -------------------------------------------------------------------------- */
/* CafeOrCoffeeShop — the hub node                                            */
/* -------------------------------------------------------------------------- */

export function cafeSchema() {
  const hero = img('heroMain')
  const og = img('ogDefault')
  const logo = img('logo')

  const node: Record<string, unknown> = {
    '@type': ['CafeOrCoffeeShop', 'LocalBusiness', 'Restaurant'],
    '@id': ID.business,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    image: [`${SITE_URL}${hero.src}`, `${SITE_URL}${og.src}`],
    // The real brand mark, not the OG card — Google surfaces `logo` in the
    // knowledge panel, where a wide banner crops badly.
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${logo.src}`,
      width: logo.width,
      height: logo.height,
    },
    priceRange: site.priceRange,
    currenciesAccepted: site.currency,
    paymentAccepted: site.paymentAccepted.join(', '),
    servesCuisine: [...site.servesCuisine],
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.regionCode,
      postalCode: site.address.postcode,
      addressCountry: site.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${site.name}, ${formattedAddress}`,
    )}`,
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [site.socials.instagram, site.socials.facebook],
    hasMenu: { '@id': ID.menu },
    acceptsReservations: `${SITE_URL}/reserve`,
    areaServed: [
      { '@type': 'Place', name: 'Cowes, Victoria' },
      { '@type': 'Place', name: 'Phillip Island, Victoria' },
    ],
    amenityFeature: site.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
  }

  // Ratings and reviews only once they describe real, attributable feedback.
  if (EMIT_REVIEW_SCHEMA) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.value,
      reviewCount: aggregateRating.count,
      bestRating: aggregateRating.best,
      worstRating: aggregateRating.worst,
    }
    node.review = testimonials.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.datePublished,
      reviewBody: review.quote,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      itemReviewed: { '@id': ID.business },
    }))
  }

  return node
}

/* -------------------------------------------------------------------------- */
/* Menu                                                                       */
/* -------------------------------------------------------------------------- */

function menuSection(category: MenuCategory) {
  return {
    '@type': 'MenuSection',
    name: category.name,
    description: category.description,
    hasMenuItem: category.items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description,
      ...(item.image ? { image: `${SITE_URL}${img(item.image).src}` } : {}),
      ...(item.dietary?.includes('vg')
        ? { suitableForDiet: 'https://schema.org/VeganDiet' }
        : item.dietary?.includes('v')
          ? { suitableForDiet: 'https://schema.org/VegetarianDiet' }
          : item.dietary?.includes('gf')
            ? { suitableForDiet: 'https://schema.org/GlutenFreeDiet' }
            : {}),
      ...(item.price !== null
        ? {
            offers: {
              '@type': 'Offer',
              price: item.price.toFixed(2),
              priceCurrency: site.currency,
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    })),
  }
}

export function menuSchema() {
  return {
    '@type': 'Menu',
    '@id': ID.menu,
    name: `${site.name} menu`,
    url: `${SITE_URL}/menu`,
    inLanguage: 'en-AU',
    description: `Breakfast, lunch, Five Senses coffee and house-baked sweets at ${site.name} in ${site.address.suburb}, Phillip Island.`,
    provider: { '@id': ID.business },
    hasMenuSection: menu.map(menuSection),
  }
}

/* -------------------------------------------------------------------------- */
/* WebSite, breadcrumbs, FAQ                                                  */
/* -------------------------------------------------------------------------- */

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE_URL,
    name: site.name,
    description: site.description,
    inLanguage: 'en-AU',
    publisher: { '@id': ID.business },
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  }
}

export function faqSchema() {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/* -------------------------------------------------------------------------- */
/* Graph assembly                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Wraps nodes in a single `@graph` so crawlers parse one connected document
 * instead of several disconnected scripts.
 */
export function buildGraph(...nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

/** Human-readable price range summary, handy for meta descriptions. */
export function menuPriceSummary(): string {
  const prices = menu
    .flatMap((category) => category.items)
    .map((item) => item.price)
    .filter((price): price is number => price !== null)

  if (prices.length === 0) return ''
  return `${formatPrice(Math.min(...prices))}–${formatPrice(Math.max(...prices))}`
}
