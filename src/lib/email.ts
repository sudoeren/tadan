import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_ADDRESS =
  process.env.EMAIL_FROM_ADDRESS ?? "tadan <noreply@tadan.app>"

export const emailEnabled = Boolean(RESEND_API_KEY)

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams) {
  if (!resend) {
    console.warn(
      "[tadan] RESEND_API_KEY not set — email not sent. " +
        `To: ${to} | Subject: ${subject}`
    )
    return
  }

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
    text,
  })

  if (error) {
    console.error("[tadan] Resend error:", error)
    throw new Error(`Failed to send email: ${error.message}`)
  }

  return data
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function baseTemplate(headline: string, bodyHtml: string, ctaLabel: string, ctaUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>tadan</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#111827;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:24px;box-shadow:0 10px 40px rgba(0,0,0,0.06);overflow:hidden;">
<tr>
<td style="padding:40px 40px 24px 40px;text-align:center;">
<div style="display:inline-flex;align-items:center;gap:6px;color:#f97316;font-weight:600;font-size:18px;letter-spacing:-0.02em;">
<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z"/></svg>
tadan
</div>
</td>
</tr>
<tr>
<td style="padding:0 40px 16px 40px;">
<h1 style="margin:0;font-size:24px;font-weight:600;color:#111827;letter-spacing:-0.02em;line-height:1.2;">${escapeHtml(headline)}</h1>
</td>
</tr>
<tr>
<td style="padding:0 40px 8px 40px;font-size:14px;color:#4b5563;line-height:1.6;">
${bodyHtml}
</td>
</tr>
<tr>
<td style="padding:24px 40px 0 40px;" align="center">
<a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background-color:#f97316;color:#ffffff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:9999px;text-decoration:none;">${escapeHtml(ctaLabel)}</a>
</td>
</tr>
<tr>
<td style="padding:24px 40px 0 40px;font-size:12px;color:#9ca3af;line-height:1.5;">
If the button doesn&apos;t work, copy and paste this URL into your browser:<br />
<span style="word-break:break-all;color:#6b7280;">${escapeHtml(ctaUrl)}</span>
</td>
</tr>
<tr>
<td style="padding:32px 40px 32px 40px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center;">
This email was sent by tadan. If you didn&apos;t request this, you can safely ignore it.
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
}

export function verificationEmail({
  name,
  url,
}: {
  name: string
  url: string
}) {
  const headline = "Verify your email"
  const bodyHtml = `Hi ${escapeHtml(name)},<br /><br />
Click the button below to verify your email and finish setting up your tadan account. The link expires in 1 hour.`
  return {
    subject: "Verify your tadan email",
    html: baseTemplate(headline, bodyHtml, "Verify email", url),
    text: `Hi ${name},\n\nVerify your email by visiting: ${url}\n\nThis link expires in 1 hour.`,
  }
}

export function passwordResetEmail({
  name,
  url,
}: {
  name: string
  url: string
}) {
  const headline = "Reset your password"
  const bodyHtml = `Hi ${escapeHtml(name)},<br /><br />
We received a request to reset your tadan password. Click the button below to choose a new one. The link expires in 1 hour.`
  return {
    subject: "Reset your tadan password",
    html: baseTemplate(headline, bodyHtml, "Reset password", url),
    text: `Hi ${name},\n\nReset your password by visiting: ${url}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`,
  }
}

export function verificationOtpEmail({
  email,
  otp,
  type,
}: {
  email: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password" | "change-email"
}) {
  const subjectByType: Record<typeof type, string> = {
    "sign-in": "Your tadan sign-in code",
    "email-verification": "Verify your tadan email",
    "forget-password": "Reset your tadan password",
    "change-email": "Confirm your new tadan email",
  }
  const headlineByType: Record<typeof type, string> = {
    "sign-in": "Sign in to tadan",
    "email-verification": "Verify your email",
    "forget-password": "Reset your password",
    "change-email": "Confirm your new email",
  }
  const bodyByType: Record<typeof type, string> = {
    "sign-in":
      "Use the code below to sign in to your tadan account. The code expires in 5 minutes.",
    "email-verification":
      "Use the code below to verify your email and finish setting up your tadan account. The code expires in 5 minutes.",
    "forget-password":
      "Use the code below to reset your tadan password. The code expires in 5 minutes.",
    "change-email":
      "Use the code below to confirm your new email address. The code expires in 5 minutes.",
  }

  const subject = subjectByType[type]
  const headline = headlineByType[type]
  const bodyHtml = `
<p style="margin:0 0 24px 0;">${bodyByType[type]}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr>
<td style="background-color:#fff7ed;border:2px dashed #fdba74;border-radius:16px;padding:20px 32px;text-align:center;">
<span style="font-family:'SF Mono',Menlo,Monaco,Consolas,monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#ea580c;">${escapeHtml(otp)}</span>
</td>
</tr>
</table>
<p style="margin:24px 0 0 0;font-size:12px;color:#9ca3af;">This code is for ${escapeHtml(email)} and expires in 5 minutes.</p>
`

  const otpBlock = `<div style="background-color:#fff7ed;border:2px dashed #fdba74;border-radius:16px;padding:20px 32px;text-align:center;margin:0 auto;display:inline-block;"><span style="font-family:'SF Mono',Menlo,Monaco,Consolas,monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#ea580c;">${escapeHtml(otp)}</span></div>`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>tadan</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#111827;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:24px;box-shadow:0 10px 40px rgba(0,0,0,0.06);overflow:hidden;">
<tr>
<td style="padding:40px 40px 24px 40px;text-align:center;">
<div style="display:inline-flex;align-items:center;gap:6px;color:#f97316;font-weight:600;font-size:18px;letter-spacing:-0.02em;">
<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z"/></svg>
tadan
</div>
</td>
</tr>
<tr>
<td style="padding:0 40px 16px 40px;">
<h1 style="margin:0;font-size:24px;font-weight:600;color:#111827;letter-spacing:-0.02em;line-height:1.2;">${escapeHtml(headline)}</h1>
</td>
</tr>
<tr>
<td style="padding:0 40px 8px 40px;font-size:14px;color:#4b5563;line-height:1.6;">
<p style="margin:0 0 24px 0;">${bodyByType[type]}</p>
<div style="text-align:center;margin:24px 0;">
${otpBlock}
</div>
<p style="margin:24px 0 0 0;font-size:12px;color:#9ca3af;">This code is for ${escapeHtml(email)} and expires in 5 minutes.</p>
</td>
</tr>
<tr>
<td style="padding:32px 40px 32px 40px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center;">
This email was sent by tadan. If you didn&apos;t request this, you can safely ignore it.
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`

  return {
    subject,
    html,
    text: `Your tadan verification code is: ${otp}\n\nThis code expires in 5 minutes.`,
  }
}
