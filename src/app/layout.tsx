import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import Script from "next/script"
import { BackgroundLayer } from "@/components/background-layer"
import "./globals.css"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "tadan - Ad Compliance AI",
  description:
    "Scan ad copy and landing pages against Meta, Google, TikTok, and Taboola policies. Get instant risk scores, violations, and safe alternatives that preserve your marketing hook.",
}

const UMAMI_SRC =
  "https://umami-x7rusnpsmhmu5aj8gy6wfrb2.erencakar.com/script.js"
const UMAMI_WEBSITE_ID = "fcb4e1ef-4b38-44fe-82ae-d4ab82e1102c"

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
      <body className="min-h-screen flex flex-col text-foreground relative isolate">
        <BackgroundLayer />
        {children}
        <Script
          src={UMAMI_SRC}
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
