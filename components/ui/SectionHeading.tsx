import { cloneElement, isValidElement, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/Editorial'
import { Statement, type StatementLine } from '@/components/ui/Statement'

const SIZES = {
  statement: 'statement',
  '2xl': '2xl',
  xl: 'xl',
  lg: 'lg',
  md: 'md',
  sm: 'sm',
} as const

type Size = keyof typeof SIZES

const MEASURES = {
  default: 'max-w-2xl',
  wide: 'max-w-4xl',
  full: '',
} as const

const BIG: Size[] = ['statement', '2xl', 'xl']

type SectionHeadingProps = {
  eyebrow?: ReactNode
  labelVariant?: 'rule' | 'pill'
  title: ReactNode | StatementLine[]
  description?: ReactNode
  level?: 1 | 2 | 3
  align?: 'left' | 'center'
  size?: Size
  tone?: 'light' | 'dark'
  measure?: keyof typeof MEASURES
  className?: string
  titleClassName?: string
  id?: string
  children?: ReactNode
}

export function SectionHeading({
  eyebrow, 
  labelVariant = 'rule',
  title,
  description,
  level = 2,
  align = 'left',
  size = 'md',
  tone = 'light',
  measure,
  className,
  titleClassName,
  id,
  children,
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  const resolvedMeasure = measure ?? (BIG.includes(size) ? 'full' : 'default')
  const lines: StatementLine[] = (Array.isArray(title) ? title : [title]).map((line, index) =>
    isValidElement(line) && line.key === null
      ? cloneElement(line, { key: `line-${index}` })
      : line,
  )

  return (
    <div
      className={cn(MEASURES[resolvedMeasure], align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && (
        <Reveal>
          <div className={cn(align === 'center' && 'flex justify-center')}>
            <SectionLabel tone={tone} variant={labelVariant}>
              {eyebrow}
            </SectionLabel>
          </div>
        </Reveal>
      )}

      <Statement
        id={id}
        as={`h${level}`}
        size={SIZES[size]}
        tone={tone}
        align={align}
        lines={lines}
        className={cn(Boolean(eyebrow) && 'mt-6 sm:mt-7', titleClassName)}
      />

      {description && (
        <Reveal delay={0.1}>
          <div
            className={cn(
              'mt-5 text-lead font-light',
              resolvedMeasure === 'full' && align === 'left' && 'max-w-xl',
              dark ? 'text-cream/75' : 'text-coffee-soft',
            )}
          >
            {description}
          </div>
        </Reveal>
      )}

      {children && (
        <Reveal delay={0.15}>
          <div className={cn('mt-8', align === 'center' && 'flex justify-center')}>{children}</div>
        </Reveal>
      )}
    </div>
  )
}
