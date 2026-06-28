import Link from "next/link"
import { NavBar } from "@/components/nav-bar"

export const metadata = {
  title: "Privacy Policy — tadan",
  description:
    "How tadan collects, uses, and protects your data when you scan ad copy and landing pages for compliance.",
}

const SECTIONS = [
  {
    title: "1. Introduction",
    body: (
      <>
        <p>
          tadan (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) provides an
          AI-powered ad compliance scanner that checks your ad copy and
          landing pages against the policies of major ad platforms. This
          Privacy Policy explains what data we collect, how we use it, and
          the choices you have.
        </p>
        <p>
          By using tadan, you agree to the practices described below. If you
          do not agree, please do not use the service.
        </p>
      </>
    ),
  },
  {
    title: "2. Information We Collect",
    body: (
      <>
        <p>
          <strong>Account data.</strong> When you create an account, we
          collect your name, email, and a hashed password. We never see or
          store your plaintext password.
        </p>
        <p>
          <strong>Scan data.</strong> When you run a compliance scan, we
          store the ad copy or landing page URL you submit, the platforms
          you targeted, the violations we flagged, and the risk score we
          returned. This powers your scan history.
        </p>
        <p>
          <strong>Usage data.</strong> We log basic request metadata (IP
          address, user agent, timestamps) to operate the service, prevent
          abuse, and debug issues.
        </p>
      </>
    ),
  },
  {
    title: "3. How We Use Your Information",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>To run compliance scans and return verdicts to you</li>
        <li>
          To save and display your scan history (only you can access it)
        </li>
        <li>To authenticate you and protect your account</li>
        <li>
          To send essential service emails (sign-in links, security
          alerts) — we do not send marketing email
        </li>
        <li>To respond to support requests you initiate</li>
      </ul>
    ),
  },
  {
    title: "4. Cookies and Local Storage",
    body: (
      <>
        <p>
          <strong>Session cookies.</strong> tadan uses better-auth to manage
          your login session. better-auth sets a single HTTP-only cookie
          containing a signed session token. We do not set any tracking or
          advertising cookies.
        </p>
        <p>
          <strong>Local storage.</strong> We store one flag in your
          browser&apos;s localStorage to remember whether you have signed in
          on this device before. This is used only to route the
          &ldquo;Get started&rdquo; button to the correct page. You can
          clear it at any time from your browser settings.
        </p>
      </>
    ),
  },
  {
    title: "5. Third-Party Services",
    body: (
      <>
        <p>
          To run scans, we forward your ad copy to third-party AI model
          providers (via OpenRouter) and to vector search systems. These
          providers receive only the text you submit — never your account
          data, password, or payment info.
        </p>
        <p>
          We also use a managed Postgres database (with the pgvector
          extension) to store your scans and the policy document embeddings
          our scanner compares against.
        </p>
        <p>
          We do not sell your data. We do not share your scan content with
          other customers. Aggregated, anonymized usage statistics may be
          used to improve the product.
        </p>
      </>
    ),
  },
  {
    title: "6. Data Security",
    body: (
      <p>
        We use industry-standard encryption in transit (HTTPS) and at rest
        (provider-managed disk encryption). Passwords are hashed with
        bcrypt. Access to production data is restricted to a small number
        of team members. That said, no system is 100% secure — if you
        suspect your account has been compromised, contact us immediately.
      </p>
    ),
  },
  {
    title: "7. Your Rights",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Access.</strong> You can view all your scans from the
          History page at any time.
        </li>
        <li>
          <strong>Deletion.</strong> You can delete individual scans, or
          contact us to delete your entire account and all associated data.
        </li>
        <li>
          <strong>Export.</strong> On request, we will export your scan
          history as JSON or CSV.
        </li>
        <li>
          <strong>Correction.</strong> You can update your name and email
          from your account settings.
        </li>
      </ul>
    ),
  },
  {
    title: "8. Children’s Privacy",
    body: (
      <p>
        tadan is not directed to children under 16. We do not knowingly
        collect data from children. If you believe a child has created an
        account, contact us and we will delete it.
      </p>
    ),
  },
  {
    title: "9. Changes to This Policy",
    body: (
      <p>
        We may update this policy as the product evolves. We will post the
        revised version here and update the &ldquo;Last updated&rdquo; date
        below. For material changes, we will notify you by email.
      </p>
    ),
  },
  {
    title: "10. Contact",
    body: (
      <p>
        Questions about this policy or your data? Email us at{" "}
        <a
          href="mailto:privacy@tadan.app"
          className="text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-900"
        >
          privacy@tadan.app
        </a>
        .
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <NavBar variant="transparent" />

      <main className="relative z-[1] pt-28 sm:pt-32 pb-20 px-5 sm:px-8">
        <article className="mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-medium">
              Legal
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Last updated: January 2026
            </p>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-7 sm:p-10 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900">
                  {section.title}
                </h2>
                <div className="mt-3 text-[15px] leading-relaxed text-gray-600 space-y-3">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms of Service →
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}
