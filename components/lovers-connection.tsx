"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface LoversConnectionProps {
  player1: {
    id: string
    name: string
    avatar: string
  }
  player2: {
    id: string
    name: string
    avatar: string
  }
  visible: boolean
}

export function LoversConnection({ player1, player2, visible }: LoversConnectionProps) {
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowHearts(true)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setShowHearts(false)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={`M ${player1.id === player2.id ? "0,0" : "M 100,100 L 300,300"}`}
          stroke="#ec4899"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          className="lovers-path"
        />
      </svg>

      {showHearts && (
        <>
          <HeartParticle delay={0} />
          <HeartParticle delay={0.5} />
          <HeartParticle delay={1} />
          <HeartParticle delay={1.5} />
          <HeartParticle delay={2} />
        </>
      )}
    </div>
  )
}

function HeartParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute"
      initial={{
        left: "50%",
        top: "50%",
        scale: 0,
        opacity: 0,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        y: ["-50%", "-150%"],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      }}
    >
      <Heart className="h-6 w-6 text-pink-500" fill="#ec4899" />
    </motion.div>
  )
}
