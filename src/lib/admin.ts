import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { isAdminEmail } from "@/lib/admin-shared"

export { isAdminEmail } from "@/lib/admin-shared"

export type AdminGuardResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; status: 401 | 403; error: string }

export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  const email = session.user.email
  if (!isAdminEmail(email)) {
    return { ok: false, status: 403, error: "Forbidden" }
  }

  return { ok: true, userId: session.user.id, email: email! }
}
