"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Stats", icon: BarChart3, exact: true },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/scans", label: "Scans", icon: FileText, exact: false },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="inline-flex items-center gap-1 bg-gray-200/80 rounded-full p-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all",
              active
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
