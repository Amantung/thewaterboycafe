import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/ui/Icon'

/**
 * The one eyebrow/tag treatment on the site: a small pill, not a hairline.
 *
 * Every "category label above a heading" reads through here so the shape,
 * padding and tracking can't drift between sections. `as` keeps the markup
 * honest — a badge that is really a page's only section heading should still
 * be an <h2>, just styled like every other badge.
 */

type BadgeTag = 'span' | 'p' | 'h2' | 'h3'

type BadgeProps = {
  children: ReactNode
  icon?: IconName
  /** `dark` is for a badge sitting on a photo or a dark band. */
  tone?: 'light' | 'dark'
  as?: BadgeTag
  id?: string
  className?: string
}

export function Badge({ children, icon, tone = 'light', as: Tag = 'span', id, className }: BadgeProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'u-eyebrow inline-flex items-center gap-2 rounded-full border px-3.5 py-[0.4375rem]',
        tone === 'dark'
          ? 'border-cream/25 bg-cream/10 text-cream backdrop-blur-sm'
          : 'border-clay-deep/20 bg-clay/10 text-clay-deep',
        className,
      )}
    >
      {icon && <Icon name={icon} className="h-3 w-3 flex-none" />}
      {children}
    </Tag>
  )
}
