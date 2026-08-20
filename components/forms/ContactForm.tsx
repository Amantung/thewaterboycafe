'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitContact } from '@/lib/actions'
import { initialFormState } from '@/lib/validation'
import { site } from '@/lib/site'
import { Field, Honeypot, FormBanner } from '@/components/forms/FormField'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const SUBJECTS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'booking', label: 'Table booking' },
  { value: 'functions', label: 'Functions & group catering' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'careers', label: 'Working with us' },
]

/**
 * General contact form. Same progressive-enhancement pattern as the
 * reservation form — see the notes there.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialFormState)

  if (state.status === 'success') {
    return (
      <div className="rounded-md border border-sage/30 bg-sage/[0.07] p-8 sm:p-10">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage-deep">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <h3 className="mt-5 text-display-sm text-coffee">Message sent</h3>
        <p className="mt-3 max-w-md text-body-sm text-coffee-soft">{state.message}</p>
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
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" name="phone" errors={errors.phone}>
            {(props) => (
              <input
                {...props}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                defaultValue={values.phone}
                placeholder="0400 000 000"
              />
            )}
          </Field>

          <Field label="What is it about" name="subject" errors={errors.subject} required>
            {(props) => (
              <select {...props} required defaultValue={values.subject ?? 'general'}>
                {SUBJECTS.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field label="Message" name="message" errors={errors.message} required>
          {(props) => (
            <textarea
              {...props}
              rows={6}
              required
              defaultValue={values.message}
              placeholder="Tell us what you need and we will get back to you."
              className={cn(props.className, 'resize-y')}
            />
          )}
        </Field>

        <SubmitButton />

        <p className="text-caption text-coffee-soft/80">
          Prefer to talk? Call{' '}
          <a href={`tel:${site.phone}`} className="u-underline u-label">
            {site.phoneDisplay}
          </a>{' '}
          during opening hours.
        </p>
      </div>
    </form>
  )
}

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
      {pending ? 'Sending…' : 'Send message'}
    </Button>
  )
}
