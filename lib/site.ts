/**
 * Site-wide configuration: NAP (name / address / phone), hours, socials.
 *
 * ⚠️  SINGLE SOURCE OF TRUTH — every page, the footer, the contact block and
 * every JSON-LD graph read from here. Local SEO depends on the NAP string
 * being byte-identical everywhere it appears, so never hardcode the address
 * or phone number in a component.
 */

export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type OpeningHours = {
  day: WeekDay
  /** 24h "HH:MM", or null when closed. */
  opens: string | null
  closes: string | null
}

/**
 * Origin used for canonicals, OG tags, sitemap and the JSON-LD @id graph.
 *
 * `||` rather than `??`: some hosts (Vercel, Netlify, …) let an env var be
 * declared with an empty value, which reads back as `""` — not `undefined` —
 * so a nullish-coalescing fallback never kicks in and `new URL('')` throws
 * `ERR_INVALID_URL` while collecting page data for every route, including the
 * automatic /not-found page.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thewaterboycafe.com.au'
).replace(/\/$/, '')

export const site = {
  name: 'The Waterboy Cafe',
  /** Used in <title> templates — kept short so titles stay under ~60 chars. */
  shortName: 'The Waterboy',
  legalName: 'The Waterboy Cafe',
  tagline: 'Happiness comes one cup of a time.',
  altTagline: 'Homemade with Heart, Brewed with Five Senses Coffee',
  description:
    "Phillip Island's cosy beachside cafe in Cowes. Scratch-made breakfast and lunch, Five Senses specialty coffee, and a dog-friendly courtyard a short stroll from the foreshore.",

  /* ---- NAP ------------------------------------------------------------- */
  address: {
    street: '58 Chapel Street',
    suburb: 'Cowes',
    region: 'Victoria',
    regionCode: 'VIC',
    postcode: '3922',
    country: 'Australia',
    countryCode: 'AU',
  },

  /** Approximate — verify against the Google Business Profile before launch. */
  geo: { latitude: -38.4519, longitude: 145.2389 },

  /** E.164 for tel: links, national format for display. */
  phone: '+61359525765',
  phoneDisplay: '(03) 5952 5765',
  email: 'Info@thewaterboycafe.com.au',


  hours: [
    { day: 'Monday', opens: '07:30', closes: '2:30pm' },
    { day: 'Tuesday', opens: '07:30', closes: '2:30pm' },
    { day: 'Wednesday', opens: '07:30', closes: '2:30pm' },
    { day: 'Thursday', opens: '07:30', closes: '2:30pm' },
    { day: 'Friday', opens: '07:30', closes: '2:30pm' },
    { day: 'Saturday', opens: '07:30', closes: '2:30pm' },
    { day: 'Sunday', opens: '07:30', closes: '2:30pm' },
  ] satisfies OpeningHours[],

  /** IANA zone — used to work out "Open now" against the roster above. */
  timeZone: 'Australia/Melbourne',

  /* ---- Socials --------------------------------------------------------- */
  socials: {
    instagram: 'https://www.instagram.com/thewaterboycafe',
    instagramHandle: '@thewaterboycafe',
    facebook: 'https://www.facebook.com/thewaterboycafe',
  },

  /* ---- Commerce -------------------------------------------------------- */
  priceRange: '$$',
  currency: 'AUD',
  servesCuisine: ['Cafe', 'Breakfast', 'Brunch', 'Australian'],
  paymentAccepted: ['Cash', 'EFTPOS', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay'],

  /** Rendered as the amenity chips in the highlights grid and the footer. */
  amenities: [
    'Alfresco seating',
    'Dog friendly',
    'Family friendly',
    'Takeaway', 
    'Car park',
    'Water views',
  ],

  /** Keyword anchors for local SEO copy — keep these phrases in real prose. */
  localKeywords: [
    'cafe Cowes',
    'Phillip Island breakfast',
    'best coffee Phillip Island',
    'dog friendly cafe Cowes',
    'brunch Phillip Island',
  ],
} as const

/** "58 Chapel Street, Cowes VIC 3922" — the canonical one-line NAP address. */
export const formattedAddress = `${site.address.street}, ${site.address.suburb} ${site.address.regionCode} ${site.address.postcode}`

/** Keyless Google Maps embed — resolves by address, so no API key or billing. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${site.name}, ${formattedAddress}`,
)}&output=embed`

/** Deep link that opens turn-by-turn directions in the user's maps app. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.name}, ${formattedAddress}`,
)}`

/**
 * The menu PDF, kept as one constant so a future swap of the real file is a
 * one-line change. No file exists at this path yet — the client will supply
 * the final menu; every "View menu" CTA points here regardless.
 */
export const menuPdfUrl = '/menu.pdf'

/* -------------------------------------------------------------------------- */
/* Hours helpers                                                              */
/* -------------------------------------------------------------------------- */

/** "7:30am" from "07:30". */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, '0')}${period}`
}

/**
 * "Open 7:30am to 2:30pm", or "Closed" on a day with no opening time.
 *
 * Opening time only, by design. The kitchen winds down when the last table is
 * done rather than at a fixed hour, so publishing a closing time sets an
 * expectation the cafe cannot reliably keep — and a visitor who arrives at
 * 2:55pm to a closing kitchen is a worse outcome than one who rings ahead.
 * `closes` is still carried in the schema for Google's benefit; it is
 * deliberately never rendered.
 */
export function formatDayHours(entry: OpeningHours): string {
  if (!entry.opens) return 'Closed'
  return `From ${formatTime(entry.opens)}`
}

/**
 * One-line hours claim for the hero trust strip and meta copy.
 *
 * Derived rather than hardcoded so the headline promise can never contradict
 * the hours table and the LocalBusiness schema. Change `hours` above and this
 * follows.
 */
export function openingSummary(): string {
  const open = site.hours.filter((entry) => entry.opens)
  if (open.length === 0) return 'Currently closed'

  const earliest = open.reduce((min, entry) =>
    entry.opens! < min.opens! ? entry : min,
  )

  return open.length === 7
    ? `Open from ${formatTime(earliest.opens!)}, 7 days`
    : `Open ${open.length} days, from ${formatTime(earliest.opens!)}`
}

/**
 * Collapses the week into display rows, merging runs of identical days:
 * seven identical days become one "Monday – Sunday" row instead of seven.
 */
export function groupedHours(): { label: string; hours: string }[] {
  const rows: { label: string; hours: string }[] = []

  for (const entry of site.hours) {
    const hours = formatDayHours(entry)
    const previous = rows.at(-1)

    if (previous && previous.hours === hours) {
      // Extend the run: "Monday" → "Monday – Tuesday" → "Monday – Wednesday".
      const [start] = previous.label.split(' – ')
      previous.label = `${start} – ${entry.day}`
    } else {
      rows.push({ label: entry.day, hours })
    }
  }

  return rows
}
