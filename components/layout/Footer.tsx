import Image from 'next/image'
import Link from 'next/link'

import { site, formattedAddress, groupedHours, directionsUrl } from '@/lib/site'
import { footerNav } from '@/lib/data/navigation'
import { Icon } from '@/components/ui/Icon'
import { Container } from '@/components/ui/Container'
import { CtaLink } from '@/components/ui/Editorial'
import { Statement } from '@/components/ui/Statement'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { cn } from '@/lib/utils'

const LOGO = { src: '/images/waterboy-logo.png', width: 1024, height: 1024 }

/**
 * Site footer — the last page of the magazine.
 *
 * It opens with a sign-off at the largest size on the site rather than with a
 * newsletter box, because the final thing a reader sees should be the brand
 * speaking, not a form asking. Everything practical follows underneath as a
 * colophon: ruled columns, small caps, tabular hours.
 *
 * Doubles as the local-SEO block. The NAP is rendered here on every page in
 * the exact same wording as the contact page and the JSON-LD, so all three are
 * byte-identical by construction.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const hours = groupedHours()

  return (
    <footer className="relative overflow-hidden bg-espresso text-cream/75">
      {/* Warm grain keeps the large dark field from looking flat. */}
      <div aria-hidden="true" className="u-grain pointer-events-none absolute inset-0" />

      <Container className="relative">
        {/* Sign-off ------------------------------------------------------ */}
        <div className="flex flex-col gap-10 pb-14 pt-20 sm:pt-24 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-16 lg:pt-32">
          <Statement
            size="statement"
            tone="dark"
            lines={['See you', { text: 'by the sea.', accent: true }]}
          />

          <div className="flex flex-none flex-col items-start gap-7 lg:items-end lg:pb-4">
            <Image
              src={LOGO.src}
              alt={`${site.name} logo`}
              width={LOGO.width}
              height={LOGO.height}
              loading="lazy"
              sizes="112px"
              className="h-20 w-20 rounded-full sm:h-28 sm:w-28"
            />
            <CtaLink href="/contact" tone="dark">
              Visit us
            </CtaLink>
          </div>
        </div>

        {/* Newsletter ---------------------------------------------------- */}
        <div className="grid gap-8 border-t border-cream/12 py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20 lg:py-14">
          <div>
            <p className="u-micro text-cream/40">Keep in touch</p>
            <h2 className="mt-4 font-display text-display-sm text-cream">
              Seasonal menus, specials, and the odd long weekend notice
            </h2>
            <p className="mt-3 max-w-lg text-body-sm text-cream/60">
              One short email when something changes worth knowing about. No
              daily marketing, and you can leave whenever you like.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Colophon ------------------------------------------------------ */}
        <div className="grid gap-12 border-t border-cream/12 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-14">
          {/* NAP */}
          <div className="lg:col-span-4">
            <p className="u-micro text-cream/40">The Waterboy Cafe</p>

            <address className="mt-5 space-y-3 text-body-sm not-italic">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
              >
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                <span className="u-underline">{formattedAddress}</span>
              </a>
              <a
                href={`tel:${site.phone}`}
                className="group flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
              >
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                <span className="u-underline u-label">{site.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
              >
                <Icon name="heart" className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                <span className="u-underline">{site.email}</span>
              </a>
            </address>

            <div className="mt-7 flex gap-3">
              <SocialLink
                href={site.socials.instagram}
                icon="instagram"
                label={`${site.name} on Instagram`}
              />
              <SocialLink
                href={site.socials.facebook}
                icon="facebook"
                label={`${site.name} on Facebook`}
              />
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="lg:col-span-2">
              <h3 className="u-micro text-cream/40">{column.heading}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="u-underline text-body-sm text-cream/75 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Hours */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="u-micro text-cream/40">Opening hours</h3>
            <dl className="mt-5 space-y-2.5">
              {hours.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 text-body-sm"
                >
                  <dt className="text-cream/70">{row.label}</dt>
                  <span aria-hidden="true" className="h-px flex-1 translate-y-[-2px] bg-cream/12" />
                  <dd className="u-label whitespace-nowrap text-cream/90">{row.hours}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-caption text-cream/50">
              Free coffee Monday to Friday for local police, ambulance and
              paramedic crews — thank you for looking after the island.
            </p>
          </div>
        </div>

        {/* Legal --------------------------------------------------------- */}
        <div className="flex flex-col gap-4 border-t border-cream/12 py-8 text-caption text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Proudly serving</span>
            <span className="text-cream/70">Five Senses Coffee</span>
            <span aria-hidden="true">·</span>
            <span>
              We acknowledge the Bunurong people, Traditional Custodians of this
              land and its waters.
            </span>
          </p>
        </div>
      </Container>
    </footer>
  )
}

/**
 * Instagram gets the featured treatment — filled, warm, a little more
 * physical — since it is where the day-to-day content actually lives.
 * Facebook stays the quiet outline. Two different weights, not two copies of
 * the same generic circle-with-a-glyph button.
 */
function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: 'instagram' | 'facebook'
  label: string
}) {
  const isInstagram = icon === 'instagram'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'group inline-flex h-11 w-11 items-center justify-center border transition-all duration-500 ease-editorial motion-ok:hover:-translate-y-0.5',
        isInstagram
          ? 'border-clay bg-clay/90 text-cream hover:bg-clay-deep'
          : 'border-cream/20 text-cream/75 hover:border-cream/40 hover:bg-cream/10 hover:text-cream',
      )}
    >
      <Icon
        name={icon}
        className="h-[1.15rem] w-[1.15rem] transition-transform duration-500 ease-editorial group-hover:rotate-[8deg]"
      />
    </a>
  )
}
