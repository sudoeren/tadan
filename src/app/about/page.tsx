import Link from "next/link"
import { ArrowUpRight, Mail, User } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"

export const metadata = {
  title: "About — tadan",
  description:
    "tadan is an ad compliance AI built solo by Eren Çakar. Here's the story, the stack, and how to get in touch.",
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.19 1.78 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56 4.57-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

const CONTACTS = [
  {
    icon: Mail,
    label: "Project",
    value: "tadan@erencakar.com",
    href: "mailto:tadan@erencakar.com",
  },
  {
    icon: User,
    label: "Personal",
    value: "hey@erencakar.com",
    href: "mailto:hey@erencakar.com",
  },
  {
    icon: GitHubIcon,
    label: "Repository",
    value: "github.com/sudoeren/tadan",
    href: "https://github.com/sudoeren/tadan",
    external: true,
  },
  {
    icon: GitHubIcon,
    label: "GitHub",
    value: "github.com/sudoeren",
    href: "https://github.com/sudoeren",
    external: true,
  },
] as const

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <NavBar variant="transparent" />

      <main className="relative z-[1] flex-1 pt-28 sm:pt-32 pb-4 px-5 sm:px-8">
        <article className="mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-medium">
              About
            </p>
            <h1 className="mt-3 flex items-center gap-2 sm:gap-3 text-4xl sm:text-5xl font-normal leading-[1.05] tracking-tight">
              <Logo className="w-9 h-9 sm:w-11 sm:h-11 text-orange-500" />
              <span className="text-orange-500">tadan</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-700 font-medium">
              Built solo by Eren Çakar.
            </p>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-7 sm:p-10 space-y-5 text-[15px] leading-relaxed text-gray-700">
            <p>
              Meet <span className="text-orange-500 font-semibold">tadan</span>. The only policy expert that works weekends. It checks ad copy and landing
              pages against the policies of Meta, Google, Taboola, and TikTok
              and tells you exactly which rules you might be breaking. It
              surfaces safe rewrites that keep your marketing hook intact. Because at the end of the day, tadan exists to make ad compliance suck less - for everyone.
            </p>
            <p>
              The whole product (the policy ingestion pipeline, the embedding
              search, the critic + optimizer agents, and the UI you&apos;re
              looking at) was built and shipped by one person: me, Eren
              Çakar.
            </p>
            <p>
              It&apos;s still early. If something feels rough, that&apos;s on
              me. If you have feedback, especially the painful kind,
              I&apos;d genuinely love to hear it.
            </p>
            <p>
            </p>
          </div>

          <h2 className="mt-12 mb-4 text-[12px] uppercase tracking-[0.2em] text-gray-400 font-medium">
            Get in touch
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {CONTACTS.map((c) => {
              const Icon = c.icon
              const isExternal = "external" in c && c.external
              return (
                <Link
                  key={c.label}
                  href={c.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group rounded-2xl bg-white ring-1 ring-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:ring-orange-200 p-5 transition-all flex items-center gap-3"
                >
                  <div className="shrink-0 text-orange-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      {c.label}
                    </p>
                    <p className="text-[13px] font-medium text-gray-900 truncate">
                      {c.value}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              )
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </Link>
            <div className="flex items-center gap-5">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
