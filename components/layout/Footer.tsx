import Image from 'next/image'
import Link from 'next/link'

import { site, formattedAddress, groupedHours, directionsUrl } from '@/lib/site'
import { footerNav } from '@/lib/data/navigation'
import { img } from '@/lib/data/images'
import { Icon } from '@/components/ui/Icon'
import { Container } from '@/components/ui/Container'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { cn } from '@/lib/utils'

const logo = img('logo')

/**
 * Site footer.
 *
 * Doubles as the local-SEO block: the NAP is rendered here on every page in
 * the exact same wording as the contact page and the JSON-LD, so all three
 * are byte-identical by construction.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const hours = groupedHours()

  return (
    <footer className="relative overflow-hidden bg-coffee text-cream/80">
      {/* Warm grain keeps the large dark field from looking flat. */}
      <div aria-hidden="true" className="u-grain pointer-events-none absolute inset-0" />

      <Container className="relative">
        {/* Newsletter ---------------------------------------------------- */}
        <div className="grid gap-10 border-b border-cream/12 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:py-16">
          <div>
            <h2 className="text-display-sm text-cream">
              Seasonal menus, specials, and the odd long weekend notice
            </h2>
            <p className="mt-4 max-w-lg text-body-sm text-cream/65">
              One short email when something changes worth knowing about. No daily
              marketing, and you can leave whenever you like.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Columns -------------------------------------------------------- */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + NAP */}
          <div className="lg:col-span-4">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              sizes="150px"
              className="h-24 w-24 rounded-full"
            /> 

            <address className="mt-6 space-y-3 text-body-sm not-italic">
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
              <h3 className="u-eyebrow text-cream">{column.heading}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="u-underline text-sm text-cream/75 transition-colors hover:text-cream"
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
            <h3 className="u-eyebrow text-cream/45">Opening hours</h3>
            <dl className="mt-5 space-y-2.5">
              {hours.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 text-body-sm"
                >
                  <dt className="text-cream/70">{row.label}</dt>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 translate-y-[-2px] bg-cream/12"
                  />
                  <dd className="u-label whitespace-nowrap text-cream/90">{row.hours}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-caption text-cream/50">
              Free coffee Monday to Friday for local police, ambulance and paramedic
              crews — thank you for looking after the island.
            </p>
          </div>
        </div>

        {/* Legal ---------------------------------------------------------- */}
        <div className="flex flex-col gap-4 border-t border-cream/12 py-8 text-caption text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Proudly serving</span>
            <span className="text-cream/70">Five Senses Coffee</span>
            <span aria-hidden="true">·</span>
            <span>
              We acknowledge the Bunurong people, Traditional Custodians of this land
              and its waters.
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
        'group inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ease-editorial motion-ok:hover:-translate-y-0.5',
        isInstagram
          ? 'border-clay bg-clay/90 text-cream shadow-soft hover:bg-clay-deep hover:shadow-lifted'
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
