/**
 * Zod schemas for every form on the site.
 *
 * These run on the server inside the server actions — client-side `required`
 * attributes are a convenience for the user, never the validation boundary.
 * The same schemas are exported so a future client-side pre-validation pass
 * can reuse them without a second definition drifting out of sync.
 */

import { z } from 'zod'

/* -------------------------------------------------------------------------- */
/* Shared fields                                                              */
/* -------------------------------------------------------------------------- */

const name = z
  .string()
  .trim()
  .min(2, 'Please tell us your name.')
  .max(80, 'That name is longer than our form allows.')

const email = z
  .string()
  .trim()
  .min(1, 'We need an email address to reply to.')
  .email('That email address does not look quite right.')
  .max(160)

/**
 * Permissive on purpose: Australian numbers get written every possible way
 * (+61 3…, 03…, 0400…, with spaces, dashes and brackets). We check shape, not
 * carrier validity, and let staff sort out the rest.
 */
const phone = z
  .string()
  .trim()
  .min(8, 'That phone number looks too short.')
  .max(20, 'That phone number looks too long.')
  .regex(/^[+()\d\s-]+$/, 'Please use digits, spaces, brackets, + or -.')

/**
 * Honeypot. Real people never see this field, so anything in it is a bot.
 * We fail closed but report success to the client — telling a scraper it was
 * detected only helps it adapt.
 */
const honeypot = z
  .string()
  .max(0, 'Rejected.')
  .optional()
  .or(z.literal(''))

/* -------------------------------------------------------------------------- */
/* Reservation                                                                */
/* -------------------------------------------------------------------------- */

export const reservationSchema = z.object({
  name,
  email,
  phone,
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a date.')
    .refine((value) => {
      // Compare date-only strings so a booking for "today" is never rejected
      // by the clock, whatever timezone the server happens to sit in.
      const today = new Date().toISOString().slice(0, 10)
      return value >= today
    }, 'We cannot take a booking in the past.'),
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, 'Please choose a time.'),
  guests: z.coerce
    .number({ invalid_type_error: 'How many people are coming?' })
    .int('Please use a whole number.')
    .min(1, 'At least one guest.')
    .max(20, 'For groups over 20 please call us — we will look after you properly.'),
  occasion: z
    .enum(['none', 'birthday', 'anniversary', 'celebration', 'business'])
    .default('none'),
  notes: z
    .string()
    .trim()
    .max(600, 'Please keep notes under 600 characters.')
    .optional()
    .or(z.literal('')),
  website: honeypot,
})

export type ReservationInput = z.infer<typeof reservationSchema>

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal('')),
  subject: z.enum(['general', 'booking', 'functions', 'feedback', 'careers']),
  message: z
    .string()
    .trim()
    .min(10, 'A little more detail helps us reply properly.')
    .max(2000, 'Please keep your message under 2000 characters.'),
  website: honeypot,
})

export type ContactInput = z.infer<typeof contactSchema>

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                 */
/* -------------------------------------------------------------------------- */

export const newsletterSchema = z.object({
  email,
  website: honeypot,
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

/* -------------------------------------------------------------------------- */
/* Shared form-state contract                                                 */
/* -------------------------------------------------------------------------- */

/**
 * What every server action returns and every form renders. `useActionState`
 * needs a stable shape, and field-level errors are keyed by input name so the
 * markup can wire `aria-describedby` without a lookup table.
 */
export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  /** Keyed by field name; only populated on validation failure. */
  errors?: Record<string, string[]>
  /** Echoed back so inputs keep their values after a failed submit. */
  values?: Record<string, string>
}

export const initialFormState: FormState = { status: 'idle', message: '' }

/** Flattens a FormData into the plain string record the schemas expect. */
export function formDataToObject(formData: FormData): Record<string, string> {
  const entries: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') entries[key] = value
  }
  return entries
}
