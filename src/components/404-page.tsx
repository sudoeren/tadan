"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"

export function NotFoundPage() {
  const router = useRouter()

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
                  404
                </h1>
              </div>

              <div className="mt-[-50px]">
                <h3 className="text-2xl text-gray-900 sm:text-3xl font-bold mb-4 tracking-tight">
                  Looks like you&apos;re lost
                </h3>
                <p className="mb-6 text-gray-600 sm:mb-5 text-[15px]">
                  The page you are looking for is not available!
                </p>

                <Button
                  onClick={() => router.push("/")}
                  className="my-5"
                >
                  Go to Home
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
