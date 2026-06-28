"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [display, setDisplay] = useState(children)
  const [phase, setPhase] = useState<"in" | "out">("in")
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setPhase("out")
      const t = setTimeout(() => {
        setDisplay(children)
        prevPathname.current = pathname
        requestAnimationFrame(() => setPhase("in"))
      }, 200)
      return () => clearTimeout(t)
    }
    setDisplay(children)
    prevPathname.current = pathname
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ${
        phase === "in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {display}
    </div>
  )
}
