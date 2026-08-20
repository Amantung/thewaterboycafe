import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/Editorial'
import { Statement, type StatementLine } from '@/components/ui/Statement'
import { cn } from '@/lib/utils'

/**
 * The masthead every interior page opens with.
 *
 * One hero system for six pages. Each page brings its own photograph, label,
 * title and copy; none of them brings its own type scale, easing curve or
 * badge. That is the whole point of this component existing — before it was
 * consolidated, the eyebrow here was a hand-rolled pill carrying
 * `text-[0.6875rem] tracking-[0.18em]`, its own `cubic-bezier(0.19,1,0.22,1)`
 * and a bespoke glow shadow, none of which appeared anywhere else on the site.
 * It now renders `SectionLabel variant="pill"`, the same component the
 * homepage sections use.
 *
 * The title goes through `Statement`, so an interior <h1> enters with the same
 * line-by-line mask as the homepage hero and steps from the same display ramp.
 * `xl` rather than the homepage's `statement`: the homepage gets the loudest
 * size on the site exactly once, and interior pages sit one rung below it.
 *
 * The photograph is this page's LCP element, so it ships immediately — no
 * reveal wrapper, `priority` + `fetchPriority="high"`. Only the copy animates.
 *
 * The site header is `fixed` and overlays this masthead by design; the
 * clearance for it is reserved here via `--header-h` rather than by a spacer
 * in the header, which is what lets the header sit transparently on the
 * photograph at the top of every interior page.
 */

type Crumb = { name: string; path: string }

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  imageSrc,
  imageAlt,
  imagePosition = 'object-center',
  children,
  className,
}: {
  eyebrow?: string
  /**
   * A string for a single line, or an array to control where the lines break
   * and which one carries the clay accent — preferred for anything long
   * enough to wrap, since a wrapped line shares one reveal mask.
   */
  title: ReactNode | StatementLine[]
  description?: ReactNode
  /** Rendered as a visible trail and picked up by the page's BreadcrumbList. */
  breadcrumbs?: Crumb[]
  imageSrc: string
  imageAlt: string
  /** Tailwind object-position utility — override when the subject sits off-centre. */
  imagePosition?: string
  children?: ReactNode
  className?: string
}) {
  const lines: StatementLine[] = Array.isArray(title) ? title : [title]

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

      {/* Same scrim recipe as the homepage hero — one photograph-with-type
          language across the whole site. */}
      <div aria-hidden="true" className="u-hero-scrim absolute inset-0" />
      <div aria-hidden="true" className="u-grain absolute inset-0 opacity-50" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Container
          className="absolute inset-x-0 z-10"
          style={{ top: 'calc(var(--header-h) + 1rem)' }}
        >
          <Reveal>
            <nav aria-label="Breadcrumb">
              <ol className="u-micro flex flex-wrap items-center gap-x-2.5 gap-y-1 text-cream/55">
                <li>
                  <Link href="/" className="u-underline transition-colors hover:text-cream">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  return (
                    <li key={crumb.path} className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="text-cream/30">
                        /
                      </span>
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
          </Reveal>
        </Container>
      )}

      <Container
        className="relative flex min-h-[26rem] flex-col justify-end gap-8 pb-12 sm:min-h-[30rem] sm:pb-16 lg:min-h-[34rem] lg:pb-20"
        style={{ paddingTop: 'calc(var(--header-h) + 5rem)' }}
      >
        <div>
          {eyebrow && (
            <Reveal>
              <SectionLabel tone="dark" variant="pill">
                {eyebrow}
              </SectionLabel>
            </Reveal>
          )}

          <Statement
            as="h1"
            size="xl"
            tone="dark"
            trigger="load"
            delay={0.05}
            lines={lines}
            className={cn('max-w-4xl', eyebrow && 'mt-6 sm:mt-7')}
          />

          {description && (
            <Reveal delay={0.12}>
              <div className="mt-6 max-w-xl text-lead font-light text-cream/80">
                {description}
              </div>
            </Reveal>
          )}

          {children && (
            <Reveal delay={0.18}>
              <div className="mt-9">{children}</div>
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  )
}
