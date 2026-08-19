import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

/**
 * Masthead for interior pages.
 *
 * A full-bleed photograph with the same scrim recipe as the homepage Hero
 * (`u-hero-scrim`, defined once in globals.css) — one visual language for
 * "photograph with type over it" across the whole site, not a second design
 * invented for interior pages. Carries the single <h1> for the page plus a
 * visible breadcrumb trail: a real <nav aria-label="Breadcrumb"> with an
 * ordered list, matching the BreadcrumbList JSON-LD structure.
 *
 * The photograph is this page's LCP element, so it ships instantly — no
 * `Reveal` wrapper, `priority` + `fetchPriority="high"`, same discipline as
 * the Hero. Only the copy over it animates in.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  imageSrc,
  imageAlt,
  imagePosition = 'object-center',
  children,
  className,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  breadcrumbs?: { name: string; path: string }[]
  imageSrc: string
  imageAlt: string
  /** Tailwind object-position utility — override when the subject sits off-centre. */
  imagePosition?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('relative overflow-hidden bg-espresso', className)}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={cn('object-cover', imagePosition)}
      />

      {/* Same scrim as the homepage Hero — one photograph-with-type language
          across the whole site. */}
      <div aria-hidden="true" className="u-hero-scrim absolute inset-0" />
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-50" />

      {breadcrumbs.length > 0 && (
        <Reveal as="div" className="absolute inset-x-0 top-8 z-10 sm:top-10">
          <Container>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-caption text-cream/70">
                <li>
                  <Link href="/" className="u-underline transition-colors hover:text-cream">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  return (
                    <li key={crumb.path} className="flex items-center gap-2">
                      <Icon name="arrowRight" className="h-3 w-3 opacity-50" />
                      {isLast ? (
                        <span aria-current="page" className="text-cream">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          href={crumb.path}
                          className="u-underline transition-colors hover:text-cream"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          </Container>
        </Reveal>
      )}

      <Container className="relative flex min-h-[24rem] flex-col justify-end gap-8 pb-12 pt-28 sm:min-h-[28rem] sm:pb-16 sm:pt-32 lg:min-h-[32rem] lg:pb-20">
        <div className="max-w-2xl">
          {eyebrow && (
            <Reveal>
              <Badge tone="dark">{eyebrow}</Badge>
            </Reveal>
          )}

          <Reveal delay={0.05}>
            <h1 className="mt-5 text-display-lg text-cream">{title}</h1>
          </Reveal>

          {description && (
            <Reveal delay={0.1}>
              <div className="mt-5 max-w-xl text-lead font-light text-cream/80">
                {description}
              </div>
            </Reveal>
          )}

          {children && (
            <Reveal delay={0.16}>
              <div className="mt-8">{children}</div>
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  )
}
