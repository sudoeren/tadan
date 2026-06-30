"use client"

export default function WhyTadanSection() {
  return (
    <section className="relative z-[2] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
            Why tadan
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-xl mx-auto leading-relaxed">
            Stop losing time, money, and accounts to compliance. One scan,
            every platform.
          </p>
        </div>

        <div className="relative bg-white">
          {/* Big center animation — large pulsing gradient blob */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <div className="w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-orange-300/40 via-rose-200/30 to-amber-200/30 blur-3xl animate-pulse" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2">
            {/* Single vertical line in the middle */}
            <div
              aria-hidden
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300"
            />
            {/* Single horizontal line in the middle */}
            <div
              aria-hidden
              className="hidden md:block absolute left-0 right-0 top-1/2 h-[2px] bg-gray-300"
            />

            {[
              {
                n: "01",
                title: "Stop losing weekends to policy review",
                body: "What used to take a day of cross-referencing four platform docs now takes six seconds. Paste your copy, get a verdict.",
              },
              {
                n: "02",
                title: "Stop getting banned after launch",
                body: "RAG over curated policy rules from Meta, Google, Taboola, and TikTok. Not vibes. Not LLM guessing.",
              },
              {
                n: "03",
                title: "Stop writing sterile ad copy",
                body: "Eight copywriting techniques. Empowerment framing, curiosity hooks, social proof. Safe variants that still convert.",
              },
              {
                n: "04",
                title: "Stop switching between four platform docs",
                body: "One scan covers Meta, Google, and Taboola. Every rule. Every platform. Every variant.",
              },
            ].map((item, i) => (
              <div
                key={item.n}
                className="animate-fade-up p-8 sm:p-10 hover:bg-white/60 transition-colors duration-300"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-mono text-orange-500 mb-3 tracking-tight">
                  {item.n}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
