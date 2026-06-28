export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 max-w-6xl mx-auto w-full">
      <div className="flex flex-col items-center gap-8 py-24 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Alpha
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ship compliant ads, not banned accounts
          </h1>
          <p className="max-w-lg text-muted-foreground text-lg leading-relaxed">
            Scan your ad copy against Meta, Google, and Taboola policies.
            Get instant risk scores, violations, and safe alternatives that
            preserve your marketing hook.
          </p>
        </div>

        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </a>
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign in
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm">Meta Ads</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm">Google Ads</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-sm">Taboola</span>
          </div>
        </div>
      </div>
    </div>
  )
}
