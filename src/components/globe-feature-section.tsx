"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import createGlobe, { COBEOptions } from "cobe"

import { cn } from "@/lib/utils"

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [40.7128, -74.006], size: 0.04 },
    { location: [51.5074, -0.1278], size: 0.04 },
    { location: [35.6762, 139.6503], size: 0.04 },
    { location: [-23.5505, -46.6333], size: 0.04 },
  ],
  markerElevation: 0,
}

export default function GlobeFeatureSection() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gray-100 px-6 py-14 sm:px-12 sm:py-16 md:px-16 md:py-20">
      <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row">
        <div className="z-10 max-w-xl text-left">
          <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 leading-[1.1] tracking-tight">
            See how{" "}
            <span className="text-orange-500">tadan</span>{" "}
            <span className="text-gray-500">
              runs a compliance scan in under a minute — paste, score, rewrite,
              publish.
            </span>
          </h2>
          <Link
            href="#how-it-works"
            className="group mt-7 inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-black transition-all duration-300"
          >
            <span className="px-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
              See how it works
            </span>
            <span className="w-8 h-8 rounded-full bg-orange-500 text-white inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
        <div className="relative h-[180px] w-full max-w-xl">
          <Globe className="absolute -bottom-20 -right-40 scale-150" />
        </div>
      </div>
    </section>
  )
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)
  const widthRef = useRef(0)
  const phiRef = useRef(0)

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onResize = () => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
    })

    setTimeout(() => (canvasRef.current!.style.opacity = "1"))

    let rafId = 0
    const tick = () => {
      if (pointerInteracting.current === null) {
        phiRef.current += 0.005
      }
      globe.update({ phi: phiRef.current + r })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      globe.destroy()
    }
  }, [config, r])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
