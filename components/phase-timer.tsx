"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface PhaseTimerProps {
  duration: number // in seconds
  phase: string
  onTimeUp: () => void
  className?: string
}

export function PhaseTimer({ duration, phase, onTimeUp, className = "" }: PhaseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    // Reset timer when phase changes
    setTimeLeft(duration)
    setIsWarning(false)
  }, [phase, duration])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, onTimeUp])

  useEffect(() => {
    // Set warning state when time is running low (less than 20% of total time)
    if (timeLeft <= duration * 0.2 && timeLeft > 0) {
      setIsWarning(true)
    }
  }, [timeLeft, duration])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progress = (timeLeft / duration) * 100

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock
        className={`h-5 w-5 ${
          isWarning ? "text-red-500 animate-pulse" : timeLeft > 0 ? "text-blue-400" : "text-gray-500"
        }`}
      />
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span>{phase}</span>
          <span
            className={`font-mono ${
              isWarning ? "text-red-500 font-bold" : timeLeft > 0 ? "text-white" : "text-gray-500"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isWarning ? "bg-red-500" : "bg-blue-500"
            } rounded-full transition-all duration-1000 ease-linear`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
