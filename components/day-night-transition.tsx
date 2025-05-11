"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Skull } from "lucide-react"

type TransitionType = "day-to-night" | "night-to-day" | "elimination" | null

interface DayNightTransitionProps {
  transitionType: TransitionType
  eliminatedPlayer?: {
    name: string
    role: string
  }
  onTransitionComplete: () => void
}

export function DayNightTransition({
  transitionType,
  eliminatedPlayer,
  onTransitionComplete,
}: DayNightTransitionProps) {
  const [isVisible, setIsVisible] = useState(!!transitionType)

  useEffect(() => {
    if (transitionType) {
      setIsVisible(true)
      const timer = setTimeout(
        () => {
          setIsVisible(false)
          setTimeout(onTransitionComplete, 500) // Wait for exit animation to complete
        },
        transitionType === "elimination" ? 3500 : 2500,
      )
      return () => clearTimeout(timer)
    }
  }, [transitionType, onTransitionComplete])

  if (!transitionType) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              transitionType === "day-to-night"
                ? "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(20,20,40,0.95))"
                : transitionType === "night-to-day"
                  ? "linear-gradient(to bottom, rgba(30,30,60,0.9), rgba(60,40,40,0.95))"
                  : "linear-gradient(to bottom, rgba(80,0,0,0.9), rgba(20,0,0,0.95))",
          }}
        >
          {transitionType === "day-to-night" && <NightTransition />}
          {transitionType === "night-to-day" && <DayTransition />}
          {transitionType === "elimination" && eliminatedPlayer && <EliminationTransition player={eliminatedPlayer} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NightTransition() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, y: -100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <Moon className="h-32 w-32 text-blue-200 mb-8" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl font-bold text-blue-100 mb-4"
      >
        Night Falls
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-xl text-blue-200"
      >
        The village sleeps while the werewolves hunt...
      </motion.p>
    </div>
  )
}

function DayTransition() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, y: -100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <Sun className="h-32 w-32 text-yellow-300 mb-8" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl font-bold text-yellow-100 mb-4"
      >
        A New Day Begins
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-xl text-yellow-200"
      >
        The village awakens to discuss the night's events...
      </motion.p>
    </div>
  )
}

function EliminationTransition({ player }: { player: { name: string; role: string } }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Skull className="h-32 w-32 text-red-500 mb-8" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl font-bold text-red-300 mb-4"
      >
        {player.name} Has Been Eliminated!
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-2xl text-white"
      >
        They were a{" "}
        <motion.span
          initial={{ color: "#fff" }}
          animate={{ color: "#ef4444" }}
          transition={{ delay: 2, duration: 0.5 }}
          className="font-bold"
        >
          {player.role}
        </motion.span>
      </motion.div>
    </div>
  )
}
