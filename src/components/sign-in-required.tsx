"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

interface SignInRequiredProps {
  message?: string
}

export function SignInRequired({
  message = "Create a free account to keep scanning ads and landing pages. No credit card required.",
}: SignInRequiredProps) {
  return (
    <div className="relative z-10 min-h-screen bg-white flex flex-col">
      <NavBar />

      <section className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full sm:w-10/12 md:w-8/12 text-center">
              <div
                className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
                aria-hidden="true"
              >
                <h1 className="text-center text-gray-900 text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-semibold tracking-tight">
                  401
                </h1>
              </div>

              <div className="mt-[-50px]">
                <h3 className="text-2xl text-gray-900 sm:text-3xl font-bold mb-4 tracking-tight">
                  Sign in required
                </h3>
                <p className="mb-6 text-gray-600 sm:mb-5 text-[15px] max-w-md mx-auto leading-relaxed">
                  {message}
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold pl-5 pr-1.5 py-1.5 rounded-full hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] transition-all duration-300"
                  >
                    <span className="px-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
                      Create free account
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
