/**
 * Publishes the brand mark and derives every favicon from it.
 *
 *   npm run logo
 *
 * ── Why this script exists ────────────────────────────────────────────────
 * The mark was originally supplied as a 447px lossy JPEG on an opaque white
 * square. At any size above roughly 40px the disc edge fringed and the line
 * art went soft, and on the linen and coffee surfaces the white square showed
 * as a visible box around the badge.
 *
 * The mark is a flat two-colour design — white line art on a slate disc — so
 * it was repaired by reconstruction rather than upscaling, once:
 *
 *   1. Cropped to the disc's true bounding box (50…462 of the 512px source),
 *      so the mark fills its own frame and can be sized by one dimension.
 *   2. Upscaled with lanczos3, then luminance pushed through a contrast ramp
 *      (slate below 122, ink above 232, linear between). With only two inks,
 *      re-mapping luminance to a slate→white blend rebuilds clean strokes
 *      while keeping the antialiasing a hard threshold would destroy.
 *   3. Masked with a mathematically exact circle, so the disc edge no longer
 *      inherits the JPEG's fringe and everything outside it is transparent.
 *
 * The result is checked in at assets/brand/waterboy-logo.png and is now
 * the source of truth. This script only publishes and downsamples it, so it is
 * idempotent — re-running never re-applies the ramp and degrades the art.
 *
 * If the cafe's original vector artwork ever turns up, drop it in as the master
 * (1024px square, transparent, disc touching all four edges) and re-run.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const publicDir = path.join(root, 'public')
const imagesDir = path.join(publicDir, 'images')

const MASTER = path.join(root, 'assets', 'brand', 'waterboy-logo.png')

/** Linen, matching --color-linen, for the icons that must be opaque. */
const LINEN = { r: 242, g: 240, b: 235, alpha: 1 }

/**
 * Browser tabs, Android install prompts and the iOS home screen.
 *
 * These are flattened onto linen deliberately: a transparent PNG renders on a
 * black plate in several Android launchers, and iOS ignores alpha entirely.
 */
const ICONS = [
  ['favicon-32.png', 32],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]

async function main() {
  await mkdir(imagesDir, { recursive: true })

  const master = await readFile(MASTER)
  const { width, height } = await sharp(master).metadata()

  if (width !== height) {
    throw new Error(`Master must be square; got ${width}×${height}.`)
  }

  await writeFile(path.join(imagesDir, 'waterboy-logo.png'), master)
  console.log(`  ✓ images/waterboy-logo.png            ${width}×${height}  transparent`)

  for (const [file, size] of ICONS) {
    // 10% breathing room so rounded launcher masks never clip the disc.
    const inner = Math.round(size * 0.9)

    await sharp({ create: { width: size, height: size, channels: 4, background: LINEN } })
      .composite([
        {
          input: await sharp(master).resize(inner, inner, { kernel: 'lanczos3' }).toBuffer(),
          gravity: 'centre',
        },
      ])
      .png({ compressionLevel: 9 })
      .toFile(path.join(publicDir, file))

    console.log(`  ✓ ${file.padEnd(36)} ${size}×${size}`)
  }
}

await main()
