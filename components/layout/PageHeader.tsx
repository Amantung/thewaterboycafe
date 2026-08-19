import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { img, type ImageKey } from '@/lib/data/images'
import { cn } from '@/lib/utils'

/**
 * Masthead for interior pages.
 *
 * Carries the single <h1> for the page plus a visible breadcrumb trail. The
 * trail is a real <nav aria-label="Breadcrumb"> with an ordered list — the
 * same structure the BreadcrumbList JSON-LD describes, so the visible UI and
 * the markup agree.
 *
 * The photograph is this page's LCP element, so it ships instantly — no
 * `Reveal` wrapper, `priority` + `fetchPriority="high"`, same discipline as
 * the homepage Hero. Only the copy beside it animates in.
 *
 * Top padding here is breathing room, not navbar clearance — the sticky
 * Navbar sits in normal document flow and already occupies its own space.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  image,
  children,
  className,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  breadcrumbs?: { name: string; path: string }[]
  image: ImageKey
  children?: ReactNode
  className?: string
}) {
  const photo = img(image)

  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-beige bg-linen pt-12 sm:pt-16',
        className,
      )}
    >
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-60" />

      <Container className="relative">
        {breadcrumbs.length > 0 && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-caption text-coffee-soft/75">
                <li>
                  <Link href="/" className="u-underline transition-colors hover:text-coffee">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  return (
                    <li key={crumb.path} className="flex items-center gap-2">
                      <Icon name="arrowRight" className="h-3 w-3 opacity-40" />
                      {isLast ? (
                        <span aria-current="page" className="text-coffee">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          href={crumb.path}
                          className="u-underline transition-colors hover:text-coffee"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-10 pb-16 sm:gap-12 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24">
          {/* Copy -------------------------------------------------------- */}
          <div className="order-2 min-w-0 max-w-xl lg:order-1">
            {eyebrow && (
              <Reveal>
                <Badge className="mb-5">{eyebrow}</Badge>
              </Reveal>
            )}

            <Reveal delay={0.05}>
              <h1 className="text-display-lg text-coffee">{title}</h1>
            </Reveal>

            {description && (
              <Reveal delay={0.1}>
                <div className="mt-6 max-w-2xl text-lead font-light text-coffee-soft">
                  {description}
                </div>
              </Reveal>
            )}

            {children && (
              <Reveal delay={0.16}>
                <div className="mt-9">{children}</div>
              </Reveal>
            )}
          </div>

          {/* Photograph ---------------------------------------------------
              Full-bleed strip on mobile (broken out of the container gutter),
              settles into a framed, bordered card from sm: up — the same
              recipe StoryStrip and the About chapters already use, so the
              banner reads as one more member of an existing family rather
              than a new visual idea. */}
          <div className="order-1 -mx-5 sm:mx-0 lg:order-2">
            <div className="relative aspect-4/3 overflow-hidden bg-sand sm:aspect-video sm:rounded-[var(--radius-organic)] sm:border sm:border-beige sm:shadow-soft lg:aspect-4/5 lg:shadow-lifted">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              {/* Fades the mobile full-bleed crop into the page background
                  instead of ending on a hard line. Hidden once the image
                  becomes a contained card at sm:+. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-linen sm:hidden"
              />
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
