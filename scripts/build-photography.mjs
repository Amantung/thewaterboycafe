/**
 * Builds every photograph in /public/images from the Unsplash sources pinned
 * below.
 *
 *   npm run photos            # only writes files that don't exist yet
 *   npm run photos -- --force # re-download and redraw everything
 *
 * Why a script rather than committed binaries: the source of every photo stays
 * auditable in one place, the crop for each slot is reproducible, and the
 * output dimensions are read straight out of lib/data/images.json — so an
 * image can never disagree with the width/height next/image reserves for it.
 *
 * Licensing: every id below is a free Unsplash photo. The Unsplash Licence
 * grants irrevocable, worldwide commercial use with no attribution required
 * (https://unsplash.com/license). Downloads go through the per-photo
 * /download endpoint, which is the route Unsplash asks integrations to use.
 *
 * Replacing one with the cafe's own photography is a file-for-file swap: drop
 * the JPEG into /public/images under the same name and delete its entry here
 * so the script stops overwriting it.
 */

import { readFile, writeFile, mkdir, access, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outputDir = path.join(root, 'public', 'images')
const cacheDir = path.join(root, '.cache', 'unsplash')
const manifestPath = path.join(root, 'lib', 'data', 'images.json')

const force = process.argv.includes('--force')

/**
 * One entry per photographic slot in the manifest.
 *
 * `crop` picks the sharp strategy:
 *   • 'attention' — entropy-weighted, keeps the plate/subject in frame. Right
 *     for food and portraits, where the subject is rarely dead centre.
 *   • 'centre'    — right for architecture and interiors, where 'attention'
 *     chases a bright window and throws the composition away.
 *   • 'north' / 'south' — when the interesting half is known.
 *
 * `focusY` overrides all of that with an explicit vertical focal point, 0 for
 * the top edge and 1 for the bottom. Use it when the composition matters more
 * than the subject — the hero is cropped high so the rattan pendants and the
 * water both survive, which neither 'centre' nor 'north' manages alone.
 */
const PHOTOS = {
  /* --- Hero & story ---------------------------------------------------- */
  heroMain: { id: 'crG1ehFaZnA', focusY: 0.38 },
  storyInterior: { id: '0i5clWZBit0', crop: 'centre' },
  storyPour: { id: '7GpNIIfyfYM', crop: 'attention' },

  /* --- Dishes ---------------------------------------------------------- */
  dishScramble: { id: '0MuIq5EAddA', crop: 'attention' },
  dishSalmon: { id: 'h9vAxAu0f1g', crop: 'attention' },
  dishAvocado: { id: 'P7oGUDHswIA', crop: 'attention' },
  dishBenedict: { id: 'tGpBPnc3ZoA', crop: 'attention' },
  dishMushroom: { id: 'xyCey3dJO2g', crop: 'attention' },
  dishBurger: { id: 'WCyh_uJU4Wk', crop: 'attention' },
  dishSalad: { id: 'FtQ9v-vfklQ', crop: 'attention' },
  dishBrownie: { id: 'LjtviHokbr4', crop: 'attention' },
  dishWaffle: { id: 'jZC0CPr7Xtw', crop: 'attention' },
  coffeeFlatWhite: { id: 'iJMHMXT5-5E', crop: 'attention' },

  /* --- Gallery --------------------------------------------------------- */
  galleryTerrace: { id: 'MEZ0rALHk24', crop: 'centre' },
  galleryCounter: { id: '1WmlAiYgnoI', crop: 'centre' },
  galleryDog: { id: 'HL-ewalii58', crop: 'attention' },
  galleryBeach: { id: 'O3MIf1zThO8', crop: 'centre' },
  galleryBeans: { id: '4KqHNQ3sJ6g', crop: 'centre' },
  galleryKitchen: { id: 'qwempg71wDY', crop: 'attention' },
  galleryTable: { id: 'Alx4tCD8Ejg', crop: 'centre' },
  galleryWindow: { id: 'EGU0c37idAA', crop: 'centre' },
  galleryCake: { id: '9A_n4yg32so', crop: 'attention' },
  gallerySignage: { id: 'Y64XI1z3z88', crop: 'centre' },
  galleryTeam: { id: 'X_bbCAYzlTs', crop: 'attention' },

  /* --- About ----------------------------------------------------------- */
  aboutFounders: { id: 'fdUwaeewqt8', crop: 'attention' },
  aboutSourcing: { id: 'tHHFiw6GNEU', crop: 'centre' },

  /* --- Open Graph ------------------------------------------------------ */
  /* Cut from the hero so the social card and the page agree. */
  ogDefault: { id: 'crG1ehFaZnA', focusY: 0.42 },
}

const STRATEGIES = {
  attention: sharp.strategy.attention,
  centre: 'centre',
  north: 'north',
  south: 'south',
}

const exists = async (file) =>
  access(file).then(
    () => true,
    () => false,
  )

/** Pulls the original once and keeps it in .cache so reruns are free. */
async function source(id) {
  const cached = path.join(cacheDir, `${id}.jpg`)
  if (await exists(cached)) return cached

  const response = await fetch(`https://unsplash.com/photos/${id}/download?w=2400`, {
    headers: { 'user-agent': 'thewaterboycafe-build-script' },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Unsplash ${id} → HTTP ${response.status}`)
  }

  await writeFile(cached, Buffer.from(await response.arrayBuffer()))
  return cached
}

async function main() {
  await mkdir(outputDir, { recursive: true })
  await mkdir(cacheDir, { recursive: true })

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const entries = manifest.images.filter((image) => PHOTOS[image.key])

  const missing = Object.keys(PHOTOS).filter(
    (key) => !manifest.images.some((image) => image.key === key),
  )
  if (missing.length) {
    throw new Error(`PHOTOS keys absent from images.json: ${missing.join(', ')}`)
  }

  let written = 0
  let skipped = 0

  for (const entry of entries) {
    const target = path.join(outputDir, entry.file)

    if (!force && (await exists(target))) {
      skipped += 1
      continue
    }

    const { id, crop, focusY } = PHOTOS[entry.key]

    let pipeline = sharp(await source(id)).rotate() // EXIF first, then measure.

    if (focusY !== undefined) {
      // Cut the widest rectangle of the target aspect that fits, sliding it to
      // the requested focal point, before any scaling happens.
      const { width, height } = await pipeline.metadata()
      const aspect = entry.width / entry.height

      const cropWidth = Math.min(width, Math.round(height * aspect))
      const cropHeight = Math.min(height, Math.round(width / aspect))

      pipeline = pipeline.extract({
        left: Math.round((width - cropWidth) / 2),
        top: Math.round((height - cropHeight) * focusY),
        width: cropWidth,
        height: cropHeight,
      })
    }

    await pipeline
      .resize(entry.width, entry.height, {
        fit: 'cover',
        position: STRATEGIES[crop] ?? 'centre',
        kernel: 'lanczos3',
      })
      // A whisper of sharpening to recover the softness a downscale introduces.
      .sharpen({ sigma: 0.6 })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(target)

    written += 1
    console.log(`  ✓ ${entry.file.padEnd(48)} ${entry.width}×${entry.height}  ← ${id}`)
  }

  console.log(`\n${written} written, ${skipped} left alone.`)

  const stale = (await readdir(outputDir)).filter(
    (file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file) &&
      !manifest.images.some((image) => image.file === file) &&
      !/^(favicon|icon|apple-touch)/.test(file),
  )
  if (stale.length) {
    console.log(`\nNot in the manifest (safe to delete): ${stale.join(', ')}`)
  }
}

await main()
