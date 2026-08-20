import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The page shell. Every horizontal edge on the site comes from here.
 *
 * Before this existed the gutter was retyped in twenty-odd places as
 * `mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12`, which is exactly the kind of
 * thing that drifts: one section ends up at px-6, another at max-w-7xl, and the
 * left edges of the page stop lining up. Now the measure and the gutter live in
 * one component and one token (`--container-shell`), so the whole site moves
 * together.
 *
 * `width` picks the measure, not the padding — the gutter is constant at every
 * width so narrow content still starts at the same left edge as wide content
 * when both are centred.
 *
 *   shell   — default. Full-width sections: grids, galleries, hero copy.
 *   content — long-form prose and forms, held to a comfortable line length.
 *   narrow  — centred single-column intros and closing calls to action.
 *
 * `as` keeps the markup honest: pass `as="section"` or `as="header"` rather
 * than wrapping a semantic element around a div that already does the job.
 */

type ContainerWidth = 'shell' | 'content' | 'narrow'

const WIDTHS: Record<ContainerWidth, string> = {
  shell: 'max-w-(--container-shell)',
  content: 'max-w-3xl',
  narrow: 'max-w-2xl',
}

type ContainerProps = {
  children: ReactNode
  width?: ContainerWidth
  as?: ElementType
  className?: string
  /** For values a utility class cannot express — e.g. `--header-h` clearance. */
  style?: CSSProperties
  id?: string
}

export function Container({
  children,
  width = 'shell',
  as: Tag = 'div',
  className,
  style,
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      style={style}
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-12',
        WIDTHS[width],
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Vertical rhythm to match Container's horizontal rhythm.
 *
 * Section padding was the other thing drifting — py-24 here, py-20 there,
 * py-28 somewhere else — which is what makes a page feel unresolved even when
 * every individual section looks fine. Three steps is enough:
 *
 *   sm — a band that sits tight against its neighbour, e.g. a notice strip.
 *   md — default. Every ordinary content section.
 *   lg — the moments that need air: closing CTAs, a single-statement band.
 */

type SectionWidth = ContainerWidth
type SectionSpace = 'sm' | 'md' | 'lg'

const SPACES: Record<SectionSpace, string> = {
  sm: 'py-14 sm:py-16',
  md: 'py-20 sm:py-24 lg:py-28',
  lg: 'py-24 sm:py-32 lg:py-40',
}

type SectionProps = {
  children: ReactNode
  /** Rendered on the <section> itself, so a background spans the full bleed. */
  className?: string
  /** Rendered on the inner Container, for grids and text alignment. */
  innerClassName?: string
  width?: SectionWidth
  space?: SectionSpace
  id?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

export function Section({
  children,
  className,
  innerClassName,
  width = 'shell',
  space = 'md',
  id,
  ...aria
}: SectionProps) {
  return (
    <section id={id} className={cn('relative', SPACES[space], className)} {...aria}>
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    </section>
  )
}
