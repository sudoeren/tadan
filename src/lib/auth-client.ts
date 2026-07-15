import { createAuthClient } from "better-auth/react"
import {
  emailOTPClient,
  customSessionClient,
} from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  // `customSessionClient` infers the server-side `customSession` plugin so the
  // client's `useSession()` knows about the `user.isAdmin` boolean the server
  // computes — without ever shipping the admin email list to the browser.
  plugins: [emailOTPClient(), customSessionClient<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient
