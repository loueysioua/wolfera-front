"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BabyIcon as Child, Eye, EyeOff } from "lucide-react"

interface LittleGirlActionProps {
  onComplete: (didPeek: boolean) => void
}

export function LittleGirlAction({ onComplete }: LittleGirlActionProps) {
  const [decision, setDecision] = useState<"peek" | "hide" | null>(null)
  const [peekProgress, setPeekProgress] = useState(0)
  const [caught, setCaught] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (decision === "peek") {
      const interval = setInterval(() => {
        setPeekProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // 20% chance of getting caught
            const isCaught = Math.random() < 0.2
            setCaught(isCaught)
            setShowResult(true)
            return prev
          }
          return prev + 5
        })
      }, 150)

      return () => clearInterval(interval)
    }

    if (decision === "hide") {
      setShowResult(true)
    }
  }, [decision])

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        onComplete(decision === "peek" && !caught)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showResult, decision, caught, onComplete])

  return (
    <div className="fixed inset-0 z-40 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/90 p-6 rounded-xl max-w-md w-full border border-purple-500/50 shadow-lg shadow-purple-500/20"
      >
        <div className="flex items-center justify-center mb-4">
          <Child className="h-8 w-8 text-pink-400 mr-2" />
          <h2 className="text-2xl font-bold text-pink-300">Little Girl's Choice</h2>
        </div>

        {!decision && !showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-center mb-6 text-gray-300">
              The werewolves are awake. Do you want to peek and risk being caught, or stay hidden?
            </p>

            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg font-medium bg-purple-700 text-white hover:bg-purple-600 flex items-center"
                onClick={() => setDecision("peek")}
              >
                <Eye className="w-5 h-5 mr-2" />
                Peek
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center"
                onClick={() => setDecision("hide")}
              >
                <EyeOff className="w-5 h-5 mr-2" />
                Stay Hidden
              </motion.button>
            </div>
          </motion.div>
        )}

        {decision === "peek" && !showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-gray-300 mb-4">You are carefully peeking... Don't get caught!</p>

            <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${peekProgress}%` }}
                className="bg-purple-600 h-4 rounded-full"
              />
            </div>

            <div className="flex justify-center">
              <motion.div
                animate={{
                  rotate: [-5, 5, -5],
                  y: [0, -3, 0],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Child className="h-16 w-16 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            {decision === "peek" && (
              <>
                {caught ? (
                  <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
                    <p className="text-red-400 font-bold text-xl mb-4">You were caught peeking!</p>
                    <p className="text-gray-300 mb-4">The werewolves have seen you. Be careful during the next vote!</p>
                  </motion.div>
                ) : (
                  <motion.div>
                    <p className="text-green-400 font-bold text-xl mb-4">You peeked successfully!</p>
                    <p className="text-gray-300 mb-4">You've gathered valuable information about the werewolves.</p>
                  </motion.div>
                )}
              </>
            )}

            {decision === "hide" && (
              <motion.div>
                <p className="text-blue-400 font-bold text-xl mb-4">You stayed hidden</p>
                <p className="text-gray-300 mb-4">You remained safe but didn't gather any information.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
