import Image from 'next/image'

import { site } from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/ui/Editorial'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

/**
 * The social wall — a quiet, static row of real cafe photographs on cream,
 * each linking out to the Instagram profile. Deliberately calm: no
 * continuous scroll, just five frames with a caption that appears on hover.
 *
 * Not an embed. Instagram's own widget carries header-and-caption chrome that
 * cannot be stripped. These are real cafe photographs, honestly presented as
 * a look inside rather than implied to be specific live posts.
 *
 * Server component — nothing here needs the client.
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

export function InstagramSection() {
  return (
    <section
      aria-labelledby="instagram-heading"
      className="relative overflow-hidden bg-cream u-section"
    >
      <Container className="relative z-10">
        <SectionHeading
          id="instagram-heading" 
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

      {/* A still, editorial row — five real photographs, no continuous
          motion. The gallery above is the "browse everything" experience;
          this is a quiet glimpse of the everyday, not a second gallery. */}
      <Container className="relative z-10">
        <Reveal delay={0.06}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-5">
            {POSTS.map((post) => (
              <a
                key={post.src}
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group relative block overflow-hidden rounded-md bg-sand shadow-soft transition-shadow duration-500 ease-editorial hover:shadow-lifted',
                  'first:col-span-2 lg:first:col-span-1',
                  post.aspect,
                )}
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-editorial motion-ok:group-hover:scale-105"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coffee/80 via-coffee/10 to-transparent opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-2.5 text-cream opacity-0 transition-all duration-500 ease-editorial translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <Icon name="instagram" className="h-4 w-4 flex-none" />
                  <span className="u-micro truncate">{post.caption}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </Container>

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