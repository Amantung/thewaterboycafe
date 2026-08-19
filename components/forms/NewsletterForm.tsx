'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'

import { subscribeToNewsletter } from '@/lib/actions'
import { initialFormState } from '@/lib/validation'
import { Honeypot } from '@/components/forms/FormField'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * Footer email capture.
 *
 * Sits on the dark coffee band, so the palette here is inverted relative to
 * the other forms — cream text on a translucent field, with the error and
 * success states tuned for contrast against dark rather than linen.
 */
export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeToNewsletter, initialFormState)
  const inputId = useId()
  const messageId = `${inputId}-message`

  const hasError = state.status === 'error'
  const isSuccess = state.status === 'success'

  return (
    <form action={formAction} noValidate className="relative w-full">
      <Honeypot />

      <label htmlFor={inputId} className="u-eyebrow mb-3 block text-cream/45">
        Email address
      </label>

      <div
        className={cn(
          'flex flex-col gap-3 sm:flex-row',
          isSuccess && 'pointer-events-none opacity-70',
        )}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          aria-invalid={hasError || undefined}
          aria-describedby={state.message ? messageId : undefined}
          className={cn(
            'flex-1 rounded-full border bg-cream/[0.07] px-5 py-3.5 text-body-sm text-cream',
            'placeholder:text-cream/35',
            'transition-colors duration-200 focus:bg-cream/[0.12] focus:outline-none',
            hasError ? 'border-clay' : 'border-cream/20 focus:border-clay',
          )}
        />
        <SubmitButton />
      </div>

      <p
        id={messageId}
        role="status"
        aria-live="polite"
        className={cn(
          'mt-3 flex items-center gap-2 text-caption',
          !state.message && 'sr-only',
          isSuccess ? 'text-sage' : 'text-clay',
        )}
      >
        {state.message && (
          <>
            <Icon name={isSuccess ? 'check' : 'alert'} className="h-3.5 w-3.5" />
            {state.message}
          </>
        )}
      </p>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="onDark" disabled={pending} className="shrink-0">
      {pending && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-coffee/25 border-t-coffee"
        />
      )}
      {pending ? 'Joining…' : 'Subscribe'}
    </Button>
  )
}
