# The Waterboy Cafe

A premium, SEO-first marketing site for a cosy beachside cafe in Cowes, Phillip Island.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion** and **Zod**. Every page is statically prerendered; only a handful of components opt into the client.

---

## ⚠️ Read this before you launch

Two things in this repo still need real content before this goes live as the cafe's
actual site.

| What | Where | Status |
|---|---|---|
| **Reviews** | `lib/data/testimonials.ts` | Original paraphrases of recurring public-review themes, with invented names and no platform attribution ("Guest feedback", not "Google review"). `Review` / `AggregateRating` structured data is **switched off** while any review is a placeholder — see [Structured data](#seo). Replace with genuine reviews (with permission) and flip each `source` to `'verified'`. |
| **Menu prices/descriptions** | `lib/data/menu.ts` | Transcribed from a photograph of the printed board — names and prices are the confident part, but re-check every line against the current board before launch. Small print on a photographed menu board does not always survive the transcription. |
| **Menu PDF** | `public/menu.pdf` | In place — every "View menu" button/link sitewide points at `menuPdfUrl` (`lib/site.ts`) → `/menu.pdf`. Re-check it's the current version before launch. |

Also unconfirmed: the geo coordinates in `lib/site.ts` are approximate, and the closing
times carried in `site.hours` (used only for the LocalBusiness schema, never shown on the
page — see [Opening hours](#opening-hours-are-opening-only)) are a best estimate. Check
both against the Google Business Profile.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then edit
npm run dev                    # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run logo` | Publish the brand mark and every favicon size from `assets/brand/waterboy-logo.png` |

Requires Node 18.18+.

### Troubleshooting

**`PageNotFoundError: Cannot find module for page: /_document` during `next build`.**
Misleading message — it is almost always a failed Google Fonts fetch, not a routing
problem. `next/font/google` downloads DM Serif Display and Poppins at build time and caches
them in `.next/cache`; if you have just deleted `.next` and the network flakes (you will see
`ECONNRESET` or a TLS disconnect a few lines above), the build reports this instead. Just
run `npm run build` again. On a locked-down CI runner, allowlist `fonts.googleapis.com`
and `fonts.gstatic.com`, or cache `.next/cache` between runs.

---

## Environment variables

Copy `.env.example` to `.env.local`. Everything is optional for local development —
the site builds and every form works without a single variable set.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical origin. Drives `metadataBase`, canonical tags, OG URLs, `sitemap.xml` and the JSON-LD `@id` graph. **No trailing slash.** Must be set correctly in production or every canonical and OG URL points at the default domain. |
| `FORM_WEBHOOK_URL` | server | Where contact / newsletter submissions are POSTed as JSON. Unset → submissions are validated and logged server-side, and the form still succeeds. |
| `FORM_WEBHOOK_TOKEN` | server | Optional shared secret, sent as the `X-Webhook-Token` header. |
| `CONTACT_INBOX` | server | Reply-to address included in the webhook payload. |
| `GOOGLE_SITE_VERIFICATION` | server | Optional Search Console verification token. |

---

## Project structure

```
app/
  layout.tsx          Root layout: fonts, sitewide metadata, sitewide JSON-LD graph
  page.tsx            Homepage
  about/ gallery/ contact/
  sitemap.ts          → /sitemap.xml
  robots.ts           → /robots.txt
  error.tsx  not-found.tsx  loading.tsx
  globals.css         Design tokens (@theme) + base + component layers

components/
  ui/                 Button · Container · SectionHeading · Reveal · Icon
  layout/             Navbar · Footer · PageHeader
  home/               Hero · Welcome · StoryStrip · LocationHours
  gallery/            GalleryGrid (bento wall + lightbox)
  forms/              FormField primitives · ContactForm · NewsletterForm
  seo/                JsonLd

lib/
  site.ts             ★ NAP, hours, socials, amenities, menuPdfUrl — single source of truth
  schema.ts           JSON-LD builders (one connected @graph)
  validation.ts       Zod schemas + shared FormState contract
  actions.ts          Server actions for both forms
  utils.ts            cn, document-link helper
  data/
    menu.ts           ★ Menu content, transcribed from the printed board — feeds the
                        Menu JSON-LD and the "View menu" PDF button (public/menu.pdf)
    testimonials.ts   ★ Reviews — feed Review/AggregateRating structured data once verified
    content.ts        Story, about, FAQs
    navigation.ts      Nav model

scripts/
  build-logo.mjs          Publishes the brand mark + every favicon size

public/images/
  Real, static photography — referenced directly by path (e.g.
  `/images/dish-belgian-waffles-berry-compote.jpg`) from the component that
  needs it. No manifest, no lookup layer.

assets/
  brand/
    waterboy-logo.png   The reconstructed, transparent 1024×1024 brand mark
```

★ = the files you will actually edit to change content.

### Client components

Interactivity is isolated to the components that need it; everything else is a server
component and ships no JavaScript.

- `Hero` — a single fade-in on load, no scroll-tied motion
- `Navbar` — scroll state, scroll-spy, mobile panel
- `GalleryGrid`, `Reveal` — subtle entrance motion
- The two form components

---

## Design system

All tokens live in one `@theme` block at the top of `app/globals.css`. Tailwind v4 reads it
and generates both the CSS custom properties and the matching utilities, so
`--color-clay` gives you `bg-clay`, `text-clay`, `border-clay`, and `--text-display-md`
gives you `text-display-md` with its line-height and tracking already attached. There is
**no `tailwind.config.ts`** — v4 is CSS-first.

| Role | Token | Hex |
|---|---|---|
| Background | `linen` | `#f2f0eb` |
| Background alt | `cream` | `#f8f4e8` |
| Dark accent | `coffee` | `#4c3935` |
| Body text | `espresso` | `#2a211f` |
| Muted text | `coffee-soft` | `#6b524c` |
| Accent | `clay` / `clay-deep` | `#b5764c` / `#96603c` |
| Fresh/organic | `sage` / `sage-deep` | `#7c8b6f` / `#5f6d54` |
| Borders | `beige` / `beige-strong` | `#e4dccb` / `#d6cbb4` |

`clay-deep` and `sage-deep` exist because the base `clay` and `sage` do not reach 4.5:1 on
linen. Use the `-deep` variants for text on light surfaces and the base tones on dark.

### Typography

Exactly two faces, everywhere:

| Use | Face |
|---|---|
| Headings, hero titles, section titles | **DM Serif Display** (400 only — that is deliberate) |
| Body, navigation, buttons, labels, forms | **Poppins** (300/400/500/600) |

Both are self-hosted by `next/font/google` — no render-blocking request, no layout shift.
The type scale is fluid and lives entirely in `@theme` as `--text-display-xl` through
`--text-caption`; a component never hardcodes a heading size, it reaches for a scale step.

### Layout primitives

`components/ui/Container.tsx` exports two components every page and section should use
instead of retyping `mx-auto max-w-… px-5 sm:px-8 lg:px-12`:

- **`Container`** — the page gutter and measure (`shell` / `content` / `narrow`).
- **`Section`** — a `<section>` with vertical rhythm (`sm` / `md` / `lg`) wrapping a
  `Container`. Pass `innerClassName` for grid/flex layout on the inner container and
  `className` for a full-bleed background on the outer `<section>`.

### Buttons

One button, `components/ui/Button.tsx`, with five skins (`primary`, `secondary`, `ghost`,
`onDark`, `onDarkOutline`) and three sizes. All the structural styling — pill shape,
uppercase Poppins label, the hover wipe — lives in `.u-btn` in `globals.css`, so no button
anywhere on the site can drift from the others. Every form submit button and every CTA uses
this component; there are no hand-rolled `<button>` styles left in the app.

---

## Photography

Photos live directly in `public/images/`, named descriptively (e.g.
`dish-belgian-waffles-berry-compote.jpg`), and each component that shows one references
its path straight in the JSX or in `lib/data/menu.ts` — there is no manifest or lookup
layer to keep in sync.

Several images are still stock photography under the [Unsplash
Licence](https://unsplash.com/license) (free for commercial use, no attribution required),
sourced to match the brand's warm, beachside, timber-and-linen palette while the cafe's own
photography is arranged.

**To swap in the cafe's own photography**, file-for-file, no code changes needed:

1. Save the new photo into `public/images/` under the same file name as the one it
   replaces (or add a new descriptive, keyword-bearing name — good for image SEO).
2. If you're adding a new file rather than replacing one, update the `src`/`alt` wherever
   it's referenced (grep the file name you're retiring to find every call site).
3. Write real `alt` text describing the actual photo.

### The logo

The brand mark arrived as a small, lossy JPEG on an opaque white square, which fringed and
softened at anything above ~40px. It has been reconstructed — cropped to the disc's true
bounding box, upscaled, and its two flat inks (slate disc, white line art) rebuilt from a
luminance ramp rather than merely stretched — into a crisp, transparent 1024×1024 PNG at
`assets/brand/waterboy-logo.png`. `scripts/build-logo.mjs` publishes that master to
`public/images/waterboy-logo.png` and derives every favicon size from it. If the cafe's
actual vector artwork ever turns up, drop it in as the new master (same 1024px-square,
transparent, disc-touches-all-edges shape) and re-run `npm run logo`.

---

## Forms

Both forms use React 19 server actions with `useActionState`, and are validated
server-side with Zod (`lib/validation.ts`). Client-side `required` attributes are a
convenience — the server is the boundary.

They are progressively enhanced: `<form action={serverAction}>` submits and works with
JavaScript disabled or still downloading. Hydration adds inline field errors and pending
states.

**Delivery** is pluggable and lives in one function — `deliver()` in `lib/actions.ts`.
Submissions are POSTed as JSON to `FORM_WEBHOOK_URL` (Zapier, Make, n8n, Formspree, a
Google Apps Script, your own endpoint). With no webhook configured they are validated and
logged with a loud warning, and the form still reports success, so previews never need
secrets. To move to Resend/Postmark/SendGrid, replace the body of `deliver()` — nothing
else changes.

Each form carries a honeypot field. A filled honeypot is silently discarded and reports
success, because telling a scraper it was caught only helps it adapt.

---

## SEO

**Metadata** — the native Metadata API, no `next-seo` dependency. `metadataBase` is set
from `NEXT_PUBLIC_SITE_URL` in the root layout; every page sets its own title, description,
canonical and OG block. Titles use the template `%s · The Waterboy Cafe`.

**Structured data** — `lib/schema.ts` builds one connected `@graph` rather than a pile of
unrelated blobs. `CafeOrCoffeeShop` (also typed `LocalBusiness` and `Restaurant`) is the
hub; `Menu`, `WebSite`, `BreadcrumbList` and `FAQPage` reference it by `@id`. That is what
lets Google resolve "this menu belongs to this business at this address".

Two guardrails are built in and should stay:

- **Review / AggregateRating markup is emitted only when every testimonial is
  `source: 'verified'`.** Marking up invented reviews violates Google's structured data
  policy and risks a manual action. Replace the samples with real reviews and the schema
  turns itself on — see `EMIT_REVIEW_SCHEMA`'s use in `lib/schema.ts`.
- **Opening hours in the markup come from `lib/site.ts`,** the same source as the visible
  hours row, so the two can never disagree.

### Opening hours are opening-only

The site never shows a closing time — `formatDayHours()` in `lib/site.ts` renders "From
7:30am", not a range. The kitchen winds down when the last table is done rather than at a
fixed hour, so publishing a closing time sets an expectation the cafe cannot reliably keep.
`site.hours[].closes` still exists and is still fed into the `openingHoursSpecification` in
the JSON-LD, because schema.org requires both ends of a range to validate and Google will
not surface an opening-hours block without it — it is just never rendered on the page.

**Sitemap & robots** — generated by `app/sitemap.ts` and `app/robots.ts`. `/reserve` is
`noindex, follow` and deliberately **not** disallowed in robots.txt: blocking it would stop
crawlers ever seeing the noindex. `/_next/image` is deliberately crawlable too, or every
optimised image disappears from Google Images.

**Local SEO** — the NAP is rendered from `lib/site.ts` in the footer (every page), on the
contact page and in the JSON-LD, so all three are byte-identical by construction. Location
keywords ("Cowes", "Phillip Island", "Western Port Bay", "foreshore") appear in real prose
rather than a keyword list.

### Performance

- Fonts self-hosted via `next/font` with `display: swap` — no render-blocking request to
  Google, no layout shift.
- AVIF then WebP, with `deviceSizes` trimmed to the breakpoints the layout actually uses.
- `priority` + `fetchPriority="high"` on the hero (the LCP element) and nothing else.
- Every other image is lazy with an explicit `sizes` matching its rendered width.
- Motion is deliberately minimal and subtle — a short fade-up on scroll, nothing tied to
  scroll position — so scrolling never triggers extra layout or paint work.
- The map iframe is lazy-loaded and its origin is preconnected.
- Grain texture is an inline SVG data URI: no request, no bytes over the wire.

### Accessibility

- One `<h1>` per page, semantic landmarks throughout.
- Skip-to-content link as the first tab stop.
- Lightbox is a real modal: Escape closes, arrows page, focus moves in on open and returns
  to the triggering thumbnail on close, body scroll locked.
- All motion respects `prefers-reduced-motion`; `Reveal` collapses to an instant fade
  rather than disappearing.
- Focus rings are never removed — a clay `:focus-visible` outline is set globally.

---

## Deployment (Vercel)

1. Push the repo and import it at [vercel.com/new](https://vercel.com/new). The framework
   preset, build command and output directory are all detected automatically.
2. Set the environment variables under **Settings → Environment Variables**. At minimum set
   `NEXT_PUBLIC_SITE_URL` to the production origin.
3. Add the custom domain and let Vercel issue the certificate.
4. Submit `https://your-domain/sitemap.xml` in Google Search Console, and validate the
   structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

Any Node host works — `npm run build && npm run start`. Nothing here depends on
Vercel-specific APIs.

### Launch checklist

- [ ] Menu re-checked against the current printed board (`lib/data/menu.ts`)
- [ ] Menu PDF at `public/menu.pdf` confirmed current (every "View menu" CTA links here)
- [ ] **Confirmed** opening and closing times in `lib/site.ts`
- [ ] Geo coordinates checked against the Google Business Profile
- [ ] Real reviews in `lib/data/testimonials.ts` (with permission), every `source` `'verified'`
- [ ] Real photography swapped in per [Photography](#photography), or the Unsplash sourcing accepted for launch
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin
- [ ] `FORM_WEBHOOK_URL` wired up and a test submission received
- [ ] Facebook URL in `lib/site.ts` verified (currently assumed from the handle)
- [ ] Rich Results Test passes; Search Console sitemap submitted

---

## CMS readiness

Content is typed data, not JSX. `lib/data/*` exports plain, flat, id-keyed structures that
map cleanly onto a Sanity or Contentful schema, and every component imports the *shape*
rather than the strings. Swapping in a CMS means replacing the bodies of those modules with
queries — no component changes.

---

## Attribution

Copy, menu descriptions and reviews are original writing, informed by the cafe's public
presence (Instagram [@thewaterboycafe](https://www.instagram.com/thewaterboycafe) and the
printed menu board). Nothing is copied verbatim. Photography is sourced from Unsplash under
its free commercial licence — see [Photography](#photography).
