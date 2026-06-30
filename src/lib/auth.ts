import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { emailOTP } from "better-auth/plugins/email-otp"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import {
  sendEmail,
  verificationOtpEmail,
  passwordResetEmail,
} from "@/lib/email"

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
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ].filter(Boolean) as string[],
})
