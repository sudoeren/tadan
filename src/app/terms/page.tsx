import Link from "next/link"
import { NavBar } from "@/components/nav-bar"

export const metadata = {
  title: "Terms of Service — tadan",
  description:
    "The terms and conditions governing your use of tadan, the AI-powered ad compliance scanner.",
}

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: (
      <p>
        By creating an account or using tadan in any way, you agree to
        these Terms of Service. If you do not agree, do not use the
        service. We may update these terms from time to time — continued
        use after changes means you accept the updated terms.
      </p>
    ),
  },
  {
    title: "2. Service Description",
    body: (
      <p>
        tadan scans ad copy and landing pages against the published
        policies of Meta (Facebook + Instagram), Google Ads, and Taboola.
        It returns a risk score, a list of flagged policy violations, and
        suggested compliant rewrites. The output is informational only —
        it is not a guarantee of approval, and we do not submit ads on
        your behalf to any ad platform.
      </p>
    ),
  },
  {
    title: "3. User Accounts",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          You must provide a valid email address and a password of at
          least 8 characters.
        </li>
        <li>
          You are responsible for keeping your credentials secure. We are
          not liable for losses caused by unauthorized access to your
          account.
        </li>
        <li>
          One person per account. Shared or resale use is not permitted
          without written permission.
        </li>
        <li>
          You can delete your account at any time from settings, or by
          emailing us.
        </li>
      </ul>
    ),
  },
  {
    title: "4. Acceptable Use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Submit content that is illegal, defamatory, harassing, or
            infringing on someone else’s intellectual property
          </li>
          <li>
            Attempt to reverse-engineer, scrape, or bulk-extract data from
            the service
          </li>
          <li>
            Use the service to train or fine-tune competing AI models
          </li>
          <li>
            Circumvent rate limits, abuse free-tier quotas, or otherwise
            interfere with the service’s operation
          </li>
          <li>
            Use the service if you are under 16 years old, or are barred
            from using it under applicable law
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Your Content",
    body: (
      <p>
        You retain full ownership of the ad copy, landing pages, and
        rewrite variants you submit. By using tadan, you grant us a
        limited license to process that content for the purpose of
        running the scan and displaying the results to you. We do not use
        your content to train third-party AI models, and we do not share
        it with other customers.
      </p>
    ),
  },
  {
    title: "6. Intellectual Property",
    body: (
      <p>
        The tadan brand, interface, scoring algorithm, and the curated
        policy document set are owned by us. You may not copy, resell, or
        redistribute them without written permission. The underlying
        platform policies (Meta, Google, Taboola) remain the property of
        their respective owners.
      </p>
    ),
  },
  {
    title: "7. Disclaimers",
    body: (
      <p>
        tadan is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We
        do our best to keep the policy database current and the scoring
        accurate, but we make no warranty that the service will be
        uninterrupted, error-free, or that every violation will be
        caught. Ad platform policies change frequently — always review
        the official policy documentation before launching a campaign.
      </p>
    ),
  },
  {
    title: "8. Limitation of Liability",
    body: (
      <p>
        To the maximum extent permitted by law, tadan is not liable for
        any indirect, incidental, special, or consequential damages —
        including lost profits, lost data, or account bans on ad
        platforms — arising from your use of the service. Our total
        liability for any claim will not exceed the amount you paid us in
        the 12 months preceding the claim.
      </p>
    ),
  },
  {
    title: "9. Termination",
    body: (
      <p>
        We may suspend or terminate your account if you breach these
        terms, abuse the service, or if we are required to do so by law.
        You can terminate at any time by deleting your account. Sections
        that by their nature should survive termination — including
        Intellectual Property, Disclaimers, and Limitation of Liability —
        will survive.
      </p>
    ),
  },
  {
    title: "10. Governing Law",
    body: (
      <p>
        These terms are governed by the laws of the jurisdiction in which
        our company is registered, without regard to conflict-of-law
        principles. Any disputes will be resolved in the courts of that
        jurisdiction.
      </p>
    ),
  },
  {
    title: "11. Contact",
    body: (
      <p>
        Questions about these terms? Email us at{" "}
        <a
          href="mailto:legal@tadan.app"
          className="text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-900"
        >
          legal@tadan.app
        </a>
        .
      </p>
    ),
  },
]

export default function TermsPage() {
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
              Terms of Service
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
              href="/privacy"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy Policy →
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
