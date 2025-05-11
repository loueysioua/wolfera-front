"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserX, Skull } from "lucide-react"

// Player role and status types
type PlayerRole = "villager" | "werewolf" | "seer" | "doctor" | "hunter"
type PlayerStatus = "alive" | "dead"

interface PlayerCardProps {
  player: {
    id: string
    name: string
    avatar: string
    role: PlayerRole
    status: PlayerStatus
    isCurrentPlayer?: boolean
  }
  isSelected: boolean
  isWerewolf: boolean
  onClick: () => void
  isBeingEliminated?: boolean
}

export function PlayerCard({ player, isSelected, isWerewolf, onClick, isBeingEliminated = false }: PlayerCardProps) {
  const [showEliminationAnimation, setShowEliminationAnimation] = useState(false)
  const [isEliminated, setIsEliminated] = useState(player.status === "dead")

  useEffect(() => {
    if (isBeingEliminated && player.status === "alive") {
      setShowEliminationAnimation(true)
      const timer = setTimeout(() => {
        setIsEliminated(true)
        setShowEliminationAnimation(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isBeingEliminated, player.status])

  // Get CSS class for player card based on selection and status
  const getPlayerCardClass = () => {
    let classes = "relative cursor-pointer transition-all transform hover:scale-105"

    if (isEliminated) {
      classes += " opacity-50"
    }

    if (isSelected) {
      classes += " ring-2 ring-red-500 scale-105"
    }

    if (player.isCurrentPlayer) {
      classes += " border-blue-500 border-2"
    }

    return classes
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      animate={
        showEliminationAnimation
          ? {
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -5, 0],
              borderColor: ["rgba(239, 68, 68, 0)", "rgba(239, 68, 68, 1)"],
              boxShadow: [
                "0 0 0 rgba(239, 68, 68, 0)",
                "0 0 20px rgba(239, 68, 68, 0.7)",
                "0 0 0 rgba(239, 68, 68, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 1.5 }}
    >
      <Card className={`${getPlayerCardClass()} bg-gray-900/90 border-gray-700 overflow-hidden`} onClick={onClick}>
        <div className="p-3 text-center">
          <div className="relative mx-auto w-16 h-16 mb-2">
            <Avatar className="w-16 h-16 mx-auto border-2 border-gray-700">
              <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
              <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            {isEliminated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full"
              >
                <UserX className="text-red-500 h-8 w-8" />
              </motion.div>
            )}
            {isWerewolf && player.role === "werewolf" && player.status === "alive" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1"
              >
                <Skull className="h-4 w-4" />
              </motion.div>
            )}
          </div>
          <div className="font-medium truncate">{player.name}</div>
          <div className={`text-xs ${player.status === "alive" ? "text-green-400" : "text-red-400"} font-semibold`}>
            {player.status === "alive" ? "Alive" : "Dead"}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
