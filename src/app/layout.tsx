import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { BackgroundLayer } from "@/components/background-layer"
import "./globals.css"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "tadan — Ship compliant ads, not banned accounts",
  description:
    "Scan ad copy and landing pages against Meta, Google, and Taboola policies. Get instant risk scores, violations, and safe alternatives that preserve your marketing hook.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/bb5de19d87c09a95216dc6ccd96e37c6?family=Nimbus+Sans+TW01"
        />
      </head>
      <body className="min-h-screen flex flex-col text-foreground overflow-x-hidden">
        <BackgroundLayer />
        {children}
      </body>
    </html>
  )
}
