import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { emailOTP } from "better-auth/plugins/email-otp"
import { customSession } from "better-auth/plugins/custom-session"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import {
  sendEmail,
  verificationOtpEmail,
  passwordResetEmail,
} from "@/lib/email"

/**
 * Admin email allow-list. Read from the NON-public `ADMIN_EMAILS` env var so
 * the list is never inlined into client bundles. Both `requireAdmin()` in
 * `admin.ts` and the `customSession` plugin below share this single source of
 * truth via `isAdminEmail()` re-exported from `admin.ts`.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
export { isAdminEmail }

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    camelCase: true,
    schema: {
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const email = passwordResetEmail({
        name: user.name || user.email,
        url,
      })
      await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
    },
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const message = verificationOtpEmail({ email, otp, type })
        await sendEmail({
          to: email,
          subject: message.subject,
          html: message.html,
          text: message.text,
        })
      },
    }),
    // Exposes a server-computed `user.isAdmin` boolean on every session
    // payload (getSession / client useSession) WITHOUT leaking the admin
    // email allow-list to the browser. The list stays server-only.
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
          isAdmin: isAdminEmail(user.email),
        },
        session,
      }
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ].filter(Boolean) as string[],
})
