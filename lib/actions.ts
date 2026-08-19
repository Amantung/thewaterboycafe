'use server'

/**
 * Server actions behind the reservation, contact and newsletter forms.
 *
 * Delivery is intentionally pluggable. Submissions are validated here and then
 * POSTed as JSON to `FORM_WEBHOOK_URL` — point that at Zapier, Make, n8n,
 * Formspree, a Google Apps Script, or your own endpoint. With no webhook
 * configured the action still validates and succeeds, logging the payload
 * server-side, so local development and preview deploys never need secrets.
 *
 * To swap in a transactional email provider (Resend, Postmark, SendGrid),
 * replace the body of `deliver()` — nothing else needs to change.
 */

import {
  reservationSchema,
  contactSchema,
  newsletterSchema,
  formDataToObject,
  type FormState,
} from '@/lib/validation'
import { site } from '@/lib/site'

type Delivery = {
  /** Distinguishes the three form types at the receiving end. */
  type: 'reservation' | 'contact' | 'newsletter'
  payload: Record<string, unknown>
}

/**
 * Ships a validated submission onward.
 *
 * Returns `false` only for a genuine delivery failure, which the caller turns
 * into a "please phone us instead" message — never a silent drop.
 */
async function deliver({ type, payload }: Delivery): Promise<boolean> {
  const endpoint = process.env.FORM_WEBHOOK_URL

  const body = {
    type,
    submittedAt: new Date().toISOString(),
    site: site.name,
    replyTo: process.env.CONTACT_INBOX ?? site.email,
    ...payload,
  }

  if (!endpoint) {
    // No webhook wired up yet. Log and succeed so the UX is testable, but make
    // the gap loud in the server output rather than pretending it was sent.
    console.warn(
      `[forms] FORM_WEBHOOK_URL is not set — ${type} submission was validated but not delivered.`,
      body,
    )
    return true
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.FORM_WEBHOOK_TOKEN
          ? { 'X-Webhook-Token': process.env.FORM_WEBHOOK_TOKEN }
          : {}),
      },
      body: JSON.stringify(body),
      // Don't leave a submitting user staring at a spinner if the endpoint hangs.
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`[forms] Webhook rejected ${type} submission:`, response.status)
      return false
    }

    return true
  } catch (error) {
    console.error(`[forms] Webhook request for ${type} failed:`, error)
    return false
  }
}

/** Standard failure copy — always gives the guest a way through. */
const DELIVERY_FAILED = `Something went wrong at our end. Please call us on ${site.phoneDisplay} and we will sort it out.`

/* -------------------------------------------------------------------------- */
/* Reservation                                                                */
/* -------------------------------------------------------------------------- */

export async function submitReservation(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = formDataToObject(formData)
  const parsed = reservationSchema.safeParse(raw)

  if (!parsed.success) {
    // Honeypot tripped: report success so a bot learns nothing, and drop it.
    if (raw.website) return { status: 'success', message: 'Thanks — request received.' }

    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: raw,
    }
  }

  const { website: _honeypot, ...booking } = parsed.data
  const delivered = await deliver({ type: 'reservation', payload: booking })

  if (!delivered) {
    return { status: 'error', message: DELIVERY_FAILED, values: raw }
  }

  return {
    status: 'success',
    message: `Thanks ${booking.name.split(' ')[0]} — we have your request for ${booking.guests} on ${booking.date} at ${booking.time}. We will confirm by phone or email shortly. It is a request, not a locked-in booking, until you hear from us.`,
  }
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export async function submitContact(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = formDataToObject(formData)
  const parsed = contactSchema.safeParse(raw)

  if (!parsed.success) {
    if (raw.website) return { status: 'success', message: 'Thanks — message received.' }

    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: raw,
    }
  }

  const { website: _honeypot, ...message } = parsed.data
  const delivered = await deliver({ type: 'contact', payload: message })

  if (!delivered) {
    return { status: 'error', message: DELIVERY_FAILED, values: raw }
  }

  return {
    status: 'success',
    message: `Thanks ${message.name.split(' ')[0]} — your message is with us. We read everything and usually reply within a day.`,
  }
}

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                 */
/* -------------------------------------------------------------------------- */

export async function subscribeToNewsletter(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = formDataToObject(formData)
  const parsed = newsletterSchema.safeParse(raw)

  if (!parsed.success) {
    if (raw.website) return { status: 'success', message: 'You are on the list.' }

    return {
      status: 'error',
      message: parsed.error.flatten().fieldErrors.email?.[0] ?? 'Please check your email.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: raw,
    }
  }

  const delivered = await deliver({
    type: 'newsletter',
    payload: { email: parsed.data.email },
  })

  if (!delivered) {
    return { status: 'error', message: DELIVERY_FAILED, values: raw }
  }

  return {
    status: 'success',
    message: 'You are on the list. Specials, seasonal menus, nothing else.',
  }
}
