import { motion } from 'framer-motion'
import type { ElementType } from 'react'

/**
 * A stable Framer Motion component per element tag.
 *
 * `motion.create()` returns a *new* component type on every call. Calling it
 * inside a render — which every `as`-taking wrapper on this site was doing —
 * means React sees a different type each time the component renders, unmounts
 * the old tree and mounts a new one. Entrance animations then replay on any
 * unrelated re-render of the parent.
 *
 * That is not theoretical here: the menu section holds the hovered dish in
 * state, so every pointer move between rows re-rendered the section. Without
 * this cache, the section heading and all six list rows would remount and
 * re-run their reveal on each hover.
 *
 * Keyed by the tag itself and held at module scope, so identity is stable for
 * the life of the page and the map stays tiny — one entry per distinct tag the
 * site actually uses.
 */
const cache = new Map<ElementType, ElementType>()

export function motionTag(as: ElementType): ElementType {
  const cached = cache.get(as)
  if (cached) return cached

  const created = motion.create(as as Parameters<typeof motion.create>[0]) as ElementType
  cache.set(as, created)
  return created
}
