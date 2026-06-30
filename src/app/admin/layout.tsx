"use client"

import { NavBar } from "@/components/nav-bar"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="bg-white min-h-screen flex flex-col">
        <NavBar variant="transparent" />
        <div className="pt-24 sm:pt-28 px-5 sm:px-8 pb-4 flex justify-center">
          <AdminNav />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </AdminGuard>
  )
}
