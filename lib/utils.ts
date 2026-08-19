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

/** Absolute URL for canonicals, OG tags and JSON-LD `@id` values. */
export function absoluteUrl(pathname: string, origin: string): string {
  return new URL(pathname, origin).toString()
}

/** "8 October 2025" — the format used under review quotes. */
export function formatDate(iso: string, locale = 'en-AU'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** Cheap, stable slug for anchors and ids. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    // Strip combining diacritics so "rösti" slugs to "rosti".
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
