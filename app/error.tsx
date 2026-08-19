'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * Route-level error boundary. Must be a client component — React needs the
 * reset callback on the client to re-render the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Swap for your monitoring provider (Sentry, Vercel, etc.) when one exists.
    console.error('[route error]', error)
  }, [error])

  return (
    <section className="flex min-h-[70svh] items-center bg-linen px-5 pb-24 pt-40 sm:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="u-eyebrow text-clay-deep">Something went wrong</p>
        <h1 className="mt-5 text-display-lg text-coffee">We have dropped a plate</h1>
        <p className="mt-5 text-lead font-light text-coffee-soft">
          An unexpected error stopped this page loading. Try again — and if it keeps
          happening, give us a call and we will sort you out the old-fashioned way.
        </p>

        {error.digest && (
          <p className="u-label mt-4 text-caption text-coffee-soft/60">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Button href="/" size="lg" variant="secondary">
            Back to the homepage
          </Button>
        </div>
      </div>
    </section>
  )
}
