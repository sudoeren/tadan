import Link from "next/link"

export default function HistoryPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">History</h1>
        <p className="text-sm text-gray-500 mt-1.5">Your past ad compliance scans.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 px-6 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-5">
          <span className="text-xl text-gray-300">&mdash;</span>
        </div>
        <p className="text-[15px] text-gray-500 mb-1">No analyses yet</p>
        <p className="text-sm text-gray-400 mb-6">Run your first compliance scan to see results here.</p>
        <Link
          href="/analyzer"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
        >
          Start scanning
        </Link>
      </div>
    </div>
  )
}
