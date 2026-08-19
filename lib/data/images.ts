/**
 * Typed accessors over the image manifest.
 *
 * The manifest itself lives in `images.json` because
 * `scripts/build-photography.mjs` reads the same file to render every JPEG in
 * /public/images — keeping one list means the files on disk, their dimensions
 * and their alt text can never fall out of sync.
 *
 * Every image is described by `width`/`height` so `next/image` can reserve the
 * exact box before the bytes arrive. That is the whole CLS story for this site.
 */

import manifest from '@/lib/data/images.json'

export type ImageTone =
  | 'espresso'
  | 'coffee'
  | 'clay'
  | 'sage'
  | 'linen'
  | 'butter'
  | 'rose'
  | 'dusk'

export type SiteImage = {
  key: string
  /** File name inside /public/images. Descriptive, keyword-bearing, SEO-friendly. */
  file: string
  /** Required. Describes the image; never decorative filler. */
  alt: string
  width: number
  height: number
  /** Dominant warmth of the photograph, used to tint its loading surface. */
  tone: ImageTone
  /** Short caption shown in the gallery lightbox. */
  label: string
}

const images = manifest.images as SiteImage[]

const byKey = new Map<string, SiteImage>(images.map((image) => [image.key, image]))

export type ImageKey = string

/** Everything `next/image` needs for one entry, in one spread. */
export type ImageProps = {
  src: string
  alt: string
  width: number
  height: number
  label: string
  tone: ImageTone
}

/**
 * Resolve a manifest key to `next/image` props.
 *
 * Throws on an unknown key rather than rendering a broken image — a typo'd key
 * should fail the build, not ship a grey box to production.
 */
export function img(key: ImageKey): ImageProps {
  const entry = byKey.get(key)

  if (!entry) {
    throw new Error(
      `[images] Unknown image key "${key}". Add it to lib/data/images.json, then run \`npm run photos\`.`,
    )
  }

  return {
    src: `/images/${entry.file}`,
    alt: entry.alt,
    width: entry.width,
    height: entry.height,
    label: entry.label,
    tone: entry.tone,
  }
}

/** All manifest entries whose key starts with "gallery", in manifest order. */
export const galleryImages: SiteImage[] = images.filter((image) =>
  image.key.startsWith('gallery'),
)

/** Absolute URL for the default Open Graph card. */
export const OG_IMAGE = img('ogDefault')
