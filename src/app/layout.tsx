import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NavBar } from "@/components/nav-bar"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "tadan — Ad Compliance AI",
  description:
    "Scan ad copy against Meta, Google, and Taboola policies. Get instant risk scores, violations, and safe alternatives.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
