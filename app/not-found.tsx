import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { primaryNav } from '@/lib/data/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-linen px-5 pb-24 pt-40 sm:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="u-eyebrow text-clay-deep">Error 404</p>
        <h1 className="mt-5 text-display-lg text-coffee">This one has gone off the menu</h1>
        <p className="mt-5 text-lead font-light text-coffee-soft">
          The page you were after does not exist any more, or the link had a typo
          in it. The coffee is still where you left it.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg" withArrow>
            Back to the homepage
          </Button>
          <Button href="/menu" size="lg" variant="secondary">
            View the menu
          </Button>
        </div>

        <nav aria-label="Site pages" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="u-underline u-eyebrow text-coffee-soft transition-colors hover:text-coffee"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
