/**
 * Small shared helpers. Deliberately dependency-free — `clsx` and
 * `tailwind-merge` are lovely but this site needs neither.
 */

/**
 * Join class names, dropping anything falsy.
 *
 *   cn('p-4', isActive && 'bg-clay', undefined) // "p-4 bg-clay"
 *
 * Note: this does not de-duplicate conflicting Tailwind utilities. Where a
 * conditional class must win, order it last in the call — every use in this
 * codebase already does.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** True for a link that should open as a document rather than navigate (e.g. the menu PDF). */
export function isDocumentHref(href: string): boolean {
  return href.endsWith('.pdf')
}
