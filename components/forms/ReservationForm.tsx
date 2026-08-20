'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitReservation } from '@/lib/actions'
import { initialFormState } from '@/lib/validation'
import { site } from '@/lib/site'
import { Field, Honeypot, FormBanner } from '@/components/forms/FormField'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * Table request form.
 *
 * Progressive enhancement is the whole design: the <form action={...}> posts to
 * a server action, so it works with JavaScript disabled or still downloading.
 * `useActionState` layers on inline errors and a pending state once hydrated.
 *
 * Deliberately called a *request*, not a booking — the copy and the success
 * message both say a human will confirm, so nobody turns up to a table that
 * was never actually held.
 */

/** Half-hour slots across the trading day. */
const TIME_SLOTS = (() => {
  const slots: string[] = []
  for (let minutes = 7.5 * 60; minutes <= 14.5 * 60; minutes += 30) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  }
  return slots
})()

const OCCASIONS = [
  { value: 'none', label: 'Just breakfast' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'business', label: 'Business' },
]

function formatSlot(slot: string) {
  const [hour, minute] = slot.split(':').map(Number)
  const period = hour >= 12 ? 'pm' : 'am'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${String(minute).padStart(2, '0')}${period}`
}

export function ReservationForm() {
  const [state, formAction] = useActionState(submitReservation, initialFormState)
  const today = new Date().toISOString().slice(0, 10)

  // On success the form is replaced by the confirmation — leaving a filled-in
  // form on screen invites a duplicate submission.
  if (state.status === 'success') {
    return (
      <div className="rounded-md border border-sage/30 bg-sage/[0.07] p-8 sm:p-10">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage-deep">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <h3 className="mt-5 text-display-sm text-coffee">Request received</h3>
        <p className="mt-3 max-w-md text-body-sm text-coffee-soft">{state.message}</p>
        <p className="mt-6 text-body-sm text-coffee-soft">
          Need it sooner? Call us on{' '}
          <a href={`tel:${site.phone}`} className="u-underline u-label text-coffee">
            {site.phoneDisplay}
          </a>
          .
        </p>
      </div>
    )
  }

  const errors = state.errors ?? {}
  const values = state.values ?? {}

  return (
    <form
      action={formAction}
      noValidate
      className="relative rounded-md border border-beige bg-cream/60 p-6 shadow-soft sm:p-9"
    >
      <Honeypot />

      <div className="space-y-5">
        <FormBanner status={state.status} message={state.message} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" name="name" errors={errors.name} required>
            {(props) => (
              <input
                {...props}
                type="text"
                autoComplete="name"
                required
                defaultValue={values.name}
                placeholder="Jamie Whittaker"
              />
            )}
          </Field>

          <Field label="Phone" name="phone" errors={errors.phone} required>
            {(props) => (
              <input
                {...props}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                defaultValue={values.phone}
                placeholder="0400 000 000"
              />
            )}
          </Field>
        </div>

        <Field label="Email" name="email" errors={errors.email} required>
          {(props) => (
            <input
              {...props}
              type="email"
              autoComplete="email"
              required
              defaultValue={values.email}
              placeholder="you@example.com"
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Date" name="date" errors={errors.date} required>
            {(props) => (
              <input
                {...props}
                type="date"
                required
                min={today}
                defaultValue={values.date ?? today}
              />
            )}
          </Field>

          <Field label="Time" name="time" errors={errors.time} required>
            {(props) => (
              <select {...props} required defaultValue={values.time ?? '09:00'}>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatSlot(slot)}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Guests" name="guests" errors={errors.guests} required>
            {(props) => (
              <input
                {...props}
                type="number"
                inputMode="numeric"
                required
                min={1}
                max={20}
                defaultValue={values.guests ?? 2}
              />
            )}
          </Field>
        </div>

        <Field label="Occasion" name="occasion" errors={errors.occasion}>
          {(props) => (
            <select {...props} defaultValue={values.occasion ?? 'none'}>
              {OCCASIONS.map((occasion) => (
                <option key={occasion.value} value={occasion.value}>
                  {occasion.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          label="Anything we should know"
          name="notes"
          errors={errors.notes}
          hint="Allergies, a pram, a dog, a table in the sun — tell us and we will do our best."
        >
          {(props) => (
            <textarea {...props} rows={4} defaultValue={values.notes} className={cn(props.className, 'resize-y')} />
          )}
        </Field>

        <SubmitButton />

        <p className="text-caption text-coffee-soft/80">
          This is a request, not a confirmed booking. We will call or email to lock it
          in. For groups over 20, please phone us on{' '}
          <a href={`tel:${site.phone}`} className="u-underline u-label">
            {site.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </form>
  )
}

/**
 * Must be its own component: useFormStatus only reports on the <form> above
 * it in the tree, so calling it in ReservationForm would always return idle.
 */
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} size="lg" block>
      {pending && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cream/30 border-t-cream"
        />
      )}
      {pending ? 'Sending your request…' : 'Request a table'}
    </Button>
  )
}
