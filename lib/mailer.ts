/**
 * SMTP email delivery for the contact form, via `nodemailer`.
 *
 * Configured entirely through env vars (set in Vercel → Project → Settings →
 * Environment Variables — see `.env.example`). With `SMTP_HOST` unset the
 * transporter is never built: the submission is logged and the action still
 * reports success, so local development and preview deploys never need real
 * SMTP credentials.
 */

import nodemailer from 'nodemailer'
import type { ContactInput } from '@/lib/validation'

const SUBJECT_LABELS: Record<ContactInput['subject'], string> = {
  general: 'General enquiry',
  functions: 'Functions & group catering',
  feedback: 'Feedback',
  careers: 'Working with us',
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  const port = Number(SMTP_PORT) || 587

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // 465 is implicit TLS; everything else (587, 25) negotiates STARTTLS.
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  return transporter
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type ContactMessage = Omit<ContactInput, 'hp_field'>

/**
 * Sends the contact form's HTML notification email to `TO_EMAIL`.
 *
 * Returns `false` only for a genuine send failure — the caller turns that
 * into a "please phone us instead" message rather than a silent drop.
 */
export async function sendContactEmail(message: ContactMessage): Promise<boolean> {
  const client = getTransporter()
  const to = process.env.TO_EMAIL

  if (!client || !to) {
    console.warn(
      '[mailer] SMTP is not fully configured (SMTP_HOST/SMTP_USER/SMTP_PASS/TO_EMAIL) — ' +
        'contact submission was validated but not emailed.',
      message,
    )
    return true
  }

  const subjectLabel = SUBJECT_LABELS[message.subject]
  const subject = `New enquiry — ${subjectLabel} — ${message.name}`

  const rows = [
    ['Name', message.name],
    ['Email', message.email],
    ['Phone', message.phone || '—'],
    ['Enquiry type', subjectLabel],
  ]

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #2b2320; max-width: 560px;">
      <h2 style="margin: 0 0 16px;">New contact form enquiry</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 6px 12px 6px 0; color: #6b5f57; white-space: nowrap; vertical-align: top;"><strong>${label}</strong></td>
            <td style="padding: 6px 0;">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join('')}
      </table>
      <div>
        <strong style="display: block; margin-bottom: 6px; color: #6b5f57;">Message</strong>
        <p style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(message.message)}</p>
      </div>
    </div>
  `.trim()

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    message.message,
  ].join('\n')

  try {
    const info = await client.sendMail({
      from: `"The Waterboy Cafe website" <${process.env.SMTP_USER}>`,
      to,
      replyTo: `"${message.name}" <${message.email}>`,
      subject,
      html,
      text,
    })
    console.info('[mailer] Contact email sent:', info.messageId, '→', to, '|', info.response)
    return true
  } catch (error) {
    console.error('[mailer] Failed to send contact email:', error)
    return false
  }
}
