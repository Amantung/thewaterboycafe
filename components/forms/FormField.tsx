'use client'

import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'

/**
 * Form primitives shared by the site's forms (contact, newsletter).
 *
 * The accessibility contract, in one place so no form can get it wrong:
 *   • every control has a real <label> bound by id
 *   • errors are linked with aria-describedby and flagged aria-invalid
 *   • the error text is in an aria-live region, so a screen reader announces
 *     it on a failed submit without moving focus
 *   • required is communicated in text, not by a red asterisk alone
 */

const CONTROL = cn(
  'w-full rounded-md border bg-white/70 px-4 py-3.5 text-body-sm text-espresso',
  'placeholder:text-coffee-soft/45',
  'transition-colors duration-200',
  'focus:border-clay-deep focus:bg-white focus:outline-none',
)

type FieldProps = {
  label: string
  name: string
  errors?: string[]
  hint?: string
  required?: boolean
  className?: string
  children: (props: {
    id: string
    name: string
    'aria-invalid': boolean | undefined
    'aria-describedby': string | undefined
    className: string
  }) => ReactNode
}

export function Field({
  label,
  name,
  errors,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const hasError = Boolean(errors?.length)

  // Only reference ids that are actually rendered — a dangling
  // aria-describedby is worse than none at all.
  const describedBy = [hint ? hintId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="u-eyebrow text-coffee-soft">
        {label}
        {!required && <span className="ml-2 normal-case tracking-normal opacity-60">(optional)</span>}
      </label>

      {hint && (
        <p id={hintId} className="text-caption text-coffee-soft/80">
          {hint}
        </p>
      )}

      {children({
        id,
        name,
        'aria-invalid': hasError || undefined,
        'aria-describedby': describedBy || undefined,
        className: cn(
          CONTROL,
          hasError ? 'border-clay-deep bg-clay/[0.04]' : 'border-beige-strong',
        ),
      })}

      <p
        id={errorId}
        aria-live="polite"
        className={cn(
          'flex items-center gap-1.5 text-caption text-clay-deep transition-opacity',
          hasError ? 'opacity-100' : 'sr-only opacity-0',
        )}
      >
        {hasError && (
          <>
            <Icon name="alert" className="h-3.5 w-3.5" />
            {errors?.[0]}
          </>
        )}
      </p>
    </div>
  )
}

/**
 * Honeypot. Hidden from sight and from assistive tech, but still focusable-off
 * via tabIndex={-1} — a naive bot ticks it, a human never does.
 *
 * It's a *checkbox*, not a text field, on purpose: browsers and password
 * managers autofill text inputs (name, email, address…) and were filling a
 * text honeypot with the guest's own email, locking real people out. Nothing
 * autofills an unlabelled checkbox.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="hp-field">Leave this box unchecked</label>
      <input id="hp-field" type="checkbox" name="hp_field" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

/** Success / failure banner shown above a form after submission. */
export function FormBanner({
  status,
  message,
}: {
  status: 'idle' | 'success' | 'error'
  message: string
}) {
  if (status === 'idle' || !message) return null

  const isSuccess = status === 'success'

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-md border px-4 py-3.5 text-body-sm',
        isSuccess
          ? 'border-sage/40 bg-sage/10 text-sage-deep'
          : 'border-clay/40 bg-clay/10 text-clay-deep',
      )}
    >
      <Icon name={isSuccess ? 'check' : 'alert'} className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
