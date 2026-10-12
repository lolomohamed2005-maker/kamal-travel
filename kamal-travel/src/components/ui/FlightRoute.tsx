import { useEffect, useRef } from 'react'
import { animate } from 'motion/react'

export function FlightRoute({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const path = pathRef.current
    const trail = trailRef.current
    const plane = planeRef.current
    if (!path || !trail || !plane) return

    const total = path.getTotalLength()

    const controls = animate(0, 1, {
      duration: 7,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1.2,
      onUpdate: (progress) => {
        const point = path.getPointAtLength(progress * total)
        const ahead = path.getPointAtLength(Math.min(total, progress * total + 2))
        const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI
        plane.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`)
        trail.setAttribute('stroke-dasharray', `${progress * total} ${total}`)
      },
    })

    return () => controls.stop()
  }, [])

  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true">
      <defs>
        <pattern id="route-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill="url(#route-dots)" />

      <path
        ref={pathRef}
        d="M330,205 Q250,40 70,62"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
      <path
        ref={trailRef}
        d="M330,205 Q250,40 70,62"
        fill="none"
        stroke="#d65a31"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="0 1000"
      />

      <g>
        <circle cx="330" cy="205" r="14" fill="#d65a31" opacity="0.25">
          <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="330" cy="205" r="5" fill="#d65a31" />
        <text x="330" y="232" textAnchor="middle" fontSize="11" letterSpacing="3" fill="currentColor">
          CAIRO
        </text>
      </g>

      <g>
        <circle cx="70" cy="62" r="14" fill="#2aa7b8" opacity="0.3">
          <animate attributeName="r" values="6;18;6" dur="2.4s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="62" r="5" fill="#2aa7b8" />
        <text x="70" y="90" textAnchor="middle" fontSize="11" letterSpacing="3" fill="currentColor">
          ISTANBUL
        </text>
      </g>

      <g ref={planeRef}>
        <path d="M14,0 L-8,-9 L-4,0 L-8,9 Z" fill="currentColor" />
        <path d="M2,0 L-6,-14 L-3,0 L-6,14 Z" fill="currentColor" opacity="0.7" />
      </g>
    </svg>
  )
}
