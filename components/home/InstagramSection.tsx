import Image from 'next/image'
import type { CSSProperties } from 'react'

import { site } from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/ui/Editorial'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

/**
 * The social wall — the cafe's daily life, deliberately not the gallery.
 *
 * The gallery above is a still composition on linen with square-cropped
 * frames you click to enlarge. This is a continuously travelling strip on
 * cream, with captions inside the frame and every tile linking out to the
 * real profile. Same photography discipline, opposite energy — which is the
 * point of having both sections rather than one twice.
 *
 * Not an embed. Instagram's own widget carries header-and-caption chrome that
 * cannot be stripped, which is what made an earlier version of this section
 * tall and heavy. These are real cafe photographs, honestly presented as a
 * look inside rather than implied to be specific live posts.
 *
 * Server component — the marquee is a CSS keyframe, so nothing here needs the
 * client. Once started it never touches the main thread.
 */

type Post = {
  src: string
  alt: string
  caption: string
  /** Each tile keeps its own crop so the strip has a varied silhouette. */
  aspect: string
}

const POSTS: Post[] = [
  {
    src: '/images/drink-house-blend-flat-white-latte-art.jpg',
    alt: 'A flat white with latte art, made with the house Five Senses blend',
    caption: 'The daily pour',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/images/gallery-cake-of-the-day-slice.jpg',
    alt: 'A slice of butter cake on a small plate set on marble',
    caption: 'Cake of the day',
    aspect: 'aspect-square',
  },
  {
    src: '/images/gallery-dog-friendly-patio.jpg',
    alt: 'A small dog waiting beside a cafe table while its owner has coffee and cake',
    caption: 'Regulars',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/images/gallery-kitchen-morning-prep.jpg',
    alt: 'A chef working the pans in a warmly lit kitchen during morning service',
    caption: 'Prep, 6am',
    aspect: 'aspect-square',
  },
  {
    src: '/images/gallery-pastry-cabinet-counter.jpg',
    alt: 'A glass cabinet of fruit tarts and chocolate cakes on the cafe counter',
    caption: 'The cabinet',
    aspect: 'aspect-[4/5]',
  },
]

/** Three copies, so the loop can travel exactly one third and land back on an
    identical frame — the seam is invisible because it is the same photograph. */
const INFINITE_POSTS = [...POSTS, ...POSTS, ...POSTS]

export function InstagramSection({ index }: { index?: number }) {
  return (
    <section
      aria-labelledby="instagram-heading"
      className="relative overflow-hidden bg-cream u-section"
    >
      <Container className="relative z-10">
        <SectionHeading
          id="instagram-heading"
          index={index}
          eyebrow="Follow along"
          size="statement"
          title={[
            '@thewaterboy',
            <span key="cafe" className="u-text-outline-dark block lg:pl-[8%]">
              cafe
            </span>,
          ]}
          titleClassName="font-body font-light lowercase"
        />

        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-coffee/12 pt-7 sm:mt-10">
            <span aria-hidden="true" className="u-spin text-clay">
              <Icon name="star" className="h-3.5 w-3.5" />
            </span>
            <p className="max-w-md text-body text-coffee-soft">
              Specials as they land, the cabinet before it empties, and whoever
              is sitting in the window today.
            </p>
          </div>
        </Reveal>
      </Container>

      {/* Infinite Scrolling Marquee --------------------------------------- */}
      {/* `u-marquee-row` on the wrapper is what pauses the track on hover —
          the pause selector is a descendant one, so the two classes must sit
          on different elements. */}
      <div className="u-marquee-row relative mt-12 flex w-full overflow-hidden sm:mt-20">
        {/* 
          Gradient masks to fade the edges seamlessly into the background 
          so the photos look like they are emerging from nowhere.
        */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-32" />

        {/* The scrolling track. Three copies of the set, so a full loop
            travels exactly one third — see `--marquee-shift` in globals.css,
            which is the same keyframe the hero marquee uses. */}
        <div
          className="u-marquee-track items-center gap-4 px-4 sm:gap-6 sm:px-6"
          style={{ '--marquee-shift': '-33.3333%', '--marquee-duration': '48s' } as CSSProperties}
        >
          {INFINITE_POSTS.map((post, i) => (
            <a
              key={`${post.src}-${i}`}
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group relative block w-[280px] flex-none overflow-hidden rounded-md bg-sand shadow-soft transition-all duration-700 ease-editorial sm:w-[320px] hover:-translate-y-2 hover:shadow-lifted',
                post.aspect,
              )}
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                loading="lazy"
                sizes="(min-width: 640px) 320px, 280px"
                className="object-cover transition-transform duration-1000 ease-editorial motion-ok:group-hover:scale-110"
              />

              {/* Light gradient for the cream theme */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coffee/80 via-coffee/10 to-transparent opacity-0 transition-opacity duration-700 ease-editorial group-hover:opacity-100"
              />

              {/* Instagram Caption */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center gap-2.5 text-cream opacity-0 transition-all duration-700 ease-editorial translate-y-3 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <Icon name="instagram" className="h-4 w-4 flex-none" />
                <span className="u-micro truncate">
                  {post.caption}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Close ------------------------------------------------------------ */}
      <Container>
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-coffee/12 pt-8 lg:mt-16">
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="u-micro u-underline text-coffee-soft transition-colors duration-500 hover:text-coffee"
            >
              {site.socials.instagramHandle}
            </a>
            <CtaLink href={site.socials.instagram} tone="light">
              Follow the daily pour
            </CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}