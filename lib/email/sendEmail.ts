/**
 * Email sender — placeholder / mock implementation.
 *
 * This module provides a stable `sendEmail()` interface so the rest of the
 * app can send transactional emails (welcome, blueprint-ready, payment
 * receipt, download link) without coupling to a specific provider.
 *
 * Today it only logs the email payload to the console (mock). When a
 * `RESEND_API_KEY` is present and the `resend` package is installed, the
 * stub is structured so it can be swapped for a real Resend call with
 * minimal change — see the `TODO` block.
 *
 * Future: drop in Resend (https://resend.com) or any other provider.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface EmailAddress {
  email: string
  name?: string
}

export interface EmailOptions {
  to: EmailAddress | EmailAddress[] | string
  from?: string
  subject: string
  /** HTML body. */
  html?: string
  /** Plain-text body (fallback for non-HTML clients). */
  text?: string
  /** Optional reply-to address. */
  replyTo?: string
  /** Optional provider tags / metadata. */
  tags?: string[]
}

export interface EmailResult {
  id: string
  provider: 'mock' | 'resend'
  status: 'sent' | 'queued' | 'failed'
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeTo(to: EmailOptions['to']): EmailAddress[] {
  if (typeof to === 'string') {
    return [{ email: to }]
  }
  return Array.isArray(to) ? to : [to]
}

function defaultFrom(): string {
  return (
    process.env.EMAIL_FROM ??
    'BuildReady Blueprint <no-reply@buildready.blueprint>'
  )
}

/* ------------------------------------------------------------------ */
/* sendEmail                                                          */
/* ------------------------------------------------------------------ */

/**
 * Send a transactional email.
 *
 * - Mock mode (default): logs the payload and returns a synthetic id.
 * - Resend mode (future): when `RESEND_API_KEY` is set and the `resend`
 *   package is installed, performs the real API call.
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const recipients = normalizeTo(options.to)
  const from = options.from ?? defaultFrom()
  const apiKey = process.env.RESEND_API_KEY

  const basePayload = {
    from,
    to: recipients.map((r) => (r.name ? `${r.name} <${r.email}>` : r.email)),
    subject: options.subject,
    text: options.text,
    html: options.html,
    reply_to: options.replyTo,
    tags: options.tags,
  }

  // --- Future: real Resend integration -----------------------------
  if (apiKey && process.env.NODE_ENV === 'production') {
    try {
      // Lazy import so the mock path never requires the package.
      // TODO: add `resend` to package.json deps when enabling.
      // const { Resend } = await import('resend')
      // const resend = new Resend(apiKey)
      // const { data, error } = await resend.emails.send(basePayload)
      // if (error) throw error
      // return { id: data?.id ?? 'unknown', provider: 'resend', status: 'sent' }

      // Until the package is installed, fall through to mock + warn.
      console.warn(
        '[email] RESEND_API_KEY set but `resend` package not wired up — falling back to mock. ' +
          'Add the resend dependency and uncomment the Resend block in lib/email/sendEmail.ts.',
      )
    } catch (err) {
      console.error('[email] Resend send failed:', err)
      return {
        id: `err_${Date.now()}`,
        provider: 'resend',
        status: 'failed',
      }
    }
  }

  // --- Mock mode ---------------------------------------------------
  const mockId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  console.info('[email] (mock) sending email:', {
    id: mockId,
    ...basePayload,
  })

  return {
    id: mockId,
    provider: 'mock',
    status: 'sent',
  }
}

/* ------------------------------------------------------------------ */
/* Convenience templates                                              */
/* ------------------------------------------------------------------ */

/** Welcome email sent after signup. */
export async function sendWelcomeEmail(to: string, name?: string) {
  return sendEmail({
    to: { email: to, name },
    subject: 'Welcome to BuildReady Blueprint',
    text: `Hi${name ? ` ${name}` : ''}, welcome to BuildReady Blueprint! Turn your idea into a build-ready spec in minutes.`,
    html: `<p>Hi${name ? ` ${name}` : ''},</p><p>Welcome to <strong>BuildReady Blueprint</strong> — turn your idea into a build-ready spec in minutes.</p>`,
  })
}

/** Notify the user their blueprint preview is ready. */
export async function sendBlueprintReadyEmail(
  to: string,
  projectName: string,
  previewUrl: string,
) {
  return sendEmail({
    to,
    subject: `Your blueprint for "${projectName}" is ready`,
    text: `Your blueprint preview for "${projectName}" is ready. View it: ${previewUrl}`,
    html: `<p>Your blueprint preview for <strong>${projectName}</strong> is ready.</p><p><a href="${previewUrl}">View your blueprint →</a></p>`,
  })
}

/** Payment receipt. */
export async function sendPaymentReceiptEmail(
  to: string,
  projectName: string,
  amount: number,
  currency = 'usd',
  receiptUrl?: string,
) {
  return sendEmail({
    to,
    subject: `Payment receipt — ${projectName}`,
    text: `Thanks for your purchase. Amount: ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}.${
      receiptUrl ? ` Receipt: ${receiptUrl}` : ''
    }`,
    html: `<p>Thanks for your purchase.</p><p>Amount: <strong>${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</strong></p>${
      receiptUrl ? `<p><a href="${receiptUrl}">View receipt</a></p>` : ''
    }`,
  })
}

export default sendEmail
