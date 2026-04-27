"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const stages = [
  "hen",
  "egg",
  "crack",
  "chick",
  "grow",
]

export default function FarmLifecycleLoader() {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length)
    }, 900)

    return () => clearInterval(timer)
  }, [])

  const stage = stages[stageIndex]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-40 w-40 flex items-center justify-center">

        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
            transition={{ duration: 0.45 }}
          >
            {renderStage(stage)}
          </motion.div>
        </AnimatePresence>

      </div>

      <p className="text-sm text-muted-foreground animate-pulse tracking-wide">
        Preparing farm data...
      </p>
    </div>
  )
}

function renderStage(stage: string) {
  switch (stage) {
    case "hen":
      return <Hen />

    case "egg":
      return <Egg />

    case "crack":
      return <CrackedEgg />

    case "chick":
      return <Chick />

    case "grow":
      return <GrowingHen />

    default:
      return null
  }
}

/* SVG PARTS */

function Egg() {
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="65" rx="35" ry="45" fill="#fde68a" />
    </svg>
  )
}

function CrackedEgg() {
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="70" rx="35" ry="40" fill="#fde68a" />
      <polyline
        points="40,60 50,50 60,60 70,50 80,60"
        stroke="#92400e"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}

function Chick() {
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <circle cx="60" cy="60" r="30" fill="#facc15" />
      <circle cx="50" cy="55" r="4" fill="#000" />
      <polygon points="65,60 80,65 65,70" fill="#fb923c" />
    </svg>
  )
}

function GrowingHen() {
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="65" rx="35" ry="28" fill="#fef3c7" />
      <circle cx="85" cy="45" r="12" fill="#fef3c7" />
      <circle cx="90" cy="42" r="2.5" fill="#000" />
    </svg>
  )
}

function Hen() {
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="65" rx="40" ry="30" fill="#fef3c7" />
      <circle cx="90" cy="45" r="15" fill="#fef3c7" />
      <circle cx="95" cy="42" r="3" fill="#000" />
      <polygon points="105,45 120,50 105,55" fill="#fb923c" />
      <circle cx="88" cy="30" r="6" fill="#ef4444" />
    </svg>
  )
}