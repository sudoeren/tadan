"use client"

import { useEffect, useRef, useState } from "react"

interface ScaledDashboardProps {
  children: React.ReactNode
  designWidth?: number
  className?: string
}

export function ScaledDashboard({
  children,
  designWidth = 896,
  className = "",
}: ScaledDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    const update = () => {
      const containerWidth = container.offsetWidth
      const nextScale = Math.min(1, containerWidth / designWidth)
      setScale(nextScale)
      setHeight(inner.offsetHeight * nextScale)
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(container)

    return () => ro.disconnect()
  }, [designWidth])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: height ? `${height}px` : "auto" }}
    >
      <div
        ref={innerRef}
        style={{
          width: `${designWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  )
}
